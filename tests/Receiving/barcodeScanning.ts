import { BarcodeScanning_without_LPNs } from "../../scenarios/1.14/Receiving/BarcodeScanning_without_LPNs";
import { BackEnd, Dialogs, ItemInventory, Login, Menu, ReceivingOrders } from "../../src/DVU";
import { Init, Keys, UniqueValue } from "../../src/utils";
import { NJTelnet } from "../../src/utils/telnet";


fixture(`BarcodeScanning tests`) .meta({fixtureType: 'UI'})

.beforeEach(async t=>{

   await Init.Load({ 
        CredentialGroup: 'TRIAL',
        // Scenario: {
        //     warehouse: { description: 'Barcode Scanning'}
        // }
        Scenario: BarcodeScanning_without_LPNs
    });
})

test
    .meta( {testType: 'UI', group:'Receiving', area: 'BarcodeScanning', parallel: false}) 
    ('BarcodeScanning without LPN', async t =>{

    /** VARIABLES  */
    const account = 'Automatic Allocation';
    const item = "T-Shirt";
    const location = "Generic1";
    let orderNumber = UniqueValue({text: 'ON01-'});
    const lotCode = 'BLK';
    const subLotCode = 'L';

    // write email, password and select warehouse
    await Login.LoginIn();

    // go to receiving orders
    await Menu.ReceivingOrders.GoTo();

    //Create a new order
    await ReceivingOrders.Toolbar.Insert.SelectValue('Create New Receipt');
    await ReceivingOrders.CreateReceivingOrder.Account.Find.Search(account);
    await ReceivingOrders.CreateReceivingOrder.OrderNumber.SetText(orderNumber);
    await ReceivingOrders.CreateReceivingOrder.Save.Click();

    // add a entry line with qty planned = 5 and qty received = 10
    await ReceivingOrders.CreateReceivingOrder.SideMenu.LineEntries.Click();
    await ReceivingOrders.CreateReceivingOrder.LineEntries.Toolbar.Insert.Click();
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.ItemCode.Search(item);
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.QtyPlanned.Increase(5);
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.LotCode.SetText(lotCode);
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.SublotCode.SetText(subLotCode);
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.Insert.Click();
    await ReceivingOrders.CreateReceivingOrder.Save.Click();

    // change the order status to Received
    await ReceivingOrders.CreateReceivingOrder.SideMenu.General.Click();
    await ReceivingOrders.CreateReceivingOrder.Status.SelectByText('In Process');
    await ReceivingOrders.CreateReceivingOrder.Save.Click();
    await ReceivingOrders.CreateReceivingOrder.CloseDialog.Click();
    const itemStock = await BackEnd.GetItemStockDetail({Item: item, Vendor: account, Warehouse: 'Barcode Scanning', Lot: lotCode, SubLot: subLotCode});
   
    ///////RF /////////
    const RFTelnet = new NJTelnet(true); 
    await RFTelnet.Connect(); // Init telnet conection
    await RFTelnet.Login(); //Login to RF
    await RFTelnet.Send("3"); //Select Receiving
    await RFTelnet.Send("1"); //Select Existing Receipt
    await RFTelnet.Send("1"); //Select By Order Number
    await RFTelnet.Send(orderNumber); //scan Order number
    await RFTelnet.Send('1'); // Select continue
    await RFTelnet.Send(location); // Select Staging Location
    await RFTelnet.Send("3"); // Select Select the Item
    await RFTelnet.Send("10"); // Insert Enter Qty 
    await RFTelnet.Send("1"); // Accept Overage
    await RFTelnet.Send(Keys.ESC);// pres ESC to return to the order
    await RFTelnet.Send("1"); // Accept Overage
    await RFTelnet.Send(Keys.ESC);// pres ESC to exit the order
    await RFTelnet.Send("2");// Select Not Complete the order
    await RFTelnet.Send("m");// back to menu
    await RFTelnet.Send("6");// Logoff
    await RFTelnet.End();   // end telnet session

    // Open the order
    await ReceivingOrders.Table.clickRowByQuery( { rowTitle: 'Order Number', rowValue: orderNumber} );
    await ReceivingOrders.Toolbar.Edit.Click();
    await ReceivingOrders.CreateReceivingOrder.Status.SelectByText('Received');
    await ReceivingOrders.CreateReceivingOrder.Save.Click();

    //Verify that the Over receive dialog is being displayed
    await t.expect(await Dialogs.OverReceived.Exists()).ok('Over Receive Dialog is not displayed');
    await Dialogs.OverReceived.Yes.Click();
    await ReceivingOrders.CreateReceivingOrder.CloseDialog.Click();

    
    //verify 
    await Menu.ItemIventory.GoTo();
    await ItemInventory.Toolbar.Search.Click();
    await ItemInventory.SearchDialog.Account.Find.Search(account);
    await ItemInventory.SearchDialog.Search.Click();
    await t.expect(await ItemInventory.Table.existRowByQuery(
        {rowTitle: 'Item Code', rowValue: item},
        {rowTitle: 'Lot Code', rowValue: lotCode},
        {rowTitle: 'Sublot Code', rowValue: subLotCode},
        {rowTitle: 'Available Qty', rowValue: (itemStock.qtyAvailable + 10).toString()}
    )).ok('the item inventory is incorrect');

});
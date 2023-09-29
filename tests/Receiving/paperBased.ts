import { Paper_based_without_LPNs } from "../../scenarios/1.14/Receiving/Paper_based_without_LPNs";
import { Dialogs, ItemInventory, Login, Menu, ReceivingOrders } from "../../src/DVU";
import { Init, UniqueValue } from "../../src/utils";


fixture(`Paper Based tests`) .meta({fixtureType: 'UI'})

.beforeEach(async t=>{

   await Init.Load({ 
        CredentialGroup: 'TRIAL',
        Scenario: Paper_based_without_LPNs
    });
})

test
.meta({testType: 'UI', area: 'Receiving'}) ('Paper Based without LPN', async t =>{

    /** VARIABLES  */
    
    const account = 'PaperAccount';
    const item = "PaperItem";
    const location = "PaperLocation";
    const orderNumber = UniqueValue({text: 'ON01'});

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
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.QtyReceived.Increase(10);
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.Location.Search(location);
    await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.Insert.Click();
    await ReceivingOrders.CreateReceivingOrder.Save.Click();

    // change the order status to Received
    await ReceivingOrders.CreateReceivingOrder.SideMenu.General.Click();
    await ReceivingOrders.CreateReceivingOrder.Status.SelectByText('Received');
    await ReceivingOrders.CreateReceivingOrder.Save.Click();

    // verify that the over receive alert is displayed
    await t.expect(await Dialogs.OverReceived.IsVisible()).ok("Over receive dialog is not visible");

    //confirm Dialog
    await Dialogs.OverReceived.Yes.Click();
    await ReceivingOrders.CreateReceivingOrder.CloseDialog.Click();
    //Go to Item Inventory tab
    await Menu.ItemInventory.GoTo();
    
    //Search and select the item
    await ItemInventory.Toolbar.Search.Click();
    await ItemInventory.SearchDialog.Account.Find.Search(account);
    await ItemInventory.SearchDialog.ItemCode.SetText(item);
    await ItemInventory.SearchDialog.Search.Click();

    await ItemInventory.Table.clickRowByQuery({rowTitle: 'Item Code', rowValue : item});
    //Click on the View icon
    await ItemInventory.Toolbar.View.Click();

    //Verify that the Locations has the expecte inventory and there is no LPN , lot code and sublot code
    await t.expect(await ItemInventory.Detail.Table.existRowByQuery(
        { rowTitle: 'Location', rowValue: location},
        { rowTitle: 'Available', rowValue: '10' },
        { rowTitle: 'LPN', rowValue: ''},
        { rowTitle: 'Lot Code', rowValue: ''},
        { rowTitle: 'Sublot Code' , rowValue: ''}
    )).ok();

    
    await ItemInventory.Detail.CloseDialog.Click();

});
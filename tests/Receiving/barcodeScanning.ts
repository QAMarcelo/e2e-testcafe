import { Selector, t } from 'testcafe';
import { DVU, Dialogs, ItemInventory, Login, Menu, RF, ReceivingOrders, WEB }  from '../../src/DVU';
import { Init, UniqueValue } from '../../src/utils';
import { itemInventory } from '../../src/davinci-tabs/item-inventory';



fixture(`API tests`)
    .meta({fixtureType: 'API'})

    .beforeEach(async t=>{

       await Init.Load({ 
            CredentialGroup: 'TRIAL',
            Scenario: { 
                warehouse: {description: 'Barcode Scanning'},
                inventoryAdjustment: {
                   
                    itemAdjustment: [{
                        itemCode: 'PaperItem',
                        storageIdentifier: 'PaperLocation',
                        emptyInventory: true,
                    }]
                },
            },
            // Scenario: PutawayScenario,
            //Scenario: Relocate_by_LPN,
            //Scenario: Paper_based_without_LPNs,
        });
    })

    test
    .meta({testType: 'API'}) ('API testing', async t =>{
        /** VARIABLES  */
        const orderNumber = UniqueValue({text: 'ON01'});
        const itemCode = "PaperItem";

        /** TEST STEPS */
        await Login.Email.SetText(WEB.user);
        await Login.Next.Click();

        await Login.Password.SetText(WEB.password);
        await Login.Database.SelectByText(WEB.database);
        await Login.Login.Click()
        
        // if the Select warehouse dialog is displayed then close it
        if( await Dialogs.WareHouse.IsVisible() )
        {
            await Dialogs.WareHouse.selectWarehouse.SelectByText(WEB.warehouse);
            await Dialogs.WareHouse.OK.Click();
            await t.expect(await Dialogs.WareHouse.Exists()).notOk("WareHouse dialog is still displayed");
        }
        // go to receiving orders
        await Menu.ReceivingOrders.GoTo();

        //Create a new order
        await ReceivingOrders.Toolbar.Insert.SelectValue('Create New Receipt');
        await ReceivingOrders.CreateReceivingOrder.Account.Find.Search('PaperAccount');
        await ReceivingOrders.CreateReceivingOrder.OrderNumber.SetText(orderNumber);
        await ReceivingOrders.CreateReceivingOrder.Save.Click();

        // add a entry line with qty planned = 5 and qty received = 10
        await ReceivingOrders.CreateReceivingOrder.SideMenu.LineEntries.Click();
        await ReceivingOrders.CreateReceivingOrder.LineEntries.Toolbar.Insert.Click();
        await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.ItemCode.Search(itemCode);
        await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.QtyPlanned.SetNumber(5);
        await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.QtyReceived.SetNumber(10);
        await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.Location.Search("PaperLocation");
        await ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.Insert.Click();
        await ReceivingOrders.CreateReceivingOrder.Save.Click();

        // change the order status to Received
        await ReceivingOrders.CreateReceivingOrder.SideMenu.General.Click();
        await ReceivingOrders.CreateReceivingOrder.Status.SelectByText('Received');
        await ReceivingOrders.CreateReceivingOrder.Save.Click();

        // verify that the over receive alert is displayed
        await t.expect(await Dialogs.OverReceived.IsVisible()).ok("Over receive dialog is not visible")
        // click No in the overreceive alert
        await Dialogs.OverReceived.No.Click();
        // close over receive dialog
        await ReceivingOrders.CreateReceivingOrder.CloseDialog.Click();

        // go to Item Inventory
        await Menu.ItemIventory.GoTo();
        // list all the item inventory for the account
        await ItemInventory.Toolbar.Search.Click();
        await ItemInventory.SearchDialog.Account.Find.Search('PaperAccount');
        await ItemInventory.SearchDialog.Search.Click();
    
        // Verify that the  inventory was nop updated
        await t.expect(await ItemInventory.Table.existRowByQuery( {rowTitle: 'Item Code', rowValue: 'PaperItem'},
                                                    {rowTitle: 'Available Qty', rowValue: '10'})).notOk('The inventory was updated even when the over receive message was canceled');

        // Go to Receiving orders tab 
        await Menu.ReceivingOrders.GoTo();

        // Open order and change status to received
        await ReceivingOrders.Table.clickRowByQuery( {rowTitle: 'Order Number', rowValue: orderNumber},
                                                     {rowTitle: 'Status', rowValue: 'Open'} );
                                                     
        await ReceivingOrders.Toolbar.Edit.Click();
        await ReceivingOrders.CreateReceivingOrder.Status.SelectByText('Received');
        await ReceivingOrders.CreateReceivingOrder.Save.Click();

        // go to Item Inventory
        await Menu.ItemIventory.GoTo();
        // list all the item inventory for the account
        await ItemInventory.Toolbar.Search.Click();
        await ItemInventory.SearchDialog.Account.Find.Search('PaperAccount');
        await ItemInventory.SearchDialog.Search.Click();
    
        // Verify that the  inventory was nop updated
        await t.expect(await ItemInventory.Table.existRowByQuery( {rowTitle: 'Item Code', rowValue: 'PaperItem'},
                                                    {rowTitle: 'Available Qty', rowValue: '10'})).ok('The inventory was not updated even when the over receive was approved');

        //Log in as admin

        // let RFTelnet = new NJTelnet();
        // await RFTelnet.Connect();
        // await RFTelnet.Login();

        // await RFTelnet.Send("3"); //Receiving
        // await RFTelnet.Send("1"); //Existing Receipt
        // await RFTelnet.Send("1"); //By Order Number
        // await RFTelnet.SelectReceivingOrder("ON015502481", "PaperBase"); // Order 1
        // //await RF.Send("1"); // Continue
        // await RFTelnet.Send("R-Receiving"); // Staging Location
        // await RFTelnet.Send("3"); // Select the Item
        // await RFTelnet.Send("10"); // Enter Qty on LPN
        // await RFTelnet.Send(Keys.ESC);// pres ESC to return to the order
        // await RFTelnet.Send(Keys.ESC);// pres ESC to exit the order
        // await RFTelnet.Send("2");// Complete he order
        // await RFTelnet.Send("m");// Complete he order
        // await RFTelnet.Send("6");// Complete he order
        // await RFTelnet.End();

        //Verify the table has data displayed
        //await t.expect(Selector('tr.k-grid-norecords').exists).notOk("There is no data retreived from the DB!");*/
    });
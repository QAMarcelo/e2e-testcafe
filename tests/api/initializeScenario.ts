import { Selector, t } from 'testcafe';
import { DVU, RF, WEB }  from '../../src/DVU';
import { Init, Keys, UniqueValue } from '../../src/utils';
import { NJTelnet } from '../../src/utils/telnet';
import { Relocate_by_LPN } from '../../scenarios/Regression/GeneralRF/E_RelocatebyLPN';
import { Replenishment } from '../../scenarios/1.14/E_Replenishment';
import { newScenario } from '../../scenarios/newScenario';

fixture(`API tests`)
    .meta({fixtureType: 'API'})

    .beforeEach(async t=>{

       await Init.Load({ 
            //CredentialGroup: 'TRIAL',
            // Scenario: PutawayScenario,
            // Scenario: Relocate_by_LPN,
            Scenario: newScenario,
            Headless: false
        });
    })

    test
    .meta({testType: 'API'}) ('API testing', async t =>{
        
        await DVU.Login.Email.SetText(WEB.user);
        await DVU.Login.Next.Click();

        await DVU.Login.Password.SetText(WEB.password);
        await DVU.Login.Database.SelectByText(WEB.database);
        await DVU.Login.Login.Click();
        
        // if the Select warehouse dialog is displayed then close it
        if( await DVU.Dialogs.WareHouse.IsVisible() )
        {
            await DVU.Dialogs.WareHouse.selectWarehouse.SelectByText("<18> renewal");
            await DVU.Dialogs.WareHouse.OK.Click();
            await t.expect(await DVU.Dialogs.WareHouse.Exists()).notOk("WareHouse dialog is still displayed");
        }

        // //within the menu go to Consolidated Bill of Lading
        await DVU.Menu.ReceivingOrders.GoTo();
        await DVU.ReceivingOrders.Toolbar.Insert.SelectValue('Create New Receipt');
        await DVU.ReceivingOrders.CreateReceivingOrder.Account.Find.Search('renewal');
        await DVU.ReceivingOrders.CreateReceivingOrder.OrderNumber.SetText(UniqueValue({text: 'ON01'}));
        await DVU.ReceivingOrders.CreateReceivingOrder.Save.Click();

        await DVU.ReceivingOrders.CreateReceivingOrder.SideMenu.LineEntries.Click();
        await DVU.ReceivingOrders.CreateReceivingOrder.LineEntries.Toolbar.Insert.Click();
        await DVU.ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.ItemCode.Search('R-Item');
        await DVU.ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.QtyPlanned.SetNumber(10);
        await DVU.ReceivingOrders.CreateReceivingOrder.LineEntries.GeneralPanel.Insert.Click();

        await DVU.ReceivingOrders.CreateReceivingOrder.SideMenu.General.Click();
        await DVU.ReceivingOrders.CreateReceivingOrder.Status.SelectByText('In Process');
        await DVU.ReceivingOrders.CreateReceivingOrder.Save.Click();
        await DVU.ReceivingOrders.CreateReceivingOrder.CloseDialog.Click();

        //Log in as admin
        let RFTelnet = new NJTelnet();
        await RFTelnet.Connect();
        
        await RFTelnet.Send("1");
        await RFTelnet.Send(RF.user);
        await RFTelnet.Send(RF.password); //password
        await RFTelnet.Send("11"); //database
        await RFTelnet.Send("14"); //warehouse
        await RFTelnet.Send("3"); //Receiving
        await RFTelnet.Send("1"); //Existing Receipt
        await RFTelnet.Send("1"); //By Order Number
        await RFTelnet.Send("1"); // Order 1
        //await RF.Send("1"); // Continue
        await RFTelnet.Send("R-Receiving"); // Staging Location
        await RFTelnet.Send("3"); // Select the Item
        await RFTelnet.Send("10"); // Enter Qty on LPN
        await RFTelnet.Send(Keys.ESC);// pres ESC to return to the order
        await RFTelnet.Send(Keys.ESC);// pres ESC to exit the order
        await RFTelnet.Send("2");// Complete he order
        await RFTelnet.Send("m");// Complete he order
        await RFTelnet.Send("6");// Complete he order
        await RFTelnet.End();
        //Verify the table has data displayed
        //await t.expect(Selector('tr.k-grid-norecords').exists).notOk("There is no data retreived from the DB!");
    });
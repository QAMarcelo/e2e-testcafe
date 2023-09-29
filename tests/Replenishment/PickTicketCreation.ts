import { ReplenishmentScenario, ReplenishmentVariables } from '../../scenarios/Regression/Replenishment/ReplenishmentScenario';
import { DVU, Login, Menu } from '../../src/DVU';
import { Init, UniqueValue } from "../../src/utils";
import { NJTelnet } from '../../src/utils/telnet';

const scenario = ReplenishmentScenario;

fixture(`Replenishment`) .meta({fixtureType: 'On Pick ticket Creation'})
    .beforeEach(async t=>{
        await Init.Load({ 
            CredentialGroup: 'TRIAL',
            Scenario: scenario
        });
    })


test.meta( {testType: 'regression', group:'replenishment', area: 'on pick ticket creation', parallel: false}) 
    ('DPD-1996: On Pick Ticket Creation', async t =>{
        /** VARIABLES  */
        const orderNumber = UniqueValue( {text: 'ReplenishmentOrder', suffix:false});
        // write email, password and select warehouse
        await Login.LoginIn();

        await DVU.Menu.WorkOrders.GoTo();
        const rowCount = await DVU.WorkOrders.Table.getRowCounts();

        await DVU.Menu.ShippingOrders.GoTo();
        await DVU.ShippingOrders.Toolbar.Insert.Click();
        await DVU.ShippingOrders.CreateOrder.Account.Find.Search(ReplenishmentVariables.account);
        await DVU.ShippingOrders.CreateOrder.OrderNumber.SetText(orderNumber);
        await DVU.ShippingOrders.CreateOrder.Save.Click();

        await DVU.ShippingOrders.CreateOrder.SideMenu.LineEntries.Click();
        await DVU.ShippingOrders.CreateOrder.LineEntries.Toolbar.Insert.Click();
        await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.ItemCode.Search(ReplenishmentVariables.itemCode, ReplenishmentVariables.itemCode+' EA');
        await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.LotCode.SetText('A');
        await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.SublotCode.SetText('1');
        await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.OrderedQty.Increase(10);

        await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.Insert.Click();
        await DVU.ShippingOrders.CreateOrder.Save.Click();

        await DVU.ShippingOrders.CreateOrder.SideMenu.General.Click();
        await DVU.ShippingOrders.CreateOrder.Status.SelectByText('In Process');
        await DVU.ShippingOrders.CreateOrder.Save.Click();
        await DVU.ShippingOrders.CreateOrder.CloseDialog.Click();

        await DVU.Menu.WorkOrders.GoTo();
        await DVU.WorkOrders.Toolbar.Refresh.Click();
        await t.expect(await DVU.WorkOrders.Table.getRowCounts()).gt(rowCount, 'there is no new WorkOrder when the pick ticket is created');

        const RFTelnet = new NJTelnet(true); 
        await RFTelnet.Connect(); //Init telnet conection
        await RFTelnet.Login();   //Login to RF
        await RFTelnet.Send("5"); //Select WORK ORDERS
        await RFTelnet.Send("1"); //Select EXISTING ORDER
        await RFTelnet.Send("1"); //Select BY ORDER NUMBER
        await RFTelnet.Send("1"); //1 CONTINUE
        await RFTelnet.Send(ReplenishmentVariables.Loc1); //WORK ORDER LOCTN: Rep-Loc1
        await RFTelnet.Send(ReplenishmentVariables.itemCode); //WORK ORDER ITEM CODE: ItemRep
        await RFTelnet.Send('A'); //WORK ORDER LOT CODE: A
        await RFTelnet.Send('1'); //WORK ORDER SUBLOT CO: 1
        await RFTelnet.Send('8'); //WORK ORDER RELOCATE: 8
        await RFTelnet.Send(ReplenishmentVariables.PickFace); //WORK ORDER ITEM CODE: Rep-PF1
        await RFTelnet.Send("1"); //REPLENISMENT COMPLETED PRESS 1 to CONTINUE
        await RFTelnet.End();   // end telnet session

        await DVU.Menu.ItemIventory.GoTo();
        await DVU.ItemInventory.Toolbar.Search.Click();
        await DVU.ItemInventory.SearchDialog.Account.Find.Search(ReplenishmentVariables.account);
        await DVU.ItemInventory.SearchDialog.Search.Click();

        await t.expect(await DVU.ItemInventory.Table.getCellValue(
            {targed: 'Available Qty'},
            {rowTitle: 'Item Code', rowValue: 'ItemRep'},
            {rowTitle: 'UOM', rowValue: 'EA'}
        )).eql('55', 'The replenishment didn\'t relocate the correct amount. Expeacted value = 55');

        await t.expect(await DVU.ItemInventory.Table.getCellValue(
            {targed: 'Available Qty'},
            {rowTitle: 'Item Code', rowValue: 'ItemRep'},
            {rowTitle: 'UOM', rowValue: 'CS:5'}
        )).eql('92', 'The replenishment didn\'t relocate the correct amount. Expected value = 92');


    
});
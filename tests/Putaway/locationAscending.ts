import { PutawayScenario, PutawayVariables } from "../../scenarios/Regression/Putaway/PutawayScenario";
import { DVU, Login, RF } from "../../src/DVU";
import { Init } from "../../src/utils";
import { NJTelnet } from "../../src/utils/telnet";

const scenario = PutawayScenario;

fixture(`Fixture tests`) .meta({fixtureType: 'fixture Type'})

.beforeEach(async t=>{
    await Init.Load({ 
            CredentialGroup: 'TRIAL',
            Scenario: scenario,
            //Headless: true
        });
    })
    
    
    test
    .meta( {ticket: 'DPD-1889', testType: 'regression', group:'putaway', area: 'location Ascending', parallel: false}) 
    ('Style - Item Code', async t =>{
        await Login.LoginIn();

        const RFTelnet =  new NJTelnet(true); 
        await RFTelnet.Connect(); //Init telnet conection

        let screens = await RFTelnet.Login();   //Login to RF
        
        screens = await RFTelnet.Send("3"); //RECEIVING
        screens = await RFTelnet.Send("3"); //PUTAWAY
        screens = await RFTelnet.Send("3"); //BY PIECE/CASE
        //1st Iteration
        screens = await RFTelnet.Send("1"); //SCAN LPN
        screens = await RFTelnet.Send("PA-RCV-00"); //SCAN LPN
        screens = await RFTelnet.Send("WHT"); //SCAN LOT CODE
        screens = await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
        //2nd Iteration
        screens = await RFTelnet.Send("PA-Loc1"); //SCAN LOC: PA-Loc1
        screens = await RFTelnet.Send("1"); //SUCCESS
        //3rd Iteration
        screens = await RFTelnet.Send("PA-RCV-00"); //SCAN LPN
        screens = await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
        screens = await RFTelnet.Send("PA-Loc1"); //SCAN LOC: PA-Loc1
        screens = await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
        screens = await RFTelnet.Send("PA-Loc2"); //SCAN LOC: PA-Loc2
        screens = await RFTelnet.Send("1"); //SUCCESS
        //4th Iteration
        screens = await RFTelnet.Send("PA-RCV-01"); //SCAN LPN
        screens = await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
        screens = await RFTelnet.Send("PA-Loc2"); //SCAN LOC: PA-Loc2
        screens = await RFTelnet.Send("1"); //SUCCESS
        //5th Iteration
        screens = await RFTelnet.Send("PA-RCV-02"); //SCAN LPN
        screens = await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
        screens = await RFTelnet.Send("PA-Loc2"); //SCAN LOC: PA-Loc2
        screens = await RFTelnet.Send("1"); //SUCCESS

        //backend process to bring data from the inventory
        const resultsAfter = await DVU.BackEnd.GetItemInventoryDetail(
            {Item: PutawayVariables.itemCode, Vendor: PutawayVariables.account, Warehouse: PutawayVariables.warehouse}
        );

        await DVU.Menu.InventoryByLPN.GoTo();
        await DVU.InventoryByLPN.Toolbar.Search.Click();
        await DVU.InventoryByLPN.SearchDialog.Account.Find.Search(PutawayVariables.account);
        await DVU.InventoryByLPN.SearchDialog.Search.Click();


        //Verify Location 1 
        await DVU.InventoryByLPN.Table.clickRowByQuery( {rowTitle: 'LPN', rowValue: PutawayVariables.lpnLoc01} )
        await DVU.InventoryByLPN.Toolbar.View.Click();

        await t.expect(await DVU.InventoryByLPN.Detail.Table.getCellValue(
            {targed : 'Available'},
            {rowTitle: 'Storage Location', rowValue: PutawayVariables.Loc1},
            {rowTitle: 'Lot Code', rowValue: 'BLK'},
            {rowTitle: 'Sublot Code', rowValue: 'S'}
        )).eql('5', `${PutawayVariables.Loc1} the expected available qty is 5`);

        await t.expect(await DVU.InventoryByLPN.Detail.Table.getCellValue(
            {targed : 'Available'},
            {rowTitle: 'Storage Location', rowValue: PutawayVariables.Loc1},
            {rowTitle: 'Lot Code', rowValue: 'WHT'},
            {rowTitle: 'Sublot Code', rowValue: 'M'}
        )).eql('15', `${PutawayVariables.Loc1} the expected available qty is 15`);
        //Close dialog
        await DVU.InventoryByLPN.Detail.CloseDialog.Click();

        // Verify Location 2
        await DVU.InventoryByLPN.Table.clickRowByQuery( {rowTitle: 'LPN', rowValue: PutawayVariables.lpnLoc02} )
        await DVU.InventoryByLPN.Toolbar.View.Click();

        await t.expect(await DVU.InventoryByLPN.Detail.Table.getCellValue(
            {targed : 'Available'},
            {rowTitle: 'Storage Location', rowValue: PutawayVariables.Loc2},
            {rowTitle: 'Lot Code', rowValue: 'BLK'},
            {rowTitle: 'Sublot Code', rowValue: 'L'}
        )).eql('5', `${PutawayVariables.Loc2} the expected available qty is 5`);

        await t.expect(await DVU.InventoryByLPN.Detail.Table.getCellValue(
            {targed : 'Available'},
            {rowTitle: 'Storage Location', rowValue: PutawayVariables.Loc2},
            {rowTitle: 'Lot Code', rowValue: 'BLK'},
            {rowTitle: 'Sublot Code', rowValue: 'S'}
        )).eql('12', `${PutawayVariables.Loc2} the expected available qty is 12`);
        //Close dialog
        await DVU.InventoryByLPN.Detail.CloseDialog.Click();

        // Verify Location 3
        await DVU.InventoryByLPN.Table.clickRowByQuery( {rowTitle: 'LPN', rowValue: PutawayVariables.lpnLoc03} )
        await DVU.InventoryByLPN.Toolbar.View.Click();
        const aux = await DVU.InventoryByLPN.Detail.Table.getCellValue(
            {targed : 'Available'},
            {rowTitle: 'Storage Location', rowValue: PutawayVariables.Loc3},
            {rowTitle: 'Lot Code', rowValue: 'WHT'},
            {rowTitle: 'Sublot Code', rowValue: 'L'}
        );
        await t.expect(await DVU.InventoryByLPN.Detail.Table.getCellValue(
            {targed : 'Available'},
            {rowTitle: 'Storage Location', rowValue: PutawayVariables.Loc3},
            {rowTitle: 'Lot Code', rowValue: 'WHT'},
            {rowTitle: 'Sublot Code', rowValue: 'L'}
        )).eql('15', `${PutawayVariables.Loc3} the expected available qty is 15`);
        //Close dialog
        await DVU.InventoryByLPN.Detail.CloseDialog.Click();

        // Verify Location 4
        await DVU.InventoryByLPN.Table.clickRowByQuery( {rowTitle: 'LPN', rowValue: PutawayVariables.lpnLoc04} )
        await DVU.InventoryByLPN.Toolbar.View.Click();

        await t.expect(await DVU.InventoryByLPN.Detail.Table.getCellValue(
            {targed : 'Available'},
            {rowTitle: 'Storage Location', rowValue: PutawayVariables.Loc4},
            {rowTitle: 'Lot Code', rowValue: 'BLK'},
            {rowTitle: 'Sublot Code', rowValue: 'L'}
        )).eql('15', `${PutawayVariables.Loc4} the expected available qty is 15`);
        //Close dialog
        await DVU.InventoryByLPN.Detail.CloseDialog.Click();
    

    });
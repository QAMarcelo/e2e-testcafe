import { PutawayScenario, PutawayVariables } from "../../../scenarios/Regression/Putaway/PutawayScenario";
import { BackEnd, DVU, Login } from "../../../src/DVU";
import { BarcodeScanning_PutawayStyle } from "../../../src/api-folder/businessPartners";
import { Init } from "../../../src/utils";
import { NJTelnet } from "../../../src/utils/telnet";

const scenario = PutawayScenario;

fixture(`Location Ascending - Manual Allocation`) .meta({fixtureType: 'fixture Type'})

.beforeEach(async t=>{
    await Init.Load({ 
            CredentialGroup: 'TRIAL',
            Scenario: scenario,
        });
    })
    
test.meta( { testType: 'regression', group: 'putaway', area: 'location Ascending', parallelizable: false } ) 
('DPD-1889: By Piece/Case - Item Code', async t =>{
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

test.meta( { testType: 'regression', group: 'putaway', area: 'location Ascending', parallelizable: false } ) 
('DPD-1890: By Piece/Case - Item and Lot Code', async t =>{
    
    //from the account update the putawayt style to Item and Lot Code
    let updatedAccount = scenario.businessPartners![0];
    if(updatedAccount?.Attributes?.Barcode_Scanning){
        updatedAccount.Attributes.Barcode_Scanning.Putaway_Style=BarcodeScanning_PutawayStyle.Item_and_LotCode;
    }
    await BackEnd.LoadAccount(updatedAccount!);

    //Login into DVU
    await Login.LoginIn();

    //*******************RF BEGIN *****************/
    // This block will do the Direct putawayt through RF
    const RFTelnet =  new NJTelnet(true); 
    await RFTelnet.Connect(); //Init telnet conection

    await RFTelnet.Login();   //Login to RF
    
    await RFTelnet.Send("3"); //RECEIVING
    await RFTelnet.Send("3"); //PUTAWAY
    await RFTelnet.Send("3"); //BY PIECE/CASE
    await RFTelnet.Send("1"); //SCAN LPN
    //1st Iteration
    await RFTelnet.Send("PA-RCV-00"); //SCAN LPN
    await RFTelnet.Send("WHT"); //SCAN LOT CODE
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc1"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //2nd Iteration
    await RFTelnet.Send("PA-RCV-00"); //SCAN LPN
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc2"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //3rd Iteration
    await RFTelnet.Send("PA-RCV-01"); //SCAN LPN
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc2"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //4th Iteration
    await RFTelnet.Send("PA-RCV-02"); //SCAN LPN
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc4"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //Close RF connection
    await RFTelnet.End();
    //*******************RF END*****************/

    //Go to INventory by LPN
    await DVU.Menu.InventoryByLocation.GoTo();
    await DVU.InventoryByLocation.Toolbar.Search.Click();
    //filter the Inventory by the accouant
    await DVU.InventoryByLocation.SearchDialog.Account.Find.Search(PutawayVariables.account);
    await DVU.InventoryByLocation.SearchDialog.Search.Click();

    //Verify that the locations displayed at inventory By Location shows the correct qtys per Lot and Sublot
    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc1},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'M'}
        )).eql('15', `${PutawayVariables.Loc1} the expected available qty is 15 for Lot=WHT and SubLot=M`);

    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc2},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    )).eql('3', `${PutawayVariables.Loc1} the expected available qty is 3 for Lot=BLK and SubLot=L`);
    
    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc2},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'S'}
        )).eql('17', `${PutawayVariables.Loc1} the expected available qty is 17 for Lot=BLK and SubLot=S`);

    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc3},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    )).eql('15', `${PutawayVariables.Loc1} the expected available qty is 15 for Lot=WHT and SubLot=L`);

    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc4},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    )).eql('17', `${PutawayVariables.Loc4} the expected available qty is 17 for Lot=BLK and SubLot=L`);

    //Verify details for Location 1 
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc1},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'M'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'M'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-01'}
    )).eql('15', `LPN ${PutawayVariables.lpnLoc01} with Lot Code=WHT and Sublot Code=M, should have Available qty=15`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();


    //Verify details Location 2 BLK L
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc2},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-02'}
    )).eql('3', `LPN ${PutawayVariables.lpnLoc02} with Lot Code=BLK and Sublot Code=L, should have Available qty=3`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();

    //Verify details Location 2 BLK S
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc2},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'S'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'S'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-02'}
    )).eql('17', `LPN ${PutawayVariables.lpnLoc02} with Lot Code=BLK and Sublot Code=S, should have Available qty=17`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();


    //Verify details Location 3 WHT L
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc3},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'L'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-03'}
    )).eql('15', `LPN ${PutawayVariables.lpnLoc03} with Lot Code=WHT and Sublot Code=L, should have Available qty=15`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();

    //Verify details Location 4 BLK L
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc4},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-04'}
    )).eql('17', `LPN ${PutawayVariables.lpnLoc04} with Lot Code=BLK and Sublot Code=L, should have Available qty=17`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();
});

test.meta( { testType: 'regression', group: 'putaway', area: 'location Ascending', parallelizable: false } ) 
('DPD-1891: By Piece/Case - Item, Lot and Sublot Code', async t =>{
    
    //from the account update the putawayt style to Item, Lot and SubLot Code
    let updatedAccount = scenario.businessPartners![0];
    if(updatedAccount?.Attributes?.Barcode_Scanning){
        updatedAccount.Attributes.Barcode_Scanning.Putaway_Style=BarcodeScanning_PutawayStyle.Item_lot_and_SublotCode;
    }
    await BackEnd.LoadAccount(updatedAccount!);

    //Login into DVU
    await Login.LoginIn();

    //*******************RF BEGIN *****************/
    // This block will do the Direct putawayt through RF
    const RFTelnet =  new NJTelnet(true); 
    await RFTelnet.Connect(); //Init telnet conection

    await RFTelnet.Login();   //Login to RF
    
    await RFTelnet.Send("3"); //RECEIVING
    await RFTelnet.Send("3"); //PUTAWAY
    await RFTelnet.Send("3"); //BY PIECE/CASE
    await RFTelnet.Send("1"); //SCAN LPN
    //1st Iteration
    await RFTelnet.Send("PA-RCV-00"); //SCAN LPN
    await RFTelnet.Send("WHT"); //SCAN LOT CODE
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc1"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //2nd Iteration
    await RFTelnet.Send("PA-RCV-00"); //SCAN LPN
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc2"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //3rd Iteration
    await RFTelnet.Send("PA-RCV-01"); //SCAN LPN
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc4"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //4th Iteration
    await RFTelnet.Send("PA-RCV-02"); //SCAN LPN
    await RFTelnet.Send("1"); //PRESS 1 TO CONTINUE
    await RFTelnet.Send("PA-Loc4"); //SCAN LOC: PA-Loc1
    await RFTelnet.Send("1"); //SUCCESS
    //Close RF connection
    await RFTelnet.End();
    //*******************RF END*****************/

    //Go to INventory by LPN
    await DVU.Menu.InventoryByLocation.GoTo();
    await DVU.InventoryByLocation.Toolbar.Search.Click();
    //filter the Inventory by the accouant
    await DVU.InventoryByLocation.SearchDialog.Account.Find.Search(PutawayVariables.account);
    await DVU.InventoryByLocation.SearchDialog.Search.Click();

    //Verify that the locations displayed at inventory By Location shows the correct qtys per Lot and Sublot
    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc1},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'M'}
        )).eql('15', `${PutawayVariables.Loc1} the expected available qty is 15 for Lot=WHT and SubLot=M`);
    
    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc2},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'S'}
        )).eql('17', `${PutawayVariables.Loc1} the expected available qty is 17 for Lot=BLK and SubLot=S`);

    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc3},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    )).eql('15', `${PutawayVariables.Loc1} the expected available qty is 15 for Lot=WHT and SubLot=L`);

    await t.expect(await DVU.InventoryByLocation.Table.getCellValue(
        {targed : 'Available Qty'},
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc4},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    )).eql('20', `${PutawayVariables.Loc4} the expected available qty is 20 for Lot=BLK and SubLot=L`);

    //Verify details for Location 1 
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc1},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'M'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'M'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-01'}
    )).eql('15', `LPN ${PutawayVariables.lpnLoc01} with Lot Code=WHT and Sublot Code=M, should have Available qty=15`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();

    //Verify details Location 2 BLK S
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc2},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'S'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'S'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-02'}
    )).eql('17', `LPN ${PutawayVariables.lpnLoc02} with Lot Code=BLK and Sublot Code=S, should have Available qty=17`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();


    //Verify details Location 3 WHT L
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc3},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'WHT'},
        {rowTitle: 'Sublot Code', rowValue: 'L'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-03'}
    )).eql('15', `LPN ${PutawayVariables.lpnLoc03} with Lot Code=WHT and Sublot Code=L, should have Available qty=15`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();

    //Verify details Location 4 BLK L
    await DVU.InventoryByLocation.Table.clickRowByQuery( 
        {rowTitle: 'Location', rowValue: PutawayVariables.Loc4},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'}
    );
    await DVU.InventoryByLocation.Toolbar.View.Click();
    await t.expect(await DVU.InventoryByLocation.Detail.Table.getCellValue(
        {targed: 'Available'},
        {rowTitle: 'Lot Code', rowValue: 'BLK'},
        {rowTitle: 'Sublot Code', rowValue: 'L'},
        {rowTitle: 'LPN', rowValue: 'PA-LPN-04'}
    )).eql('20', `LPN ${PutawayVariables.lpnLoc04} with Lot Code=BLK and Sublot Code=L, should have Available qty=20`);
    await DVU.InventoryByLocation.Detail.CloseDialog.Click();
});
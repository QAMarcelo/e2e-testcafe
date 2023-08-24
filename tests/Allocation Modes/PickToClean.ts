import { PickToCleanScenario } from '../../scenarios/Regression/Allocation Mode/PickToCleanScenario';
import { PickToCleanManual } from '../../scenarios/Regression/Allocation Mode/PickToCleanManual';
import { LocAscNone } from '../../scenarios/Regression/Putaway/LocationAscending.ts/LocAsc_StyleNone';
import { BackEnd, DVU, Login, TestArea, TestGroup, TestType } from '../../src/DVU';

import { Init, Keys, UniqueValue } from "../../src/utils";
import { NJTelnet } from '../../src/utils/telnet';
import { GeneralProperties_AllocationMode } from '../../src/api-folder/businessPartners';

const scenario = PickToCleanScenario

fixture(`Fixture tests`) .meta({fixtureType: 'fixture Type'})
.beforeEach(async t=>{
    await Init.Load({ 
            CredentialGroup: 'TRIAL',
            Scenario: scenario
        });
    })


test
    .meta( {testType: TestType.UI, group:TestGroup.Allocation, area: TestArea.Shipping, parallel: false}) 
    ('Pick to Clean-Automatic', async t =>{
        /** VARIABLES  */
        const account = 'Allocation Account';
        const orderNumber1 = UniqueValue({text: 'ON1-'});
        const orderNumber2 = UniqueValue({text: 'ON2-'});
        const item1 = "Item1"
        const location1 = "Allocation G1";
        const location2 = "Allocation G2";

        const LPN1 = "AllocationLPN-01";
        const LPN2 = "AllocationLPN-02";
        const LPN3 = "AllocationLPN-03";
        const LPN4 = "AllocationLPN-04";
        // write email, password and select warehouse
        await Login.LoginIn();
        // go to shipping orders
        await DVU.Menu.ShippingOrders.GoTo();

        const createOrder =async (vendor, orderNumber, lineEntries : {oQty: number, sQty: number}[], itm) => {
            await DVU.ShippingOrders.Toolbar.Insert.Click();
            await DVU.ShippingOrders.CreateOrder.Account.Find.Search(vendor);
            await DVU.ShippingOrders.CreateOrder.OrderNumber.SetText(orderNumber);
            await DVU.ShippingOrders.CreateOrder.Save.Click();

            await DVU.ShippingOrders.CreateOrder.SideMenu.LineEntries.Click();

            for( const line of lineEntries){
                await DVU.ShippingOrders.CreateOrder.LineEntries.Toolbar.Insert.SelectByIndex(1);
                await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.ItemCode.Search(itm);
                await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.OrderedQty.Increase(line.oQty);
                await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.ShippedQty.Increase(line.sQty);
                await DVU.ShippingOrders.CreateOrder.LineEntries.GeneralPanel.Insert.Click();
            }
            await DVU.ShippingOrders.CreateOrder.SideMenu.General.Click();
            await DVU.ShippingOrders.CreateOrder.Status.SelectByText('In Process');
            await DVU.ShippingOrders.CreateOrder.Save.Click();
            await DVU.ShippingOrders.CreateOrder.CloseDialog.Click()
        }
        
        const inventoryDetail =  await BackEnd.GetItemInventoryDetail(  { Warehouse: 'Barcode Scanning', Vendor: 'Allocation Account', Item: 'Item1' });
        // Create an order ( status in process ) with 1 entry line with Ordered qty = 10 and Shipped Qty = 10
        await createOrder(account, orderNumber1, [{oQty: 10, sQty: 10}], item1);
        // Create an order ( status in process ) with 2 entry lines, 1st with ordered and shipped 1ty = 4 and 2nd line with ordered and shipped qty =3
        await createOrder(account, orderNumber2, [{oQty: 4, sQty: 4}, {oQty: 3, sQty: 3}], item1);
        
        // go to Item Inventory
        await DVU.Menu.ItemIventory.GoTo();
        // filetr the item by the account
        await DVU.ItemInventory.Toolbar.Search.Click();
        await DVU.ItemInventory.SearchDialog.Account.SearchAndSelect(account);
        await DVU.ItemInventory.SearchDialog.Search.Click();

        await DVU.ItemInventory.Table.clickRowByQuery( { rowTitle: 'Item Code', rowValue: item1 } );
        await DVU.ItemInventory.Toolbar.View.Click();
       
        // Verify that the Location1 and lpn1 has the correct qtys in Available and Allocated columns
        let allocated1 = inventoryDetail.find(x=>  x.storageLocation === location1 && x.lpn===LPN1 )?.allocated ?? 0;
        await t.expect(await DVU.ItemInventory.Detail.Table.existRowByQuery(
            { rowTitle:'Location', rowValue: location1 },
            { rowTitle: 'LPN', rowValue: LPN1},
            { rowTitle: 'Available', rowValue: '0'},
            { rowTitle: 'Allocated', rowValue: (allocated1 + 10).toString()},
        )).ok(`Row with location :${location1} and LPN: ${LPN1} do not exist` );

        // Verify that the Location1 and lpn2 has the correct qtys in Available and Allocated columns
        let allocated2 = inventoryDetail.find(x=> x.storageLocation == location1 && x.lpn==LPN2 )?.allocated ?? 0;
        await t.expect(await DVU.ItemInventory.Detail.Table.existRowByQuery(
            { rowTitle:'Location', rowValue:location1 },
            { rowTitle: 'LPN', rowValue: LPN2},
            { rowTitle: 'Available', rowValue:'20'},
            { rowTitle: 'Allocated', rowValue: allocated2.toString()},
        )).ok(`Row with location :${location1} and LPN: ${LPN1} do not exist` );

        // Verify that the Location2 and lpn3 has the correct qtys in Available and Allocated columns
        let allocated3 = inventoryDetail.find(x=> x.storageLocation == location2 && x.lpn==LPN3 )?.allocated ?? 0;
        await t.expect(await DVU.ItemInventory.Detail.Table.existRowByQuery(
            { rowTitle:'Location', rowValue: location2 },
            { rowTitle: 'LPN', rowValue: LPN3},
            { rowTitle: 'Available', rowValue:'0'},
            { rowTitle: 'Allocated', rowValue: (allocated3 + 5).toString()},
        )).ok(`Row with location :${location1} and LPN: ${LPN1} do not exist` );

        // Verify that the Location 2 and lpn4 has the correct qtys in Available and Allocated columns
        let allocated4 = inventoryDetail.find(x=> x.storageLocation == location2 && x.lpn==LPN4 )?.allocated ?? 0;
        await t.expect(await DVU.ItemInventory.Detail.Table.existRowByQuery(
            { rowTitle:'Location', rowValue: location2 },
            { rowTitle: 'LPN', rowValue: LPN4},
            { rowTitle: 'Available', rowValue:'0'},
            { rowTitle: 'Allocated', rowValue: (allocated4 + 2).toString()},
        )).ok(`Row with location :${location1} and LPN: ${LPN1} do not exist` );

        const RFTelnet = new NJTelnet(true); 
        await RFTelnet.Connect(); //Init telnet conection
        await RFTelnet.Login();   //Login to RF
        await RFTelnet.Send("2"); //SHIPPING
        await RFTelnet.Send("1"); //PICK

        const completeOrderPick = async (order, picking: {line:number, location:string, lpn:string, qty: number}[]) => {
            await RFTelnet.Send("1"); //BY ORDER NUMBER
            await RFTelnet.Send(order); //SELECT BY ORDER UMBER
            await RFTelnet.Send('1'); // PICK IN PROCESS - CONTINUE PICKING
            await RFTelnet.Send('1'); // PICK - CONTINUE

            for(const lines of picking){
                await RFTelnet.Send(lines.line.toString()); // PICK - LINE #
                await RFTelnet.Send(lines.location); // PICK - LOCTN 
                await RFTelnet.Send(lines.lpn); // PICK - LPN
                await RFTelnet.Send(item1); // PICK - ITEM
                await RFTelnet.Send(lines.qty.toString()); // PICK - PICK QTY
                await RFTelnet.Send(Keys.ESC);// SCAN PICK TO LOCATION - PRESS ESC
            }
            // ORDER - COMPLETE AND SHIP THE ORDER
            await RFTelnet.Send(Keys.ESC);// SCAN PICK TO LOCATION - PRESS ESC
            await RFTelnet.Send("2");// PICK KIN PROCESS -MARK AS COMPLETED
            await RFTelnet.Send("1"); // SHIP ORDER
            await RFTelnet.Send("1"); // CONTINUE
            await RFTelnet.Send("1"); // SUCESS - CONTINUE
        }

        // Complete the picking process for order 1
        await completeOrderPick(orderNumber1, [   
                {line: 1, location: location1, lpn: LPN1, qty: 3},  // Pick Line 1
                {line: 2, location: location2, lpn: LPN3, qty: 5},  // Pick Line 2
                {line: 3, location: location2, lpn: LPN4, qty: 2}   // Pick Line 3
        ]);

        // Complete the picking process for order 2
        await completeOrderPick(orderNumber2, [
                {line: 1, location: location1, lpn: LPN1, qty: 4},  // PICK Line 1
                {line: 2, location: location1, lpn: LPN1, qty: 3}   // PICK Line 2
        ]);
        await RFTelnet.End();   // end telnet session

        // Close the Detail view
        await DVU.ItemInventory.Detail.CloseDialog.Click();
        // Reopen the detail view with the updated data
        await DVU.ItemInventory.Table.clickRowByQuery( { rowTitle: 'Item Code', rowValue: item1 } );
        await DVU.ItemInventory.Toolbar.View.Click();
        
        // Verify that the Location1 and lpn1 has the correct qtys in Available and Allocated columns
        await t.expect(await DVU.ItemInventory.Detail.Table.existRowByQuery(
            { rowTitle:'Location', rowValue: location1 },
            { rowTitle: 'LPN', rowValue: LPN2},
            { rowTitle: 'Available', rowValue:'20'},
            { rowTitle: 'Allocated', rowValue:'0'},
        )).ok(`Row with location :${location1} and LPN: ${LPN1} do not exist` );;

});


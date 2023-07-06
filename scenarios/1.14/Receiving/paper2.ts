// /*************** IMPORTS ***************/

// import { Receiving_BarcodeScanningStyles } from "../../../src/api-folder/businessPartners";
// import { InventoryAdjustment_Status } from "../../../src/api-folder/inventory";
// import { Item_UOMType } from "../../../src/api-folder/itemSKUS";
// import { WarehouseMode } from "../../../src/api-folder/warehouses";
// import { scenario } from "../../../src/utils";



// /*************** CONSTANS & VARIABLES ***************/
// const uniqueVal = UniqueValue();
// const warehouse =  `Warehouse-${ uniqueVal }`;
// const itemCode = `item1-${ uniqueVal }`;
// const account = `Account1-${ uniqueVal }`;
// const storage1 = `Storage1-${ uniqueVal }`;
// const lpn1 = `LPN1-${ uniqueVal }`;


// /*************** SCENARIO DEFINITION ***************/
// export const newScenario: scenario = {
//     CredentialGroup:'TRIAL', 
//     warehouse: {
//         description: 'WHSE',
//         mode: WarehouseMode.paper
//     },
//     businessPartners:[
//         {
//             Description: 'Account1',
//             Attributes: {
//                 Receiving:{
//                     Barcode_Scanning: true,
//                     Barcode_Scanning_style: Receiving_BarcodeScanningStyles.UPC
//                 }
//             }
//         }
//     ]

// }
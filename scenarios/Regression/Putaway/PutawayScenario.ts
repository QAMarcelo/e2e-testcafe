/*************** IMPORTS ***************/

import { BarcodeScanning_PutawayPrioritization, BarcodeScanning_PutawayStyle, Billing_RenewalStorageMode, GeneralProperties_AllocationMode, Receiving_BarcodeScanningStyles, Shipping_BarcodeScanningStyle } from "../../../src/api-folder/businessPartners";
import { InventoryAdjustment_Status } from "../../../src/api-folder/inventory";
import { Item_UOMType } from "../../../src/api-folder/itemSKUS";
import { UniqueValue, scenario } from "../../../src/utils";


/*************** CONSTANS & VARIABLES ***************/
const warehouse =  `Barcode Scanning`;
const itemCode = `T-Shirt`;
const account = `AutoPutaway`;

const Receive = `PA-RCV`;
const Loc1 = `PA-Loc1`;
const Loc2 = `PA-Loc2`;
const Loc3 = `PA-Loc3`;
const Loc4 = `PA-Loc4`;
const Emtpy5 = `PA-Empty5`;
const Emtpy6 = `PA-Empty6`;



const lpnRCV00 = `PA-RCV-00`;
const lpnRCV01 = `PA-RCV-01`;
const lpnRCV02 = `PA-RCV-02`;

const lpnLoc01 = `PA-LPN-01`;
const lpnLoc02 = `PA-LPN-02`;
const lpnLoc03 = `PA-LPN-03`;
const lpnLoc04 = `PA-LPN-04`;


/*************** SCENARIO DEFINITION ***************/
export const PutawayScenario: scenario = {
    CredentialGroup: "QA",
    warehouse: {
        description: warehouse,
    },
    businessPartners: [
        { // 1st Business Partner
            Vendor: account,
            Description: account,
            Attributes:{
                General_Properties:{
                    allocation_mode: GeneralProperties_AllocationMode.Manual
                },
                Barcode_Scanning: {
                    Putaway_Prioritizaion:BarcodeScanning_PutawayPrioritization.Location_Ascending,
                    Putaway_Style: BarcodeScanning_PutawayStyle.None
                },
                Inventory: {
                    Track_lot_codes: true,
                    Track_Sub_lot_Codes: true
                },
                Shipping:{
                    Barcode_Scanning: true,
                    Barcode_Scanning_Style: Shipping_BarcodeScanningStyle.Line,
                },
                Receiving: {
                    Barcode_Scanning: true,
                    Barcode_Scanning_style: Receiving_BarcodeScanningStyles.Line
                }
             
            }
        }
    ],
    storageLocations: {
        Locations:[
            { // Receive location
                Description: Receive,
                Length: 99999,
                Width: 99999,
                Height: 99999,
                MaxWeight: 999999,
                MaxLPN: 99999,
                
                Vendor: account,
                LocationType:{
                    Receiving_Dock: true,
                    Receiving_Stage:true
                },
                Inventory_Status:{
                    Allow_Damaged: true,
                    Allow_Hold:true,
                    Allow_Quarantine:true
                }
            },
            { // Location1 Location
                Description: Loc1,
                Length: 35,
                Width: 10,
                Height: 50,
                MaxWeight: 4,
                MaxLPN: 2,
                
                Vendor: account,
                LocationType:{
                    Bulk_Storage_Putaway:true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
                Inventory_Status:{
                    Allow_Damaged: true,
                    Allow_Hold:true,
                    Allow_Quarantine:true
                }
            },
            { // Location2 Location
                Description: Loc2,
                Length: 35,
                Width: 10,
                Height: 50,
                MaxWeight: 4,
                MaxLPN: 2,
                
                Vendor: account,
                LocationType:{
                    Bulk_Storage_Putaway:true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
                Inventory_Status:{
                    Allow_Damaged: true,
                    Allow_Hold:true,
                    Allow_Quarantine:true
                }
            },
            { // Location3 Location
                Description: Loc3,
                Length: 35,
                Width: 10,
                Height: 50,
                MaxWeight: 4,
                MaxLPN: 2,
                
                Vendor: account,
                LocationType:{
                    Bulk_Storage_Putaway:true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
                Inventory_Status:{
                    Allow_Damaged: true,
                    Allow_Hold:true,
                    Allow_Quarantine:true
                }
            },
            { // Location4 Location
                Description: Loc4,
                Length: 35,
                Width: 10,
                Height: 50,
                MaxWeight: 4,
                MaxLPN: 2,
                
                Vendor: account,
                LocationType:{
                    Bulk_Storage_Putaway:true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
                Inventory_Status:{
                    Allow_Damaged: true,
                    Allow_Hold:true,
                    Allow_Quarantine:true
                }
            },
            { // Empty5 Location
                Description: Emtpy5,
                Length: 35,
                Width: 10,
                Height: 80,
                MaxWeight: 6,
                MaxLPN: 2,
                
                Vendor: account,
                LocationType:{
                    Bulk_Storage_Putaway:true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
                Inventory_Status:{
                    Allow_Damaged: true,
                    Allow_Hold:true,
                    Allow_Quarantine:true
                }
            },
            { // Empty6 Location
                Description: Emtpy6,
                Length: 35,
                Width: 10,
                Height: 80,
                MaxWeight: 6,
                MaxLPN: 2,
                
                Vendor: account,
                LocationType:{
                    Bulk_Storage_Putaway:true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
                Inventory_Status:{
                    Allow_Damaged: true,
                    Allow_Hold:true,
                    Allow_Quarantine:true
                }
            }
        ]
    },
    items: [
        { // 1st Item
            ItemCode : itemCode, 
            Vendor: account,
            Enabled: true,
            UOM_type: Item_UOMType.Each,
            UOM:{
                Length: 8.99,
                Width: 9.91,
                Height: 9.82,
                GrossLBS: 0.19,
                Pallet_Tie: 5,
                Pallet_High: 4
            }
        }
    ],
    inventoryAdjustment: {
        itemAdjustment: [
            { // | Receiving  | RCV-00 | t-shirt   | WHT | M       | 10
                itemCode: itemCode,
                lpn: lpnRCV00,
                qty: 10,
                emptyInventory: true,
                lot: "WHT",
                sublot: "M",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Receive,
            },
            { // Receiving  | RCV-00 | t-shirt   | BLK | S       | 10
                itemCode: itemCode,
                lpn: lpnRCV00,
                qty: 10,
                lot: "BLK",
                sublot: "S",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Receive,
            },
            { // Receiving  | RCV-01 | t-shirt   | BLK | L       | 3
                itemCode: itemCode,
                lpn: lpnRCV01,
                qty: 3,
                lot: "BLK",
                sublot: "L",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Receive,
            },
            { // Receiving  | RCV-02 | t-shirt   | BLK | L       | 2
                itemCode: itemCode,
                lpn: lpnRCV02,
                qty: 2,
                lot: "BLK",
                sublot: "L",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Receive,
            },
            { // Storage-01 | LPN-01 | t-shirt   | WHT | M       | 5
                itemCode: itemCode,
                lpn: lpnLoc01,
                qty: 5,
                lot: "WHT",
                sublot: "M",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Loc1,
            },
            { // Storage-02 | LPN-02 | t-shirt   | BLK | S       | 7
                itemCode: itemCode,
                lpn: lpnLoc02,
                qty: 7,
                lot: "BLK",
                sublot: "S",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Loc2,
            },
            { // Storage-03 | LPN-03 | t-shirt   | WHT | L       | 15
                itemCode: itemCode,
                lpn: lpnLoc03,
                qty: 15,
                lot: "WHT",
                sublot: "L",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Loc3,
            },
            { // Storage-04 | LPN-04 | t-shirt   | BLK | L       | 15
                itemCode: itemCode,
                lpn: lpnLoc04,
                qty: 15,
                lot: "BLK",
                sublot: "L",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Loc4,
            }
        ]
    },
}
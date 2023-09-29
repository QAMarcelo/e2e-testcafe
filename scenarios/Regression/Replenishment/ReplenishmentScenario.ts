/*************** IMPORTS ***************/
import { GeneralProperties_AllocationMode, Inventory_AllocationMode, Receiving_BarcodeScanningStyles, Shipping_BarcodeScanningStyle, WorkOrders_Modes } from '../../../src/api-folder/businessPartners';
import { InventoryAdjustment_Status } from '../../../src/api-folder/inventory';
import { ItemStorageTypeAPI, Item_UOMType } from '../../../src/api-folder/itemSKUS';
import { OnRelocate_ChangeInventoryStatusAPI, OnRelocate_ConvertUnitOfMeasureAPI } from '../../../src/api-folder/storageLocations';
import { WarehouseMode } from '../../../src/api-folder/warehouses';
import { UniqueValue, scenario } from '../../../src/utils';


/*************** CONSTANS & VARIABLES ***************/
export const ReplenishmentVariables = {
    warehouse :  `AutoBarcodeScanning`,
    itemCode : "ItemRep",
    itemDescription1: "ItemEach",
    itemDescription2: "ItemCase",
    account : "AutoReplenishment",

    reserve : "Rep-RSV",
    Loc1 : "Rep-Loc1",
    Loc2 : "Rep-Loc2",
    PickFace : "Rep-PF1",
    lpn1 : "Rep-LPN1"
}
/*************** SCENARIO DEFINITION ***************/
export const ReplenishmentScenario: scenario = {
    CredentialGroup: "TRIAL",
    warehouse: {
        description: ReplenishmentVariables.warehouse,
    },
    businessPartners: [
        {
            Vendor: ReplenishmentVariables.account,
            Description: ReplenishmentVariables.account,
            Attributes:{
                General_Properties: {
                    allocation_mode: GeneralProperties_AllocationMode.Manual
                },
                Receiving: {
                    Barcode_Scanning: true,
                    Barcode_Scanning_style: Receiving_BarcodeScanningStyles.Line,
                    LPNs: true,
                },
                Inventory: {
                    Allocation_Mode: Inventory_AllocationMode.Primary_Pick1,
                    Track_lot_codes: true, 
                    Track_Sub_lot_Codes: true
                },
                Shipping: {
                    Barcode_Scanning: true,
                    Barcode_Scanning_Style: Shipping_BarcodeScanningStyle.Line
                },
                Work_Orders: {
                    Barcode_Scanning: true,
                    Replenish_on_Pick_Ticket_creation: true,
                }

            }
        }
    ],
    /*storageLocations: {
        Locations:[
            {
                Description: ReplenishmentVariables.Loc1,
                Height: 1000,
                Length: 1000,
                MaxLPN: 1000,
                MaxWeight: 1000,
                Width: 1000,
                Inventory_Status: {
                    Allow_Damaged: false,
                    Allow_Hold: false,
                    Allow_Quarantine: false
                },
                LocationType: {
                    Rack_Storage_Putaway: true,
  
                },
                
                Convert_Unit_of_Measure: OnRelocate_ConvertUnitOfMeasureAPI.Each_Or_Equivalent,
            },
            {
                Description: ReplenishmentVariables.Loc2,
                Height: 1000,
                Length: 1000,
                MaxLPN: 1000,
                MaxWeight: 1000,
                Width: 1000,
                Inventory_Status: {
                    Allow_Damaged: false,
                    Allow_Hold: false,
                    Allow_Quarantine: false
                },
                LocationType: {
                    Rack_Storage_Putaway: true,
          
                },
                Convert_Unit_of_Measure: OnRelocate_ConvertUnitOfMeasureAPI.Do_Not_Change_UOM,
            },
            {
                Description: ReplenishmentVariables.PickFace,
                Height: 1000,
                Length: 1000,
                MaxLPN: 1000,
                MaxWeight: 1000,
                Width: 1000,
                Inventory_Status: {
                    Allow_Damaged: false,
                    Allow_Hold: false,
                    Allow_Quarantine: false
                },
                LocationType: {
                    Rack_Storage_Putaway: true,
                    Pick_Allocation: true,
                },
                Convert_Unit_of_Measure: OnRelocate_ConvertUnitOfMeasureAPI.Each_Or_Equivalent,
            }
        ]
    },*/
    /*items: [
        {
            ItemCode : ReplenishmentVariables.itemCode, 
            Description: ReplenishmentVariables.itemDescription1,
            Vendor: ReplenishmentVariables.account,
            Enabled: true,
            UOM_type: Item_UOMType.Each,
            UOM: {
                Width: 1,
                Length: 1,
                Height: 1,
                GrossLBS: 1,
                Pallet_High: 5,
                Pallet_Tie: 5,

            },
            Replenishment: [
                {
                    auto: true,
                    enabled: true,
                    maxQty: 50,
                    lot: 'A',
                    sublot: '1',
                    replenQty: 40,
                    thresholdQty: 20,
                    warehouse: ReplenishmentVariables.warehouse, 
                    //storageGroup: 'RepGroup',
                }
            ],
            Storage:[
                {
                    Location: ReplenishmentVariables.PickFace,
                    Type: ItemStorageTypeAPI.PrimaryPickLocations,
                    Warehouse: ReplenishmentVariables.warehouse
                }
            ]
            
        },
        {
            ItemCode : ReplenishmentVariables.itemCode, 
            Description: ReplenishmentVariables.itemDescription2,
            Vendor: ReplenishmentVariables.account,
            Enabled: true,
            UOM_type: Item_UOMType.Case,
            UOM: {
                CaseQty:5,
                Length: 5,
                Width: 5,
                Height: 5,
                GrossLBS: 5,
                Pallet_Tie: 1,
                Pallet_High: 5
            }
        }
    ],*/
    inventoryAdjustment: {
        itemAdjustment: [
            {
                emptyInventory: true,
                itemCode: ReplenishmentVariables.itemCode,
                itemDescription: ReplenishmentVariables.itemDescription1,
                lpn: ReplenishmentVariables.lpn1,
                qty: 15,
                lot: 'A',
                sublot: '1',
                status: InventoryAdjustment_Status.available,
                storageIdentifier: ReplenishmentVariables.PickFace,
            },
            {
                emptyInventory: true,
                itemCode: ReplenishmentVariables.itemCode,
                itemDescription: ReplenishmentVariables.itemDescription2,
                lpn: '',
                lot: 'A',
                sublot: '1',
                qty: 100,
                status: InventoryAdjustment_Status.available,
                storageIdentifier: ReplenishmentVariables.Loc1
            }
        ]
    },
}
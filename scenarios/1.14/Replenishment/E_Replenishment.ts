/*************** IMPORTS ***************/
import { GeneralProperties_AllocationMode, Inventory_AllocationMode, Receiving_BarcodeScanningStyles, Shipping_BarcodeScanningStyle, WorkOrders_Modes } from '../../../src/api-folder/businessPartners';
import { InventoryAdjustment_Status } from '../../../src/api-folder/inventory';
import { Item_UOMType } from '../../../src/api-folder/itemSKUS';
import { OnRelocate_ConvertUnitOfMeasureAPI } from '../../../src/api-folder/storageLocations';
import { WarehouseMode } from '../../../src/api-folder/warehouses';
import { UniqueValue, scenario } from '../../../src/utils';


/*************** CONSTANS & VARIABLES ***************/
const identifier = UniqueValue();
const warehouse =  "Automation"; //UniqueValue({text: 'Warehouse'});
const itemCode = "Replenish-Item"; //UniqueValue({text: 'item1'});
const account = "Replenish-Vendor"; //UniqueValue({text: 'Account1'});

const reserve = "Replenish-RSV";//UniqueValue({text:'Storage1'});
const Loc1 = "Replenish-Loc1";//UniqueValue({text:'Storage1'});
const Loc2 = "Replenish-Loc2";//UniqueValue({text:'Storage1'});
const lpn1 = "Replenish-LPN1";//UniqueValue({text: 'LPN1'});


/*************** SCENARIO DEFINITION ***************/
export const Replenishment: scenario = {
    CredentialGroup: "TRIAL",
    warehouse: {
        description: warehouse,
        mode: WarehouseMode.barcodeScanning,
    },
    businessPartners: [
        {
            Vendor: account,
            Description: account,
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
                    Allocation_Mode: Inventory_AllocationMode.Forward_Picking,
                },
                Shipping: {
                    Barcode_Scanning: true,
                    Barcode_Scanning_Style: Shipping_BarcodeScanningStyle.Line
                },
                Work_Orders: {
                    Barcode_Scanning: true,
                    Replenish_on_Pick_Ticket_creation: true,
                    Mode: WorkOrders_Modes.FIFO
                }

            }
        }
    ],
    storageLocations: {
        Locations:[
            {
                Description: reserve,
                Height: 10000,
                Length: 10000,
                MaxLPN: 10000,
                MaxWeight: 10000,
                Width: 10000,
                Inventory_Status: {
                    Allow_Damaged: false,
                    Allow_Hold: false,
                    Allow_Quarantine: false
                },
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Receiving_Dock: true,
                    Receiving_Stage: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                }
            },
            {
                Description: Loc1,
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
            },
            {
                Description: Loc2,
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
    },
    items: [
        {
            ItemCode : itemCode, 
            Vendor: account,
            Enabled: true,
            UOM_type: Item_UOMType.Each,
            Replenishment: [
                {
                    auto: true,
                    enabled: true,
                    maxQty: 15,
                    replenQty: 10,
                    thresholdQty: 10,
                    
                }
            ],
            
        }
    ],
    inventoryAdjustment: {
        itemAdjustment: [
            {
                itemCode: itemCode,
                lpn: lpn1,
                qty: 100,
                status: InventoryAdjustment_Status.available,
                storageIdentifier: "",
            }
        ]
    },
}
import { GeneralProperties_AllocationMode, Receiving_BarcodeScanningStyles, Shipping_BarcodeScanningStyle } from "../../../src/api-folder/businessPartners";
import { InventoryAdjustment_Status } from "../../../src/api-folder/inventory";
import { Item_UOMType } from "../../../src/api-folder/itemSKUS";
import { WarehouseMode } from "../../../src/api-folder/warehouses";
import { UniqueValue, scenario } from "../../../src/utils";

const warehouse = 'auto-testing'; //UniqueValue({text: 'Warehouse'});
const account = 'auto'; //UniqueValue({text: 'Account'});
const item1 = 'AutoItem2'; //UniqueValue({text: 'Item1'});
const item2 = 'AutoItem2'; //UniqueValue({text: 'Item2'});
const storage1 = 'AutoSL1'; //UniqueValue({text: 'Storage1'});
const storage2 = 'AutoSL2'; //UniqueValue({text: 'Storage2'});

const LPN1 = 'auto-LPN01';
const LPN2 = 'auto-LPN02';
const lotCode1 = '400g';
const lotCode2 = '800g';
export const GeneralRFScenario: scenario = {
    warehouse: {
        description: warehouse, 
        enabled: true,
        mode: WarehouseMode.barcodeScanning,
    },

    businessPartners: [
        {
            Enable: true,
            Vendor: account,
            Attributes: {
                General_Properties:  {
                    allocation_mode:GeneralProperties_AllocationMode.Automatic
                },
                Shipping: {
                    Barcode_Scanning: true,
                    Barcode_Scanning_Style: Shipping_BarcodeScanningStyle.Line
                },
                Receiving: {
                    Barcode_Scanning: true,
                    Barcode_Scanning_style: Receiving_BarcodeScanningStyles.Line
                }

            }
        }
    ],
    items: [
        {
            Vendor: account,
            Enabled: true,
            ItemCode: item1,
            UOM_type: Item_UOMType.Each,
        },
        {
            Vendor: account,
            Enabled: true,
            ItemCode: item2,
            UOM_type: Item_UOMType.Case
        }
    ],
    storageLocations: {
        Locations: [
            {
                Description: storage1,
                Height: 99999,
                Length: 99999,
                MaxLPN: 99999,
                MaxWeight: 999999,
                Width: 99999,
            },
            {
                Description: storage2,
                Height: 99999,
                Length: 99999,
                MaxLPN: 99999,
                MaxWeight: 999999,
                Width: 99999,
            }
        ]
    },
    inventoryAdjustment: {
        itemAdjustment: [
            {
                itemCode: item1,
                qty: 100,
                lpn: LPN1,
                status: InventoryAdjustment_Status.available,
                storageIdentifier: storage1,
                lot: lotCode1,
            }
        ]
    }
}
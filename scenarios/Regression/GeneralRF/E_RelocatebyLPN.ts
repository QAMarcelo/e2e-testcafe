import { BillingScheduleType, ChargeCode_Types, ChargeCodes_AssignType, DefaultBilling_ChargeType, DefaultBilling_UOMType, GeneralProperties_AllocationMode, Receiving_BarcodeScanningStyles, Shipping_BarcodeScanningStyle, StorageCharge_Types, StorageCharge_rateAssoc } from "../../../src/api-folder/businessPartners";
import { InventoryAdjustment_Status } from "../../../src/api-folder/inventory";
import { Item_UOMType } from "../../../src/api-folder/itemSKUS";
import { WarehouseMode } from "../../../src/api-folder/warehouses";
import { UniqueValue, scenario } from "../../../src/utils";

//const warehouse = 'auto-testing'; //UniqueValue({text: 'Warehouse'});
//const account = 'Auto'; //UniqueValue({text: 'Account'});
const warehouse = 'Automation';
const account = 'Account-0202216';

const item1 = 'Shirt-0202216'; //'AutoItem2'; //UniqueValue({text: 'Item1'});
const item2 = 'AutoItem2'; //UniqueValue({text: 'Item2'});
const storage1 = 'AutoSL1'; //UniqueValue({text: 'Storage1'});
const storage2 = 'AutoSL2'; //UniqueValue({text: 'Storage2'});

const LPN1 = 'auto-LPN01';
const LPN2 = 'auto-LPN02';
const lotCode1 = 'L'; //'400g';
const lotCode2 = '800g';

export const Relocate_by_LPN: scenario = {
    CredentialGroup: 'TRIAL',
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
                },
                Work_Orders: {
                    Work_Order_Sequence: "WO0202216",
                    Auto_Generate_Word_Orders_Number: true
                }
            },
            
            ChargeCodes:[
                {
                    Code: "Inbound handling per UOM API",
                    Type: ChargeCode_Types.Inbound_Handling_Per_UOM,
                    Description: "Flat Rate Description",
                    GLCode: "GL Coe",
                    Rate: 0,
                    Visible_On_Barcode_Scanning: true,
                    Min: 11,
                    Max: 0,
                    Automatically_add_to_orders: true,
                    //tieredBilling: true,
                    Ranges: [
                        {
                            Rate: 12,
                            From: 10,
                            To: 20
                        }
                    ],
                    AssignChargeCode: ChargeCodes_AssignType.ReceivingCharges,
                    DefaultBilling: [
                        {
                            UOMType: DefaultBilling_UOMType.Each,
                            ChargeType: DefaultBilling_ChargeType.InboundHandling,
                        }
                    ]
                }
            
            ],
            StorageCharges: [
                {
                    Type: StorageCharge_Types.Case_or_Equivalent,
                    Description: "Case or Equivalent",
                    Rate: 1,
                    Per: StorageCharge_rateAssoc.Case_or_Equivalent,
                    BillingSchedules: [
                        {
                            Rate: 1,
                            From: 1,
                            To: 10
                        }
                    ],
                    BillingScheduleType:BillingScheduleType.Quantity_Aging,  
                    DefaultBilling: [
                        {
                            UOMType: DefaultBilling_UOMType.Case
                        }
                    ]
                }
            ],
        }
    ],
    items: [
        {
            Vendor: account,
            Enabled: true,
            ItemCode: item1,
            UOM_type: Item_UOMType.Each,
            UPC: [
                {
                    description: `UPC${lotCode1}${item1}`,
                    upc: `UPC${lotCode1}${item1}`,
                }
            ]
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
            }
        ]
    },
    // inventoryAdjustment: {
    //     itemAdjustment: [
    //         {
    //             itemCode: item1,
    //             qty: 100,
    //             lpn: LPN1,
    //             status: InventoryAdjustment_Status.available,
    //             storageIdentifier: storage1,
    //             lot: lotCode1,
    //         }
    //     ]
    // }
}
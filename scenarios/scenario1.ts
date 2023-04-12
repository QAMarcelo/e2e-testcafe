import {t} from 'testcafe';

import { WarehouseAPI } from '../src/api-folder/warehouses';
import { UniqueValue, scenario } from '../src/utils';
import { BarcodeScanning_PutawayPrioritization, BarcodeScanning_PutawayStyle, ChargeCodeAPI, ChargeCode_Types, GeneralProperties_AllocationMode, Receiving_BarcodeScanningStyles, Shipping_BarcodeScanningStyle, StorageChargeAPI, StorageCharge_Types, attributeAPI } from '../src/api-folder/businessPartners';
import { Item_UOMType } from '../src/api-folder/itemSKUS';
import { InventoryAdjustment_Status } from '../src/api-folder/inventory';


const Account = UniqueValue({ text: "Account"});
const tShirt1 = UniqueValue({ text: 't-Shirt'});
const Receiving = UniqueValue({ text: 'Receiving1'});
const Storage1 = UniqueValue({text: 'Storage1'});
const Storage2 = UniqueValue({text: 'Storage2'});
const Storage3 = UniqueValue({text: 'Storage3'});
const Storage4 = UniqueValue({text: 'Storage4'});
const Empty5 = UniqueValue({text: 'Empty5'});
const Empty6 = UniqueValue({text: 'Empty6'});

const chargeCode1 = UniqueValue({text: 'CCode-FlatRate'});
const cCDescription1 = UniqueValue({text: 'flatRate'});
const chargeCode2 = UniqueValue({text: 'CCode-PerLPN'});
const cCDescription2 = UniqueValue({text: 'PerLPN'});

const sChargeCode1 = UniqueValue({text: 'sChargeCode1'});
const sChargeCode2 = UniqueValue({text: 'sChargeCode2'});
const sCDescription1 = UniqueValue({text: 'Case Or Equivalent'});
const sCDescription2 = UniqueValue({text: 'Per item Value'});
const warehouse : WarehouseAPI = {
    description: 'renewal',
};

const attributes: attributeAPI = {
    Inventory: {
        Track_lot_codes: true,
        Track_Sub_lot_Codes : true
    },
    General_Properties: {
        allocation_mode: GeneralProperties_AllocationMode.Automatic,
    },
    Receiving: {
        Barcode_scanning: true,
        Barcode_Scanning_style: Receiving_BarcodeScanningStyles.UPC,
    },
    Shipping: {
        Barcode_Scanning: true,
        Barcode_scanning_Style: Shipping_BarcodeScanningStyle.UPC_Lookup,
    },
    Barcode_Scanning: {
        Putaway_Prioritizaion: BarcodeScanning_PutawayPrioritization.Least_Occupied,
        Putaway_Style: BarcodeScanning_PutawayStyle.SubLotCode
    }
}

const chargeCode: ChargeCodeAPI[] = 
[
    {   
        Automatically_add_to_orders: true,
        Code: chargeCode1,
        Description: cCDescription1,
        Rate: 10,
        Type: ChargeCode_Types.Flate_Rate,
        Range_From: 0,
        Range_To: 10
    },
    {   
        Automatically_add_to_orders: true,
        Code: chargeCode2,
        Description: cCDescription2,
        Rate: 10,
        Type: ChargeCode_Types.Per_LPN,
        Range_From: 0,
        Range_To: 10
    }
];

const storageCharges: StorageChargeAPI[] = 
[
    {
        Code: sChargeCode1,
        Description:sCDescription1,
        Rate: 10,
        Type: StorageCharge_Types.Case_or_Equivalent,
        Range_From: 1,
        Range_To: 5
    },
    {
        Code: sChargeCode2,
        Description:sCDescription2,
        Rate: 10,
        Type: StorageCharge_Types.Per_item_Volume,
        Range_From: 1,
        Range_To: 5
    },
]

export const PutawayScenario: scenario = {
    warehouse: warehouse,
    businessPartners: 
    [
        {
            Description: Account,
            Attributes: attributes,
            Enable: true,
            ChargeCode: chargeCode,
            StorageCharges: storageCharges 
        }

    ],
    items: [
        {
            Account: Account,
            Enabled: true,
            ItemCode: tShirt1,
            UOM_type: Item_UOMType.Each,
            UOM: {
                GrossLBS:0.19,
                Length: 9.91,
                Width: 8.99,
                Height: 9.81,

                Pallet_High: 4,
                Pallet_Tie:5,
            },
            UPC: [
                {
                    description: "WHTM001",
                    upc: "WHTM001",
                    lotCode: "WHT",
                    subLoteCode: "M"
                },
                {
                    description: "BLKS001",
                    upc: "BLKS001",
                    lotCode: "BLK",
                    subLoteCode: "S"
                },
                {
                    description: "BLKL001",
                    upc: "BLKL001",
                    lotCode: "BLK",
                    subLoteCode: "L"
                },
                {
                    description: "WHTL001",
                    upc: "WHTL001",
                    lotCode: "WHT",
                    subLoteCode: "L"
                }
            ],
        }
    ],
    storageLocations:{
        warehouseId: warehouse,
        account: Account,
        Locations:
        [
            { //Receiving
                Description: Receiving,
                Enabled: true,
                Width: 10000,
                Length: 10000,
                Height: 10000,
                MaxLPN: 10000,
                MaxWeight: 10000,
                Inventory_Status: {
                    Allow_Damaged: true,
                    Allow_Hold: true,
                    Allow_Quarantine: true
                },
                LocationType: {
                    Receiving_Dock: true,
                    Receiving_Stage: true
                },

            },
            { //Storage 1
                Description: Storage1,
                Enabled: true,
                Width: 10,
                Length: 35,
                Height: 50,
                MaxLPN: 2,
                MaxWeight: 4,
                Inventory_Status: {
                    Allow_Damaged: true,
                    Allow_Hold: true,
                    Allow_Quarantine: true
                },
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
            },
            { //Storage 2
                Description: Storage2,
                Enabled: true,
                Width: 10,
                Length: 35,
                Height: 50,
                MaxLPN: 2,
                MaxWeight: 4,
                Inventory_Status: {
                    Allow_Damaged: true,
                    Allow_Hold: true,
                    Allow_Quarantine: true
                },
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
            },
            { //Storage 3
                Description: Storage3,
                Enabled: true,
                Width: 10,
                Length: 35,
                Height: 50,
                MaxLPN: 2,
                MaxWeight: 4,
                Inventory_Status: {
                    Allow_Damaged: true,
                    Allow_Hold: true,
                    Allow_Quarantine: true
                },
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
            },
            { //Storarge 4
                Description: Storage4,
                Enabled: true,
                Width: 10,
                Length: 35,
                Height: 50,
                MaxLPN: 2,
                MaxWeight: 4,
                Inventory_Status: {
                    Allow_Damaged: true,
                    Allow_Hold: true,
                    Allow_Quarantine: true
                },
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
            },
            { //Empty 5
                Description: Empty5,
                Enabled: true,
                Width: 10,
                Length: 35,
                Height: 80,
                MaxLPN: 2,
                MaxWeight: 5,
                Inventory_Status: {
                    Allow_Damaged: true,
                    Allow_Hold: true,
                    Allow_Quarantine: true
                },
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
            },
            { //Empty 6
                Description: Empty6,
                Enabled: true,
                Width: 10,
                Length: 35,
                Height: 50,
                MaxLPN: 2,
                MaxWeight: 4,
                Inventory_Status: {
                    Allow_Damaged: true,
                    Allow_Hold: true,
                    Allow_Quarantine: true
                },
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true
                },
            }
        ]
    },
    inventoryAdjustment: {
        warehouse: warehouse,
        itemAdjustment: [
            {  // WJT M 10 -> LPN-00
                itemCode : tShirt1,
                lpn: "LPN-00",
                qty: 10,
                lot: "WHT",
                sublot: "M",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Receiving,
            },
            {  // BLK S 10 -> LPN-00
                itemCode : tShirt1,
                lpn: "LPN-00",
                qty: 10,
                lot: "BLK",
                sublot: "S",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Receiving
            },
            {  // BLK L 5 -> LPN-00
                itemCode : tShirt1,
                lpn: "LPN-00",
                qty: 5,
                lot: "BLK",
                sublot: "L",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Receiving
            },
            {  // WHT M 5 -> LPN-01
                itemCode : tShirt1,
                lpn: "LPN-01",
                qty: 5,
                lot: "WHT",
                sublot: "M",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Storage1
            },
            {  // BLK S 7 -> LPN-02
                itemCode : tShirt1,
                lpn: "LPN-02",
                qty: 7,
                lot: "BLK",
                sublot: "S",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Storage2
            },
            {  // WHT L 15 -> LPN-03
                itemCode : tShirt1,
                lpn: "LPN-03",
                qty: 15,
                lot: "WHT",
                sublot: "L",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Storage3
            },
            {  // BLK L 15 -> LPN-04
                itemCode : tShirt1,
                lpn: "LPN-04",
                qty: 15,
                lot: "BLK",
                sublot: "L",
                status: InventoryAdjustment_Status.available,
                storageIdentifier: Storage4
            },
        ]
    }

}


import { GeneralProperties_AllocationMode, Inventory_AllocationMode, Shipping_BarcodeScanningStyle } from "../../../src/api-folder/businessPartners"
import { InventoryAdjustment_Status } from "../../../src/api-folder/inventory"
import { Item_UOMType } from "../../../src/api-folder/itemSKUS"
import { scenario } from "../../../src/utils"

const WarehouseDescription = 'Barcode Scanning';

export const PickToCleanScenario : scenario ={

    warehouse: { description: WarehouseDescription},
    businessPartners: [
        {
            Description: 'Allocation Account',
            Attributes: {
                Shipping: {
                    Barcode_Scanning: true,
                    Barcode_Scanning_Style: Shipping_BarcodeScanningStyle.Line
                },
                Inventory: {
                    Allocation_Mode: Inventory_AllocationMode.Pick_to_clean
                },
                General_Properties: {
                    allocation_mode: GeneralProperties_AllocationMode.Automatic
                }
                
            }
        },
    ],
    storageLocations: {
        Locations:[
            {
                Description: 'Allocation G1',
                Account: 'Allocation Account',
                Height: 99999,
                MaxWeight: 99999,
                Length: 99999,
                MaxLPN: 99999,
                Width: 99999,
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Receiving_Dock: true,
                    Receiving_Stage: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true,
                },
                Enabled: true,
            },
            {
                Description: 'Allocation G2',
                Account: 'Allocation Account',
                Height: 99999,
                MaxWeight: 99999,
                Length: 99999,
                MaxLPN: 99999,
                Width: 99999,
                LocationType: {
                    Bulk_Storage_Putaway: true,
                    Pick_Allocation: true,
                    Project: true,
                    Rack_Storage_Putaway: true,
                    Receiving_Dock: true,
                    Receiving_Stage: true,
                    Shipping_Dock: true,
                    Shipping_Stage: true,
                },
                Enabled: true,
            }
        ]
    },
    items: [
        {
            ItemCode: 'Item1',
            UOM_type: Item_UOMType.Each,
            Vendor: "Allocation Account",
            UOM: {
                Height: 1,
                Length: 1,
                Width: 1,
                GrossLBS: 1,
                Pallet_Tie: 4,
                Pallet_High: 5
            }
        }
    ],
    inventoryAdjustment: {
        vendor: 'Allocation Account',
        itemAdjustment: [
            {
                emptyInventory: true,
                itemCode: 'Item1',
                itemDescription: 'Item1',
                status: InventoryAdjustment_Status.available,
                lpn: 'AllocationLPN-01',
                storageIdentifier: 'Allocation G1',
                qty: 10
            },
            {
                itemCode: 'Item1',
                itemDescription: 'Item1',
                status: InventoryAdjustment_Status.available,
                lpn: 'AllocationLPN-02',
                storageIdentifier: 'Allocation G1',
                qty: 20
            },
            {
                itemCode: 'Item1',
                itemDescription: 'Item1',
                status: InventoryAdjustment_Status.available,
                lpn: 'AllocationLPN-03',
                storageIdentifier: 'Allocation G2',
                qty: 5
            },
            {
                itemCode: 'Item1',
                itemDescription: 'Item1',
                status: InventoryAdjustment_Status.available,
                lpn: 'AllocationLPN-04',
                storageIdentifier: 'Allocation G2',
                qty: 2
            }
        ]
    },
    storageGroups: [
        {
            name: "ReplenishGroup",
            storageLocations: [ 
                "Allocation G1",
                "Allocation G2",
                "Allocation G3",
                "Allocation G4",
            ],
            warehouse: WarehouseDescription
        }
    ]
}
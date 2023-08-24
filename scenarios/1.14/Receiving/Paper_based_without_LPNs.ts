/*************** IMPORTS ***************/
import { Item_UOMType } from "../../../src/api-folder/itemSKUS";
import { scenario } from "../../../src/utils";


/*************** CONSTANS & VARIABLES ***************/
const warehouse =  `PaperBase`;
const itemCode = `PaperItem`;
const account = 'PaperAccount';
const storage1 = `PaperLocation`;

/*************** SCENARIO DEFINITION ***************/
export const Paper_based_without_LPNs: scenario = {
    CredentialGroup: 'TRIAL',
    warehouse: {
        description: warehouse,
        //mode: WarehouseMode.paper,
    },
    businessPartners: [
        {
            Description: account,
            Attributes: {
                Receiving: {
                    LPNs: false,
                },
            },
        }
    ],
    storageLocations: {
        
        Locations: [
            {
                Description: storage1,
                Length: 100,
                Width: 100,
                Height: 100,
                MaxWeight: 100,
                MaxLPN: 1,
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
            ItemCode: itemCode,
            UOM_type: Item_UOMType.Each,
            Vendor: account,
            Enabled: true,
            UOM: {
                Height: 10,
                Length: 10,
                Width: 10,
                GrossLBS: 10,
                Pallet_Tie: 4,
                Pallet_High: 5
            }
        }
    ],
    inventoryAdjustment: {
        itemAdjustment: [
            {
                itemCode: itemCode,
                emptyInventory: true,
            }
        ],
        warehouse: {
            description: warehouse,
            //mode: WarehouseMode.paper,
        },
    }
}
/*************** IMPORTS ***************/

import { GeneralProperties_AllocationMode } from "../../../src/api-folder/businessPartners";
import { InventoryAdjustment_Status } from "../../../src/api-folder/inventory";
import { Item_UOMType } from "../../../src/api-folder/itemSKUS";
import { UniqueValue, scenario } from "../../../src/utils";



/*************** CONSTANS & VARIABLES ***************/

const warehouse =  `PaperBase`;
const itemCode = `PaperItem`;
const account = 'PaperAccount';
const storage1 = `PaperLocation`;
const lpn1 = `LPN1`;


/*************** SCENARIO DEFINITION ***************/
export const Paper_based_without_LPNs: scenario = {
    CredentialGroup: 'TRIAL',
    warehouse: {
        description: warehouse
    },
    businessPartners: [
        {
            Description: account,
            Attributes: {
                General_Properties: {
                    allocation_mode: GeneralProperties_AllocationMode.Automatic
                },
                Receiving: {
                    LPNs: true
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
                MaxLPN: 1
            }
        ]
    },
    items: [
        {
            ItemCode: itemCode,
            UOM_type: Item_UOMType.Each,
            Vendor: account,
            UOM: {
                Height: 10,
                Length: 10,
                Width: 10,
                GrossLBS: 10
            }
        }
    ]
}
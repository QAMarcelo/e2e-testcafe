/*************** IMPORTS ***************/
import { InventoryAdjustment_Status } from '../src/api-folder/inventory';
import { Item_UOMType } from '../src/api-folder/itemSKUS';
import { UniqueValue, scenario } from '../src/utils';


/*************** CONSTANS & VARIABLES ***************/
const uniqueVal = UniqueValue();
const warehouse =  `Warehouse-${uniqueVal}`;
const itemCode = `item1-${uniqueVal}`;
const account = `Account1-${uniqueVal}`;
const storage1 = `Storage1-${uniqueVal}`;
const lpn1 = `LPN1-${uniqueVal}`;


/*************** SCENARIO DEFINITION ***************/
export const newScenario: scenario = {
    CredentialGroup: 'TRIAL',
    warehouse: {
        description: warehouse
    },
    businessPartners: [
        {
            Vendor: account,
            Description: account,
        }
    ],
    storageLocations: {
        Locations:[
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
    items: [
        {
            ItemCode : itemCode, 
            Vendor: account,
            Enabled: true,
            UOM_type: Item_UOMType.Each
        }
    ],
    inventoryAdjustment: {
        itemAdjustment: [
            {
                itemCode: itemCode,
                lpn: lpn1,
                qty: 100,
                status: InventoryAdjustment_Status.available,
                storageIdentifier: storage1,
            }
        ]
    },
}
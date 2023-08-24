import { t } from "testcafe";

//API
import { BusinessPartnerAPI } from '../api-folder/businessPartners';
import { StorageLocationsAPI } from "../api-folder/storageLocations";
import { InventoryAdjustmentsAPI } from '../api-folder/inventory';
import { ItemAPI } from "../api-folder/itemSKUS";
import { API, SetAPICredentials, SetRFCredentials, SetUICredentials, DVU, WEB, RF } from "../DVU";
import { APIClass  } from "../api-folder/APIClass";
import { WarehouseAPI } from "../api-folder/warehouses/warehousesAPI";
import { CredentialLanguage, iUserCredentials } from "./helpers";
import { SequenceAPI } from "../api-folder/Sequences/SequenceAPI";
import { UserAPI } from "../api-folder/users/userAPI";
import { UserGroupAPI } from "../api-folder/userGroup";
import { warehouse } from "../page-object";
//import { SelectDatabaseByText, SelectWarehouseByText } from "./telnet";

export interface iCredentials{
    user: string, 
    password: string,
    database: string,
    warehouse: string,//WarehouseAPI,
    url: string,
    version: string,
    license: string,
    port: string,
    authorization: string,
    language: CredentialLanguage,
    type: string,
}

export interface initArgs{
    CredentialGroup? : string,
    Credentials?: {
        UI?: iUserCredentials,
        RF?: iUserCredentials,
        API?: iUserCredentials,
    }
    Scenario?: scenario,
    Headless?: boolean
}

/**
 * scenario create a complete scenario using a full list of parameters
 * 
 * @example  warehouse: {description: 'warehouseX', mode: WarehouseMode.barcodeScanning},
 * @param warehouse Edit/Create a warehouse
 * @param businessPartners Find/Create a lists of accounts
 * @param storageLocations Find/Create a lists of StorageLocations
 * @param Items Find/Create a lists of Items
 * @param IventoryAdjustment Adjust the inventory 
 */
export interface scenario {
    /**
     * @abstract This credential group has priority over the credential group in the testing object scenario
     */
    CredentialGroup? : string,
    /**
     * @example warehouse: {description: 'warehouseX', mode: WarehouseMode.barcodeScanning},
     */
    warehouse?: WarehouseAPI,
    businessPartners? : BusinessPartnerAPI[],
    storageLocations? : StorageLocationsAPI,
    items?: ItemAPI[],
    inventoryAdjustment?: InventoryAdjustmentsAPI,
    sequences?: SequenceAPI[],
    users?: UserAPI[],
    userGroups?: UserGroupAPI[],
}

class Initializer {

    public async Load(args: initArgs): Promise<void>{
        await this.LoadScenario(args);
        await this.loadURL(args);
        await this.Login(args);
    }

    //load the url from args or the pipeline variable
    private async loadURL(args: initArgs): Promise<void>{
       
        await t.navigateTo(WEB?.url);
        // if(args.Headless!=undefined && args.Headless==true ){
            
        // }

        // if(!args.Headless || !args.Headless ){ // authenticate without going throught the login page by injecting cookies
        //     //TODO
        // }else{ //authenticate going throught the login page
            
        //     //Localhost is displaying an error, adding if statement to handle it
        //     //one that the local environment works like qa then this statement should be removed
        //     if (await DVU.Dialogs.Error.IsVisible()){
        //         await DVU.Dialogs.Error.OK.Click();
        //     }
        // }
    }

    private async Login(args: initArgs): Promise<void>{

    }
    
        public async LoadScenario(args: initArgs): Promise<void> {
            
            const credentialGroup : string | undefined =  args.CredentialGroup ?? args?.Scenario?.CredentialGroup; 
            SetUICredentials(credentialGroup, args?.Credentials?.UI);
            SetRFCredentials(credentialGroup, args?.Credentials?.RF);
            SetAPICredentials(credentialGroup, args?.Credentials?.API);
            
            RF.warehouse = args?.Scenario?.warehouse?.description ?? RF.warehouse;
            API.warehouse = args?.Scenario?.warehouse?.description ?? API.warehouse;
            WEB.warehouse = args?.Scenario?.warehouse?.description ?? WEB.warehouse;

            // const aux = await SelectDatabaseByText('bstevens');
            // const warehouse = await SelectWarehouseByText('Automation');

            if(args?.Scenario){
                const APICall = InitAPI();

                const whResp = await APICall.getWarehouse(args.Scenario);
                if(!whResp) throw new Error(`Error: the warehouse ${args.Scenario?.warehouse?.description} was not correcly udpated/saved`);

                const bpResp = await APICall.getVendors(args.Scenario);
                if(args.Scenario.businessPartners && bpResp.length != args.Scenario.businessPartners.length) throw new Error(`Error: not all the accounts were created/updated`);

                const sLocationResponse = await APICall.getStorageLocations(args.Scenario, whResp.id!);
                if(args.Scenario.storageLocations && sLocationResponse.length != args.Scenario.storageLocations?.Locations?.length) throw new Error(`Error: not all the Storage Locations were created/updated`);

                const itemsResponse =  await APICall.getItems(args.Scenario); 
                if(args.Scenario.items && itemsResponse.length != args.Scenario.items?.length) throw new Error(`Error: not all the items were created/updated`);

                const invAdjResponse = await APICall.getInventoryAdjustment(args.Scenario, whResp?.id!);
                if(!invAdjResponse) throw new Error(`Error: not all the inventory adjustment were created/updated`);

                const seqResponse = await APICall.getSequences(args.Scenario);
            if(args.Scenario.sequences && seqResponse.length != args.Scenario.sequences?.length) throw new Error(`Error: not all the sequences were saved`);
        }

        
    }

    //private InitAPI 
}
export const InitAPI = (url: string|undefined = undefined, headers:{}|undefined = undefined): APIClass => {

    const call = new APIClass( );
    call.setBaseURL(url?? (`${API.url}:${API.port}/${API.version}/${API.license}/${API.database}`));
    call.setHeaders(headers?? {
        'Authorization': API.authorization,
        'Content-Type': 'application/json'
    })
        // `${API.url}:${API.port}/${API.version}/${API.license}/${API.database}`,
        // {
        //     'Authorization': API.authorization,
        //     'Content-Type': 'application/json'
        // }
    //);
    return call;
}

export let Init = new Initializer();

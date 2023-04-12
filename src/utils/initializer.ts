import { t } from "testcafe";

//API
import { BusinessPartnerAPI } from '../api-folder/businessPartners';
import { StorageLocationsAPI } from "../api-folder/storageLocations";
import { InventoryAdjustmentAPI, InventoryAdjustmentsAPI } from '../api-folder/inventory';
import { ItemAPI, Item_UOMType } from "../api-folder/itemSKUS";
import { API, SetAPICredentials, SetRFCredentials, SetUICredentials, DVU, WEB } from "../DVU";
import { APIClass, APIMethods } from "../api-folder/APIClass";
import { WarehouseAPI } from "../api-folder/warehouses/warehousesAPI";
import { iUserCredentials } from "./helpers";
import { iWarehouseAPI } from "../api-folder/interfaces/iWarehouseAPI";
import { iBusinessPartnerAPI } from "../api-folder/interfaces/iBusinessPartnerAPI";

 
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
    language: string,
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
    UILogin?: boolean
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
     * @example warehouse: {description: 'warehouseX', mode: WarehouseMode.barcodeScanning},
     */
    warehouse: WarehouseAPI,
    businessPartners : BusinessPartnerAPI[],
    storageLocations? : StorageLocationsAPI,
    items?: ItemAPI[],
    inventoryAdjustment?: InventoryAdjustmentsAPI
    
}

class Initializer {

    //load the url from args or the pipeline variable
    private async loadURL(args: initArgs): Promise<void>{
       
       
        await t.navigateTo(WEB?.url);

        
        if(!args.UILogin || !args.UILogin ){ // authenticate without going throught the login page by injecting cookies
            //TODO
        }else{ //authenticate going throught the login page
           
            //Localhost is displaying an error, adding if statement to handle it
            //one that the local environment works like qa then this statement should be removed
            if (await DVU.Dialogs.Error.IsVisible()){
                await DVU.Dialogs.Error.OK.Click();
            }
        }
    }

    private async Login(args: initArgs): Promise<void>{
        

    }
    
    public async LoadScenario(args: initArgs): Promise<void> {
        
        SetUICredentials(args?.CredentialGroup, args?.Credentials?.UI);
        SetRFCredentials(args?.CredentialGroup, args?.Credentials?.RF);
        SetAPICredentials(args?.CredentialGroup, args?.Credentials?.API);

        //console.log(`${API.url}:${API.port}/${API.version}/${API.license}/${API.database}`);

        if(args?.Scenario){
            const call = new APIClass(
                `${API.url}:${API.port}/${API.version}/${API.license}/${API.database}`,
                {
                    'Authorization': API.authorization,
                    'Content-Type': 'application/json'
                }
            );
            let whResp;
            whResp = await call.getWarehouse(args.Scenario.warehouse);
            //whResp =  callWHResponse['data'];
            console.log(`Warehouse = ${whResp? 'Success' : 'Error'}`)
            
            let bpResp: iBusinessPartnerAPI[] = [];
            bpResp = await call.getVendors(args.Scenario.businessPartners);
           
            const scenarioBPCount = args.Scenario.businessPartners.length;
            const bpCountResp = bpResp.length;
            console.log(`Business Partners accounts expected: ${scenarioBPCount} ; business partner created/existing ${bpCountResp}`);
            
            let sLocationResponse: StorageLocationsAPI[] = [{Locations: []}];
            sLocationResponse.pop();
            if(args.Scenario.storageLocations){
                sLocationResponse = await call.getStorageLocations(args.Scenario.storageLocations, whResp.id!);
                console.log("Storage Locations =" + sLocationResponse);
            }

            let itemsResponse: ItemAPI[] = [{Account: '', ItemCode: '', UOM_type: Item_UOMType.Each}];
            itemsResponse.pop();
            if(args.Scenario.items){
                itemsResponse = await call.getItems(args.Scenario.items); 
                console.log("Items  =" + itemsResponse);
            }
            
            let invAdjResponse: InventoryAdjustmentAPI[];
            if(args.Scenario.inventoryAdjustment){
                invAdjResponse = await call.getInventoryAdjustment(args.Scenario.inventoryAdjustment, whResp?.id!);
                console.log("inventory Adjustment =" + invAdjResponse['status']);
            }
        }
    }

    private async searchVendor(account: string) : Promise<string> {
        const urlWParams = `/bps?type=1&pageOffset=10&description=${account}&enabled=1&sortColumn:description`;
        return await this.API(urlWParams, APIMethods.GET);
      
    }
    private baseURL: string;
    private headers: { };

    public async Load(args: initArgs): Promise<void>{
        await this.LoadScenario(args);
        await this.loadURL(args);
        await this.Login(args);
    }

    private async getSession(): Promise<string>{
        var axios = require('axios');
        var result = "";
        var config = {
            method: APIMethods.POST,
            url: this.baseURL+"/session",
            headers: this.headers,
            //data : `{ "email": ${t.ctx.user}, "password": ${t.ctx.password}}`
            data: `{ "email": "${API.user}", "password": "${API.password}" }`,
        };

        await axios(config)
        .then(function (response) {
           result= response.data['sessionId'];
        })
        .catch(function (error) {
            console.log(error);
        });
        return result;
    }

    
    public API = async(url: string, method: APIMethods, data: {}={}, params: {}={})=>{
        var axios = require('axios');
        var result = "";
        
        if(!t.ctx.Session){
            t.ctx.Session = await this.getSession();
            console.log(t.ctx.Session);
        }
        console.log(this.baseURL + "/" + t.ctx.Session + url)
        var config = {
            method: method,
            url: this.baseURL + "/" + t.ctx.Session + url,
            params: params,
            headers: this.headers,
            data : data,
            
        };

        await axios(config)
        .then(function (response) {
            //console.log(response.data);
            result = response;
        })
        .catch(function (error) {
            console.log(error.data);
        });
        return result;
    }
  
}

export let Init = new Initializer();

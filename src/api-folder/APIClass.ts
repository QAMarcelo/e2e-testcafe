
import { t } from 'testcafe';
import { LoadItemData, LoadStorageLocationsData, LoadVendorData, LoadWarehouseData } from './APIHelper/APIHelper';
import { BusinessPartnerAPI } from './businessPartners';
import { iIventoryAdjustmentAPI } from './interfaces/iItemAPI';

import { InventoryAdjustmentAPI, InventoryAdjustment_Status, InventoryAdjustmentsAPI } from './inventory';
import { ItemAPI, Item_UOMType, UPCAPI } from './itemSKUS';
import { StorageLocationsAPI } from './storageLocations';
import { WarehouseAPI } from './warehouses';
import { API, RF, WEB } from '../DVU';
import { iBusinessPartnerAPI } from './interfaces/iBusinessPartnerAPI';
import { iWarehouseAPI } from './interfaces/iWarehouseAPI';
import { iUser } from './interfaces/iUser';
import { UserAPI, UserWarehouseAPI } from './users/userAPI';


export enum APIMethods {
    POST = 'POST',
    GET = 'GET',
    PUT= 'PUT',
    DELETE = 'DELETE'
}

export interface APIParams {
    Url: String, 
    method: APIMethods, 
    data?: {}, 
    params?: {}
}

export class APIClass {

    private baseURL: string;
    private headers: { };
    constructor(baseURL: string, headers: {}){
        this.baseURL = baseURL; 
        this.headers = headers;
    }
  

    public getWarehouse = async(warehouse: WarehouseAPI): Promise<WarehouseAPI> => {
        let whResponse;
        const existsWarehouse = await this.searchWarehouse(warehouse.description);
        let flag : boolean= false;
        let whLoaded: iWarehouseAPI;
        //Verify if the request was succesful
        if(existsWarehouse['status']==200){
            // if the response has some data
            if(existsWarehouse['data'].length>0)
            {
                const whs: iWarehouseAPI[] = existsWarehouse["data"];
                //reach the desired warehouse
                whs.forEach(async whdata => {
                    if(whdata.description == warehouse.description)
                    {
                        //update the warehouse if there is data to update
                        whLoaded = LoadWarehouseData(warehouse, whdata);
                        flag = true;
                        return;
                    }
                });
                let response;
                if(flag) {
                    //send the request to update the warehouse
                    response = await this.Call({Url:'/whses', method: APIMethods.PUT, data: whLoaded!});
                    whResponse = response['data'];       
                }
            }
            else{
                //if the warehouse doesn't exist, create one
                if(existsWarehouse['data'] !=''){
                    //load the data
                    whLoaded = LoadWarehouseData(warehouse);
                    try {
                        //call the endpoint to create the Warehouse
                        whResponse = await this.Call({Url: '/whses', method: APIMethods.POST, data: whLoaded})['data'];
                    } catch (error) {
                        throw new Error("API-Create Warehouse(POST) : error, Was not able to create the warehouse")
                    }
                    
                    //update the users QA1, RF1 and API1, make them able to read/write the recently created warehouse
                    
                    await this.assignUsersToWarehouse(whResponse['data'][0].id!)
                }else{
                    throw new Error("Warehouse: data is empty");
                }
            }
        }
        await this.assignUsersToWarehouse(whResponse['id']);
        return whResponse;
    }
    
    public assignUsersToWarehouse = async(warehouseId : number):Promise<void> =>{
        
        const WEBUser : iUser = await this.searchUsers(WEB.user);
        const RFUser : iUser = await this.searchUsers(RF.user);
        const APIUser : iUser = await this.searchUsers(API.user);

        //******* the web user has access to the new Warehouse if it is new */
        let Flag : boolean| undefined;
        
        let WEBResponse;
        if(!WEBUser.warehouses?.some(warehouse=>{ return warehouse.warehouseId == warehouseId; })){
            WEBUser.warehouses?.push({ userId: WEBUser.id, warehouseId });
            WEBResponse = await this.updateUsers(WEBUser);
        }

        //******* the RF user has access to the new Warehouse if it is new */
        let RFResponse;
        if(!RFUser.warehouses?.some(warehouse=>{ return warehouse.warehouseId == warehouseId; })){
            RFUser.warehouses?.push({ userId: RFUser.id, warehouseId });
            RFResponse = await this.updateUsers(RFUser);
        }

        //******* the API user has access to the new Warehouse if it is new */
        let APIResponse;
        if(!APIUser.warehouses?.some(warehouse=> {return warehouse.warehouseId == warehouseId; })){
            APIUser.warehouses?.push({ userId: APIUser.id, warehouseId });
            APIResponse = await this.updateUsers(APIUser);
        }
    }

    public searchUsers = async(user: string):Promise<iUser> => {
        let result: iUser = {};
       
        const userResponse = await this.Call({Url:`/users/ui?email=${user}&enabled=1&enable=0`,method: APIMethods.GET});
        const listUsers : iUser[] = userResponse['data'];

        listUsers.forEach(usr => {
            if(usr.email == user || usr.description==user){
                result = usr;
                return;
            }
        });
        
        const data = await this.Call({Url: `/users/${result.id}`, method: APIMethods.GET});
        result = data['data'];
        return result;
    }

    public updateUsers = async(User: iUser):Promise<iUser> => {
        let userResponse: iUser = {};
        const response = await this.Call({Url:`/users`, method: APIMethods.PUT, data: User});
        if(response['status']==200){
            userResponse = response['data'];
        }
        return userResponse;
    } 


    public getVendors = async (businessPartners: BusinessPartnerAPI[]): Promise<iBusinessPartnerAPI[]> => {

        let bpResponse : iBusinessPartnerAPI[] = [{}];
        bpResponse.pop();

        for await (const vendor of businessPartners) {
            let bpLoaded : iBusinessPartnerAPI = {};
            const existVendor = await this.searchVendor(vendor.Description ?? vendor.AccountId!);

            if(existVendor){
                const updatedVendor = LoadVendorData(vendor, existVendor);
                bpResponse.push( updatedVendor );
            }else{
                bpLoaded = LoadVendorData(vendor);
                bpResponse.push(await this.Call({Url:'/bps', method: APIMethods.POST, data: bpLoaded})['data']);
            }
            // if(existVendor['status']==200) {
            //     if(existVendor['data'].length > 0) {
            //         existVendor['data'].forEach((account:iBusinessPartnerAPI)  => 
            //             {
            //             if(account.accountid?.toLowerCase()===vendor.AccountId || account.description?.toLowerCase()===vendor.Description){
            //                 bpResponse.push(existVendor['data'][0]);
            //                 return;
            //             }
            //         });
            //     } else {
            //         bpLoaded = LoadVendorData(vendor);
            //         bpResponse.push(await this.Call({Url:'/bps', method: APIMethods.POST, data: bpLoaded})['data']);
            //     }
            // }
        }
        return bpResponse;
    }
    public updateVendors = async (businessPartner: BusinessPartnerAPI): Promise<BusinessPartnerAPI> =>{
        let account : BusinessPartnerAPI = {};
        
        return account;
    }

    public getStorageLocations = async(storageLocations: StorageLocationsAPI, warehouseId: number): Promise<StorageLocationsAPI[]> => {
        
        let sLocationResponse : StorageLocationsAPI[] = [{Locations:[]}];
        sLocationResponse.pop();
        // sLocationResponse.pop();
        if(storageLocations){

            for await (const sLocation of storageLocations.Locations) {
                
                const searchStorageLocation = await this.searchStorageLocation(sLocation.Description, warehouseId);
                if(searchStorageLocation['status']==200){
                    if(searchStorageLocation['data'].length>0){
                        const locationR = searchStorageLocation['data'][0] as StorageLocationsAPI;
                        sLocationResponse.push(locationR);
                    }else{
                        var slLoaded = LoadStorageLocationsData(sLocation);
                        slLoaded.warehouseId = sLocation.WarehouseId ?? (storageLocations.warehouseId?.id ?? warehouseId) ;

                        sLocation.Account = sLocation.Account ?? storageLocations.account;
                        if(sLocation.Account)
                        {
                            const vendor: iBusinessPartnerAPI | undefined = await this.searchVendor(sLocation.Account);
                            if(vendor){
                                slLoaded.vendors = [{
                                    //id: Number.parseInt((await this.searchVendor(sLocation.Account))["data"][0]["id"]),
                                    id: vendor.id,
                                    accountid: sLocation.Account,
                                    description: sLocation.Account,
                                }];
                            }
                        }
                        if(!slLoaded.storageId) {
                            slLoaded.storageId = slLoaded.description;
                        }
                        const response = await this.Call({Url: "/storage", method: APIMethods.POST, data: slLoaded});
                        if(response['status']==200){
                            sLocationResponse.push(response['status'][0] as StorageLocationsAPI);
                        }
                    }
                }
            }
        }
        return sLocationResponse;
    }

    public getItems = async(items: ItemAPI[]) : Promise<ItemAPI[]> => {
        let itemsResponse: ItemAPI[] = [{Account: '', ItemCode: '', UOM_type: Item_UOMType.Case}];
        itemsResponse.pop();
        for await (const item of items) {
            //item.Account = "0302868-Account";
            const vendor = await this.searchVendor(item.Account);
            item.AccoundId  = vendor?.id;

            // item.AccoundId = Number.parseInt((await this.searchVendor(item.Account))["data"][0]["id"]);
            //item.AccoundId = Number.parseInt((await this.searchVendor("0302868-Account"))[0]["id"]);

            item.ItemCode = item.ItemCode ?? item.Description;
            item.Description = item.Description ?? item.ItemCode;
            var itemLoaded = LoadItemData(item);
            
            const itemResponse = await this.Call({Url: "/items", method: APIMethods.POST, data: itemLoaded});
            if(itemResponse['status']==200){
                const itemObject: ItemAPI = itemResponse['data']; 
                itemsResponse.push(itemResponse['data'] as ItemAPI);

                let upcResponse: UPCAPI[] = [{description: '', upc: ''}];
                upcResponse.pop();

                if(item.UPC) {
                    // const upcLoaded = loadUPCData(item.UPC);
                    // for await (const upc of upcLoaded) {
                    // upc.itemId = Number.parseFloat(itemResponse["data"]["id"]);
                    //     //const upcList = await this.API("/itemupc", APIMethods.GET);
                    //     upcResponse.push(await this.API("/itemupc", APIMethods.POST, upc));
                    // }
                }
            }else{
                throw new Error(`Error: item API response status : ${itemLoaded.description} => ${itemResponse['status']}`);
            }
        }
        
        return itemsResponse;
    }

    public getInventoryAdjustment = async(inventoryAdjustment: InventoryAdjustmentsAPI, warehouseId: number) : Promise<InventoryAdjustmentAPI[]> => {
        let invAdjustResponse: InventoryAdjustmentAPI[] = [{itemCode: '', lpn: '', qty: 0, status: InventoryAdjustment_Status.available, storageIdentifier: ''}];
        invAdjustResponse.pop();
        //const uri = `/whses/${warehouseId}/inv/adjustment`;
        for await (const invA of inventoryAdjustment.itemAdjustment) {
            //const itemUri = `/items?itemCode=${invA.itemCode}`;
            const whId = inventoryAdjustment.warehouse?.id ?? (invA.warehouseId ?? warehouseId);
            const itemId = (await this.searchItem(invA.itemCode))["data"][0]["id"];
            const storageId = (await this.searchStorageLocation(invA.storageIdentifier, whId!))["data"][0]["id"];
            const invAdjLoaded : iIventoryAdjustmentAPI = {
                itemId: itemId,
                lot: invA.lot,
                lpn: invA.lpn,
                qty: invA.qty,
                status: invA.status,
                storageId: storageId,               
                sublot: invA.sublot
            }
            const whsesUri = `/whses/${whId}/inv/adjustment`;
            const invAdjsCall = await this.Call({Url: whsesUri, method: APIMethods.POST, data: invAdjLoaded});
            if(invAdjsCall['status']){
                const invAdjResponse: InventoryAdjustmentAPI = invAdjsCall['data'];
                invAdjustResponse.push( invAdjResponse );
            }
        }
        return invAdjustResponse;
    }

    public Call = async( ApiParams: APIParams )=>{
        var axios = require('axios');
        var result = "";
        
        if(t.ctx.Session==undefined){
            t.ctx.Session = await this.getSession();
        }
        var config = {
            method: ApiParams.method,
            url: this.baseURL + "/" + t.ctx.Session + ApiParams.Url,
            params: ApiParams.params,
            headers: this.headers,
            data : ApiParams.data
        };

        console.log(config.url);
        try{
        await axios(config)
        .then(function (response) {
            result = response;
        })
        .catch(function (error) {
            console.log('error = ' + error);
        });
        }
        catch(e){
            console.log(e);
        }
        return result;
    }

    private async getSession(): Promise<string>{
        var axios = require('axios');
        var result = "";
        var config = {
            method: APIMethods.POST,
            url: this.baseURL+"/session",
            headers: this.headers,
            data : `{ "email": "${API.user}", "password": "${API.password}"}`
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

    private async searchWarehouse(warehouse: string) : Promise<{}> {
        const urlWHParams = `/whses?description=${warehouse}&enabled=1&enabled=0`;
        return await this.Call({Url: urlWHParams, method: APIMethods.GET})
    }
    private async searchVendor(account: string) : Promise<iBusinessPartnerAPI|undefined> {
        const urlWParams = `/bps?type=1&pageOffset=10&description=${account}&enabled=1&enabled=0&sortColumn:description`;
        const vendorsResponse = await this.Call({Url: urlWParams, method: APIMethods.GET});
        let vendor: iBusinessPartnerAPI | undefined = undefined;
        if(vendorsResponse['status']==200){
            const vendorsList: iBusinessPartnerAPI[] = vendorsResponse['data'];
            vendorsList.forEach(value => {
                if(value.description == account){
                    vendor = value;
                }
            });
        }else{
            throw new Error(`search vendor error: ${vendorsResponse['status']}`);
        }
        return vendor;
    }

    private async searchItem(itemCode: string) : Promise<ItemAPI> {
        const itemUri = `/items?enabled=1&type=1&pageSize=10&pageOffset=1&itemCode=${itemCode}&sortColumn=itemCode`;
        const result = await this.Call({Url: itemUri,method: APIMethods.GET});
        let item: ItemAPI;
       
        if(result['status']==200){
            item = result['data'] as ItemAPI;
        }else{
            throw new Error(`Error: search item ${itemCode} throw an error: ${result['status']}` )
        }
    
        return item as ItemAPI;
    }

    private async searchStorageLocation(storageIdentifier: string, warehouseId: number): Promise <{}> {
        const storageUri = `/storage?pageSize=10&enabled=1&storageId=${storageIdentifier}&sortColumn=storageId&warehouseId=${warehouseId}`;
        return await this.Call({Url: storageUri, method : APIMethods.GET});
    }
}

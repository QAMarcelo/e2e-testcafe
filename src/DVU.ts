import { t } from 'testcafe';
import { XPathSelector, iCredentials, iUserCredentials } from './utils';

import { errorDialog, warehouse, homeHeader, menu } from './page-object';
import { login } from './login';
import { receivingOrders } from './davinci-tabs/receiving-orders/ReceivingOrders';
import { UserData } from './utils/userData';

import { OverReceivedDialog } from './page-object/dialogs/overReceivedDialog';
import { itemInventory } from './davinci-tabs/Item-Inventory';
import { itemSKUS } from './davinci-tabs/items-skus/itemSkus';
import { inventoryDetail } from './davinci-tabs/inventory-Detail/inventoryDetail';
import { NJTelnet } from './utils/telnet';
import { backEnd } from './utils/backEnd';
import { shippingOrders } from './davinci-tabs/shipping-orders/ShippingOrders';


class dialog{

    public WareHouse : warehouse;
    public Error: errorDialog;
    public OverReceived: OverReceivedDialog;
    constructor (){
        this.WareHouse = new warehouse();
        this.Error = new errorDialog();
        this.OverReceived = new OverReceivedDialog();
    }
}


class davinci{

    public Login : login;
    public Menu : menu;
    public HomeHeader : homeHeader;

    //**** ORDERS ****//
    public ReceivingOrders : receivingOrders;
    public ShippingOrders: shippingOrders;
    
    //**** Warehouse ****//
    public ItemInventory : itemInventory;
    public Dialogs : dialog;
    public ItemSKUs : itemSKUS;
    public BackEnd : backEnd;

   

    //Dialog : dialog;
    constructor (){
        this.Login = new login();
        this.Menu = new menu();
        this.HomeHeader = new homeHeader();
        this.ReceivingOrders = new receivingOrders();
        this.ItemInventory = new itemInventory();
        this.Dialogs = new dialog();
        this.ItemSKUs = new itemSKUS();
        this.BackEnd = new backEnd();

        this.ShippingOrders = new shippingOrders();
    }

    public async verifyAPIVersion(): Promise<boolean>{
        t.ctx.API_V= process.env["TEST_API_V"];
        return await XPathSelector(`//*[contains(text(), 'API')][contains(text(), v1.13.9.2304111948)]`).exists;
    }
    
    public async verifyClientVersion(): Promise<boolean>{
        t.ctx.CLIENT_V = process.env["TEST_CLIENT_V"];
        return await XPathSelector(`//*[contains(text(), 'Client')][contains(text(), v1.13.9.2304111932)]`).exists;
    }
}

export let WEB : iCredentials;
export let RF : iCredentials;
export let API : iCredentials;

export const SetUICredentials = (credentialGroup: string | undefined, DVUCredentials: iUserCredentials| undefined) => {
    try {
        WEB = {
            authorization : DVUCredentials?.authorization ?? UserData[credentialGroup ?? 'QA'].DVU?.authorization,
            language :      DVUCredentials?.language ?? UserData[credentialGroup ?? 'QA'].DVU?.language,
            license :       DVUCredentials?.license ?? UserData[credentialGroup ?? 'QA'].DVU?.license,
            password :      DVUCredentials?.password ?? UserData[credentialGroup ?? 'QA'].DVU?.password,
            port :          DVUCredentials?.port ?? UserData[credentialGroup ?? 'QA'].DVU?.port,
            type :          DVUCredentials?.type ?? UserData[credentialGroup ?? 'QA'].DVU?.type,
            url :           DVUCredentials?.url ?? UserData[credentialGroup ?? 'QA'].DVU?.url,
            user :          DVUCredentials?.user ?? UserData[credentialGroup ?? 'QA'].DVU?.user,
            version :       DVUCredentials?.version ?? UserData[credentialGroup ?? 'QA'].DVU?.version,
            warehouse :     DVUCredentials?.warehouse ?? UserData[credentialGroup ?? 'QA'].DVU?.warehouse,
            database :      DVUCredentials?.database ?? UserData[credentialGroup ?? 'QA'].DVU?.database,
        };
    } catch (error) {
        throw new Error('there was an error trying to load the DVU credential data. Review the Credential Group. ');
    }
   
}
export const SetRFCredentials = (credentialGroup: string | undefined, RFCredentials: iUserCredentials| undefined) => {
    try{
        RF = {
            authorization : RFCredentials?.authorization?? UserData[credentialGroup ?? 'QA'].RF.authorization,
            database :      RFCredentials?.database?? UserData[credentialGroup ?? 'QA'].RF.database,
            language :      RFCredentials?.language?? UserData[credentialGroup ?? 'QA'].RF.language,
            license :       RFCredentials?.license?? UserData[credentialGroup ?? 'QA'].RF.license,
            password :      RFCredentials?.password?? UserData[credentialGroup ?? 'QA'].RF.password,
            port :          RFCredentials?.port?? UserData[credentialGroup ?? 'QA'].RF.port,
            type :          RFCredentials?.type?? UserData[credentialGroup ?? 'QA'].RF.type,
            url :           RFCredentials?.url?? UserData[credentialGroup ?? 'QA'].RF.url,
            user :          RFCredentials?.user?? UserData[credentialGroup ?? 'QA'].RF.user,
            version :       RFCredentials?.version?? UserData[credentialGroup ?? 'QA'].RF.version,
            warehouse :     RFCredentials?.warehouse?? UserData[credentialGroup ?? 'QA'].RF.warehouse,
        }
    } catch (error) {
        throw new Error('there was an error trying to load the RF credential data. Review the Credential Group. ');
    }

}
export const SetAPICredentials = (credentialGroup: string | undefined, APICredentials: iUserCredentials| undefined) => {
    try{
        API = {
            authorization : APICredentials?.authorization?? UserData[credentialGroup ?? 'QA'].API.authorization,
            database :      APICredentials?.database?? UserData[credentialGroup ?? 'QA'].API.database,
            language :      APICredentials?.language?? UserData[credentialGroup ?? 'QA'].API.language,
            license :       APICredentials?.license?? UserData[credentialGroup ?? 'QA'].API.license,
            password :      APICredentials?.password?? UserData[credentialGroup ?? 'QA'].API.password,
            port :          APICredentials?.port?? UserData[credentialGroup ?? 'QA'].API.port,
            type :          APICredentials?.type?? UserData[credentialGroup ?? 'QA'].API.type,
            url :           APICredentials?.url?? UserData[credentialGroup ?? 'QA'].API.url,
            user :          APICredentials?.user?? UserData[credentialGroup ?? 'QA'].API.user,
            version :       APICredentials?.version?? UserData[credentialGroup ?? 'QA'].API.version,
            warehouse :     APICredentials?.warehouse?? UserData[credentialGroup ?? 'QA'].API.warehouse,
        }
    } catch (error) {
        throw new Error('there was an error trying to load the API credential data. Review the Credential Group. ');
    }

}

export const DVU = new davinci();
/**
 * DAVINCI: Login actions
 */
export const Login = new login();

/**
 * DAVINCI: Menú Options
 */
export const Menu = new menu();
/**
 * DAVINCI: HomeHeader actions
 */
export const HomeHeader = new homeHeader();
/**
 * DAVINCI: Receiving orders actions
 */
export const ReceivingOrders = new receivingOrders();
/**
 * DAVINCI: Item Inventory actions
 */
export const ItemInventory = new itemInventory();
/**
 * DAVINCI: Dialgos actions
 */
export const Dialogs = new dialog();
/**
 * DAVINCI: Item/SKUs actions
 */
export const ItemSKUs = new itemSKUS();


/**
 * DAVINCI: BackEnd actions
 */
export const BackEnd = new backEnd();

export enum TestType {
    UI= 'UI',
    RF='RF',
    API='API'
}

export enum TestGroup {
    Allocation = 'Allocation'
  
}

export enum TestArea {
    Receiving = 'Receiving',
    Shipping = 'Shipping'
}
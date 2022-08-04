import { t, Selector } from 'testcafe';
import { Login } from './login/login';
import { menu } from '../page-object/menu/menu';
import { Warehouse } from '../page-object/dialogs/wareHouse';
import { HomeHeader } from '../page-object/homeHeader/homeHeader';
import xpathSelector from '../utils/xpath-selector';
import { ErrorDialog } from '../page-object/dialogs/errorDailog';
//import { TelnetJS } from '../utils/telnet';


export class dialog{

    WareHouse : Warehouse;
    Error: ErrorDialog;
    constructor (){
        this.WareHouse = new Warehouse();
        this.Error = new ErrorDialog();
    }
}

export class davinci{

    Login : Login;
    Menu : menu;
    HomeHeader: HomeHeader;
    //Dialog : dialog;
    constructor (){
        this.Login = new Login();
        this.Menu = new menu();
        this.HomeHeader = new HomeHeader();
        //this.Dialog = new dialog();
    }

    public async verifyAPIVersion(): Promise<boolean>{
        t.ctx.API_V= process.env["TEST_API_V"];
        return await xpathSelector(`//*[contains(text(), 'API')][contains(text(), '${t.ctx.API_V}')]`).exists;
    }
    
    public async verifyClientVersion(): Promise<boolean>{
        t.ctx.CLIENT_V = process.env["TEST_CLIENT_V"];
        return await xpathSelector(`//*[contains(text(), 'Client')][contains(text(), '${t.ctx.CLIENT_V}')]`).exists;
    }

    public getAPIVersion(){
        return t.ctx.API_V;
    }
    public getClientVersion(){
        return t.ctx.CLIENT_V;
    }

    public getUser(){
        return t.ctx.user;
    }

    public getPassword(){
        return t.ctx.password ;
    }

    public getDatabase(){
        return t.ctx.database;
    }

    public getURL(){
        return t.ctx.url ;
    }

} 

export let Davinci = new davinci();
export let Menu = new menu();
export let Dialogs = new dialog();





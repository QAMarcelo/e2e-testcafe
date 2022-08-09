import { t, Selector } from 'testcafe';
import { XPathSelector } from '../../utils/';

import { ErrorDialog, HomeHeader, menu, Warehouse } from '../page-object';
import { Login } from './login';

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
        return await XPathSelector(`//*[contains(text(), 'API')][contains(text(), '${t.ctx.API_V}')]`).exists;
    }
    
    public async verifyClientVersion(): Promise<boolean>{
        t.ctx.CLIENT_V = process.env["TEST_CLIENT_V"];
        return await XPathSelector(`//*[contains(text(), 'Client')][contains(text(), '${t.ctx.CLIENT_V}')]`).exists;
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





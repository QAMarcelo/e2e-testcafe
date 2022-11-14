import { t } from "testcafe";
import { Dialogs } from "../davinci";

interface Credentials{
    user: string, 
    password: string,
    database: string
}

export interface initArgs{
    url?: string;
    credentials?: Credentials,
    UILogin?: boolean;
}

class Initializer {

    //load the url from args or the pipeline variable
    private async loadURL(args: initArgs ): Promise<void>{
        t.ctx.url = args?.url?? process.env["TEST_URL"];
        await t.navigateTo(t.ctx.url);
       
    }

    private async Login(args: initArgs): Promise<void>{
        t.ctx.user = args.credentials?.user?? process.env["TEST_USR"]
        t.ctx.password = args.credentials?.password?? process.env["TEST_PSS"];
        t.ctx.database = args.credentials?.database??  process.env["TEST_DB"];
        
        if(args.UILogin==undefined || args.UILogin==false){ // authenticate without going throught the login page by injecting cookies
            //TODO
        }else{ //authenticate going throught the login page

            //Localhost is displaying an error, adding if statement to handle it
            //one that the local environment works like qa then this statement should be removed
            if (await Dialogs.Error.IsVisible()){
                await Dialogs.Error.OK.Click();
            }
            
        }
        
    }

    public async Load(args: initArgs): Promise<void>{
        await this.loadURL(args);
        await this.Login(args);
    }
}

export let Init = new Initializer();
import { t } from 'testcafe';
import { Telnet } from "telnet-client";
import {Socket} from 'net';
import { RF } from '../DVU';

export interface Params{
	host: string,
	port: number,
	shellPrompt?: string,  
	negotiationMandatory?: boolean,
	timeout?: number
}

export interface LoginParams{
	language: string,
	email: string,
	password: string,
	database: string,
	warehouse: string
}



export class NJTelnet {
	public conn: Telnet;

	private LoginParams: LoginParams;
	private Params: Params;
	constructor(){
		
		this.LoginParams = {
			language: RF.language!,
			email: RF.user,
			password: RF.password,
			database: RF.database!,
			warehouse: RF.warehouse!
		}

		this.Params = {
			host: RF.url,
			port: Number(RF.port!),
			negotiationMandatory: false,
			timeout: 2000
		}
	}

	public setLoginParams(loginParams: LoginParams){
		this.LoginParams = loginParams;
	}

	public async Connect() {

		this.conn = new Telnet();
		let params = this.Params;
		// let params = {
		//   host: 'qa.rf.wdgcorp.com',
		//   port: 5023,
		//   //shellPrompt: '/ # ', // or 
		//   negotiationMandatory: false,
		//   timeout: 1500
		// }
	  
		try {
		  await this.conn.connect(params)
		} catch (error) {
			console.log(error);
		  // handle the throw (timeout)
		}

		return this;
	  }
	  
	public async Login():Promise<void>{
		
		await this.Send(this.LoginParams.language); //language
		await this.Send(this.LoginParams.email); //email
		await this.Send(this.LoginParams.password); //password
		if(this.LoginParams.database!=undefined && this.LoginParams.database!=null)
			await this.Send(this.LoginParams.database); //database
		if(this.LoginParams.warehouse != undefined && this.LoginParams.warehouse!=null)
			await this.Send(this.LoginParams.warehouse); //warehouse
	
		// await this.Send("1");
        // await this.Send("autorf1-fellowship@wdgcorp.com");
        // await this.Send("123"); //password
        // await this.Send("11"); //database
	}

	public async Exec(text: string): Promise<void> {
		let res = await this.conn.exec(text, (error, response) => {
			console.log('async result:', response)
			console.log('async error:', error)
		})
		
	}

	public async GetNext(): Promise<string> {
		let data = await this.conn.nextData();
		if(data !=null)
			return data.toString();
		else{
			return 'END'
		}
	}

	public async Write(data: string): Promise<void> {
		
		await this.conn.write(data, {timeout: 2000 }, (err, value)=>{
			setTimeout(() => { }, 2000);
			console.log(value);
			console.log("**********************");
		})

		
	}

	public async Send(data: string): Promise<void> {
		
		await this.conn.send(data, {ors: '\n', timeout: 2000 }, (err, value)=>{
			setTimeout(() => { }, 2000);
			console.log(value);
		})
		console.log("**********************");
		
	}

	public async End(): Promise<void> {{
		await this.conn.end();
	}}
}
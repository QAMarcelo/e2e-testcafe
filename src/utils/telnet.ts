import { t } from 'testcafe';
import { Telnet } from "telnet-client";
import {Socket} from 'net';
import { API, RF } from '../DVU';
import { InitAPI } from './initializer';

export interface Params{
	host: string,
	port: number,
	shellPrompt?: string,  
	negotiationMandatory?: boolean,
	timeout?: number
}

// export interface LoginParams{
// 	language: string,
// 	email: string,
// 	password: string,
// 	database: string,
// 	warehouse: string
// }



export class NJTelnet {
	public conn: Telnet;

	// private LoginParams: LoginParams;
	private Params: Params;
	constructor(){
		
		// this.LoginParams = {
		// 	language: RF.language!,
		// 	email: RF.user,
		// 	password: RF.password,
		// 	database: RF.database!,
		// 	warehouse: RF.warehouse!
		// }

		this.Params = {
			host: RF.url,
			port: Number(RF.port!),
			negotiationMandatory: false,
			timeout: 2000
		}
	}

	// public setLoginParams(loginParams: LoginParams){
	// 	this.LoginParams = loginParams;
	// }

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
		
		// await this.Connect();
        await this.Send(RF.language);
        await this.Send(RF.user);
        await this.Send(RF.password);
        await this.SelectDatabase(RF.database);
        await this.SelectWarehouse(RF.warehouse);
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

	public async SelectWarehouse(warehouse: string): Promise<void> {
		const APICall = InitAPI();
		const list = await APICall.getRFWarehouses();
		const index = list.indexOf(warehouse) +1;
		// return index>=0? index +1 : index; 
		if(index>0){
			await this.Send(index.toString());
		}
	}

	public async SelectDatabase(database: string): Promise<void>{
		const APICall = InitAPI((`${API.url}:${API.port}/${API.version}/preauth/validate/${RF.user}`));
		const list = await APICall.getRFDatabases();
		const index = list.indexOf(database)+1;
		if(index>0){
			await this.Send(index.toString());
		}
		// return index>=0? index +1 : index;
	}

	public async SelectReceivingOrder(orderNumber: string, wahehouse: string): Promise<void> {
		const APICall = InitAPI();
		const wh = await APICall.searchWarehouse(wahehouse);
		const list = await APICall.getRFReceivingOrderLists(wh?.id!);
		const index = list.indexOf(orderNumber) +1;
		// return index>=0? index +1 : index; 
		if(index>0){
			await this.Send(index.toString());
		}
	}
}

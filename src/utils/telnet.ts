import { t } from 'testcafe';
import { ConnectOptions, SendOptions, Telnet } from "telnet-client";
import {Socket} from 'net';
import { API, RF } from '../DVU';
import { InitAPI } from './initializer';

export class NJTelnet {
	public conn: Telnet;
	private ShowConsole : Boolean;

	// private LoginParams: LoginParams;
	private Params: ConnectOptions;
	constructor(showConsole: Boolean = false){
		this.ShowConsole = showConsole;

		this.Params = {
			host: RF.url,
			port: Number(RF.port!),
			//shellPrompt: /\\r\u0000\\r\\u/,
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

		try {
		  await this.conn.connect(params);
		} catch (error) {
			console.log(error);
			throw new Error("Cannot connect to RF");
			
		}
		await t.wait(1500);
		// this.conn.on('timeout', () => {
		// 	console.log('TimeOut');
		// 	throw new Error('TimeOut!!');
		// });

	  }
	  
	public async Login():Promise<string>
	{
		let screens = '';
        screens+=await this.Send(RF.language);
		screens+=await this.Send(RF.user);
		screens+=await this.Send(RF.password);
		screens+= await this.SelectDatabase(RF.database);
		screens+= await this.SelectWarehouse(RF.warehouse);
		return screens;
	}

	// public async Exec(text: string): Promise<void> {
	// 	let res = await this.conn.exec(text, (error, response) => {
	// 		console.log('async result:', response)
	// 		console.log('async error:', error)
	// 	})
		
	// }

	public async GetNext(): Promise<string> {
		const output = await this.conn.nextData();
		return output!=null? output:'';
	}

	public async NextScreen():Promise<string>{
		let screens : string = '';
		screens += await this.GetNext(); //1
        screens += await this.GetNext(); //2
        screens += await this.GetNext(); //3
        screens += await this.GetNext(); //4
        screens += await this.GetNext(); //5
        screens += await this.GetNext(); //6
        screens += await this.GetNext(); //7
        screens += await this.GetNext(); //8
        screens += await this.GetNext(); //9
        screens += await this.GetNext(); //10
		screens += await this.GetNext(); //11


		return screens;
	}
	/**
	* send a text to RF,
	* returns a string with the RF screen response 
	*/
	public async Send(data: string, waitForText: string|false = false ): Promise<string> {
		await t.wait(650);
		const result = await this.conn.send(data, async (err, value)=>{
			if(this.ShowConsole){
				console.log(value);
			}
			return value;
		});
		
		return result;
	}

	
	public async End(): Promise<void> {{
		await this.conn.end();
	}}

	public async SelectWarehouse(warehouse: string): Promise<void> {
		const APICall = InitAPI();
		const list = await APICall.getRFWarehouses();
		const index = list.indexOf(warehouse) +1;
		// return index>=0? index +1 : index; 
		if(index>=0){
			console.log('warehouse index= ' + index.toString())
			await this.Send(index.toString());
		}
	}

	public async SelectDatabase(database: string): Promise<string>{
		const APICall = InitAPI((`${API.url}:${API.port}/${API.version}/preauth/validate/${RF.user}`));
		const list = await APICall.getRFDatabases();
		const index = list.indexOf(database)+1;
		let output:string='';
		if(index>0){
			output = await this.Send(index.toString());
		}
		return output;
		// return index>=0? index +1 : index;
	}

	public async SelectReceivingOrder(orderNumber: string, wahehouse: string): Promise<string> {
		const APICall = InitAPI();
		const wh = await APICall.searchWarehouse(wahehouse);
		const list = await APICall.getRFReceivingOrderLists(wh?.id!);
		const index = list.indexOf(orderNumber) +1;
		// return index>=0? index +1 : index; 
		let output:string='';
		if(index>0){
			output = await this.Send(index.toString());
		}
		return output;
	}
}

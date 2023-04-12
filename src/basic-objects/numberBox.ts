import { t } from "testcafe";
import { BaseObject } from "./baseObject";


export class NumberBox extends BaseObject {

    constructor(selector: Selector){
        super(selector);
    }

    public async SetNumber(number: Number): Promise<void>{
        await t.typeText(this._container, number.toString());
     }
}
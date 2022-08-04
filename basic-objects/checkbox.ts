import { t } from "testcafe"
import { Label } from "./label";

export class Checkbox {

    public text : Label;
    private _container : Selector;

    constructor(selector: Selector){
        this._container = selector;
        this.text = new Label(this._container.find('label'));
    }

    public async check(checked: boolean): Promise<void>{
        await t.click(this._container.find('input'));
    }

    public async isChecked(): Promise<boolean> {
        return await this._container.find('input').getAttribute('ng-reflect-model') == '1';
    }
}
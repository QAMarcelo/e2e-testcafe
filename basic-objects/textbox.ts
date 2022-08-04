import { t } from "testcafe";


export class TextBox {
    
    private _container : Selector;

    constructor(selector: Selector) {
        this._container = selector;
    }
    
    public async SetText(text: string): Promise<void>{
       await t.typeText(this._container, text)
    }
}
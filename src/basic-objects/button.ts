import { t } from "testcafe";


export class Button {
    
    _container : Selector;

    constructor(selector: Selector){
        this._container = selector;
    }

    public async Click(): Promise<void> { 
        await t.click(this._container)
    }

    public async IsVisible(): Promise<boolean> {
        return await this._container.visible;
    }
}
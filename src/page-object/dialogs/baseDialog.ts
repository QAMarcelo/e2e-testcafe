import { t, Selector } from 'testcafe';

export abstract class BaseDialog {

    public _container : Selector;
    
    constructor(selector: Selector){
        this._container = selector;
    }
    
    public async CloseDialog(): Promise<void> {
        await t.click(this._container.find('.k-dialog-close'));
    }

    public async Save(): Promise<void> {
        await t.click(this._container.find('span').withText('Save').parent('button'));
    }

    public async getTitle() {
        return await this._container.find(".k-dialog-title").find(".title").innerText;

    }
    public async Exists(): Promise<boolean> {
        return await this._container.exists;
    }
    

    public async IsVisible(): Promise<boolean> {
        return await this._container.visible;
    }
}
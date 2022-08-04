import { t, Selector } from 'testcafe';
import { Button } from '../../basic-objects/button';
import xpathSelector from '../../utils/xpath-selector';

export abstract class BaseDialog {

    public _container : Selector;
    public OK: Button;
    constructor(selector: Selector){
        this._container = selector;
        this.OK= new Button(xpathSelector("//kendo-dialog-actions //button[text()= 'OK']"));
    }
    
    public async Close(): Promise<void> {
        await t.click(this._container.find('.k-dialog-close'));
    }

    public async Exists(): Promise<boolean> {
        return await this._container.exists;
    }
    

    public async IsVisible(): Promise<boolean> {
        return await this._container.visible;
    }
}
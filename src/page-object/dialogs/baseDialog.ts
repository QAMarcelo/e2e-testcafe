import { t, Selector } from 'testcafe';
import { XPathSelector }  from '../../../utils/xpath-selector';
import { Button } from '../../basic-objects/button';


export abstract class BaseDialog {

    public _container : Selector;
    public OK: Button;
    constructor(selector: Selector){
        this._container = selector;
        this.OK= new Button(XPathSelector("//kendo-dialog-actions //button[text()= 'OK']"));
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
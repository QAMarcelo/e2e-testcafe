import {t, Selector} from 'testcafe';
import { XPathSelector } from '../../utils';
import { Button } from '../../basic-objects/button';
import { Combobox } from '../../basic-objects/combobox';
import { BaseDialog } from './baseDialog';


export class Warehouse extends BaseDialog {

    public selectWarehouse: Combobox;
    public OK: Button;

    constructor() {
        super(Selector('[data-testid="warehouse-dlg"] div[role=dialog]'));
        this.selectWarehouse = new Combobox(this._container.find('[data-testid="warehouse-select"]'));
        this.OK= new Button(XPathSelector("//kendo-dialog-actions //button[text()= 'OK']"));
    }

  

}
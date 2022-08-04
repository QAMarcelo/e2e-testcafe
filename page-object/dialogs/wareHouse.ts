import {t, Selector} from 'testcafe';
import { Button, Combobox } from '../../index';
import xpathSelector from '../../utils/xpath-selector';
import { BaseDialog } from './baseDialog';

export class Warehouse extends BaseDialog {

    public selectWarehouse: Combobox;
    public OK: Button;

    constructor() {
        super(Selector('[data-testid="warehouse-dlg"] div[role=dialog]'));
        this.selectWarehouse = new Combobox(Selector('[data-testid="warehouse-select"]'));
        this.OK= new Button(xpathSelector("//kendo-dialog-actions //button[text()= 'OK']"));
    }

  

}
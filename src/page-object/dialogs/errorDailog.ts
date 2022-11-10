import {t, Selector} from 'testcafe';
import { XPathSelector } from '../../../utils';
import { Button } from '../../basic-objects';
import { BaseDialog } from './baseDialog';



export class ErrorDialog extends BaseDialog {

    public OK: Button;
    constructor() {
        super(XPathSelector("//div[@role='dialog'][ .//text()='Error']"));  
        this.OK= new Button(XPathSelector("//kendo-dialog-actions //button[text()= 'OK']"));
    }
}
import {t, Selector} from 'testcafe';
import { XPathSelector } from '../../../utils/xpath-selector';
import { BaseDialog } from './baseDialog';



export class ErrorDialog extends BaseDialog {

    constructor() {
        super(XPathSelector("//div[@role='dialog'][ .//text()='Error']"));  
    }
}
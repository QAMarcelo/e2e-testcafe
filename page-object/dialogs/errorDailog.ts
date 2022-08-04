import {t, Selector} from 'testcafe';
import { Button, Combobox } from '../../index';
import xpathSelector from '../../utils/xpath-selector';
import { BaseDialog } from './baseDialog';

export class ErrorDialog extends BaseDialog {

    constructor() {
        super(xpathSelector("//div[@role='dialog'][ .//text()='Error']"));  
    }
}
import { t, Selector } from 'testcafe';
import { XPathSelector } from '../../utils';
import { BaseObject } from './baseObject';
import { Button } from './button';

export class Combobox extends BaseObject{

    
    private button: Button;

    constructor(selector: Selector) {
        super(selector);
        this.button = new Button(this._container.find('button'));
    }

    public async SelectByText(text: string): Promise<void>{
        await this.button.Click();
        await t.click(XPathSelector(`//kendo-list //*[text()="${text}"]`))
    }

    public async SelectByIndex(index: number): Promise<void>{
        await this.button.Click();
        await t.click(`kendo-list li:nth-child(${index})`);
    }

    public async Click(): Promise<void> { 
        await this.button.Click();
    }
}
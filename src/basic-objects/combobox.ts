import { t, Selector } from 'testcafe';
import { XPathSelector } from '../../utils/xpath-selector';
import { Button } from './button';

export class Combobox {

    private _container : Selector;
    private button: Button;

    constructor(selector: Selector) {
        this._container = selector;
        this.button = new Button(this._container.find('button'));
    }

    public async SelectByText(text: string): Promise<void>{
        await this.button.Click();
        await t.click(XPathSelector(`//kendo-list //li[text()="${text}"]`))
    }

    public async SelectByIndex(index: number): Promise<void>{
        await this.button.Click();
        await t.click(`kendo-list li:nth-child(${index})`);
    }

    public async Click(): Promise<void> { 
        await this.button.Click();
    }
}
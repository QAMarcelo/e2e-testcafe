import { t, Selector } from 'testcafe';
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
        await t.click(Selector('.k-list-ul li').withText(text));
    }

    public async SelectByIndex(index: number): Promise<void>{
        await this.button.Click();
        await t.click(`gkendo-list li:nth-child(${index})`);
    }

    public async Click(): Promise<void> { 
        await this.button.Click();
    }
}
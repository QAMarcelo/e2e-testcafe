import { t } from "testcafe";
import XPathSelector from '../utils/xpath-selector';


export class Dropdown  {

    private _container : Selector;

    constructor(selector: Selector){
        this._container = selector;
    }

    public async SelectByText(text: string): Promise<void>{
        this.Click();
        await t.click(XPathSelector(`//kendo-list //span[text()="${text}"]`))
    }

    public async SelectByIndex(index: number): Promise<void>{
        this.Click();
        await t.click(`kendo-list li:nth-child(${index})`);
    }

    public async Click(): Promise<void> { 
        await t.click(this._container)
    }
}
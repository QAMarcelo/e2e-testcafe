import { t } from "testcafe"


export class MenuButton {
    
    private _container : Selector;

    constructor(selector: Selector) {
        this._container = selector;
    }

    public async Click(): Promise<void> { 
        await t.hover(this._container)
    }

    public async SelectItem(value: string | number): Promise<void>{
        this.Click();
        switch (value) {
            case String.toString():
                //await t.click(this._container.find(`.k-popup.k-menu-popup li [ng-reflect-display-text="${value}"] button`));
                await t.click(this._container.find(`.k-popup.k-menu-popup li button`).withText(value));
                break;
            case Number.toString():
                await t.click(this._container.find(`.k-popup.k-menu-popup li:nth-child(${value}) button`));
                break;
        }
    }
}
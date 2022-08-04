import { Selector, t } from 'testcafe';
import { Button } from '../../basic-objects/button';
import XPathSelector from '../../utils/xpath-selector';

export class MenuItem {
    private _container: Selector;

    private Parent: MenuItem | null = null;

    constructor(menuTitle: string, parent: MenuItem | null = null) {
        this._container = XPathSelector(`//button[text() = '${menuTitle}']`);
        if(parent!= null)
            this.Parent = parent;
    }
    
    public async GoTo(): Promise<void>{
        if(this.Parent == null){
            await t.hover(Selector('[data-testid="toolbar.menu"]')); //click on the toolbar menu icon
        }else{
            await this.Parent.GoTo();
        }
        await t.click(this._container);
    
    }

    public async click(): Promise<void> {
        if( await this._container.hasAttribute('aria-expanded') )
            await t.hover(this._container);
        else
            await t.click(this._container);
    }

    public async getText(): Promise<string> {
        return await this._container.find("i").innerText;
    }
}
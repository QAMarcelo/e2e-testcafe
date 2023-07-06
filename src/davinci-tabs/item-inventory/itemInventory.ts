import { Selector } from "testcafe";
import { Tab, Table } from "../../page-object";
import { ItemInventory_Toolbar } from "./itemInventory-toolbar";
import { BaseDialog } from "../../page-object/dialogs/baseDialog";
import { Button, ComboboxWithToolbar } from "../../basic-objects";


export class itemInventory {

    private _container: Selector;
    public Toolbar : ItemInventory_Toolbar;
    public Table: Table;

    public SearchDialog: ItemInventory_SearchDialog;
    constructor(){
        this._container = Selector('div.k-state-active item-inventory');
        this.Toolbar = new ItemInventory_Toolbar(this._container);
        this.Table = new Table(this._container.find('table'));
        this.SearchDialog = new ItemInventory_SearchDialog(this._container);

    }



}


export class ItemInventory_SearchDialog extends BaseDialog {

    public Account: ComboboxWithToolbar;
    public Search: Button;
    constructor(selector: Selector){
        super(selector);

        this.Account = new ComboboxWithToolbar(this._container.find('span').withText('Account').nextSibling('span.searchAndSearchButton'));
        this.Search = new Button(this._container.find('button').withText('Search'));
    }

}
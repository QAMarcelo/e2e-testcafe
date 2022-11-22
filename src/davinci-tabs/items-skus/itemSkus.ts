import { Selector } from "testcafe";
import { Tab, Table } from "../../page-object";
import { ItemSkus_CreateDialog } from "./dialog/itemSkus-Search";
import { ItemSkus_toolbar } from "./itemSkus-toolbar";

export class ItemSKUS {

    private _container: Selector;
    public Toolbar: ItemSkus_toolbar;
    public CreateItem: ItemSkus_CreateDialog;
    public Table: Table;
    constructor(){
        this._container = Selector('div.k-state-active items-skus');
        this.Toolbar = new ItemSkus_toolbar(this._container.find('.k-toolbar'));
        this.CreateItem = new ItemSkus_CreateDialog(this._container.find('kendo-dialog'));
        this.Table = new Table(this._container.find('table'));
    }



}
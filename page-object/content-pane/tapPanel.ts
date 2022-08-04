import { t } from "testcafe";
import { Tab } from "./tab";
import { Table } from "./table";
import { Toolbar } from "./tabToolbar";

export class TabPanel {

    _container : Selector;
    Tabs : Tab;
    ToolBar : Toolbar;
    Table : Table;

    constructor(selector: Selector, toolbar: Toolbar ){
        this._container = selector;
        this.ToolBar = toolbar;
        
    }



}
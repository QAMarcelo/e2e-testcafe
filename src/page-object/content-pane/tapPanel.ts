import { t } from "testcafe";
import { Tab } from "./tab";
import { Table } from "./table";
import { TabToolbar } from "./tabToolbar";

export class TabPanel {

    _container : Selector;
    Tabs : Tab;
    ToolBar : TabToolbar;
    Table : Table;

    constructor(selector: Selector, toolbar: TabToolbar ){
        this._container = selector;
        this.ToolBar = toolbar;
        
    }



}
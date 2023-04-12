import { Selector, t } from "testcafe";
import { Button, ComboboxWriteAndSearch, Dropdown, TextBox } from "../../basic-objects";
import { BaseObject } from "../../basic-objects/baseObject";
import { ComboboxWithToolbar } from "../../basic-objects/comboboxWithToolbar";
import { NumberBox } from "../../basic-objects/numberBox";
import { BaseDialog } from "../../page-object/dialogs/baseDialog";


export class ReceivingOrdersModal extends BaseDialog{

    //SUMMARY
    public Status: Dropdown;
    public Account : ComboboxWithToolbar;
    public Carrier: ComboboxWithToolbar;
    public Supplier: ComboboxWithToolbar;
    public ReceivedFrom: ComboboxWithToolbar;
    public OrderNumber: TextBox;

    public SideMenu: SideMenu;

    public LineEntries: LineEntries;

    constructor(selector: Selector){
        super(selector);

        this.SideMenu = new SideMenu(this._container.find('mat-sidenav'));
        this.LineEntries = new LineEntries(this._container.find('receiving-line-entries'));

        this.Status = new Dropdown(this._container.find('span').withText('Status').nextSibling('kendo-dropdownlist'));
        this.Account = new ComboboxWithToolbar(this._container.find('span').withText('Account').nextSibling('span.searchAndSearchButton'));
        this.Carrier = new ComboboxWithToolbar(this._container.find('span').withText('Carrier').nextSibling('span.searchAndSearchButton'));
        this.Supplier = new ComboboxWithToolbar(this._container.find('span').withText('Supplier').nextSibling('span.searchAndSearchButton'));
        this.ReceivedFrom = new ComboboxWithToolbar(this._container.find('span').withText('Received From').nextSibling('span.searchAndSearchButton'));
        this.OrderNumber = new TextBox(this._container.find('span').withText('Order Number').sibling('input'));
    }
}

export class SideMenu extends BaseObject{
    public General : Button;
    public LineEntries: Button;
    public Appointment: Button;
    public CrossDock: Button;
    public ChargeCodes: Button;
    public Documents: Button;
    public Notes: Button;
    public SourceData: Button;
    public EventHistory : Button;
    public EventManagement: Button;

    constructor(selector: Selector){
        super(selector);
        this.General = new Button(this._container.find('mat-sidenav ul>div:nth-child(1)'));
        this.LineEntries = new Button(this._container.find('mat-sidenav ul>div:nth-child(2)'));
        this.Appointment = new Button(this._container.find('mat-sidenav ul>div:nth-child(3)'));
        this.CrossDock = new Button(this._container.find('mat-sidenav ul>div:nth-child(4)'));
        this.ChargeCodes = new Button(this._container.find('mat-sidenav ul>div:nth-child(5)'));
        this.Documents = new Button(this._container.find('mat-sidenav ul>div:nth-child(6)'));
        this.Notes = new Button(this._container.find('mat-sidenav ul>div:nth-child(7)'));
        this.SourceData = new Button(this._container.find('mat-sidenav ul>div:nth-child(8)'));
        this.EventHistory = new Button(this._container.find('mat-sidenav ul>div:nth-child(9)'));
        this.EventManagement = new Button(this._container.find('mat-sidenav ul>div:nth-child(10)'));
    }
}

export class LineEntries extends BaseObject {
    public Toolbar : LineEntriesToolBar;
    public GeneralPanel: GeneralPanel;

    constructor(selector: Selector){
        super(selector);

        this.Toolbar = new LineEntriesToolBar(this._container.find('kendo-grid-toolbar'));
        this.GeneralPanel = new GeneralPanel(this._container.find('mat-expansion-panel:nth-child(1)')); 
    }
}

export class LineEntriesToolBar extends BaseObject{
    
    public Insert: Button;
    public Delete: Button;
    public Wizard: Button;
    public Copy: Button;
    public BatchReceive: Button;
    public ExportCSV: Button;
    

    constructor(selector: Selector){
        super(selector);
        this.Insert = new Button(this._container.find('[data-testid="button.Insert"]'));
        this.Delete = new Button(this._container.find('span:nth-child(2) button'));
        this.Wizard = new Button(this._container.find('span:nth-child(3) button'));
        this.Copy = new Button(this._container.find('span:nth-child(4) button'));
        this.BatchReceive = new Button(this._container.find('span:nth-child(5) button'));
        this.ExportCSV = new Button(this._container.find('span:nth-child(6) button'));
    }
}


export class GeneralPanel extends BaseDialog{
    public ItemCode: ComboboxWriteAndSearch;
    public QtyPlanned: NumberBox;
    public Insert: Button;


    constructor(selector: Selector){
        super(selector);
        this.ItemCode = new ComboboxWriteAndSearch(this._container.find('item-code-combobox'));
        this.QtyPlanned = new NumberBox(this._container.find('span').withText('Qty Planned').nextSibling('kendo-numerictextbox'));
        this.Insert = new Button(this._container.find('.save button').withExactText('Insert'));
    }

    public async Expand(): Promise<void>{
        if(this._container.withAttribute('class', 'mat-expanded'))
            await t.click(this._container);
    }
}

export class CrossDock{

}
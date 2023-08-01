import { Selector } from "testcafe";
import { Label } from "../../basic-objects";
import { BaseSelector } from "../../basic-objects/baseSelector";
import { InventoryDetail_Toolbar } from "./inventoryDetail-Toolbar";
import { Tab, Table } from "../../page-object";
import { BaseDialog } from "../../page-object/dialogs/baseDialog";

export class inventoryDetail extends BaseDialog{


    public StatusPanel: StatusQuantityPanel;
    public Toolbar: InventoryDetail_Toolbar;
    public Table : Table;

    // public AllocationDetail: AllocationDetail;
    constructor(){
        super(Selector('inventory-detail'));

        this.StatusPanel = new StatusQuantityPanel(this._container.find('.mat-card'));
        this.Toolbar = new InventoryDetail_Toolbar(this._container); 
        this.Table = new Table(this._container.find('[role=grid]'));

    }
}

export class StatusQuantityPanel extends BaseSelector{
    public Available: Label;
    public AllocateShipping: Label;
    public Hold: Label;
    public Quaratined: Label;
    public Damaged: Label;
    public Pending: Label;
    public BackOrdered: Label;
    public Physical: Label;
    
    constructor(selector: Selector){
        super(selector);

        this.Available = new Label(this._container.find('span').withExactText('Available').nextSibling('span'));

        this.AllocateShipping = new Label(this._container.find('span').withExactText('Allocated - Shipping').nextSibling('span'));
        this.Hold = new Label(this._container.find('span').withExactText('Hold').nextSibling('span'));

        this.Quaratined = new Label(this._container.find('span').withExactText('Quarantined').nextSibling('span'));
        this.Damaged = new Label(this._container.find('span').withExactText('Damaged').nextSibling('span'));
        this.Pending = new Label(this._container.find('span').withExactText('Pending').nextSibling('span'));
        this.BackOrdered = new Label(this._container.find('span').withExactText('Back Ordered').nextSibling('span'));
        this.Physical = new Label(this._container.find('span').withExactText('Physical').nextSibling('span'));

    }
}
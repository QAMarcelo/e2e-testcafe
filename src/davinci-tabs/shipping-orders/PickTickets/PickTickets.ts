import { Button, Combobox, ComboboxSearch, ComboboxWriteAndSearch } from "../../../basic-objects";
import { BaseObject } from "../../../basic-objects/baseObject";
import { Table } from "../../../page-object";

export class ShippingPickTickets extends BaseObject{
    
    public PickTicket : Combobox;
    public Create: Button;
    public Delete: Button;
    
    public Print: Button;

    public Table: Table;
    constructor(selector: Selector){
        super(selector)

        const createId = this._container.find('[role="tooltip"]').withExactText('Create Pick Ticket').getAttribute('id');
        this.Create = new Button(this._container.find(`button[aria-describedby='${createId}']`));

        const deleteId = this._container.find('[role="tooltip"]').withExactText('Delete').getAttribute('id');
        this.Delete = new Button(this._container.find(`button[aria-describedby='${deleteId}']`));

        const printId = this._container.find('[role="tooltip"]').withExactText('Print').getAttribute('id');
        this.Print = new Button(this._container.find(`button[aria-describedby='${printId}']`));

        this.Table = new Table(this._container.find('[role="grid"]'));
    }
}
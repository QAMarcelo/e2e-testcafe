import { Selector } from "testcafe";
import { ReceivingOrdersModal, ReceivingOrders_Toolbar } from ".";


export class ReceivingOrders {

    private _container: Selector;
    public Toolbar : ReceivingOrders_Toolbar;
    public CreateReceivingOrder: ReceivingOrdersModal;
    
        constructor(){
        this._container = Selector('.k-state-active receiving');
        //this.Toolbar = new ReceivingOrders_Toolbar(this._container.find('.k-toolbar'));
        this.Toolbar = new ReceivingOrders_Toolbar(this._container);
        this.CreateReceivingOrder = new ReceivingOrdersModal(this._container.find('kendo-dialog.largeDialogBox'));
    }
}
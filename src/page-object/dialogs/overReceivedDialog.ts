import { Button } from "../../basic-objects";
import { XPathSelector } from "../../utils";
import { BaseDialog } from "./baseDialog";

export class OverReceivedDialog extends BaseDialog{
    public Yes: Button;
    public No: Button;
    constructor() {
        super(XPathSelector("//kendo-dialog[.//text()='Over Receive']"));  
        this.Yes= new Button(this._container.find('.confirmDialogButtons button').withText('Yes'));
        this.No= new Button(this._container.find('.confirmDialogButtons button').withText('No'));
    }
}
import { Selector, t } from "testcafe"
import { DropdownButton } from "../../basic-objects";


export class HomeHeader{

    Profile: DropdownButton;
    constructor()
    {
           this.Profile = new DropdownButton(Selector('kendo-dropdownbutton[data-testid="toolbar.profile"] button'));
    }

    
}
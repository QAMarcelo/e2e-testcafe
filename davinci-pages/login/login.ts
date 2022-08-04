import { Selector, t } from 'testcafe';
import { Button, TextBox, Dropdown } from '../../index';

export class Login{

    Email : TextBox; 
    Next : Button;
    Database : Dropdown;
    Back: Button;
    Login : Button;
    Password: TextBox;

    constructor() {
        this.Email = new TextBox(Selector('[data-testid="login.email"]'));
        this.Next = new Button(Selector('[data-testid="login.next"]'));

        this.Database = new Dropdown(Selector('kendo-dropdownlist'));
        this.Back = new Button(Selector('.loginButtons button:nth-child(1)'))
        this.Login = new Button(Selector('.loginButtons button:nth-child(2)'));
        this.Password = new TextBox(Selector('[data-testid="login.password"]'));
    } 

    public async Displayed() {
        return await Selector('.login').exists;
    }
   
   
}
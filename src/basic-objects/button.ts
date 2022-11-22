import { t } from "testcafe";
import { BaseObject } from "./baseObject";


export class Button extends BaseObject{
    
    _container : Selector;

    constructor(selector: Selector){
        super(selector)
    }

  
}
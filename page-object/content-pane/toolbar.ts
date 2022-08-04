import { t, Selector } from 'testcafe';
import { Button } from '../../basic-objects/button';

export class Toolbar {

    _container : Selector;

    private listButtons: Button[];

    constructor(selector: Selector,  listButtons: Button[]) { 
        this._container = selector;

    }



}
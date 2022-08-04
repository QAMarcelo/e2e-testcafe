import { t, Selector } from 'testcafe';
import { Button } from '../../basic-objects/button';

export class Toolbar {

    _container : Selector;


    constructor(selector: Selector) { 
        this._container = selector;

    }



}
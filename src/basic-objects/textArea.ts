import { t, Selector } from 'testcafe';

export class TextArea {

    private _container : Selector;

    constructor(selector: Selector) {
        this._container = selector;
    }

}
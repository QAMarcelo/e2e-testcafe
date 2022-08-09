import { t, Selector } from 'testcafe';


export class Label {

    private _container : Selector;

    constructor(selector: Selector) {
        this._container = selector;
    }

    public async Text(): Promise<string> {
        return this._container.innerText;
    }

    public async Exists(): Promise<boolean> {
        return this._container.exists;
    }
}
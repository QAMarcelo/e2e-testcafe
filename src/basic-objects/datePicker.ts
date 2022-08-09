import { t, Selector} from 'testcafe';


export class DatePicker {

    private _container : Selector;

    constructor(selector: Selector) {
        this._container = selector;
    }

}
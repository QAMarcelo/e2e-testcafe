import { t, Selector } from 'testcafe';


export class Table {
    _container : Selector;

    private Headers: string[];
    constructor( selector: Selector ){
        this._container = selector;
    }

    
    public async clickRow(index: number): Promise<void>{
        await t.click(this._container.find(`tbody tr[kendogridlogicalrow]:nth-child(${index})`));
    }

    public async getValue(column: number, row: number): Promise<string> {
        let findSelector = "";
        
        switch(typeof column)
        {
            case Number.toString() :
                findSelector = `tbody tr[kendogridlogicalrow]:nth-child(${row}) td:nth-child(${column})`;
                break;
        }
        
        return await this._container.find(findSelector).innerText;
    }

    

}
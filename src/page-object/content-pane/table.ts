import { t, Selector } from 'testcafe';
import { XPathSelector } from '../../../utils';

interface TableQuery {
    rowTitle : string,
    rowValue: string,
}
export class Table {
    _container : Selector;

    private Headers: string[];
    
    constructor( selector: Selector ){
        this._container = selector;
    }

    public async clickRowByQuery(tableQuery : TableQuery[]){
        var query = "";
        for await (const e of tableQuery) {
            var ariacolindex = await XPathSelector(`//*[@role='columnheader'][.//span[text()='${e.rowTitle}']]`).getAttribute('aria-colindex');
            query += `.//td[@aria-colindex='${ariacolindex}'][text()='${e.rowValue}'] and `;
        }

        if(query.length>0){
            query = "//div[contains(@class, 'k-state-active')] //tr[ " + query + "]";
            await t.click(XPathSelector(query));
        }
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
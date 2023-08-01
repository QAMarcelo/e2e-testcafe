import { t, Selector } from 'testcafe';
import { XPathSelector } from '../../utils';
import { BaseSelector } from '../../basic-objects/baseSelector';

export interface TableQuery {
    rowTitle : string,
    rowValue: string,
}
export class Table extends BaseSelector {
    _container : Selector;
    private Headers: string[];
    
    constructor( selector: Selector){
        super(selector)
    }

    public async clickRowByQuery(...tableQuery : TableQuery[]){
        var query = "";
        for await (const e of tableQuery) {
            var ariacolindex = await XPathSelector(`//*[@role='columnheader'][.//span[text()='${e.rowTitle}']]`).getAttribute('aria-colindex');
            query += `.//td[@aria-colindex='${ariacolindex}'][text()='${e.rowValue}'] and `;
        }

        if(query.length>0){
            query = query.substring(0, query.length-4);
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

    public async existRowByQuery(...tableQuery : TableQuery[]): Promise<Boolean>{
        var query = "";
        let exist = false;
        for await (const e of tableQuery) {
            //var ariacolindex = await Selector('.k-column-title').withText(e.rowTitle).parent('[role="columnheader"]').getAttribute('aria-colindex');
            var ariacolindex = await XPathSelector(`//*[@role='columnheader'][.//span[text()='${e.rowTitle}']]`).getAttribute('aria-colindex');
            query += `.//td[@aria-colindex='${ariacolindex}'][text()='${e.rowValue}'] and `;
        }

        if(query.length>0){
            query = query.substring(0, query.length-4);
            query = "//div[contains(@class, 'k-state-active')] //tr[ " + query + "]";
            console.log(query);
            exist = await XPathSelector(query).exists;
        }
        
        return exist;
    }

    public async getCellValue(...tableQuery: TableQuery[]): Promise<string> {
        return '';
    }

}
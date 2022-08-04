import { Selector, t } from 'testcafe';
import { Davinci, Menu, Dialogs, } from '../davinci-pages/davinci';


fixture`Getting Started`
    .page`http://localhost:4200/Login`;


test
    .meta({testType: 'regression', testArea: 'login'})
    ('My first test', async t => {

        await Davinci.Login.Password.SetText('1DAVINCI');
        await Davinci.Login.Database.SelectByIndex(2);
        await Davinci.Login.Login.Click();

        await Dialogs.WareHouse.selectWarehouse.SelectByIndex(1);

        await Dialogs.WareHouse.OK.Click();
        await Menu.ConsolidatedBillOfLading.GoTo();
        await Menu.InventoryByLocation.GoTo();
        
    });

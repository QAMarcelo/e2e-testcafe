import { Selector, t } from 'testcafe';
import { Davinci, Dialogs, Menu}  from '../../src/davinci-pages/davinci';
import { StringOptions, Init } from '../../utils';

fixture(`Smoke tests`)
    .meta({fixtureType: 'smoke'})

    .beforeEach(async t=>{
       await Init.Load({});
    })
    

/* 
    [SMOKE] verify login and log out
*/
test
    .meta({testType: 'smoke', UITest: 'true', testGoal: 'Login'})
    ('Login and version', async t => {
        //Login in as Admin for trial
        await Davinci.Login.Email.SetText(Davinci.getUser());
        await Davinci.Login.Next.Click();

        await Davinci.Login.Password.SetText(Davinci.getPassword());
        await Davinci.Login.Database.SelectByText(Davinci.getDatabase());

        await t.expect(await Davinci.verifyAPIVersion()).ok(`Error Client version: Version number dont match, ${Davinci.getAPIVersion()}`)
        await t.expect(await Davinci.verifyClientVersion()).ok(`Error Client version: Version number dont match ${Davinci.getClientVersion()}`)
        
        await Davinci.Login.Login.Click();
        
        //Verify the Dashboard has been displayed
        await t.expect(Selector('div[kendodraggable][data-sortable-index="0"]').exists).ok("Default dashboard page is not displayed");

        // if the Select warehouse dialog is displayed then close it
        if( await Dialogs.WareHouse.IsVisible() )
        {
            await Dialogs.WareHouse.selectWarehouse.SelectByIndex(1);
            await Dialogs.WareHouse.OK.Click();
            await t.expect(await Dialogs.WareHouse.Exists()).notOk("WareHouse dialog is still displayed");
        }

        //logout
        await Davinci.HomeHeader.Profile.SelectByText('Logout', StringOptions.contains);
        //Verify user was able to logout succesfully
        await t.expect(await Davinci.Login.Displayed()).ok('user was not sucessfully logged out');
    });

/* 
    [SMOKE] verify Navigation and data loading
*/
test
    .meta({testType: 'smoke', UITest: 'true', testGoal: 'Navigation'})
    ('Navigation 1', async t =>{
        //Log in as admin
        await Davinci.Login.Email.SetText(Davinci.getUser());
        await Davinci.Login.Next.Click();

        await Davinci.Login.Password.SetText(Davinci.getPassword());
        await Davinci.Login.Database.SelectByText(Davinci.getDatabase());
        await Davinci.Login.Login.Click();
        
        // if the Select warehouse dialog is displayed then close it
        if( await Dialogs.WareHouse.IsVisible() )
        {
            await Dialogs.WareHouse.selectWarehouse.SelectByIndex(1);
            await Dialogs.WareHouse.OK.Click();
            await t.expect(await Dialogs.WareHouse.Exists()).notOk("WareHouse dialog is still displayed");
        }

        //within the menu go to Consolidated Bill of Lading
        await Menu.ShippingOrders.GoTo();
        //Verify the table has data displayed
        await t.expect(Selector('tr.k-grid-norecords').exists).notOk("There is no data retreived from the DB!");
    });

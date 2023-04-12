import { Selector, t } from 'testcafe';
import { DVU }  from '../../src/DVU';
import { StringOptions, Init } from '../../src/utils';

fixture(`Smoke tests`)
    .meta({fixtureType: 'smoke'})

    .beforeEach(async t=>{
       await Init.Load({});
    })
    

/* 
    [SMOKE] verify login and }9/2g out
*/
test
    .meta({testType: 'smoke', UITest: 'true', testGoal: 'Login'})
    ('Login and version', async t => {
        //Login in as Admin for trial
        await DVU.Login.Email.SetText(DVU.getUser());
        await DVU.Login.Next.Click();

        await DVU.Login.Password.SetText(DVU.getPassword());
        await DVU.Login.Database.SelectByText(DVU.getDatabase());

        await t.expect(await DVU.verifyAPIVersion()).ok(`Error Client version: Version number dont match, ${DVU.getAPIVersion()}`)
        await t.expect(await DVU.verifyClientVersion()).ok(`Error Client version: Version number dont match ${DVU.getClientVersion()}`)
        
        await DVU.Login.Login.Click();
        
        //Verify the Dashboard has been displayed
        await t.expect(Selector('div[kendodraggable][data-sortable-index="0"]').exists).ok("Default dashboard page is not displayed");

        // if the Select warehouse dialog is displayed then close it
        if( await DVU.Dialogs.WareHouse.IsVisible() )
        {
            await DVU.Dialogs.WareHouse.selectWarehouse.SelectByText('<1> WHSE1');
            await DVU.Dialogs.WareHouse.OK.Click();
            await t.expect(await DVU.Dialogs.WareHouse.Exists()).notOk("WareHouse dialog is still displayed");
        }

        //logout
        await DVU.HomeHeader.Profile.SelectByText('Logout', StringOptions.contains);
        //Verify user was able to logout succesfully
        await t.expect(await DVU.Login.Displayed()).ok('user was not sucessfully logged out');
    });

/* 
    [SMOKE] verify Navigation and data loading
*/
test
    .meta({testType: 'smoke', UITest: 'true', testGoal: 'Navigation'})
    ('Navigation 1', async t =>{
        //Log in as admin
        await DVU.Login.Email.SetText(DVU.getUser());
        await DVU.Login.Next.Click();

        await DVU.Login.Password.SetText(DVU.getPassword());
        await DVU.Login.Database.SelectByText(DVU.getDatabase());
        await DVU.Login.Login.Click();
        
        // if the Select warehouse dialog is displayed then close it
        if( await DVU.Dialogs.WareHouse.IsVisible() )
        {
            await DVU.Dialogs.WareHouse.selectWarehouse.SelectByText("<1> WHSE1");
            await DVU.Dialogs.WareHouse.OK.Click();
            await t.expect(await DVU.Dialogs.WareHouse.Exists()).notOk("WareHouse dialog is still displayed");
        }

        //within the menu go to Consolidated Bill of Lading
        await DVU.Menu.ShippingOrders.GoTo();
        //Verify the table has data displayed
        //await t.expect(Selector('tr.k-grid-norecords').exists).notOk("There is no data retreived from the DB!");
    });

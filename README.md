#Automation Davinci framework 

## Install
in order to have it funtional run the install command
```sh
npm ci
```

## Run tests
To run the tests you must be in the root folder and write the following command, where the chrome could be changed for any other browser like firefox.
Testcafe will pick every tests that exists inside the tests folder and run it in a sandbox with the given browser

```sh
npx testcafe chrome tests/
```
we can set a browser headless execution as follows: 
```sh
npx testcafe chrome:headless tests/
```

## Filter Options
| command           | description |
| ------            | ------ |
| --test-meta       | TestCafe runs tests whose metadata matches the specified key-value pair. See -meta options|
| --fixture-meta    | TestCafe runs tests whose fixture’s metadata matches the specified key-value pair. See -meta options |

| -meta options     | description |
| ------            | ------ |
| testType          | witch tests should run. values: smoke, regression, e2e, pythonRF, API |
| UITest            | values:true|false, this will run the tests that are testing the UI or not like the API or some cases of python RF |
| testGoal          | the value of this option is the area the its being tested: Login, picking, bar scanning, settings, accounts, etc |


> Example:  `npx testcafe chrome tests/ --test-meta testType=smoke,UITest=true`

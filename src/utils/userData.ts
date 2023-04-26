import {CredentialLanguage, CredentialType} from './helpers'


// export const environments = {
//     QA: {
//         version : "v1",
//         port : "8443", 
//         license : "0000000007",
//         address :"https://qa-ecs.wdgcorp.com",
//         rfAddress: "qa.rf.wdgcorp.com",
//         rfPort : "5023"
//     },
//     TRIAL: {
//         version : "v1",
//         port : "8443", 
//         license : "0000000008",
//         url :"https://trial.wdgcorp.com",
//         rfAddress: "trial.rf.wdgcorp.com",
//         rfPort : "5023"
//     }
// }

export const UserData = 
{
    QA: 
    {
        DVU : {
            user : "autoqa1-fellowship@wdgcorp.com",
            password : "123",
            database : "FellowShip",
            warehouse : "AutoQA-BarcodeScanning",
            version : "v1",
            port : "8443", 
            license : "0000000007",
            url :"https://qa-ecs.wdgcorp.com",
            authorization : "Basic YXV0b2FwaTEtZmVsbG93c2hpcEB3ZGdjb3JwLmNvbToxMjM=",
            type : CredentialType.UI,
            language : CredentialLanguage.English
        },
        RF : {
            user : "autorf1-fellowship@wdgcorp.com",
            password : "123",
            database : "FellowShip",
            warehouse : "AutoQA-BarcodeScanning",
            version : "v1",
            port : "5023", 
            license : "0000000007",
            url : "qa.rf.wdgcorp.com",
            authorization : "Basic YXV0b3JmMS1mZWxsb3dzaGlwQHdkZ2NvcnAuY29tOjEyMw==",
            type : CredentialType.RF,
            language : CredentialLanguage.English
        }, 
        API : {
            user : "autoapi1-fellowship@wdgcorp.com",
            password : "123",
            database : "FellowShip",
            warehouse : "AutoQA-BarcodeScanning",
            version : "v1",
            port : "8443", 
            license : "0000000007",
            url : "https://qa-ecs.wdgcorp.com",
            authorization : "Basic YXV0b2FwaTEtZmVsbG93c2hpcEB3ZGdjb3JwLmNvbToxMjM=",
            type : CredentialType.API,
            language : CredentialLanguage.English,
        }
    },
    TRIAL: {
        DVU : {
            user : "autoqa1-trial@wdgcorp.com",
            password : "123",
            database : "bstevens",
            warehouse : "Automation",
            version : "v1",
            port : "8443", 
            license : "0000000008",
            url :"https://trial.wdgcorp.com",
            authorization : "Basic YWRtaW5xYTEtdHJpYWxAd2RnY29ycC5jb206MTIz",
            type : CredentialType.UI,
            language : CredentialLanguage.English
        },
        RF : {
            user : "autorf1-trial@wdgcorp.com",
            password : "123",
            database : "bstevens",
            warehouse : "Automation",
            version : "v1",
            port : "5023", 
            license : "0000000008",
            url : "trial.rf.wdgcorp.com",
            authorization : "Basic YWRtaW5yZjEtdHJpYWxAd2RnY29ycC5jb206MTIz",
        }, 
        API : {
            user : "autoapi1-trial@wdgcorp.com",
            password : "123",
            database : "bstevens",
            warehouse : "Automation",
            version : "v1",
            port : "8443", 
            license : "0000000008",
            url : "https://trial.wdgcorp.com",
            authorization : "Basic YWRtaW5hcGkxLXRyaWFsQHdkZ2NvcnAuY29tOjEyMw==",
            type : CredentialType.API,
            language : CredentialLanguage.English,
        }
    },
    Marcelo: {
        DVU : {
            user : "adminqa1-fellowship@wdgcorp.com",
            password : "123",
            database : "FellowShip",
            warehouse : "renewal",
            version : "v1",
            port : "8443", 
            license : "0000000007",
            url :"https://qa-ecs.wdgcorp.com",
            authorization : "Basic YXV0b2FwaTEtZmVsbG93c2hpcEB3ZGdjb3JwLmNvbToxMjM=",
            type : CredentialType.UI,
            language : CredentialLanguage.English
        },
        RF : {
            user : "adminrf1-fellowship@wdgcorp.com",
            password : "123",
            database : "FellowShip",
            warehouse : "renewal",
            version : "v1",
            port : "5023", 
            license : "0000000007",
            url : "qa.rf.wdgcorp.com",
            authorization : "Basic YXV0b3JmMS1mZWxsb3dzaGlwQHdkZ2NvcnAuY29tOjEyMw==",
            type : CredentialType.RF,
            language : CredentialLanguage.English
        }, 
        API : {
            user : "autoapi1-fellowship@wdgcorp.com",
            password : "123",
            database : "FellowShip",
            warehouse : "AutoQA-BarcodeScanning",
            version : "v1",
            port : "8443", 
            license : "0000000007",
            url : "https://qa-ecs.wdgcorp.com",
            authorization : "Basic YXV0b2FwaTEtZmVsbG93c2hpcEB3ZGdjb3JwLmNvbToxMjM=",
            type : CredentialType.API,
            language : CredentialLanguage.English,
        }
    }

}



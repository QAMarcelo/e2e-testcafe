import { attributeAPI } from "./bpsAttributeAPI";
import { ChargeCodeAPI } from "./bpsChargeCodeAPI";
import { StorageChargeAPI } from "./bpsStorageChargeAPI";

export interface BusinessPartnerAPI {
    Id?: number,
    AccountId? : string,
    Description?: string,
    Enable?: boolean,
    RateMultiplier?: number,
    Type?: number,
    Attributes?: attributeAPI,
    StorageCharges?: StorageChargeAPI[],
    ChargeCode?: ChargeCodeAPI[],
    Mailing_address?: {
        Address1?: string,
        Address2?: string,
        City?: string,
        Postal_Code?:string,
        Country?: string,
        state?: string,
    }
    Shipping_Address?: {
        Use_Mailing_Address?: boolean,
        Address1?: string,
        Address2?: string,
        City?: string,
        Postal_Code?:string,
        Country?: string,
        state?: string,
    }

    
}

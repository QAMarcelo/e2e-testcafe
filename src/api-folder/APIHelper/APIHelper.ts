import { t } from "testcafe";
import { attributeAPI, attributesIds, BillingSchedule, ChargeCodeAPI, StorageChargeAPI } from "../businessPartners";
import { BusinessPartnerAPI } from "../businessPartners/businessPartnerAPI";
import { iAttributeAPI, iBillingScheduleAPI, iBusinessPartnerAPI, iChargeCodeAPI, iItemStorageChargeAPI } from "../interfaces/iBusinessPartnerAPI";
import { iItemAPI, iIventoryAdjustmentAPI, iStorageChargeAPI, iUOMAPI, iUPCAPI } from "../interfaces/iItemAPI";
import { iStorageLocationAPI } from "../interfaces/iStorageLocationAPI";
import { iWarehouseAPI } from "../interfaces/iWarehouseAPI";
import { InventoryAdjustmentAPI } from "../inventory";
import { ItemAPI, Item_UOMType, UPCAPI } from "../itemSKUS";
import { StorageLocationAPI } from "../storageLocations/storageLocationAPI";
import { WarehouseAPI, WarehouseMode } from "../warehouses/warehousesAPI";


// export enum Checkbox {
//     Disabled = 0,
//     Enabled = 1
// }


export enum Velocity {
    Any = 0,
    A=1,
    B=2,
    C=4,
    D=8,
    E=16
}

export const LoadItemData = (item: ItemAPI, iItem?: iItemAPI): iItemAPI => {
    const idata : iItemAPI = {
        enabled: item.Enabled? Number(item.Enabled) : (iItem?.enabled?? 1),
        type: item.type ?? (iItem?.type ?? 1),
        category : item.Order_Velocity ?? (iItem?.category?? Velocity.Any),
        itemCode : item.ItemCode ?? item.Description,
        description : item.Description ?? item.ItemCode,
        valuePerEach : item.Declared_Value?? iItem?.valuePerEach,
        tempRangeMax: item.MaxTemp ?? iItem?.tempRangeMax,
        tempRangeMin: item.MinTemp ?? iItem?.tempRangeMin,
        //pickStyle : 
        //pickOffset?:                 number;
        //cycleCountEnable?:           number;
        //cycleCountStyle?:            number;
        //orderFreq?: number;
        //trackingStyleEnable?: number;
        //trackingStyleSn? number;
        si: item.SpecialInstructions?? iItem?.si,
        //trackingStyleContainer?:     number;
        //trackingStyleExpdate?:       number;
        //trackingStyleLot?:           number;
        //trackingStyleQuaranReldate?: number;
        //trackingStyleSnReverse?:     number;
        //trackingStyleUserdef?:       number;
        //trackingStyleWeight?:        number;
        vendorId: item.AccoundId ?? iItem?.vendorId,
        //uomId?:                      number;
        uom: item.UOM? loadUOMData(item) : iItem?.uom,
        kitSubItems: iItem?.kitSubItems ?? [],
        upcs: item.UPC? loadUPCData(item.UPC) : iItem?.upcs,
        itemWarehouses: iItem?.itemWarehouses ?? [],
        replenishmentPlans: iItem?.replenishmentPlans?? [],
        //vendorBrief: {},                
        //userDefined:                iUserDefined;
        buildable: item.buildable ?? (iItem?.buildable?? 1),
        //file?:                       File;
        //vendor: {id: item.AccoundId},
        aliases: iItem?.aliases ?? [],
        //events?:                     Event[];
        //storageLocations?:           any[];
        //nmfcCode:                   File;
        //hazmat:                     File;
        //storageCharge:              iStorageCharge;
        //inboundStorage:             File;
        //inboundHandling:            File;
        //outboundShipping:           File;
    }
    return idata;
}
const loadUOMData = (item: ItemAPI) : iUOMAPI => {
    item.UOM_type = item.UOM_type ?? Item_UOMType.Each;
    let uomValues: iUOMAPI = {}
    switch (item.UOM_type) {
        case Item_UOMType.Case:
            uomValues = {
                caseAbbrev :  item.UOM?.Abbreviation ?? "CS",
                caseDepth:  item.UOM?.Length,
                caseDescription: item.UOM?.Description ?? "Case",
                caseHasInnerpack: Number(item.UOM?.HasInnerpack),
                caseHeight:  item.UOM?.Height,
                caseMaxStackWeight: 0,
                caseTare: item.UOM?.GrossLBS,
                caseWeight:  item.UOM?.GrossLBS,
                caseWidth:  item.UOM?.Width,
            };
            break;
        case Item_UOMType.Each:
            uomValues = {
                eaAbbrev: item.UOM?.Abbreviation ?? "EA",
                eaCaseQty: item.UOM?.QTY_IP_CS,
                eaDepth: item.UOM?.Length,
                eaDescription: item.UOM?.Description ?? "Each", 
                eaHeight: item.UOM?.Height,
                eaTare: item.UOM?.Tare,
                eaWeight:item.UOM?.GrossLBS,
                eaWidth: item.UOM?.Width,
            };
         break;
        case Item_UOMType.InnerPack:
            uomValues = {
                ipAbbrev: item.UOM?.Abbreviation?? "IP",
                ipCaseQty: item.UOM?.QTY_EA_IP,
                ipDepth: item.UOM?.Length,
                ipDescription: item.UOM?.Description ?? "Inner Pack",
                ipHeight: item.UOM?.Height,
                ipTare: item.UOM?.Tare,
                ipWeight:item.UOM?.GrossLBS,
                ipWidth: item.UOM?.Width,
            }
            break;
        default:
            break;
    }
    const pallet: iUOMAPI = {
        style: 1,
        defaultOuom: item.UOM_type,
        palletHigh: item.UOM?.Pallet_High,
        palletTie: item.UOM?.Pallet_Tie,
        palletMaxStackWeight: item.UOM?.Pallet_MaxStackWeight
    }

    return {...uomValues,...pallet};
}
const loadUPCData = (ucps: UPCAPI[]): iUPCAPI[] => {

    const upcLoaded: iUPCAPI[] = []
    ucps?.forEach(upc => {
        upcLoaded.push(
            {
               itemDescription: upc.description,
               upc: upc.upc,
               lotCode: upc.lotCode,
               sublotCode: upc.subLoteCode,
               itemId: upc.itemId
            }
        )
    });
    return upcLoaded;
   // return upcLoaded;
    //return [];
}
export const LoadStorageLocationsData = (SLocation: StorageLocationAPI, iSLocation?: iStorageLocationAPI): iStorageLocationAPI => {
    const sLocation : iStorageLocationAPI = { 
        aisle: SLocation.Aisle?? iSLocation?.aisle,
        allowDamaged: SLocation.Inventory_Status?.Allow_Damaged ? Number(SLocation.Inventory_Status?.Allow_Damaged): iSLocation?.allowDamaged,
        allowHold: SLocation.Inventory_Status?.Allow_Hold? Number(SLocation.Inventory_Status?.Allow_Hold) : iSLocation?.allowHold,
        allowQuarantine: SLocation.Inventory_Status?.Allow_Quarantine? Number(SLocation.Inventory_Status?.Allow_Quarantine): iSLocation?.allowQuarantine,
        bay: SLocation.Bay?? iSLocation?.bay, 
        //caseFlag?:        number;
        category: SLocation.Category ?? (iSLocation?.category ?? 0),
        //classification?:  string;
        depth: SLocation.Length?? iSLocation?.depth,
        description: SLocation.Description?? iSLocation?.description,
        //eachFlag?:        number;
        enabled: SLocation.Enabled ? Number(SLocation.Enabled) : (iSLocation?.enabled ?? 1),
        height: SLocation.Height?? iSLocation?.height,
        invstatusAction: SLocation.Change_inventory_Status?? iSLocation?.invstatusAction,
        //level?:           string;
        modePick: SLocation.LocationType?.Pick_Allocation ? Number(SLocation.LocationType?.Pick_Allocation) : iSLocation?.modePick,
        modeProject: SLocation.LocationType?.Project? Number(SLocation.LocationType?.Project) : iSLocation?.modeProject,
        modePutawayBulk:SLocation.LocationType?.Bulk_Storage_Putaway? Number(SLocation.LocationType?.Bulk_Storage_Putaway): iSLocation?.modePutawayBulk,
        modePutawayRack: SLocation.LocationType?.Rack_Storage_Putaway? Number(SLocation.LocationType?.Rack_Storage_Putaway): iSLocation?.modePutawayRack,
        modeRecvDock: SLocation.LocationType?.Receiving_Dock? Number(SLocation.LocationType?.Receiving_Dock) : iSLocation?.modeRecvDock,
        modeRecvStage:SLocation.LocationType?.Receiving_Stage?  Number(SLocation.LocationType?.Receiving_Stage): iSLocation?.modeRecvStage,
        modeShipDock: SLocation.LocationType?.Shipping_Dock? Number(SLocation.LocationType?.Shipping_Dock) :iSLocation?.modeShipDock,
        modeShipStage: SLocation.LocationType?.Shipping_Stage? Number(SLocation.LocationType?.Shipping_Stage): iSLocation?.modeShipStage,
        numberPallets: SLocation.MaxLPN?? iSLocation?.numberPallets,
        //palletFlag?:      number;
        pickStyle: SLocation.Sequence?? iSLocation?.pickStyle,
        rateMultiplier: SLocation.Rate ?? (iSLocation?.rateMultiplier?? 1.0000),
        //si?:              string;
        //slot?:            string;
        //state?:           string;
        storageId: SLocation.StorageId?? iSLocation?.storageId,
        tempMax: SLocation.TempMax?? iSLocation?.tempMax,
        tempMin: SLocation.TempMin?? iSLocation?.tempMin,
        type: SLocation.Type ?? (iSLocation?.type ?? 1),
        uomAction: SLocation.Convert_Unit_of_Measure?? iSLocation?.uomAction,
        velocity0: SLocation.Item_Velocity?.VelocityAny? Number(SLocation.Item_Velocity?.VelocityAny): iSLocation?.velocity0,
        velocityA: SLocation.Item_Velocity?.VelocityA? Number(SLocation.Item_Velocity?.VelocityA): iSLocation?.velocityA,
        velocityB: SLocation.Item_Velocity?.VelocityB? Number(SLocation.Item_Velocity?.VelocityB): iSLocation?.velocityB,
        velocityC: SLocation.Item_Velocity?.VelocityC? Number(SLocation.Item_Velocity?.VelocityC): iSLocation?.velocityC,
        velocityD: SLocation.Item_Velocity?.VelocityD? Number(SLocation.Item_Velocity?.VelocityD): iSLocation?.velocityD,
        weightMax: SLocation.MaxWeight?? iSLocation?.weightMax,
        width: SLocation.Width?? iSLocation?.width,
        //xspace?:          number;
        //yspace?:          number;
        //zipEnd?:          string;
        //zipStart?:        string;
        zone: SLocation.Zone?? iSLocation?.zone,
        //zspace?:          number;
        warehouseId: SLocation.WarehouseId?? iSLocation?.warehouseId,
        //details?:         Details;
        //currentCube?:     number;
        //lpnCount?:        number;
        details: iSLocation?.details?? {},
        vendors: iSLocation?.vendors?? []

    };

    return sLocation;

}

export const LoadInventoryAdjustment = (invAdjs : InventoryAdjustmentAPI, itemId: number, storageId: number) : iIventoryAdjustmentAPI => {
    const iA : iIventoryAdjustmentAPI = {
        itemId: itemId,
        storageId: storageId,
        qty: invAdjs.qty,
        status: invAdjs.status,
        lot: invAdjs.lot,
        lpn: invAdjs.lpn,
        sublot: invAdjs.sublot
    }
    return iA;
}

const LoadVendorAttributes = (vendorAttributes: attributeAPI | undefined ): iAttributeAPI[] => {
    let attributes: iAttributeAPI[] = [];
    for(const area in vendorAttributes){

        for(const attr in vendorAttributes[area]){
            attributes.push({
                attribute: (attributesIds[area])[attr],
                ival : (vendorAttributes[area])[attr],
                dval: 0
            })
        }
    }
    return attributes;
}


const LoadChargeCodes = (chargeCodes: ChargeCodeAPI[] ): iChargeCodeAPI[] => {
    let cCodes: iChargeCodeAPI[] = [];
    if(chargeCodes!=undefined){
        chargeCodes.forEach(cc => {
            cCodes.push({
                code: cc.Code,
                description: cc.Description,
                type: cc.Type,
                autoApply: Number(cc.Automatically_add_to_orders),
                businessPartnerId: cc.businessPartnerId,
                maxCharge: cc.Max,
                minCharge: cc.Min,
                rate: cc.Rate,
                visibleOnScanner: Number(cc.Visible_On_Barcode_Scanning),
                rateAssoc: cc.Per,
                valueFrom: cc.Range_From,
                valueTo: cc.Range_To,
                glCode: cc.GLCode
            })
        });
    }
    return cCodes;
}

const LoadStorageCharges = (storageCharges: StorageChargeAPI[]) : iItemStorageChargeAPI[] => {
    let loadedStorageCharges: iItemStorageChargeAPI[] = []
    
    if(storageCharges!=undefined){
        storageCharges.forEach(sc => {
            loadedStorageCharges.push({
                //billingSchedules: sc.BillingSchedule,
                billingScheduleType: sc.BillingScheduleType,
                chargeClass: sc.Class,
                description: sc.Description,
                glcode: sc.GLCode,
                id: sc.id,
                minChg: sc.Min,
                rate: sc.Rate,
                type: sc.Type,
                rateAssoc: sc.Per,
                valFrom: sc.Range_From,
                valTo: sc.Range_To,
                billingSchedules: loadBllingSchedules(sc.BillingSchedules!)

            })
        });
    }
    return loadedStorageCharges;
}


const loadBllingSchedules=(billingSchedule: BillingSchedule[]) : iBillingScheduleAPI[]=>{
    let loadedBillingSchedule : iBillingScheduleAPI[] = [];

    if(billingSchedule!=undefined){
        billingSchedule.forEach(bs => {
            loadedBillingSchedule.push({
                rate: bs.Rate,
                valFrom: bs.Range_From,
                valTo: bs.Range_To
            })
        });
    }
    return loadedBillingSchedule;
}
export const LoadVendorData = (vendor: BusinessPartnerAPI, iVendor?: iBusinessPartnerAPI) : iBusinessPartnerAPI=> {
    
    vendor.AccountId = vendor.AccountId?? vendor.Description;

    const BP : iBusinessPartnerAPI = {
        id: vendor.Id?? iVendor?.id,
        accountid: vendor.AccountId?? iVendor?.accountid,
        description: vendor.Description?? iVendor?.description ,
        enabled: vendor.Enable? Number(vendor.Enable): (iVendor?.enabled?? 1),
        mcountry: vendor.Mailing_address?.Country? vendor.Mailing_address?.Country: iVendor?.mcountry,
        mstate: vendor.Mailing_address?.state? vendor.Mailing_address?.state : iVendor?.mstate,
        rateMultiplier: vendor.RateMultiplier? vendor.RateMultiplier : iVendor?.rateMultiplier,
        scountry: vendor.Shipping_Address?.Country? vendor.Shipping_Address.Country : iVendor?.scountry,
        sstate: vendor.Shipping_Address?.state? vendor.Shipping_Address.state : iVendor?.sstate,
        type: vendor.Type ?? (iVendor?.type ?? 1),
        attributes: vendor.Attributes? LoadVendorAttributes(vendor.Attributes) : iVendor?.attributes,
        chargeCodes: vendor.ChargeCode? LoadChargeCodes(vendor.ChargeCode) : iVendor?.chargeCodes,       
        //notes?:                 any[];
        //scripts?:               any[];
        itemStorageCharges: LoadStorageCharges(vendor.StorageCharges!),  
        //autoChargeCodes?:       any[];
        //shippingPreDefTitles?:  PreDefTitles;
        //receivingPreDefTitles?: PreDefTitles;
        //workOrderPreDefTitles?: PreDefTitles;
        //shipmentPreDefTitles?:  ShipmentPreDefTitles;
        //defaultBillings?:       DefaultBilling[];
        //events?:                Event[];
        //nmfcCodes?:             any[];
        //scriptMaps?:            any[];
        //attributeMaps?:         any[];
        //monthlyBillings?:       any[];
        //carrierFees?:           any[];
        //files?:                 any[];
        //rateMultipliers?:       any[];
        //serviceLanes?:          any[];
        //carrierRoutes?:         any[];
        //proSettings?:           any[];
    };
   //console.log(BP);
    return BP;
}


export const LoadWarehouseData = (warehosue: WarehouseAPI, iwarehouseAPI?: iWarehouseAPI) : iWarehouseAPI=> {

    const WH: iWarehouseAPI = {
        id : warehosue.id ?? iwarehouseAPI?.id,
        category: warehosue.category ?? (iwarehouseAPI?.category?? 0),
        description: warehosue.description ?? (iwarehouseAPI?.description),
        enabled: warehosue.enabled? Number(warehosue.enabled) : (iwarehouseAPI?.enabled ?? Number(true)),
        mode: warehosue.mode? Number(warehosue.mode) : (iwarehouseAPI?.mode ?? Number(WarehouseMode.barcodeScanning)), 
        bonded: warehosue.bonded ?? (iwarehouseAPI?.bonded ?? 1),
        lockedCreate: warehosue.lockedCreate ?? (iwarehouseAPI?.lockedCreate?? 0),
        printGuid: warehosue.printGuid ?? (iwarehouseAPI?.printGuid?? t.ctx.Session),

        address1:         warehosue.address1?? iwarehouseAPI?.address1,
        address2:         warehosue.address2?? iwarehouseAPI?.address2,
        city:             warehosue.city?? iwarehouseAPI?.city,
        state:            warehosue.state?? iwarehouseAPI?.state,
        zip:              warehosue.zip?? iwarehouseAPI?.zip,
        country:          warehosue.country?? iwarehouseAPI?.country,
        adminName:        warehosue.adminName?? iwarehouseAPI?.adminName,
        adminPhone:       warehosue.adminPhone?? iwarehouseAPI?.adminPhone,
        adminEmail:       warehosue.adminEmail?? iwarehouseAPI?.adminEmail,
        opdayMon:         warehosue.opdayMon?? iwarehouseAPI?.opdayMon,
        opdayTue:         warehosue.opdayTue?? iwarehouseAPI?.opdayTue,
        opdayWed:         warehosue.opdayWed?? iwarehouseAPI?.opdayWed,
        opdayThu:         warehosue.opdayThu?? iwarehouseAPI?.opdayThu,
        opdayFri:         warehosue.opdayFri?? iwarehouseAPI?.opdayFri,
        opdaySat:         warehosue.opdaySat?? iwarehouseAPI?.opdaySat,
        opdaySun:         warehosue.opdaySun?? iwarehouseAPI?.opdaySun,
        clazz:            warehosue.clazz?? iwarehouseAPI?.clazz,
        nlIP:             warehosue.nlIP?? iwarehouseAPI?.nlIP,
        nlPort:           warehosue.nlPort?? iwarehouseAPI?.nlPort,
        nlLabelDirectory: warehosue.nlLabelDirectory?? iwarehouseAPI?.nlLabelDirectory,
        invoiceSequence:  warehosue.invoiceSequence?? iwarehouseAPI?.invoiceSequence
    }
    return WH;
}
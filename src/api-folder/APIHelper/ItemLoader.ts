import { iItemAPI, iItemUOMAPI, iItemUPCAPI } from "../interfaces/iItemAPI";
import { ItemAPI, Item_UOMType, UPCAPI } from "../itemSKUS";
import { Velocity } from "./StorageLocationLoader";



export const LoadItemData = (item: ItemAPI, iItem?: iItemAPI): iItemAPI => {

    const idata = iItem? {...iItem} : {};
    
    idata.id= item.Id?? iItem?.id;
    idata.enabled= item.Enabled? Number(item.Enabled) : (iItem?.enabled?? 1);
    idata.type= item.type ?? (iItem?.type ?? 1);
    idata.category = item.Order_Velocity ?? (iItem?.category?? Velocity.Any);
    idata.itemCode = item.ItemCode ?? item.Description;
    idata.description = item.Description ?? item.ItemCode;
    idata.valuePerEach = item.Declared_Value?? iItem?.valuePerEach;
    idata.tempRangeMax= item.MaxTemp ?? iItem?.tempRangeMax;
    idata.tempRangeMin= item.MinTemp ?? iItem?.tempRangeMin;
    //idata.pickStyle = 
    //idata.pickOffset?=                 number;
    //idata.cycleCountEnable?=           number;
    //idata.cycleCountStyle?=            number;
    //idata.orderFreq?= number;
    //idata.trackingStyleEnable?= number;
    //idata.trackingStyleSn?=number;
    idata.si= item.SpecialInstructions?? iItem?.si;
    //idata.trackingStyleContainer?=     number;
    //idata.trackingStyleExpdate?=       number;
    //idata.trackingStyleLot?=           number;
    //idata.trackingStyleQuaranReldate?= number;
    //idata.trackingStyleSnReverse?=     number;
    //idata.trackingStyleUserdef?=       number;
    //idata.trackingStyleWeight?=        number;
    idata.vendorId= item.AccoundId ?? iItem?.vendorId;
    //idata.uomId?=                      number;
    idata.uom= loadUOMData(item, iItem);
    //idata.kitSubItems= iItem?.kitSubItems ?? [];
    idata.upcs= loadUPCData(item.UPC ?? [], iItem?.upcs) ;
    idata.itemWarehouses= iItem?.itemWarehouses ?? [];
    idata.replenishmentPlans= iItem?.replenishmentPlans?? [];
    //idata.vendorBrief= {};                
    //idata.userDefined=                iUserDefined;
    idata.buildable= item.buildable ?? (iItem?.buildable?? 1);
    //idata.file?=                       File;
    //idata.vendor= {id: item.AccoundId};
    //idata.aliases= iItem?.aliases ?? [];
    //idata.events?=                     Event[];
    //idata.storageLocations?=           any[];
    //idata.nmfcCode=                   File;
    //idata.hazmat=                     File;
    //idata.storageCharge=              iStorageCharge;
    //idata.inboundStorage=             File;
    //idata.inboundHandling=            File;
    //idata.outboundShipping=           File;
    return idata;
}

const loadUOMData = (item: ItemAPI, iItem?: iItemAPI) : iItemUOMAPI => {
    const iUom = {...iItem?.uom};

    item.UOM_type = item.UOM_type ?? iUom?.defaultOuom?? Item_UOMType.Each;
    let uomValues: iItemUOMAPI = {}
    switch (item.UOM_type) {
        case Item_UOMType.Case:
            uomValues = {
                caseAbbrev :  item.UOM?.Abbreviation ?? iUom?.caseAbbrev ?? "CS",
                caseDepth:  item.UOM?.Length?? iUom?.caseDepth,
                caseDescription: item.UOM?.Description ?? iUom?.caseDescription?? "Case",
                caseHasInnerpack: item.UOM?.HasInnerpack? Number(item.UOM?.HasInnerpack): iUom?.caseHasInnerpack,
                caseHeight:  item.UOM?.Height?? iUom?.caseHeight,
                //caseMaxStackWeight: iUom?.caseMaxStackWeight?? 0,
                caseTare: item.UOM?.GrossLBS?? iUom?.caseTare,
                caseWeight:  item.UOM?.GrossLBS ?? iUom?.caseWeight,
                caseWidth:  item.UOM?.Width ?? iUom?.caseWidth,
            };
            break;
        case Item_UOMType.Each:
            uomValues = {
                eaAbbrev: item.UOM?.Abbreviation ?? iUom?.eaAbbrev?? "EA",
                eaCaseQty: item.UOM?.QTY_IP_CS ?? iUom?.eaCaseQty,
                eaDepth: item.UOM?.Length ?? iUom?.eaDepth,
                eaDescription: item.UOM?.Description ?? iUom?.eaDescription ?? "Each", 
                eaHeight: item.UOM?.Height?? iUom?.eaHeight,
                eaTare: item.UOM?.Tare ?? iUom?.eaTare,
                eaWeight:item.UOM?.GrossLBS ?? iUom?.eaWeight,
                eaWidth: item.UOM?.Width ?? iUom?.eaWidth,
            };
         break;
        case Item_UOMType.InnerPack:
            uomValues = {
                ipAbbrev: item.UOM?.Abbreviation?? iUom?.ipAbbrev?? "IP",
                ipCaseQty: item.UOM?.QTY_EA_IP?? iUom?.ipCaseQty,
                ipDepth: item.UOM?.Length?? iUom?.ipDepth,
                ipDescription: item.UOM?.Description ?? iUom?.ipDescription?? "Inner Pack",
                ipHeight: item.UOM?.Height?? iUom?.ipHeight,
                ipTare: item.UOM?.Tare?? iUom?.ipTare,
                ipWeight:item.UOM?.GrossLBS?? iUom?.ipWeight,
                ipWidth: item.UOM?.Width?? iUom?.ipWidth,
            }
            break;
        default:
            break;
    }
    const pallet: iItemUOMAPI = {
        style: item.UOM?.style?? (iUom?.style ?? 1),
        defaultOuom: item.UOM_type ?? (iUom?.defaultOuom ?? 1),
        palletHigh: item.UOM?.Pallet_High?? iUom?.palletHeight,
        palletTie: item.UOM?.Pallet_Tie?? iUom?.palletTie,
        palletMaxStackWeight: item.UOM?.Pallet_MaxStackWeight?? iUom?.palletMaxStackWeight,
        vendorId: item.UOM?.vendorId ?? iUom.vendorId,
    }

    return {...uomValues,...pallet};
}
export const loadUPCData = (ucps: UPCAPI[], iupcs?: iItemUPCAPI[]): iItemUPCAPI[] => {

    const upcLoaded: iItemUPCAPI[] = []
    ucps?.forEach(upc => {
        let existingUPC = iupcs?.find(x=> {return x.upc == upc.upc && x.itemDescription == upc.description} )
        upcLoaded.push(
            {
               itemDescription: existingUPC?.itemDescription ?? upc.description,
               upc: existingUPC?.upc ?? upc.upc,
               lotCode: existingUPC?.lotCode ?? upc.lotCode,
               sublotCode: existingUPC?.sublotCode ?? upc.subLoteCode,
               itemId: existingUPC?.itemId ?? upc.itemId
            }
        )
    });
    // return upcLoaded;
    return []
}
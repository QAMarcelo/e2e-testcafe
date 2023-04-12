
import { Velocity } from "../APIHelper/APIHelper";
import { InventoryAdjustmentAPI } from "../inventory";


export enum Item_UOMType{
    Each = 1,
    InnerPack = 2,
    Case= 3
}

export interface UPCAPI {
    description: string,
    lotCode?: string,
    subLoteCode?: string
    upc: string,
    itemId?: number

}
export interface UOMAPI {
    id?: number,
    vendorId?: number,
    itemId?: number,
    si?: string,
    style?: 1 | number,

    //Type: Item_UOMType, 
    Abbreviation?: string,
    Description?: string,
    HasInnerpack?: boolean,
    Length?: number, // Depth
    Width?: number,
    GrossLBS?: number, //Weight
    Height?: number, 
    Tare?: number, //Tare
    QTY_IP_CS?: number, //eaCaseQty
    QTY_EA_IP?: number, //ipCaseQty
    
    Pallet_Tie?: number,
    Pallet_High?: number,
    Pallet_MaxStackWeight?: number, 
}

export interface ItemsAPI {
    warehouseId: number,
    Items: ItemAPI[]
}

export interface ItemAPI {
    Id?: number,
    type?: number,
    Enabled?: boolean,
    ItemCode: string,
    Description?: string,
    Account: string,
    AccoundId?: number,
    SKU?: string,
    UOM_type : Item_UOMType, 
    buildable?: number, //default 1
    Order_Velocity?: Velocity, //category
    UOM?: UOMAPI,
    UPC?: UPCAPI[],
    Declared_Value?: number, //valuePerEach
    MaxTemp? : number,
    MinTemp?: number,
    SpecialInstructions? : string,
    inventoryAdjustment?: InventoryAdjustmentAPI[]
}
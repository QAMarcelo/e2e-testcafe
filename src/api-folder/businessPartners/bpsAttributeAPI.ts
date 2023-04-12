

export const attributesIds = {
    General_Properties: {  
        allocation_mode: 104
    },
    Receiving : {
        Barcode_Scanning_style: 94,
        Barcode_scanning: 83
    },

    Barcode_Scanning: {
        Pick_to_Mode: 566,
        Putaway_Prioritizaion: 1019,
        Putaway_Style: 56,
        Enable_Variable_lot_Code: 378,
        Enable_Variable_Sub_Lot_code: 379
    },

    Billing:{
        Renewal_Storage_Mode: 93,
        Anniversary_Cycle_in_Days: 575
    },
    Shipping:{
        Barcode_Scanning: 312,
        Barcode_scanning_Style: 95
    },
    Inventory:{
        Track_lot_codes: 48,
        Track_Sub_lot_Codes: 41,
        Allocation_Mode: 147
    }
}
export enum GeneralProperties_AllocationMode{
    Automatic= 0,
    Manual   = 1
}
export enum Receiving_BarcodeScanningStyles {
    SSCC=1,
    Line= 2,
    UPC = 6
}

export enum BarcodeScanning_PickToMode {
    None = -1,
    Pallet= 1,
    Carton= 2,
    Tote= 3,
    Location_Only= 100
}
export enum BarcodeScanning_PutawayPrioritization {
    Location_Ascending= 0,
    Least_Occupied= 1,
    Most_Occupied= 2
}
export enum BarcodeScanning_PutawayStyle {
    None= 0,
    Item_Code= 1,
    Item_and_LotCode= 2,
    Item_lot_and_SublotCode= 3,
    LotCode= 4,
    SubLotCode= 5
}

export enum Billing_RenewalStorageMode {
    Order_Fulfillment= 1,
    Daily_rate= 3,
    Anniversary= 4,
    Order_Fulfillment_Vol_Range= 7,
    Order_Fulfillment_Vol_Range_UOM= 8,
    Occupied_Locations= 9,
    Peak= 10,
    Average= 11
}

export enum Shipping_BarcodeScanningStyle {
    SSCC=1,
    Line= 2,
    Manual_ILS= 3,
    UPC_Lookup= 6
}

export enum Inventory_AllocationMode {
    FIFO= 0,
    LIFO= 1,
    FEFO= 2,
    Location_Ascending= 3,
    Location_Descending= 4,
    Primary_Pick1= 5,
    Primary_Pick2= 6,
    Pick_to_clean= 7,
    Largest_Exact_Qty_Palelt= 8,
    Forward_Picking=9
}

export interface attributeAPI {
    id?: number,
    General_Properties?: {  
        allocation_mode?: GeneralProperties_AllocationMode
    },
    Receiving? : {
        Barcode_Scanning_style?: Receiving_BarcodeScanningStyles
        Barcode_scanning?: boolean
    },

    Barcode_Scanning?: {
        Pick_to_Mode?: BarcodeScanning_PickToMode,
        Putaway_Prioritizaion?: BarcodeScanning_PutawayPrioritization,
        Putaway_Style?: BarcodeScanning_PutawayStyle,
        Enable_Variable_lot_Code?: boolean,
        Enable_Variable_Sub_Lot_code?: boolean
    },

    Billing?:{
        Renewal_Storage_Mode?: Billing_RenewalStorageMode
        Anniversary_Cycle_in_Days?: Number
    },
    Shipping?:{
        Barcode_Scanning?: boolean,
        Barcode_scanning_Style?: Shipping_BarcodeScanningStyle
    },
    Inventory?:{
        Track_lot_codes?: boolean,
        Track_Sub_lot_Codes?: boolean,
        Allocation_Mode?: Inventory_AllocationMode
    }
}



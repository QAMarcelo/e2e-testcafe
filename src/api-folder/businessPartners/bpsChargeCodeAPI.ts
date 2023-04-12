
export enum ChargeCode_rateAssoc {
    All= -1,
    Each_or_Equivalent=1,
    Inner_Pack_Or_Equivalent=5,
    Case_Or_Equivalent=2,
    LPN_or_Equivalent=3
}
export enum ChargeCode_Types {
    Flate_Rate=1,
    Inbound_Handling_Per_Kit=36,
    Inbound_Handling_Per_Kit_Volume=33,
    Inbound_Handling_Per_Kit_Weight=30,
    Inbound_Handling_Per_Net_Weight=50,
    Inbound_Handling_Per_UOM= 15,
    Inbound_Handling_Per_Volume_Range=16,
    Inbound_Handling_Per_Weight= 18,
    Inbound_Handling_Per_Weight_Range=17,
    Inbound_Handling_Volume_Per_UOM= 78,
    Inbound_Storage_Per_Kit= 35,
    Inbound_Storage_Per_Kit_Volume= 32,
    Inbound_Storage_Per_Kit_Weight= 29,
    Inbound_Storage_Per_Net_Weight= 49,
    Inbound_Storage_Per_UOM= 10,
    Inbound_Storage_Per_Volume_Range=12,
    Inbound_Storage_Per_Weight= 14,
    Inbound_Storage_Per_Weight_Range= 13,
    Inbound_Storage_Volume_Per_UOM= 77,
    Item= 8,
    Outbound_Shipping_Per_Kit= 37,
    Outbound_Shipping_Per_Kit_Volume= 34,
    Outbound_Shipping_Per_Kit_Weight= 31,
    Outbound_Shipping_Per_Net_Weight= 51,
    Outbound_Shipping_Per_UOM= 20,
    Outbound_Shipping_Per_Volume_Range= 22,
    Outbound_Shipping_Per_Weight= 21,
    Outbound_Shipping_Volume_Per_UOM= 79,
    Outbound_Shipping_Per_Full_LPN_Pick= 81,
    Packed_Carton= 61,
    Per_Hour= 5,
    Per_Kit= 42,
    Per_Order_Line= 43,
    Per_Order_Line_Range= 91,
    Per_Square_Foot= 54,
    Per_UOM= 2,
    Per_Volume= 3,
    Per_Volume_Range= 6,
    Per_Weight= 4,
    Per_Weight_Range= 7,
    Third_Party_Shipping= 11,
    Flat_Rate_Per_Carrier= 19,
    Per_Label_Charge= 25,
    Min_Order_Charge= 44, 
    Discount= 60,
    Order_Total_Quantity_Range= 63,
    Per_CWT= 23,
    Fuel_SurCharge= 24,
    Per_Stop= 45,
    Driver_Detention= 46,
    Per_LPN= 52,
    Per_Mile= 53,
    WMS_Distinct_LPNs= 75,
    Carton_Stock= 76, 
    Work_Order_Material= 90
}

export interface ChargeCodeAPI {
    Code: string,
    Type: ChargeCode_Types,
    businessPartnerId?: number,
    Description: string,
    Rate: number,
    Per?: ChargeCode_rateAssoc,
    Range_From?: number,
    Range_To?: number,
    Min?: number,
    Max?: number,
    GLCode?: string,
    Automatically_add_to_orders: boolean,
    Visible_On_Barcode_Scanning?: boolean
}

export interface ChargeCodes {
    ChargeCodes : ChargeCodeAPI[]
}
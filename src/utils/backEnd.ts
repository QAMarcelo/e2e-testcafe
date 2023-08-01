import { InitAPI } from "./initializer";


export interface InventoryData {
    Warehouse: string,
    Vendor: string,
    Item: string,
    Lot?: string,
    SubLot?: string,
    SKU?: string
  }


export interface iItemStock {
    //itemId: 15557,
    itemCode: string,
    itemDescription: string,
    lotCode: string,
    sublotCode: string,
    qtyAvailable: number,
    qtyPlanned: number,
    qtyAllocated: number,
    qtyDamaged: number,
    qtyHold: number,
    qtyQuarantine: number,
    totalQty: number,
    //vendorId: 16909,
    vendorDescription: string,
    uomAbbrev: string,
    pieceCount: number
}
export class backEnd {
      
    public GetItemStockDetail = async(inventoryData: InventoryData): Promise<iItemStock> => {
        const apiCall = InitAPI();
        const result = await apiCall.getItemDetail(inventoryData.Warehouse, inventoryData.Item, inventoryData.Lot, inventoryData.SubLot, inventoryData.Vendor, inventoryData.SKU);
        return result as iItemStock;
    }




}
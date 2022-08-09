import { t } from "testcafe";
import { MenuItem } from "./menuItem";


export class menu { 

    // First Level
    Orders : MenuItem;
        BillofLading: MenuItem;
            ConsolidatedBillOfLading: MenuItem;
            MasterBillOfLading: MenuItem;
        ShippingOrders: MenuItem;
        PurchaseOrders: MenuItem;
        ReceivingOrders: MenuItem;
        WorkOrders: MenuItem;

    Warehouse : MenuItem;
        BarcodeScanningTasks: MenuItem;
            PickingTasks: MenuItem;
            ReceivingTasks: MenuItem;
            PutAwayTasks: MenuItem;
            WorkOrderTasks: MenuItem;
        CartonStock: MenuItem;
        Cartonization:MenuItem;
        InventoryByLPN: MenuItem;
        InventoryByLocation: MenuItem;
        ItemIventory: MenuItem;
        Items_SKUs: MenuItem;
        KitInventory: MenuItem;
        Kits_BOM: MenuItem;
        PrintQueue: MenuItem;
        Printers: MenuItem;
        ScanPack: MenuItem;
        StorageLocationGroups: MenuItem;
        StorageLocationsByAccount: MenuItem;
        UPCCodes: MenuItem;
        WavePickTickets: MenuItem

    Transportation : MenuItem;
        Dispatch: MenuItem;
        Loads: MenuItem;
        Shipments: MenuItem;
        RateTariffs: MenuItem;
        CarrierQuoteHistory: MenuItem;
        PendingQuotes: MenuItem;
        ServiceLanes: MenuItem;

    Yard : MenuItem;
        Equipment: MenuItem;
        Appointments: MenuItem;
        Locations: MenuItem;

    BusinessPartners : MenuItem;
        Accounts: MenuItem;
        Carriers: MenuItem;
        Customers: MenuItem;
        Shippers: MenuItem;
        Suppliers: MenuItem;

    Channels : MenuItem;
        IntegrationStore: MenuItem;
        OutboundChannel: MenuItem;
        ReceivingChannel: MenuItem;
        ShippingChannel: MenuItem;

    AccountingIntegration: MenuItem;
        Invoicing: MenuItem;

    Settings: MenuItem;
        setting_Cartonization: MenuItem;
            CartonizationRules: MenuItem;
            CartonizationItemGroups: MenuItem;
        Setting_Exceptions: MenuItem;
        Setting_Hazmat: MenuItem;
        Setting_ReportAdmin: MenuItem;
        Setting_ReportFiles: MenuItem;
        Setting_Security: MenuItem;
            Security_Users: MenuItem;
            Security_Drivers: MenuItem;
            Security_UserGroups: MenuItem;
        Setting_Sequences: MenuItem;
        Setting_ServiceClasses: MenuItem;
        Setting_SessionManagement: MenuItem;
        Setting_SystemDocuments: MenuItem;
        Setting_SystemParemeters: MenuItem;
        Setting_WarehouseTerminal: MenuItem;

    Reports: MenuItem;
    Import: MenuItem;

    Dahsboard: MenuItem;
        SmallParcelErrors: MenuItem;
        UserMessages: MenuItem;

    NeedHelp: MenuItem;

    constructor() { 
        this.Orders = new MenuItem('Orders', null);
            this.BillofLading = new MenuItem('Bill of Lading', this.Orders);
                this.ConsolidatedBillOfLading = new MenuItem('Consolidated Bill Of Lading', this.BillofLading);
                this.MasterBillOfLading = new MenuItem('Master Bill Of Lading', this.BillofLading);
            this.ShippingOrders = new MenuItem('Shipping Orders', this.Orders);
            this.PurchaseOrders = new MenuItem('Purchase Orders', this.Orders);
            this.ReceivingOrders = new MenuItem('Receiving Orders', this.Orders);
            this.WorkOrders = new MenuItem('Work Orders', this.Orders);

        this.Warehouse = new MenuItem('Warehouse');
            this.BarcodeScanningTasks = new MenuItem('Barcode Scanning Tasks', this.Warehouse);
                this.PickingTasks = new MenuItem('Picking Tasks', this.BarcodeScanningTasks);
                this.ReceivingChannel = new MenuItem('Receiving Tasks', this.BarcodeScanningTasks);
                this.PutAwayTasks = new MenuItem('Put Away Tasks', this.BarcodeScanningTasks);
                this.WorkOrderTasks = new MenuItem('Work Order Tasks', this.BarcodeScanningTasks);
            this.CartonStock = new MenuItem('Carton Stock', this.Warehouse);
            this.Cartonization = new MenuItem('Cartonization', this.Warehouse);
            this.InventoryByLPN = new MenuItem('Inventory By LPN', this.Warehouse);
            this.InventoryByLocation = new MenuItem('Inventory By Location', this.Warehouse);
            this.ItemIventory = new MenuItem('Item Inventory', this.Warehouse);
            this.Items_SKUs = new MenuItem('Items / SKUs', this.Warehouse);
            this.KitInventory = new MenuItem('Kit Inventory',  this.Warehouse);
            this.Kits_BOM = new MenuItem('Kits / BOM', this.Warehouse);
            this.PrintQueue = new MenuItem('Print Queue', this.Warehouse);

        this.Transportation = new MenuItem('Transportation');
        this.Yard = new MenuItem('Yard');
        this.BusinessPartners = new MenuItem('Business Partners');
        this.Channels = new MenuItem('Channels');
        this.AccountingIntegration = new MenuItem('Accounting Integration');
        this.Settings = new MenuItem('Settings');
        this.Reports = new MenuItem('Reports');
        this.Import = new MenuItem('Import');
        this.Dahsboard = new MenuItem('Dahsboard');
        this.NeedHelp = new MenuItem('Need Help?');
    }
}

// Settings interface
export interface Settings {
  language: 'ar' | 'en';
  currencySymbol: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  autoPrintReceipt: boolean;
  autoKitchenPrint: boolean;
  receiptWidth: number;
  showLogo: boolean;
  taxRate: number;
  receiptFooter: string;
  allowOrderModification: boolean;
  requireAdminForVoid: boolean;
  requireAdminForDiscount: boolean;
  receiptPrinter?: string;
  kitchenPrinter?: string;
}

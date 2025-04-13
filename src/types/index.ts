export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  CASHIER = 'cashier',
  KITCHEN = 'kitchen',
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  VIEW_REPORTS: 'view_reports',
  MANAGE_PRODUCTS: 'manage_products',
  CREATE_ORDERS: 'create_orders',
  CANCEL_ORDERS: 'cancel_orders',
  MODIFY_ORDERS: 'modify_orders',
  APPLY_DISCOUNTS: 'apply_discounts',
  CLOSE_REGISTER: 'close_register',
  KITCHEN_DISPLAY: 'kitchen_display',
  ACCESS_SETTINGS: 'access_settings',
  MANAGE_SETTINGS: 'manage_settings',
};

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  price: number;
  cost: number;
  image?: string;
  isAvailable: boolean;
  description?: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
  modifiers?: OrderItemModifier[];
}

export interface OrderItemModifier {
  name: string;
  price: number;
}

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'buyXgetY';
  value: number;
  buyCount?: number;
  getFreeCount?: number;
  applicableProductIds?: string[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  discount?: Discount;
  discountAmount: number;
  finalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  orderNumber: number;
  cashierId: string;
  customerName?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  isVoided?: boolean;
  kitchenStatus?: KitchenOrderStatus;
  preparationTime?: number;
  estimatedCompletionTime?: Date;
}

export type OrderStatus = 'pending' | 'completed' | 'canceled';
export type KitchenOrderStatus = 'new' | 'in-progress' | 'ready' | 'delivered';
export type PaymentMethod = 'cash' | 'card' | 'other';

export interface DailySummary {
  date: Date;
  totalSales: number;
  totalOrders: number;
  totalProfit: number;
  expectedCashInDrawer: number;
  productsSold: {
    productId: string;
    productName: string;
    quantity: number;
    sales: number;
    profit: number;
  }[];
}

export interface CashDrawer {
  initialAmount: number;
  currentAmount: number;
  transactions: {
    id: string;
    type: 'sale' | 'refund' | 'payout' | 'cashin';
    amount: number;
    orderId?: string;
    note?: string;
    timestamp: Date;
    userId: string;
  }[];
  lastClosedAt?: Date;
}

export interface Settings {
  language: 'ar' | 'en';
  businessName: string;
  businessNameAr?: string;
  businessAddress?: string;
  businessPhone?: string;
  logoUrl?: string;
  receiptFooter?: string;
  receiptFooterAr?: string;
  taxRate?: number;
  currencySymbol: string;
  orderNumberPrefix?: string;
  allowOrderModification: boolean;
  requireAdminForVoid: boolean;
  requireAdminForDiscount: boolean;
  autoPrintReceipt: boolean;
  autoKitchenPrint?: boolean;
  showPriceOnKitchenDisplay?: boolean;
  kitchenDisplayTimeout?: number;
  receiptPrinter?: string;
  kitchenPrinter?: string;
  receiptWidth?: number;
  showLogo?: boolean;
}

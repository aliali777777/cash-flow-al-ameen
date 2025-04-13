
import { User, Product, Order, CashDrawer, Settings, DailySummary } from '../types';

// Default admin user
const defaultAdmin: User = {
  id: '1',
  username: 'admin',
  password: 'admin',
  role: 'admin',
  permissions: [],
  isActive: true,
};

// Default settings
const defaultSettings: Settings = {
  language: 'ar',
  businessName: 'Cashflow POS',
  businessNameAr: 'كاش فلو',
  currencySymbol: '$',
  allowOrderModification: true,
  requireAdminForVoid: true,
  requireAdminForDiscount: true,
  autoPrintReceipt: true,
  showPriceOnKitchenDisplay: false,
  kitchenDisplayTimeout: 5, // minutes
};

// Storage keys
const STORAGE_KEYS = {
  USERS: 'pos_users',
  PRODUCTS: 'pos_products',
  ORDERS: 'pos_orders',
  CASH_DRAWER: 'pos_cash_drawer',
  SETTINGS: 'pos_settings',
  DAILY_SUMMARY: 'pos_daily_summary',
  CURRENT_USER: 'pos_current_user',
};

// Initialize storage with default data if empty
export const initStorage = (): void => {
  // Check if users exist
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultAdmin]));
  }

  // Check if settings exist
  const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }

  // Initialize empty product list if not exists
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
  }

  // Initialize empty orders list if not exists
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }

  // Initialize cash drawer if not exists
  if (!localStorage.getItem(STORAGE_KEYS.CASH_DRAWER)) {
    const initialCashDrawer: CashDrawer = {
      initialAmount: 0,
      currentAmount: 0,
      transactions: []
    };
    localStorage.setItem(STORAGE_KEYS.CASH_DRAWER, JSON.stringify(initialCashDrawer));
  }

  // Initialize daily summary if not exists
  if (!localStorage.getItem(STORAGE_KEYS.DAILY_SUMMARY)) {
    localStorage.setItem(STORAGE_KEYS.DAILY_SUMMARY, JSON.stringify([]));
  }
};

// Generic get function
export const getItems = <T>(key: string): T[] => {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

// Generic set function
export const setItems = <T>(key: string, items: T[]): void => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Generic get single item function
export const getItem = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

// Generic set single item function
export const setItem = <T>(key: string, item: T): void => {
  localStorage.setItem(key, JSON.stringify(item));
};

// User specific functions
export const getUsers = (): User[] => getItems<User>(STORAGE_KEYS.USERS);
export const setUsers = (users: User[]): void => setItems(STORAGE_KEYS.USERS, users);
export const getUserById = (id: string): User | undefined => {
  return getUsers().find(user => user.id === id);
};
export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  setUsers(users);
};
export const updateUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    setUsers(users);
  }
};
export const deleteUser = (id: string): void => {
  const users = getUsers().filter(user => user.id !== id);
  setUsers(users);
};

// Current User functions
export const setCurrentUser = (user: User): void => {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
};
export const getCurrentUser = (): User | null => {
  return getItem<User>(STORAGE_KEYS.CURRENT_USER);
};
export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Product specific functions
export const getProducts = (): Product[] => getItems<Product>(STORAGE_KEYS.PRODUCTS);
export const setProducts = (products: Product[]): void => setItems(STORAGE_KEYS.PRODUCTS, products);
export const getProductById = (id: string): Product | undefined => {
  return getProducts().find(product => product.id === id);
};
export const addProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  setProducts(products);
};
export const updateProduct = (product: Product): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    setProducts(products);
  }
};
export const deleteProduct = (id: string): void => {
  const products = getProducts().filter(product => product.id !== id);
  setProducts(products);
};

// Order specific functions
export const getOrders = (): Order[] => getItems<Order>(STORAGE_KEYS.ORDERS);
export const setOrders = (orders: Order[]): void => setItems(STORAGE_KEYS.ORDERS, orders);
export const getOrderById = (id: string): Order | undefined => {
  return getOrders().find(order => order.id === id);
};
export const addOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  setOrders(orders);
};
export const updateOrder = (order: Order): void => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === order.id);
  if (index !== -1) {
    orders[index] = order;
    setOrders(orders);
  }
};
export const deleteOrder = (id: string): void => {
  const orders = getOrders().filter(order => order.id !== id);
  setOrders(orders);
};
export const getTodaysOrders = (): Order[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return getOrders().filter(order => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
};

// Cash drawer functions
export const getCashDrawer = (): CashDrawer => {
  return getItem<CashDrawer>(STORAGE_KEYS.CASH_DRAWER) || {
    initialAmount: 0,
    currentAmount: 0,
    transactions: []
  };
};
export const setCashDrawer = (cashDrawer: CashDrawer): void => {
  setItem(STORAGE_KEYS.CASH_DRAWER, cashDrawer);
};
export const addCashDrawerTransaction = (transaction: CashDrawer['transactions'][0]): void => {
  const cashDrawer = getCashDrawer();
  cashDrawer.transactions.push(transaction);
  
  if (transaction.type === 'sale' || transaction.type === 'cashin') {
    cashDrawer.currentAmount += transaction.amount;
  } else if (transaction.type === 'refund' || transaction.type === 'payout') {
    cashDrawer.currentAmount -= transaction.amount;
  }
  
  setCashDrawer(cashDrawer);
};

// Settings functions
export const getSettings = (): Settings => {
  return getItem<Settings>(STORAGE_KEYS.SETTINGS) || defaultSettings;
};
export const setSettings = (settings: Settings): void => {
  setItem(STORAGE_KEYS.SETTINGS, settings);
};

// Daily summary functions
export const getDailySummaries = (): DailySummary[] => {
  return getItems<DailySummary>(STORAGE_KEYS.DAILY_SUMMARY);
};
export const addDailySummary = (summary: DailySummary): void => {
  const summaries = getDailySummaries();
  summaries.push(summary);
  setItems(STORAGE_KEYS.DAILY_SUMMARY, summaries);
};
export const generateDailySummary = (date: Date = new Date()): DailySummary => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const orders = getOrders().filter(order => {
    if (order.status === 'canceled' || order.isVoided) return false;
    
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === targetDate.getTime();
  });
  
  // Calculate totals
  const totalSales = orders.reduce((sum, order) => sum + order.finalAmount, 0);
  
  // Calculate products sold
  const productMap = new Map<string, {
    productId: string;
    productName: string;
    quantity: number;
    sales: number;
    profit: number;
  }>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = item.product;
      const existingProduct = productMap.get(product.id);
      
      if (existingProduct) {
        existingProduct.quantity += item.quantity;
        existingProduct.sales += item.quantity * product.price;
        existingProduct.profit += item.quantity * (product.price - product.cost);
      } else {
        productMap.set(product.id, {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          sales: item.quantity * product.price,
          profit: item.quantity * (product.price - product.cost)
        });
      }
    });
  });
  
  const productsSold = Array.from(productMap.values());
  
  // Calculate total profit
  const totalProfit = productsSold.reduce((sum, product) => sum + product.profit, 0);
  
  // Calculate expected cash in drawer
  const cashDrawer = getCashDrawer();
  const cashTransactions = cashDrawer.transactions.filter(tx => {
    const txDate = new Date(tx.timestamp);
    txDate.setHours(0, 0, 0, 0);
    return txDate.getTime() === targetDate.getTime() && tx.type === 'sale' && tx.orderId;
  });
  
  const expectedCashInDrawer = cashTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const summary: DailySummary = {
    date: targetDate,
    totalSales,
    totalOrders: orders.length,
    totalProfit,
    expectedCashInDrawer,
    productsSold
  };
  
  return summary;
};

// Generate a new order number
export const generateOrderNumber = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysOrders = getOrders().filter(order => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
  
  return todaysOrders.length + 1;
};

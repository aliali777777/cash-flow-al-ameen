
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderItem, Product, OrderStatus, KitchenOrderStatus, PaymentMethod, Discount } from '../types';
import { addOrder, updateOrder, getOrders, generateOrderNumber } from '../utils/storage';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface OrderContextType {
  currentOrder: Order | null;
  todaysOrders: Order[];
  kitchenOrders: Order[];
  initializeOrder: () => void;
  addItemToOrder: (product: Product, quantity: number, notes?: string) => void;
  removeItemFromOrder: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  updateItemNotes: (index: number, notes: string) => void;
  applyDiscount: (discount: Discount | undefined) => void;
  completeOrder: (paymentMethod: PaymentMethod) => void;
  cancelOrder: () => void;
  voidOrder: (orderId: string, reason: string) => void;
  updateKitchenStatus: (orderId: string, status: KitchenOrderStatus, preparationTime?: number) => void;
  markOrderAsDelivered: (orderId: string) => void;
  clearCurrentOrder: () => void;
  calculateOrderTotal: () => number;
  calculateOrderDiscount: () => number;
  calculateFinalAmount: () => number;
}

const OrderContext = createContext<OrderContextType>({
  currentOrder: null,
  todaysOrders: [],
  kitchenOrders: [],
  initializeOrder: () => {},
  addItemToOrder: () => {},
  removeItemFromOrder: () => {},
  updateItemQuantity: () => {},
  updateItemNotes: () => {},
  applyDiscount: () => {},
  completeOrder: () => {},
  cancelOrder: () => {},
  voidOrder: () => {},
  updateKitchenStatus: () => {},
  markOrderAsDelivered: () => {},
  clearCurrentOrder: () => {},
  calculateOrderTotal: () => 0,
  calculateOrderDiscount: () => 0,
  calculateFinalAmount: () => 0,
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from storage
    try {
      const storedOrders = getOrders();
      setOrders(storedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    }
  }, []);

  // Filter today's orders
  const todaysOrders = orders.filter(order => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    
    return orderDate.getTime() === today.getTime();
  });

  // Filter orders for kitchen display (new and in-progress)
  const kitchenOrders = orders.filter(order => 
    (order.status === 'pending' || order.status === 'completed') && 
    (order.kitchenStatus === 'new' || order.kitchenStatus === 'in-progress') &&
    !order.isVoided
  );

  const initializeOrder = () => {
    if (!currentUser) {
      toast.error('No user logged in');
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [],
      totalAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      orderNumber: generateOrderNumber(),
      cashierId: currentUser.id,
      paymentMethod: 'cash',
      isPaid: false,
      kitchenStatus: 'new',
    };

    setCurrentOrder(newOrder);
  };

  const addItemToOrder = (product: Product, quantity: number, notes?: string) => {
    if (!currentOrder) {
      toast.error('No active order');
      return;
    }

    const newItem: OrderItem = {
      productId: product.id,
      product,
      quantity,
      notes,
    };

    setCurrentOrder(prev => {
      if (!prev) return null;
      
      const updatedItems = [...prev.items, newItem];
      
      return {
        ...prev,
        items: updatedItems,
        updatedAt: new Date(),
      };
    });
  };

  const removeItemFromOrder = (index: number) => {
    if (!currentOrder) return;

    setCurrentOrder(prev => {
      if (!prev) return null;
      
      const updatedItems = [...prev.items];
      updatedItems.splice(index, 1);
      
      return {
        ...prev,
        items: updatedItems,
        updatedAt: new Date(),
      };
    });
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (!currentOrder) return;

    setCurrentOrder(prev => {
      if (!prev) return null;
      
      const updatedItems = [...prev.items];
      if (updatedItems[index]) {
        updatedItems[index] = {
          ...updatedItems[index],
          quantity,
        };
      }
      
      return {
        ...prev,
        items: updatedItems,
        updatedAt: new Date(),
      };
    });
  };

  const updateItemNotes = (index: number, notes: string) => {
    if (!currentOrder) return;

    setCurrentOrder(prev => {
      if (!prev) return null;
      
      const updatedItems = [...prev.items];
      if (updatedItems[index]) {
        updatedItems[index] = {
          ...updatedItems[index],
          notes,
        };
      }
      
      return {
        ...prev,
        items: updatedItems,
        updatedAt: new Date(),
      };
    });
  };

  const applyDiscount = (discount: Discount | undefined) => {
    if (!currentOrder) return;

    setCurrentOrder(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        discount,
        updatedAt: new Date(),
      };
    });
  };

  const calculateOrderTotal = (): number => {
    if (!currentOrder) return 0;
    
    return currentOrder.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const calculateOrderDiscount = (): number => {
    if (!currentOrder || !currentOrder.discount) return 0;
    
    const total = calculateOrderTotal();
    const discount = currentOrder.discount;
    
    if (discount.type === 'fixed') {
      return discount.value;
    } else if (discount.type === 'percentage') {
      return (total * discount.value) / 100;
    } else if (discount.type === 'buyXgetY' && discount.buyCount && discount.getFreeCount) {
      // Handle buy X get Y free discount
      let discountAmount = 0;
      
      // If there are specific products this discount applies to
      if (discount.applicableProductIds && discount.applicableProductIds.length > 0) {
        const applicableItems = currentOrder.items.filter(item => 
          discount.applicableProductIds?.includes(item.product.id)
        );
        
        applicableItems.forEach(item => {
          const totalQuantity = item.quantity;
          const discountCycles = Math.floor(totalQuantity / (discount.buyCount! + discount.getFreeCount!));
          const freeItems = discountCycles * discount.getFreeCount!;
          discountAmount += freeItems * item.product.price;
        });
      } else {
        // Apply to all products
        const flatItems: { product: Product, quantity: number }[] = [];
        
        // Flatten all items by product
        currentOrder.items.forEach(item => {
          const existing = flatItems.find(i => i.product.id === item.product.id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            flatItems.push({ product: item.product, quantity: item.quantity });
          }
        });
        
        // Sort by price descending to apply discount to cheapest items
        flatItems.sort((a, b) => a.product.price - b.product.price);
        
        // Calculate discount
        const totalQuantity = flatItems.reduce((sum, item) => sum + item.quantity, 0);
        const discountCycles = Math.floor(totalQuantity / (discount.buyCount! + discount.getFreeCount!));
        
        let remainingDiscounts = discountCycles * discount.getFreeCount!;
        
        for (const item of flatItems) {
          if (remainingDiscounts <= 0) break;
          
          const itemsToDiscount = Math.min(remainingDiscounts, item.quantity);
          discountAmount += itemsToDiscount * item.product.price;
          remainingDiscounts -= itemsToDiscount;
        }
      }
      
      return discountAmount;
    }
    
    return 0;
  };

  const calculateFinalAmount = (): number => {
    const total = calculateOrderTotal();
    const discountAmount = calculateOrderDiscount();
    return Math.max(0, total - discountAmount);
  };

  const completeOrder = (paymentMethod: PaymentMethod) => {
    if (!currentOrder || currentOrder.items.length === 0) {
      toast.error('Cannot complete an empty order');
      return;
    }

    const totalAmount = calculateOrderTotal();
    const discountAmount = calculateOrderDiscount();
    const finalAmount = calculateFinalAmount();

    const completedOrder: Order = {
      ...currentOrder,
      totalAmount,
      discountAmount,
      finalAmount,
      status: 'completed',
      paymentMethod,
      isPaid: true,
      updatedAt: new Date(),
    };

    // Save the order to storage
    addOrder(completedOrder);
    
    // Update local state
    setOrders(prev => [...prev, completedOrder]);
    
    // Clear current order
    setCurrentOrder(null);
    
    toast.success('Order completed successfully');
  };

  const cancelOrder = () => {
    if (!currentOrder) return;
    
    setCurrentOrder(null);
    toast.info('Order has been canceled');
  };

  const voidOrder = (orderId: string, reason: string) => {
    const orderToVoid = orders.find(order => order.id === orderId);
    
    if (!orderToVoid) {
      toast.error('Order not found');
      return;
    }
    
    const voidedOrder: Order = {
      ...orderToVoid,
      isVoided: true,
      notes: orderToVoid.notes 
        ? `${orderToVoid.notes}\nVoided: ${reason}` 
        : `Voided: ${reason}`,
      updatedAt: new Date(),
    };
    
    // Update the order in storage
    updateOrder(voidedOrder);
    
    // Update local state
    setOrders(prev => prev.map(o => o.id === orderId ? voidedOrder : o));
    
    toast.success('Order has been voided');
  };

  const updateKitchenStatus = (orderId: string, status: KitchenOrderStatus, preparationTime?: number) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    
    if (!orderToUpdate) {
      toast.error('Order not found');
      return;
    }
    
    let estimatedCompletionTime: Date | undefined = undefined;
    
    if (status === 'in-progress' && preparationTime) {
      estimatedCompletionTime = new Date();
      estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + preparationTime);
    }
    
    const updatedOrder: Order = {
      ...orderToUpdate,
      kitchenStatus: status,
      preparationTime,
      estimatedCompletionTime,
      updatedAt: new Date(),
    };
    
    // Update the order in storage
    updateOrder(updatedOrder);
    
    // Update local state
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    
    toast.success(`Kitchen status updated to ${status}`);
  };

  const markOrderAsDelivered = (orderId: string) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    
    if (!orderToUpdate) {
      toast.error('Order not found');
      return;
    }
    
    const updatedOrder: Order = {
      ...orderToUpdate,
      kitchenStatus: 'delivered',
      updatedAt: new Date(),
    };
    
    // Update the order in storage
    updateOrder(updatedOrder);
    
    // Update local state
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    
    toast.success('Order marked as delivered');
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        todaysOrders,
        kitchenOrders,
        initializeOrder,
        addItemToOrder,
        removeItemFromOrder,
        updateItemQuantity,
        updateItemNotes,
        applyDiscount,
        completeOrder,
        cancelOrder,
        voidOrder,
        updateKitchenStatus,
        markOrderAsDelivered,
        clearCurrentOrder,
        calculateOrderTotal,
        calculateOrderDiscount,
        calculateFinalAmount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

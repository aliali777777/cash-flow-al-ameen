
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrder } from '@/context/OrderContext';
import { Clock } from 'lucide-react';
import { Order, KitchenOrderStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const OrderQueueDisplay = () => {
  const { orders, getActiveKitchenOrders } = useOrder();
  const [queueOrders, setQueueOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get all orders for the queue display (including completed ones from today)
  useEffect(() => {
    // Get today's date at 00:00 to filter orders from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter orders from today
    const todaysOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today;
    });
    
    // Sort orders by number
    const sortedOrders = todaysOrders.sort((a, b) => a.orderNumber - b.orderNumber);
    
    setQueueOrders(sortedOrders);
  }, [orders]);
  
  // Get localized status text
  const getStatusText = (order: Order): string => {
    if (order.status === 'completed' || order.kitchenStatus === 'delivered') {
      return 'جاهز';
    } else if (order.kitchenStatus === 'ready') {
      return 'جاهز';
    } else if (order.kitchenStatus === 'in-progress') {
      return 'قيد التحضير';
    } else if (order.kitchenStatus === 'new') {
      return 'جديد';
    } else {
      return 'معلق';
    }
  };
  
  // Get status color for badge
  const getStatusColor = (order: Order): string => {
    if (order.status === 'completed' || order.kitchenStatus === 'delivered') {
      return 'bg-green-500';
    } else if (order.kitchenStatus === 'ready') {
      return 'bg-green-500';
    } else if (order.kitchenStatus === 'in-progress') {
      return 'bg-yellow-500';
    } else {
      return 'bg-blue-500';
    }
  };
  
  // Calculate expected wait time in minutes
  const getExpectedWaitTime = (order: Order): number => {
    if (order.status === 'completed' || order.kitchenStatus === 'delivered' || order.kitchenStatus === 'ready') {
      return 0; // Already done
    }
    
    // Calculate based on number of items and complexity
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    let baseTime = Math.min(5 + (itemCount * 2), 30); // Base time calculation
    
    // If there's an estimated completion time, use that instead
    if (order.estimatedCompletionTime) {
      const completionTime = new Date(order.estimatedCompletionTime);
      const creationTime = new Date(order.createdAt);
      const diffInMs = completionTime.getTime() - creationTime.getTime();
      const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));
      
      baseTime = diffInMinutes;
    }
    
    return baseTime;
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">قائمة انتظار الطلبات</CardTitle>
          <div className="text-xl">
            {format(currentTime, 'HH:mm:ss a')}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold text-center text-lg">رقم الطلب</TableHead>
              <TableHead className="font-bold text-center text-lg">الحالة</TableHead>
              <TableHead className="font-bold text-center text-lg">وقت الانتظار (دقائق)</TableHead>
              <TableHead className="font-bold text-center text-lg">وقت الطلب</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queueOrders.length > 0 ? (
              queueOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  className={cn(
                    "text-center text-lg",
                    (order.kitchenStatus === 'ready' || order.status === 'completed') ? "bg-green-50" : ""
                  )}
                >
                  <TableCell className="text-center font-bold text-xl">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn("px-3 py-1 text-white", getStatusColor(order))}>
                      {getStatusText(order)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getExpectedWaitTime(order) > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-5 w-5" />
                        <span>{getExpectedWaitTime(order)}</span>
                      </div>
                    ) : order.kitchenStatus === 'ready' || order.status === 'completed' ? (
                      <span className="text-green-600 font-medium">جاهز للاستلام</span>
                    ) : (
                      <span>--</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {format(new Date(order.createdAt), 'HH:mm:ss a')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  لا توجد طلبات حالياً
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

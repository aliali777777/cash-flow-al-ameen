
import React, { useState } from 'react';
import { useOrders } from '@/context/OrderContext';
import { Sidebar } from '@/components/common/Sidebar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { getSettings } from '@/utils/storage';
import { Clock, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { KitchenOrderStatus, Order } from '@/types';
import { cn } from '@/lib/utils';

const Kitchen = () => {
  const { kitchenOrders, updateKitchenStatus, markOrderAsDelivered } = useOrders();
  const { currentUser } = useAuth();
  const settings = getSettings();
  
  // State for preparation time
  const [prepTimes, setPrepTimes] = useState<Record<string, number>>({});
  
  // Group orders by status
  const newOrders = kitchenOrders.filter(order => order.kitchenStatus === 'new');
  const inProgressOrders = kitchenOrders.filter(order => order.kitchenStatus === 'in-progress');
  const readyOrders = kitchenOrders.filter(order => order.kitchenStatus === 'ready');
  
  const handleStatusChange = (order: Order, newStatus: KitchenOrderStatus) => {
    const prepTime = prepTimes[order.id];
    updateKitchenStatus(order.id, newStatus, prepTime);
  };
  
  const handlePrepTimeChange = (orderId: string, minutes: number) => {
    setPrepTimes(prev => ({
      ...prev,
      [orderId]: minutes
    }));
  };
  
  // Calculate remaining time
  const getRemainingTime = (order: Order): string => {
    if (!order.estimatedCompletionTime) return '';
    
    const now = new Date();
    const completionTime = new Date(order.estimatedCompletionTime);
    const diffInMs = completionTime.getTime() - now.getTime();
    
    if (diffInMs <= 0) return 'متأخر';
    
    const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));
    return `${diffInMinutes} دقيقة`;
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sidebar className="lg:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">شاشة المطبخ</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3">
              {currentUser?.username || 'مطبخ'}
            </Badge>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* New Orders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">طلبات جديدة</h2>
                <Badge className="bg-blue-500" variant="default">
                  {newOrders.length}
                </Badge>
              </div>
              
              {newOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  لا توجد طلبات جديدة
                </div>
              ) : (
                newOrders.map(order => (
                  <Card key={order.id} className="border-2 border-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>
                          طلب #{order.orderNumber}
                        </CardTitle>
                        <Badge variant="outline">
                          {new Date(order.createdAt).toLocaleTimeString('ar', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                                {item.quantity}
                              </Badge>
                              <span className="font-medium rtl">
                                {item.product.nameAr || item.product.name}
                              </span>
                            </div>
                            {settings.showPriceOnKitchenDisplay && (
                              <span className="text-muted-foreground">
                                {settings.currencySymbol}{item.product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {order.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 rounded-md rtl">
                          <div className="font-medium">ملاحظات:</div>
                          <div>{order.notes}</div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <label className="text-sm font-medium block mb-1 rtl">
                          وقت التحضير (دقائق):
                        </label>
                        <div className="flex items-center gap-2">
                          {[5, 10, 15, 20, 30].map(time => (
                            <Button
                              key={time}
                              variant={prepTimes[order.id] === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePrepTimeChange(order.id, time)}
                              className="h-8"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full"
                        disabled={!prepTimes[order.id]}
                        onClick={() => handleStatusChange(order, 'in-progress')}
                      >
                        <Clock className="ml-2 h-4 w-4" />
                        بدء التحضير
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            
            {/* In Progress Orders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">جاري التحضير</h2>
                <Badge className="bg-yellow-500" variant="default">
                  {inProgressOrders.length}
                </Badge>
              </div>
              
              {inProgressOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  لا توجد طلبات قيد التحضير
                </div>
              ) : (
                inProgressOrders.map(order => (
                  <Card key={order.id} className="border-2 border-yellow-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>
                          طلب #{order.orderNumber}
                        </CardTitle>
                        <div className="flex flex-col items-end">
                          <Badge variant="outline">
                            {new Date(order.createdAt).toLocaleTimeString('ar', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Badge>
                          {order.estimatedCompletionTime && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "mt-1",
                                getRemainingTime(order) === 'متأخر' ? "text-destructive" : ""
                              )}
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              {getRemainingTime(order)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                                {item.quantity}
                              </Badge>
                              <span className="font-medium rtl">
                                {item.product.nameAr || item.product.name}
                              </span>
                            </div>
                            {item.notes && (
                              <span className="text-sm text-muted-foreground">
                                {item.notes}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {order.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 rounded-md rtl">
                          <div className="font-medium">ملاحظات:</div>
                          <div>{order.notes}</div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full"
                        onClick={() => handleStatusChange(order, 'ready')}
                      >
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                        تم التحضير
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            
            {/* Ready Orders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">جاهز للتسليم</h2>
                <Badge className="bg-green-500" variant="default">
                  {readyOrders.length}
                </Badge>
              </div>
              
              {readyOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  لا توجد طلبات جاهزة للتسليم
                </div>
              ) : (
                readyOrders.map(order => (
                  <Card key={order.id} className="border-2 border-green-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>
                          طلب #{order.orderNumber}
                        </CardTitle>
                        <Badge variant="outline">
                          {new Date(order.createdAt).toLocaleTimeString('ar', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                                {item.quantity}
                              </Badge>
                              <span className="font-medium rtl">
                                {item.product.nameAr || item.product.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => markOrderAsDelivered(order.id)}
                      >
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                        تم التسليم
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Kitchen;

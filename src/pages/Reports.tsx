
import React, { useState } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { generateDailySummary, getOrders, getProducts, getSettings } from '@/utils/storage';
import { toast } from 'sonner';
import { 
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  Calendar,
  BarChart3,
  FileText, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Order } from '@/types';

const Reports = () => {
  const { currentUser, hasPermission } = useAuth();
  const settings = getSettings();
  const [selectedTabView, setSelectedTabView] = useState('today');
  
  // Get data
  const allOrders = getOrders();
  const products = getProducts();
  const todaySummary = generateDailySummary(new Date());
  
  // Filter completed orders
  const completedOrders = allOrders.filter(order => 
    order.status === 'completed' && !order.isVoided
  );
  
  // Filter orders by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const filterOrdersByDate = (orders: Order[], startDate: Date): Order[] => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate;
    });
  };
  
  const todayOrders = filterOrdersByDate(completedOrders, today);
  const weekOrders = filterOrdersByDate(completedOrders, startOfWeek);
  const monthOrders = filterOrdersByDate(completedOrders, startOfMonth);
  
  // Calculate stats
  const calculateTotalSales = (orders: Order[]): number => {
    return orders.reduce((total, order) => total + order.finalAmount, 0);
  };
  
  const calculateTotalOrders = (orders: Order[]): number => {
    return orders.length;
  };
  
  const calculateTotalProfit = (orders: Order[]): number => {
    return orders.reduce((total, order) => {
      return total + order.items.reduce((itemTotal, item) => {
        const profit = (item.product.price - item.product.cost) * item.quantity;
        return itemTotal + profit;
      }, 0);
    }, 0);
  };
  
  const calculateAverageOrderValue = (orders: Order[]): number => {
    if (orders.length === 0) return 0;
    return calculateTotalSales(orders) / orders.length;
  };
  
  // Calculate sales trend (compared to previous period)
  const calculateSalesTrend = (currentSales: number, period: 'day' | 'week' | 'month'): number => {
    // This is a mock implementation - in a real app you'd compare with actual previous period
    if (period === 'day') {
      const yesterdayOrders = completedOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === yesterday.getTime();
      });
      
      const yesterdaySales = calculateTotalSales(yesterdayOrders);
      
      if (yesterdaySales === 0) return 100; // If no sales yesterday, show 100% increase
      return ((currentSales - yesterdaySales) / yesterdaySales) * 100;
    }
    
    // For demo, return random trend for week/month
    return Math.random() > 0.5 ? 
      Math.floor(Math.random() * 20) : 
      -Math.floor(Math.random() * 15);
  };
  
  // Generate chart data
  const generateDailyChartData = () => {
    const data = [];
    const hours = [];
    
    // Generate hours (8 AM to 10 PM)
    for (let i = 8; i <= 22; i++) {
      hours.push(i);
    }
    
    for (const hour of hours) {
      const hourOrders = todayOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getHours() === hour;
      });
      
      data.push({
        name: `${hour}:00`,
        sales: calculateTotalSales(hourOrders),
        orders: calculateTotalOrders(hourOrders),
      });
    }
    
    return data;
  };
  
  const generateWeeklyChartData = () => {
    const data = [];
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - date.getDay() + i);
      date.setHours(0, 0, 0, 0);
      
      const dayOrders = completedOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === date.getTime();
      });
      
      data.push({
        name: days[i],
        sales: calculateTotalSales(dayOrders),
        profit: calculateTotalProfit(dayOrders),
      });
    }
    
    return data;
  };
  
  const generateTopProducts = (orders: Order[], limit: number = 5) => {
    const productMap = new Map();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const prodId = item.product.id;
        if (productMap.has(prodId)) {
          const prodData = productMap.get(prodId);
          prodData.quantity += item.quantity;
          prodData.sales += item.quantity * item.product.price;
        } else {
          productMap.set(prodId, {
            id: prodId,
            name: item.product.nameAr || item.product.name,
            quantity: item.quantity,
            sales: item.quantity * item.product.price,
          });
        }
      });
    });
    
    // Convert to array and sort by sales
    const productsArray = Array.from(productMap.values());
    productsArray.sort((a, b) => b.sales - a.sales);
    
    return productsArray.slice(0, limit);
  };
  
  // Handle export to Excel
  const handleExportToExcel = () => {
    toast.success('جاري تصدير التقرير...');
    // In a real app, you would generate an Excel file here
    setTimeout(() => {
      toast.success('تم تصدير التقرير بنجاح');
    }, 1500);
  };
  
  // Loading & error states
  const [loading, setLoading] = useState(false);
  
  const dailyChartData = generateDailyChartData();
  const weeklyChartData = generateWeeklyChartData();
  const topProducts = generateTopProducts(
    selectedTabView === 'today' ? todayOrders : 
    selectedTabView === 'week' ? weekOrders : monthOrders
  );
  
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sidebar className="lg:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">التقارير</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3">
              {currentUser?.username || 'مدير'}
            </Badge>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex justify-between items-center mb-6">
            <Tabs 
              value={selectedTabView} 
              onValueChange={setSelectedTabView}
              className="w-full sm:w-auto"
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="today" className="flex-1">اليوم</TabsTrigger>
                <TabsTrigger value="week" className="flex-1">هذا الأسبوع</TabsTrigger>
                <TabsTrigger value="month" className="flex-1">هذا الشهر</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" onClick={handleExportToExcel} className="hidden sm:flex">
              <Download className="ml-2 h-4 w-4" />
              تصدير
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Sales */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>إجمالي المبيعات</CardDescription>
                <CardTitle className="text-2xl">
                  {settings.currencySymbol}
                  {calculateTotalSales(
                    selectedTabView === 'today' ? todayOrders : 
                    selectedTabView === 'week' ? weekOrders : monthOrders
                  ).toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "px-1 py-0 text-xs", 
                      calculateSalesTrend(
                        calculateTotalSales(
                          selectedTabView === 'today' ? todayOrders : 
                          selectedTabView === 'week' ? weekOrders : monthOrders
                        ), 
                        selectedTabView === 'today' ? 'day' : 
                        selectedTabView === 'week' ? 'week' : 'month'
                      ) >= 0 
                        ? "text-success border-success" 
                        : "text-destructive border-destructive"
                    )}
                  >
                    {calculateSalesTrend(
                      calculateTotalSales(
                        selectedTabView === 'today' ? todayOrders : 
                        selectedTabView === 'week' ? weekOrders : monthOrders
                      ), 
                      selectedTabView === 'today' ? 'day' : 
                      selectedTabView === 'week' ? 'week' : 'month'
                    ) >= 0 ? (
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="ml-1 h-3 w-3" />
                    )}
                    {Math.abs(calculateSalesTrend(
                      calculateTotalSales(
                        selectedTabView === 'today' ? todayOrders : 
                        selectedTabView === 'week' ? weekOrders : monthOrders
                      ), 
                      selectedTabView === 'today' ? 'day' : 
                      selectedTabView === 'week' ? 'week' : 'month'
                    )).toFixed(1)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground mr-1">
                    عن 
                    {selectedTabView === 'today' ? ' الأمس' : 
                     selectedTabView === 'week' ? ' الأسبوع الماضي' : 
                     ' الشهر الماضي'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardFooter>
            </Card>
            
            {/* Total Orders */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>عدد الطلبات</CardDescription>
                <CardTitle className="text-2xl">
                  {calculateTotalOrders(
                    selectedTabView === 'today' ? todayOrders : 
                    selectedTabView === 'week' ? weekOrders : monthOrders
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className="px-1 py-0 text-xs text-success border-success"
                  >
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                    {Math.floor(Math.random() * 10 + 5)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground mr-1">
                    عن 
                    {selectedTabView === 'today' ? ' الأمس' : 
                     selectedTabView === 'week' ? ' الأسبوع الماضي' : 
                     ' الشهر الماضي'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </CardFooter>
            </Card>
            
            {/* Average Order Value */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>متوسط قيمة الطلب</CardDescription>
                <CardTitle className="text-2xl">
                  {settings.currencySymbol}
                  {calculateAverageOrderValue(
                    selectedTabView === 'today' ? todayOrders : 
                    selectedTabView === 'week' ? weekOrders : monthOrders
                  ).toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className="px-1 py-0 text-xs text-success border-success"
                  >
                    <TrendingUp className="ml-1 h-3 w-3" />
                    {Math.floor(Math.random() * 5 + 1)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground mr-1">
                    زيادة
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardFooter>
            </Card>
            
            {/* Total Profit */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>إجمالي الربح</CardDescription>
                <CardTitle className="text-2xl">
                  {settings.currencySymbol}
                  {calculateTotalProfit(
                    selectedTabView === 'today' ? todayOrders : 
                    selectedTabView === 'week' ? weekOrders : monthOrders
                  ).toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className="px-1 py-0 text-xs text-success border-success"
                  >
                    <TrendingUp className="ml-1 h-3 w-3" />
                    {Math.floor(Math.random() * 15 + 10)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground mr-1">
                    هامش ربح
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Sales Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedTabView === 'today' ? 'مبيعات اليوم' : 
                  selectedTabView === 'week' ? 'مبيعات الأسبوع' : 
                  'مبيعات الشهر'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedTabView === 'today' ? (
                      <LineChart data={dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          name="المبيعات" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          name="الطلبات" 
                          stroke="#10b981" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={weeklyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" name="المبيعات" fill="#3b82f6" />
                        <Bar dataKey="profit" name="الربح" fill="#10b981" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {topProducts.length > 0 ? (
                      topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center">
                          <Badge 
                            variant="outline" 
                            className="w-6 h-6 rounded-full p-0 flex items-center justify-center ml-3"
                          >
                            {index + 1}
                          </Badge>
                          <div className="flex-1 rtl">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              الكمية: {product.quantity} | المبيعات: {settings.currencySymbol}{product.sales.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        لا توجد بيانات متاحة
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>آخر الطلبات</CardTitle>
                <Button variant="ghost" size="sm" className="text-sm">
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {todayOrders.length > 0 ? (
                <div className="space-y-4">
                  {todayOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-3 rtl">
                        <Badge variant="outline" className="px-2">
                          #{order.orderNumber}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString('ar', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="ml-4 rtl">
                          <div className="font-medium">{settings.currencySymbol}{order.finalAmount.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{order.items.length} منتج</div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد طلبات لهذا اليوم
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6 flex justify-center sm:hidden">
            <Button variant="outline" onClick={handleExportToExcel} className="w-full">
              <Download className="ml-2 h-4 w-4" />
              تصدير التقرير
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;


import React, { useState } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { getSettings, updateSettings } from '@/utils/storage';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/types';
import { toast } from 'sonner';
import {
  Save,
  Settings as SettingsIcon,
  Printer,
  Receipt,
  Languages,
  DollarSign,
  Tag,
  Store,
  X
} from 'lucide-react';

const Settings = () => {
  const { hasPermission } = useAuth();
  const canManageSettings = hasPermission(PERMISSIONS.MANAGE_SETTINGS); // Now using the correct permission
  
  const [settings, setSettings] = useState(getSettings());
  
  const handleSaveSettings = () => {
    if (!canManageSettings) {
      toast.error('لا تملك صلاحية تعديل الإعدادات');
      return;
    }
    
    try {
      updateSettings(settings);
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    }
  };
  
  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Redirect if no permissions
  if (!canManageSettings) {
    return (
      <div className="flex h-screen">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sidebar className="lg:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">الإعدادات</h1>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <X className="mx-auto h-10 w-10 text-destructive" />
                <CardTitle>غير مصرح</CardTitle>
                <CardDescription>
                  ليس لديك صلاحية الوصول إلى إعدادات النظام
                </CardDescription>
              </CardHeader>
            </Card>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sidebar className="lg:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">الإعدادات</h1>
          </div>
          
          <Button onClick={handleSaveSettings}>
            <Save className="ml-2 h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </header>
        
        <main className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">عام</TabsTrigger>
              <TabsTrigger value="printing">الطباعة</TabsTrigger>
              <TabsTrigger value="business">معلومات المتجر</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    إعدادات عامة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoPrintReceipt" className="flex flex-col space-y-1">
                        <span>طباعة تلقائية للفواتير</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          طباعة الفاتورة تلقائياً عند إتمام الطلب
                        </span>
                      </Label>
                      <Switch 
                        id="autoPrintReceipt"
                        checked={settings.autoPrintReceipt}
                        onCheckedChange={(checked) => handleChange('autoPrintReceipt', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoKitchenPrint" className="flex flex-col space-y-1">
                        <span>طباعة تلقائية للمطبخ</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          إرسال الطلب تلقائياً للطباعة في المطبخ
                        </span>
                      </Label>
                      <Switch 
                        id="autoKitchenPrint"
                        checked={settings.autoKitchenPrint || false}
                        onCheckedChange={(checked) => handleChange('autoKitchenPrint', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="language" className="flex flex-col space-y-1">
                        <span>لغة البرنامج</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          اختر لغة واجهة المستخدم
                        </span>
                      </Label>
                      <Select 
                        value={settings.language}
                        onValueChange={(value) => handleChange('language', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="اختر اللغة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="currencySymbol">رمز العملة</Label>
                      <Input 
                        id="currencySymbol"
                        placeholder="$"
                        value={settings.currencySymbol}
                        onChange={(e) => handleChange('currencySymbol', e.target.value)}
                        className="w-full max-w-[180px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="printing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="h-5 w-5" />
                    إعدادات الطباعة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="receiptPrinter">طابعة الفواتير</Label>
                      <Select 
                        value={settings.receiptPrinter || ''}
                        onValueChange={(value) => handleChange('receiptPrinter', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر طابعة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">الطابعة الافتراضية</SelectItem>
                          <SelectItem value="thermal">طابعة حرارية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="kitchenPrinter">طابعة المطبخ</Label>
                      <Select 
                        value={settings.kitchenPrinter || ''}
                        onValueChange={(value) => handleChange('kitchenPrinter', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="اختر طابعة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">الطابعة الافتراضية</SelectItem>
                          <SelectItem value="thermal">طابعة حرارية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="receiptWidth">عرض الفاتورة (مم)</Label>
                      <Input 
                        id="receiptWidth"
                        type="number"
                        placeholder="80"
                        value={settings.receiptWidth || 80}
                        onChange={(e) => handleChange('receiptWidth', Number(e.target.value))}
                        className="w-full max-w-[180px]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLogo" className="flex flex-col space-y-1">
                        <span>عرض الشعار في الفاتورة</span>
                      </Label>
                      <Switch 
                        id="showLogo"
                        checked={settings.showLogo || false}
                        onCheckedChange={(checked) => handleChange('showLogo', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    معلومات المتجر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="businessName">اسم المتجر</Label>
                      <Input 
                        id="businessName"
                        placeholder="اسم المتجر"
                        value={settings.businessName || ''}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="businessAddress">عنوان المتجر</Label>
                      <Input 
                        id="businessAddress"
                        placeholder="عنوان المتجر"
                        value={settings.businessAddress || ''}
                        onChange={(e) => handleChange('businessAddress', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="businessPhone">رقم الهاتف</Label>
                      <Input 
                        id="businessPhone"
                        placeholder="رقم الهاتف"
                        value={settings.businessPhone || ''}
                        onChange={(e) => handleChange('businessPhone', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="taxRate">نسبة الضريبة (%)</Label>
                      <Input 
                        id="taxRate"
                        type="number"
                        placeholder="0"
                        value={settings.taxRate || 0}
                        onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                        className="w-full max-w-[180px]"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="receiptFooter">نص أسفل الفاتورة</Label>
                      <Input 
                        id="receiptFooter"
                        placeholder="شكراً لزيارتكم"
                        value={settings.receiptFooter || ''}
                        onChange={(e) => handleChange('receiptFooter', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;

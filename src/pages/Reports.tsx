// TODO: Implement Reports.tsx
// This is a placeholder component to fix the build error

import React from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/types';

const Reports = () => {
  const { hasPermission } = useAuth();
  const canViewReports = hasPermission(PERMISSIONS.VIEW_REPORTS);

  if (!canViewReports) {
    return (
      <div className="flex h-screen">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sidebar className="lg:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">التقارير</h1>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>غير مصرح</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  ليس لديك صلاحية الوصول إلى التقارير
                </p>
              </CardContent>
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
            <h1 className="text-lg font-semibold">التقارير</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>تقارير المبيعات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  عرض تقارير المبيعات اليومية والشهرية والسنوية
                </p>
                <Button>عرض التقرير</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>تقارير المنتجات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  عرض تقارير المنتجات الأكثر مبيعاً
                </p>
                <Button>عرض التقرير</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>تقارير الأرباح</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  عرض تقارير الأرباح والخسائر
                </p>
                <Button>عرض التقرير</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <p className="text-center text-muted-foreground">
              سيتم تطوير صفحة التقارير قريباً
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;

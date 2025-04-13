
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/types';
import { Menu, X, Home, Users, Package, FileText, Settings, LogOut, Coffee } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [open, setOpen] = React.useState(false);
  const { hasPermission, isAdmin, logout } = useAuth();
  
  return (
    <>
      {/* Mobile sidebar trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0">
          <SidebarContent className="py-2" setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className={cn("hidden border-r bg-background md:block", className)}>
        <SidebarContent />
      </div>
    </>
  );
}

interface SidebarContentProps {
  className?: string;
  setOpen?: (open: boolean) => void;
}

function SidebarContent({ className, setOpen }: SidebarContentProps) {
  const { hasPermission, isAdmin, logout } = useAuth();
  const location = useLocation();
  
  // Generate the navigation items based on permissions
  const navItems = [
    {
      title: 'الرئيسية',
      icon: Home,
      href: '/',
      active: location.pathname === '/',
      permission: PERMISSIONS.CREATE_ORDERS,
    },
    {
      title: 'المطبخ',
      icon: Coffee,
      href: '/kitchen',
      active: location.pathname === '/kitchen',
      permission: PERMISSIONS.KITCHEN_DISPLAY,
    },
    {
      title: 'التقارير',
      icon: FileText,
      href: '/reports',
      active: location.pathname === '/reports',
      permission: PERMISSIONS.VIEW_REPORTS,
    },
    {
      title: 'المنتجات',
      icon: Package,
      href: '/products',
      active: location.pathname === '/products',
      permission: PERMISSIONS.MANAGE_PRODUCTS,
    },
    {
      title: 'المستخدمين',
      icon: Users,
      href: '/users',
      active: location.pathname === '/users',
      permission: PERMISSIONS.MANAGE_USERS,
    },
    {
      title: 'الإعدادات',
      icon: Settings,
      href: '/settings',
      active: location.pathname === '/settings',
      permission: PERMISSIONS.ACCESS_SETTINGS,
    },
  ];
  
  const handleItemClick = () => {
    if (setOpen) {
      setOpen(false);
    }
  };
  
  return (
    <div className={cn("flex h-full flex-col rtl", className)}>
      <div className="flex h-14 items-center border-b px-4">
        <Button
          variant="ghost"
          className="mr-auto md:hidden"
          onClick={() => setOpen && setOpen(false)}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          <span className="arabic text-lg">كاش فلو</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2 py-4">
          {navItems.map((item) => {
            // Only show items the user has permission for
            if (!hasPermission(item.permission) && !isAdmin()) {
              return null;
            }
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  item.active ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        <Separator />
        <div className="p-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => {
              logout();
              if (setOpen) setOpen(false);
            }}
          >
            <LogOut className="h-5 w-5 ml-2" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}

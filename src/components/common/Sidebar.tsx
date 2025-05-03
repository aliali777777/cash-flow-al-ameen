
import { 
  HomeIcon, 
  ReceiptIcon, 
  UtensilsCrossedIcon, 
  PackageIcon, 
  AreaChartIcon, 
  UsersIcon, 
  SettingsIcon, 
  LogOutIcon, 
  Menu 
} from 'lucide-react';
import { QueueListIcon } from '@/components/icons/QueueListIcon';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserRole } from '@/types';

export function Sidebar({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const nav = [
    {
      name: 'Home',
      nameAr: 'الرئيسية',
      path: '/',
      icon: HomeIcon,
      roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.KITCHEN],
    },
    {
      name: 'Cashier',
      nameAr: 'الكاشير',
      path: '/cashier',
      icon: ReceiptIcon,
      roles: [UserRole.ADMIN, UserRole.CASHIER],
    },
    {
      name: 'Kitchen',
      nameAr: 'المطبخ',
      path: '/kitchen',
      icon: UtensilsCrossedIcon,
      roles: [UserRole.ADMIN, UserRole.KITCHEN],
    },
    {
      name: 'Products',
      nameAr: 'المنتجات',
      path: '/products',
      icon: PackageIcon,
      roles: [UserRole.ADMIN],
    },
    {
      name: 'Reports',
      nameAr: 'التقارير',
      path: '/reports',
      icon: AreaChartIcon,
      roles: [UserRole.ADMIN],
    },
    {
      name: 'Users',
      nameAr: 'المستخدمين',
      path: '/admin',
      icon: UsersIcon,
      roles: [UserRole.ADMIN],
    },
    {
      name: 'Settings',
      nameAr: 'الإعدادات',
      path: '/settings',
      icon: SettingsIcon,
      roles: [UserRole.ADMIN],
    },
    {
      name: 'Customer Queue',
      nameAr: 'شاشة الانتظار',
      path: '/queue',
      icon: QueueListIcon,
      roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.KITCHEN],
      isPublic: true,
    },
  ];

  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={cn("flex flex-col space-y-4 py-4 border-r bg-secondary text-secondary-foreground h-full", className)}>
      <div className="px-3 py-2">
        <Link to="/" className="hover:underline px-2">
          <h1 className="font-bold text-lg">
            مطعمي
          </h1>
        </Link>
      </div>
      <div className="flex-1 space-y-1">
        {nav.map((item) => (
          ((item.roles.includes(currentUser?.role as UserRole) || item.isPublic)) && (
            <Link key={item.name} to={item.path}>
              <Button
                variant={pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "justify-start w-full font-normal",
                  pathname === item.path ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.nameAr}
              </Button>
            </Link>
          )
        ))}
      </div>
      <Separator />
      <div className="px-3 py-2">
        {currentUser ? (
          <Button 
            variant="destructive" 
            className="justify-start w-full font-normal"
            onClick={handleLogout}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="ghost" className="justify-start font-normal">
              تسجيل الدخول
            </Button>
          </Link>
        )}
      </div>
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-10 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

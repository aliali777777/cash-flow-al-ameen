
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserRole, PERMISSIONS } from "@/types";

export function UserNavigation() {
  const { currentUser, logout, isAdmin, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-pos-dark border-b border-pos-lightgray">
      <div className="flex items-center">
        <NavigationMenu>
          <NavigationMenuList>
            {(isAdmin() || hasPermission(PERMISSIONS.MANAGE_USERS) || hasPermission(PERMISSIONS.MANAGE_PRODUCTS) || hasPermission(PERMISSIONS.VIEW_REPORTS)) && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-pos-gold/20 text-pos-gold">
                  الإدارة
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4">
                    {(isAdmin() || hasPermission(PERMISSIONS.MANAGE_USERS)) && (
                      <li>
                        <NavigationMenuLink asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate("/admin")}
                          >
                            <User className="mr-2 h-4 w-4" />
                            المستخدمين
                          </Button>
                        </NavigationMenuLink>
                      </li>
                    )}
                    {(isAdmin() || hasPermission(PERMISSIONS.MANAGE_PRODUCTS)) && (
                      <li>
                        <NavigationMenuLink asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate("/products")}
                          >
                            <User className="mr-2 h-4 w-4" />
                            المنتجات
                          </Button>
                        </NavigationMenuLink>
                      </li>
                    )}
                    {(isAdmin() || hasPermission(PERMISSIONS.VIEW_REPORTS)) && (
                      <li>
                        <NavigationMenuLink asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate("/reports")}
                          >
                            <User className="mr-2 h-4 w-4" />
                            التقارير
                          </Button>
                        </NavigationMenuLink>
                      </li>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-pos-gold/20 text-pos-gold">
                الصفحات
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        الرئيسية
                      </Button>
                    </NavigationMenuLink>
                  </li>
                  {(isAdmin() || currentUser.role === "cashier" || hasPermission(PERMISSIONS.CREATE_ORDERS)) && (
                    <li>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate("/cashier")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          الكاشير
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  )}
                  {(isAdmin() || currentUser.role === "kitchen" || hasPermission(PERMISSIONS.KITCHEN_DISPLAY)) && (
                    <li>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate("/kitchen")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          المطبخ
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  )}
                  <li>
                    <NavigationMenuLink asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/queue")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        شاشة الانتظار
                      </Button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {(isAdmin() || hasPermission(PERMISSIONS.ACCESS_SETTINGS)) && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant="ghost"
                    className="bg-transparent hover:bg-pos-gold/20 text-pos-gold"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    الإعدادات
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        <Button
          variant="destructive"
          className="flex items-center"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}

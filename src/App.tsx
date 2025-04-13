
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { OrderProvider } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";

// Pages
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Cashier from "./pages/Cashier";
import Kitchen from "./pages/Kitchen";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route 
                  path="/" 
                  element={<Index />} 
                />
                
                <Route 
                  path="/cashier" 
                  element={
                    <ProtectedRoute>
                      <Cashier />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/kitchen" 
                  element={
                    <ProtectedRoute>
                      <Kitchen />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/products" 
                  element={
                    <ProtectedRoute>
                      <Products />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

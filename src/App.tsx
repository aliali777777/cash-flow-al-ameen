import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { OrderProvider } from '@/context/OrderContext';
import Login from '@/pages/Login';
import Kitchen from '@/pages/Kitchen';
import CashierPage from '@/pages/cashier/CashierPage';
import Orders from '@/pages/Orders';
import Products from '@/pages/Products';
import Categories from '@/pages/Categories';
import Settings from '@/pages/Settings';
import Users from '@/pages/Users';
import Queue from '@/pages/Queue';
import Index from '@/pages/Index'; // Fix casing to match the actual file
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
              <Route path="/cashier" element={<ProtectedRoute><CashierPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/queue" element={<ProtectedRoute><Queue /></ProtectedRoute>} />
            </Routes>
          </Router>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

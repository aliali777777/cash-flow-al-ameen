
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { OrderProvider } from '@/context/OrderContext';
import Login from '@/pages/Login';
import Kitchen from '@/pages/Kitchen';
import CashierPage from '@/pages/cashier/CashierPage';
import Products from '@/pages/Products';
import Settings from '@/pages/Settings';
import Index from '@/pages/Index'; // Import with correct capitalization
import Admin from '@/pages/Admin'; // Import Admin page
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
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </Routes>
          </Router>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

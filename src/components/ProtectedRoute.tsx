
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log navigation to help with debugging
    console.log(`Navigation to: ${location.pathname}, authenticated: ${isAuthenticated}`);
    
    // Show a toast when user successfully accesses a protected page
    if (isAuthenticated && currentUser) {
      console.log("User authenticated:", currentUser.username);
    }
  }, [location, isAuthenticated, currentUser]);
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;

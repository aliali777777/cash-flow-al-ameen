
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Redirect based on user role
    if (currentUser?.role === 'admin') {
      navigate('/admin');
    } else if (currentUser?.role === 'kitchen') {
      navigate('/kitchen');
    } else {
      navigate('/'); // Cashier is the default view
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  return null;
};

export default Index;

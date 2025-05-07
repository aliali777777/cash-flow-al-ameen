
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Redirect based on user role
    if (currentUser?.role === 'admin') {
      navigate('/admin', { replace: true });
      toast.success(`مرحباً ${currentUser.username}، تم تسجيل الدخول بنجاح`);
    } else if (currentUser?.role === 'kitchen') {
      navigate('/kitchen', { replace: true });
      toast.success(`مرحباً ${currentUser.username}، تم تسجيل الدخول بنجاح`);
    } else {
      navigate('/cashier', { replace: true });
      toast.success(`مرحباً ${currentUser.username}، تم تسجيل الدخول بنجاح`);
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  return null;
};

export default Index;

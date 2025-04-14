
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AutoLogout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      if (user) {
        await signOut();
        toast.success('You have been logged out');
        navigate('/');
      }
    };

    performLogout();
  }, [user, signOut, navigate]);

  return null; // This component doesn't render anything
};

export default AutoLogout;

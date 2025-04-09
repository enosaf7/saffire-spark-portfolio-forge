
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types/supabase';
import { User } from '@supabase/supabase-js';

export const useUserData = (user: User | null) => {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  
  // Initialize admin access from localStorage
  useEffect(() => {
    const storedAdminAccess = localStorage.getItem('temporaryAdminAccess');
    if (storedAdminAccess === 'true') {
      setHasAdminAccess(true);
    }
  }, []);

  // Update app user data and admin status when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setAppUser(null);
        setIsAdmin(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        const userData = data as AppUser;
        setAppUser(userData);
        
        const isActualAdmin = user.email === 'enosaf7@gmail.com' || userData?.role === 'admin';
        setIsAdmin(isActualAdmin);
        
        if (isActualAdmin) {
          setHasAdminAccess(true);
          localStorage.setItem('temporaryAdminAccess', 'true');
        }
      } catch (error) {
        console.error('Exception fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  return { appUser, isAdmin, hasAdminAccess, setHasAdminAccess };
};


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
        // Check if the email is our admin email directly
        const isAdminEmail = user.email === 'enosaf7@gmail.com';
        
        if (isAdminEmail) {
          setIsAdmin(true);
          setHasAdminAccess(true);
          localStorage.setItem('temporaryAdminAccess', 'true');
        }

        // Try to fetch from users table first
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userData) {
          setAppUser(userData as AppUser);
          
          // If role is admin in the users table or it's our admin email
          if (userData.role === 'admin' || isAdminEmail) {
            setIsAdmin(true);
            setHasAdminAccess(true);
            localStorage.setItem('temporaryAdminAccess', 'true');
          }
          return;
        }

        // If no data in users table, try profiles table as fallback
        if (userError) {
          console.log('Falling back to profiles table');
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            return;
          }

          // Manually construct AppUser from profile data
          const constructedUser = {
            ...profileData,
            email: user.email,
            role: isAdminEmail ? 'admin' : 'user'
          } as AppUser;
          
          setAppUser(constructedUser);
          
          if (isAdminEmail) {
            setIsAdmin(true);
            setHasAdminAccess(true);
            localStorage.setItem('temporaryAdminAccess', 'true');
          }
        }
      } catch (error) {
        console.error('Exception fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  return { appUser, isAdmin, hasAdminAccess, setHasAdminAccess };
};

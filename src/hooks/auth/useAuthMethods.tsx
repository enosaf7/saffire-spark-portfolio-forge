
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@supabase/supabase-js';

export const useAuthMethods = (setHasAdminAccess: (value: boolean) => void) => {
  const signIn = async (email: string, password: string) => {
    try {
      if (email === 'enosaf7@gmail.com') {
        setHasAdminAccess(true);
        localStorage.setItem('temporaryAdminAccess', 'true');
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google' as Provider,
        options: {
          redirectTo: window.location.origin + '/booking'
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms'
        }
      });
      
      return { error, phoneNumber: phone };
    } catch (error) {
      return { error };
    }
  };
  
  const verifyOtp = async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      // Ensure metadata has consistent property naming
      const formattedMetadata = {
        full_name: metadata.full_name || metadata.fullName,
        university: metadata.university
      };

      // Step 1: Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: formattedMetadata
        }
      });

      // If registration was successful and we have a user
      if (!error && data && data.user) {
        try {
          // Step 2: Create a profiles entry manually - passing as an array of objects
          const { error: profileError } = await supabase.from('profiles').insert([{
            id: data.user.id,
            full_name: formattedMetadata.full_name,
            university: formattedMetadata.university,
            created_at: new Date(),
            updated_at: new Date()
          }]);

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          // Step 3: Create a users entry manually - passing as an array of objects
          const { error: userError } = await supabase.from('users').insert([{
            id: data.user.id,
            email: email,
            full_name: formattedMetadata.full_name,
            university: formattedMetadata.university,
            role: 'user',
            created_at: new Date(),
            updated_at: new Date()
          }]);

          if (userError) {
            console.error('Error creating user record:', userError);
          }
        } catch (insertError) {
          console.error('Error creating user records:', insertError);
        }
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    setHasAdminAccess(false);
    localStorage.removeItem('temporaryAdminAccess');
    await supabase.auth.signOut();
  };

  return { 
    signIn, 
    signInWithGoogle, 
    signInWithPhone, 
    verifyOtp, 
    signUp, 
    signOut 
  };
};

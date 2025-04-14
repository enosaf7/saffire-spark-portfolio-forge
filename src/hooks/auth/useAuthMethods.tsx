
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

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
          data: formattedMetadata
        }
      });

      if (!error) {
        // Try to create a profiles entry (this is a backup in case the trigger doesn't work)
        try {
          await supabase.from('profiles').upsert({
            id: (await supabase.auth.getUser()).data.user?.id,
            full_name: formattedMetadata.full_name,
            university: formattedMetadata.university,
          });
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          // We don't return this error as the auth signup was successful
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

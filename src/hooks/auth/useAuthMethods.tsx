
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
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { 
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
          data: {
            full_name: metadata.full_name || metadata.fullName,
            university: metadata.university,
            ...metadata
          }
        } 
      });
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

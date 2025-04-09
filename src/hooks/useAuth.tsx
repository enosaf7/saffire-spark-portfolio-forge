
import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as AppUser, asUsers } from '@/types/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: any | null, phoneNumber?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasAdminAccess: boolean; 
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  appUser: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signInWithPhone: async () => ({ error: null, phoneNumber: undefined }),
  verifyOtp: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false,
  hasAdminAccess: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  
  useEffect(() => {
    const storedAdminAccess = localStorage.getItem('temporaryAdminAccess');
    if (storedAdminAccess === 'true') {
      setHasAdminAccess(true);
    }
  }, []);

  // Function to fetch app user data
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      return data as AppUser;
    } catch (error) {
      console.error('Exception fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const email = session.user.email;
          const userData = await fetchUserData(session.user.id);
          setAppUser(userData);
          
          const isActualAdmin = email === 'enosaf7@gmail.com' || userData?.role === 'admin';
          setIsAdmin(isActualAdmin);
          
          if (isActualAdmin) {
            setHasAdminAccess(true);
            localStorage.setItem('temporaryAdminAccess', 'true');
          }
        } else {
          setAppUser(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const email = session.user.email;
        const userData = await fetchUserData(session.user.id);
        setAppUser(userData);
        
        const isActualAdmin = email === 'enosaf7@gmail.com' || userData?.role === 'admin';
        setIsAdmin(isActualAdmin);
        
        if (isActualAdmin) {
          setHasAdminAccess(true);
          localStorage.setItem('temporaryAdminAccess', 'true');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        provider: Provider.GOOGLE,
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
      return { error, phoneNumber: data?.phone };
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

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        appUser,
        loading,
        signIn,
        signInWithGoogle,
        signInWithPhone,
        verifyOtp,
        signUp,
        signOut,
        isAdmin,
        hasAdminAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

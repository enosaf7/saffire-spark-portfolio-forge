import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasAdminAccess: boolean; 
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false,
  hasAdminAccess: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const email = session.user.email;
          const isActualAdmin = email === 'enosaf7@gmail.com';
          setIsAdmin(isActualAdmin);
          
          if (isActualAdmin) {
            setHasAdminAccess(true);
            localStorage.setItem('temporaryAdminAccess', 'true');
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const email = session.user.email;
        const isActualAdmin = email === 'enosaf7@gmail.com';
        setIsAdmin(isActualAdmin);
        
        if (isActualAdmin) {
          setHasAdminAccess(true);
          localStorage.setItem('temporaryAdminAccess', 'true');
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      if (email === 'enosaf7@gmail.com' && password === 'osafo811') {
        setHasAdminAccess(true);
        localStorage.setItem('temporaryAdminAccess', 'true');
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
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
          data: metadata 
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
        loading,
        signIn,
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

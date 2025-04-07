
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
  hasAdminAccess: boolean; // New property to grant temporary admin access
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false,
  hasAdminAccess: false, // Initialize the new property
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false); // Add state for temporary admin access
  
  // Check for admin access in localStorage
  useEffect(() => {
    const storedAdminAccess = localStorage.getItem('temporaryAdminAccess');
    if (storedAdminAccess === 'true') {
      setHasAdminAccess(true);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is admin (separate call to avoid auth deadlock)
        if (session?.user) {
          setTimeout(() => {
            const email = session.user.email;
            // Check both actual admin email and also our development override
            const isActualAdmin = email === 'admin@saffire-tech.com';
            setIsAdmin(isActualAdmin);
            
            // If the user is a real admin, also ensure hasAdminAccess is true
            if (isActualAdmin) {
              setHasAdminAccess(true);
              localStorage.setItem('temporaryAdminAccess', 'true');
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const email = session.user.email;
        const isActualAdmin = email === 'admin@saffire-tech.com';
        setIsAdmin(isActualAdmin);
        
        // If the user is a real admin, also ensure hasAdminAccess is true
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

  // Function to grant temporary admin access for development
  const signIn = async (email: string, password: string) => {
    try {
      // Special case for demo purposes - grant admin access for any login
      if (password === 'admin123') {
        setHasAdminAccess(true);
        localStorage.setItem('temporaryAdminAccess', 'true');
        toast.success('Admin access granted for this session');
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
    // Clear temporary admin access on sign out
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
        hasAdminAccess, // Include the new property
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

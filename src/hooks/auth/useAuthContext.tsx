
import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { User as AppUser } from '@/types/supabase';

export type AuthContextType = {
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

// Default values for the context
const defaultAuthContext: AuthContextType = {
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
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

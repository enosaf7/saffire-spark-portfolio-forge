
import { useState } from 'react';
import { AuthContext } from './useAuthContext';
import { useAuthState } from './useAuthState';
import { useUserData } from './useUserData';
import { useAuthMethods } from './useAuthMethods';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, loading } = useAuthState();
  const [hasAdminAccessState, setHasAdminAccess] = useState(false);
  const { appUser, isAdmin, hasAdminAccess } = useUserData(user);
  const { 
    signIn, 
    signInWithGoogle, 
    signInWithPhone, 
    verifyOtp, 
    signUp, 
    signOut 
  } = useAuthMethods(setHasAdminAccess);

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
        hasAdminAccess: hasAdminAccess || hasAdminAccessState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext } from './useAuthContext';

// Main hook to use authentication
export const useAuth = useAuthContext;

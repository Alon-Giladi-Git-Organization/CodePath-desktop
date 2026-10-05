import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { soundFx } from '../utils/sound';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  effectiveUserId: string;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [guestId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('codepath_guest_uid');
      if (saved) return saved;
      const gen = 'guest_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('codepath_guest_uid', gen);
      return gen;
    } catch {
      return 'guest_' + Math.random().toString(36).substring(2, 9);
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.info('[Auth] State changed:', user ? `Logged in as ${user.email} (${user.uid})` : 'Logged out');
      setCurrentUser(user);
      setLoading(false);
    }, (err) => {
      console.error('[Auth] State change error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setAuthError(null);
      soundFx.playClick();
      const result = await signInWithPopup(auth, googleProvider);
      console.info('[Auth] Google sign-in successful:', result.user.email);
      soundFx.playSuccess();
      return true;
    } catch (err: unknown) {
      console.error('[Auth] Google Sign-In error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Google Sign-In failed';
      setAuthError(errorMessage);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      soundFx.playClick();
      await fbSignOut(auth);
      console.info('[Auth] Successfully signed out');
    } catch (err) {
      console.error('[Auth] Sign-Out error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  const effectiveUserId = currentUser ? currentUser.uid : guestId;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        signInWithGoogle,
        signOut,
        effectiveUserId,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

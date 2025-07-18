import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if we're in Stackbit visual editor mode
  const isStackbitEditor =
    typeof window !== 'undefined' && (
      window.location.hostname === 'create.netlify.com' ||
      window.location.search.includes('stackbit-editor') ||
      (window.location.hostname === 'localhost' && window.location.search.includes('stackbit'))
    );

  useEffect(() => {
    // If we're in Stackbit editor, bypass authentication
    if (isStackbitEditor) {
      console.log('Stackbit editor detected, bypassing authentication');
      // Create a mock user for Stackbit editor
      const mockUser = {
        id: 'stackbit-editor-user',
        email: 'stackbit-editor@example.com',
        role: 'authenticated',
      } as User;

      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isStackbitEditor]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data: data.session, error };
  };

  const signUp = async (email: string, password: string) => {
    // Check if we're in local development
    const isLocalDevelopment = window.location.hostname === 'localhost';

    try {
      console.log('Signing up with email:', email);

      // For production, include the redirect URL
      const options = isLocalDevelopment
        ? undefined
        : { emailRedirectTo: `${window.location.origin}/auth/callback` };

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });

      if (error) {
        console.error('Signup error:', error);
        return { data: null, error };
      }

      return { data: data.session, error: null };
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      return { data: null, error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

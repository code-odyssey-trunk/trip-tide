"use client";
import { createContext, useContext, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { createClient } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import VerificationBanner from '@/components/VerificationBanner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { user, session, loading, error, fetchUser, setSession } = useUserStore();

  useEffect(() => {
    // Initial fetch
    fetchUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser, setSession]);

  return (
    <AuthContext.Provider value={{ user, session, loading, error }}>
      {user && !user.email_confirmed_at && <VerificationBanner />}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 
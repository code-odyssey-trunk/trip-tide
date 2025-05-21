import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";

type UserState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
};
const supabase = createClient();

export const useUserStore = create<UserState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  fetchUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session) {
        set({ 
          user: session.user,
          session,
          loading: false,
          error: null 
        });
      } else {
        set({ 
          user: null,
          session: null,
          loading: false,
          error: null 
        });
      }
    } catch (error) {
      set({ 
        error: error as Error,
        loading: false,
        user: null,
        session: null
      });
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ 
        user: null,
        session: null,
        error: null 
      });
    } catch (error) {
      set({ error: error as Error });
    }
  },
  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      loading: false,
      error: null
    });
  }
}));
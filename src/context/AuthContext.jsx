import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({ session: null, user: null, loading: true });

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authChangedAfterInitStarted = false;

    // Subscribe before reading the persisted session so sign-in events are never missed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      if (event !== "INITIAL_SESSION") authChangedAfterInitStarted = true;
      // INITIAL_SESSION can arrive before getSession resolves; only accept it if no newer
      // sign-in/sign-out event has already been received.
      if (event === "INITIAL_SESSION" && authChangedAfterInitStarted) return;
      setSession(nextSession ?? null);
      if (event !== "INITIAL_SESSION") setLoading(false);
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) console.error("Unable to restore Supabase session:", error.message);
        if (!authChangedAfterInitStarted) setSession(data?.session ?? null);
      })
      .catch((error) => {
        if (mounted) console.error("Unable to restore Supabase session:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

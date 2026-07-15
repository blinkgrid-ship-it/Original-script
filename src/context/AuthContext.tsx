import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { fetchMe } from "../lib/api";

// localStorage keys that hold per-account state (progress, chosen pathway). These get
// cleared on sign-out so a guest or a different account signing in on the same browser
// doesn't inherit the previous account's data. os_theme is a device preference, not
// per-account, so it's deliberately left alone.
const PER_ACCOUNT_KEYS = ["os_pathway", "os_codex_read", "os_conquest_done"];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  // null while unknown (signed out, or the /api/me check hasn't resolved yet).
  onboarded: boolean | null;
  // The signed-in user's saved pathway, sourced from the backend — null when signed
  // out, not yet onboarded, or the lookup hasn't resolved yet.
  pathway: string | null;
  markOnboarded: (pathway: string) => void;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [pathway, setPathway] = useState<string | null>(null);

  // Look up onboarding status + saved pathway whenever a session appears — this is how
  // the app decides whether a freshly signed-in user needs the "choose your path"
  // screen, and what pathway to actually display (the backend is the source of truth,
  // not localStorage, which is shared across accounts on the same browser).
  useEffect(() => {
    if (!session) {
      setOnboarded(null);
      setPathway(null);
      return;
    }
    fetchMe()
      .then((me) => {
        setOnboarded(me.onboarded);
        setPathway(me.pathway);
        if (me.pathway) localStorage.setItem("os_pathway", me.pathway);
      })
      .catch(() => {
        setOnboarded(null);
        setPathway(null);
      });
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setOnboarded(null);
    setPathway(null);
    PER_ACCOUNT_KEYS.forEach((key) => localStorage.removeItem(key));
  }

  // Onboarding (or the profile page's "change path") just persisted a pathway —
  // update the flags locally instead of re-fetching.
  function markOnboarded(newPathway: string) {
    setOnboarded(true);
    setPathway(newPathway);
  }

  return (
    <AuthContext.Provider
      value={{ user, session, loading, onboarded, pathway, markOnboarded, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
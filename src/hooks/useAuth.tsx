import type { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type UserType = Database["public"]["Enums"]["user_type"];

/** Roles that may see the institution portal. */
export const INSTITUTION_TYPES: UserType[] = ["university", "industry"];

interface AuthValue {
  session: Session | null;
  user: User | null;
  /** profiles.user_type for the signed-in user. null until loaded, or if no row. */
  userType: UserType | null;
  /** true while EITHER the session or the profile is still resolving. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/*
 * Single source of session truth for the app. A context rather than a bare hook so
 * the profile row (needed for user_type routing) is fetched once, not once per
 * component that asks who is signed in.
 *
 * SECURITY NOTE — read before using userType for anything:
 * `profiles` has policy "Users can update their own profile" with no column
 * restriction, so a signed-in user CAN write their own user_type. Verified against
 * the live project: a citizen self-promoted to 'university' successfully. What they
 * could NOT do was claim a match — that gate is
 * `institutions.admin_user_id = auth.uid()`, enforced by RLS, and it held.
 * So: userType is a UX signal only. Never treat it as an authorisation boundary.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setUserType(null);
      return;
    }
    setProfileLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("user_id", userId)
      .maybeSingle();
    setUserType(data?.user_type ?? null);
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      setSessionLoading(false);
      await loadProfile(data.session?.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      void loadProfile(next?.user.id);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      userType,
      loading: sessionLoading || profileLoading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? new Error(error.message) : null };
      },
      signUp: async (email, password, fullName) => {
        // user_type is deliberately NOT settable here. The signup trigger defaults
        // every new account to the citizen role; institution accounts are
        // provisioned, never self-selected.
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: fullName ? { data: { full_name: fullName } } : undefined,
        });
        return { error: error ? new Error(error.message) : null };
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setUserType(null);
      },
      refreshProfile: () => loadProfile(session?.user.id),
    }),
    [session, userType, sessionLoading, profileLoading, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>. Check App.tsx.");
  }
  return ctx;
}

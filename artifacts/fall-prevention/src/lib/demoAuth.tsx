import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export type DemoTier = "one_time" | "subscription" | "concierge" | "admin";

export interface DemoUser {
  email: string;
  name: string;
  tier: DemoTier;
}

interface DemoAuthContextValue {
  user: DemoUser | null;
  isSignedIn: boolean;
  signIn: (user: DemoUser) => void;
  signOut: () => void;
}

const STORAGE_KEY = "fpp.demoUser";

function readStored(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoUser;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function encodeToken(user: DemoUser): string {
  return btoa(JSON.stringify({ email: user.email, name: user.name, tier: user.tier }));
}

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => readStored());
  const queryClient = useQueryClient();

  // Register the token getter so the api-client attaches the demo identity
  // to every request as a Bearer token.
  useEffect(() => {
    setAuthTokenGetter(() => (user ? encodeToken(user) : null));
    return () => setAuthTokenGetter(null);
  }, [user]);

  const signIn = useCallback((next: DemoUser) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setUser(next);
    queryClient.clear();
  }, [queryClient]);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<DemoAuthContextValue>(() => ({
    user,
    isSignedIn: !!user,
    signIn,
    signOut,
  }), [user, signIn, signOut]);

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth(): DemoAuthContextValue {
  const ctx = useContext(DemoAuthContext);
  if (!ctx) throw new Error("useDemoAuth must be used inside <DemoAuthProvider>");
  return ctx;
}

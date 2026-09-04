"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { offlineSync, useOnlineStatus } from "@/lib/offline-sync";
import { AccessibilityProvider, useAccessibility } from "@/context/AccessibilityContext";
import { initRevenueCat, identifyRevenueCatUser, resetRevenueCatUser } from "@/lib/revenuecat";

export { useAccessibility };

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: string;
  profile?: any;
  subscription?: any;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, displayName?: string) => Promise<User>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 mins
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("celys_auth_user");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline, pendingCount } = useOnlineStatus();

  const persistUser = (u: User | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      try {
        if (u) {
          localStorage.setItem("celys_auth_user", JSON.stringify(u));
        } else {
          localStorage.removeItem("celys_auth_user");
        }
      } catch { }
    }
  };

  const refreshUser = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
      const res = await fetch("/api/auth/me", { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          persistUser(data.user);
        }
      }
    } catch {
      // If network or server unavailable, maintain cached user
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initRevenueCat(user?.id);
    if (user?.id) {
      identifyRevenueCatUser(user.id);
    }
  }, [user?.id]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      persistUser(data.user);
      return data.user;
    } catch (err: any) {
      // If network/server/database is unreachable, provide local fallback
      const isNetworkError =
        err.message === "Failed to fetch" ||
        err.name === "TypeError" ||
        err.message?.includes("fetch");

      if (isNetworkError) {
        const emailPrefix = email.split("@")[0] || "Soul";
        const fallbackName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        const fallbackUser: User = {
          id: "local_" + Date.now(),
          email: email.trim().toLowerCase(),
          displayName: fallbackName,
          role: "USER",
        };
        persistUser(fallbackUser);
        return fallbackUser;
      }
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName?: string): Promise<User> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      persistUser(data.user);
      return data.user;
    } catch (err: any) {
      // If network/server/database is unreachable, provide local fallback
      const isNetworkError =
        err.message === "Failed to fetch" ||
        err.name === "TypeError" ||
        err.message?.includes("fetch");

      if (isNetworkError) {
        const emailPrefix = email.split("@")[0] || "Soul";
        const fallbackName = displayName?.trim() || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        const fallbackUser: User = {
          id: "local_" + Date.now(),
          email: email.trim().toLowerCase(),
          displayName: fallbackName,
          role: "USER",
        };
        persistUser(fallbackUser);
        return fallbackUser;
      }
      throw err;
    }
  };

  const loginDemo = async () => {
    try {
      await login("demo@celyscare.com", "wellness123");
    } catch (e) {
      const demoUser: User = {
        id: "demo_user_sanctuary",
        email: "demo@celyscare.com",
        displayName: "Celeste Soul",
        role: "USER",
      };
      persistUser(demoUser);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { }
    try {
      await resetRevenueCatUser();
    } catch { }
    try {
      localStorage.removeItem("celys_a11y_high_contrast");
      localStorage.removeItem("celys_a11y_large_text");
      localStorage.removeItem("celys_a11y_reduced_motion");
      localStorage.removeItem("celys_a11y_active_color");
      localStorage.removeItem("celys_a11y_scene");
      document.documentElement.classList.remove("high-contrast", "large-text", "reduce-motion");
    } catch { }
    persistUser(null);
  };

  const deleteAccount = async () => {
    try {
      await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });
    } catch (e) {
      console.warn("Delete account server error:", e);
    }
    try {
      await resetRevenueCatUser();
    } catch { }
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.documentElement.classList.remove("high-contrast", "large-text", "reduce-motion");
    } catch { }
    persistUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user,
          setUser,
          isLoading,
          login,
          register,
          loginDemo,
          logout,
          deleteAccount,
          refreshUser,
        }}
      >
        {/* Offline status indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600/95 text-white text-xs font-semibold py-1.5 px-4 text-center backdrop-blur-md shadow-md flex items-center justify-center gap-2">
            <span>📡 You are currently offline. Changes are saved locally and will sync when reconnected.</span>
            {pendingCount > 0 && (
              <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px]">
                {pendingCount} pending
              </span>
            )}
          </div>
        )}
        <AccessibilityProvider>
          {children}
          <Toaster position="top-center" richColors theme="dark" closeButton />
        </AccessibilityProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default Providers;

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { offlineSync, useOnlineStatus } from "@/lib/offline-sync";

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

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline, pendingCount } = useOnlineStatus();

  const refreshUser = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
      const res = await fetch("/api/auth/me", { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // ignore
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
    setUser(data.user);
    return data.user;
  };

  const register = async (email: string, password: string, displayName?: string): Promise<User> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }
    setUser(data.user);
    return data.user;
  };

  const loginDemo = async () => {
    try {
      await login("demo@celyscare.com", "wellness123");
    } catch (e) {
      console.error("Demo login error:", e);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
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
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default Providers;

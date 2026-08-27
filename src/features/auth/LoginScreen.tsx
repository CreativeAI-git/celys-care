"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "@/app/providers";
import { toast } from "sonner";
import { CelysLogo } from "@/components/branding/CelysLogo";

interface LoginScreenProps {
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      return;
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!trimmedPassword) {
      setError("Please enter your password.");
      toast.error("Please enter your password.");
      return;
    }

    if (mode === "signup" && trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const emailPrefix = trimmedEmail.split("@")[0];
      const fallbackName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

      if (mode === "signup") {
        const userGreeting = displayName.trim() || fallbackName;
        const registeredUser = await register(
          trimmedEmail,
          trimmedPassword,
          userGreeting
        );
        const finalName = registeredUser?.displayName || userGreeting;
        toast.success(`Welcome to Celys Care Sanctuary, ${finalName}! ✨`);
      } else {
        const loggedInUser = await login(trimmedEmail, trimmedPassword);
        const finalName = loggedInUser?.displayName || fallbackName;
        toast.success(`Welcome back, ${finalName}! 🌸`);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
      toast.error(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-start overflow-hidden select-none">
      {/* Top Lion Hero Banner (Figma Exact Match) */}
      <div className="relative w-full aspect-[4/3] max-h-[220px] sm:max-h-[260px] overflow-hidden rounded-3xl shadow-2xl flex-shrink-0">
        <Image
          src="/images/lion-hero-hq3.jpg"
          alt="Celys Care Celestial Lion"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Deep cosmic vignette and smooth fade to page background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,10,30,0.1) 0%, rgba(13,10,30,0.3) 60%, #0d0a1e 100%)",
          }}
        />
      </div>

      {/* Auth Card Content */}
      <div className="relative z-10 w-full max-w-sm px-4 pb-4 -mt-10 flex flex-col items-center">
        {/* Floating Lion Emblem Badge */}
        <div className="mb-2 transition-transform hover:scale-105 duration-300">
          <CelysLogo size={68} />
        </div>

        {/* Title */}
        <h1
          className="font-serif text-3xl sm:text-4xl font-bold tracking-wide mt-1"
          style={{
            background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 24px rgba(245, 215, 110, 0.2)",
          }}
        >
          Celys Care
        </h1>

        {/* Subtitle — Exact Figma Match */}
        <div className="flex items-center gap-2 mt-1 mb-3 text-[10px] font-bold tracking-[0.25em] text-purple-200/60 uppercase select-none">
          <span>✦</span>
          <span>Wellness Companion</span>
          <span>✦</span>
        </div>

        {/* Mode Switcher Pill — Figma Exact Match */}
        <div
          className="flex rounded-full p-1 mb-4 w-full"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(180, 120, 255, 0.2)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className="flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-300"
            style={{
              background:
                mode === "login"
                  ? "linear-gradient(135deg, #b04be6 0%, #7c3aed 100%)"
                  : "transparent",
              color: mode === "login" ? "#ffffff" : "rgba(240, 232, 255, 0.6)",
              boxShadow:
                mode === "login" ? "0 2px 12px rgba(168, 85, 247, 0.45)" : "none",
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className="flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-300"
            style={{
              background:
                mode === "signup"
                  ? "linear-gradient(135deg, #b04be6 0%, #7c3aed 100%)"
                  : "transparent",
              color: mode === "signup" ? "#ffffff" : "rgba(240, 232, 255, 0.6)",
              boxShadow:
                mode === "signup" ? "0 2px 12px rgba(168, 85, 247, 0.45)" : "none",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields — Figma Exact Match */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          {mode === "signup" && (
            <div
              className="flex items-center gap-3 rounded-full px-4 py-3 transition-all focus-within:border-[#c96ccc]"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(180, 120, 255, 0.22)",
              }}
            >
              <User size={16} style={{ color: "rgba(180, 120, 255, 0.6)" }} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name (e.g. Celeste)"
                className="flex-1 bg-transparent outline-none text-xs text-[#f0e8ff] placeholder:text-purple-200/40"
              />
            </div>
          )}

          {/* Email Field */}
          <div
            className="flex items-center gap-3 rounded-full px-4 py-3 transition-all focus-within:border-[#c96ccc]"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(180, 120, 255, 0.22)",
            }}
          >
            <Mail size={16} style={{ color: "rgba(180, 120, 255, 0.6)" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 bg-transparent outline-none text-xs text-[#f0e8ff] placeholder:text-purple-200/40"
            />
          </div>

          {/* Password Field */}
          <div
            className="flex items-center gap-3 rounded-full px-4 py-3 transition-all focus-within:border-[#c96ccc]"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(180, 120, 255, 0.22)",
            }}
          >
            <Lock size={16} style={{ color: "rgba(180, 120, 255, 0.6)" }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="flex-1 bg-transparent outline-none text-xs text-[#f0e8ff] placeholder:text-purple-200/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-purple-300/50 hover:text-purple-200 transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs text-rose-400 text-center bg-rose-950/40 border border-rose-800/40 rounded-xl py-1.5 px-2">
              {error}
            </p>
          )}

          {/* Main Action Button — Figma Exact Match */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3.5 mt-1 font-semibold text-xs text-white tracking-wide transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #b04be6 0%, #7c3aed 100%)",
              boxShadow: "0 4px 20px rgba(168, 85, 247, 0.45)",
            }}
          >
            {loading ? (
              "Connecting..."
            ) : mode === "login" ? (
              <>
                <span>Log In</span>
                <span>✦</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <span>✦</span>
              </>
            )}
          </button>

          {/* Bottom Tagline — Exact Figma Match */}
          <p className="text-[11px] text-purple-200/50 text-center mt-2 mb-1 tracking-wide font-normal">
            Your safe space. Your support. Your journey. ♡
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;


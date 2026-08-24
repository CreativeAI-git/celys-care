"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, User, Sparkles } from "lucide-react";
import { useAuth } from "@/app/providers";
import { toast } from "sonner";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { StarField } from "@/components/branding/StarField";
import { LotusCorners } from "@/components/branding/LotusCorners";

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

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await register(email.trim(), password, displayName.trim() || "Beautiful Soul");
        toast.success("Welcome to Celys Care Sanctuary! ✨");
      } else {
        await login(email.trim(), password);
        toast.success("Welcome back, beautiful soul! 🌸");
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
      toast.error(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login("demo@celyscare.com", "wellness123");
      toast.success("Entered Sanctuary as Demo Soul ✨");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Demo login failed.");
      toast.error("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-full flex flex-col items-center justify-between overflow-hidden">
      <StarField count={45} />
      <LotusCorners />

      {/* Top Lion Hero Banner (Figma Exact Match) */}
      <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden -mx-4">
        <Image
          src="/images/lion-hero-hq.jpg"
          alt="Celys Care Celestial Lion"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Deep cosmic vignette and smooth fade to page background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,10,30,0.1) 0%, rgba(13,10,30,0.4) 50%, #0d0a1e 100%)",
          }}
        />
      </div>

      {/* Auth Card Content */}
      <div className="relative z-10 w-full max-w-sm px-5 pb-8 -mt-10 flex flex-col items-center">
        {/* Floating Lion Emblem Badge */}
        <div className="mb-2">
          <CelysLogo size={76} />
        </div>

        {/* Title */}
        <h1
          className="font-serif text-3xl font-bold tracking-wide mt-1"
          style={{
            background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Celys Care
        </h1>

        {/* Subtitle */}
        <p
          className="text-[11px] font-medium tracking-[0.2em] mb-4 mt-0.5"
          style={{ color: "rgba(240,232,255,0.55)" }}
        >
          ✦ WELLNESS COMPANION ✦
        </p>

        {/* Mode Switcher Pill */}
        <div
          className="flex rounded-full p-1 mb-4 w-full"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(180,120,255,0.2)",
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
                  ? "linear-gradient(135deg, #c96ccc, #7c3aed)"
                  : "transparent",
              color: mode === "login" ? "#ffffff" : "rgba(240,232,255,0.55)",
              boxShadow:
                mode === "login" ? "0 2px 12px rgba(201,108,204,0.4)" : "none",
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
                  ? "linear-gradient(135deg, #c96ccc, #7c3aed)"
                  : "transparent",
              color: mode === "signup" ? "#ffffff" : "rgba(240,232,255,0.55)",
              boxShadow:
                mode === "signup" ? "0 2px 12px rgba(201,108,204,0.4)" : "none",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5 mb-3">
          {mode === "signup" && (
            <div
              className="flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all focus-within:border-[#c96ccc]"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(180,120,255,0.25)",
              }}
            >
              <User size={15} style={{ color: "rgba(180,120,255,0.6)" }} />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name (e.g. Celeste)"
                className="flex-1 bg-transparent outline-none text-xs text-[#f0e8ff] placeholder:text-purple-200/35"
              />
            </div>
          )}

          {/* Email Field */}
          <div
            className="flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all focus-within:border-[#c96ccc]"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(180,120,255,0.25)",
            }}
          >
            <Mail size={15} style={{ color: "rgba(180,120,255,0.6)" }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 bg-transparent outline-none text-xs text-[#f0e8ff] placeholder:text-purple-200/35"
            />
          </div>

          {/* Password Field */}
          <div
            className="flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all focus-within:border-[#c96ccc]"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(180,120,255,0.25)",
            }}
          >
            <Lock size={15} style={{ color: "rgba(180,120,255,0.6)" }} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="flex-1 bg-transparent outline-none text-xs text-[#f0e8ff] placeholder:text-purple-200/35"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-purple-300/50 hover:text-purple-200 transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs text-rose-400 text-center bg-rose-950/40 border border-rose-800/40 rounded-xl py-1.5 px-2">
              {error}
            </p>
          )}

          {/* Main Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3.5 mt-1 font-semibold text-xs text-white tracking-wide transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #c96ccc 0%, #8b3fc8 50%, #7c3aed 100%)",
              boxShadow: "0 4px 20px rgba(201,108,204,0.4)",
            }}
          >
            {loading
              ? "Connecting..."
              : mode === "login"
              ? "Log In ✦"
              : "Create Sanctuary Account ✦"}
          </button>
        </form>

        {/* 1-Click Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full rounded-full py-3 mb-4 font-semibold text-xs text-[#160533] tracking-wide transition-all hover:brightness-105 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
            boxShadow: "0 4px 18px rgba(245,215,110,0.3)",
          }}
        >
          <Sparkles size={14} className="text-[#160533]" />
          Explore with Demo Account (Instant)
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-purple-400/20" />
          <span className="text-[9px] uppercase tracking-widest text-purple-200/40">
            Or Continue With
          </span>
          <div className="flex-1 h-px bg-purple-400/20" />
        </div>

        {/* Social Auth Buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
          <button
            type="button"
            onClick={() => handleDemoLogin()}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-medium text-purple-100/90 transition-all hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(180,120,255,0.2)",
            }}
          >
            <span className="text-sm">🌐</span> Google
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin()}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-medium text-purple-100/90 transition-all hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(180,120,255,0.2)",
            }}
          >
            <span className="text-sm">🍎</span> Apple
          </button>
        </div>

        {/* Tagline */}
        <p className="text-[11px] text-center text-purple-200/35 font-light">
          Your safe space. Your support. Your journey. ♡
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;

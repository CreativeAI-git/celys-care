"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Smile,
  MessageCircle,
  Music,
  Moon,
  Grid,
  ChevronLeft,
  LogOut,
  X,
  Menu,
} from "lucide-react";

import { useAuth } from "@/app/providers";
import { StarField } from "@/components/branding/StarField";
import { LotusCorners } from "@/components/branding/LotusCorners";
import { CelysLogo } from "@/components/branding/CelysLogo";

// Feature screens
import { LoginScreen } from "@/features/auth/LoginScreen";
import { SubscriptionScreen } from "@/features/subscription/SubscriptionScreen";
import { MoodCheckIn } from "@/features/mood/MoodCheckIn";
import { AIChat } from "@/features/chat/AIChat";
import { AffirmationsScreen } from "@/features/affirmations/AffirmationsScreen";
import { JournalScreen } from "@/features/journal/JournalScreen";
import { MeditationScreen } from "@/features/meditation/MeditationScreen";
import { BreathingScreen } from "@/features/breathing/BreathingScreen";
import { BubbleGame } from "@/features/games/BubbleGame";
import { RelaxationMusic } from "@/features/soundscapes/RelaxationMusic";
import { CopingGames } from "@/features/games/CopingGames";
import { PuzzlesScreen } from "@/features/puzzles/PuzzlesScreen";
import { ActivitiesScreen } from "@/features/activities/ActivitiesScreen";
import { CalmingSpace } from "@/features/sanctuary/CalmingSpace";
import { SoulMap } from "@/features/soulmap/SoulMap";
import { AuraVisualizer } from "@/features/aura/AuraVisualizer";
import { QuietRoom } from "@/features/sanctuary/QuietRoom";
import { EnergyRelease } from "@/features/sanctuary/EnergyRelease";
import { InnerOracle } from "@/features/oracle/InnerOracle";
import { DisclaimerScreen } from "@/features/disclaimer/DisclaimerScreen";
import { ScreenshotPreview } from "@/features/preview/ScreenshotPreview";

export interface FeatureMeta {
  id: string;
  label: string;
  category: "Rituals" | "Sanctuary" | "Wisdom" | "Games" | "Account";
  icon: string;
  description: string;
  component: React.ComponentType<any>;
}

export const FEATURES_REGISTRY: FeatureMeta[] = [
  // 1. Sanctuary Home
  {
    id: "calm",
    label: "Sanctuary Space",
    category: "Sanctuary",
    icon: "🎨",
    description: "Your safe calming space designed for mental peace and sensory ease.",
    component: CalmingSpace,
  },
  // 2. Daily Rituals
  {
    id: "mood",
    label: "Mood Check-In",
    category: "Rituals",
    icon: "😊",
    description: "Check in with your emotional spectrum and track grounding insights.",
    component: MoodCheckIn,
  },
  {
    id: "chat",
    label: "Celys AI",
    category: "Wisdom",
    icon: "💬",
    description: "24/7 compassionate, therapeutic AI companion holding quiet space.",
    component: AIChat,
  },
  {
    id: "affirmations",
    label: "Sacred Affirmations",
    category: "Rituals",
    icon: "✨",
    description: "Personalized healing mantras and radiant self-worth reminders.",
    component: AffirmationsScreen,
  },
  {
    id: "breathing",
    label: "Breathing Pacer",
    category: "Rituals",
    icon: "🌬️",
    description: "Parasympathetic vagal nerve regulation and rhythmic breath visualizers.",
    component: BreathingScreen,
  },
  {
    id: "journal",
    label: "Soul Journal",
    category: "Rituals",
    icon: "📓",
    description: "Private, encrypted safe space for reflection and emotional processing.",
    component: JournalScreen,
  },
  // 3. Sanctuary & Audio
  {
    id: "meditation",
    label: "Guided Meditation",
    category: "Sanctuary",
    icon: "🧘",
    description: "Somatic anxiety release, sleep waves, and guided mindful journeys.",
    component: MeditationScreen,
  },
  {
    id: "soundscapes",
    label: "432Hz Soundscapes",
    category: "Sanctuary",
    icon: "🎵",
    description: "Binaural theta frequencies, tranquil rain, and harmonic resonance.",
    component: RelaxationMusic,
  },
  {
    id: "quiet",
    label: "Quiet Room",
    category: "Sanctuary",
    icon: "🌑",
    description: "Zero-stimulus dark sanctuary for nervous system decompression.",
    component: QuietRoom,
  },
  {
    id: "release",
    label: "Energy Release",
    category: "Sanctuary",
    icon: "⚡",
    description: "Transmute heavy emotions into the cosmic void with fire rituals.",
    component: EnergyRelease,
  },
  // 4. Wisdom & Exploration
  {
    id: "soulmap",
    label: "Soul Constellation",
    category: "Wisdom",
    icon: "🌟",
    description: "Map your mindfulness milestones across your personal sky.",
    component: SoulMap,
  },
  {
    id: "aura",
    label: "Aura Visualizer",
    category: "Wisdom",
    icon: "🌈",
    description: "Real-time biometric and emotional resonance spectrum.",
    component: AuraVisualizer,
  },
  {
    id: "oracle",
    label: "Inner Oracle",
    category: "Wisdom",
    icon: "🔮",
    description: "Intuitive archetype guidance cards for reflection during crossroads.",
    component: InnerOracle,
  },
  // 5. Tactile & Regulation Games
  {
    id: "bubble",
    label: "Bubble Pop Game",
    category: "Games",
    icon: "🫧",
    description: "Tactile anxiety de-escalation with calming haptic sensory bubbles.",
    component: BubbleGame,
  },
  {
    id: "coping",
    label: "Coping Games",
    category: "Games",
    icon: "🎮",
    description: "5-4-3-2-1 grounding, color sorting, and tactile distress tolerance.",
    component: CopingGames,
  },
  {
    id: "puzzles",
    label: "Puzzles",
    category: "Games",
    icon: "🧩",
    description: "Gentle challenges for a focused mind.",
    component: PuzzlesScreen,
  },
  {
    id: "activities",
    label: "Mindful Activities",
    category: "Games",
    icon: "🌿",
    description: "Gentle somatic stretches, tea rituals, and mindful pauses.",
    component: ActivitiesScreen,
  },
  // 6. Account & Sanctuary Info
  {
    id: "subscription",
    label: "Subscription",
    category: "Account",
    icon: "⭐",
    description: "Manage your unlimited Sanctuary membership and premium soundscapes.",
    component: SubscriptionScreen,
  },
  // {
  //   id: "preview",
  //   label: "App Tour & Showcase",
  //   category: "Account",
  //   icon: "📸",
  //   description: "Explore the official feature tour and App Store highlights.",
  //   component: ScreenshotPreview,
  // },
  {
    id: "disclaimer",
    label: "Safety & Disclaimer",
    category: "Account",
    icon: "ℹ️",
    description: "Clinical safety boundaries, privacy terms, and crisis resources.",
    component: DisclaimerScreen,
  },
];

// 5 Core Bottom Navigation Destinations
const PRIMARY_BOTTOM_NAV = [
  { id: "calm", label: "Sanctuary", icon: Sparkles },
  { id: "mood", label: "Check-In", icon: Smile },
  { id: "chat", label: "Celys AI", icon: MessageCircle },
  { id: "soundscapes", label: "Sounds", icon: Music },
  { id: "meditation", label: "Meditate", icon: Moon },
];

interface AppShellProps {
  initialScreen?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ initialScreen = "calm" }) => {
  const { user, logout, isLoading } = useAuth();
  const [activeScreenId, setActiveScreenId] = useState(initialScreen);
  const [showDirectory, setShowDirectory] = useState(false);

  // Sync initialScreen if prop changes
  useEffect(() => {
    if (initialScreen && FEATURES_REGISTRY.some((f) => f.id === initialScreen)) {
      setActiveScreenId(initialScreen);
    }
  }, [initialScreen]);

  // Deep linking, path routing, and browser history popstate support
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, "");
      const hash = window.location.hash.replace("#", "");
      const target = hash || path;
      if (target && FEATURES_REGISTRY.some((f) => f.id === target)) {
        setActiveScreenId(target);
      }
    };

    // On mount, check pathname / hash
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/^\//, "");
      const hash = window.location.hash.replace("#", "");
      const target = hash || path;
      if (target && FEATURES_REGISTRY.some((f) => f.id === target)) {
        setActiveScreenId(target);
      }
    }

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const handleNavigate = (screenId: string) => {
    setActiveScreenId(screenId);
    setShowDirectory(false);
    if (typeof window !== "undefined") {
      try {
        const targetPath = screenId === "calm" ? "/" : `/${screenId}`;
        window.history.pushState({ screenId }, "", targetPath);
      } catch {
        window.location.hash = screenId;
      }
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #2a0d5e 0%, #0d0a1e 45%, #1a0838 100%)",
        }}
      >
        <StarField count={30} />
        <CelysLogo size={80} />
        <p className="mt-4 text-xs tracking-widest text-purple-200/60 uppercase font-medium animate-pulse">
          Opening Sanctuary...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated Flow: Pure Login/Signup Screen without any bottom bar or prototype navigation
  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #2a0d5e 0%, #0d0a1e 45%, #1a0838 100%)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <StarField count={45} />
        <LotusCorners />
        <div className="relative z-10 w-full max-w-sm">
          <LoginScreen onSuccess={() => handleNavigate(activeScreenId || "calm")} />
        </div>
      </div>
    );
  }

  // 3. Authenticated Flow: Real Production Application
  const currentFeature =
    FEATURES_REGISTRY.find((f) => f.id === activeScreenId) || FEATURES_REGISTRY[0];
  const CurrentFeatureComponent = currentFeature.component;
  const isHomeScreen = activeScreenId === "calm";

  return (
    <div
      className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col items-center justify-between overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, #2a0d5e 0%, #0d0a1e 45%, #1a0838 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <StarField count={45} />
      <LotusCorners />

      {/* Top Application Header Bar — Clean & Exact Figma Match */}
      <header className="relative z-20 w-full max-w-md flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        {/* Left: Screen Icon & Title */}
        <div className="flex items-center gap-2">
          <span className="text-base select-none">{currentFeature.icon}</span>
          <span className="text-xs sm:text-sm font-semibold text-[#f0e8ff] tracking-wide">
            {currentFeature.label}
          </span>
        </div>

        {/* Right: Clean Circular Hamburger Menu Button */}
        <button
          onClick={() => setShowDirectory(true)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/15 active:scale-95"
          style={{
            background: showDirectory
              ? "rgba(124, 58, 237, 0.4)"
              : "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(180, 120, 255, 0.22)",
            color: "#f0e8ff",
          }}
          title="Sanctuary Directory Menu"
        >
          <Menu size={16} />
        </button>
      </header>

      {/* Main Viewport Content Area */}
      <main
        className={`relative z-10 w-full max-w-md flex-1 min-h-0 px-2 py-1 flex flex-col justify-start pb-20 ${activeScreenId === "chat" ? "overflow-hidden" : "overflow-y-auto"
          }`}
      >
        <CurrentFeatureComponent onSuccess={() => handleNavigate("mood")} />
      </main>

      {/* Real Application Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-3 pb-3 pt-2 safe-area-bottom"
        style={{
          background: "linear-gradient(to top, rgba(10, 6, 24, 0.96) 80%, transparent 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          className="w-full max-w-md rounded-3xl py-1.5 px-1 sm:px-2 flex items-center justify-between shadow-2xl"
          style={{
            background: "rgba(26, 16, 52, 0.85)",
            border: "1px solid rgba(180, 120, 255, 0.22)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgba(124, 58, 237, 0.15)",
          }}
        >
          {PRIMARY_BOTTOM_NAV.map((item) => {
            const isActive = activeScreenId === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200"
                style={{
                  color: isActive ? "#ffffff" : "rgba(240, 232, 255, 0.55)",
                  background: isActive ? "rgba(124, 58, 237, 0.3)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(201, 108, 204, 0.45)"
                    : "1px solid transparent",
                }}
              >
                <IconComponent
                  size={18}
                  className={isActive ? "text-[#f5d76e] drop-shadow-[0_0_6px_rgba(245,215,110,0.6)]" : ""}
                />
                <span
                  className="text-[10px] font-medium mt-0.5 truncate max-w-full text-center leading-tight"
                  style={{
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Feature Directory Drawer (All 21 Features) */}
      {showDirectory && (
        <div
          className="fixed inset-0 z-50 flex flex-col animate-in fade-in duration-200"
          style={{ background: "rgba(10, 6, 24, 0.97)", backdropFilter: "blur(16px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-purple-400/15 max-w-4xl mx-auto w-full flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-serif">Sanctuary Directory</span>
              {/* <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                21 Features
              </span> */}
            </div>
            <button
              onClick={() => setShowDirectory(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-purple-200/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Directory Content Grid */}
          <div className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-4 w-full max-w-4xl mx-auto pb-24 safe-area-bottom">
            {(["Rituals", "Sanctuary", "Wisdom", "Games", "Account"] as const).map(
              (category) => {
                const categoryFeatures = FEATURES_REGISTRY.filter(
                  (f) => f.category === category
                );
                if (categoryFeatures.length === 0) return null;

                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#f5d76e] mb-2.5 px-2">
                      {category === "Rituals" && "✦ Daily Mindful Rituals"}
                      {category === "Sanctuary" && "✦ Sanctuary & Sound"}
                      {category === "Wisdom" && "✦ AI & Intuitive Wisdom"}
                      {category === "Games" && "✦ Somatic & De-escalation Games"}
                      {category === "Account" && "✦ Sanctuary Membership & Info"}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {categoryFeatures.map((f) => {
                        const isActive = activeScreenId === f.id;

                        return (
                          <button
                            key={f.id}
                            onClick={() => handleNavigate(f.id)}
                            className="flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all hover:brightness-110 active:scale-[0.99]"
                            style={{
                              background: isActive
                                ? "rgba(124, 58, 237, 0.35)"
                                : "rgba(255, 255, 255, 0.05)",
                              border: isActive
                                ? "1.5px solid rgba(201, 108, 204, 0.7)"
                                : "1px solid rgba(180, 120, 255, 0.15)",
                              boxShadow: isActive
                                ? "0 0 16px rgba(201, 108, 204, 0.25)"
                                : "none",
                            }}
                          >
                            <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-xs font-semibold leading-tight truncate"
                                style={{
                                  color: isActive ? "#ffffff" : "rgba(240, 232, 255, 0.9)",
                                }}
                              >
                                {f.label}
                              </h4>
                              <p className="text-[11px] text-purple-200/60 mt-0.5 line-clamp-2 leading-relaxed">
                                {f.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}

            {/* Profile Card & Logout */}
            <div className="mt-8 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-purple-400/15 flex items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                {(() => {
                  const effectiveName =
                    user.displayName &&
                    user.displayName.trim() &&
                    user.displayName.toLowerCase() !== "beautiful soul"
                      ? user.displayName.trim()
                      : user.email
                        ? user.email.split("@")[0].charAt(0).toUpperCase() +
                          user.email.split("@")[0].slice(1)
                        : "Beautiful Soul";

                  return (
                    <>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-inner">
                        {effectiveName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">
                          {effectiveName}
                        </p>
                        <p className="text-[10px] text-purple-200/60 truncate">
                          {user.email}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-95"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;


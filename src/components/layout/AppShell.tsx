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
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/app/providers";
import { useAccessibility } from "@/context/AccessibilityContext";
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
import { PrivacyPolicyScreen } from "@/features/legal/PrivacyPolicyScreen";
import { TermsConditionsScreen } from "@/features/legal/TermsConditionsScreen";

export interface FeatureMeta {
  id: string;
  label: string;
  category: "Rituals" | "Sanctuary" | "Wisdom" | "Games" | "Account";
  icon: string;
  description: string;
  component: React.ComponentType<any>;
}

export const FEATURES_REGISTRY: FeatureMeta[] = [
  // Left Column Screens (Exact Figma Match)
  {
    id: "login",
    label: "Login",
    category: "Account",
    icon: "🔓",
    description: "Sign in to sync your sanctuary data and milestones across devices.",
    component: LoginScreen,
  },
  {
    id: "mood",
    label: "Mood Check-In",
    category: "Rituals",
    icon: "😊",
    description: "Check in with your emotional spectrum and track grounding insights.",
    component: MoodCheckIn,
  },
  {
    id: "affirmations",
    label: "Affirmations",
    category: "Rituals",
    icon: "✨",
    description: "Personalized healing mantras and radiant self-worth reminders.",
    component: AffirmationsScreen,
  },
  {
    id: "meditation",
    label: "Meditation",
    category: "Sanctuary",
    icon: "🧘",
    description: "Somatic anxiety release, sleep waves, and guided mindful journeys.",
    component: MeditationScreen,
  },
  {
    id: "bubble",
    label: "Bubble Game",
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
    id: "activities",
    label: "Activities",
    category: "Games",
    icon: "🌱",
    description: "Small steps toward feeling better with grounding and mindful pauses.",
    component: ActivitiesScreen,
  },
  {
    id: "soulmap",
    label: "Soul Map",
    category: "Wisdom",
    icon: "🌟",
    description: "Map your mindfulness milestones across your personal sky.",
    component: SoulMap,
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
    id: "oracle",
    label: "Inner Oracle",
    category: "Wisdom",
    icon: "🔮",
    description: "Intuitive archetype guidance cards for reflection during crossroads.",
    component: InnerOracle,
  },
  {
    id: "preview",
    label: "Screenshots",
    category: "Account",
    icon: "🖼️",
    description: "Explore the official feature tour and App Store highlights.",
    component: ScreenshotPreview,
  },

  // Right Column Screens (Exact Figma Match)
  {
    id: "subscription",
    label: "Subscription",
    category: "Account",
    icon: "⭐",
    description: "Manage your unlimited Sanctuary membership and premium soundscapes.",
    component: SubscriptionScreen,
  },
  {
    id: "chat",
    label: "AI Chat",
    category: "Wisdom",
    icon: "💬",
    description: "24/7 compassionate, therapeutic AI companion holding quiet space.",
    component: AIChat,
  },
  {
    id: "journal",
    label: "Journal",
    category: "Rituals",
    icon: "📓",
    description: "Private, encrypted safe space for reflection and emotional processing.",
    component: JournalScreen,
  },
  {
    id: "breathing",
    label: "Breathing",
    category: "Rituals",
    icon: "🌬️",
    description: "Parasympathetic vagal nerve regulation and rhythmic breath visualizers.",
    component: BreathingScreen,
  },
  {
    id: "soundscapes",
    label: "Music",
    category: "Sanctuary",
    icon: "🎵",
    description: "Binaural theta frequencies, tranquil rain, and harmonic resonance.",
    component: RelaxationMusic,
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
    id: "calm",
    label: "Calm Space",
    category: "Sanctuary",
    icon: "🎨",
    description: "Your safe calming space designed for mental peace and sensory ease.",
    component: CalmingSpace,
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
    id: "release",
    label: "Energy Release",
    category: "Sanctuary",
    icon: "⚡",
    description: "Transmute heavy emotions into the cosmic void with fire rituals.",
    component: EnergyRelease,
  },
  {
    id: "disclaimer",
    label: "Disclaimer",
    category: "Account",
    icon: "ℹ️",
    description: "Clinical safety boundaries, privacy terms, and crisis resources.",
    component: DisclaimerScreen,
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    category: "Account",
    icon: "🛡️",
    description: "How Celys Care protects your data, session privacy, and sacred space.",
    component: PrivacyPolicyScreen,
  },
  {
    id: "terms",
    label: "Terms & Conditions",
    category: "Account",
    icon: "📜",
    description: "Usage licenses, intellectual property, and guidelines for Celys Care.",
    component: TermsConditionsScreen,
  },
];

const FIGMA_MENU_LEFT = [
  "login",
  "mood",
  "affirmations",
  "meditation",
  "bubble",
  "coping",
  "activities",
  "soulmap",
  "quiet",
  "oracle",
  "preview",
];

const FIGMA_MENU_RIGHT = [
  "subscription",
  "chat",
  "journal",
  "breathing",
  "soundscapes",
  "puzzles",
  "calm",
  "aura",
  "release",
  "disclaimer",
  "privacy",
  "terms",
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
  const { user, logout, deleteAccount, isLoading } = useAuth();
  const { currentTheme } = useAccessibility();
  const [activeScreenId, setActiveScreenId] = useState(initialScreen);
  const [showDirectory, setShowDirectory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setShowDeleteModal(false);
      setShowDirectory(false);
      toast.success("Your account and all data have been permanently deleted.");
      handleNavigate("login");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const [authMode, setAuthMode] = useState<"login" | "signup">(() => {
    if (initialScreen === "signup") return "signup";
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("celys_auth_return_mode");
        if (saved === "signup" || saved === "login") return saved;
        if (window.location.pathname.includes("signup")) return "signup";
      } catch { }
    }
    return "login";
  });

  const handleSetAuthMode = (mode: "login" | "signup") => {
    setAuthMode(mode);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("celys_auth_return_mode", mode);
      } catch { }
    }
  };

  // Sync initialScreen if prop changes
  useEffect(() => {
    if (initialScreen === "signup") {
      handleSetAuthMode("signup");
      setActiveScreenId("login");
    } else if (initialScreen && FEATURES_REGISTRY.some((f) => f.id === initialScreen)) {
      setActiveScreenId(initialScreen);
    }
  }, [initialScreen]);

  // Deep linking, path routing, and browser history popstate support
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, "");
      const hash = window.location.hash.replace("#", "");
      const target = hash || path;
      if (target === "signup") {
        handleSetAuthMode("signup");
        setActiveScreenId("login");
      } else if (target === "login") {
        handleSetAuthMode("login");
        setActiveScreenId("login");
      } else if (target && FEATURES_REGISTRY.some((f) => f.id === target)) {
        setActiveScreenId(target);
      }
    };

    // On mount, check pathname / hash
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/^\//, "");
      const hash = window.location.hash.replace("#", "");
      const target = hash || path;
      if (target === "signup") {
        handleSetAuthMode("signup");
        setActiveScreenId("login");
      } else if (target === "login") {
        handleSetAuthMode("login");
        setActiveScreenId("login");
      } else if (target && FEATURES_REGISTRY.some((f) => f.id === target)) {
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

  // When user is authenticated, ensure we immediately redirect to "calm" if activeScreenId is "login" or "signup"
  useEffect(() => {
    if (user && (activeScreenId === "login" || activeScreenId === "signup")) {
      setActiveScreenId("calm");
      if (typeof window !== "undefined") {
        try {
          window.history.replaceState({ screenId: "calm" }, "", "/");
        } catch { }
      }
    }
  }, [user, activeScreenId]);

  const handleNavigate = (screenId: string) => {
    if (screenId === "signup") {
      if (user) {
        setActiveScreenId("calm");
        setShowDirectory(false);
        if (typeof window !== "undefined") {
          window.history.pushState({ screenId: "calm" }, "", "/");
        }
        return;
      }
      handleSetAuthMode("signup");
      setActiveScreenId("login");
      setShowDirectory(false);
      if (typeof window !== "undefined") {
        window.history.pushState({ screenId: "signup" }, "", "/signup");
      }
      return;
    }
    if (screenId === "login") {
      if (user) {
        setActiveScreenId("calm");
        setShowDirectory(false);
        if (typeof window !== "undefined") {
          window.history.pushState({ screenId: "calm" }, "", "/");
        }
        return;
      }
      setActiveScreenId("login");
      setShowDirectory(false);
      if (typeof window !== "undefined") {
        window.history.pushState({ screenId: "login" }, "", authMode === "signup" ? "/signup" : "/login");
      }
      return;
    }
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
          background: currentTheme.bgGradient,
          transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
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

  // 2. Unauthenticated Flow: Allow public screens (Privacy, Terms, Disclaimer) without login, or show Login/Signup
  if (!user) {
    if (activeScreenId === "privacy" || activeScreenId === "terms" || activeScreenId === "disclaimer") {
      const publicFeature =
        FEATURES_REGISTRY.find((f) => f.id === activeScreenId) || FEATURES_REGISTRY[0];
      const PublicComponent = publicFeature.component;

      return (
        <div
          className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between overflow-y-auto"
          style={{
            background: currentTheme.bgGradient,
            transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <StarField count={35} />
          <LotusCorners />

          {/* Clean Top Navigation Bar with Dynamic Back Button */}
          <header
            className="relative z-20 w-full max-w-md flex items-center justify-between px-4 pt-2 pb-2 flex-shrink-0"
            style={{
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
            }}
          >
            <button
              onClick={() => handleNavigate("login")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-purple-200/90 bg-white/10 hover:bg-white/20 border border-purple-300/20 transition-all active:scale-95 shadow-sm"
              title={authMode === "signup" ? "Back to Sign Up" : "Back to Log In"}
            >
              <span>←</span>
              <span>{authMode === "signup" ? "Back to Sign Up" : "Back to Log In"}</span>
            </button>
            <span className="text-xs font-semibold text-[#f5d76e]">
              {publicFeature.label}
            </span>
          </header>

          <main className="relative z-10 w-full max-w-md flex-1 px-3 pt-2 pb-10">
            <PublicComponent
              onNavigate={handleNavigate}
              onSuccess={() => handleNavigate("login")}
            />
          </main>
        </div>
      );
    }

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8"
        style={{
          background: currentTheme.bgGradient,
          transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <StarField count={45} />
        <LotusCorners />
        <div className="relative z-10 w-full max-w-sm">
          <LoginScreen
            initialMode={authMode}
            onModeChange={handleSetAuthMode}
            onSuccess={() => handleNavigate("calm")}
            onNavigate={handleNavigate}
          />
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
        background: currentTheme.bgGradient,
        transition: "background 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <StarField count={45} />
      <LotusCorners />

      {/* Top Application Header Bar — Responsive Adaptive Header for iOS & Android */}
      <header
        className="relative z-20 w-full max-w-md flex items-center justify-between px-4 pt-1 pb-1 flex-shrink-0"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 4px)",
        }}
      >
        {/* Left: Screen Icon & Title */}
        <div className="flex items-center gap-2">
          <span className="text-base select-none">{currentFeature.icon}</span>
          <span className="text-sm font-semibold text-[#f0e8ff] tracking-wide">
            {currentFeature.label}
          </span>
        </div>

        {/* Right: Clean Circular Hamburger Menu Button */}
        <button
          onClick={() => setShowDirectory(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/15 active:scale-95"
          style={{
            background: showDirectory
              ? currentTheme.glow
              : "rgba(255, 255, 255, 0.08)",
            border: `1px solid ${currentTheme.border}`,
            color: "#f0e8ff",
          }}
          title="Sanctuary Directory Menu"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Main Viewport Content Area */}
      <main
        className={`relative z-10 w-full max-w-md flex-1 min-h-0 px-2 pt-2 pb-20 ${activeScreenId === "chat" ? "overflow-hidden" : "overflow-y-auto"
          }`}
      >
        <CurrentFeatureComponent
          onSuccess={() => handleNavigate("mood")}
          onNavigate={handleNavigate}
        />
      </main>

      {/* Real Application Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-3 pb-3 pt-2 safe-area-bottom"
        style={{
          background: currentTheme.navFade,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          className="w-full max-w-md rounded-3xl py-1.5 px-1.5 sm:px-2 flex items-center justify-between gap-1 shadow-2xl transition-all duration-500"
          style={{
            background: currentTheme.navBg,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 22px ${currentTheme.glow}`,
          }}
        >
          {PRIMARY_BOTTOM_NAV.map((item) => {
            const isActive = activeScreenId === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="flex-1 min-w-0 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 cursor-pointer"
                style={{
                  color: isActive ? "#ffffff" : "rgba(240, 232, 255, 0.55)",
                  background: isActive ? currentTheme.navActiveGradient : "transparent",
                  border: isActive
                    ? `1px solid ${currentTheme.border}`
                    : "1px solid transparent",
                  boxShadow: isActive ? `0 0 14px ${currentTheme.glow}` : "none",
                }}
              >
                <IconComponent
                  size={17}
                  className={isActive ? "text-[#f5d76e] drop-shadow-[0_0_6px_rgba(245,215,110,0.6)]" : ""}
                />
                <span
                  className="text-[10px] font-medium mt-0.5 truncate max-w-full text-center leading-tight select-none"
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

      {/* Feature Directory Drawer (Sanctuary Directory with Updated Figma Names) */}
      {showDirectory && (
        <div
          className="fixed inset-0 z-50 flex flex-col animate-in fade-in duration-200"
          style={{ background: currentTheme.navBg, backdropFilter: "blur(24px)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 pb-3 border-b max-w-4xl mx-auto w-full flex-shrink-0"
            style={{
              borderColor: currentTheme.border,
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-serif tracking-wide">
                Sanctuary Directory
              </span>
            </div>
            <button
              onClick={() => setShowDirectory(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Directory Content Grid */}
          <div className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-4 w-full max-w-4xl mx-auto pb-24 safe-area-bottom">
            {(["Rituals", "Sanctuary", "Wisdom", "Games", "Account"] as const).map(
              (category) => {
                const categoryFeatures = FEATURES_REGISTRY.filter(
                  (f) => f.category === category && f.id !== "login" && f.id !== "preview"
                );
                if (categoryFeatures.length === 0) return null;

                return (
                  <div key={category} className="mb-6">
                    <h3
                      className="text-xs font-semibold uppercase tracking-widest mb-2.5 px-2 transition-colors"
                      style={{
                        color: currentTheme.color,
                        textShadow: `0 0 10px ${currentTheme.glow}`,
                      }}
                    >
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
                            className="flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all hover:brightness-110 active:scale-[0.99] cursor-pointer"
                            style={{
                              background: isActive
                                ? currentTheme.navActiveGradient
                                : currentTheme.cardBg,
                              border: isActive
                                ? `1.5px solid ${currentTheme.borderStrong}`
                                : `1px solid ${currentTheme.cardBorder}`,
                              boxShadow: isActive
                                ? `0 0 18px ${currentTheme.glow}`
                                : "0 2px 8px rgba(0,0,0,0.25)",
                            }}
                          >
                            <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-xs font-semibold leading-tight truncate"
                                style={{
                                  color: isActive ? "#ffffff" : "rgba(240, 232, 255, 0.95)",
                                }}
                              >
                                {f.label}
                              </h4>
                              <p className="text-[11px] text-white/70 mt-0.5 line-clamp-2 leading-relaxed">
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

            {/* Profile Card & Account Management */}
            <div
              className="mt-8 p-3.5 sm:p-4 rounded-2xl flex flex-col gap-3 w-full transition-all duration-300"
              style={{
                background: currentTheme.cardBg,
                border: `1px solid ${currentTheme.cardBorder}`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 16px ${currentTheme.glow}`,
              }}
            >
              <div className="flex items-center justify-between gap-2.5 w-full">
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
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-inner"
                          style={{
                            background: `${currentTheme.color}33`,
                            border: `1.5px solid ${currentTheme.borderStrong}`,
                          }}
                        >
                          {effectiveName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">
                            {effectiveName}
                          </p>
                          <p className="text-[10px] text-white/60 truncate">
                            {user.email}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <button
                  onClick={logout}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white/10 text-purple-200/90 border border-purple-300/20 hover:bg-white/15 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Danger Zone: Delete Account */}
              <div className="pt-2.5 border-t border-purple-400/10 flex items-center justify-between">
                <span className="text-[11px] text-purple-200/50">Need to delete your account?</span>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 active:scale-95 cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-sm rounded-3xl p-5 relative overflow-hidden shadow-2xl border border-rose-500/40 text-center"
            style={{
              background: "linear-gradient(135deg, #1f0b24 0%, #120718 100%)",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-white">
              Permanently Delete Account?
            </h3>

            <p className="text-xs text-purple-200/70 mt-2 leading-relaxed">
              This action is <span className="text-rose-400 font-semibold">permanent and cannot be undone</span>. All your check-ins, journal entries, affirmations, milestones, and personal data will be completely erased from our servers.
            </p>

            <div className="w-full flex flex-col gap-2.5 mt-5">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <span>Deleting Account...</span>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Permanently Delete</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full py-2.5 rounded-full text-xs font-medium text-purple-200/80 hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel & Keep Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;


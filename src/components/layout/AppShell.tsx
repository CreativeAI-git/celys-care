"use client";

import React, { useState } from "react";
import {
  Heart,
  Smile,
  Bot,
  Music,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";

import { useAuth } from "@/app/providers";
import { StarField } from "@/components/branding/StarField";
import { LotusCorners } from "@/components/branding/LotusCorners";

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

export const SCREENS_META = [
  { id: "login", label: "Login", icon: "🔐", component: LoginScreen },
  { id: "subscription", label: "Subscription", icon: "⭐", component: SubscriptionScreen },
  { id: "mood", label: "Mood Check-In", icon: "😊", component: MoodCheckIn },
  { id: "chat", label: "AI Chat", icon: "💬", component: AIChat },
  { id: "affirmations", label: "Affirmations", icon: "✨", component: AffirmationsScreen },
  { id: "journal", label: "Journal", icon: "📓", component: JournalScreen },
  { id: "meditation", label: "Meditation", icon: "🧘", component: MeditationScreen },
  { id: "breathing", label: "Breathing", icon: "🌬️", component: BreathingScreen },
  { id: "bubble", label: "Bubble Game", icon: "🫧", component: BubbleGame },
  { id: "soundscapes", label: "Music", icon: "🎵", component: RelaxationMusic },
  { id: "coping", label: "Coping Games", icon: "🎮", component: CopingGames },
  { id: "puzzles", label: "Puzzles", icon: "🧩", component: PuzzlesScreen },
  { id: "activities", label: "Activities", icon: "🌿", component: ActivitiesScreen },
  { id: "calm", label: "Calm Space", icon: "🎨", component: CalmingSpace },
  { id: "soulmap", label: "Soul Map", icon: "🌟", component: SoulMap },
  { id: "aura", label: "Aura Visualizer", icon: "🌈", component: AuraVisualizer },
  { id: "quiet", label: "Quiet Room", icon: "🌑", component: QuietRoom },
  { id: "release", label: "Energy Release", icon: "⚡", component: EnergyRelease },
  { id: "oracle", label: "Inner Oracle", icon: "🔮", component: InnerOracle },
  { id: "disclaimer", label: "Disclaimer", icon: "ℹ️", component: DisclaimerScreen },
  { id: "preview", label: "Screenshots", icon: "📸", component: ScreenshotPreview },
];

function NavDots({
  slide,
  total,
  onChange,
}: {
  slide: number;
  total: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-[280px]">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="rounded-full transition-all"
          style={{
            width: i === slide ? 18 : 6,
            height: 6,
            background:
              i === slide
                ? "linear-gradient(135deg, #c96ccc, #7c3aed)"
                : "rgba(255, 255, 255, 0.18)",
            boxShadow:
              i === slide ? "0 0 6px rgba(201, 108, 204, 0.5)" : "none",
          }}
        />
      ))}
    </div>
  );
}

export const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const [slide, setSlide] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const total = SCREENS_META.length;

  const currentMeta = SCREENS_META[slide] || SCREENS_META[0];
  const CurrentScreenComponent = currentMeta.component;

  const handleSelectScreen = (idx: number) => {
    setSlide(idx);
    setShowMenu(false);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, #2a0d5e 0%, #0d0a1e 45%, #1a0838 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background stars and decorative botanical corners */}
      <StarField count={45} />
      <LotusCorners />

      {/* Top Header Bar (Figma Exact Match) */}
      <div className="relative z-20 w-full max-w-sm flex items-center justify-between px-5 pt-4 pb-1">
        <div className="flex items-center gap-1.5">
          <span style={{ color: "#c9a227", fontSize: 14 }}>
            {currentMeta.icon}
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: "rgba(240, 232, 255, 0.65)" }}
          >
            {currentMeta.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(180, 120, 255, 0.2)",
                color: "rgba(240, 232, 255, 0.5)",
              }}
            >
              <LogOut size={11} /> Out
            </button>
          )}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(180, 120, 255, 0.2)",
            }}
            title="All Screens Menu"
          >
            <span
              style={{
                color: "rgba(240, 232, 255, 0.7)",
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ☰
            </span>
          </button>
        </div>
      </div>

      {/* Slide Menu Overlay (Full-Width Two-Column Layout from Screenshot 1) */}
      {showMenu && (
        <div
          className="fixed inset-0 z-50 flex flex-col animate-in fade-in duration-200"
          style={{ background: "rgba(13, 10, 30, 0.98)" }}
        >
          {/* Top Bar matching Screenshot 1 */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-purple-400/10">
            <span className="text-sm font-semibold text-[#f0e8ff]">
              All Screens
            </span>
            <button
              onClick={() => setShowMenu(false)}
              className="text-lg text-purple-200/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Full Container Width 2-Column Grid */}
          <div className="flex-1 overflow-y-auto px-6 py-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-5xl mx-auto pb-10">
              {SCREENS_META.map((s, i) => {
                const isActive = slide === i;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSelectScreen(i)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all hover:brightness-110 active:scale-[0.99]"
                    style={{
                      background: isActive
                        ? "rgba(124, 58, 237, 0.4)"
                        : "rgba(255, 255, 255, 0.05)",
                      border: isActive
                        ? "1.5px solid rgba(201, 108, 204, 0.7)"
                        : "1px solid rgba(180, 120, 255, 0.15)",
                      boxShadow: isActive
                        ? "0 0 16px rgba(201, 108, 204, 0.3)"
                        : "none",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span
                      className="text-xs font-medium leading-tight"
                      style={{
                        color: isActive ? "#ffffff" : "rgba(240, 232, 255, 0.75)",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Slides Viewport */}
      <div className="relative z-10 w-full max-w-sm flex-1 overflow-y-auto">
        <CurrentScreenComponent onSuccess={() => setSlide(1)} />
      </div>

      {/* Bottom Navigation (Figma Exact Match) */}
      <div
        className="relative z-10 w-full max-w-sm flex flex-col items-center gap-2 py-3 px-4"
        style={{
          background: "rgba(13, 10, 30, 0.8)",
          borderTop: "1px solid rgba(180, 120, 255, 0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <NavDots slide={slide} total={total} onChange={setSlide} />
        <div className="flex items-center gap-3 w-full justify-center">
          <button
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            disabled={slide === 0}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs transition-all disabled:opacity-30"
            style={{
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(180, 120, 255, 0.18)",
              color: slide === 0 ? "rgba(240, 232, 255, 0.2)" : "rgba(240, 232, 255, 0.6)",
            }}
          >
            <ChevronLeft size={13} /> Prev
          </button>
          <span
            className="text-xs"
            style={{ color: "rgba(240, 232, 255, 0.3)" }}
          >
            {slide + 1} / {total}
          </span>
          <button
            onClick={() => setSlide((s) => Math.min(total - 1, s + 1))}
            disabled={slide === total - 1}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs transition-all disabled:opacity-30"
            style={{
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(180, 120, 255, 0.18)",
              color:
                slide === total - 1
                  ? "rgba(240, 232, 255, 0.2)"
                  : "rgba(240, 232, 255, 0.6)",
            }}
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppShell;

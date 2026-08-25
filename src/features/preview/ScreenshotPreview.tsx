"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star, X, ShieldCheck, Sparkles } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";

interface FeatureTourItem {
  title: string;
  tagline: string;
  quote: string;
}

const PREVIEWS: FeatureTourItem[] = [
  {
    title: "Sacred Daily Affirmations",
    tagline: "Cultivate radiant self-worth and unconditional peace.",
    quote: "I am deserving of peace, gentleness, and unconditional love.",
  },
  {
    title: "Empathetic AI Companion",
    tagline: "Always here to hold quiet space and guide soothing breath.",
    quote: "Take a slow, deep breath with me. Inhale for 4... hold for 4... exhale for 6.",
  },
  {
    title: "Guided Meditation Sanctuary",
    tagline: "Procedural soundscapes with 432Hz theta binaural resonance.",
    quote: "Morning Radiance • Somatic Anxiety Release • Deep Sleep Waves",
  },
  {
    title: "Sensory Bubble Pop & Games",
    tagline: "Tactile regulation for stress and overwhelm de-escalation.",
    quote: "Bubble Pop • 5-4-3-2-1 Grounding • Color Sort • Zen Garden",
  },
  {
    title: "Cosmic Soul Constellation",
    tagline: "Map every mindfulness milestone across your personal sky.",
    quote: "Interactive milestone stars, memory anchors & reflections.",
  },
];

const APP_STORE_SCREENSHOTS = [
  {
    id: 1,
    title: "Welcome to Celys Care",
    subtitle: "Your judgment-free space for healing, peace, and growth.",
    badge: "✦ SAFE SANCTUARY ✦",
  },
  {
    id: 2,
    title: "Sacred Daily Affirmations",
    subtitle: "Realign your spirit with personalized, soothing daily mantras.",
    badge: "✦ HEALING MANTRAS ✦",
  },
  {
    id: 3,
    title: "Empathetic AI Soul Companion",
    subtitle: "24/7 non-judgmental active listening and emotional co-regulation.",
    badge: "✦ AI SANCTUARY ✦",
  },
  {
    id: 4,
    title: "432Hz Soundscapes & Meditation",
    subtitle: "Clinically-informed theta binaural audio and tranquil sound design.",
    badge: "✦ THETA SOUNDSCAPES ✦",
  },
  {
    id: 5,
    title: "Tactile Anxiety Relief Games",
    subtitle: "Pop bubbles, ground your nervous system, and restore inner harmony.",
    badge: "✦ SOMATIC DE-ESCALATION ✦",
  },
  {
    id: 6,
    title: "Private Encrypted Soul Journal",
    subtitle: "Express thoughts safely with on-device biometric security.",
    badge: "✦ ZERO-KNOWLEDGE PRIVACY ✦",
  },
  {
    id: 7,
    title: "Interactive Soul Map",
    subtitle: "Watch your mindfulness constellation expand with every breath.",
    badge: "✦ CELESTIAL PROGRESS ✦",
  },
  {
    id: 8,
    title: "Breathwork & Aura Visualizer",
    subtitle: "Real-time rhythmic visual pacers for nervous system reset.",
    badge: "✦ PARASYMPATHETIC RESET ✦",
  },
  {
    id: 9,
    title: "Quiet Room & Energy Release",
    subtitle: "Release heavy burdens into the cosmic void with soothing fire rituals.",
    badge: "✦ EMOTIONAL TRANSMUTATION ✦",
  },
  {
    id: 10,
    title: "Inner Oracle & Wisdom Cards",
    subtitle: "Draw archetype cards for guidance during times of crossroads.",
    badge: "✦ INTUITIVE INSIGHT ✦",
  },
];

export const ScreenshotPreview: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAppStoreModal, setShowAppStoreModal] = useState(false);
  const [storeSlide, setStoreSlide] = useState(0);

  const current = PREVIEWS[currentIdx];

  const handleNext = () => setCurrentIdx((c) => (c + 1) % PREVIEWS.length);
  const handlePrev = () => setCurrentIdx((c) => (c - 1 + PREVIEWS.length) % PREVIEWS.length);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center pt-2 pb-3 px-3 text-center select-none">
      {/* 1. Main Title Section — Matches Figma Exactly */}
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <h2 className="text-[22px] font-serif font-bold text-white flex items-center tracking-tight">
          <span>App Tour &amp; Showcase</span>
          {/* Custom 4-pointed golden sparkle icon matching Figma */}
          <span className="inline-flex ml-1.5 text-[#f5d76e]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_6px_rgba(245,215,110,0.6)]"
            >
              <path
                d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z"
                fill="#f5d76e"
              />
              <path
                d="M19 3L20 6L23 7L20 8L19 11L18 8L15 7L18 6L19 3Z"
                fill="#f5d76e"
                opacity="0.85"
              />
            </svg>
          </span>
        </h2>

        {/* App Store Pill Button matching Figma */}
        <button
          onClick={() => setShowAppStoreModal(true)}
          className="px-3.5 py-1 rounded-full text-xs font-semibold text-[#f5d76e] transition-all hover:scale-105 active:scale-95"
          style={{
            border: "1.5px solid rgba(201, 162, 39, 0.7)",
            background: "rgba(201, 162, 39, 0.12)",
            boxShadow: "0 0 10px rgba(201, 162, 39, 0.15)",
          }}
        >
          App Store
        </button>
      </div>

      {/* 2. Main Feature Card — Matches Figma Exactly */}
      <div
        className="w-full rounded-[28px] p-6 text-left flex flex-col justify-between relative overflow-hidden transition-all duration-300"
        style={{
          minHeight: "285px",
          background: "rgba(22, 14, 44, 0.88)",
          border: "1px solid rgba(180, 120, 255, 0.25)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 10px 30px rgba(8, 4, 20, 0.6), 0 0 20px rgba(124, 58, 237, 0.12)",
        }}
      >
        {/* Top Row: Category Badge + Star Rating */}
        <div className="flex items-center justify-between w-full">
          {/* Gold Category Badge */}
          <div
            className="px-3.5 py-1 rounded-full text-xs font-semibold"
            style={{
              color: "#f5d76e",
              background: "rgba(201, 162, 39, 0.14)",
              border: "1.5px solid rgba(201, 162, 39, 0.6)",
            }}
          >
            {current.title}
          </div>

          {/* 5-Star Rating in Gold */}
          <div className="flex items-center gap-[3px] text-[#f5d76e]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill="#f5d76e"
                stroke="#f5d76e"
                strokeWidth={0.5}
                className="drop-shadow-[0_0_3px_rgba(245,215,110,0.5)]"
              />
            ))}
          </div>
        </div>

        {/* Middle: Feature Description + Affirmation Quote Box */}
        <div className="my-auto py-3">
          <p className="text-[17px] font-serif font-bold text-white mb-3.5 leading-snug">
            {current.tagline}
          </p>

          <div
            className="w-full rounded-2xl py-3 px-4 flex items-center justify-center text-center"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(180, 120, 255, 0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-[13px] font-serif italic text-[#f0e8ff] leading-relaxed flex items-center justify-center gap-1.5">
              <span className="text-purple-300 text-xs select-none">✦</span>
              <span>&lsquo;{current.quote}&rsquo;</span>
              <span className="text-purple-300 text-xs select-none">✦</span>
            </p>
          </div>
        </div>

        {/* Bottom Row: Feature Footer */}
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="font-medium" style={{ color: "rgba(240, 232, 255, 0.5)" }}>
            Feature {currentIdx + 1} of {PREVIEWS.length}
          </span>
          <span className="font-semibold text-[#f5d76e] flex items-center gap-1">
            <span>✦</span>
            <span>Celys Care Sanctuary</span>
            <span>✦</span>
          </span>
        </div>
      </div>

      {/* 3. Previous / Next Feature Controls — Matches Figma Exactly */}
      <div className="flex items-center justify-center gap-3.5 mt-5 mb-2 w-full">
        {/* Previous Circular Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Feature"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/15 active:scale-95"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(180, 120, 255, 0.28)",
            color: "#f0e8ff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Center Next Feature Purple Gradient Pill */}
        <button
          onClick={handleNext}
          className="h-12 px-7 rounded-full flex items-center justify-center gap-1.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #b04be6 0%, #7c3aed 100%)",
            boxShadow: "0 4px 20px rgba(168, 85, 247, 0.45)",
          }}
        >
          <span>Next Feature</span>
          <span className="text-base font-normal">→</span>
        </button>

        {/* Next Circular Button */}
        <button
          onClick={handleNext}
          aria-label="Next Feature"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white/15 active:scale-95"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(180, 120, 255, 0.28)",
            color: "#f0e8ff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 4. App Store Interactive Modal */}
      {showAppStoreModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          style={{ background: "rgba(10, 6, 24, 0.94)", backdropFilter: "blur(12px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-5 flex flex-col relative max-h-[92vh] overflow-y-auto"
            style={{
              background: "rgba(20, 13, 40, 0.96)",
              border: "1px solid rgba(180, 120, 255, 0.3)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(124, 58, 237, 0.2)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-400/15 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">App Store Preview</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c9a227]/20 text-[#f5d76e] border border-[#c9a227]/40 font-medium">
                  iOS 17+
                </span>
              </div>
              <button
                onClick={() => setShowAppStoreModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-purple-200/70 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* App Header Card */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-purple-400/30 flex-shrink-0 bg-cosmic-darkest flex items-center justify-center">
                <CelysLogo size={48} showText={false} />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-base font-bold text-white leading-tight">Celys Care</h3>
                <p className="text-xs text-purple-200/70">Wellness &amp; AI Companion</p>
                <div className="flex items-center gap-1 text-[#f5d76e] text-xs mt-1">
                  <span>4.9</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="#f5d76e" />
                    ))}
                  </div>
                  <span className="text-purple-200/40 text-[10px] ml-1">(2.4k)</span>
                </div>
              </div>
              <button
                onClick={() => setShowAppStoreModal(false)}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-all shadow-md shadow-purple-900/50"
              >
                GET
              </button>
            </div>

            {/* Screenshots Slide Tabs */}
            <div className="text-left mb-2">
              <span className="text-xs font-semibold text-purple-200/80">
                Official Screenshots ({storeSlide + 1}/10)
              </span>
            </div>

            {/* Screenshot Frame */}
            <div
              className="w-full rounded-2xl p-5 mb-4 text-center flex flex-col justify-between relative overflow-hidden"
              style={{
                minHeight: "220px",
                background: "linear-gradient(180deg, #1c0f38 0%, #0d0a1e 100%)",
                border: "1px solid rgba(201, 108, 204, 0.3)",
              }}
            >
              <div className="text-[10px] text-[#f5d76e] font-semibold tracking-wider mb-2">
                {APP_STORE_SCREENSHOTS[storeSlide].badge}
              </div>

              <div className="my-auto">
                <h4 className="text-lg font-serif font-bold text-white mb-1.5">
                  {APP_STORE_SCREENSHOTS[storeSlide].title}
                </h4>
                <p className="text-xs text-purple-200/80 max-w-xs mx-auto leading-relaxed">
                  {APP_STORE_SCREENSHOTS[storeSlide].subtitle}
                </p>
              </div>

              {/* Number Indicators */}
              <div className="flex items-center justify-center gap-1.5 pt-3">
                {APP_STORE_SCREENSHOTS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStoreSlide(idx)}
                    className="rounded-full transition-all"
                    style={{
                      width: idx === storeSlide ? 16 : 5,
                      height: 5,
                      background: idx === storeSlide ? "#f5d76e" : "rgba(255, 255, 255, 0.2)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Quick Feature Tags */}
            <div className="grid grid-cols-2 gap-2 text-left text-[11px] text-purple-200/70 mb-4">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-purple-400/10">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero-Knowledge Privacy</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-purple-400/10">
                <Sparkles size={14} className="text-[#f5d76e]" />
                <span>432Hz Soundscapes</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAppStoreModal(false)}
              className="w-full py-2.5 rounded-full text-xs font-semibold bg-white/10 text-purple-100 hover:bg-white/15 border border-purple-400/20 transition-all"
            >
              Back to App Tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotPreview;


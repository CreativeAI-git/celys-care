"use client";

import React from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAccessibility, CALMING_THEMES, CALMING_SCENES } from "@/context/AccessibilityContext";
import { audioSynth } from "@/lib/audio-synth";

const SCENE_DESCRIPTIONS = [
  "Gentle rolling waves & deep oceanic tides",
  "Sunlit pine canopy & whispering forest breeze",
  "Tranquil cosmic silence & shimmering stars",
  "Blooming lotus blossoms & peaceful stillness",
  "Grounded alpine stillness & crisp mountain air",
];

export const CalmingSpace: React.FC = () => {
  const {
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    reducedMotion,
    setReducedMotion,
    activeColor,
    setActiveColor,
    currentTheme,
    scene,
    setScene,
  } = useAccessibility();

  return (
    <div className="flex flex-col items-center px-4 pt-0 pb-16 text-center w-full max-w-sm mx-auto select-none">
      {/* Centered Golden Logo */}
      <div className="mb-0.5 flex items-center justify-center">
        <CelysLogo size={64} />
      </div>

      {/* Screen Title & Subtitle */}
      <h1
        className="font-serif text-2xl sm:text-3xl font-bold mb-0.5 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
        }}
      >
        Calming Space
      </h1>
      <p className="text-xs text-white/70 mb-1">
        Designed for every mind and body
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center my-0.5">
        <SparkleDivider />
      </div>

      {/* Scene Preview Card — Balanced Horizontal Card with Left Icon Badge */}
      <div
        className="w-full rounded-2xl p-3 mb-2.5 flex items-center gap-3.5 text-left relative overflow-hidden shadow-xl transition-all duration-500"
        style={{
          background: currentTheme.cardBg,
          border: highContrast
            ? `2px solid ${currentTheme.borderStrong}`
            : `1px solid ${currentTheme.cardBorder}`,
          boxShadow: highContrast
            ? `0 8px 30px rgba(0, 0, 0, 0.6), 0 0 24px ${currentTheme.glow}`
            : `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${currentTheme.glow}`,
          minHeight: 80,
        }}
      >
        {/* Left Glowing Scene Icon Orb (Exact match for the highlighted section) */}
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${currentTheme.color}35 0%, rgba(255,255,255,0.04) 100%)`,
            border: `1.5px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 0 16px ${currentTheme.glow}`,
          }}
        >
          {CALMING_SCENES[scene].split(" ")[0]}
        </div>

        {/* Right: Scene Title & Calming Description */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
            {CALMING_SCENES[scene].split(" ").slice(1).join(" ")} — your calming scene
          </p>
          <p
            className="text-[11px] mt-0.5 leading-snug line-clamp-2"
            style={{ color: "rgba(240,232,255,0.72)" }}
          >
            {SCENE_DESCRIPTIONS[scene] || "Your sanctuary pause"}
          </p>
        </div>
      </div>

      {/* Scene Selector Pills */}
      <div className="flex gap-1.5 mb-2.5 flex-wrap justify-center w-full">
        {CALMING_SCENES.map((s, i) => (
          <button
            key={s}
            onClick={() => {
              setScene(i);
              audioSynth?.playPopSound(560);
            }}
            className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
            style={{
              background:
                scene === i
                  ? currentTheme.toggleGradient
                  : "rgba(255,255,255,0.06)",
              border: `1px solid ${
                scene === i
                  ? currentTheme.borderStrong
                  : highContrast
                  ? currentTheme.borderStrong
                  : "rgba(255,255,255,0.12)"
              }`,
              color: scene === i ? "#ffffff" : "rgba(240,232,255,0.85)",
              boxShadow: scene === i ? `0 0 12px ${currentTheme.glow}` : "none",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Accessibility Settings Card */}
      <div
        className="w-full rounded-2xl p-3.5 mb-2.5 text-left transition-all duration-300 shadow-md"
        style={{
          background: currentTheme.cardBg,
          border: highContrast
            ? `2px solid ${currentTheme.borderStrong}`
            : `1px solid ${currentTheme.cardBorder}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.25), 0 0 14px ${currentTheme.glow}`,
        }}
      >
        <p
          className="text-[11px] mb-2 font-semibold tracking-wide transition-colors"
          style={{ color: currentTheme.color }}
        >
          Accessibility Settings
        </p>
        {[
          { label: "High Contrast Mode", val: highContrast, set: setHighContrast },
          { label: "Larger Text", val: largeText, set: setLargeText },
          { label: "Reduce Motion", val: reducedMotion, set: setReducedMotion },
        ].map(({ label, val, set }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2 border-b last:border-0 transition-colors"
            style={{ borderColor: currentTheme.border }}
          >
            <span
              className="text-xs"
              style={{ color: "rgba(240,232,255,0.88)" }}
            >
              {label}
            </span>
            <button
              onClick={() => {
                set(!val);
                audioSynth?.playPopSound(620);
              }}
              className="w-10 h-5 rounded-full transition-all relative cursor-pointer"
              style={{
                background: val
                  ? currentTheme.toggleGradient
                  : "rgba(255,255,255,0.12)",
                boxShadow: val ? `0 0 10px ${currentTheme.glow}` : "none",
              }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm"
                style={{ left: val ? "calc(100% - 17px)" : 3 }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Calming Color Theme Palette — Luxury Clustered Dock */}
      <div className="w-full text-left mt-0.5">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <p
            className="text-[11px] font-semibold tracking-wide"
            style={{ color: "rgba(240,232,255,0.75)" }}
          >
            Calming Color Theme
          </p>
          <span
            className="text-[11px] font-semibold tracking-wide transition-all px-2.5 py-0.5 rounded-full"
            style={{
              color: currentTheme.color,
              background: `${currentTheme.color}20`,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            {currentTheme.name}
          </span>
        </div>

        {/* Centered Cohesive Palette Dock (Not overly spread out) */}
        <div
          className="flex items-center justify-center gap-3.5 py-2.5 px-4 rounded-2xl transition-all duration-300 shadow-lg w-full"
          style={{
            background: currentTheme.cardBg,
            border: highContrast
              ? `2px solid ${currentTheme.borderStrong}`
              : `1px solid ${currentTheme.cardBorder}`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 16px ${currentTheme.glow}`,
          }}
        >
          {CALMING_THEMES.map((theme, i) => {
            const isSelected = activeColor === i;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveColor(i);
                  audioSynth?.playPopSound(500 + i * 80);
                }}
                className="w-8 h-8 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center transform active:scale-90"
                style={{
                  background: theme.color,
                  border: isSelected ? "2.5px solid #ffffff" : "2px solid rgba(255,255,255,0.2)",
                  boxShadow: isSelected
                    ? `0 0 16px ${theme.color}, 0 0 28px ${theme.glow}`
                    : "0 2px 6px rgba(0,0,0,0.35)",
                  transform: isSelected ? "scale(1.18)" : "scale(1)",
                }}
                title={theme.name}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalmingSpace;

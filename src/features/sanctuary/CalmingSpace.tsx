"use client";

import React from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAccessibility, CALMING_COLORS, CALMING_SCENES } from "@/context/AccessibilityContext";

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
    scene,
    setScene,
  } = useAccessibility();

  return (
    <div className="flex flex-col items-center px-4 pt-1 pb-16 text-center w-full max-w-sm mx-auto select-none">
      {/* Centered Golden Logo */}
      <div className="mb-1.5 transition-transform hover:scale-105 duration-300">
        <CelysLogo size={74} />
      </div>

      {/* Screen Title & Subtitle */}
      <h1
        className="font-serif text-3xl font-bold mb-0.5 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
        }}
      >
        Calming Space
      </h1>
      <p className="text-xs text-purple-200/70 mb-1">
        Designed for every mind and body
      </p>

      {/* Sparkle Divider (Exact Figma Match) */}
      <div className="w-full flex items-center justify-center my-1.5">
        <SparkleDivider />
      </div>

      {/* Scene Preview Card */}
      <div
        className="w-full rounded-2xl p-4 mb-3 text-center relative overflow-hidden shadow-xl"
        style={{
          background: highContrast ? "#1a0035" : "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${CALMING_COLORS[activeColor]}40`,
          boxShadow: `0 8px 30px rgba(0, 0, 0, 0.35)`,
          minHeight: 96,
        }}
      >
        <p className="text-3xl">
          {CALMING_SCENES[scene].split(" ")[0]}
        </p>
        <p
          className="text-xs mt-1"
          style={{
            color: "rgba(240,232,255,0.7)",
          }}
        >
          {CALMING_SCENES[scene].split(" ").slice(1).join(" ")} — your calming scene
        </p>
      </div>

      {/* Scene Selector Pills */}
      <div className="flex gap-1.5 mb-3 flex-wrap justify-center w-full">
        {CALMING_SCENES.map((s, i) => (
          <button
            key={s}
            onClick={() => setScene(i)}
            className="px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer"
            style={{
              background:
                scene === i
                  ? `${CALMING_COLORS[activeColor]}33`
                  : "rgba(255,255,255,0.07)",
              border: `1px solid ${
                scene === i ? CALMING_COLORS[activeColor] : "rgba(180,120,255,0.2)"
              }`,
              color: "#f0e8ff",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Accessibility Settings Card */}
      <div
        className="w-full rounded-2xl p-4 mb-3 text-left"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(180,120,255,0.18)",
        }}
      >
        <p
          className="text-[11px] mb-2 font-semibold"
          style={{ color: "#c9a227" }}
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
            className="flex items-center justify-between py-2 border-b last:border-0"
            style={{ borderColor: "rgba(180,120,255,0.12)" }}
          >
            <span
              className="text-xs"
              style={{ color: "rgba(240,232,255,0.85)" }}
            >
              {label}
            </span>
            <button
              onClick={() => set(!val)}
              className="w-10 h-5 rounded-full transition-all relative cursor-pointer"
              style={{
                background: val
                  ? "linear-gradient(135deg, #c96ccc, #7c3aed)"
                  : "rgba(255,255,255,0.12)",
              }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all"
                style={{ left: val ? "calc(100% - 17px)" : 3 }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Calming Color Theme Palette */}
      <div className="w-full text-left">
        <p
          className="text-[11px] mb-1.5"
          style={{ color: "rgba(240,232,255,0.5)" }}
        >
          Calming Color Theme
        </p>
        <div className="flex gap-2.5">
          {CALMING_COLORS.map((c, i) => (
            <button
              key={c}
              onClick={() => setActiveColor(i)}
              className="w-8 h-8 rounded-full transition-all cursor-pointer"
              style={{
                background: c,
                border: `3px solid ${
                  activeColor === i ? "white" : "transparent"
                }`,
                boxShadow:
                  activeColor === i ? `0 0 12px ${c}88` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalmingSpace;

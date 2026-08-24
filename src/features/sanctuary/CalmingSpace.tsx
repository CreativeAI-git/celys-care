"use client";

import React, { useState } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";

const COLORS = ["#c96ccc", "#7ec8a0", "#60a5fa", "#f5d76e", "#f87171"];
const SCENES = [
  "🌊 Ocean",
  "🌿 Forest",
  "🌙 Night Sky",
  "🌸 Garden",
  "🏔️ Mountain",
];

export const CalmingSpace: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [scene, setScene] = useState(0);

  return (
    <div
      className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto"
      style={{ fontSize: largeText ? "1.1rem" : "1rem" }}
    >
      {/* Centered Golden Logo */}
      <div className="mb-2">
        <CelysLogo size={80} />
      </div>

      {/* Screen Title & Subtitle */}
      <h2
        className="font-serif text-2xl sm:text-3xl font-bold mt-1"
        style={{
          background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Calming Space
      </h2>
      <p className="text-xs text-purple-200/60 mb-3 mt-0.5">
        Designed for every mind and body
      </p>

      {/* Scene Preview Card */}
      <div
        className="w-full rounded-3xl p-5 mb-3 text-center relative overflow-hidden"
        style={{
          background: highContrast ? "#1a0035" : "rgba(255,255,255,0.05)",
          border: `2px solid ${COLORS[activeColor]}55`,
          minHeight: 100,
        }}
      >
        <p style={{ fontSize: largeText ? "3rem" : "2.5rem" }}>
          {SCENES[scene].split(" ")[0]}
        </p>
        <p
          className="text-xs mt-1"
          style={{
            color: "rgba(240,232,255,0.7)",
            fontSize: largeText ? "0.95rem" : "0.75rem",
          }}
        >
          {SCENES[scene].split(" ").slice(1).join(" ")} — your calming scene
        </p>
      </div>

      {/* Scene Selector Pills */}
      <div className="flex gap-1.5 mb-3 flex-wrap justify-center w-full">
        {SCENES.map((s, i) => (
          <button
            key={s}
            onClick={() => setScene(i)}
            className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background:
                scene === i
                  ? `${COLORS[activeColor]}33`
                  : "rgba(255,255,255,0.07)",
              border: `1px solid ${
                scene === i ? COLORS[activeColor] : "rgba(180,120,255,0.2)"
              }`,
              color: "#f0e8ff",
              fontSize: largeText ? "0.85rem" : "0.75rem",
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
              className="w-10 h-5 rounded-full transition-all relative"
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
          {COLORS.map((c, i) => (
            <button
              key={c}
              onClick={() => setActiveColor(i)}
              className="w-8 h-8 rounded-full transition-all"
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

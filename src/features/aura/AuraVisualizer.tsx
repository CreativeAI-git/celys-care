"use client";

import React, { useState } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";

const AURA_MOODS = [
  {
    label: "Radiant",
    emoji: "☀️",
    rings: ["#f5d76e", "#fb923c", "#fde68a"],
    meaning: "Your energy is expansive and magnetic. You are in your power.",
  },
  {
    label: "Serene",
    emoji: "🌊",
    rings: ["#60a5fa", "#7ec8a0", "#a5f3fc"],
    meaning: "Deep calm surrounds you. Trust the flow of your inner wisdom.",
  },
  {
    label: "Mystical",
    emoji: "🌙",
    rings: ["#a78bfa", "#c084fc", "#e879f9"],
    meaning: "Your intuition is heightened. Spiritual insights are near.",
  },
  {
    label: "Grounded",
    emoji: "🌿",
    rings: ["#86efac", "#6ee7b7", "#34d399"],
    meaning: "Rooted and steady. Your healing energy nurtures those around you.",
  },
  {
    label: "Passionate",
    emoji: "🔥",
    rings: ["#f87171", "#fb923c", "#fbbf24"],
    meaning: "Fierce and alive. Your drive is unstoppable right now.",
  },
  {
    label: "Ethereal",
    emoji: "🌸",
    rings: ["#f9a8d4", "#c084fc", "#818cf8"],
    meaning: "Soft and luminous. You radiate compassion and gentle strength.",
  },
];

export const AuraVisualizer: React.FC = () => {
  const [chosen, setChosen] = useState<(typeof AURA_MOODS)[0] | null>(AURA_MOODS[0]);

  return (
    <div className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto">
      {/* Centered Golden Logo */}
      <div className="mb-2">
        <CelysLogo size={78} />
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
        Aura Visualizer
      </h2>
      <p className="text-xs text-purple-200/60 mb-2 mt-0.5">
        See your energy field come alive
      </p>

      {/* Concentric Aura Rings Graphic */}
      <div
        className="relative flex items-center justify-center my-3"
        style={{ width: 190, height: 190 }}
      >
        {chosen ? (
          <>
            {[90, 70, 52, 36].map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: r * 2,
                  height: r * 2,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${chosen.rings[i % 3]}${
                    i === 0 ? "22" : i === 1 ? "35" : i === 2 ? "55" : "80"
                  } 0%, transparent 70%)`,
                  boxShadow:
                    i === 3
                      ? `0 0 30px ${chosen.rings[0]}88, 0 0 60px ${chosen.rings[1]}44`
                      : "none",
                  transition: "all 0.6s ease",
                  animation: `pulse ${2 + i * 0.5}s ease-in-out infinite alternate`,
                }}
              />
            ))}
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <span style={{ fontSize: 36 }}>{chosen.emoji}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: chosen.rings[0] }}
              >
                {chosen.label}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 80,
                height: 80,
                border: "2px dashed rgba(180,120,255,0.35)",
              }}
            >
              <span style={{ fontSize: 28 }}>🔮</span>
            </div>
            <span
              className="text-xs"
              style={{ color: "rgba(240,232,255,0.4)" }}
            >
              Select your energy below
            </span>
          </div>
        )}
      </div>

      {/* Energy meaning card */}
      {chosen && (
        <div
          className="w-full rounded-2xl p-3.5 mb-3 text-center transition-all animate-in fade-in"
          style={{
            background: `${chosen.rings[0]}15`,
            border: `1px solid ${chosen.rings[0]}40`,
          }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(240,232,255,0.85)" }}
          >
            {chosen.meaning}
          </p>
        </div>
      )}

      {/* 3x2 Grid of Aura Moods */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {AURA_MOODS.map((m) => (
          <button
            key={m.label}
            onClick={() => setChosen(m)}
            className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all active:scale-95 hover:bg-white/10"
            style={{
              background:
                chosen?.label === m.label
                  ? `${m.rings[0]}22`
                  : "rgba(255,255,255,0.06)",
              border: `1px solid ${
                chosen?.label === m.label
                  ? m.rings[0]
                  : "rgba(180,120,255,0.18)"
              }`,
              boxShadow:
                chosen?.label === m.label ? `0 0 12px ${m.rings[0]}44` : "none",
            }}
          >
            <span style={{ fontSize: 20 }}>{m.emoji}</span>
            <span
              className="text-[11px] font-medium"
              style={{
                color:
                  chosen?.label === m.label
                    ? m.rings[0]
                    : "rgba(240,232,255,0.6)",
              }}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuraVisualizer;

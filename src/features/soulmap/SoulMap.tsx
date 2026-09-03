"use client";

import React, { useState, useEffect } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAuth } from "@/app/providers";
import { useAccessibility } from "@/context/AccessibilityContext";

const BG_STARS = Array.from({ length: 28 }, (_, i) => ({
  cx: ((i * 37 + 11) % 97) + 1.5,
  cy: ((i * 53 + 7) % 93) + 1.5,
  r: ((i * 17) % 10) / 10 + 0.4,
  op: ((i * 13) % 5) / 10 + 0.08,
}));

const SOUL_MOODS = [
  { emoji: "😊", label: "Happy", color: "#f5d76e" },
  { emoji: "😌", label: "Calm", color: "#7ec8a0" },
  { emoji: "💜", label: "Grateful", color: "#c084fc" },
  { emoji: "😰", label: "Anxious", color: "#a78bfa" },
  { emoji: "😢", label: "Sad", color: "#60a5fa" },
  { emoji: "🔥", label: "Motivated", color: "#fb923c" },
];

export const SoulMap: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useAccessibility();
  const [stars, setStars] = useState([
    { x: 62, y: 28, color: "#f5d76e", emoji: "😊", id: 0 },
    { x: 30, y: 55, color: "#7ec8a0", emoji: "😌", id: 1 },
    { x: 75, y: 65, color: "#a78bfa", emoji: "😰", id: 2 },
  ]);
  const [flash, setFlash] = useState("");

  const fetchStars = async () => {
    try {
      const res = await fetch("/api/soul-map");
      if (res.ok) {
        const data = await res.json();
        if (data.stars && data.stars.length > 0) {
          setStars(
            data.stars.map((d: any, i: number) => ({
              x: Number(d.x),
              y: Number(d.y),
              color: d.color || "#f5d76e",
              emoji: d.emoji || "✨",
              id: i,
            }))
          );
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStars();
  }, []);

  const addStar = async (mood: (typeof SOUL_MOODS)[0]) => {
    const newStar = {
      x: Math.round(15 + Math.random() * 70),
      y: Math.round(15 + Math.random() * 70),
      color: mood.color,
      emoji: mood.emoji,
      id: Date.now(),
    };
    setStars((prev) => [...prev, newStar]);
    setFlash(`+1 ${mood.label} star placed`);
    setTimeout(() => setFlash(""), 2000);

    try {
      await fetch("/api/soul-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: newStar.x,
          y: newStar.y,
          color: newStar.color,
          emoji: newStar.emoji,
          mood: mood.label,
        }),
      });
    } catch {
      // ignore
    }
  };

  const last6 = stars.slice(-6);

  return (
    <div className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto">
      {/* Centered Golden Logo */}
      <div className="mb-2 flex items-center justify-center">
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
        Soul Map
      </h2>
      <p
        className="text-xs mt-0.5 transition-colors"
        style={{ color: currentTheme.color, opacity: 0.75 }}
      >
        Your journey, written in stars
      </p>
      <SparkleDivider className="my-2" />

      {/* Star Canvas */}
      <div
        className="relative w-full rounded-2xl overflow-hidden mt-2 mb-2 transition-all duration-300"
        style={{
          height: 210,
          background: `radial-gradient(ellipse at 40% 30%, ${currentTheme.cardBg} 0%, rgba(4,8,12,0.88) 75%)`,
          border: `1.5px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 8px 32px ${currentTheme.glow}, inset 0 0 28px ${currentTheme.border}`,
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
        >
          {BG_STARS.map((s, i) => (
            <circle
              key={i}
              cx={`${s.cx}%`}
              cy={`${s.cy}%`}
              r={s.r}
              fill="white"
              opacity={s.op}
            />
          ))}
          {last6.map((s, i) =>
            i === 0 ? null : (
              <line
                key={`l${s.id}`}
                x1={`${last6[i - 1].x}%`}
                y1={`${last6[i - 1].y}%`}
                x2={`${s.x}%`}
                y2={`${s.y}%`}
                stroke={currentTheme.color}
                strokeWidth="1"
                strokeDasharray="3,5"
                opacity="0.5"
              />
            )
          )}
          {stars.map((s) => (
            <g key={s.id}>
              <circle
                cx={`${s.x}%`}
                cy={`${s.y}%`}
                r="9"
                fill={s.color}
                opacity={0.18}
              />
              <circle
                cx={`${s.x}%`}
                cy={`${s.y}%`}
                r="4"
                fill={s.color}
                opacity={0.9}
              />
              <circle
                cx={`${s.x}%`}
                cy={`${s.y}%`}
                r="1.8"
                fill="white"
                opacity={0.95}
              />
            </g>
          ))}
        </svg>
        <div
          className="absolute bottom-2 left-3 text-[11px] font-medium"
          style={{ color: currentTheme.color, opacity: 0.85 }}
        >
          {stars.length} stars · your constellation
        </div>
      </div>

      {flash ? (
        <p className="text-xs mt-1 text-center font-medium" style={{ color: "#f5d76e" }}>
          {flash}
        </p>
      ) : (
        <p
          className="text-xs mt-1 text-center transition-colors"
          style={{ color: currentTheme.color, opacity: 0.7 }}
        >
          Tap a feeling to plant a star in your personal sky
        </p>
      )}

      {/* 3x2 Grid of Soul Moods */}
      <div className="grid grid-cols-3 gap-2 w-full mt-3">
        {SOUL_MOODS.map((m) => (
          <button
            key={m.emoji}
            onClick={() => addStar(m)}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all active:scale-95 hover:bg-white/10"
            style={{
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 2px 10px ${currentTheme.glow}`,
            }}
          >
            <span style={{ fontSize: 22 }}>{m.emoji}</span>
            <span className="text-xs font-medium" style={{ color: m.color }}>
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoulMap;

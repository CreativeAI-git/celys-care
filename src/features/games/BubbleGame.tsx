"use client";

import React, { useState, useEffect, useRef } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAccessibility } from "@/context/AccessibilityContext";

const BUBBLE_COLORS = ["#c96ccc", "#7c3aed", "#60a5fa", "#a78bfa", "#f5d76e", "#7ec8a0"];

export const BubbleGame: React.FC = () => {
  const { currentTheme } = useAccessibility();
  const [gamePhase, setGamePhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [count, setCount] = useState(0);
  const [pops, setPops] = useState(0);
  const [bubbles, setBubbles] = useState<
    { id: number; x: number; color: string; size: number; popped: boolean }[]
  >([]);
  const nextId = useRef(0);

  const bubblePalette = [
    currentTheme.color,
    "#f5d76e", // Radiant Gold
    "#60a5fa", // Celestial Azure
    "#ffffff", // Shimmering White
    `${currentTheme.color}cc`,
    "#fcd34d", // Warm Amber
  ];

  useEffect(() => {
    if (gamePhase === "idle") return;
    const durations: Record<string, number> = { inhale: 4, hold: 2, exhale: 5 };
    const dur = durations[gamePhase] ?? 4;
    setCount(dur);
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          setGamePhase((p) =>
            p === "inhale" ? "hold" : p === "hold" ? "exhale" : "inhale"
          );
          if (gamePhase === "exhale") {
            setBubbles((bs) => bs.map((b) => ({ ...b, popped: false })));
          }
          if (gamePhase === "inhale") {
            const newBubbles = Array.from({ length: 6 }, () => ({
              id: nextId.current++,
              x: 10 + Math.random() * 80,
              color: bubblePalette[Math.floor(Math.random() * bubblePalette.length)],
              size: 24 + Math.random() * 20,
              popped: false,
            }));
            setBubbles(newBubbles);
          }
          return durations[
            gamePhase === "inhale" ? "hold" : gamePhase === "hold" ? "exhale" : "inhale"
          ] ?? 4;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [gamePhase, currentTheme.color]);

  const popBubble = (id: number) => {
    if (gamePhase !== "exhale") return;
    setBubbles((bs) =>
      bs.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setPops((p) => p + 1);
  };

  const phaseText: Record<string, string> = {
    idle: "Tap Begin to start",
    inhale: "Breathe In…",
    hold: "Hold…",
    exhale: "Exhale & Pop the bubbles!",
  };
  const phaseColor: Record<string, string> = {
    idle: currentTheme.color,
    inhale: currentTheme.color,
    hold: "#f5d76e",
    exhale: currentTheme.color,
  };

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
        Bubble Breathing
      </h2>
      <p
        className="text-xs mt-0.5 transition-colors"
        style={{ color: currentTheme.color, opacity: 0.75 }}
      >
        Inhale… then exhale to pop the bubbles
      </p>
      <SparkleDivider className="my-2 mb-3.5" />

      {/* Bubble Tank Viewport */}
      <div
        className="relative w-full rounded-3xl overflow-hidden mb-4 transition-all duration-300"
        style={{
          height: 220,
          background: `radial-gradient(ellipse at 50% 100%, ${currentTheme.cardBg} 0%, rgba(4,8,12,0.88) 100%)`,
          border: `1.5px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 8px 32px ${currentTheme.glow}, inset 0 0 28px ${currentTheme.border}`,
        }}
      >
        {bubbles
          .filter((b) => !b.popped)
          .map((b) => (
            <button
              key={b.id}
              onClick={() => popBubble(b.id)}
              className="absolute rounded-full transition-all cursor-pointer"
              style={{
                left: `${b.x}%`,
                bottom: gamePhase === "exhale" ? "10%" : "-10%",
                width: b.size,
                height: b.size,
                background: `radial-gradient(circle at 35% 35%, white, ${b.color}99)`,
                border: `1.5px solid ${b.color}`,
                opacity: 0.85,
                transition: "bottom 1.5s ease",
                transform: "translateX(-50%)",
                boxShadow: `0 0 10px ${b.color}55`,
              }}
            />
          ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {gamePhase !== "idle" && (
            <p
              className="text-4xl font-bold transition-colors"
              style={{
                color: phaseColor[gamePhase],
                fontFamily: "'Cormorant Garamond', serif",
                textShadow: `0 0 20px ${currentTheme.glow}`,
              }}
            >
              {count}
            </p>
          )}
          <p
            className="text-xs font-semibold mt-1 px-4 text-center transition-colors"
            style={{
              color: phaseColor[gamePhase],
              textShadow: `0 0 12px ${currentTheme.glow}`,
            }}
          >
            {phaseText[gamePhase]}
          </p>
        </div>
      </div>

      {/* Stats and Reset */}
      <div className="flex items-center justify-between w-full mb-4 px-1">
        <span className="text-xs" style={{ color: currentTheme.color, opacity: 0.85 }}>
          Bubbles popped: <strong style={{ color: "#f5d76e" }}>{pops}</strong>
        </span>
        <button
          onClick={() => {
            setBubbles([]);
            setPops(0);
          }}
          className="text-[11px] px-3.5 py-1 rounded-full transition-all hover:bg-white/10 active:scale-95 cursor-pointer font-medium"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.borderStrong}`,
            color: currentTheme.color,
            boxShadow: `0 2px 10px ${currentTheme.glow}`,
          }}
        >
          Reset
        </button>
      </div>

      {/* Main Action Button */}
      <button
        onClick={() => setGamePhase((p) => (p === "idle" ? "inhale" : "idle"))}
        className="w-full rounded-full py-3.5 font-semibold text-white text-xs transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer"
        style={{
          background: currentTheme.navActiveGradient,
          boxShadow: `0 4px 16px ${currentTheme.glow}`,
        }}
      >
        {gamePhase === "idle" ? "▶ Begin Game" : "⏹ Stop"}
      </button>
    </div>
  );
};

export default BubbleGame;

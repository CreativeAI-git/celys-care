"use client";

import React, { useState, useEffect } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const PHASE_CONFIG: Record<
  Phase,
  { dur: number; next: Phase; text: string; sub: string; scale: number; color: string }
> = {
  inhale: { dur: 4, next: "hold", text: "Breathe In", sub: "Slowly through your nose", scale: 1.45, color: "#7c3aed" },
  hold: { dur: 4, next: "exhale", text: "Hold", sub: "Gently hold your breath", scale: 1.45, color: "#c9a227" },
  exhale: { dur: 6, next: "rest", text: "Breathe Out", sub: "Slowly through your mouth", scale: 1, color: "#c96ccc" },
  rest: { dur: 2, next: "inhale", text: "Rest", sub: "Prepare for next breath", scale: 1, color: "#60a5fa" },
};

export const BreathingScreen: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (count <= 0) {
      const cfg = PHASE_CONFIG[phase];
      if (phase === "rest") setCycles((c) => c + 1);
      setPhase(cfg.next);
      setCount(PHASE_CONFIG[cfg.next].dur);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [running, count, phase]);

  const cfg = PHASE_CONFIG[phase];

  return (
    <div className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto">
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
        Breathing Exercise
      </h2>
      <p className="text-xs text-purple-200/60 mb-2 mt-0.5">
        Box breathing for calm and focus
      </p>

      {/* Concentric Breathing Circle Graphic */}
      <div
        className="relative flex items-center justify-center my-4"
        style={{ width: 190, height: 190 }}
      >
        {/* Outer subtle ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: 190,
            height: 190,
            border: "1px solid rgba(180,120,255,0.2)",
          }}
        />

        {/* Animated breathing glow sphere */}
        <div
          className="rounded-full flex items-center justify-center transition-all"
          style={{
            width: 110,
            height: 110,
            transform: `scale(${running ? cfg.scale : 1})`,
            transitionDuration: `${cfg.dur * 0.9}s`,
            transitionTimingFunction: "ease-in-out",
            background: `radial-gradient(circle, ${cfg.color}55 0%, ${cfg.color}22 60%, transparent 100%)`,
            border: `2px solid ${cfg.color}88`,
            boxShadow: `0 0 30px ${cfg.color}44`,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{
              color: cfg.color,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {running ? count : "•"}
          </p>
        </div>

        {running && (
          <p
            className="absolute bottom-2 text-[10px]"
            style={{ color: "rgba(240,232,255,0.4)" }}
          >
            Cycles: {cycles}
          </p>
        )}
      </div>

      <p
        className="text-lg font-semibold mb-0.5"
        style={{
          color: cfg.color,
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {running ? cfg.text : "Ready to breathe?"}
      </p>
      <p className="text-xs mb-5 text-purple-200/50">
        {running ? cfg.sub : "Box breathing helps calm your nervous system"}
      </p>

      {/* Action Controls */}
      <div className="w-full flex gap-2.5 mb-4">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              setPhase("inhale");
              setCount(4);
            }
          }}
          className="flex-1 py-3 rounded-full font-semibold text-white text-xs transition-all hover:opacity-95 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #c96ccc, #7c3aed)",
            boxShadow: "0 4px 16px rgba(201,108,204,0.35)",
          }}
        >
          {running ? "⏸ Pause" : "▶ Begin"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setPhase("inhale");
            setCount(4);
            setCycles(0);
          }}
          className="py-3 px-5 rounded-full text-xs font-medium transition-all hover:bg-white/10"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(180,120,255,0.22)",
            color: "rgba(240,232,255,0.6)",
          }}
        >
          Reset
        </button>
      </div>

      {/* Phase status boxes */}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {(["inhale", "hold", "exhale", "rest"] as Phase[]).map((p) => (
          <div
            key={p}
            className="flex flex-col items-center gap-0.5 py-2 rounded-xl"
            style={{
              background:
                phase === p && running
                  ? `${PHASE_CONFIG[p].color}22`
                  : "rgba(255,255,255,0.04)",
              border: `1px solid ${
                phase === p && running
                  ? PHASE_CONFIG[p].color + "55"
                  : "rgba(180,120,255,0.1)"
              }`,
            }}
          >
            <span
              className="text-[10px] font-medium capitalize"
              style={{ color: PHASE_CONFIG[p].color }}
            >
              {p}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "rgba(240,232,255,0.4)" }}
            >
              {PHASE_CONFIG[p].dur}s
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreathingScreen;

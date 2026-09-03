"use client";

import React, { useState, useEffect, useRef } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAccessibility } from "@/context/AccessibilityContext";

const N_PARTICLES = 22;
type Particle = { id: number; x: number; y: number; vx: number; vy: number; color: string; size: number };
const ANXIETY_COLORS = ["#a78bfa", "#c084fc", "#f87171", "#fb923c", "#fbbf24"];
const CALM_COLORS = ["#7ec8a0", "#60a5fa", "#6ee7b7", "#a5f3fc", "#c084fc"];

export const EnergyRelease: React.FC = () => {
  const { currentTheme, reducedMotion } = useAccessibility();
  const [phase, setPhase] = useState<"idle" | "shaking" | "releasing" | "calm">("idle");
  const [particles, setParticles] = useState<Particle[]>([]);
  const shakeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startShake = () => {
    setPhase("shaking");
    const pts: Particle[] = Array.from({ length: N_PARTICLES }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      color: ANXIETY_COLORS[i % ANXIETY_COLORS.length],
      size: Math.random() * 8 + 4,
    }));
    setParticles(pts);
    let tick = 0;
    shakeRef.current = setInterval(() => {
      tick++;
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: Math.max(5, Math.min(95, p.x + p.vx)),
          y: Math.max(5, Math.min(95, p.y + p.vy)),
          vx: p.vx * (Math.random() > 0.9 ? -1 : 1),
          vy: p.vy * (Math.random() > 0.9 ? -1 : 1),
        }))
      );
      if (tick >= 40) {
        if (shakeRef.current) clearInterval(shakeRef.current);
        setPhase("releasing");
        setParticles((prev) =>
          prev.map((p, i) => ({
            ...p,
            x: 50 + Math.cos((i / N_PARTICLES) * Math.PI * 2) * 48,
            y: 50 + Math.sin((i / N_PARTICLES) * Math.PI * 2) * 45,
            color: CALM_COLORS[i % CALM_COLORS.length],
          }))
        );
        setTimeout(() => setPhase("calm"), 1200);
      }
    }, 60);
  };

  useEffect(() => {
    return () => {
      if (shakeRef.current) clearInterval(shakeRef.current);
    };
  }, []);

  const labels: Record<string, string> = {
    idle: "Tap below to shake out anxious energy",
    shaking: "Keep going — shake it all out!",
    releasing: "Releasing…",
    calm: "Energy released. You feel lighter. ✨",
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
        Energy Release
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Shake out what no longer serves you
      </p>
      <SparkleDivider className="my-2" />

      {/* Interactive Somatic Particle Silhouette Canvas */}
      <div
        className="relative w-full rounded-2xl overflow-hidden mt-3"
        style={{
          height: 220,
          background:
            "radial-gradient(ellipse at 50% 50%, #1a0838 0%, #08060f 80%)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
        >
          <ellipse
            cx="50%"
            cy="28%"
            rx="12%"
            ry="10%"
            fill="rgba(240,232,255,0.07)"
          />
          <rect
            x="40%"
            y="36%"
            width="20%"
            height="30%"
            rx="6%"
            fill="rgba(240,232,255,0.07)"
          />
          {particles.map((p) => (
            <circle
              key={p.id}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size / 2}
              fill={p.color}
              opacity={phase === "releasing" || phase === "calm" ? 0.55 : 0.78}
              style={{
                transition:
                  phase === "releasing" ? "all 1.2s ease-out" : "none",
              }}
            />
          ))}
          {phase === "calm" && (
            <circle
              cx="50%"
              cy="50%"
              r="30%"
              fill="rgba(126,200,160,0.08)"
            />
          )}
        </svg>
      </div>

      <p
        className="text-xs mt-3 text-center"
        style={{
          color: phase === "calm" ? "#7ec8a0" : "rgba(240,232,255,0.5)",
        }}
      >
        {labels[phase]}
      </p>

      {(phase === "idle" || phase === "calm") && (
        <button
          onClick={() => {
            setPhase("idle");
            setParticles([]);
            setTimeout(startShake, 50);
          }}
          className="mt-4 w-full rounded-full py-3.5 font-semibold text-white text-xs transition-all active:scale-[0.98] cursor-pointer"
          style={{
            background:
              phase === "calm"
                ? "linear-gradient(135deg, #7ec8a0, #60a5fa)"
                : currentTheme.navActiveGradient,
            boxShadow: `0 4px 20px ${currentTheme.glow}`,
          }}
        >
          {phase === "calm" ? "Shake Again 🌿" : "⚡ Shake Out Anxiety"}
        </button>
      )}
    </div>
  );
};

export default EnergyRelease;

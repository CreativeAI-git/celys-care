"use client";

import React, { useState, useEffect } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAccessibility } from "@/context/AccessibilityContext";

export const QuietRoom: React.FC = () => {
  const { currentTheme, reducedMotion } = useAccessibility();
  const [active, setActive] = useState(false);
  const [secs, setSecs] = useState(60);
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");

  useEffect(() => {
    if (phase !== "active") return;
    if (secs <= 0) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secs]);

  const start = () => {
    setSecs(60);
    setPhase("active");
    setActive(true);
  };

  const stop = () => {
    setPhase("idle");
    setActive(false);
    setSecs(60);
  };

  if (active && phase === "active") {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
        style={{ background: "#020108" }}
      >
        <div
          className="rounded-full"
          style={{
            width: 18,
            height: 18,
            background: "white",
            boxShadow: "0 0 40px 12px rgba(255,255,255,0.18)",
            animation: reducedMotion ? "none" : "pulse 4s ease-in-out infinite",
          }}
        />
        <p
          className="mt-10 text-xs"
          style={{
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.25em",
          }}
        >
          breathe · {secs}s
        </p>
        <button
          onClick={stop}
          className="mt-16 text-xs transition-colors hover:text-white/40"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          leave
        </button>
      </div>
    );
  }

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
        The Quiet Room
      </h2>
      <p
        className="text-xs mt-0.5 transition-colors"
        style={{ color: currentTheme.color, opacity: 0.75 }}
      >
        A place with no noise, just you
      </p>
      <SparkleDivider className="my-2" />

      {/* Description Card */}
      <div
        className="w-full rounded-2xl p-4 mt-3 flex flex-col items-center gap-3 text-left transition-all duration-300"
        style={{
          background: currentTheme.cardBg,
          border: `1.5px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 8px 32px ${currentTheme.glow}`,
        }}
      >
        <p
          className="text-xs leading-relaxed text-center"
          style={{ color: "rgba(240,232,255,0.85)" }}
        >
          When the world is too loud — come here. No text. No prompts. No color.
          Just one breathing dot and one minute of silence.
        </p>
        <div className="flex flex-col gap-1.5 w-full mt-1">
          {[
            "Sensory overload",
            "Panic or anxiety spike",
            "Autism / ADHD overwhelm",
            "Before sleep",
            "After conflict",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: currentTheme.color, boxShadow: `0 0 6px ${currentTheme.glow}` }}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(240,232,255,0.65)" }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>

      {phase === "done" && (
        <div
          className="w-full rounded-2xl p-3.5 mt-3 text-center transition-all duration-300"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 4px 16px ${currentTheme.glow}`,
          }}
        >
          <p className="text-xs font-semibold" style={{ color: currentTheme.color }}>
            You made it through. Well done. 🌿
          </p>
        </div>
      )}

      {/* Enter Action Button */}
      <button
        onClick={start}
        className="mt-4 w-full rounded-full py-3.5 font-semibold text-white text-xs transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer"
        style={{
          background: currentTheme.navActiveGradient,
          border: `1px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 0 20px ${currentTheme.glow}`,
        }}
      >
        Enter the Quiet Room
      </button>
    </div>
  );
};

export default QuietRoom;

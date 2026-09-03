"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAuth } from "@/app/providers";
import { useAccessibility } from "@/context/AccessibilityContext";
import { offlineSync } from "@/lib/offline-sync";
import { toast } from "sonner";
import { triggerConfetti as confetti } from "@/lib/confetti";

const MOODS = [
  { emoji: "😊", label: "Happy", color: "#f5d76e", msg: "Your joy is contagious. Celebrate this moment!" },
  { emoji: "😌", label: "Calm", color: "#7ec8a0", msg: "Peace is your power. Stay grounded." },
  { emoji: "😰", label: "Anxious", color: "#a78bfa", msg: "You are safe. Breathe. This feeling will pass." },
  { emoji: "😢", label: "Sad", color: "#60a5fa", msg: "It's okay to feel sad. You are not alone, beautiful soul." },
  { emoji: "😵", label: "Overwhelmed", color: "#f87171", msg: "One breath at a time. You have survived 100% of your hard days." },
  { emoji: "⭐", label: "Confident", color: "#fbbf24", msg: "You are unstoppable. Own your power today." },
];

const getPersonalizedMoodMessage = (msg: string, user: any) => {
  const userName =
    user?.displayName && user.displayName.trim() && user.displayName.toLowerCase() !== "beautiful soul"
      ? user.displayName.trim()
      : user?.email
        ? user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1)
        : "";

  if (userName) {
    return msg.replace(/beautiful soul/gi, userName);
  }
  return msg;
};

export const MoodCheckIn: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useAccessibility();
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<{ label: string; color: string; emoji: string; created_at: string }[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/moods");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.moods || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, saved]);

  const saveMood = async (i: number) => {
    setSelected(i);
    const m = MOODS[i];
    const personalizedMsg = getPersonalizedMoodMessage(m.msg, user);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.65 },
      colors: [m.color, "#f5d76e", "#ffffff"],
    });

    const payload = {
      mood: m.label,
      label: m.label,
      color: m.color,
      intensity: 5,
      note: personalizedMsg,
    };

    try {
      if (navigator.onLine) {
        await fetch("/api/moods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        offlineSync.queueMutation("mood", "CREATE", payload);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      fetchHistory();
    } catch {
      offlineSync.queueMutation("mood", "CREATE", payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
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
        Mood Check-In
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        How are you feeling right now?
      </p>
      <SparkleDivider className="my-2 mb-4" />

      {/* 3x2 Grid of Moods (Figma Exact Match) */}
      <div className="grid grid-cols-3 gap-3 w-full mb-4">
        {MOODS.map((m, i) => (
          <button
            key={m.label}
            onClick={() => saveMood(i)}
            className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl transition-all active:scale-95"
            style={{
              background:
                selected === i
                  ? `${m.color}22`
                  : "rgba(255,255,255,0.06)",
              border: `1px solid ${
                selected === i ? m.color : currentTheme.border
              }`,
              boxShadow:
                selected === i ? `0 0 14px ${m.color}44` : "none",
            }}
          >
            <span style={{ fontSize: 28 }}>{m.emoji}</span>
            <span
              className="text-xs font-medium"
              style={{
                color:
                  selected === i ? m.color : "rgba(240,232,255,0.7)",
              }}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Uplifting message feedback card */}
      {selected !== null && (
        <div
          className="w-full rounded-2xl p-4 text-center mb-3 transition-all animate-in fade-in"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.cardBorder}`,
            boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${currentTheme.glow}`,
          }}
        >
          <Heart
            size={16}
            className="mx-auto mb-2"
            style={{ color: currentTheme.color }}
          />
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: "#f0e8ff" }}
          >
            {getPersonalizedMoodMessage(MOODS[selected].msg, user)}
          </p>
          {saved && (
            <p className="text-[11px] mt-2 font-medium" style={{ color: "#7ec8a0" }}>
              ✓ Mood saved to your history
            </p>
          )}
          {!user && (
            <p className="text-[10px] mt-1.5 text-purple-200/35">
              Log in to save your mood history
            </p>
          )}
        </div>
      )}

      {/* Recent Moods Card */}
      {history.length > 0 && (
        <div
          className="w-full rounded-2xl p-3.5 text-left transition-all duration-300"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.cardBorder}`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.25)`,
          }}
        >
          <p
            className="text-[11px] mb-2 font-semibold tracking-wide transition-colors"
            style={{ color: currentTheme.color }}
          >
            Recent Moods ✦
          </p>
          <div className="flex gap-2 flex-wrap">
            {history.slice(0, 5).map((h, i) => {
              const matched = MOODS.find((m) => m.label === h.label) || MOODS[0];
              return (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: `${matched.color}22`,
                    border: `1px solid ${matched.color}55`,
                    color: matched.color,
                  }}
                >
                  {matched.emoji} {matched.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCheckIn;

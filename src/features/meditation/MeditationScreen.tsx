"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAuth } from "@/app/providers";
import { useAccessibility } from "@/context/AccessibilityContext";

const MED_SESSIONS = [
  { title: "Morning Calm", duration: "5 min", emoji: "🌅", desc: "Start your day with gentle awareness" },
  { title: "Anxiety Relief", duration: "8 min", emoji: "🌸", desc: "Ground yourself when worry rises" },
  { title: "Self-Compassion", duration: "10 min", emoji: "💜", desc: "Cultivate kindness toward yourself" },
  { title: "Sleep Preparation", duration: "12 min", emoji: "🌙", desc: "Ease your mind into restful sleep" },
  { title: "Body Scan", duration: "15 min", emoji: "🍃", desc: "Release tension held in the body" },
];

export const MeditationScreen: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useAccessibility();
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/meditations");
      if (res.ok) {
        const data = await res.json();
        setSessionCount(data.totalCompleted || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const startSession = (i: number) => {
    setActive(i);
    setPlaying(true);
    setSeconds(0);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const finishSession = async () => {
    if (active !== null && seconds > 5) {
      try {
        await fetch("/api/meditations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trackId: "track_" + active,
            duration: seconds,
          }),
        });
        setSessionCount((c) => c + 1);
      } catch {
        setSessionCount((c) => c + 1);
      }
    }
    setActive(null);
    setPlaying(false);
    setSeconds(0);
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
        Meditation
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Quiet the mind. Open the heart.
      </p>
      <SparkleDivider className="my-2 mb-3.5" />

      {sessionCount > 0 && (
        <div
          className="flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(180,120,255,0.25)",
          }}
        >
          <span style={{ fontSize: 13 }}>🧘</span>
          <span className="text-[11px]" style={{ color: "rgba(240,232,255,0.7)" }}>
            {sessionCount} session{sessionCount !== 1 ? "s" : ""} completed
          </span>
        </div>
      )}

      {/* Active Timer Card */}
      {active !== null && (
        <div
          className="w-full rounded-3xl p-6 text-center mb-4 transition-all duration-500 shadow-2xl"
          style={{
            background: currentTheme.cardBg,
            border: `1.5px solid ${currentTheme.cardBorder}`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.45), 0 0 24px ${currentTheme.glow}`,
          }}
        >
          <p className="text-2xl mb-1">{MED_SESSIONS[active].emoji}</p>
          <p className="text-sm font-semibold mb-1" style={{ color: "#f0e8ff" }}>
            {MED_SESSIONS[active].title}
          </p>
          <p
            className="text-3xl font-bold mb-3 tracking-wider"
            style={{
              color: currentTheme.color,
              fontFamily: "'Cormorant Garamond', serif",
              textShadow: `0 0 16px ${currentTheme.glow}`,
            }}
          >
            {fmt(seconds)}
          </p>
          <div className="flex gap-3 justify-center items-center">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              style={{
                background: currentTheme.navActiveGradient,
                boxShadow: `0 0 16px ${currentTheme.glow}`,
              }}
            >
              {playing ? <Pause size={18} color="white" /> : <Play size={18} color="white" />}
            </button>
            <button
              onClick={finishSession}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/10 cursor-pointer"
              style={{
                background: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
              }}
            >
              <RefreshCw size={15} style={{ color: currentTheme.color }} />
            </button>
          </div>
          <p className="text-[10px] mt-2 text-purple-200/35">
            Session saves when you stop ✦
          </p>
        </div>
      )}

      {/* Sessions List */}
      <div className="flex flex-col gap-2.5 w-full">
        {MED_SESSIONS.map((s, i) => (
          <button
            key={s.title}
            onClick={() => startSession(i)}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.99]"
            style={{
              background:
                active === i
                  ? currentTheme.navActiveGradient
                  : currentTheme.cardBg,
              border: `1px solid ${
                active === i
                  ? currentTheme.borderStrong
                  : currentTheme.cardBorder
              }`,
              boxShadow: active === i ? `0 0 16px ${currentTheme.glow}` : "none",
            }}
          >
            <span style={{ fontSize: 22 }}>{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: "#f0e8ff" }}>
                {s.title}
              </p>
              <p className="text-[11px] truncate text-purple-200/50">
                {s.desc}
              </p>
            </div>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "rgba(124,58,237,0.3)",
                color: "#c96ccc",
              }}
            >
              {s.duration}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MeditationScreen;

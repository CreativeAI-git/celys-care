"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAuth } from "@/app/providers";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const AFFIRMATIONS = [
  "I am safe. I am strong. I am doing my best, and that is enough.",
  "I deserve love, peace, and all the good things life has to offer.",
  "My feelings are valid. My struggles are temporary. My strength is permanent.",
  "I am worthy exactly as I am right now, in this moment.",
  "I choose peace. I choose healing. I choose myself.",
  "Every breath I take is a new beginning.",
  "I am not my anxiety. I am not my bad days. I am resilient.",
  "I release what I cannot control and trust the process of life.",
];

const AFFIRMATION_MOODS = [
  "All",
  "Anxious",
  "Sad",
  "Low Confidence",
  "Overwhelmed",
];

export const AffirmationsScreen: React.FC = () => {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [mood, setMood] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const fetchLiked = async () => {
    try {
      const res = await fetch("/api/affirmations");
      if (res.ok) {
        const data = await res.json();
        if (data.liked) {
          setLiked(data.liked);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchLiked();
  }, [user]);

  const next = () => setIdx((i) => (i + 1) % AFFIRMATIONS.length);
  const prev = () =>
    setIdx((i) => (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length);

  const toggleLike = async () => {
    const isLiked = liked.includes(idx);
    const updated = isLiked ? liked.filter((x) => x !== idx) : [...liked, idx];
    setLiked(updated);

    if (!isLiked) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#c96ccc", "#f5d76e"],
      });
      toast.success("Affirmation saved to favorites ♡");
    }

    try {
      await fetch("/api/affirmations/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affirmationIndex: idx,
          affirmationText: AFFIRMATIONS[idx],
          category: AFFIRMATION_MOODS[mood],
        }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto">
      {/* Centered Golden Logo */}
      <div className="mb-2">
        <CelysLogo size={90} />
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
        Affirmations
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Words that lift, heal, and empower you
      </p>
      <SparkleDivider className="my-2 mb-3.5" />

      {/* Category Pills */}
      <div className="flex gap-1.5 mb-4 flex-wrap justify-center w-full">
        {AFFIRMATION_MOODS.map((m, i) => (
          <button
            key={m}
            onClick={() => {
              setMood(i);
              setShowSaved(false);
            }}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background:
                mood === i && !showSaved
                  ? "linear-gradient(135deg, #c96ccc, #7c3aed)"
                  : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(180,120,255,0.22)",
              color: mood === i && !showSaved ? "#fff" : "rgba(240,232,255,0.6)",
            }}
          >
            {m}
          </button>
        ))}
        {liked.length > 0 && (
          <button
            onClick={() => setShowSaved((s) => !s)}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: showSaved
                ? "linear-gradient(135deg, #f87171, #c96ccc)"
                : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(201,108,204,0.3)",
              color: showSaved ? "#fff" : "#c96ccc",
            }}
          >
            ♥ Saved ({liked.length})
          </button>
        )}
      </div>

      {showSaved && liked.length > 0 ? (
        <div className="flex flex-col gap-2 w-full mb-4">
          {liked.map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 text-left"
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(201,108,204,0.25)",
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "#f0e8ff",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                &ldquo;{AFFIRMATIONS[i]}&rdquo;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full relative">
          <div
            className="rounded-3xl p-6 text-center relative overflow-hidden flex flex-col items-center justify-between"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(201,108,204,0.15))",
              border: "1px solid rgba(201,162,39,0.3)",
              minHeight: 180,
            }}
          >
            <div
              className="absolute -top-6 -right-6 rounded-full"
              style={{
                width: 100,
                height: 100,
                background:
                  "radial-gradient(circle, rgba(201,108,204,0.25) 0%, transparent 70%)",
              }}
            />
            <Sparkles
              size={18}
              className="mx-auto mb-3"
              style={{ color: "#f5d76e" }}
            />
            <p
              className="text-lg leading-relaxed font-medium px-2"
              style={{
                color: "#f0e8ff",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem",
              }}
            >
              &ldquo;{AFFIRMATIONS[idx]}&rdquo;
            </p>
            <button
              onClick={toggleLike}
              className="mt-4 transition-transform active:scale-125"
            >
              <Heart
                size={20}
                fill={liked.includes(idx) ? "#c96ccc" : "none"}
                style={{ color: "#c96ccc" }}
              />
            </button>
            {!user && (
              <p
                className="text-[10px] mt-1"
                style={{ color: "rgba(240,232,255,0.3)" }}
              >
                Log in to save favourites
              </p>
            )}
          </div>

          {/* Prev/Next Controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(180,120,255,0.2)",
              }}
            >
              <ChevronLeft size={18} style={{ color: "#c96ccc" }} />
            </button>
            <span
              className="text-xs font-medium"
              style={{ color: "rgba(240,232,255,0.4)" }}
            >
              {idx + 1} / {AFFIRMATIONS.length}
            </span>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(180,120,255,0.2)",
              }}
            >
              <ChevronRight size={18} style={{ color: "#c96ccc" }} />
            </button>
          </div>
        </div>
      )}

      {/* New Affirmation Button */}
      <div className="mt-4 w-full">
        <button
          onClick={next}
          className="w-full rounded-full py-3 font-semibold text-white text-xs transition-all hover:opacity-95 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #c96ccc, #7c3aed)",
            boxShadow: "0 4px 16px rgba(201,108,204,0.3)",
          }}
        >
          ✦ New Affirmation
        </button>
      </div>
    </div>
  );
};

export default AffirmationsScreen;

"use client";

import React, { useState, useEffect } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { audioSynth } from "@/lib/audio-synth";

const ORACLE_CARDS = [
  {
    title: "The Still Lake",
    symbol: "🌊",
    wisdom:
      "Stillness is not emptiness. It is where your deepest answers live. Be patient with your own becoming.",
  },
  {
    title: "The Golden Lion",
    symbol: "🦁",
    wisdom:
      "Courage does not mean the absence of fear. It means you chose yourself anyway. You are braver than you know.",
  },
  {
    title: "The North Star",
    symbol: "⭐",
    wisdom:
      "You are someone else's reason to keep going. Your light, even dimmed, guides others through their dark.",
  },
  {
    title: "The Sacred Seed",
    symbol: "🌱",
    wisdom:
      "What looks like nothing is everything becoming. Your healing is happening even when you cannot see it.",
  },
  {
    title: "The Phoenix Fire",
    symbol: "🔥",
    wisdom:
      "You have burned before and risen. This time is no different. What is ending is making room for what is meant.",
  },
  {
    title: "The Crescent Moon",
    symbol: "🌙",
    wisdom:
      "Rest is not retreat. Even the moon phases into darkness before she rises full. Honor your cycles.",
  },
  {
    title: "The Open Door",
    symbol: "🚪",
    wisdom:
      "The version of you that you long to be is already on the other side of the fear. Take one step today.",
  },
  {
    title: "The Weaver",
    symbol: "🕸️",
    wisdom:
      "Every thread of pain you have survived is now part of the tapestry of your strength. You are a masterpiece.",
  },
];

export const InnerOracle: React.FC = () => {
  const [card, setCard] = useState<(typeof ORACLE_CARDS)[0] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [history, setHistory] = useState<Array<(typeof ORACLE_CARDS)[0]>>([]);
  const [showHistory, setShowHistory] = useState(true);

  // Initialize history on mount (or restore saved)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("celys_oracle_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCard(parsed[0]);
          setFlipped(true);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default initial cards matching Figma preview
    const initial = [
      ORACLE_CARDS[2], // The North Star
      ORACLE_CARDS[7], // The Weaver
      ORACLE_CARDS[3], // The Sacred Seed
    ];
    setHistory(initial);
    setCard(initial[0]);
    setFlipped(true);
  }, []);

  const saveHistory = (newHistory: Array<(typeof ORACLE_CARDS)[0]>) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("celys_oracle_history", JSON.stringify(newHistory));
    } catch {
      // ignore
    }
  };

  const pull = async () => {
    if (revealing) return;
    audioSynth?.playPopSound(600);
    setFlipped(false);
    setRevealing(true);
    const picked =
      ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];
    setTimeout(() => {
      setCard(picked);
      setFlipped(true);
      setRevealing(false);
      const filtered = history.filter((h) => h.title !== picked.title);
      saveHistory([picked, ...filtered].slice(0, 5));
      audioSynth?.playTibetanBowl(528);
    }, 350);

    try {
      await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardTitle: picked.title,
          cardSymbol: picked.symbol,
          cardWisdom: picked.wisdom,
        }),
      });
    } catch {
      // ignore
    }
  };

  // Select any card directly from recent history
  const selectFromHistory = (selectedCard: (typeof ORACLE_CARDS)[0]) => {
    if (revealing) return;
    audioSynth?.playPopSound(540);
    setFlipped(false);
    setRevealing(true);
    setTimeout(() => {
      setCard(selectedCard);
      setFlipped(true);
      setRevealing(false);
      audioSynth?.playTibetanBowl(528);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center px-4 pt-1 pb-16 text-center w-full max-w-sm mx-auto select-none">
      {/* Centered Golden Logo */}
      <div className="mb-2 flex items-center justify-center">
        <CelysLogo size={80} />
      </div>

      {/* Screen Title & Subtitle */}
      <h1
        className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
        }}
      >
        Inner Oracle
      </h1>
      <p className="text-xs text-purple-200/70 mb-2 mt-0.5">
        A message from your higher self
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center my-2">
        <SparkleDivider />
      </div>

      {/* Oracle Card Box (Exact Figma Match) */}
      <div className="relative mt-3 mb-2" style={{ width: 230, height: 300 }}>
        {/* Back of Card */}
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer shadow-2xl"
          onClick={pull}
          style={{
            background: "linear-gradient(145deg, #1e1045, #0d0a1e)",
            border: "2px solid rgba(201,162,39,0.4)",
            boxShadow:
              "0 0 40px rgba(124,58,237,0.3), inset 0 0 30px rgba(201,162,39,0.05)",
            opacity: flipped ? 0 : 1,
            pointerEvents: flipped ? "none" : "auto",
            transition: "opacity 0.4s ease",
          }}
        >
          <div style={{ fontSize: 48 }}>🔮</div>
          <div className="text-center px-4">
            <p
              className="text-[11px] font-bold"
              style={{ color: "rgba(201,162,39,0.7)", letterSpacing: "0.18em" }}
            >
              INNER ORACLE
            </p>
            <p
              className="text-[10px] mt-1"
              style={{ color: "rgba(240,232,255,0.4)" }}
            >
              tap to receive your message
            </p>
          </div>
          {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(
            (pos) => (
              <div
                key={pos}
                className={`absolute ${pos} w-4 h-4 flex items-center justify-center`}
                style={{ color: "rgba(201,162,39,0.5)", fontSize: 10 }}
              >
                ✦
              </div>
            )
          )}
        </div>

        {/* Front of Card */}
        {card && (
          <div
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 px-5 shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #1e1045, #2d1b5e)",
              border: "2px solid rgba(245, 215, 110, 0.5)",
              boxShadow:
                "0 0 50px rgba(201,162,39,0.25), inset 0 0 30px rgba(124,58,237,0.15)",
              opacity: flipped ? 1 : 0,
              pointerEvents: flipped ? "auto" : "none",
              transition: "opacity 0.35s ease",
            }}
          >
            <div
              className="w-full h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(201,162,39,0.4), transparent)",
              }}
            />
            <span style={{ fontSize: 46 }}>{card.symbol}</span>
            <p
              className="text-lg font-bold text-center font-serif tracking-wide"
              style={{
                color: "#f5d76e",
                textShadow: "0 0 16px rgba(245, 215, 110, 0.4)",
              }}
            >
              {card.title}
            </p>
            <div
              className="w-full h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)",
              }}
            />
            <p className="text-xs text-center leading-relaxed text-purple-100/90 font-serif">
              {card.wisdom}
            </p>
            <div
              className="w-full h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)",
              }}
            />
          </div>
        )}
      </div>

      {/* Main Action Button (Exact Figma Match) */}
      <button
        onClick={pull}
        className="w-full rounded-full py-4 font-bold text-white transition-all active:scale-[0.98] cursor-pointer mt-3 text-sm shadow-xl flex items-center justify-center gap-1.5"
        style={{
          background: "linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)",
          boxShadow: "0 6px 25px rgba(168, 85, 247, 0.4)",
        }}
      >
        <span>✦</span>
        <span>{card ? "Pull Another Card" : "Receive Your Message"}</span>
      </button>

      {/* Toggle Recent Cards Button */}
      {history.length > 0 && (
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="text-xs mt-3.5 mb-1 transition-colors text-purple-200/60 hover:text-purple-100 cursor-pointer"
        >
          {showHistory ? "Hide" : "View"} recent cards ({history.length})
        </button>
      )}

      {/* Clickable Recent Cards List (Exact Figma Match) */}
      {showHistory && history.length > 0 && (
        <div className="w-full mt-2 flex flex-col gap-2">
          {history.map((h, i) => {
            const isSelected = card?.title === h.title;
            return (
              <button
                key={`${h.title}-${i}`}
                onClick={() => selectFromHistory(h)}
                className="w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98] cursor-pointer shadow-md"
                style={{
                  background: isSelected
                    ? "rgba(201, 162, 39, 0.15)"
                    : "rgba(255, 255, 255, 0.04)",
                  border: isSelected
                    ? "1.5px solid rgba(245, 215, 110, 0.65)"
                    : "1px solid rgba(168, 85, 247, 0.2)",
                  boxShadow: isSelected
                    ? "0 0 16px rgba(245, 215, 110, 0.25)"
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{h.symbol}</span>
                  <span
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: isSelected ? "#f5d76e" : "#f0e8ff" }}
                  >
                    {h.title}
                  </span>
                </div>
                {isSelected ? (
                  <span className="text-[11px] text-[#f5d76e] font-bold">✦ Active</span>
                ) : (
                  <span className="text-purple-300/40 text-xs">→</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InnerOracle;

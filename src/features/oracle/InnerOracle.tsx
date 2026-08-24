"use client";

import React, { useState, useEffect } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { useAuth } from "@/app/providers";

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
  const { user } = useAuth();
  const [card, setCard] = useState<(typeof ORACLE_CARDS)[0] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [history, setHistory] = useState<Array<(typeof ORACLE_CARDS)[0]>>([]);
  const [showHistory, setShowHistory] = useState(false);

  const pull = async () => {
    if (revealing) return;
    setFlipped(false);
    setRevealing(true);
    const picked =
      ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];
    setTimeout(() => {
      setCard(picked);
      setFlipped(true);
      setRevealing(false);
      setHistory((prev) => [picked, ...prev].slice(0, 5));
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
        Inner Oracle
      </h2>
      <p className="text-xs text-purple-200/60 mb-2 mt-0.5">
        A message from your higher self
      </p>

      {/* Oracle Card Box */}
      <div className="relative mt-4 mb-2" style={{ width: 220, height: 290 }}>
        {/* Back of Card */}
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer"
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
          <div style={{ fontSize: 44 }}>🔮</div>
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
          {["top-2.5 left-2.5", "top-2.5 right-2.5", "bottom-2.5 left-2.5", "bottom-2.5 right-2.5"].map(
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
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-3 px-4"
            style={{
              background: "linear-gradient(145deg, #1e1045, #2d1b5e)",
              border: "2px solid rgba(201,162,39,0.5)",
              boxShadow:
                "0 0 50px rgba(201,162,39,0.2), inset 0 0 30px rgba(124,58,237,0.1)",
              opacity: flipped ? 1 : 0,
              pointerEvents: flipped ? "auto" : "none",
              transition: "opacity 0.4s ease 0.15s",
            }}
          >
            <div
              className="w-full h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(201,162,39,0.4), transparent)",
              }}
            />
            <span style={{ fontSize: 44 }}>{card.symbol}</span>
            <p
              className="text-base font-semibold text-center"
              style={{
                color: "#f5d76e",
                fontFamily: "'Cormorant Garamond', serif",
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
            <p
              className="text-[11px] text-center leading-relaxed text-purple-100/80"
            >
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

      {/* Main Action Button */}
      <button
        onClick={pull}
        className="w-full rounded-full py-3.5 font-semibold text-white transition-all hover:opacity-95 active:scale-[0.98] mt-3 text-xs"
        style={{
          background: "linear-gradient(135deg, #c9a227, #7c3aed)",
          boxShadow: "0 4px 20px rgba(201,162,39,0.3)",
        }}
      >
        {card ? "✦ Pull Another Card" : "✦ Receive Your Message"}
      </button>

      {history.length > 0 && (
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="text-xs mt-3 transition-colors text-purple-200/50 hover:text-purple-200"
        >
          {showHistory ? "Hide" : "View"} recent cards ({history.length})
        </button>
      )}

      {showHistory && (
        <div className="w-full mt-2 flex flex-col gap-1.5">
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-left"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              <span style={{ fontSize: 18 }}>{h.symbol}</span>
              <span className="text-xs font-medium" style={{ color: "#f5d76e" }}>
                {h.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InnerOracle;

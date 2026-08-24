"use client";

import React, { useState } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";

// Game 1: Bubble Pop
function GameBubblePop({ onBack }: { onBack: () => void }) {
  const COLORS = ["#c96ccc", "#7c3aed", "#60a5fa", "#a78bfa", "#f5d76e", "#7ec8a0", "#f87171", "#fb923c"];
  const make = () =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      popped: false,
      size: 34 + Math.random() * 20,
    }));
  const [bubbles, setBubbles] = useState(make);
  const [score, setScore] = useState(0);

  const pop = (id: number) => {
    setBubbles((b) =>
      b.map((x) => (x.id === id ? { ...x, popped: true } : x))
    );
    setScore((s) => s + 1);
  };

  const remaining = bubbles.filter((b) => !b.popped).length;

  return (
    <div className="flex flex-col items-center px-4 pt-2 pb-4 w-full">
      <div className="flex items-center justify-between w-full mb-3">
        <button
          onClick={onBack}
          className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-white/10"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(240,232,255,0.6)",
          }}
        >
          ← Back
        </button>
        <p className="text-xs font-semibold" style={{ color: "#f5d76e" }}>
          🫧 {score} popped
        </p>
      </div>
      <p
        className="text-xs mb-4 text-center"
        style={{ color: "rgba(240,232,255,0.5)" }}
      >
        Tap every bubble to clear your mind
      </p>
      <div className="grid grid-cols-4 gap-3 w-full mb-4">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => !b.popped && pop(b.id)}
            className="rounded-full flex items-center justify-center transition-all cursor-pointer"
            style={{
              width: b.size,
              height: b.size,
              margin: "auto",
              background: b.popped
                ? "rgba(255,255,255,0.04)"
                : `radial-gradient(circle at 35% 35%, white, ${b.color}99)`,
              border: b.popped
                ? "1px dashed rgba(255,255,255,0.1)"
                : `2px solid ${b.color}`,
              boxShadow: b.popped ? "none" : `0 0 12px ${b.color}55`,
              transform: b.popped ? "scale(0.3)" : "scale(1)",
              opacity: b.popped ? 0.2 : 1,
            }}
          />
        ))}
      </div>
      {remaining === 0 ? (
        <div className="text-center">
          <p className="text-sm font-semibold mb-3" style={{ color: "#7ec8a0" }}>
            ✨ All clear! You did it!
          </p>
          <button
            onClick={() => {
              setBubbles(make());
              setScore(0);
            }}
            className="py-2.5 px-5 rounded-full text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #c96ccc, #7c3aed)" }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <p className="text-xs" style={{ color: "rgba(240,232,255,0.35)" }}>
          {remaining} left
        </p>
      )}
    </div>
  );
}

// Game 2: Calm Color Sort
function GameColorSort({ onBack }: { onBack: () => void }) {
  const BINS = [
    { color: "#c96ccc", label: "Pink" },
    { color: "#60a5fa", label: "Blue" },
    { color: "#7ec8a0", label: "Green" },
  ];
  const makeItems = () =>
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      color: BINS[i % 3].color,
      sorted: false,
    })).sort(() => Math.random() - 0.5);

  const [items, setItems] = useState(makeItems);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const sortItem = (binColor: string) => {
    if (selected === null) return;
    const item = items.find((x) => x.id === selected);
    if (!item) return;
    if (item.color === binColor) {
      setItems((it) =>
        it.map((x) => (x.id === selected ? { ...x, sorted: true } : x))
      );
      setScore((s) => s + 1);
    }
    setSelected(null);
  };

  const unsorted = items.filter((x) => !x.sorted);

  return (
    <div className="flex flex-col items-center px-4 pt-2 pb-4 w-full">
      <div className="flex items-center justify-between w-full mb-3">
        <button
          onClick={onBack}
          className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-white/10"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(240,232,255,0.6)",
          }}
        >
          ← Back
        </button>
        <p className="text-xs font-semibold" style={{ color: "#f5d76e" }}>
          🎨 {score} sorted
        </p>
      </div>
      <p
        className="text-xs mb-3 text-center"
        style={{ color: "rgba(240,232,255,0.5)" }}
      >
        Tap a circle, then tap its matching color bin
      </p>
      <div className="flex gap-2.5 flex-wrap justify-center mb-4 min-h-[60px]">
        {unsorted.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setSelected(item.id === selected ? null : item.id)
            }
            className="w-10 h-10 rounded-full transition-all cursor-pointer"
            style={{
              background: item.color,
              border:
                selected === item.id ? "3px solid white" : "2px solid transparent",
              boxShadow:
                selected === item.id
                  ? `0 0 18px ${item.color}`
                  : `0 0 8px ${item.color}55`,
              transform: selected === item.id ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>
      <div className="flex gap-2.5 w-full justify-center mb-3">
        {BINS.map((bin) => (
          <button
            key={bin.color}
            onClick={() => sortItem(bin.color)}
            className="flex-1 py-3 rounded-2xl font-semibold text-xs transition-all cursor-pointer active:scale-95"
            style={{
              background: `${bin.color}22`,
              border: `2px solid ${bin.color}66`,
              color: bin.color,
            }}
          >
            {bin.label}
          </button>
        ))}
      </div>
      {unsorted.length === 0 && (
        <div className="text-center">
          <p className="text-sm font-semibold mb-2" style={{ color: "#7ec8a0" }}>
            ✨ Perfect sort!
          </p>
          <button
            onClick={() => {
              setItems(makeItems());
              setScore(0);
            }}
            className="py-2.5 px-5 rounded-full text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #c96ccc, #7c3aed)" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export const CopingGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<number | null>(null);

  const GAMES = [
    {
      title: "Bubble Pop",
      emoji: "🫧",
      desc: "Tap colorful bubbles to ground somatic attention",
    },
    {
      title: "Color Sort",
      emoji: "🎨",
      desc: "Sort vibrant frequencies into harmonic color bins",
    },
  ];

  if (activeGame === 0)
    return <GameBubblePop onBack={() => setActiveGame(null)} />;
  if (activeGame === 1)
    return <GameColorSort onBack={() => setActiveGame(null)} />;

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
        Coping Games
      </h2>
      <p className="text-xs text-purple-200/60 mb-4 mt-0.5">
        Playful ways to ground and reset
      </p>

      {/* Games List */}
      <div className="flex flex-col gap-2.5 w-full">
        {GAMES.map((g, i) => (
          <button
            key={g.title}
            onClick={() => setActiveGame(i)}
            className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.98] hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(180,120,255,0.18)",
            }}
          >
            <span style={{ fontSize: 26 }}>{g.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: "#f0e8ff" }}>
                {g.title}
              </p>
              <p className="text-[11px] truncate text-purple-200/50">
                {g.desc}
              </p>
            </div>
            <span
              className="text-xs font-bold"
              style={{ color: "#c96ccc" }}
            >
              Play →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CopingGames;

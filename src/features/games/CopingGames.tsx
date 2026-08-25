"use client";

import React, { useState, useEffect, useRef } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { audioSynth } from "@/lib/audio-synth";
import confetti from "canvas-confetti";
import { Sparkles, Star, ChevronLeft, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

// ==========================================
// 1. GAME: BUBBLE POP
// ==========================================
function GameBubblePop({ onBack }: { onBack: () => void }) {
  const COLORS = ["#c96ccc", "#7c3aed", "#60a5fa", "#a78bfa", "#f5d76e", "#7ec8a0", "#f87171", "#fb923c"];
  const make = () =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      popped: false,
      size: 36 + Math.random() * 18,
    }));
  const [bubbles, setBubbles] = useState(make);
  const [score, setScore] = useState(0);

  const pop = (id: number) => {
    setBubbles((b) =>
      b.map((x) => (x.id === id ? { ...x, popped: true } : x))
    );
    setScore((s) => s + 1);
    audioSynth?.playPopSound(580 + (id % 4) * 80);
  };

  const remaining = bubbles.filter((b) => !b.popped).length;

  return (
    <div className="flex flex-col items-center px-2 pt-2 pb-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(240,232,255,0.8)",
            border: "1px solid rgba(180,120,255,0.2)",
          }}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <p className="text-xs font-semibold" style={{ color: "#f5d76e" }}>
          🫧 {score} popped
        </p>
      </div>
      <h3 className="text-base font-serif font-bold text-white mb-1">Bubble Pop</h3>
      <p className="text-xs mb-4 text-center text-purple-200/60">
        Tap every bubble to clear your mind
      </p>
      <div className="grid grid-cols-4 gap-3 w-full mb-4 p-4 rounded-3xl bg-white/[0.03] border border-purple-500/20">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => !b.popped && pop(b.id)}
            className="rounded-full flex items-center justify-center transition-all cursor-pointer select-none active:scale-90"
            style={{
              width: b.size,
              height: b.size,
              margin: "auto",
              background: b.popped
                ? "rgba(255,255,255,0.04)"
                : `radial-gradient(circle at 35% 35%, white, ${b.color}aa)`,
              border: b.popped
                ? "1px dashed rgba(255,255,255,0.1)"
                : `2px solid ${b.color}`,
              boxShadow: b.popped ? "none" : `0 0 14px ${b.color}66`,
              transform: b.popped ? "scale(0.25)" : "scale(1)",
              opacity: b.popped ? 0.2 : 1,
            }}
          />
        ))}
      </div>
      {remaining === 0 ? (
        <div className="text-center animate-in fade-in">
          <p className="text-sm font-semibold mb-3 text-emerald-300">
            ✨ All clear! You did it!
          </p>
          <button
            onClick={() => {
              setBubbles(make());
              setScore(0);
              confetti({ particleCount: 30, spread: 60 });
            }}
            className="py-2.5 px-6 rounded-full text-xs font-semibold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #c96ccc, #7c3aed)" }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <p className="text-xs text-purple-200/50">
          {remaining} bubbles remaining
        </p>
      )}
    </div>
  );
}

// ==========================================
// 2. GAME: CALM COLOR SORT
// ==========================================
function GameColorSort({ onBack }: { onBack: () => void }) {
  const BINS = [
    { color: "#f472b6", label: "Pink" },
    { color: "#60a5fa", label: "Blue" },
    { color: "#34d399", label: "Green" },
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
      audioSynth?.playPopSound(620);
    } else {
      audioSynth?.playPopSound(320);
    }
    setSelected(null);
  };

  const unsorted = items.filter((x) => !x.sorted);

  return (
    <div className="flex flex-col items-center px-2 pt-2 pb-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(240,232,255,0.8)",
            border: "1px solid rgba(180,120,255,0.2)",
          }}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <p className="text-xs font-semibold" style={{ color: "#f5d76e" }}>
          🎨 {score} sorted
        </p>
      </div>
      <h3 className="text-base font-serif font-bold text-white mb-1">Calm Color Sort</h3>
      <p className="text-xs mb-3 text-center text-purple-200/60">
        Tap a circle, then tap its matching color bin
      </p>
      <div className="flex gap-3 flex-wrap justify-center mb-4 min-h-[60px] p-4 rounded-3xl bg-white/[0.03] border border-pink-500/20 w-full">
        {unsorted.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id === selected ? null : item.id)}
            className="w-10 h-10 rounded-full transition-all cursor-pointer select-none active:scale-95"
            style={{
              background: item.color,
              border: selected === item.id ? "3px solid white" : "2px solid transparent",
              boxShadow: selected === item.id ? `0 0 18px ${item.color}` : `0 0 8px ${item.color}55`,
              transform: selected === item.id ? "scale(1.15)" : "scale(1)",
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
        <div className="text-center animate-in fade-in">
          <p className="text-sm font-semibold mb-2 text-emerald-300">
            ✨ Perfect sort!
          </p>
          <button
            onClick={() => {
              setItems(makeItems());
              setScore(0);
              confetti({ particleCount: 30, spread: 60 });
            }}
            className="py-2.5 px-6 rounded-full text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. GAME: GROUNDING MATCH (FIGMA 4x4 EXACT MATCH)
// ==========================================
function GameGroundingMatch({ onBack }: { onBack: () => void }) {
  // 8 Pairs = 16 Cards (Exact Figma Icons)
  const PAIRS = ["🌸", "🌙", "🌊", "🌿", "💜", "🦋", "⭐", "🌺"];
  const makeDeck = () =>
    [...PAIRS, ...PAIRS]
      .map((emoji, index) => ({ id: index, emoji, matched: false, flipped: false }))
      .sort(() => Math.random() - 0.5);

  const [cards, setCards] = useState(makeDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || cards[index].flipped || cards[index].matched) return;

    audioSynth?.playPopSound(500 + index * 20);
    const newCards = [...cards];
    newCards[index].flipped = true;
    const newFlipped = [...flipped, index];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        setTimeout(() => {
          newCards[first].matched = true;
          newCards[second].matched = true;
          setCards([...newCards]);
          setFlipped([]);
          audioSynth?.playPopSound(750);
          if (newCards.every((c) => c.matched)) {
            confetti({ particleCount: 40, spread: 70 });
          }
        }, 400);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlipped([]);
        }, 800);
      }
    }
  };

  const matchedPairsCount = cards.filter((c) => c.matched).length / 2;
  const isComplete = cards.every((c) => c.matched);

  return (
    <div className="flex flex-col items-center px-2 pt-2 pb-6 w-full max-w-sm mx-auto">
      {/* Top Header Row (Exact Figma Match) */}
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3.5 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            color: "rgba(240, 232, 255, 0.8)",
            border: "1px solid rgba(180, 120, 255, 0.2)",
          }}
        >
          ← Back
        </button>
        <p className="text-xs font-semibold text-[#f5d76e]">
          🌿 {matchedPairsCount}/8 · {moves} moves
        </p>
      </div>

      <p className="text-xs mb-4 text-center text-purple-200/60">
        Find matching pairs to ground yourself
      </p>

      {/* 4x4 Grid = 16 Cards */}
      <div className="grid grid-cols-4 gap-2.5 w-full mb-4">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => handleCardClick(i)}
            className="aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all cursor-pointer select-none active:scale-95 shadow-sm"
            style={{
              background: c.matched
                ? "rgba(52, 211, 153, 0.15)"
                : c.flipped
                  ? "rgba(124, 58, 237, 0.35)"
                  : "rgba(255, 255, 255, 0.05)",
              border: c.matched
                ? "1.5px solid rgba(52, 211, 153, 0.55)"
                : c.flipped
                  ? "1.5px solid rgba(180, 120, 255, 0.5)"
                  : "1px solid rgba(180, 120, 255, 0.2)",
            }}
          >
            {c.flipped || c.matched ? c.emoji : ""}
          </button>
        ))}
      </div>

      {/* Exact Figma Match Completion Screen */}
      {isComplete && (
        <div className="flex flex-col items-center text-center animate-in fade-in mt-1 w-full">
          <p
            className="text-sm sm:text-base font-bold mb-3.5"
            style={{ color: "#7ec8a0" }}
          >
            ✨ You matched them all in {moves} moves!
          </p>
          <button
            onClick={() => {
              setCards(makeDeck());
              setMoves(0);
              setFlipped([]);
              confetti({ particleCount: 35, spread: 60 });
            }}
            className="w-full max-w-[280px] py-3.5 px-6 rounded-full text-sm font-bold text-white transition-all active:scale-95 cursor-pointer shadow-lg"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
              boxShadow: "0 8px 30px rgba(147, 51, 234, 0.4)",
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. GAME: GRATITUDE SPINNER (FIGMA EXACT 8 PARTITIONS)
// ==========================================
function GameGratitudeSpinner({ onBack }: { onBack: () => void }) {
  const SPINNER_SECTORS = [
    { label: "A Loving Person", prompt: "Who brings immense warmth, joy, or safety to your life?", color: "#b366be", emoji: "💜" },
    { label: "Inner Wisdom", prompt: "What past difficulty taught you inner strength and wisdom?", color: "#7c3aed", emoji: "🌱" },
    { label: "Peaceful Moment", prompt: "Recall a recent quiet, calming moment that comforted your soul.", color: "#4a88e8", emoji: "🌊" },
    { label: "Nature's Wonder", prompt: "What beauty in nature or the sky recently caught your breath?", color: "#5fae8b", emoji: "🌿" },
    { label: "Simple Pleasure", prompt: "What small everyday comfort (a warm cup, soft bed, cozy light) are you grateful for?", color: "#dfb76c", emoji: "☕" },
    { label: "Inner Strength", prompt: "What quality about yourself has carried you through tough times?", color: "#dd7936", emoji: "🦁" },
    { label: "A Safe Place", prompt: "Where in the world or in your mind do you feel most grounded and secure?", color: "#8b8bf0", emoji: "🏡" },
    { label: "A Happy Memory", prompt: "What sweet memory always brings a genuine smile to your face?", color: "#d87fa8", emoji: "🌸" },
  ];

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedSector, setSelectedSector] = useState<typeof SPINNER_SECTORS[0] | null>(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSelectedSector(null);
    audioSynth?.playPopSound(600);

    const extraDegrees = 1440 + Math.floor(Math.random() * 360);
    const newRot = rotation + extraDegrees;
    setRotation(newRot);

    setTimeout(() => {
      setSpinning(false);
      const normalized = ((newRot % 360) + 360) % 360;
      const sectorAngle = 360 / SPINNER_SECTORS.length;
      const index = Math.floor((360 - (normalized % 360)) / sectorAngle) % SPINNER_SECTORS.length;
      setSelectedSector(SPINNER_SECTORS[index]);
      audioSynth?.playPopSound(800);
      confetti({ particleCount: 35, spread: 65 });
    }, 3200);
  };

  return (
    <div className="flex flex-col items-center px-2 pt-2 pb-12 w-full max-w-md mx-auto select-none">
      {/* Top Header Row (Exact Figma Match) */}
      <div className="flex items-center justify-between w-full mb-6 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3.5 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            color: "rgba(240, 232, 255, 0.8)",
            border: "1px solid rgba(180, 120, 255, 0.2)",
          }}
        >
          ← Back
        </button>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#a78bfa]">
          <span>🌀</span>
          <span>Gratitude Spinner</span>
        </div>
      </div>

      {/* Interactive 8-Partition Wheel Container (Exact Figma Match) */}
      <div className="relative flex items-center justify-center my-4" style={{ width: 230, height: 230 }}>
        {/* Top White Pointer indicator (Exact Figma Match) */}
        <div
          className="absolute -top-3 z-20 w-0 h-0"
          style={{
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "15px solid #ffffff",
            filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6))",
          }}
        />

        {/* The rotating 8-sector wheel */}
        <div
          className="rounded-full relative overflow-hidden transition-all ease-out"
          style={{
            width: 210,
            height: 210,
            transform: `rotate(${rotation}deg)`,
            transitionDuration: "3.2s",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.25), 0 8px 30px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* 8 Radial Sectors */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {SPINNER_SECTORS.map((s, idx) => {
              const angle = 360 / 8; // 45 degrees each
              const startAngle = ((idx * angle - 90) * Math.PI) / 180;
              const endAngle = (((idx + 1) * angle - 90) * Math.PI) / 180;

              const x1 = 50 + 50 * Math.cos(startAngle);
              const y1 = 50 + 50 * Math.sin(startAngle);
              const x2 = 50 + 50 * Math.cos(endAngle);
              const y2 = 50 + 50 * Math.sin(endAngle);

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={s.label}
                  d={pathData}
                  fill={s.color}
                  opacity={0.92}
                  stroke="rgba(13, 10, 30, 0.35)"
                  strokeWidth="0.6"
                />
              );
            })}
          </svg>

          {/* Center Hub with Gold Sparkle (Exact Figma Match) */}
          <div
            className="absolute inset-0 m-auto rounded-full flex items-center justify-center select-none shadow-lg"
            style={{
              width: 48,
              height: 48,
              background: "#0d071e",
              border: "2.5px solid #f5d76e",
              boxShadow: "0 0 14px rgba(245, 215, 110, 0.4)",
            }}
          >
            <span className="text-[#f5d76e] text-base font-bold select-none leading-none">✦</span>
          </div>
        </div>
      </div>

      {/* Purple Spin Pill Button (Exact Figma Match) */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className="w-full max-w-[280px] rounded-full py-3.5 px-6 font-bold text-white text-sm transition-all active:scale-95 my-4 cursor-pointer shadow-xl disabled:opacity-75"
        style={{
          background: "linear-gradient(90deg, #b062db, #8750e6)",
          boxShadow: "0 6px 24px rgba(168, 85, 247, 0.45)",
        }}
      >
        {spinning ? "✦ Spinning..." : "✦ Spin"}
      </button>

      {/* Reflection Card upon landing */}
      {selectedSector && (
        <div
          className="w-full rounded-3xl p-4 text-center animate-in fade-in zoom-in duration-300 max-w-xs shadow-xl"
          style={{
            background: "rgba(22, 11, 51, 0.9)",
            border: `1.5px solid ${selectedSector.color}88`,
            boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${selectedSector.color}33`,
          }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="text-xl">{selectedSector.emoji}</span>
            <span className="text-sm font-bold" style={{ color: selectedSector.color }}>
              Gratitude for: {selectedSector.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#f0e8ff]/90">
            &quot;{selectedSector.prompt}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

// ==========================================
const STAR_WORDS = [
  "Courage", "Resilience", "Serenity", "Inner Peace",
  "Worthiness", "Grace", "Strength", "Radiance", "Wisdom"
];
const STAR_COLORS = ["#f5d76e", "#fbbf24", "#c084fc", "#60a5fa", "#7ec8a0", "#f472b6"];

interface FallingStar {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  size: number;
  word: string;
  caught: boolean;
}

function GameStarCatch({ onBack }: { onBack: () => void }) {
  const [stars, setStars] = useState<FallingStar[]>([]);
  const [caughtWords, setCaughtWords] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const nextId = useRef(1);
  const missedStarIds = useRef<Set<number>>(new Set());

  // 30-Second Real-Time Countdown
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setIsGameOver(true);
          audioSynth?.playPopSound(850);
          confetti({ particleCount: 40, spread: 70 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Star Spawn and Fall Animation Loop with Accurate Unique ID Missed Tracking
  useEffect(() => {
    if (!isPlaying) return;

    const spawnTimer = setInterval(() => {
      setStars((prev) => [
        ...prev.slice(-8),
        {
          id: nextId.current++,
          x: 10 + Math.random() * 80,
          y: -10,
          speed: 1.5 + Math.random() * 1.5,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          size: 28 + Math.random() * 10,
          word: STAR_WORDS[Math.floor(Math.random() * STAR_WORDS.length)],
          caught: false,
        },
      ]);
    }, 1100);

    const fallTimer = setInterval(() => {
      setStars((prev) => {
        return prev
          .map((s) => {
            const nextY = s.y + s.speed;
            if (nextY >= 105 && !s.caught && !missedStarIds.current.has(s.id)) {
              missedStarIds.current.add(s.id);
              setMissed(missedStarIds.current.size);
            }
            return { ...s, y: nextY };
          })
          .filter((s) => s.y < 105);
      });
    }, 50);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(fallTimer);
    };
  }, [isPlaying]);

  const startGame = () => {
    missedStarIds.current.clear();
    setStars([]);
    setCaughtWords([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsPlaying(true);
    audioSynth?.playPopSound(580);
  };

  const catchStar = (id: number, word: string) => {
    setStars((prev) =>
      prev.map((s) => (s.id === id ? { ...s, caught: true } : s))
    );
    setScore((s) => s + 1);
    if (!caughtWords.includes(word)) {
      setCaughtWords((w) => [...w, word]);
    }
    audioSynth?.playPopSound(700);
  };

  return (
    <div className="flex flex-col items-center px-2 pt-2 pb-6 w-full max-w-md mx-auto select-none">
      {/* Top Header Stats with Real-Time Countdown, Caught & Missed Count */}
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3.5 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            color: "rgba(240, 232, 255, 0.8)",
            border: "1px solid rgba(180, 120, 255, 0.2)",
          }}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
              timeLeft <= 5 && isPlaying
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                : "bg-amber-400/15 text-amber-300 border-amber-400/30"
            }`}
          >
            ⏱️ {timeLeft}s
          </span>
          <span className="text-xs font-semibold text-yellow-300">
            ⭐ {score}
          </span>
          <span className="text-xs font-semibold text-rose-300/80">
            💨 {missed}
          </span>
        </div>
      </div>

      <h3 className="text-base font-serif font-bold text-white mb-1">Star Catch</h3>
      <p className="text-xs mb-3 text-center text-purple-200/60">
        Catch falling celestial blessings in 30 seconds
      </p>

      {/* Sky Canvas Stage */}
      <div
        className="relative w-full rounded-3xl overflow-hidden mb-3 select-none touch-none"
        style={{
          height: 230,
          background: "radial-gradient(ellipse at 50% 0%, #1e1045 0%, #0d0a1e 80%)",
          border: "1.5px solid rgba(251,191,36,0.3)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.12)",
        }}
      >
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Star size={32} color="#f5d76e" className="animate-pulse mb-2" />
            <p className="text-sm font-semibold text-[#f0e8ff]">
              Catch Falling Constellations
            </p>
            <p className="text-xs mt-1 text-purple-200/50">
              Tap stars as they descend to absorb empowering strengths
            </p>
          </div>
        )}

        {stars.map((s) => {
          if (s.caught) return null;
          return (
            <button
              key={s.id}
              onClick={() => catchStar(s.id, s.word)}
              className="absolute flex flex-col items-center transition-transform active:scale-125 focus:outline-none cursor-pointer"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="rounded-full flex items-center justify-center animate-spin"
                style={{
                  width: s.size,
                  height: s.size,
                  background: `radial-gradient(circle, #ffffff 10%, ${s.color} 70%)`,
                  boxShadow: `0 0 16px ${s.color}`,
                  animationDuration: "6s",
                }}
              >
                <span className="text-xs">⭐</span>
              </div>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 whitespace-nowrap"
                style={{
                  background: "rgba(13,10,30,0.85)",
                  border: `1px solid ${s.color}66`,
                  color: s.color,
                }}
              >
                {s.word}
              </span>
            </button>
          );
        })}
      </div>

      {/* Game Over Celebration / Start Button */}
      {isGameOver ? (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 w-full p-4 rounded-3xl bg-[#1e1438]/90 border border-amber-400/40 shadow-xl mb-3">
          <span className="text-3xl mb-1.5 block animate-bounce">🏆</span>
          <p className="text-sm font-bold text-amber-300 mb-1">
            ✨ 30 Seconds Complete!
          </p>
          <div className="flex items-center justify-center gap-3 my-2 text-xs">
            <span className="text-yellow-300 font-semibold bg-yellow-500/15 px-3 py-1 rounded-full border border-yellow-500/30">
              ⭐ Caught: {score}
            </span>
            <span className="text-rose-300 font-semibold bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
              💨 Missed: {missed}
            </span>
          </div>
          <p className="text-xs text-purple-200/80 mb-3 leading-relaxed">
            You absorbed <strong>{caughtWords.length}</strong> celestial strengths!
          </p>
          <button
            onClick={startGame}
            className="py-2.5 px-6 rounded-full text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shadow-lg"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #d97706)",
              boxShadow: "0 4px 20px rgba(251, 191, 36, 0.4)",
            }}
          >
            Play Again (30s)
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            if (!isPlaying && timeLeft === 30) {
              startGame();
            } else if (!isPlaying && timeLeft > 0) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          }}
          className="w-full max-w-xs rounded-full py-2.5 font-semibold text-xs text-white transition-all active:scale-95 mb-3 cursor-pointer shadow-md"
          style={{
            background: isPlaying
              ? "rgba(248, 113, 113, 0.25)"
              : "linear-gradient(135deg, #fbbf24, #d97706)",
            border: `1px solid ${isPlaying ? "#f87171" : "rgba(251, 191, 36, 0.4)"}`,
            color: isPlaying ? "#fca5a5" : "#fff",
            boxShadow: isPlaying ? "none" : "0 4px 18px rgba(251, 191, 36, 0.35)",
          }}
        >
          {isPlaying ? "⏸ Pause Catching" : timeLeft < 30 ? "▶ Resume Catching" : "▶ Start 30s Star Catch"}
        </button>
      )}

      {caughtWords.length > 0 && (
        <div className="w-full rounded-2xl p-3 bg-white/[0.04] border border-amber-500/20">
          <p className="text-[11px] font-semibold mb-1.5 text-amber-300">
            ✦ Your Empowering Strengths:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {caughtWords.map((w) => (
              <span
                key={w}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(251,191,36,0.18)", border: "1px solid rgba(251,191,36,0.4)", color: "#f5d76e" }}
              >
                ⭐ {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. GAME: PEACEFUL MAZE (FIGMA EXACT 6x6 GRID & D-PAD)
// ==========================================
function GamePeacefulMaze({ onBack }: { onBack: () => void }) {
  // Levels: 0 = Path, 1 = Wall
  const MAZES = [
    {
      grid: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1],
        [1, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1],
      ],
      start: { r: 1, c: 1 },
      goal: { r: 4, c: 4 },
    },
    {
      grid: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1],
      ],
      start: { r: 1, c: 1 },
      goal: { r: 4, c: 4 },
    },
    {
      grid: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1],
      ],
      start: { r: 1, c: 1 },
      goal: { r: 4, c: 4 },
    },
  ];

  const [level, setLevel] = useState(0);
  const currentMaze = MAZES[level % MAZES.length];
  const [player, setPlayer] = useState(currentMaze.start);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const isMovingRef = useRef(false);

  const resetMaze = () => {
    setPlayer(currentMaze.start);
    setIsWon(false);
    setMoves(0);
    audioSynth?.playPopSound(420);
  };

  const move = (dr: number, dc: number) => {
    if (isWon) return;
    if (isMovingRef.current) return;
    isMovingRef.current = true;
    setTimeout(() => {
      isMovingRef.current = false;
    }, 120);

    setPlayer((prev) => {
      const nr = prev.r + dr;
      const nc = prev.c + dc;

      // Check bounds & wall
      if (
        nr >= 0 &&
        nr < 6 &&
        nc >= 0 &&
        nc < 6 &&
        currentMaze.grid[nr][nc] === 0
      ) {
        setMoves((m) => m + 1);
        audioSynth?.playPopSound(520 + (nr + nc) * 30);

        // Check goal
        if (nr === currentMaze.goal.r && nc === currentMaze.goal.c) {
          setIsWon(true);
          audioSynth?.playPopSound(800);
          confetti({ particleCount: 35, spread: 65 });
        }
        return { r: nr, c: nc };
      } else {
        audioSynth?.playPopSound(280);
        return prev;
      }
    });
  };

  const moveRef = useRef(move);
  moveRef.current = move;
  const resetRef = useRef(resetMaze);
  resetRef.current = resetMaze;

  // Keyboard Arrow Support with proper cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        moveRef.current(-1, 0);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        moveRef.current(1, 0);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        moveRef.current(0, -1);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        moveRef.current(0, 1);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center px-2 pt-1 pb-24 w-full max-w-sm mx-auto select-none">
      {/* Header Row (Exact Figma Match) */}
      <div className="flex items-center justify-between w-full mb-2 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3.5 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            color: "rgba(240, 232, 255, 0.8)",
            border: "1px solid rgba(180, 120, 255, 0.2)",
          }}
        >
          ← Back
        </button>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7ec8a0]">
          <span>🧩</span>
          <span>Find the exit</span>
        </div>
      </div>

      {/* Subtitle (Exact Figma Match) */}
      <p className="text-xs mb-3 text-center text-purple-200/60">
        Guide the dot to ⭐ using the arrows below
      </p>

      {/* 6x6 Maze Grid Stage */}
      <div
        className="w-full max-w-[260px] aspect-square rounded-3xl p-2.5 mb-3.5 select-none shadow-2xl transition-all"
        style={{
          background: "rgba(18, 10, 40, 0.75)",
          border: isWon
            ? "1.5px solid rgba(250, 204, 21, 0.5)"
            : "1.5px solid rgba(168, 85, 247, 0.3)",
          boxShadow: isWon
            ? "0 0 30px rgba(250, 204, 21, 0.25), 0 8px 30px rgba(0, 0, 0, 0.6)"
            : "0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(168, 85, 247, 0.15)",
        }}
      >
        <div className="grid grid-cols-6 grid-rows-6 gap-1.5 w-full h-full">
          {currentMaze.grid.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = player.r === r && player.c === c;
              const isGoal = currentMaze.goal.r === r && currentMaze.goal.c === c;
              const isWall = cell === 1;
              const isPlayerAtGoal = isPlayer && isGoal;

              return (
                <div
                  key={`${r}-${c}`}
                  className="rounded-lg flex items-center justify-center relative transition-all duration-200"
                  style={{
                    background: isPlayerAtGoal
                      ? "radial-gradient(circle, rgba(250, 204, 21, 0.35) 0%, rgba(168, 85, 247, 0.4) 100%)"
                      : isWall
                      ? "rgba(10, 5, 24, 0.95)"
                      : "rgba(35, 18, 65, 0.6)",
                    border: isPlayerAtGoal
                      ? "2px solid #facc15"
                      : isWall
                      ? "1px solid rgba(168, 85, 247, 0.12)"
                      : "1px solid rgba(168, 85, 247, 0.3)",
                    boxShadow: isPlayerAtGoal
                      ? "0 0 20px rgba(250, 204, 21, 0.7), inset 0 0 10px rgba(250, 204, 21, 0.4)"
                      : "none",
                  }}
                >
                  {/* Goal & Player Rendering */}
                  {isPlayerAtGoal ? (
                    <div className="relative flex items-center justify-center animate-in zoom-in duration-300">
                      <div className="absolute w-6 h-6 rounded-full bg-amber-400/40 animate-ping" />
                      <span
                        className="text-xl sm:text-2xl relative z-10 select-none animate-bounce"
                        style={{
                          filter: "drop-shadow(0 0 16px #facc15) drop-shadow(0 0 6px #ffffff)",
                        }}
                      >
                        ⭐
                      </span>
                    </div>
                  ) : isGoal ? (
                    <span
                      className="text-base sm:text-lg animate-pulse select-none"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.7))",
                      }}
                    >
                      ⭐
                    </span>
                  ) : isPlayer ? (
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform animate-in zoom-in"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #f472b6, #c084fc 70%, #9333ea)",
                        boxShadow: "0 0 14px #d946ef, 0 0 4px #ffffff",
                      }}
                    />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* If won: Show Victory Card; Else show D-Pad controls */}
      {isWon ? (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 w-full max-w-[280px] p-4 rounded-3xl bg-[#160b33]/90 border border-amber-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <span className="text-3xl mb-1.5 block animate-bounce">🌟</span>
          <p className="text-sm font-bold text-emerald-300 mb-1">
            ✨ You reached the exit in {moves} moves!
          </p>
          <p className="text-[11px] text-purple-200/60 mb-3">
            Mind is clear, centered, and peaceful.
          </p>
          <div className="flex gap-2 w-full justify-center">
            <button
              onClick={resetMaze}
              className="py-2.5 px-4 rounded-full text-xs font-semibold text-purple-200 bg-white/[0.08] hover:bg-white/15 border border-purple-400/30 transition-all active:scale-95 cursor-pointer"
            >
              ↺ Replay
            </button>
            <button
              onClick={() => {
                setLevel((l) => l + 1);
                const nextMaze = MAZES[(level + 1) % MAZES.length];
                setPlayer(nextMaze.start);
                setIsWon(false);
                setMoves(0);
                confetti({ particleCount: 35, spread: 65 });
              }}
              className="py-2.5 px-5 rounded-full text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shadow-lg flex-1"
              style={{
                background: "linear-gradient(135deg, #a855f7, #6366f1)",
                boxShadow: "0 4px 20px rgba(147, 51, 234, 0.4)",
              }}
            >
              Play Next Maze →
            </button>
          </div>
        </div>
      ) : (
        /* D-Pad 3x3 Controller Grid (Strict Single Move per Click) */
        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-auto max-w-[190px] sm:max-w-[220px] items-center justify-items-center select-none my-1">
          {/* Row 1: Up Arrow */}
          <div />
          <button
            onClick={(e) => {
              e.preventDefault();
              move(-1, 0);
            }}
            aria-label="Move Up"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: "linear-gradient(145deg, rgba(95, 25, 142, 0.95), rgba(58, 14, 92, 0.98))",
              color: "#f472b6",
              border: "1.5px solid rgba(168, 85, 247, 0.45)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
            }}
          >
            <ArrowUp size={22} className="stroke-[2.5]" />
          </button>
          <div />

          {/* Row 2: Left Arrow, Reset, Right Arrow */}
          <button
            onClick={(e) => {
              e.preventDefault();
              move(0, -1);
            }}
            aria-label="Move Left"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: "linear-gradient(145deg, rgba(95, 25, 142, 0.95), rgba(58, 14, 92, 0.98))",
              color: "#f472b6",
              border: "1.5px solid rgba(168, 85, 247, 0.45)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
            }}
          >
            <ArrowLeft size={22} className="stroke-[2.5]" />
          </button>

          {/* Center Reset button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              resetMaze();
            }}
            title="Reset position"
            aria-label="Reset Position"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "rgba(240, 232, 255, 0.7)",
              border: "1px solid rgba(180, 120, 255, 0.25)",
            }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              move(0, 1);
            }}
            aria-label="Move Right"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: "linear-gradient(145deg, rgba(95, 25, 142, 0.95), rgba(58, 14, 92, 0.98))",
              color: "#f472b6",
              border: "1.5px solid rgba(168, 85, 247, 0.45)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
            }}
          >
            <ArrowRight size={22} className="stroke-[2.5]" />
          </button>

          {/* Row 3: Down Arrow */}
          <div />
          <button
            onClick={(e) => {
              e.preventDefault();
              move(1, 0);
            }}
            aria-label="Move Down"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: "linear-gradient(145deg, rgba(95, 25, 142, 0.95), rgba(58, 14, 92, 0.98))",
              color: "#f472b6",
              border: "1.5px solid rgba(168, 85, 247, 0.45)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
            }}
          >
            <ArrowDown size={22} className="stroke-[2.5]" />
          </button>
          <div />
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN COPING GAMES COMPONENT (FIGMA EXACT MATCH)
// ==========================================
export const CopingGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<number | null>(null);

  // 6 Figma Coping Games with exact styling & color schemes matching Figma Screenshot 1
  const GAMES = [
    {
      id: 0,
      title: "Bubble Pop",
      emoji: "🫧",
      desc: "Pop every bubble to clear your mind",
      color: "#c084fc",
      borderColor: "rgba(192, 132, 252, 0.35)",
      hoverBorder: "hover:border-[#c084fc]/70",
      btnBg: "bg-[#c084fc]/15 text-[#c084fc] border-[#c084fc]/40",
      shadow: "0 4px 20px rgba(124, 58, 237, 0.15)",
    },
    {
      id: 1,
      title: "Calm Color Sort",
      emoji: "🎨",
      desc: "Sort colors into matching bins",
      color: "#f472b6",
      borderColor: "rgba(244, 114, 182, 0.35)",
      hoverBorder: "hover:border-[#f472b6]/70",
      btnBg: "bg-[#f472b6]/15 text-[#f472b6] border-[#f472b6]/40",
      shadow: "0 4px 20px rgba(236, 72, 153, 0.15)",
    },
    {
      id: 2,
      title: "Grounding Match",
      emoji: "🌿",
      desc: "Find matching pairs to ground yourself",
      color: "#34d399",
      borderColor: "rgba(52, 211, 153, 0.35)",
      hoverBorder: "hover:border-[#34d399]/70",
      btnBg: "bg-[#34d399]/15 text-[#34d399] border-[#34d399]/40",
      shadow: "0 4px 20px rgba(16, 185, 129, 0.15)",
    },
    {
      id: 3,
      title: "Gratitude Spinner",
      emoji: "🌀",
      desc: "Spin and reflect on what you love",
      color: "#fbbf24",
      borderColor: "rgba(251, 191, 36, 0.35)",
      hoverBorder: "hover:border-[#fbbf24]/70",
      btnBg: "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/40",
      shadow: "0 4px 20px rgba(245, 158, 11, 0.15)",
    },
    {
      id: 4,
      title: "Star Catch",
      emoji: "⭐",
      desc: "Catch falling stars in 30 seconds",
      color: "#fbbf24",
      borderColor: "rgba(234, 179, 8, 0.35)",
      hoverBorder: "hover:border-[#eab308]/70",
      btnBg: "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/40",
      shadow: "0 4px 20px rgba(234, 179, 8, 0.15)",
    },
    {
      id: 5,
      title: "Peaceful Maze",
      emoji: "🧩",
      desc: "Find your way through calming paths",
      color: "#60a5fa",
      borderColor: "rgba(96, 165, 250, 0.35)",
      hoverBorder: "hover:border-[#60a5fa]/70",
      btnBg: "bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/40",
      shadow: "0 4px 20px rgba(59, 130, 246, 0.15)",
    },
  ];

  if (activeGame === 0) return <GameBubblePop onBack={() => setActiveGame(null)} />;
  if (activeGame === 1) return <GameColorSort onBack={() => setActiveGame(null)} />;
  if (activeGame === 2) return <GameGroundingMatch onBack={() => setActiveGame(null)} />;
  if (activeGame === 3) return <GameGratitudeSpinner onBack={() => setActiveGame(null)} />;
  if (activeGame === 4) return <GameStarCatch onBack={() => setActiveGame(null)} />;
  if (activeGame === 5) return <GamePeacefulMaze onBack={() => setActiveGame(null)} />;

  return (
    <div className="flex flex-col items-center px-3 pt-2 pb-8 text-center w-full max-w-md mx-auto">
      {/* Centered Golden Lion Logo */}
      <div className="mb-2">
        <CelysLogo size={76} />
      </div>

      {/* Screen Title & Subtitle (Exact Figma Match) */}
      <h2
        className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mt-0.5"
        style={{
          background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Coping Games
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Play, breathe, and reset your mind
      </p>

      {/* Decorative Golden Sparkle Divider */}
      <SparkleDivider className="my-2 mb-4" />

      {/* 2-Columns Grid Layout (6 Figma Cards) */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        {GAMES.map((g) => (
          <button
            key={g.title}
            onClick={() => {
              setActiveGame(g.id);
              audioSynth?.playPopSound(500 + g.id * 40);
            }}
            className={`rounded-[22px] p-4 sm:p-5 flex flex-col justify-between items-start text-left transition-all active:scale-[0.97] cursor-pointer min-h-[195px] sm:min-h-[205px] ${g.hoverBorder}`}
            style={{
              background: "linear-gradient(145deg, rgba(28, 16, 56, 0.75), rgba(16, 10, 35, 0.85))",
              border: `1px solid ${g.borderColor}`,
              boxShadow: g.shadow,
            }}
          >
            {/* Top Icon, Title, Description */}
            <div className="w-full">
              <span className="text-[28px] leading-none block mb-3">{g.emoji}</span>
              <h3
                className="text-xs sm:text-[13px] font-bold leading-snug mb-1.5"
                style={{ color: g.color }}
              >
                {g.title}
              </h3>
              <p className="text-[10.5px] text-purple-200/60 line-clamp-3 leading-relaxed">
                {g.desc}
              </p>
            </div>

            {/* Play Pill Button */}
            <div className="mt-auto pt-3 w-full">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-3.5 py-1 rounded-full border transition-all ${g.btnBg}`}
              >
                ▶ Play
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CopingGames;

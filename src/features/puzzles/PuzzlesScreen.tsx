"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAccessibility } from "@/context/AccessibilityContext";
import { audioSynth } from "@/lib/audio-synth";
import { triggerConfetti as confetti } from "@/lib/confetti";
import {
  Sparkles,
  ChevronLeft,
  RotateCcw,
  Trophy,
  ArrowRightLeft,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// ==========================================
// 1. PUZZLE: COLOR HARMONY (THEME-ADAPTIVE SPECTRUMS)
// ==========================================
const HARMONY_THEMES: Record<number, string[]> = {
  // 0: Lotus Purple
  0: ["#1e1045", "#3b176f", "#582098", "#7e22ce", "#a855f7", "#ede9fe"],
  // 1: Healing Emerald
  1: ["#022c22", "#064e3b", "#047857", "#059669", "#34d399", "#d1fae5"],
  // 2: Celestial Azure
  2: ["#082f49", "#0369a1", "#0284c7", "#38bdf8", "#7dd3fc", "#e0f2fe"],
  // 3: Radiant Gold
  3: ["#451a03", "#78350f", "#b45309", "#d97706", "#fbbf24", "#fef3c7"],
  // 4: Sunset Coral
  4: ["#4c0519", "#881337", "#be123c", "#e11d48", "#fb7185", "#ffe4e6"],
};

function ColorHarmonyPuzzle({ onBack }: { onBack: () => void }) {
  const { currentTheme, activeColor } = useAccessibility();
  const spectrum = HARMONY_THEMES[activeColor] || HARMONY_THEMES[0];
  const [tiles, setTiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const shuffleTiles = (overrideSpectrum?: string[]) => {
    const activeSpectrum = (overrideSpectrum && Array.isArray(overrideSpectrum)) ? overrideSpectrum : spectrum;
    let shuffled = [...activeSpectrum].sort(() => Math.random() - 0.5);
    while (JSON.stringify(shuffled) === JSON.stringify(activeSpectrum)) {
      shuffled = [...activeSpectrum].sort(() => Math.random() - 0.5);
    }
    setTiles(shuffled);
    setSelectedIndex(null);
    setSwaps(0);
    setIsWon(false);
    audioSynth?.playPopSound(420);
  };

  const showAnswer = () => {
    setTiles([...spectrum]);
    setSelectedIndex(null);
    setIsWon(true);
    audioSynth?.playPopSound(800);
    confetti({ particleCount: 35, spread: 65 });
  };

  useEffect(() => {
    shuffleTiles(spectrum);
  }, [activeColor]);

  const handleTileClick = (index: number) => {
    if (isWon) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
      audioSynth?.playPopSound(500);
    } else {
      if (selectedIndex === index) {
        setSelectedIndex(null);
        return;
      }

      const newTiles = [...tiles];
      const temp = newTiles[selectedIndex];
      newTiles[selectedIndex] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedIndex(null);
      setSwaps((s) => s + 1);
      audioSynth?.playPopSound(620);

      if (JSON.stringify(newTiles) === JSON.stringify(spectrum)) {
        setIsWon(true);
        audioSynth?.playPopSound(880);
        confetti({ particleCount: 40, spread: 70 });
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16">
      {/* Header Row (Exact Figma Match) */}
      <div className="flex items-center justify-between w-full mb-4 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3.5 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          style={{
            background: currentTheme.cardBg,
            color: "rgba(240, 232, 255, 0.8)",
            border: `1px solid ${currentTheme.cardBorder}`,
          }}
        >
          ← Back
        </button>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-200">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{
              background: currentTheme.color,
              boxShadow: `0 0 8px ${currentTheme.glow}`,
            }}
          />
          <span>{swaps} swaps</span>
        </div>
      </div>

      {/* Title & Subtitle (Exact Figma Match) */}
      <h1
        className="font-serif text-2xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 16px rgba(245, 215, 110, 0.35)",
        }}
      >
        Color Harmony
      </h1>
      <p className="text-xs text-purple-200/70 mb-3 text-center">
        Arrange from darkest to lightest
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center mb-6">
        <SparkleDivider />
      </div>

      {/* 6 Vertical Capsules Row (Exact Figma Match) */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-4 w-full px-2">
        {tiles.map((color, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className="w-10 sm:w-11 h-28 sm:h-32 rounded-3xl transition-all duration-200 cursor-pointer relative"
              style={{
                background: color,
                boxShadow: isSelected
                  ? `0 0 24px #ffffff, 0 0 40px ${currentTheme.glow}`
                  : "0 6px 18px rgba(0, 0, 0, 0.45)",
                transform: isSelected ? "scale(1.08) translateY(-4px)" : "scale(1)",
                border: isSelected
                  ? "2.5px solid #ffffff"
                  : `1.5px solid ${currentTheme.cardBorder}`,
              }}
            />
          );
        })}
      </div>

      {/* Instructions (Exact Figma Match) */}
      <p className="text-xs text-purple-200/60 mt-4 mb-6 text-center font-medium">
        Tap a color to select it, tap another to swap
      </p>

      {/* Action Buttons: Shuffle and Show Answer */}
      <div className="flex items-center justify-center gap-3 w-full max-w-xs">
        <button
          onClick={() => shuffleTiles(spectrum)}
          className="flex-1 py-3 px-4 rounded-full text-xs font-semibold text-white/90 transition-all active:scale-95 cursor-pointer text-center hover:text-white"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.cardBorder}`,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
          }}
        >
          Shuffle
        </button>
        <button
          onClick={showAnswer}
          className="flex-1 py-3 px-4 rounded-full text-xs font-semibold text-white/90 transition-all active:scale-95 cursor-pointer text-center hover:text-white"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.cardBorder}`,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
          }}
        >
          Show Answer
        </button>
      </div>

      {/* Victory Celebration */}
      {isWon && (
        <div
          className="w-full rounded-3xl p-4 text-center mt-6 animate-in fade-in zoom-in duration-300 shadow-xl"
          style={{
            background: "rgba(22, 11, 51, 0.9)",
            border: "1.5px solid #f5d76e",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(245, 215, 110, 0.3)",
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-base font-bold text-amber-300 mb-1">
            <Trophy size={18} /> Color Harmony Restored!
          </div>
          <p className="text-xs text-purple-100 mb-3">
            ✨ Perfect gradient in <strong>{swaps}</strong> swaps.
          </p>
          <button
            onClick={() => shuffleTiles()}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white transition-all active:scale-95 shadow-lg cursor-pointer"
            style={{
              background: currentTheme.navActiveGradient,
              border: `1px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 18px ${currentTheme.glow}`,
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
// 2. PUZZLE: ZEN BLOCKS (EASY)
// ==========================================
const ZEN_SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];
const ZEN_EMOJIS: Record<number, string> = {
  1: "🌸",
  2: "🌙",
  3: "🌊",
  4: "🌿",
  5: "✨",
  6: "⭐",
  7: "🦋",
  8: "🌺",
  0: "",
};

function ZenBlocksPuzzle({ onBack }: { onBack: () => void }) {
  const { currentTheme } = useAccessibility();
  const [board, setBoard] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const shuffleBoard = () => {
    let current = [...ZEN_SOLVED];
    let emptyIndex = 8;

    for (let i = 0; i < 40; i++) {
      const validNeighbors: number[] = [];
      const row = Math.floor(emptyIndex / 3);
      const col = emptyIndex % 3;

      if (row > 0) validNeighbors.push(emptyIndex - 3);
      if (row < 2) validNeighbors.push(emptyIndex + 3);
      if (col > 0) validNeighbors.push(emptyIndex - 1);
      if (col < 2) validNeighbors.push(emptyIndex + 1);

      const chosen = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      current[emptyIndex] = current[chosen];
      current[chosen] = 0;
      emptyIndex = chosen;
    }

    setBoard(current);
    setMoves(0);
    setIsWon(false);
    audioSynth?.playPopSound(420);
  };

  useEffect(() => {
    shuffleBoard();
  }, []);

  const moveTile = (index: number) => {
    if (isWon || board[index] === 0) return;

    const emptyIndex = board.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newBoard = [...board];
      newBoard[emptyIndex] = newBoard[index];
      newBoard[index] = 0;

      setBoard(newBoard);
      setMoves((m) => m + 1);
      audioSynth?.playPopSound(500 + index * 25);

      if (JSON.stringify(newBoard) === JSON.stringify(ZEN_SOLVED)) {
        setIsWon(true);
        audioSynth?.playPopSound(880);
        confetti({ particleCount: 35, spread: 65 });
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      {/* Header */}
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
        <span className="text-xs" style={{ color: "rgba(240, 232, 255, 0.7)" }}>
          Moves: <strong style={{ color: "#f5d76e" }}>{moves}</strong>
        </span>
      </div>

      {/* Title & Subtitle (Exact Figma Match) */}
      <h1
        className="font-serif text-2xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 16px rgba(245, 215, 110, 0.35)",
        }}
      >
        Zen Blocks
      </h1>
      <p className="text-xs text-purple-200/70 mb-3 text-center">
        Slide tiles into numerical order 1 through 8
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center mb-5">
        <SparkleDivider />
      </div>

      {/* 3x3 Grid */}
      <div
        className="grid grid-cols-3 gap-2.5 p-3 rounded-3xl w-full max-w-[270px] aspect-square mb-4 select-none"
        style={{
          background: currentTheme.cardBg,
          border: `1.5px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${currentTheme.glow}`,
        }}
      >
        {board.map((tile, idx) => {
          if (tile === 0) {
            return (
              <div
                key={idx}
                className="rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: `1.5px dashed ${currentTheme.cardBorder}`,
                }}
              />
            );
          }

          const isCorrect = tile === idx + 1;

          return (
            <button
              key={idx}
              onClick={() => moveTile(idx)}
              className="rounded-2xl flex flex-col items-center justify-center font-bold transition-all active:scale-95 cursor-pointer shadow-md"
              style={{
                background: isCorrect
                  ? currentTheme.toggleGradient
                  : "rgba(255, 255, 255, 0.07)",
                border: isCorrect
                  ? `1.5px solid ${currentTheme.borderStrong}`
                  : `1px solid ${currentTheme.cardBorder}`,
                boxShadow: isCorrect ? `0 0 14px ${currentTheme.glow}` : "none",
              }}
            >
              <span className="text-xl">{ZEN_EMOJIS[tile]}</span>
              <span
                className="text-[10px] mt-0.5"
                style={{ color: isCorrect ? "#ffffff" : "rgba(240, 232, 255, 0.75)" }}
              >
                {tile}
              </span>
            </button>
          );
        })}
      </div>

      {isWon ? (
        <div
          className="w-full rounded-3xl p-4 text-center animate-in fade-in zoom-in duration-300 shadow-xl"
          style={{
            background: currentTheme.cardBg,
            border: `1.5px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${currentTheme.glow}`,
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-base font-bold text-amber-300 mb-1">
            <Trophy size={18} /> Zen Mandala Complete!
          </div>
          <p className="text-xs text-white/80 mb-3">
            You aligned the tiles in <strong>{moves}</strong> mindful moves. 🌸
          </p>
          <button
            onClick={shuffleBoard}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white transition-all active:scale-95 shadow-lg cursor-pointer"
            style={{
              background: currentTheme.navActiveGradient,
              border: `1px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 18px ${currentTheme.glow}`,
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <button
          onClick={shuffleBoard}
          className="flex items-center justify-center gap-1 text-xs px-4 py-2 rounded-full font-medium transition-all active:scale-95 cursor-pointer text-white/80 hover:text-white"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.cardBorder}`,
          }}
        >
          <RotateCcw size={12} /> Reset Puzzle
        </button>
      )}
    </div>
  );
}

// ==========================================
// 3. PUZZLE: CALM WORD FIND (FIGMA EXACT 9x9 GRID & 13 WORDS)
// ==========================================
const FIGMA_WORDS_13 = [
  "PEACE",
  "CALM",
  "JOY",
  "HEAL",
  "BREATHE",
  "REST",
  "GRACE",
  "SERENE",
  "TRUST",
  "LOVE",
  "SOFT",
  "WARM",
  "MINDFUL",
];

const FIGMA_GRID_9X9 = [
  ["P", "E", "A", "C", "E", "L", "O", "V", "E"],
  ["C", "A", "L", "M", "J", "O", "Y", "H", "O"],
  ["H", "E", "A", "L", "I", "N", "G", "R", "P"],
  ["B", "R", "E", "A", "T", "H", "E", "E", "E"],
  ["R", "E", "S", "T", "F", "U", "L", "A", "S"],
  ["G", "R", "A", "C", "E", "S", "O", "F", "T"],
  ["M", "I", "N", "D", "F", "U", "L", "T", "R"],
  ["S", "E", "R", "E", "N", "E", "A", "H", "U"],
  ["T", "R", "U", "S", "T", "W", "A", "R", "M"],
];

const WORD_COORDS_13: Record<string, [number, number][]> = {
  PEACE: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  LOVE: [[0, 5], [0, 6], [0, 7], [0, 8]],
  CALM: [[1, 0], [1, 1], [1, 2], [1, 3]],
  JOY: [[1, 4], [1, 5], [1, 6]],
  HEAL: [[2, 0], [2, 1], [2, 2], [2, 3]],
  BREATHE: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6]],
  REST: [[4, 0], [4, 1], [4, 2], [4, 3]],
  GRACE: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4]],
  SOFT: [[5, 5], [5, 6], [5, 7], [5, 8]],
  MINDFUL: [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]],
  SERENE: [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  TRUST: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4]],
  WARM: [[8, 5], [8, 6], [8, 7], [8, 8]],
};

function CalmWordFind({ onBack }: { onBack: () => void }) {
  const { currentTheme } = useAccessibility();
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);

  const handleCellClick = (r: number, c: number) => {
    const isAlreadySelected = selectedCells.some(([sr, sc]) => sr === r && sc === c);
    let newSelected: [number, number][];

    if (isAlreadySelected) {
      // Toggle off
      newSelected = selectedCells.filter(([sr, sc]) => !(sr === r && sc === c));
    } else {
      newSelected = [...selectedCells, [r, c]];
      audioSynth?.playPopSound(480 + newSelected.length * 20);
    }
    setSelectedCells(newSelected);

    // Check if current selected letters form any of the 13 words
    const spelled = newSelected.map(([sr, sc]) => FIGMA_GRID_9X9[sr][sc]).join("");

    FIGMA_WORDS_13.forEach((word) => {
      if (foundWords.includes(word)) return;
      const targetCoords = WORD_COORDS_13[word];

      // Check exact coordinates match OR exact string match with matching count
      const isCoordMatch =
        targetCoords &&
        targetCoords.length === newSelected.length &&
        targetCoords.every(([tr, tc]) => newSelected.some(([sr, sc]) => sr === tr && sc === tc));

      const isSpelledMatch = spelled === word || spelled === word.split("").reverse().join("");

      if (isCoordMatch || isSpelledMatch) {
        setFoundWords((f) => [...f, word]);
        setSelectedCells([]);
        audioSynth?.playPopSound(820);
        confetti({ particleCount: 30, spread: 60 });
      }
    });
  };

  const isCellFound = (r: number, c: number) => {
    return foundWords.some((word) =>
      WORD_COORDS_13[word]?.some(([wr, wc]) => wr === r && wc === c)
    );
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some(([sr, sc]) => sr === r && sc === c);
  };

  const allFound = foundWords.length === FIGMA_WORDS_13.length;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-20">
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
        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-300">
          <span className="w-4 h-4 rounded-md bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">
            abc
          </span>
          <span>{foundWords.length}/13 found</span>
        </div>
      </div>

      {/* Subtitle Instruction (Exact Figma Match) */}
      <p className="text-[11px] sm:text-xs text-purple-200/60 mb-3 text-center">
        Tap letters to spell words, tap last letter to confirm
      </p>

      {/* 9x9 Word Grid (Exact Figma Match) */}
      <div
        className="grid grid-cols-9 gap-1 sm:gap-1.5 p-3 rounded-3xl w-full max-w-[340px] aspect-square mb-4 select-none"
        style={{
          background: currentTheme.cardBg,
          border: `1.5px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${currentTheme.glow}`,
        }}
      >
        {FIGMA_GRID_9X9.map((row, r) =>
          row.map((letter, c) => {
            const found = isCellFound(r, c);
            const selected = isCellSelected(r, c);

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className="rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all active:scale-90 cursor-pointer"
                style={{
                  background: found
                    ? "linear-gradient(135deg, rgba(126, 200, 160, 0.45), rgba(96, 165, 250, 0.45))"
                    : selected
                    ? currentTheme.navActiveGradient
                    : "rgba(255, 255, 255, 0.04)",
                  border: found
                    ? "1.5px solid #7ec8a0"
                    : selected
                    ? "1.5px solid #ffffff"
                    : `1px solid ${currentTheme.cardBorder}`,
                  color: found ? "#7ec8a0" : selected ? "#ffffff" : "rgba(240, 232, 255, 0.85)",
                  boxShadow: selected
                    ? `0 0 12px ${currentTheme.glow}`
                    : found
                    ? "0 0 8px rgba(126, 200, 160, 0.4)"
                    : "none",
                }}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      {/* Target Word Badges (13 words, Exact Figma layout) */}
      <div className="flex flex-wrap gap-1.5 justify-center max-w-sm mb-4 px-1">
        {FIGMA_WORDS_13.map((w) => {
          const found = foundWords.includes(w);
          return (
            <span
              key={w}
              className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-full font-semibold transition-all select-none"
              style={{
                background: found ? "rgba(126, 200, 160, 0.22)" : "rgba(255, 255, 255, 0.06)",
                border: `1px solid ${found ? "rgba(126, 200, 160, 0.55)" : "rgba(180, 120, 255, 0.2)"}`,
                color: found ? "#7ec8a0" : "rgba(240, 232, 255, 0.65)",
                textDecoration: found ? "line-through" : "none",
              }}
            >
              {found && <Check size={11} />}
              {w}
            </span>
          );
        })}
      </div>

      {/* Win Celebration */}
      {allFound && (
        <div
          className="w-full rounded-3xl p-4 text-center mt-2 animate-in fade-in zoom-in duration-300 shadow-xl"
          style={{
            background: "linear-gradient(135deg, rgba(201, 162, 39, 0.35), rgba(124, 58, 237, 0.45))",
            border: "1.5px solid #f5d76e",
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-base font-bold text-amber-300 mb-1">
            <Trophy size={18} /> All 13 Mindful Words Discovered!
          </div>
          <p className="text-xs text-purple-100 mb-3">
            Your mind is calm, centered, and deeply present. 🌸
          </p>
          <button
            onClick={() => {
              setFoundWords([]);
              setSelectedCells([]);
            }}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white transition-all active:scale-95 shadow-lg cursor-pointer"
            style={{
              background: currentTheme.navActiveGradient,
              border: `1px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 18px ${currentTheme.glow}`,
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
// 4. PUZZLE: PATTERN MEMORY (FIGMA EXACT 3x2 GRID & LEVELS)
// ==========================================
const MEMORY_PADS = [
  { id: 0, idleBg: "rgba(59, 28, 96, 0.6)", activeColor: "#a855f7", borderColor: "rgba(168, 85, 247, 0.45)", freq: 440 },
  { id: 1, idleBg: "rgba(30, 38, 92, 0.6)", activeColor: "#3b82f6", borderColor: "rgba(59, 130, 246, 0.45)", freq: 494 },
  { id: 2, idleBg: "rgba(30, 41, 59, 0.6)", activeColor: "#14b8a6", borderColor: "rgba(20, 184, 166, 0.45)", freq: 554 },
  { id: 3, idleBg: "rgba(58, 32, 50, 0.6)", activeColor: "#f59e0b", borderColor: "rgba(245, 158, 11, 0.45)", freq: 622 },
  { id: 4, idleBg: "rgba(76, 23, 54, 0.6)", activeColor: "#ec4899", borderColor: "rgba(236, 72, 153, 0.45)", freq: 698 },
  { id: 5, idleBg: "rgba(40, 35, 96, 0.6)", activeColor: "#818cf8", borderColor: "rgba(129, 140, 248, 0.45)", freq: 784 },
];

function PatternMemory({ onBack }: { onBack: () => void }) {
  const { currentTheme } = useAccessibility();
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isDemonstrating, setIsDemonstrating] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState("Press Start to begin watching the sequence");

  const replaySequence = (seq: number[]) => {
    setIsGameOver(false);
    setIsDemonstrating(true);
    setStatusMsg("Watch, then repeat the sequence");

    seq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        audioSynth?.playPopSound(MEMORY_PADS[padId].freq);

        setTimeout(() => {
          setActivePad(null);
          if (index === seq.length - 1) {
            setTimeout(() => {
              setIsDemonstrating(false);
              setStatusMsg(`Your turn — tap ${seq.length} more`);
            }, 300);
          }
        }, 350);
      }, (index + 1) * 650);
    });
  };

  const startLevel = useCallback((lvl: number) => {
    setLevel(lvl);
    setUserStep(0);
    setIsGameOver(false);
    const seqLength = lvl + 2;
    const newSeq = Array.from({ length: seqLength }, () => Math.floor(Math.random() * 6));
    setSequence(newSeq);

    setIsDemonstrating(true);
    setStatusMsg("Watch, then repeat the sequence");

    newSeq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        audioSynth?.playPopSound(MEMORY_PADS[padId].freq);

        setTimeout(() => {
          setActivePad(null);
          if (index === newSeq.length - 1) {
            setTimeout(() => {
              setIsDemonstrating(false);
              setStatusMsg(`Your turn — tap ${newSeq.length} more`);
            }, 300);
          }
        }, 350);
      }, (index + 1) * 650);
    });
  }, []);

  const handlePadClick = (id: number) => {
    if (!hasStarted || isGameOver || isDemonstrating || sequence.length === 0) return;

    setActivePad(id);
    audioSynth?.playPopSound(MEMORY_PADS[id].freq);
    setTimeout(() => setActivePad(null), 250);

    if (sequence[userStep] === id) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        // Level Won
        setStatusMsg(`✨ Level ${level} Complete!`);
        confetti({ particleCount: 30, spread: 60 });
        audioSynth?.playPopSound(880);

        setTimeout(() => {
          startLevel(level + 1);
        }, 1200);
      } else {
        setStatusMsg(`Your turn — tap ${sequence.length - nextStep} more`);
      }
    } else {
      // Mistake - Do NOT auto-restart, prompt Try Again button
      setIsGameOver(true);
      setStatusMsg(`Pattern missed — Reached Level ${level}`);
      audioSynth?.playPopSound(240);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16">
      {/* Header Row (Exact Figma Match) */}
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
        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-300">
          <span className="text-sm">🧠</span>
          <span>Level {level}</span>
        </div>
      </div>

      {/* Title & Subtitle (Exact Figma Match) */}
      <h1
        className="font-serif text-2xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 16px rgba(245, 215, 110, 0.35)",
        }}
      >
        Pattern Memory
      </h1>
      <p className="text-xs text-purple-200/70 mb-3 text-center">
        Watch, then repeat the sequence
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center mb-6">
        <SparkleDivider />
      </div>

      {/* 3x2 Grid of 6 Pads (Exact Figma Match) */}
      <div className="grid grid-cols-3 gap-3 p-2 w-full max-w-[280px] mx-auto select-none my-2">
        {MEMORY_PADS.map((pad) => {
          const isActive = activePad === pad.id;

          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={!hasStarted || isGameOver || isDemonstrating}
              className="w-20 h-20 rounded-3xl transition-all duration-150 cursor-pointer relative select-none disabled:cursor-default"
              style={{
                background: isActive ? pad.activeColor : pad.idleBg,
                border: isActive
                  ? "2px solid #ffffff"
                  : `1.5px solid ${pad.borderColor}`,
                boxShadow: isActive
                  ? `0 0 28px ${pad.activeColor}, 0 0 10px #ffffff`
                  : "0 4px 14px rgba(0, 0, 0, 0.35)",
                transform: isActive ? "scale(1.06)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      {/* Status Instruction (Exact Figma Match) */}
      <p className="text-xs font-medium text-[#d982b5] mt-4 mb-2 text-center">
        {statusMsg}
      </p>

      {/* Start / Try Again / Progress Dots */}
      {!hasStarted ? (
        <button
          onClick={() => {
            setHasStarted(true);
            startLevel(1);
          }}
          className="mt-3 px-8 py-3 rounded-full text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shadow-xl flex items-center gap-1.5"
          style={{
            background: currentTheme.navActiveGradient,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 4px 20px ${currentTheme.glow}`,
          }}
        >
          <span>▶</span>
          <span>Start Pattern</span>
        </button>
      ) : isGameOver ? (
        <button
          onClick={() => {
            setUserStep(0);
            replaySequence(sequence);
          }}
          className="mt-3 px-8 py-3 rounded-full text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shadow-xl flex items-center gap-1.5 animate-in fade-in zoom-in duration-200"
          style={{
            background: currentTheme.navActiveGradient,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 4px 20px ${currentTheme.glow}`,
          }}
        >
          <RotateCcw size={13} />
          <span>Try Again</span>
        </button>
      ) : (
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < userStep
                  ? "bg-purple-300 scale-125 shadow-[0_0_8px_#c084fc]"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. PUZZLE: MINDFUL MAZE (HARD)
// ==========================================
function MindfulMaze({ onBack }: { onBack: () => void }) {
  const { currentTheme } = useAccessibility();
  const mazeGrid = [
    [0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0],
  ];
  const goal = { r: 5, c: 5 };
  const [player, setPlayer] = useState({ r: 0, c: 0 });
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const isMovingRef = useRef(false);

  const resetMaze = () => {
    setPlayer({ r: 0, c: 0 });
    setMoves(0);
    setIsWon(false);
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
      if (nr >= 0 && nr < 6 && nc >= 0 && nc < 6 && mazeGrid[nr][nc] === 0) {
        setMoves((m) => m + 1);
        audioSynth?.playPopSound(520 + (nr + nc) * 30);
        if (nr === goal.r && nc === goal.c) {
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

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <button
          onClick={onBack}
          className="text-xs px-3.5 py-1.5 rounded-full transition-all hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          style={{
            background: currentTheme.cardBg,
            color: "rgba(240, 232, 255, 0.8)",
            border: `1px solid ${currentTheme.cardBorder}`,
          }}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <span
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: currentTheme.color }}
        >
          <span>🌀</span>
          <span>Mindful Maze</span>
        </span>
      </div>

      {/* Title & Subtitle (Exact Figma Match) */}
      <h1
        className="font-serif text-2xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 16px rgba(245, 215, 110, 0.35)",
        }}
      >
        Mindful Maze
      </h1>
      <p className="text-xs text-purple-200/70 mb-3 text-center">
        Navigate the maze one breath at a time
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center mb-5">
        <SparkleDivider />
      </div>

      {/* Mini Legend (Path vs Wall) */}
      <div className="flex items-center justify-center gap-5 text-[11px] mb-2.5 font-medium">
        <div className="flex items-center gap-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full inline-block"
            style={{
              background: `radial-gradient(circle, ${currentTheme.color}55 0%, ${currentTheme.cardBg} 100%)`,
              border: `1.5px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 0 8px ${currentTheme.glow}`,
            }}
          />
          <span style={{ color: "rgba(240, 232, 255, 0.9)" }}>Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full inline-block opacity-45"
            style={{
              background: "rgba(8, 5, 16, 0.95)",
              border: "1.5px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)",
            }}
          />
          <span style={{ color: "rgba(240, 232, 255, 0.45)" }}>Wall (Blocked)</span>
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-6 grid-rows-6 gap-1.5 p-2.5 rounded-3xl w-full max-w-[260px] aspect-square mb-3.5 select-none shadow-2xl overflow-hidden"
        style={{
          background: currentTheme.cardBg,
          border: isWon
            ? "2px solid #facc15"
            : `1.5px solid ${currentTheme.borderStrong}`,
          boxShadow: isWon
            ? "0 0 32px rgba(250, 204, 21, 0.4), 0 8px 30px rgba(0, 0, 0, 0.6)"
            : `0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${currentTheme.glow}`,
        }}
      >
        {mazeGrid.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = player.r === r && player.c === c;
            const isGoal = goal.r === r && goal.c === c;
            const isWall = cell === 1;

            return (
              <div
                key={`${r}-${c}`}
                className="w-full h-full rounded-full flex items-center justify-center relative transition-all min-w-0 min-h-0 aspect-square overflow-hidden"
                style={{
                  background: isWall
                    ? "rgba(8, 5, 16, 0.95)"
                    : `radial-gradient(circle, ${currentTheme.color}35 0%, ${currentTheme.cardBg} 100%)`,
                  border: isWall
                    ? "1.5px solid rgba(255, 255, 255, 0.08)"
                    : `1.5px solid ${currentTheme.borderStrong}`,
                  boxShadow: isWall
                    ? "inset 0 3px 6px rgba(0, 0, 0, 0.85)"
                    : `0 0 10px ${currentTheme.glow}, inset 0 0 6px ${currentTheme.color}25`,
                  opacity: isWall ? 0.35 : 1,
                }}
              >
                {isWall ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                ) : isPlayer ? (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 animate-in zoom-in relative z-20"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${currentTheme.color} 60%, ${currentTheme.borderStrong} 100%)`,
                      boxShadow: `0 0 18px ${currentTheme.color}, 0 0 6px #ffffff`,
                      border: "2px solid #ffffff",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                  </div>
                ) : isGoal ? (
                  <span
                    className="text-lg select-none leading-none flex items-center justify-center animate-pulse"
                    style={{
                      filter: "drop-shadow(0 0 10px #facc15) drop-shadow(0 0 4px #ffffff)",
                    }}
                  >
                    ⭐
                  </span>
                ) : (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: currentTheme.color,
                      opacity: 0.45,
                      boxShadow: `0 0 4px ${currentTheme.glow}`,
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {isWon ? (
        <div
          className="flex flex-col items-center text-center w-full max-w-[260px] p-4 rounded-3xl shadow-2xl"
          style={{
            background: currentTheme.cardBg,
            border: `1.5px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${currentTheme.glow}`,
          }}
        >
          <span className="text-2xl mb-1 block animate-bounce">🌟</span>
          <p className="text-sm font-bold mb-1" style={{ color: currentTheme.color }}>
            Exit reached in {moves} moves!
          </p>
          <button
            onClick={resetMaze}
            className="mt-2 py-2 px-5 rounded-full text-xs font-bold text-white shadow-lg cursor-pointer"
            style={{
              background: currentTheme.navActiveGradient,
              border: `1px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 20px ${currentTheme.glow}`,
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        /* D-Pad 3x3 Controller Grid */
        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-auto max-w-[190px] sm:max-w-[220px] items-center justify-items-center select-none my-1">
          {/* Row 1: Up Arrow */}
          <div />
          <button
            onClick={() => move(-1, 0)}
            aria-label="Move Up"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: currentTheme.cardBg,
              color: currentTheme.color,
              border: `1.5px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 14px ${currentTheme.glow}`,
            }}
          >
            <ArrowUp size={22} className="stroke-[2.5]" />
          </button>
          <div />

          {/* Row 2: Left Arrow, Reset, Right Arrow */}
          <button
            onClick={() => move(0, -1)}
            aria-label="Move Left"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: currentTheme.cardBg,
              color: currentTheme.color,
              border: `1.5px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 14px ${currentTheme.glow}`,
            }}
          >
            <ArrowLeft size={22} className="stroke-[2.5]" />
          </button>

          <button
            onClick={resetMaze}
            aria-label="Reset Maze"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer hover:bg-white/10"
            style={{
              background: currentTheme.cardBg,
              color: "rgba(240, 232, 255, 0.8)",
              border: `1px solid ${currentTheme.cardBorder}`,
            }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={() => move(0, 1)}
            aria-label="Move Right"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: currentTheme.cardBg,
              color: currentTheme.color,
              border: `1.5px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 14px ${currentTheme.glow}`,
            }}
          >
            <ArrowRight size={22} className="stroke-[2.5]" />
          </button>

          {/* Row 3: Down Arrow */}
          <div />
          <button
            onClick={() => move(1, 0)}
            aria-label="Move Down"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-lg active:shadow-sm"
            style={{
              background: currentTheme.cardBg,
              color: currentTheme.color,
              border: `1.5px solid ${currentTheme.borderStrong}`,
              boxShadow: `0 4px 14px ${currentTheme.glow}`,
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
// 6. PUZZLE: MANDALA BUILDER (EXACT FIGMA 49-SEGMENT MANDALA WHEEL)
// ==========================================
const MANDALA_PALETTE_8 = [
  "#7c3aed", // 1. Deep Violet
  "#c084fc", // 2. Soft Orchid
  "#60a5fa", // 3. Sky Blue
  "#7ec8a0", // 4. Mint Green
  "#facc15", // 5. Golden Yellow
  "#fb923c", // 6. Vibrant Orange
  "#f472b6", // 7. Rose Pink
  "#a78bfa", // 8. Soft Periwinkle
];

const MANDALA_RINGS = [
  { inner: 18, outer: 46 },
  { inner: 46, outer: 76 },
  { inner: 76, outer: 106 },
  { inner: 106, outer: 135 },
];

function getSegmentPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngleDeg: number,
  endAngleDeg: number
) {
  const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
  const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

  const x1 = cx + rInner * Math.cos(startRad);
  const y1 = cy + rInner * Math.sin(startRad);
  const x2 = cx + rOuter * Math.cos(startRad);
  const y2 = cy + rOuter * Math.sin(startRad);

  const x3 = cx + rOuter * Math.cos(endRad);
  const y3 = cy + rOuter * Math.sin(endRad);
  const x4 = cx + rInner * Math.cos(endRad);
  const y4 = cy + rInner * Math.sin(endRad);

  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `M ${x1} ${y1} L ${x2} ${y2} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x1} ${y1} Z`;
}

function MandalaBuilder({ onBack }: { onBack: () => void }) {
  const [selectedColor, setSelectedColor] = useState(MANDALA_PALETTE_8[0]); // Default: Violet #7c3aed
  const [segments, setSegments] = useState<Record<string, string>>({});

  const handleSegmentClick = (ringIdx: number, sectorIdx: number) => {
    const key = `${ringIdx}-${sectorIdx}`;
    setSegments((prev) => ({
      ...prev,
      [key]: selectedColor,
    }));
    audioSynth?.playPopSound(440 + ringIdx * 80 + sectorIdx * 15);
  };

  const handleClear = () => {
    setSegments({});
    audioSynth?.playPopSound(380);
  };

  const handleRandom = () => {
    const newSegs: Record<string, string> = {};
    const chosenHub = MANDALA_PALETTE_8[Math.floor(Math.random() * MANDALA_PALETTE_8.length)];
    setSelectedColor(chosenHub);

    MANDALA_RINGS.forEach((_, rIdx) => {
      // Pick 1 or 2 harmonious colors for this ring
      const ringColor1 = MANDALA_PALETTE_8[Math.floor(Math.random() * MANDALA_PALETTE_8.length)];
      const ringColor2 = MANDALA_PALETTE_8[Math.floor(Math.random() * MANDALA_PALETTE_8.length)];

      for (let sIdx = 0; sIdx < 12; sIdx++) {
        newSegs[`${rIdx}-${sIdx}`] = sIdx % 2 === 0 ? ringColor1 : ringColor2;
      }
    });

    setSegments(newSegs);
    audioSynth?.playPopSound(750);
    confetti({ particleCount: 30, spread: 60 });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16">
      {/* Header Row (Exact Figma Match) */}
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
        <span className="text-xs font-semibold text-purple-200 flex items-center gap-1">
          <span>💜</span>
          <span>Mandala Builder</span>
        </span>
      </div>

      {/* Title & Subtitle (Exact Figma Match) */}
      <h1
        className="font-serif text-2xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 16px rgba(245, 215, 110, 0.35)",
        }}
      >
        Mandala Builder
      </h1>
      <p className="text-xs text-purple-200/70 mb-3 text-center">
        Tap segments to paint your mandala
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center mb-5">
        <SparkleDivider />
      </div>

      {/* Circular Segmented Mandala Grid Wheel (Exact Figma Match) */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full rounded-full shadow-2xl filter drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] select-none"
          style={{
            background: "radial-gradient(circle at center, #180c35 0%, #0a0518 100%)",
            border: "2px solid rgba(168, 85, 247, 0.35)",
          }}
        >
          {/* 4 Concentric Rings × 12 Slices = 48 Segments */}
          {MANDALA_RINGS.map((ring, rIdx) =>
            Array.from({ length: 12 }, (_, sIdx) => {
              const startAngle = sIdx * 30;
              const endAngle = (sIdx + 1) * 30;
              const pathD = getSegmentPath(150, 150, ring.inner, ring.outer, startAngle, endAngle);
              const color = segments[`${rIdx}-${sIdx}`] || "rgba(22, 11, 48, 0.65)";
              const isPainted = Boolean(segments[`${rIdx}-${sIdx}`]);

              return (
                <path
                  key={`${rIdx}-${sIdx}`}
                  d={pathD}
                  fill={color}
                  stroke="rgba(168, 85, 247, 0.28)"
                  strokeWidth="1.2"
                  onClick={() => handleSegmentClick(rIdx, sIdx)}
                  className="cursor-pointer transition-all duration-150 hover:brightness-135 active:scale-95"
                  style={{
                    filter: isPainted ? "drop-shadow(0 0 4px rgba(255,255,255,0.15))" : "none",
                  }}
                />
              );
            })
          )}

          {/* Center Hub Dot (Filled with currently selected color) */}
          <circle
            cx="150"
            cy="150"
            r="18"
            fill={selectedColor}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.5"
            className="transition-all duration-200"
            style={{
              filter: `drop-shadow(0 0 10px ${selectedColor})`,
            }}
          />
        </svg>
      </div>

      {/* 8 Color Swatches Palette (Exact Figma Match) */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-4 px-2">
        {MANDALA_PALETTE_8.map((c) => {
          const isSelected = selectedColor === c;

          return (
            <button
              key={c}
              onClick={() => {
                setSelectedColor(c);
                audioSynth?.playPopSound(500);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 cursor-pointer relative select-none"
              style={{
                backgroundColor: c,
                transform: isSelected ? "scale(1.18)" : "scale(1)",
                border: isSelected ? "2px solid #ffffff" : "1.5px solid rgba(255, 255, 255, 0.15)",
                boxShadow: isSelected
                  ? `0 0 16px ${c}, 0 0 8px #ffffff`
                  : "0 2px 8px rgba(0, 0, 0, 0.4)",
              }}
            />
          );
        })}
      </div>

      {/* Action Buttons: Clear and Random (Exact Figma Match) */}
      <div className="flex items-center justify-center gap-3 w-full max-w-xs mt-1">
        <button
          onClick={handleClear}
          className="flex-1 py-3 px-6 rounded-full text-xs font-semibold text-purple-200/90 transition-all active:scale-95 cursor-pointer text-center hover:text-white"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(180, 120, 255, 0.25)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
          }}
        >
          Clear
        </button>
        <button
          onClick={handleRandom}
          className="flex-1 py-3 px-6 rounded-full text-xs font-semibold text-purple-200/90 transition-all active:scale-95 cursor-pointer text-center hover:text-white"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(180, 120, 255, 0.25)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
          }}
        >
          Random
        </button>
      </div>
    </div>
  );
}

// ==========================================
// MAIN PUZZLES DASHBOARD (EXACT FIGMA 6 PUZZLES & FILTERS)
// ==========================================
export const PuzzlesScreen: React.FC = () => {
  const { currentTheme } = useAccessibility();
  const [activePuzzle, setActivePuzzle] = useState<number | null>(null);
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  const PUZZLES = [
    {
      id: 0,
      title: "Color Harmony",
      desc: "Arrange swatches into a gradient",
      icon: (
        <div
          className="w-10 h-10 rounded-full shadow-lg shrink-0"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${currentTheme.color} 0%, ${currentTheme.borderStrong} 65%, #0d0a1e 100%)`,
            boxShadow: `0 0 16px ${currentTheme.glow}, inset 0 2px 4px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ),
      difficulty: "Easy",
    },
    {
      id: 1,
      title: "Zen Blocks",
      desc: "Slide tiles into the correct order",
      icon: (
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]">
            🌿
          </span>
        </div>
      ),
      difficulty: "Easy",
    },
    {
      id: 2,
      title: "Calm Word Find",
      desc: "Find 13 peaceful words in the grid",
      icon: (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-lg tracking-tight"
          style={{
            background: "linear-gradient(135deg, #38bdf8, #2563eb)",
            boxShadow: "0 0 16px rgba(56, 189, 248, 0.5)",
          }}
        >
          abc
        </div>
      ),
      difficulty: "Medium",
    },
    {
      id: 3,
      title: "Pattern Memory",
      desc: "Watch the colors, then repeat the order",
      icon: (
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(244,114,182,0.7)]">
            🧠
          </span>
        </div>
      ),
      difficulty: "Medium",
    },
    {
      id: 4,
      title: "Mindful Maze",
      desc: "Navigate the maze one breath at a time",
      icon: (
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <span className="text-3xl text-sky-400 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
            🌀
          </span>
        </div>
      ),
      difficulty: "Hard",
    },
    {
      id: 5,
      title: "Mandala Builder",
      desc: "Paint a symmetrical mandala freely",
      icon: (
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <span className="text-3xl filter drop-shadow-[0_0_14px_rgba(192,132,252,0.7)]">
            💜
          </span>
        </div>
      ),
      difficulty: "Hard",
    },
  ];

  const filteredPuzzles =
    filter === "All"
      ? PUZZLES
      : PUZZLES.filter((p) => p.difficulty === filter);

  if (activePuzzle !== null) {
    return (
      <div className="w-full max-w-md mx-auto py-2 px-2">
        {activePuzzle === 0 && (
          <ColorHarmonyPuzzle onBack={() => setActivePuzzle(null)} />
        )}
        {activePuzzle === 1 && (
          <ZenBlocksPuzzle onBack={() => setActivePuzzle(null)} />
        )}
        {activePuzzle === 2 && (
          <CalmWordFind onBack={() => setActivePuzzle(null)} />
        )}
        {activePuzzle === 3 && (
          <PatternMemory onBack={() => setActivePuzzle(null)} />
        )}
        {activePuzzle === 4 && (
          <MindfulMaze onBack={() => setActivePuzzle(null)} />
        )}
        {activePuzzle === 5 && (
          <MandalaBuilder onBack={() => setActivePuzzle(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 pt-1 pb-24 w-full max-w-md mx-auto select-none">
      {/* Golden Lion Logo (Exact Figma Match) */}
      <div className="mb-2 flex items-center justify-center">
        <CelysLogo size={80} />
      </div>

      {/* Screen Title (Exact Figma Match) */}
      <h1
        className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
        }}
      >
        Puzzles
      </h1>

      {/* Screen Subtitle (Exact Figma Match) */}
      <p className="text-xs text-purple-200/70 mb-3 text-center">
        Gentle challenges for a focused mind
      </p>

      {/* Center Sparkle Divider (✦) */}
      <div className="w-full flex items-center justify-center mb-5">
        <SparkleDivider />
      </div>

      {/* Filter Tabs: All, Easy, Medium, Hard */}
      <div className="flex items-center justify-center gap-2 mb-5 w-full">
        {(["All", "Easy", "Medium", "Hard"] as const).map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: isActive ? currentTheme.toggleGradient : currentTheme.cardBg,
                color: isActive ? "#ffffff" : "rgba(240, 232, 255, 0.75)",
                border: `1px solid ${isActive ? currentTheme.borderStrong : currentTheme.border}`,
                boxShadow: isActive ? `0 2px 12px ${currentTheme.glow}` : "none",
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 1-Column List of Puzzle Cards */}
      <div className="flex flex-col gap-3 w-full">
        {filteredPuzzles.map((puzzle) => (
          <div
            key={puzzle.id}
            onClick={() => setActivePuzzle(puzzle.id)}
            className="w-full rounded-3xl p-4 flex items-center justify-between transition-all select-none cursor-pointer group hover:scale-[1.01]"
            style={{
              background: currentTheme.cardBg,
              border: `1.5px solid ${currentTheme.cardBorder}`,
              boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px ${currentTheme.glow}`,
            }}
          >
            {/* Left: Standalone Floating Icon & Details */}
            <div className="flex items-center gap-3.5 text-left">
              <div className="shrink-0 transition-transform group-hover:scale-110 duration-200">
                {puzzle.icon}
              </div>
              <div>
                <h3
                  className="text-sm font-bold text-white tracking-wide transition-colors"
                  style={{ textShadow: `0 0 12px ${currentTheme.glow}` }}
                >
                  {puzzle.title}
                </h3>
                <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                  {puzzle.desc}
                </p>
              </div>
            </div>

            {/* Right: Badge & Play Button */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  puzzle.difficulty === "Easy"
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : puzzle.difficulty === "Medium"
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                }`}
              >
                {puzzle.difficulty}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePuzzle(puzzle.id);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition-all active:scale-95 flex items-center gap-1 shadow-md cursor-pointer"
                style={{
                  background: currentTheme.navActiveGradient,
                  border: `1px solid ${currentTheme.borderStrong}`,
                  boxShadow: `0 2px 10px ${currentTheme.glow}`,
                }}
              >
                <span>▶</span>
                <span>Play</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzlesScreen;

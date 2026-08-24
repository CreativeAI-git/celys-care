"use client";

import React, { useState } from "react";
import { Sparkles, ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { audioSynth } from "@/lib/audio-synth";
import confetti from "canvas-confetti";

// 1. Mandala Builder
function MandalaBuilder() {
  const [petals, setPetals] = useState<{ id: number; angle: number; color: string }[]>([]);
  const colors = ["#f5d76e", "#c96ccc", "#7c3aed", "#60a5fa", "#34d399", "#f43f5e"];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const addPetals = () => {
    const newItems: { id: number; angle: number; color: string }[] = [];
    const count = 8;
    const offset = (petals.length * 15) % 360;

    for (let i = 0; i < count; i++) {
      newItems.push({
        id: Date.now() + i,
        angle: (i * (360 / count) + offset) % 360,
        color: selectedColor,
      });
    }

    setPetals([...petals, ...newItems]);
    if (typeof window !== "undefined") audioSynth.playPopSound(480 + petals.length * 10);

    if (petals.length >= 24) {
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleClear = () => {
    setPetals([]);
    if (typeof window !== "undefined") audioSynth.playChime(528);
  };

  return (
    <div className="flex flex-col items-center p-2 text-center">
      <h3 className="font-serif font-bold text-base text-white mb-1">Cosmic Mandala Canvas</h3>
      <p className="text-xs text-purple-200/70 mb-3">Choose a color and tap canvas to weave sacred geometry:</p>

      {/* Color picker */}
      <div className="flex gap-2 mb-3">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              selectedColor === c ? "border-white scale-125 shadow-lg" : "border-transparent opacity-70"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Canvas */}
      <div
        onClick={addPetals}
        className="relative w-64 h-64 rounded-full border-2 border-purple-400/30 cosmic-glass flex items-center justify-center cursor-pointer shadow-2xl overflow-hidden mb-4"
      >
        <div className="w-8 h-8 rounded-full border border-amber-300 bg-amber-400/30 animate-pulse z-10" />

        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute origin-bottom w-3 h-14 rounded-full opacity-85 shadow-md"
            style={{
              backgroundColor: p.color,
              transform: `rotate(${p.angle}deg) translateY(-28px)`,
            }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={addPetals} variant="primary" size="sm">
          Add Petal Ring 🌸
        </Button>
        <Button onClick={handleClear} variant="secondary" size="sm">
          Clear Canvas
        </Button>
      </div>
    </div>
  );
}

// 2. Pattern Memory
function PatternMemory() {
  const [sequence, setSequence] = useState<number[]>([0, 2, 1]);
  const [userStep, setUserStep] = useState(0);
  const [score, setScore] = useState(0);

  const colors = ["#f5d76e", "#c96ccc", "#7c3aed", "#60a5fa"];

  const handleTap = (idx: number) => {
    if (typeof window !== "undefined") audioSynth.playPopSound(400 + idx * 80);

    if (sequence[userStep] === idx) {
      if (userStep + 1 === sequence.length) {
        // Success
        setScore((s) => s + 1);
        setUserStep(0);
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSeq);
        confetti({ particleCount: 30, spread: 50 });
      } else {
        setUserStep((s) => s + 1);
      }
    } else {
      // Mistake reset
      setUserStep(0);
      setSequence([0, 2, 1]);
    }
  };

  return (
    <div className="flex flex-col items-center p-2 text-center">
      <h3 className="font-serif font-bold text-base text-white mb-1">Mindful Pattern Recall</h3>
      <p className="text-xs text-purple-200/70 mb-3">Score: <strong className="text-[#f5d76e]">{score}</strong></p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => handleTap(i)}
            className="w-20 h-20 rounded-2xl border-2 border-white/30 shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <p className="text-[11px] text-purple-200/60">
        Step {userStep + 1} of {sequence.length}
      </p>
    </div>
  );
}

export const PuzzlesScreen: React.FC = () => {
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);

  const PUZZLES = [
    {
      id: "mandala",
      title: "Sacred Mandala Builder",
      desc: "Symmetrical kaleidoscope creator for quiet meditative focus.",
      icon: "🌸",
      component: <MandalaBuilder />,
    },
    {
      id: "memory",
      title: "Harmonic Pattern Memory",
      desc: "Gentle rhythmic sequence recall to clear mental clutter.",
      icon: "🧩",
      component: <PatternMemory />,
    },
  ];

  if (activePuzzle) {
    const current = PUZZLES.find((p) => p.id === activePuzzle);
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col py-2 px-2">
        <button
          onClick={() => setActivePuzzle(null)}
          className="flex items-center gap-1 text-xs text-purple-200/70 hover:text-white mb-3"
        >
          <ChevronLeft size={16} /> Back to Puzzles
        </button>
        {current?.component}
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center py-2 px-2 text-center">
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <h2 className="text-xl font-serif font-bold text-white flex items-center gap-1.5">
          Mindful Puzzles <Sparkles size={16} className="text-[#f5d76e]" />
        </h2>
        <Badge variant="gold" className="text-xs">
          Zen Play
        </Badge>
      </div>

      <p className="text-xs text-purple-200/70 mb-4">
        Engaging meditative puzzles to cultivate flow state and presence.
      </p>

      <div className="w-full space-y-2.5">
        {PUZZLES.map((p) => (
          <Card
            key={p.id}
            onClick={() => setActivePuzzle(p.id)}
            className="p-4 flex items-center justify-between cursor-pointer border-purple-400/20 hover:border-[#c96ccc]/50 hover:bg-white/[0.08] transition-all"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <h3 className="font-serif font-bold text-xs text-white">{p.title}</h3>
                <p className="text-[11px] text-purple-200/70">{p.desc}</p>
              </div>
            </div>
            <span className="text-xs text-[#c96ccc] font-medium">Start →</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PuzzlesScreen;

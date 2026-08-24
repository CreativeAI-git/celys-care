"use client";

import React, { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Smartphone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PREVIEWS = [
  {
    title: "Sacred Daily Affirmations",
    tagline: "Cultivate radiant self-worth and unconditional peace.",
    preview: "✦ 'I am deserving of peace, gentleness, and unconditional love.' ✦",
    color: "#c96ccc",
  },
  {
    title: "Empathetic AI Companion",
    tagline: "Always here to hold quiet space and guide soothing breath.",
    preview: "🌸 'Take a slow, deep breath with me. Inhale for 4... hold for 4... exhale for 6.'",
    color: "#7c3aed",
  },
  {
    title: "Guided Meditation Sanctuary",
    tagline: "Procedural soundscapes with 432Hz theta binaural resonance.",
    preview: "🧘 Morning Radiance • Deep Somatic Anxiety Release • Theta Sleep",
    color: "#f5d76e",
  },
  {
    title: "Sensory Bubble Pop & Games",
    tagline: "Tactile regulation for stress and overwhelm de-escalation.",
    preview: "🫧 Bubble Pop • 5-4-3-2-1 Grounding • Color Sort • Gratitude Wheel",
    color: "#34d399",
  },
  {
    title: "Cosmic Soul Constellation",
    tagline: "Map every mindfulness milestone across your personal sky.",
    preview: "✨ Interactive milestone stars & memory anchors.",
    color: "#60a5fa",
  },
];

export const ScreenshotPreview: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const current = PREVIEWS[currentIdx];

  const handleNext = () => setCurrentIdx((c) => (c + 1) % PREVIEWS.length);
  const handlePrev = () => setCurrentIdx((c) => (c - 1 + PREVIEWS.length) % PREVIEWS.length);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center py-2 px-2 text-center">
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <h2 className="text-xl font-serif font-bold text-white flex items-center gap-1.5">
          App Tour & Showcase <Sparkles size={16} className="text-[#f5d76e]" />
        </h2>
        <Badge variant="gold" className="text-xs">
          App Store
        </Badge>
      </div>

      {/* Simulated Device Frame */}
      <div className="w-full rounded-3xl p-5 border-2 border-purple-400/40 cosmic-glass shadow-2xl mb-4 relative overflow-hidden text-left flex flex-col justify-between h-72">
        <div className="flex items-center justify-between">
          <Badge variant="gold" className="text-[10px]">
            {current.title}
          </Badge>
          <div className="flex text-[#f5d76e]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="#f5d76e" />
            ))}
          </div>
        </div>

        <div className="my-auto py-2">
          <p className="text-sm font-serif font-bold text-white mb-2 leading-relaxed">
            {current.tagline}
          </p>
          <div className="p-3 rounded-2xl bg-white/10 border border-purple-400/20 text-xs text-[#f0e8ff] font-serif italic">
            {current.preview}
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-purple-200/50">
          <span>Feature {currentIdx + 1} of {PREVIEWS.length}</span>
          <span className="text-[#f5d76e]">✦ Celys Care Sanctuary ✦</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button onClick={handlePrev} variant="secondary" size="icon" className="w-10 h-10 rounded-full">
          <ChevronLeft size={18} />
        </Button>
        <Button onClick={handleNext} variant="primary" size="pill" className="px-6 h-10 text-xs">
          Next Feature →
        </Button>
        <Button onClick={handleNext} variant="secondary" size="icon" className="w-10 h-10 rounded-full">
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ScreenshotPreview;

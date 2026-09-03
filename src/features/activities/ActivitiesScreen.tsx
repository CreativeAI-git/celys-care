"use client";

import React, { useState, useEffect } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAccessibility } from "@/context/AccessibilityContext";
import { audioSynth } from "@/lib/audio-synth";
import { triggerConfetti as confetti } from "@/lib/confetti";
import { ChevronLeft, Play, Pause } from "lucide-react";

// ==========================================
// DATA TYPES & CONFIGURATION
// ==========================================
export type ActivityTag =
  | "Grounding"
  | "Body"
  | "Reflection"
  | "Creative"
  | "Quick Reset"
  | "Social";

export interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  durationSec: number;
  tag: ActivityTag;
  icon: string;
  tagBg: string;
  tagText: string;
  tagBorder: string;
  steps: string[];
}

const ACTIVITIES_LIST: ActivityItem[] = [
  {
    id: "mindful-walking",
    title: "Mindful Walking",
    desc: "Walk slowly and notice 5 thi...",
    time: "10:00",
    durationSec: 600,
    tag: "Grounding",
    icon: "🚶",
    tagBg: "rgba(52, 211, 153, 0.15)",
    tagText: "#6ee7b7",
    tagBorder: "rgba(52, 211, 153, 0.3)",
    steps: [
      "Find a quiet space to walk — indoors or outdoors",
      "Start walking slowly. No destination needed.",
      "Notice 5 things you can SEE right now",
      "Notice 4 things you can TOUCH or feel",
      "Notice 3 things you can HEAR",
      "Notice 2 things you can SMELL",
      "Notice 1 thing you can TASTE",
      "Take a deep breath. You are fully here. 🌿",
    ],
  },
  {
    id: "gratitude-practice",
    title: "Gratitude Practice",
    desc: "Write down 3 things you are ...",
    time: "5:00",
    durationSec: 300,
    tag: "Reflection",
    icon: "🙏",
    tagBg: "rgba(245, 215, 110, 0.15)",
    tagText: "#f5d76e",
    tagBorder: "rgba(245, 215, 110, 0.3)",
    steps: [
      "Sit comfortably, close your eyes, and take two deep breaths.",
      "Think of one person you're grateful for — picture their smile.",
      "Notice one simple physical comfort right now — a soft seat, warmth.",
      "Acknowledge one personal effort or kindness you showed today.",
      "Hold that gratitude in your chest as you take a slow exhale.",
    ],
  },
  {
    id: "muscle-relaxation",
    title: "Muscle Relaxation",
    desc: "Tense and release each muscle gr...",
    time: "12:00",
    durationSec: 720,
    tag: "Body",
    icon: "💪",
    tagBg: "rgba(167, 139, 250, 0.15)",
    tagText: "#c4b5fd",
    tagBorder: "rgba(167, 139, 250, 0.3)",
    steps: [
      "Sit or lie down comfortably. Close your eyes.",
      "FEET — Tense your toes tightly for 5 seconds… release. Feel the warmth.",
      "CALVES — Flex your calf muscles for 5 seconds… release.",
      "THIGHS — Squeeze your thighs for 5 seconds… release.",
      "STOMACH — Tighten your core for 5 seconds… release.",
      "HANDS — Clench your fists for 5 seconds… release. Open wide.",
      "SHOULDERS — Raise them to your ears for 5 seconds… release.",
      "FACE — Scrunch everything for 5 seconds… release. Smile gently.",
      "Breathe slowly. Notice how calm your body feels. 🌸"
    ],
  },
  {
    id: "cold-water-splash",
    title: "Cold Water Splash",
    desc: "Splash cold water on your f...",
    time: "1:00",
    durationSec: 60,
    tag: "Quick Reset",
    icon: "💧",
    tagBg: "rgba(96, 165, 250, 0.15)",
    tagText: "#93c5fd",
    tagBorder: "rgba(96, 165, 250, 0.3)",
    steps: [
      "Go to a sink or get a bowl of cold water",
      "Take a slow deep breath in",
      "Lean forward and splash cold water on your face 3 times",
      "Or hold your breath and dip your face briefly",
      "The dive reflex slows your heart rate instantly",
      "Dry your face gently. Notice how you feel. 💧",
      "This works for panic attacks and overwhelm in seconds.",
    ],
  },
  {
    id: "creative-drawing",
    title: "Creative Drawing",
    desc: "Doodle freely without judgmen...",
    time: "15:00",
    durationSec: 900,
    tag: "Creative",
    icon: "✏️",
    tagBg: "rgba(251, 146, 60, 0.15)",
    tagText: "#fdba74",
    tagBorder: "rgba(251, 146, 60, 0.3)",
    steps: [
      "Get any pen or pencil and paper",
      "Set a timer for 10–15 minutes",
      "Start drawing — anything. Lines, shapes, patterns.",
      "No rules. No erasing. No judgment.",
      "If you feel stuck, just draw circles or waves",
      "Notice your breathing slow as you draw 🎨",
      "When done, look at what you made with curiosity, not criticism.",


    ],
  },
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding",
    desc: "5-4-3-2-1 sensory grounding...",
    time: "3:00",
    durationSec: 180,
    tag: "Grounding",
    icon: "🌳",
    tagBg: "rgba(52, 211, 153, 0.15)",
    tagText: "#6ee7b7",
    tagBorder: "rgba(52, 211, 153, 0.3)",
    steps: [
      "Look around and mentally name 5 things you can SEE.",
      "Reach out and notice 4 distinct textures you can TOUCH.",
      "Close your eyes and listen for 3 sounds you can HEAR.",
      "Inhale deeply and identify 2 scents you can SMELL.",
      "Notice 1 thing you can TASTE, and anchor yourself in the present.",
    ],
  },
  {
    id: "yoga-stretch",
    title: "Yoga Stretch",
    desc: "3 gentle stretches to release held ...",
    time: "8:00",
    durationSec: 480,
    tag: "Body",
    icon: "🧘",
    tagBg: "rgba(167, 139, 250, 0.15)",
    tagText: "#c4b5fd",
    tagBorder: "rgba(167, 139, 250, 0.3)",
    steps: [
      "NECK ROLL — Slowly roll your chin to your chest, then ear to shoulder. 30 sec each side.",
      "SHOULDER OPENER — Clasp hands behind your back, squeeze shoulder blades, lift arms. Hold 20 sec.",
      "SEATED FORWARD FOLD — Sit on the floor, extend legs, reach toward your feet. Hold 30 sec. Breathe.",
      "CHILD'S POSE — Kneel, lower chest to thighs, arms extended forward. Hold 60 sec. Breathe deeply.",
      "LEGS UP WALL — Lie on your back, lift legs against a wall. Stay 3–5 minutes. Very calming. 🌙",
      "Come back slowly. Notice how your body feels lighter.",
    ],
  },
  {
    id: "connect-someone",
    title: "Connect with Someone",
    desc: "Reach out to someone who lifts y...",
    time: "Any",
    durationSec: 180,
    tag: "Social",
    icon: "📞",
    tagBg: "rgba(244, 114, 182, 0.15)",
    tagText: "#f9a8d4",
    tagBorder: "rgba(244, 114, 182, 0.3)",
    steps: [
      "Think of one person who makes you feel safe",
      "You don't have to explain everything — even a simple message helps",
      'Ideas: "Thinking of you 💜" · "How are you?" · "Can we talk soon?"',
      "If you are not ready to reach out, write them a letter you don't send",
      "Connection is one of the most powerful healers. You deserve it. 🌸",
      "Even reading kind messages from the past can help right now.",
    ],
  },
];

const FILTER_ROWS: string[][] = [
  ["All", "Grounding", "Body", "Reflection"],
  ["Creative", "Quick Reset", "Social"],
];

// ==========================================
// 2. SUB-ACTIVITY: GRATITUDE PRACTICE (EXACT FIGMA 3-PROMPT FLOW)
// ==========================================
function GratitudePracticeFlow({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { currentTheme } = useAccessibility();
  const [seconds, setSeconds] = useState(300); // 5:00
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [g1, setG1] = useState("");
  const [g2, setG2] = useState("");
  const [g3, setG3] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && seconds > 0) {
      timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (isTimerRunning && seconds === 0) {
      setIsTimerRunning(false);
      audioSynth?.playTibetanBowl(528);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerDisplay = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const handleFinish = () => {
    setIsCompleted(true);
    onComplete();
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16 text-center">
        {/* Top Navigation Row (Exact Figma Match) */}
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
          <span className="text-sm font-bold text-[#f5d76e] tracking-wide">{timerDisplay}</span>
        </div>

        {/* Title */}
        <h1
          className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
          style={{
            color: "#f5d76e",
            textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
          }}
        >
          Gratitude Practice
        </h1>

        <div className="w-full flex items-center justify-center my-3">
          <SparkleDivider />
        </div>

        {/* 100% Completed Progress Track */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden mb-8"
          style={{ background: "rgba(255, 255, 255, 0.1)" }}
        >
          <div
            className="h-full rounded-full w-full"
            style={{
              background: currentTheme.toggleGradient,
              boxShadow: `0 0 10px ${currentTheme.glow}`,
            }}
          />
        </div>

        {/* Center Artwork */}
        <div className="flex flex-col items-center justify-center my-6 sm:my-8">
          <span className="text-5xl sm:text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,215,110,0.6)] animate-pulse">
            ✨
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2 tracking-wide">
            Activity complete!
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xs text-center leading-relaxed">
            You showed up for yourself today. That matters. 💜
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 mt-4 rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-xl"
          style={{
            background: currentTheme.navActiveGradient,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 6px 25px ${currentTheme.glow}`,
          }}
        >
          ← Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16 text-center">
      {/* Top Navigation Row (Exact Figma Match) */}
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
        <span className="text-sm font-bold text-[#f5d76e] tracking-wide">{timerDisplay}</span>
      </div>

      {/* Title & Subtitle (Exact Figma Match) */}
      <h1
        className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
        }}
      >
        Gratitude Practice
      </h1>
      <p className="text-xs text-purple-200/80 mb-3 text-center">
        Three things. Right now. Honestly.
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center my-2">
        <SparkleDivider />
      </div>

      {/* Start Timer Pill Button (Exact Figma Match) */}
      <button
        onClick={() => {
          setIsTimerRunning(!isTimerRunning);
          audioSynth?.playPopSound(580);
        }}
        className="w-full py-3.5 mb-4 rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-lg flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)",
          boxShadow: "0 4px 18px rgba(168, 85, 247, 0.35)",
        }}
      >
        {isTimerRunning ? <Pause size={16} /> : <Play size={16} className="fill-white" />}
        <span>{isTimerRunning ? "Pause Timer" : "Start Timer"}</span>
      </button>

      {/* 3 Gratitude Prompt Cards (Exact Figma Match) */}
      <div className="w-full flex flex-col gap-3.5 mb-4 text-left">
        {/* Card 1 */}
        <div
          className="w-full rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(168, 85, 247, 0.22)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span className="text-xs font-semibold text-[#f5d76e] flex items-center gap-1.5 leading-snug">
            <span>✦</span> Gratitude 1 — Something in nature that brings you peace 🌿
          </span>
          <textarea
            rows={2}
            placeholder="I am grateful for..."
            value={g1}
            onChange={(e) => setG1(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-purple-100 placeholder-purple-300/40 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Card 2 */}
        <div
          className="w-full rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(168, 85, 247, 0.22)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span className="text-xs font-semibold text-[#f5d76e] flex items-center gap-1.5 leading-snug">
            <span>✦</span> Gratitude 2 — A person who has supported you 💜
          </span>
          <textarea
            rows={2}
            placeholder="I am grateful for..."
            value={g2}
            onChange={(e) => setG2(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-purple-100 placeholder-purple-300/40 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Card 3 */}
        <div
          className="w-full rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(168, 85, 247, 0.22)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span className="text-xs font-semibold text-[#f5d76e] flex items-center gap-1.5 leading-snug">
            <span>✦</span> Gratitude 3 — Something your body did for you today 💪
          </span>
          <textarea
            rows={2}
            placeholder="I am grateful for..."
            value={g3}
            onChange={(e) => setG3(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-purple-100 placeholder-purple-300/40 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Complete Practice Button (Exact Figma Match) */}
      <button
        onClick={handleFinish}
        className="w-full py-4 rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-xl flex items-center justify-center gap-1.5"
        style={{
          background: currentTheme.navActiveGradient,
          border: `1px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 6px 25px ${currentTheme.glow}`,
        }}
      >
        <span>✦</span>
        <span>Complete Practice</span>
      </button>
    </div>
  );
}

// ==========================================
// 6. SUB-ACTIVITY: 5-4-3-2-1 GROUNDING (EXACT FIGMA 5-SENSES FLOW)
// ==========================================
interface GroundingStepData {
  sense: string;
  emoji: string;
  prompt: string;
  count: number;
  prefix: string;
  nextLabel: string;
}

const GROUNDING_STAGES: GroundingStepData[] = [
  {
    sense: "SEE",
    emoji: "👁️",
    prompt: "Name 5 things you can see right now",
    count: 5,
    prefix: "I see...",
    nextLabel: "Next: TOUCH →",
  },
  {
    sense: "TOUCH",
    emoji: "✋",
    prompt: "Name 4 things you can physically feel",
    count: 4,
    prefix: "I feel/touch...",
    nextLabel: "Next: HEAR →",
  },
  {
    sense: "HEAR",
    emoji: "👂",
    prompt: "Name 3 sounds you can hear",
    count: 3,
    prefix: "I hear...",
    nextLabel: "Next: SMELL →",
  },
  {
    sense: "SMELL",
    emoji: "👃",
    prompt: "Name 2 things you can smell",
    count: 2,
    prefix: "I smell...",
    nextLabel: "Next: TASTE →",
  },
  {
    sense: "TASTE",
    emoji: "👅",
    prompt: "Name 1 thing you can taste",
    count: 1,
    prefix: "I taste...",
    nextLabel: "Complete Grounding ✦",
  },
];

function Grounding54321Flow({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { currentTheme } = useAccessibility();
  const [stageIdx, setStageIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const stage = GROUNDING_STAGES[stageIdx];

  const handleInputChange = (itemIdx: number, val: string) => {
    setInputs((prev) => ({
      ...prev,
      [`${stageIdx}-${itemIdx}`]: val,
    }));
  };

  const handleNext = () => {
    audioSynth?.playPopSound(520 + stageIdx * 40);
    if (stageIdx < GROUNDING_STAGES.length - 1) {
      setStageIdx((s) => s + 1);
    } else {
      setIsCompleted(true);
      onComplete();
    }
  };

  const handlePrev = () => {
    if (stageIdx > 0) {
      setStageIdx((s) => s - 1);
      audioSynth?.playPopSound(420);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16 text-center">
        {/* Top Navigation Row (Exact Figma Match) */}
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
          <span className="text-xl shrink-0">🌳</span>
        </div>

        {/* Title */}
        <h1
          className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
          style={{
            color: "#f5d76e",
            textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
          }}
        >
          5-4-3-2-1 Grounding
        </h1>

        <div className="w-full flex items-center justify-center my-3">
          <SparkleDivider />
        </div>

        {/* 100% Progress Track */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden mb-8"
          style={{ background: "rgba(255, 255, 255, 0.1)" }}
        >
          <div
            className="h-full rounded-full w-full"
            style={{
              background: currentTheme.toggleGradient,
              boxShadow: `0 0 10px ${currentTheme.glow}`,
            }}
          />
        </div>

        {/* Center Artwork */}
        <div className="flex flex-col items-center justify-center my-6 sm:my-8">
          <span className="text-5xl sm:text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,215,110,0.6)] animate-pulse">
            ✨
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2 tracking-wide">
            Activity complete!
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xs text-center leading-relaxed">
            You showed up for yourself today. That matters. 💜
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 mt-4 rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-xl"
          style={{
            background: "linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)",
            boxShadow: "0 6px 25px rgba(168, 85, 247, 0.4)",
          }}
        >
          ← Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16 text-center">
      {/* Top Navigation Row (Exact Figma Match) */}
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
        <span className="text-xl shrink-0">🌳</span>
      </div>

      {/* Title & Subtitle (Exact Figma Match) */}
      <h1
        className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
        }}
      >
        5-4-3-2-1 Grounding
      </h1>
      <p className="text-xs text-purple-200/80 mb-3 text-center">
        Come back to your body, one sense at a time
      </p>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center my-2">
        <SparkleDivider />
      </div>

      {/* Center Sense Card (Exact Figma Match) */}
      <div
        className="w-full rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center min-h-[170px] text-center mb-4 shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(103, 232, 249, 0.25)",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* Eye/Hand/Ear Icon */}
        <span className="text-4xl mb-1 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
          {stage.emoji}
        </span>

        {/* Sense Label */}
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1 mb-1">
          {stage.sense}
        </span>

        {/* Prompt */}
        <p className="text-sm sm:text-base font-bold text-white tracking-wide text-center mb-3">
          {stage.prompt}
        </p>

        {/* 5 Dots Indicator (Exact Figma Match) */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {GROUNDING_STAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === stageIdx
                ? "bg-emerald-400 scale-125 shadow-[0_0_8px_#34d399]"
                : i < stageIdx
                  ? "bg-purple-300/60"
                  : "bg-white/15"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Input Rows (Exact Figma Match) */}
      <div className="w-full flex flex-col gap-2.5 mb-4 text-left">
        {Array.from({ length: stage.count }, (_, i) => {
          const val = inputs[`${stageIdx}-${i}`] || "";
          return (
            <div
              key={i}
              className="w-full rounded-2xl px-4 py-3 flex items-center gap-2 transition-all shadow-sm"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(168, 85, 247, 0.2)",
              }}
            >
              <input
                type="text"
                placeholder={`${i + 1}. ${stage.prefix}`}
                value={val}
                onChange={(e) => handleInputChange(i, e.target.value)}
                className="w-full bg-transparent border-none text-xs text-purple-100 placeholder-purple-300/40 focus:outline-none leading-relaxed"
              />
            </div>
          );
        })}
      </div>

      {/* Action Buttons: Circular Prev & Pill Next (Exact Figma Match) */}
      <div className="flex items-center gap-2.5 w-full max-w-sm mx-auto px-0.5">
        {stageIdx > 0 && (
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full text-base font-semibold text-purple-200/90 transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center hover:text-white"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(180, 120, 255, 0.25)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
            }}
            title="Previous Step"
          >
            ←
          </button>
        )}

        <button
          onClick={handleNext}
          className="flex-1 min-w-0 h-12 rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center shadow-xl px-4"
          style={{
            background: currentTheme.navActiveGradient,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 6px 25px ${currentTheme.glow}`,
          }}
        >
          <span className="truncate">{stage.nextLabel}</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// INTERNAL ACTIVITY DETAIL SCREEN (EXACT FIGMA MATCH)
// ==========================================
function ActivityDetailFlow({
  activity,
  onBack,
  onComplete,
}: {
  activity: ActivityItem;
  onBack: () => void;
  onComplete: () => void;
}) {
  const { currentTheme } = useAccessibility();
  const [currentStep, setCurrentStep] = useState(0);
  const [seconds, setSeconds] = useState(activity.durationSec);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = activity.steps.length;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && seconds > 0) {
      timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (isTimerRunning && seconds === 0) {
      setIsTimerRunning(false);
      audioSynth?.playTibetanBowl(528);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, seconds]);

  const handleNextStep = () => {
    audioSynth?.playPopSound(500 + currentStep * 30);
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsCompleted(true);
      onComplete();
    }
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerDisplay =
    activity.time === "Any"
      ? "Any"
      : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16 text-center">
        {/* Top Navigation Row (Exact Figma Match) */}
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

          {/* Right Controls: Timer Pill (if timed) + Floating Icon */}
          <div className="flex items-center gap-2">
            {activity.time !== "Any" && (
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                style={{
                  background: "rgba(20, 30, 55, 0.8)",
                  border: "1px solid rgba(103, 232, 249, 0.35)",
                  color: "#67e8f9",
                }}
              >
                <Play size={12} className="text-emerald-400 fill-emerald-400" />
                <span>{timerDisplay}</span>
              </div>
            )}
            <span className="text-xl shrink-0">{activity.icon}</span>
          </div>
        </div>

        {/* Title & Gold Aura (Exact Figma Match) */}
        <h1
          className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
          style={{
            color: "#f5d76e",
            textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
          }}
        >
          {activity.title}
        </h1>

        {/* Sparkle Divider */}
        <div className="w-full flex items-center justify-center my-3">
          <SparkleDivider />
        </div>

        {/* 100% Completed Progress Track (Exact Figma Match) */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden mb-8"
          style={{ background: "rgba(255, 255, 255, 0.1)" }}
        >
          <div
            className="h-full rounded-full w-full"
            style={{
              background: currentTheme.toggleGradient,
              boxShadow: `0 0 10px ${currentTheme.glow}`,
            }}
          />
        </div>

        {/* Center Completion Artwork & Text (Exact Figma Match) */}
        <div className="flex flex-col items-center justify-center my-6 sm:my-8">
          <span className="text-5xl sm:text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(245,215,110,0.6)] animate-pulse">
            ✨
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-2 tracking-wide">
            Activity complete!
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xs text-center leading-relaxed">
            You showed up for yourself today. That matters. 💜
          </p>
        </div>

        {/* Back to Activities Action Button (Exact Figma Match) */}
        <button
          onClick={onBack}
          className="w-full py-4 mt-4 rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer shadow-xl"
          style={{
            background: currentTheme.navActiveGradient,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 6px 25px ${currentTheme.glow}`,
          }}
        >
          ← Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none pt-1 pb-16 text-center">
      {/* Top Navigation Row (Exact Figma Match) */}
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

        {/* Right Controls: Timer Pill (if timed: Green when idle/paused, Red when running) + Floating Icon */}
        <div className="flex items-center gap-2">
          {activity.time !== "Any" && (
            <button
              onClick={() => {
                setIsTimerRunning(!isTimerRunning);
                audioSynth?.playPopSound(580);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
              style={{
                background: isTimerRunning ? "rgba(60, 20, 35, 0.85)" : "rgba(16, 40, 35, 0.85)",
                border: isTimerRunning
                  ? "1px solid rgba(244, 63, 94, 0.45)"
                  : "1px solid rgba(52, 211, 153, 0.4)",
                color: isTimerRunning ? "#fca5a5" : "#6ee7b7",
                boxShadow: isTimerRunning
                  ? "0 2px 10px rgba(244, 63, 94, 0.25)"
                  : "0 2px 10px rgba(16, 185, 129, 0.2)",
              }}
            >
              {isTimerRunning ? (
                <Pause size={12} className="text-rose-400 fill-rose-400" />
              ) : (
                <Play size={12} className="text-emerald-400 fill-emerald-400" />
              )}
              <span className="font-mono font-bold">{timerDisplay}</span>
            </button>
          )}
          <span className="text-xl shrink-0">{activity.icon}</span>
        </div>
      </div>

      {/* Title & Gold Aura (Exact Figma Match) */}
      <h1
        className="font-serif text-3xl font-bold mb-1 tracking-wide text-center"
        style={{
          color: "#f5d76e",
          textShadow: "0 0 20px rgba(245, 215, 110, 0.4)",
        }}
      >
        {activity.title}
      </h1>

      {/* Sparkle Divider */}
      <div className="w-full flex items-center justify-center my-3">
        <SparkleDivider />
      </div>

      {/* Horizontal Progress Track (Exact Figma Match) */}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden mb-6"
        style={{ background: "rgba(255, 255, 255, 0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
            background: currentTheme.toggleGradient,
            boxShadow: `0 0 10px ${currentTheme.glow}`,
          }}
        />
      </div>

      {/* Center Step Card (Exact Figma Match) */}
      <div
        className="w-full rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[170px] text-center mb-7 shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(103, 232, 249, 0.22)",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45)",
        }}
      >
        <span className="text-xs font-semibold text-emerald-400/90 tracking-wide mb-3">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <p className="font-serif text-base sm:text-lg text-purple-100/95 leading-relaxed text-center px-1">
          {activity.steps[currentStep]}
        </p>
      </div>

      {/* Action Buttons: Circular Prev & Pill Next (Exact Figma Match) */}
      <div className="flex items-center gap-2.5 w-full max-w-sm mx-auto px-0.5">
        {currentStep > 0 && (
          <button
            onClick={() => {
              setCurrentStep((s) => s - 1);
              audioSynth?.playPopSound(420);
            }}
            className="w-12 h-12 rounded-full text-base font-semibold text-purple-200/90 transition-all active:scale-95 cursor-pointer shrink-0 flex items-center justify-center hover:text-white"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(180, 120, 255, 0.25)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
            }}
            title="Previous Step"
          >
            ←
          </button>
        )}

        <button
          onClick={handleNextStep}
          className="flex-1 min-w-0 h-12 rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center shadow-xl px-4"
          style={{
            background: currentTheme.navActiveGradient,
            border: `1px solid ${currentTheme.borderStrong}`,
            boxShadow: `0 6px 25px ${currentTheme.glow}`,
          }}
        >
          <span className="truncate">{currentStep < totalSteps - 1 ? "Next Step →" : "Complete ✦"}</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// MAIN ACTIVITIES SCREEN (EXACT FIGMA 8 ACTIVITIES)
// ==========================================
export const ActivitiesScreen: React.FC = () => {
  const { currentTheme } = useAccessibility();
  const [done, setDone] = useState<string[]>(["mindful-walking", "connect-someone"]);
  const [activeActivity, setActiveActivity] = useState<ActivityItem | null>(null);
  const [filter, setFilter] = useState("All");

  // Load persisted completed activities from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("celys_activities_done");
      if (saved) {
        setDone(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveDone = (newDone: string[]) => {
    setDone(newDone);
    try {
      localStorage.setItem("celys_activities_done", JSON.stringify(newDone));
    } catch {
      // ignore
    }
  };

  const handleActivityComplete = (id: string) => {
    if (!done.includes(id)) {
      saveDone([...done, id]);
    }
    audioSynth?.playTibetanBowl(528);
    confetti({ particleCount: 40, spread: 65 });
  };

  // Sub-Activity Detail View (Exact Figma Match)
  if (activeActivity !== null) {
    return (
      <div className="w-full max-w-md mx-auto py-2 px-2">
        {activeActivity.id === "gratitude-practice" ? (
          <GratitudePracticeFlow
            onBack={() => setActiveActivity(null)}
            onComplete={() => handleActivityComplete("gratitude-practice")}
          />
        ) : activeActivity.id === "grounding-54321" ? (
          <Grounding54321Flow
            onBack={() => setActiveActivity(null)}
            onComplete={() => handleActivityComplete("grounding-54321")}
          />
        ) : (
          <ActivityDetailFlow
            activity={activeActivity}
            onBack={() => setActiveActivity(null)}
            onComplete={() => handleActivityComplete(activeActivity.id)}
          />
        )}
      </div>
    );
  }

  const filteredActivities =
    filter === "All"
      ? ACTIVITIES_LIST
      : ACTIVITIES_LIST.filter((a) => a.tag === filter);

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
        Activities
      </h1>

      {/* Screen Subtitle (Exact Figma Match) */}
      <p className="text-xs text-purple-200/70 mb-3 text-center">
        Small steps toward feeling better
      </p>

      {/* Center Sparkle Divider (✦) */}
      <div className="w-full flex items-center justify-center mb-5">
        <SparkleDivider />
      </div>

      {/* Today's Progress Card (Exact Figma Match) */}
      <div
        className="w-full rounded-3xl p-4 mb-5 flex flex-col gap-2.5 select-none"
        style={{
          background: currentTheme.cardBg,
          border: `1.5px solid ${currentTheme.cardBorder}`,
          boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px ${currentTheme.glow}`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/80">
            Today&apos;s progress
          </span>
          <span className="text-xs font-bold" style={{ color: "#f5d76e" }}>
            {done.length} / {ACTIVITIES_LIST.length}
          </span>
        </div>
        <div
          className="w-full rounded-full h-2 overflow-hidden"
          style={{ background: "rgba(255, 255, 255, 0.08)" }}
        >
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(done.length / ACTIVITIES_LIST.length) * 100}%`,
              background: currentTheme.toggleGradient,
              boxShadow: `0 0 12px ${currentTheme.glow}`,
            }}
          />
        </div>
      </div>

      {/* Category Filter Pills (2 Rows — Exact Figma Match) */}
      <div className="flex flex-col gap-2 mb-5 w-full items-center">
        {FILTER_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2 flex-wrap justify-center">
            {row.map((t) => {
              const isSelected = filter === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: isSelected ? currentTheme.toggleGradient : currentTheme.cardBg,
                    color: isSelected ? "#ffffff" : "rgba(240, 232, 255, 0.75)",
                    border: `1px solid ${isSelected ? currentTheme.borderStrong : currentTheme.border}`,
                    boxShadow: isSelected ? `0 2px 12px ${currentTheme.glow}` : "none",
                    transform: isSelected ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 8 Activity Cards (Exact Figma Match) */}
      <div className="flex flex-col gap-3 w-full">
        {filteredActivities.map((a) => {
          const isDone = done.includes(a.id);

          return (
            <div
              key={a.id}
              onClick={() => setActiveActivity(a)}
              className="w-full rounded-3xl p-4 flex items-center justify-between transition-all select-none cursor-pointer group hover:scale-[1.01]"
              style={{
                background: currentTheme.cardBg,
                border: isDone
                  ? "1.5px solid rgba(52, 211, 153, 0.45)"
                  : `1.5px solid ${currentTheme.cardBorder}`,
                boxShadow: isDone
                  ? "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 15px rgba(52, 211, 153, 0.15)"
                  : `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px ${currentTheme.glow}`,
              }}
            >
              {/* Left: Standalone Floating Icon & Details */}
              <div className="flex items-center gap-3.5 text-left">
                <div className="text-2xl shrink-0 transition-transform group-hover:scale-110 duration-200">
                  {a.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-[#f5d76e] transition-colors">
                      {a.title}
                    </h3>
                    {isDone && (
                      <span className="text-emerald-400 text-xs font-bold">✓</span>
                    )}
                  </div>
                  <p className="text-[11px] text-purple-200/70 mt-0.5 leading-snug">
                    {a.desc}
                  </p>
                </div>
              </div>

              {/* Right: Badge & Duration */}
              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: a.tagBg,
                    color: a.tagText,
                    borderColor: a.tagBorder,
                  }}
                >
                  {a.tag}
                </span>
                <span className="text-[11px] text-purple-200/60 font-medium">
                  {a.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitiesScreen;

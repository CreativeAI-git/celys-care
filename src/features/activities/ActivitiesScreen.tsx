"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { useAuth } from "@/app/providers";
import confetti from "canvas-confetti";

const ACTIVITIES = [
  {
    title: "5-4-3-2-1 Grounding",
    desc: "Engage all five senses to anchor into the present moment",
    time: "3 min",
    tag: "Grounding",
    emoji: "🌿",
    color: "#7ec8a0",
    steps: [
      "Look around and name 5 things you can SEE.",
      "Notice 4 things you can physically TOUCH.",
      "Listen for 3 distinct sounds you can HEAR.",
      "Identify 2 things you can SMELL.",
      "Notice 1 thing you can TASTE.",
    ],
  },
  {
    title: "Progressive Muscle Release",
    desc: "Tense and release muscle groups from toes to crown",
    time: "5 min",
    tag: "Body",
    emoji: "🧘",
    color: "#a78bfa",
    steps: [
      "Curl your toes tightly for 5 seconds... then release completely.",
      "Squeeze your calves and thighs... hold... and let go.",
      "Clench your fists and arms... hold... and release.",
      "Shrug your shoulders up to your ears... hold... and drop them down.",
      "Scrunch your facial muscles... hold... and soften your face.",
    ],
  },
  {
    title: "Gratitude Savoring",
    desc: "Deeply experience three specific moments of gratitude",
    time: "4 min",
    tag: "Reflection",
    emoji: "✨",
    color: "#f5d76e",
    steps: [
      "Think of a person who made you feel safe or appreciated recently.",
      "Recall a simple sensory pleasure (warm tea, cozy bed, sunshine).",
      "Acknowledge one strength or kindness within yourself.",
    ],
  },
  {
    title: "Cold Water Reset",
    desc: "Activate the mammalian dive reflex to slow heart rate",
    time: "2 min",
    tag: "Quick Reset",
    emoji: "💧",
    color: "#60a5fa",
    steps: [
      "Walk to a sink and turn the cold water on.",
      "Splash cold water gently over your face, especially your eyes and cheeks.",
      "Pat dry softly and take three slow, steady breaths.",
    ],
  },
  {
    title: "Gentle Brain Dump",
    desc: "Unload swirling thoughts onto paper without filter",
    time: "5 min",
    tag: "Creative",
    emoji: "📝",
    color: "#c96ccc",
    steps: [
      "Grab a pen or your phone notes.",
      "Write everything that feels unfinished or heavy — no grammar rules.",
      "When finished, tell yourself: 'I will deal with this when I have capacity.'",
    ],
  },
];

const TAGS = ["All", "Grounding", "Body", "Reflection", "Creative", "Quick Reset"];

export const ActivitiesScreen: React.FC = () => {
  const { user } = useAuth();
  const [done, setDone] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const [guideStep, setGuideStep] = useState(0);

  const handleDone = (idx: number) => {
    setDone((d) => (d.includes(idx) ? d : [...d, idx]));
    setActive(null);
    setGuideStep(0);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#7ec8a0", "#f5d76e", "#c96ccc"],
    });
  };

  if (active !== null) {
    const act = ACTIVITIES[active];
    const totalSteps = act.steps.length;
    const isCompleted = guideStep >= totalSteps;

    return (
      <div className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto">
        <div className="mb-2">
          <CelysLogo size={70} />
        </div>
        <h2
          className="font-serif text-2xl font-bold mt-1"
          style={{
            background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {act.title}
        </h2>
        <p className="text-xs text-purple-200/60 mb-4">{act.desc}</p>

        {!isCompleted ? (
          <div className="w-full">
            <div
              className="w-full rounded-3xl p-5 mb-4 text-left"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${act.color}44`,
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider block mb-2"
                style={{ color: act.color }}
              >
                Step {guideStep + 1} of {totalSteps}
              </span>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "#f0e8ff" }}
              >
                {act.steps[guideStep]}
              </p>
            </div>

            <div className="flex gap-2.5 w-full">
              {guideStep > 0 && (
                <button
                  onClick={() => setGuideStep((s) => s - 1)}
                  className="py-3 px-4 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(180,120,255,0.2)",
                    color: "rgba(240,232,255,0.6)",
                  }}
                >
                  ←
                </button>
              )}
              <button
                onClick={() => {
                  if (guideStep < totalSteps - 1) {
                    setGuideStep((s) => s + 1);
                  } else {
                    handleDone(active);
                  }
                }}
                className="flex-1 py-3 rounded-full font-semibold text-white text-xs"
                style={{
                  background: "linear-gradient(135deg, #c96ccc, #7c3aed)",
                  boxShadow: "0 4px 16px rgba(201,108,204,0.3)",
                }}
              >
                {guideStep < totalSteps - 1 ? "Next Step →" : "Complete ✦"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-3 w-full">
            <p style={{ fontSize: 40, marginBottom: 8 }}>✨</p>
            <p className="text-sm font-semibold mb-1" style={{ color: "#7ec8a0" }}>
              Activity complete!
            </p>
            <p className="text-xs mb-4 text-purple-200/60">
              You showed up for yourself today. That matters. 💜
            </p>
            <button
              onClick={() => setActive(null)}
              className="w-full py-3 rounded-full text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #c96ccc, #7c3aed)" }}
            >
              ← Back to Activities
            </button>
          </div>
        )}
      </div>
    );
  }

  const shown =
    filter === "All" ? ACTIVITIES : ACTIVITIES.filter((a) => a.tag === filter);

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
        Activities
      </h2>
      <p className="text-xs text-purple-200/60 mb-4 mt-0.5">
        Small steps toward feeling better
      </p>

      {/* Progress Bar */}
      <div
        className="w-full rounded-2xl p-3 mb-3.5 flex items-center gap-3 text-left"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(180,120,255,0.15)",
        }}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-purple-200/50">
              Today&apos;s progress
            </span>
            <span className="text-[11px] font-semibold" style={{ color: "#f5d76e" }}>
              {done.length} / {ACTIVITIES.length}
            </span>
          </div>
          <div
            className="w-full rounded-full h-1.5"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${(done.length / ACTIVITIES.length) * 100}%`,
                background: "linear-gradient(to right, #7ec8a0, #60a5fa)",
              }}
            />
          </div>
        </div>
        {done.length === ACTIVITIES.length && (
          <span style={{ fontSize: 20 }}>🏆</span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-3.5 flex-wrap justify-center w-full">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
            style={{
              background:
                filter === t
                  ? "linear-gradient(135deg, #c96ccc, #7c3aed)"
                  : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(180,120,255,0.2)",
              color: filter === t ? "#fff" : "rgba(240,232,255,0.55)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-2 w-full">
        {shown.map((a) => {
          const idx = ACTIVITIES.indexOf(a);
          const isDone = done.includes(idx);
          return (
            <button
              key={a.title}
              onClick={() => setActive(idx)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98]"
              style={{
                background: isDone
                  ? `${a.color}14`
                  : "rgba(255,255,255,0.06)",
                border: `1px solid ${
                  isDone ? a.color + "50" : "rgba(180,120,255,0.18)"
                }`,
              }}
            >
              <span style={{ fontSize: 22 }}>{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: isDone ? a.color : "#f0e8ff" }}
                  >
                    {a.title}
                  </p>
                  {isDone && <Check size={12} style={{ color: a.color }} />}
                </div>
                <p className="text-[10px] truncate text-purple-200/45">
                  {a.desc}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${a.color}20`, color: a.color }}
                >
                  {a.tag}
                </span>
                <span className="text-[10px] text-purple-200/30">
                  {a.time}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitiesScreen;

"use client";

import React, { useState } from "react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { audioSynth } from "@/lib/audio-synth";
import confetti from "canvas-confetti";

interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  tag: "Grounding" | "Body" | "Reflection" | "Creative" | "Quick Reset" | "Social";
  emoji: string;
  color: string;
  steps: string[];
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "mindful-walking",
    title: "Mindful Walking",
    desc: "Walk slowly and notice 5 thi...",
    time: "10 min",
    tag: "Grounding",
    emoji: "🚶",
    color: "#7ec8a0",
    steps: [
      "Stand tall and feel your feet firmly connected to the ground.",
      "Begin walking at half your normal pace, feeling each heel-to-toe step.",
      "Look around and notice 5 visual details you haven't paid attention to before.",
      "Feel the ambient air on your skin and listen to soft background sounds.",
      "Take a deep breath and anchor yourself in this present moment.",
    ],
  },
  {
    id: "gratitude-practice",
    title: "Gratitude Practice",
    desc: "Write down 3 things you are ...",
    time: "5 min",
    tag: "Reflection",
    emoji: "🙏",
    color: "#f5d76e",
    steps: [
      "Pause, place a hand on your heart, and take two gentle breaths.",
      "Think of one person who brings warmth, safety, or kindness to your life.",
      "Notice one simple sensory comfort right now (warm cup, soft chair, shelter).",
      "Acknowledge one personal effort or strength you showed today.",
      "Allow a gentle smile of appreciation to rest on your face.",
    ],
  },
  {
    id: "muscle-relaxation",
    title: "Muscle Relaxation",
    desc: "Tense and release each muscle gr...",
    time: "12 min",
    tag: "Body",
    emoji: "💪",
    color: "#a78bfa",
    steps: [
      "Curl your toes tightly for 5 seconds... then release completely.",
      "Squeeze your calves and thighs... hold... and let go.",
      "Clench your fists and arms... hold... and release the tension.",
      "Shrug your shoulders up to your ears... hold... and drop them down.",
      "Scrunch your facial muscles... hold... and soften your face completely.",
    ],
  },
  {
    id: "cold-water-splash",
    title: "Cold Water Splash",
    desc: "Splash cold water on your f...",
    time: "1 min",
    tag: "Quick Reset",
    emoji: "💧",
    color: "#60a5fa",
    steps: [
      "Walk to a sink and turn the cold water on.",
      "Cup cold water gently in your hands and splash over your cheeks and forehead.",
      "Pat dry softly with a clean towel and take three slow, steady belly breaths.",
    ],
  },
  {
    id: "creative-drawing",
    title: "Creative Drawing",
    desc: "Doodle freely without judgmen...",
    time: "15 min",
    tag: "Creative",
    emoji: "✏️",
    color: "#fb923c",
    steps: [
      "Grab a piece of paper and a pen or open a drawing pad.",
      "Draw continuous loops, circles, or shapes without lifting your pen.",
      "Don't aim for a finished picture — focus purely on the flow and feeling.",
      "Use different line weights or colors to express your emotions.",
      "Step back and appreciate your expression without critique.",
    ],
  },
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding",
    desc: "5-4-3-2-1 sensory grounding...",
    time: "3 min",
    tag: "Grounding",
    emoji: "🌲",
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
    id: "yoga-stretch",
    title: "Yoga Stretch",
    desc: "3 gentle stretches to release held ...",
    time: "8 min",
    tag: "Body",
    emoji: "🧘",
    color: "#a78bfa",
    steps: [
      "Cat-Cow Stretch: Gently arch and round your spine with your breath for 1 minute.",
      "Child's Pose: Rest your hips on your heels, extend your arms forward, and breathe.",
      "Seated Gentle Twist: Softly twist your torso left and right, releasing your lower back.",
      "Finish with a seated deep breath with hands resting over your heart.",
    ],
  },
  {
    id: "connect-someone",
    title: "Connect with Someone",
    desc: "Reach out to someone who lifts y...",
    time: "Any",
    tag: "Social",
    emoji: "📞",
    color: "#f472b6",
    steps: [
      "Think of a friend, family member, or mentor who makes you feel supported.",
      "Send a quick thoughtful text, voice note, or call them.",
      "Share a brief word of appreciation or simply say 'thinking of you today'.",
      "Notice how genuine connection lightens heavy thoughts.",
    ],
  },
];

const TAG_ROWS = [
  ["All", "Grounding", "Body", "Reflection"],
  ["Creative", "Quick Reset", "Social"],
];

export const ActivitiesScreen: React.FC = () => {
  const [done, setDone] = useState<string[]>(["mindful-walking", "connect-someone"]);
  const [active, setActive] = useState<ActivityItem | null>(null);
  const [filter, setFilter] = useState("All");
  const [guideStep, setGuideStep] = useState(0);

  const toggleDone = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (done.includes(id)) {
      setDone((prev) => prev.filter((item) => item !== id));
    } else {
      setDone((prev) => [...prev, id]);
      if (audioSynth) {
        audioSynth.playTibetanBowl(528);
      }
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#7ec8a0", "#f5d76e", "#c96ccc", "#60a5fa"],
      });
    }
  };

  const handleStepComplete = (act: ActivityItem) => {
    if (!done.includes(act.id)) {
      setDone((prev) => [...prev, act.id]);
    }
    setActive(null);
    setGuideStep(0);
    if (audioSynth) {
      audioSynth.playTibetanBowl(528);
    }
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#7ec8a0", "#f5d76e", "#c96ccc", "#60a5fa"],
    });
  };

  // Detailed Step-by-Step Guided View
  if (active !== null) {
    const totalSteps = active.steps.length;
    const isCompleted = guideStep >= totalSteps;

    return (
      <div className="flex flex-col items-center px-4 pt-3 pb-8 text-center w-full max-w-sm mx-auto">
        <div className="mb-2">
          <CelysLogo size={72} />
        </div>
        <h2
          className="font-serif text-2xl font-bold mt-1"
          style={{
            background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {active.title}
        </h2>
        <p className="text-xs text-purple-200/60 mb-4">{active.desc}</p>

        {!isCompleted ? (
          <div className="w-full">
            <div
              className="w-full rounded-3xl p-5 mb-4 text-left shadow-lg"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${active.color}44`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider block"
                  style={{ color: active.color }}
                >
                  Step {guideStep + 1} of {totalSteps}
                </span>
                <span className="text-xl">{active.emoji}</span>
              </div>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "#f0e8ff" }}
              >
                {active.steps[guideStep]}
              </p>
            </div>

            <div className="flex gap-2.5 w-full">
              {guideStep > 0 && (
                <button
                  onClick={() => setGuideStep((s) => s - 1)}
                  className="py-3 px-4 rounded-full text-xs font-semibold active:scale-95 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(180,120,255,0.2)",
                    color: "rgba(240,232,255,0.6)",
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => {
                  if (guideStep < totalSteps - 1) {
                    setGuideStep((s) => s + 1);
                  } else {
                    handleStepComplete(active);
                  }
                }}
                className="flex-1 py-3 rounded-full font-semibold text-white text-xs active:scale-[0.98] transition-all"
                style={{
                  background: "linear-gradient(135deg, #c96ccc, #7c3aed)",
                  boxShadow: "0 4px 16px rgba(201,108,204,0.3)",
                }}
              >
                {guideStep < totalSteps - 1 ? "Next Step →" : "Complete Activity ✦"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-3 w-full">
            <p style={{ fontSize: 40, marginBottom: 8 }}>✨</p>
            <p className="text-sm font-semibold mb-1" style={{ color: "#7ec8a0" }}>
              Activity Complete!
            </p>
            <p className="text-xs mb-4 text-purple-200/60">
              You took a mindful step for yourself today. That matters. 💜
            </p>
            <button
              onClick={() => setActive(null)}
              className="w-full py-3 rounded-full text-xs font-semibold text-white active:scale-95 transition-all"
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
    <div className="flex flex-col items-center px-4 pt-3 pb-8 text-center w-full max-w-sm mx-auto">
      {/* Centered Golden Logo */}
      <div className="mb-2">
        <CelysLogo size={78} />
      </div>

      {/* Screen Title */}
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

      {/* Subtitle */}
      <p className="text-xs text-purple-200/60 mt-0.5">
        Small steps toward feeling better
      </p>

      {/* Decorative Sparkle Divider */}
      <div className="flex items-center justify-center gap-3 my-2 opacity-50">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#f5d76e]/50" />
        <span className="text-[#f5d76e] text-[10px]">✦</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#f5d76e]/50" />
      </div>

      {/* Today's Progress Card — Figma Exact Match */}
      <div
        className="w-full rounded-2xl p-3.5 mb-3 flex flex-col gap-2 text-left"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(180,120,255,0.18)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-purple-200/70">
            Today&apos;s progress
          </span>
          <span className="text-xs font-bold" style={{ color: "#f5d76e" }}>
            {done.length} / {ACTIVITIES.length}
          </span>
        </div>
        <div
          className="w-full rounded-full h-1.5 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${(done.length / ACTIVITIES.length) * 100}%`,
              background: "linear-gradient(to right, #7ec8a0, #60a5fa)",
            }}
          />
        </div>
      </div>

      {/* Category Filter Pills (2 Rows — Exact Figma Match) */}
      <div className="flex flex-col gap-1.5 mb-3.5 w-full items-center">
        {TAG_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1.5 flex-wrap justify-center">
            {row.map((t) => {
              const isSelected = filter === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all active:scale-95"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, #b04be6 0%, #7c3aed 100%)"
                      : "rgba(255,255,255,0.07)",
                    border: isSelected
                      ? "1px solid rgba(201,108,204,0.6)"
                      : "1px solid rgba(180,120,255,0.2)",
                    color: isSelected ? "#ffffff" : "rgba(240,232,255,0.6)",
                    boxShadow: isSelected
                      ? "0 2px 8px rgba(168,85,247,0.35)"
                      : "none",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 8 Activities List — Figma Exact Match */}
      <div className="flex flex-col gap-2 w-full">
        {shown.map((a) => {
          const isDone = done.includes(a.id);

          return (
            <div
              key={a.id}
              onClick={() => setActive(a)}
              className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all active:scale-[0.98] cursor-pointer hover:brightness-110"
              style={{
                background: isDone
                  ? `${a.color}12`
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${
                  isDone ? `${a.color}50` : "rgba(180,120,255,0.18)"
                }`,
                boxShadow: isDone
                  ? `0 0 12px ${a.color}25`
                  : "none",
              }}
            >
              {/* Emoji Icon Badge */}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl shadow-sm"
                style={{
                  background: isDone ? `${a.color}20` : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isDone ? `${a.color}40` : "rgba(180,120,255,0.2)"}`,
                }}
              >
                <span className="leading-none">{a.emoji}</span>
              </div>

              {/* Title & Short Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4
                    className="text-xs font-semibold truncate leading-tight"
                    style={{ color: isDone ? a.color : "#ffffff" }}
                  >
                    {a.title}
                  </h4>
                  {isDone && (
                    <span
                      onClick={(e) => toggleDone(a.id, e)}
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] text-white flex-shrink-0 cursor-pointer"
                      style={{ background: a.color }}
                      title="Completed"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] truncate text-purple-200/55 leading-tight">
                  {a.desc}
                </p>
              </div>

              {/* Category Pill & Duration Badge */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${a.color}22`,
                    color: a.color,
                    border: `1px solid ${a.color}35`,
                  }}
                >
                  {a.tag}
                </span>
                <span className="text-[10px] text-purple-200/40 font-medium">
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

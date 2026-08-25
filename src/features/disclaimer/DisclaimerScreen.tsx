"use client";

import React from "react";
import { Info, Check, Phone } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";

const RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    number: "988",
    desc: "Call or text 988 — 24/7 free support",
    color: "#f87171",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    desc: "Free crisis counseling via text, 24/7",
    color: "#a78bfa",
  },
  {
    name: "SAMHSA Helpline",
    number: "1-800-662-4357",
    desc: "Substance abuse & mental health services",
    color: "#60a5fa",
  },
  {
    name: "NAMI Helpline",
    number: "1-800-950-6264",
    desc: "National Alliance on Mental Illness support",
    color: "#7ec8a0",
  },
  {
    name: "Trevor Project (LGBTQ+)",
    number: "1-866-488-7386",
    desc: "Crisis intervention for LGBTQ+ youth",
    color: "#f5d76e",
  },
];

export const DisclaimerScreen: React.FC = () => {
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
        Important Notice
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Please read before using Celys Care
      </p>
      <SparkleDivider className="my-2 mb-3.5" />

      {/* Warning Box */}
      <div
        className="w-full rounded-2xl p-4 mb-3.5 text-left"
        style={{
          background: "rgba(248,113,113,0.1)",
          border: "1px solid rgba(248,113,113,0.35)",
        }}
      >
        <div className="flex items-start gap-2.5">
          <Info
            size={18}
            className="flex-shrink-0 mt-0.5"
            style={{ color: "#f87171" }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-1"
              style={{ color: "#f87171" }}
            >
              Celys Care is NOT a Licensed Therapist
            </p>
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: "rgba(240,232,255,0.75)" }}
            >
              Celys Care is an AI-powered wellness companion designed to provide
              emotional support, mindfulness tools, and psychoeducational content.
              It is <strong>not</strong> a substitute for professional mental
              health treatment, therapy, psychiatry, or medical advice.
            </p>
            <p
              className="text-[11px] leading-relaxed mt-1.5"
              style={{ color: "rgba(240,232,255,0.75)" }}
            >
              If you are experiencing a mental health crisis or emergency,
              please contact a licensed professional or emergency services
              immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Appropriate Usage Checklist */}
      <div
        className="w-full rounded-2xl p-3.5 mb-3.5 text-left"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(180,120,255,0.18)",
        }}
      >
        <p
          className="text-[11px] font-semibold mb-1.5"
          style={{ color: "rgba(240,232,255,0.8)" }}
        >
          Celys Care is appropriate for:
        </p>
        {[
          "Daily emotional check-ins and mood tracking",
          "Practicing mindfulness and breathing exercises",
          "Journaling and self-reflection",
          "Learning coping skills and grounding techniques",
          "Finding motivation and affirmations",
        ].map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 py-1.5 border-b last:border-0"
            style={{ borderColor: "rgba(180,120,255,0.1)" }}
          >
            <Check
              size={12}
              className="mt-0.5 flex-shrink-0"
              style={{ color: "#7ec8a0" }}
            />
            <p
              className="text-[11px]"
              style={{ color: "rgba(240,232,255,0.7)" }}
            >
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* Helplines Header */}
      <p
        className="text-xs font-semibold mb-2 self-start"
        style={{ color: "#c96ccc" }}
      >
        Crisis & Mental Health Resources
      </p>

      {/* Resources List */}
      <div className="flex flex-col gap-2 w-full text-left">
        {RESOURCES.map((r) => (
          <div
            key={r.name}
            className="rounded-2xl p-3"
            style={{
              background: `${r.color}12`,
              border: `1px solid ${r.color}40`,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p
                  className="text-[11px] font-semibold mb-0.5"
                  style={{ color: r.color }}
                >
                  {r.name}
                </p>
                <p className="text-xs font-bold mb-0.5 text-[#f0e8ff]">
                  {r.number}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "rgba(240,232,255,0.55)" }}
                >
                  {r.desc}
                </p>
              </div>
              <Phone
                size={14}
                className="flex-shrink-0 mt-0.5"
                style={{ color: r.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <p
        className="text-[9px] text-center mt-4"
        style={{ color: "rgba(240,232,255,0.35)" }}
      >
        © 2026 Celys Care · All wellness content is for informational purposes
        only
      </p>
    </div>
  );
};

export default DisclaimerScreen;

"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAuth } from "@/app/providers";
import { offlineSync } from "@/lib/offline-sync";
import { toast } from "sonner";

const PROMPTS = [
  "What is one thing you are grateful for today, no matter how small?",
  "What emotion am I carrying right now, and where do I feel it in my body?",
  "Write a letter of kindness to yourself as if you were your own best friend.",
  "What is something I need to release or forgive today?",
  "Describe a moment recently when you felt truly at peace.",
  "What does my ideal calm day look like?",
];

export const JournalScreen: React.FC = () => {
  const { user } = useAuth();
  const [entry, setEntry] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [pastEntries, setPastEntries] = useState<{ id?: string; content: string; createdAt?: string; created_at?: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setPastEntries(data.entries || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user, saved]);

  const saveEntry = async () => {
    if (!entry.trim()) return;

    const payload = {
      title: "Journal Reflection",
      content: entry.trim(),
      prompt: PROMPTS[promptIdx],
      isEncrypted: true,
    };

    try {
      if (navigator.onLine) {
        await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        offlineSync.queueMutation("journal", "CREATE", payload);
      }
      setSaved(true);
      setEntry("");
      toast.success("Reflection preserved in your private sanctuary ✨");
      setTimeout(() => setSaved(false), 2500);
      fetchEntries();
    } catch {
      offlineSync.queueMutation("journal", "CREATE", payload);
      setSaved(true);
      setEntry("");
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto">
      {/* Centered Golden Logo */}
      <div className="mb-2">
        <CelysLogo size={90} />
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
        Journal
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Reflect, release, and grow
      </p>
      <SparkleDivider className="my-2 mb-3.5" />

      {/* Prompt Card */}
      <div
        className="w-full rounded-2xl p-4 mb-3.5 text-left"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(180,120,255,0.2)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs mb-1 font-semibold" style={{ color: "#c96ccc" }}>
              Today&apos;s Prompt ✦
            </p>
            <p
              className="text-xs sm:text-sm leading-relaxed"
              style={{ color: "rgba(240,232,255,0.9)" }}
            >
              {PROMPTS[promptIdx]}
            </p>
          </div>
          <button
            onClick={() => setPromptIdx((i) => (i + 1) % PROMPTS.length)}
            className="flex-shrink-0 mt-0.5 p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Next prompt"
          >
            <RefreshCw size={14} style={{ color: "rgba(180,120,255,0.6)" }} />
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write freely here. This is your safe space…"
        rows={6}
        className="w-full rounded-2xl p-4 text-xs sm:text-sm outline-none resize-none leading-relaxed mb-3.5"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(180,120,255,0.22)",
          color: "#f0e8ff",
        }}
      />

      {/* Action Buttons */}
      <div className="flex gap-2.5 w-full">
        <button
          type="button"
          onClick={() => setPromptIdx((i) => (i + 1) % PROMPTS.length)}
          className="flex-1 py-2.5 rounded-full text-xs font-semibold transition-all hover:bg-white/10"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(180,120,255,0.22)",
            color: "rgba(240,232,255,0.7)",
          }}
        >
          New Prompt
        </button>
        <button
          type="button"
          onClick={saveEntry}
          disabled={!entry.trim()}
          className="flex-1 py-2.5 rounded-full text-xs font-semibold text-white transition-all disabled:opacity-40"
          style={{
            background: saved
              ? "rgba(126,211,120,0.5)"
              : "linear-gradient(135deg, #c96ccc, #7c3aed)",
            boxShadow: saved ? "none" : "0 4px 14px rgba(201,108,204,0.3)",
          }}
        >
          {saved ? "✓ Saved!" : "Save Entry"}
        </button>
      </div>

      <p className="text-[10px] mt-3 text-purple-200/35">
        {user
          ? "Your journal is saved securely with AES-256 encryption."
          : "Log in to sync your encrypted entries across devices."}
      </p>

      {/* Past Entries */}
      {pastEntries.length > 0 && (
        <div className="w-full mt-3 text-left">
          <button
            onClick={() => setShowHistory((h) => !h)}
            className="text-xs mb-2 font-medium"
            style={{ color: "#c96ccc" }}
          >
            {showHistory ? "▲ Hide" : "▼ Show"} past entries ({pastEntries.length})
          </button>
          {showHistory && (
            <div className="flex flex-col gap-2">
              {pastEntries.map((e, i) => (
                <div
                  key={e.id || i}
                  className="rounded-2xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(180,120,255,0.15)",
                  }}
                >
                  <p
                    className="text-[10px] mb-1 text-purple-200/40"
                  >
                    {new Date(e.createdAt || e.created_at || Date.now()).toLocaleDateString()}
                  </p>
                  <p
                    className="text-xs leading-relaxed text-purple-100/70"
                  >
                    {e.content.slice(0, 120)}
                    {e.content.length > 120 ? "…" : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JournalScreen;

"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { audioSynth } from "@/lib/audio-synth";

const TRACKS = [
  { title: "Ocean Waves", artist: "Nature Sounds", duration: "∞", emoji: "🌊", type: "ocean" },
  { title: "Forest Rain", artist: "Ambient Healing", duration: "∞", emoji: "🌧️", type: "rain" },
  { title: "Tibetan Bowls", artist: "432Hz Meditation", duration: "∞", emoji: "🔔", type: "bowls" },
  { title: "Gentle Piano", artist: "Calm Spaces", duration: "∞", emoji: "🎹", type: "piano" },
  { title: "White Noise", artist: "Sleep Aid", duration: "∞", emoji: "🌀", type: "white" },
  { title: "Healing Frequencies", artist: "528Hz Therapy", duration: "∞", emoji: "✨", type: "528hz" },
];

export const RelaxationMusic: React.FC = () => {
  const [playing, setPlaying] = useState<number | null>(null);
  const [volume, setVolume] = useState(70);

  const playTrack = (i: number) => {
    if (playing === i) {
      audioSynth.stopSoundscape();
      setPlaying(null);
      return;
    }
    audioSynth.setVolume(volume / 100);
    audioSynth.startSoundscape(TRACKS[i].type);
    setPlaying(i);
  };

  useEffect(() => {
    audioSynth.setVolume(volume / 100);
  }, [volume]);

  useEffect(() => {
    return () => {
      audioSynth.stopSoundscape();
    };
  }, []);

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
        Relaxation Music
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Sounds to soothe and restore your soul
      </p>
      <SparkleDivider className="my-2 mb-3.5" />

      {/* Active Music Player Card */}
      {playing !== null && (
        <div
          className="w-full rounded-2xl p-4 mb-4 text-left"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(180,120,255,0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span style={{ fontSize: 26 }}>{TRACKS[playing].emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-[#f0e8ff]">
                {TRACKS[playing].title}
              </p>
              <p className="text-[11px] truncate text-purple-200/50">
                {TRACKS[playing].artist}
              </p>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#7ec8a0" }}
            />
          </div>

          {/* Equalizer waveform animation */}
          <div className="flex items-end gap-1 justify-center h-8 mb-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full flex-1"
                style={{
                  background: "linear-gradient(to top, #c96ccc, #7c3aed)",
                  animation: `pulse ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
                  height: `${14 + Math.sin(i * 0.8) * 12}px`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 mb-3">
            <Volume2 size={13} style={{ color: "rgba(240,232,255,0.4)" }} />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #c96ccc ${volume}%, rgba(255,255,255,0.12) ${volume}%)`,
              }}
            />
            <span
              className="text-[10px] w-6 text-right"
              style={{ color: "rgba(240,232,255,0.4)" }}
            >
              {volume}
            </span>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() =>
                playTrack((playing - 1 + TRACKS.length) % TRACKS.length)
              }
              className="p-1 hover:text-white transition-colors text-purple-200/60"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={() => playTrack(playing)}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
              style={{ background: "linear-gradient(135deg, #c96ccc, #7c3aed)" }}
            >
              <Pause size={18} color="white" />
            </button>
            <button
              onClick={() => playTrack((playing + 1) % TRACKS.length)}
              className="p-1 hover:text-white transition-colors text-purple-200/60"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Tracks List */}
      <div className="flex flex-col gap-2.5 w-full mb-3">
        {TRACKS.map((t, i) => (
          <button
            key={t.title}
            onClick={() => playTrack(i)}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.99]"
            style={{
              background:
                playing === i
                  ? "rgba(124,58,237,0.22)"
                  : "rgba(255,255,255,0.06)",
              border: `1px solid ${
                playing === i
                  ? "rgba(201,108,204,0.45)"
                  : "rgba(180,120,255,0.16)"
              }`,
            }}
          >
            <span style={{ fontSize: 22 }}>{t.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: "#f0e8ff" }}>
                {t.title}
              </p>
              <p className="text-[11px] truncate text-purple-200/50">
                {t.artist}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {playing === i ? (
                <Pause size={16} style={{ color: "#c96ccc" }} />
              ) : (
                <Play size={16} style={{ color: "rgba(240,232,255,0.4)" }} />
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-purple-200/35">
        All sounds generated live · No download needed
      </p>
    </div>
  );
};

export default RelaxationMusic;

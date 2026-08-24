"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";

const TRACKS = [
  { title: "Ocean Waves", artist: "Nature Sounds", duration: "∞", emoji: "🌊", type: "ocean" },
  { title: "Forest Rain", artist: "Ambient Healing", duration: "∞", emoji: "🌧️", type: "rain" },
  { title: "Tibetan Bowls", artist: "432Hz Meditation", duration: "∞", emoji: "🔔", type: "bowls" },
  { title: "Gentle Piano", artist: "Calm Spaces", duration: "∞", emoji: "🎹", type: "piano" },
  { title: "White Noise", artist: "Sleep Aid", duration: "∞", emoji: "🌀", type: "white" },
  { title: "Healing Frequencies", artist: "528Hz Therapy", duration: "∞", emoji: "✨", type: "528hz" },
];

type AudioNodes = { stop: () => void };

function buildAudio(type: string, ctx: AudioContext): AudioNodes {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.5);
  gain.connect(ctx.destination);

  const nodes: AudioBufferSourceNode[] = [];
  const oscs: OscillatorNode[] = [];

  const makeNoise = (color: "white" | "brown" | "pink") => {
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, lastOut = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (color === "white") {
        d[i] = w;
      } else if (color === "brown") {
        lastOut = (lastOut + 0.02 * w) / 1.02;
        d[i] = lastOut * 3.5;
      } else {
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    return src;
  };

  const makeOsc = (freq: number, type: OscillatorType = "sine", vol = 0.3) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(gain);
    o.start();
    oscs.push(o);
  };

  if (type === "ocean") {
    const noise = makeNoise("brown");
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    noise.connect(filter);
    filter.connect(gain);
    noise.start();
    nodes.push(noise);
  } else if (type === "rain") {
    const noise = makeNoise("white");
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1200;
    noise.connect(filter);
    filter.connect(gain);
    noise.start();
    nodes.push(noise);
  } else if (type === "bowls") {
    [[432, 0.3], [648, 0.15], [864, 0.08], [216, 0.1]].forEach(([f, v]) =>
      makeOsc(f as number, "sine", v as number)
    );
  } else if (type === "piano") {
    const melody = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];
    let i = 0;
    const playNote = () => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = melody[i % melody.length];
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      o.connect(g);
      g.connect(gain);
      o.start();
      o.stop(ctx.currentTime + 2);
      i++;
    };
    playNote();
    const id = setInterval(playNote, 2200);
    return {
      stop: () => {
        clearInterval(id);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        oscs.forEach((o) => {
          try {
            o.stop(ctx.currentTime + 1.5);
          } catch {}
        });
      },
    };
  } else if (type === "white") {
    const noise = makeNoise("white");
    noise.connect(gain);
    noise.start();
    nodes.push(noise);
  } else if (type === "528hz") {
    makeOsc(528, "sine", 0.25);
    makeOsc(530, "sine", 0.08);
    makeOsc(264, "sine", 0.1);
  }

  return {
    stop: () => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      nodes.forEach((n) => {
        try {
          n.stop(ctx.currentTime + 2);
        } catch {}
      });
      oscs.forEach((o) => {
        try {
          o.stop(ctx.currentTime + 2);
        } catch {}
      });
    },
  };
}

export const RelaxationMusic: React.FC = () => {
  const [playing, setPlaying] = useState<number | null>(null);
  const [volume, setVolume] = useState(70);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNodes | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const stopCurrent = () => {
    nodesRef.current?.stop();
    nodesRef.current = null;
  };

  const playTrack = (i: number) => {
    stopCurrent();
    if (playing === i) {
      setPlaying(null);
      return;
    }
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const master = ctx.createGain();
    master.gain.value = volume / 100;
    master.connect(ctx.destination);
    masterRef.current = master;
    nodesRef.current = buildAudio(TRACKS[i].type, ctx);
    setPlaying(i);
  };

  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume / 100;
  }, [volume]);

  useEffect(() => () => stopCurrent(), []);

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
      <p className="text-xs text-purple-200/60 mb-4 mt-0.5">
        Sounds to soothe and restore your soul
      </p>

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

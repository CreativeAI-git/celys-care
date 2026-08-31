/**
 * High-Definition Unified Text-To-Speech Service for Celys Care
 * 100% Reliable across Android APK, iOS App, Mobile Web & Desktop
 */

// Module-level references to prevent Android garbage collection & track state
let activeUtterances: SpeechSynthesisUtterance[] = [];
let heartbeatInterval: NodeJS.Timeout | null = null;
let isSpeakingState = false;
let audioFallback: HTMLAudioElement | null = null;
let currentCallbacks: {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
} | null = null;

/**
 * Clean text of emojis, markdown symbols, asterisks, hashtags, and formatting
 */
export function sanitizeSpeechText(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✦🌸💜🌿✨☀️🌊🦁·•—_~`#*[\]()]/gu, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split text into natural sentence clauses for natural pacing
 */
function splitIntoNaturalClauses(text: string): string[] {
  // Split on periods, exclamation marks, question marks, semicolons or line breaks
  const rawClauses = text.split(/(?<=[.!?;\n])\s+/);
  const clauses: string[] = [];

  for (const c of rawClauses) {
    const trimmed = c.trim();
    if (!trimmed) continue;

    // If clause is excessively long (> 160 chars), break naturally at commas
    if (trimmed.length > 160) {
      const subParts = trimmed.split(/(?<=[,])\s+/);
      for (const sp of subParts) {
        const subTrimmed = sp.trim();
        if (subTrimmed) clauses.push(subTrimmed);
      }
    } else {
      clauses.push(trimmed);
    }
  }

  return clauses.length > 0 ? clauses : [text];
}

/**
 * Start Android Chrome WebView speech synthesis keepalive heartbeat
 * (Fixes the well-known Chromium bug where TTS stops speaking after ~15s)
 */
function startHeartbeat() {
  stopHeartbeat();
  heartbeatInterval = setInterval(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      } catch { }
    }
  }, 9000);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

/**
 * Pre-warm and unlock audio hardware on mobile user gesture
 */
export function unlockAudioContext(): void {
  if (typeof window === "undefined") return;

  // 1. Unlock Web Speech API
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.resume();
      // Speak and immediately cancel empty utterance to prime audio pipeline
      if (!window.speechSynthesis.speaking) {
        const dummy = new SpeechSynthesisUtterance("");
        dummy.volume = 0;
        window.speechSynthesis.speak(dummy);
        window.speechSynthesis.cancel();
      }
    } catch { }
  }

  // 2. Unlock HTML5 Audio
  try {
    const silentAudio = new Audio();
    silentAudio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    silentAudio.volume = 0.01;
    silentAudio.play().catch(() => { });
  } catch { }
}

/**
 * Best voice selector with preferences for warm, calm English voices
 */
function getPreferredVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (!voices || voices.length === 0) return null;

  // Priority order for natural, soothing AI voices
  const preferredVoiceNames = [
    "Google UK English Female",
    "Google US English",
    "en-US-SMT",
    "Samantha",
    "Victoria",
    "Karen",
    "Zira",
    "Microsoft Zira",
    "Natural",
    "Female",
    "en-US",
  ];

  for (const name of preferredVoiceNames) {
    const found = voices.find(
      (v) => v.name.toLowerCase().includes(name.toLowerCase()) || v.lang.toLowerCase().includes(name.toLowerCase())
    );
    if (found) return found;
  }

  // Fallback to any English voice
  const enVoice = voices.find((v) => v.lang.startsWith("en"));
  return enVoice || voices[0] || null;
}

/**
 * Stop any ongoing speech playback immediately
 */
export async function stopCelysVoice(): Promise<void> {
  isSpeakingState = false;
  stopHeartbeat();
  activeUtterances = [];

  // Stop Web Speech
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch { }
  }

  // Stop HTML Audio fallback
  if (audioFallback) {
    try {
      audioFallback.pause();
      audioFallback.src = "";
      audioFallback.onended = null;
      audioFallback.onerror = null;
    } catch { }
    audioFallback = null;
  }

  if (currentCallbacks?.onEnd) {
    try {
      currentCallbacks.onEnd();
    } catch { }
  }
  currentCallbacks = null;
}

/**
 * High-Reliability Speech Synthesizer for Celys Care
 * Compatible with Android APK, iOS App, Mobile Chrome, and Desktop
 */
export async function speakCelysVoice(
  rawText: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<void> {
  const cleanText = sanitizeSpeechText(rawText);
  if (!cleanText) {
    callbacks?.onEnd?.();
    return;
  }

  // Stop previous speech cleanly
  await stopCelysVoice();

  currentCallbacks = callbacks || null;
  isSpeakingState = true;

  // Check if Web Speech API is supported
  const hasSpeechSynthesis =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined";

  if (hasSpeechSynthesis) {
    speakWithWebSpeechEngine(cleanText);
  } else {
    speakWithAudioStreamFallback(cleanText);
  }
}

/**
 * Primary Engine: Native Web Speech API with Android queueing & lifecycle fixes
 */
function speakWithWebSpeechEngine(cleanText: string) {
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume();

    const clauses = splitIntoNaturalClauses(cleanText);
    const selectedVoice = getPreferredVoice(synth);

    let currentIndex = 0;
    let hasNotifiedStart = false;

    const playNextClause = () => {
      if (!isSpeakingState || currentIndex >= clauses.length) {
        isSpeakingState = false;
        stopHeartbeat();
        activeUtterances = [];
        currentCallbacks?.onEnd?.();
        currentCallbacks = null;
        return;
      }

      const textChunk = clauses[currentIndex];
      currentIndex++;

      const utterance = new SpeechSynthesisUtterance(textChunk);
      utterance.rate = 0.95; // slightly slower, calming pace
      utterance.pitch = 1.05; // warm feminine tone
      utterance.volume = 1.0;
      utterance.lang = "en-US";

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        if (!hasNotifiedStart) {
          hasNotifiedStart = true;
          currentCallbacks?.onStart?.();
        }
      };

      utterance.onend = () => {
        // Small 80ms natural breath pause between clauses
        setTimeout(() => {
          if (isSpeakingState) {
            playNextClause();
          }
        }, 80);
      };

      utterance.onerror = (e) => {
        // If interrupted due to cancel, do not treat as fatal error
        if (e.error === "interrupted" || e.error === "canceled") {
          return;
        }
        console.warn("SpeechSynthesis clause notice, proceeding to next clause:", e);
        if (isSpeakingState) {
          playNextClause();
        }
      };

      // Keep strong reference in global array to prevent GC on Android Chromium
      activeUtterances.push(utterance);
      (window as any).__celysActiveUtterance = utterance;

      synth.speak(utterance);
    };

    startHeartbeat();
    playNextClause();
  } catch (error) {
    console.warn("Web Speech API failed, falling back to Audio Stream:", error);
    speakWithAudioStreamFallback(cleanText);
  }
}

/**
 * Secondary Fallback: High-Definition Audio Stream with Absolute URL resolution
 */
function speakWithAudioStreamFallback(cleanText: string) {
  try {
    const clauses = splitIntoNaturalClauses(cleanText);
    let currentIndex = 0;
    let hasNotifiedStart = false;

    const playNextAudio = () => {
      if (!isSpeakingState || currentIndex >= clauses.length) {
        isSpeakingState = false;
        audioFallback = null;
        currentCallbacks?.onEnd?.();
        currentCallbacks = null;
        return;
      }

      const textChunk = clauses[currentIndex];
      currentIndex++;

      // Construct safe URL (supports both local web and mobile relative paths)
      const baseUrl =
        typeof window !== "undefined" && window.location.origin && !window.location.origin.includes("localhost")
          ? window.location.origin
          : "";
      const streamUrl = `${baseUrl}/api/tts?text=${encodeURIComponent(textChunk)}`;

      const audio = new Audio();
      audio.src = streamUrl;
      audio.preload = "auto";
      audio.playbackRate = 0.98;
      audioFallback = audio;

      audio.onplay = () => {
        if (!hasNotifiedStart) {
          hasNotifiedStart = true;
          currentCallbacks?.onStart?.();
        }
      };

      audio.onended = () => {
        playNextAudio();
      };

      audio.onerror = () => {
        console.warn("Audio stream error for chunk, advancing:", textChunk);
        playNextAudio();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay block or network error:", err);
          playNextAudio();
        });
      }
    };

    playNextAudio();
  } catch (err) {
    console.error("All speech synthesis options exhausted:", err);
    currentCallbacks?.onError?.(err);
    currentCallbacks?.onEnd?.();
    isSpeakingState = false;
    currentCallbacks = null;
  }
}


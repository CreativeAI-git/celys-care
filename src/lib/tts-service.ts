/**
 * High-Definition Unified Text-To-Speech Service for Celys Care
 * Compatible with Android APK, iOS App, and Desktop/Mobile Web
 */

let activeAudio: HTMLAudioElement | null = null;
let currentSentenceQueue: string[] = [];
let isSpeechActive = false;
let currentCallbacks: {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
} | null = null;

/**
 * Clean text of emojis, markdown, symbols, and formatting
 */
export function sanitizeSpeechText(rawText: string): string {
  return rawText
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✦🌸💜🌿✨☀️🌊🦁·•—*_~`#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split text into short natural phrases (< 140 characters) for continuous playback
 */
function splitIntoAudioChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if (trimmed.length <= 140) {
      chunks.push(trimmed);
    } else {
      // Split long sentence by commas or words
      const words = trimmed.split(" ");
      let current = "";
      for (const w of words) {
        if ((current + " " + w).trim().length <= 140) {
          current = (current + " " + w).trim();
        } else {
          if (current) chunks.push(current);
          current = w;
        }
      }
      if (current) chunks.push(current);
    }
  }

  return chunks.length > 0 ? chunks : [text];
}

/**
 * Stop any ongoing audio/speech playback immediately
 */
export async function stopCelysVoice(): Promise<void> {
  currentSentenceQueue = [];
  isSpeechActive = false;

  // 1. Stop active HTML5 audio
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.src = "";
      activeAudio.onended = null;
      activeAudio.onerror = null;
    } catch { }
    activeAudio = null;
  }

  // 2. Stop Web Speech API fallback if running
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch { }
  }

  if (currentCallbacks?.onEnd) {
    currentCallbacks.onEnd();
  }
  currentCallbacks = null;
}

/**
 * Speak text using High-Definition MP3 Audio Stream from /api/tts
 * with Web Speech API offline fallback
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

  // Always reset previous speech
  await stopCelysVoice();

  currentCallbacks = callbacks || null;
  currentSentenceQueue = splitIntoAudioChunks(cleanText);
  isSpeechActive = true;

  let hasNotifiedStart = false;

  const playNextSentence = () => {
    if (!isSpeechActive || currentSentenceQueue.length === 0) {
      isSpeechActive = false;
      activeAudio = null;
      currentCallbacks?.onEnd?.();
      currentCallbacks = null;
      return;
    }

    const phrase = currentSentenceQueue.shift();
    if (!phrase) {
      playNextSentence();
      return;
    }

    // High quality server-proxied MP3 stream URL
    const audioUrl = `/api/tts?text=${encodeURIComponent(phrase)}`;

    try {
      const audio = new Audio();
      audio.src = audioUrl;
      audio.preload = "auto";
      audio.playbackRate = 0.98;
      activeAudio = audio;

      audio.onplay = () => {
        if (!hasNotifiedStart) {
          hasNotifiedStart = true;
          currentCallbacks?.onStart?.();
        }
      };

      audio.onended = () => {
        playNextSentence();
      };

      audio.onerror = () => {
        console.warn("Audio stream notice, falling back to Web Speech for phrase:", phrase);
        playWithWebSpeech(phrase, () => playNextSentence());
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay block or network error, falling back to Web Speech:", err);
          playWithWebSpeech(phrase, () => playNextSentence());
        });
      }
    } catch {
      playWithWebSpeech(phrase, () => playNextSentence());
    }
  };

  playNextSentence();
}

/**
 * Device-local Web Speech fallback
 */
function playWithWebSpeech(text: string, onComplete: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onComplete();
    return;
  }

  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      const preferred =
        voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Zira"))) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
      if (preferred) {
        utterance.voice = preferred;
      }
    }

    utterance.onend = () => {
      onComplete();
    };

    utterance.onerror = () => {
      onComplete();
    };

    (window as any).__celysActiveUtterance = utterance;
    synth.speak(utterance);
  } catch {
    onComplete();
  }
}

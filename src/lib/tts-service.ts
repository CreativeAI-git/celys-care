import { Capacitor } from "@capacitor/core";

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: any = null;

/**
 * Clean text of emojis, markdown, symbols, and formatting before speaking
 */
export function sanitizeSpeechText(rawText: string): string {
  return rawText
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✦🌸💜🌿✨☀️🌊🦁·•—*_~`#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Stop any ongoing speech playback immediately
 */
export async function stopCelysVoice(): Promise<void> {
  // 1. Stop HTML5 Audio if playing
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio.onended = null;
      currentAudio.onerror = null;
    } catch { }
    currentAudio = null;
  }

  // 2. Stop Web Speech API
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch { }
    try {
      (window as any).__activeUtterance = null;
    } catch { }
  }

  currentUtterance = null;
}

/**
 * Split text into chunks suitable for audio streaming (< 150 chars per chunk)
 */
function splitTextIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if (trimmed.length <= 150) {
      chunks.push(trimmed);
    } else {
      // Split long sentence by commas or spaces
      const words = trimmed.split(" ");
      let current = "";
      for (const word of words) {
        if ((current + " " + word).trim().length <= 150) {
          current = (current + " " + word).trim();
        } else {
          if (current) chunks.push(current);
          current = word;
        }
      }
      if (current) chunks.push(current);
    }
  }

  return chunks.length > 0 ? chunks : [text];
}

/**
 * Speak text reliably across Android APK, iOS, and Browser
 * Uses High-Quality Natural Audio Stream + Web Speech API Fallback
 * Zero extra npm package dependency required!
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

  await stopCelysVoice();

  const chunks = splitTextIntoChunks(cleanText);
  let chunkIndex = 0;
  let hasStarted = false;

  const playNextChunk = () => {
    if (chunkIndex >= chunks.length) {
      currentAudio = null;
      callbacks?.onEnd?.();
      return;
    }

    const chunk = chunks[chunkIndex++];
    const encodedText = encodeURIComponent(chunk);
    // Reliable, natural, high-definition TTS audio endpoint supported natively by all HTML5 browsers and Android WebViews
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodedText}`;

    try {
      const audio = new Audio(audioUrl);
      audio.crossOrigin = "anonymous";
      audio.playbackRate = 0.96;
      currentAudio = audio;

      audio.onplay = () => {
        if (!hasStarted) {
          hasStarted = true;
          callbacks?.onStart?.();
        }
      };

      audio.onended = () => {
        playNextChunk();
      };

      audio.onerror = () => {
        // If audio stream fails (offline or blocked), fallback smoothly to Web Speech API
        console.warn("Audio stream notice, attempting Web Speech API fallback...");
        fallbackToWebSpeech(cleanText, callbacks);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          fallbackToWebSpeech(cleanText, callbacks);
        });
      }
    } catch {
      fallbackToWebSpeech(cleanText, callbacks);
    }
  };

  playNextChunk();
}

/**
 * Offline/Device Fallback using Web Speech API
 */
function fallbackToWebSpeech(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    callbacks?.onEnd?.();
    return;
  }

  try {
    const synth = window.speechSynthesis;
    synth.cancel();

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

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      (window as any).__activeUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      (window as any).__activeUtterance = null;
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    currentUtterance = utterance;
    (window as any).__activeUtterance = utterance;
    synth.resume();
    synth.speak(utterance);
  } catch (e) {
    callbacks?.onError?.(e);
    callbacks?.onEnd?.();
  }
}

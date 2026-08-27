import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

let activeAudioElement: HTMLAudioElement | null = null;
let isNativeSpeaking = false;

/**
 * Clean text of emojis, symbols, and formatting before speaking
 */
export function sanitizeSpeechText(rawText: string): string {
  return rawText
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✦🌸💜🌿✨☀️🌊🦁·•—*_~`#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Stop any ongoing speech (Native Capacitor, Web Speech, or HTML5 Audio)
 */
export async function stopCelysVoice(): Promise<void> {
  // 1. Stop Native Capacitor TTS
  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.stop();
    } catch { }
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

  // 3. Stop HTML5 Audio if any
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch { }
    activeAudioElement = null;
  }

  isNativeSpeaking = false;
}

/**
 * Play speech natively on Android/iOS APK, with automatic Web Speech fallback
 */
export async function speakCelysVoice(
  rawText: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<void> {
  const text = sanitizeSpeechText(rawText);
  if (!text) {
    callbacks?.onEnd?.();
    return;
  }

  // Always cancel any existing playback first
  await stopCelysVoice();

  // =========================================================================
  // 1. Native Capacitor Platform (Android APK & iOS App)
  // Uses Android TextToSpeech / iOS AVSpeechSynthesizer natively
  // =========================================================================
  if (Capacitor.isNativePlatform()) {
    try {
      callbacks?.onStart?.();
      isNativeSpeaking = true;

      await TextToSpeech.speak({
        text,
        lang: "en-US",
        rate: 0.95,
        pitch: 1.05,
        volume: 1.0,
        category: "ambient",
      });

      isNativeSpeaking = false;
      callbacks?.onEnd?.();
      return;
    } catch (nativeErr) {
      console.warn("Capacitor Native TTS error, falling back to Web Speech:", nativeErr);
      isNativeSpeaking = false;
    }
  }

  // =========================================================================
  // 2. Web Speech API (Browser & Web Fallback)
  // =========================================================================
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
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

      (window as any).__activeUtterance = utterance;
      synth.resume();
      synth.speak(utterance);
      return;
    } catch (webSpeechErr) {
      console.error("Web Speech API error:", webSpeechErr);
      callbacks?.onError?.(webSpeechErr);
      callbacks?.onEnd?.();
    }
  } else {
    callbacks?.onEnd?.();
  }
}

/**
 * Unified Text-To-Speech Service for Celys Care
 * Compatible with Android System WebView, iOS WebKit (Safari), and Desktop Browsers
 */

let activeUtterances: SpeechSynthesisUtterance[] = [];
let speechQueue: string[] = [];
let isSpeakingActive = false;
let currentCallbacks: {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
} | null = null;
let heartbeatInterval: any = null;

/**
 * Clean text of emojis, markdown asterisks, hashtags, and special symbols
 */
export function sanitizeSpeechText(rawText: string): string {
  return rawText
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✦🌸💜🌿✨☀️🌊🦁·•—*_~`#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split text into short, natural sentences so mobile WebViews never freeze or cut off audio
 */
function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!matches || matches.length === 0) return [text];
  
  const results: string[] = [];
  for (const part of matches) {
    const trimmed = part.trim();
    if (trimmed.length > 0) {
      results.push(trimmed);
    }
  }
  return results.length > 0 ? results : [text];
}

/**
 * Find the best natural English voice available on device
 */
function getBestEnglishVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. High quality natural English voices
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Female") ||
        v.name.includes("Natural") ||
        v.name.includes("Google") ||
        v.name.includes("Samantha") ||
        v.name.includes("Victoria") ||
        v.name.includes("Karen") ||
        v.name.includes("Moira") ||
        v.name.includes("Zira"))
  );
  if (preferred) return preferred;

  // 2. Any English voice
  const anyEnglish = voices.find((v) => v.lang.startsWith("en"));
  if (anyEnglish) return anyEnglish;

  return voices[0] || null;
}

/**
 * Stop any active speech immediately
 */
export async function stopCelysVoice(): Promise<void> {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }

  speechQueue = [];
  isSpeakingActive = false;
  activeUtterances = [];

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch { }
    try {
      (window as any).__celysActiveUtterance = null;
    } catch { }
  }

  if (currentCallbacks?.onEnd) {
    currentCallbacks.onEnd();
  }
  currentCallbacks = null;
}

/**
 * Speak text smoothly and reliably on Android APK, iOS Safari, and Desktop
 */
export async function speakCelysVoice(
  rawText: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    callbacks?.onEnd?.();
    return;
  }

  const cleanText = sanitizeSpeechText(rawText);
  if (!cleanText) {
    callbacks?.onEnd?.();
    return;
  }

  // Cancel any ongoing speech first
  await stopCelysVoice();

  const synth = window.speechSynthesis;
  currentCallbacks = callbacks || null;
  speechQueue = splitIntoSentences(cleanText);

  // Resume audio subsystem (required on Android/iOS after gesture)
  try {
    synth.cancel();
    synth.resume();
  } catch { }

  let hasNotifiedStart = false;

  const playNextSentence = () => {
    if (speechQueue.length === 0) {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      isSpeakingActive = false;
      activeUtterances = [];
      (window as any).__celysActiveUtterance = null;
      currentCallbacks?.onEnd?.();
      currentCallbacks = null;
      return;
    }

    const sentence = speechQueue.shift();
    if (!sentence) {
      playNextSentence();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    const voice = getBestEnglishVoice(synth);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (!hasNotifiedStart) {
        hasNotifiedStart = true;
        isSpeakingActive = true;
        currentCallbacks?.onStart?.();
      }
    };

    utterance.onend = () => {
      // Move to next sentence
      playNextSentence();
    };

    utterance.onerror = (event) => {
      console.warn("Speech utterance event:", event);
      playNextSentence();
    };

    // Store reference on window to prevent Garbage Collector from silencing audio on Android
    activeUtterances.push(utterance);
    (window as any).__celysActiveUtterance = utterance;

    try {
      synth.resume();
      synth.speak(utterance);
    } catch (e) {
      console.error("SpeechSynthesis speak error:", e);
      playNextSentence();
    }
  };

  // Start heartbeat interval to prevent Chrome/Android WebView 15-second speech pause bug
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 10000);

  playNextSentence();
}

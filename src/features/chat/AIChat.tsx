/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Volume2, VolumeX, Trash2 } from "lucide-react";
import { useAuth } from "@/app/providers";
import { useAccessibility } from "@/context/AccessibilityContext";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { audioSynth } from "@/lib/audio-synth";
import { speakCelysVoice, stopCelysVoice, unlockAudioContext } from "@/lib/tts-service";

interface Message {
  id: string;
  from: "celys" | "user";
  text: string;
  timestamp?: string;
}

const QUICK_PROMPTS = [
  "I'm feeling overwhelmed today",
  "Can you guide me through anxiety?",
  "I need a gentle pep talk",
  "Help me practice gratitude",
  "I can't fall asleep",
];

const getUserGreetingName = (user: any) => {
  if (user?.displayName && user.displayName.trim() && user.displayName.toLowerCase() !== "beautiful soul") {
    return user.displayName.trim();
  }
  if (user?.email) {
    const namePart = user.email.split("@")[0].replace(/[._-]/g, " ");
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }
  return "beautiful soul";
};

const getInitialMessages = (user?: any): Message[] => [
  {
    id: "init_1",
    from: "celys",
    text: `Hello ${getUserGreetingName(user)} 💜 I am Celys, your AI wellness companion. I'm here to listen without judgment. How are you holding up today?`,
    timestamp: "Just now",
  },
];

export const AIChat: React.FC = () => {
  const { user } = useAuth();
  const { currentTheme } = useAccessibility();
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("celys_chat_history");
        return saved ? JSON.parse(saved) : getInitialMessages();
      } catch {
        return getInitialMessages();
      }
    }
    return getInitialMessages();
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("celys_voice_enabled");
      return saved === null ? true : saved === "true";
    }
    return true;
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const promptScrollRef = useRef<HTMLDivElement>(null);

  // Pre-load and cache voices for Android WebView & iOS WebKit
  useEffect(() => {
    unlockAudioContext();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          try {
            window.speechSynthesis.getVoices();
          } catch { }
        };
      } catch { }
    }
    return () => {
      stopSpeaking();
    };
  }, []);

  // Drag to scroll handling for quick prompt slider
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);
  const hasDragged = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!promptScrollRef.current) return;
    isDown.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - promptScrollRef.current.offsetLeft;
    scrollLeftVal.current = promptScrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !promptScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - promptScrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    promptScrollRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (promptScrollRef.current && e.deltaY !== 0) {
      promptScrollRef.current.scrollLeft += e.deltaY * 0.8;
    }
  };

  const onPromptClick = (promptText: string) => {
    if (hasDragged.current) return;
    unlockAudioContext();
    handleSend(promptText);
  };

  // Sync greeting when user loads
  useEffect(() => {
    if (user) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === "init_1") {
          return getInitialMessages(user);
        }
        return prev;
      });
    }
  }, [user]);

  // Sync to localStorage and auto-scroll to bottom
  useEffect(() => {
    try {
      localStorage.setItem("celys_chat_history", JSON.stringify(messages));
    } catch { }
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const stopSpeaking = async () => {
    await stopCelysVoice();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  // Robust Text-To-Speech function with Android Native TTS & Web Speech support
  const speakText = async (text: string, messageId?: string, forceSpeak: boolean = false) => {
    if (!voiceEnabled && !forceSpeak) {
      return;
    }

    unlockAudioContext();
    await speakCelysVoice(text, {
      onStart: () => {
        setIsSpeaking(true);
        if (messageId) setSpeakingMessageId(messageId);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      },
      onError: (err) => {
        console.warn("Speech playback notice:", err);
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      },
    });
  };

  const toggleVoice = () => {
    unlockAudioContext();
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    localStorage.setItem("celys_voice_enabled", String(next));
    if (!next) {
      stopSpeaking();
    } else {
      // Find latest celys message and speak it for instant audio confirmation
      const lastCelysMsg = [...messages].reverse().find((m) => m.from === "celys");
      if (lastCelysMsg) {
        speakText(lastCelysMsg.text, lastCelysMsg.id, true);
      }
    }
    audioSynth?.playPopSound(520);
  };

  const generateAIResponse = (userText: string): string => {
    const lower = userText.toLowerCase().trim();

    // 1. Morning greetings
    if (/\b(good\s*morning|morning|shubh\s*prabhat)\b/i.test(lower)) {
      return "Good morning! 🌅 Wishing you a gentle, grounded start to your day. Have you taken a deep mindful breath this morning?";
    }

    // 2. Evening / Night greetings
    if (/\b(good\s*night|goodnight|shubh\s*ratri)\b/i.test(lower)) {
      return "Good night! 🌙 Let the day's weight dissolve into the twilight. Sleep peacefully knowing you are safe and valued.";
    }
    if (/\b(good\s*evening)\b/i.test(lower)) {
      return "Good evening, beautiful soul. ✨ As the day winds down, release whatever you've been carrying. How are you feeling right now?";
    }

    // 3. Casual Greetings ("hi", "hello", "hey", "hlo", "hii", "namaste", "yo")
    if (/\b(hi|hello|hey|hii|heyy|hlo|hola|namaste|yo|greetings|wassup|sup)\b/i.test(lower)) {
      const greetings = [
        "Hello! 🌸 I'm Celys, your wellness companion. It is so wonderful to connect with you. How is your heart feeling today?",
        "Hi there! ✨ Welcome to your quiet sanctuary. I'm right here listening without judgment. How has your day been?",
        "Hey beautiful soul! 💜 I'm so glad you stopped by. What is on your mind right now?",
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // 4. Inquiries ("How are you", "Kaise ho")
    if (/\b(how\s*(are|r)\s*(you|u)|how('?s| is)\s*it\s*going|kaise\s*ho|kese\s*ho|kya\s*hal|whats\s*up|what's\s*up)\b/i.test(lower)) {
      return "I'm feeling peaceful, calm, and truly grateful to hold this safe space with you. 💜 More importantly, how has your day been treating you?";
    }

    // 5. Identity ("Who are you", "What can you do")
    if (/\b(who\s*(are|r)\s*(you|u)|what\s*(are|r)\s*(you|u)|what\s*can\s*you\s*do|tum\s*kaun\s*ho|aap\s*kaun\s*ho)\b/i.test(lower)) {
      return "I am Celys, your personal AI wellness and mindfulness companion. 🌸 I'm here 24/7 to listen without judgment, guide you through anxiety and stress, share uplifting affirmations, walk you through calming breathwork, or simply keep you company whenever you need a safe sanctuary.";
    }

    if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("panic") || lower.includes("overwhelm")) {
      return "I hear the weight in your words, and I want to remind you: you are safe in this moment. Place one hand on your heart and feel your breath. Would you like to do a quick 4-4-6 breathing exercise together or simply release what's on your mind? 🌸";
    }

    if (lower.includes("sad") || lower.includes("lonely") || lower.includes("crying") || lower.includes("depressed")) {
      return "It is completely okay to feel this sadness. You do not have to carry the whole world alone. Your feelings are real, valid, and worthy of gentle tenderness. I am right here beside you. 💜";
    }

    if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("tired") || lower.includes("night")) {
      return "Let's help your body unwind. Release your shoulders down, soften your jaw, and let today's responsibilities wait for tomorrow. Would listening to gentle ocean rain or ambient frequencies help soothe your mind tonight? 🌙";
    }

    if (lower.includes("pep talk") || lower.includes("motivat") || lower.includes("doubt") || lower.includes("confidence")) {
      return "Look how far you have already come. You have survived 100% of your hardest days. You carry quiet, unshakable strength inside you — like a lion resting before sunrise. Believe in your radiant light today! ✨🦁";
    }

    if (lower.includes("gratitude") || lower.includes("thank") || lower.includes("happy")) {
      return "Cultivating gratitude opens space for peace to bloom. What is one small moment or blessing today that brought warmth to your spirit? 🌿";
    }

    const fallbacks = [
      "I hear you, and whatever you are experiencing right now is completely welcome in this sanctuary. 🌸 Tell me a little more—how does that feel inside your body?",
      "Thank you for sharing that with me. You have my full attention and zero judgment. What would feel most comforting or nourishing for you right now? 💜",
      "I am right here with you. Let's take this one breath at a time. Would you like an uplifting affirmation, a gentle reflection question, or simply a safe space to vent? ✨",
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isTyping) return;

    if (!customText) setInput("");

    // Prime & unlock audio on mobile gesture
    unlockAudioContext();
    audioSynth?.playPopSound(600);

    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: "usr_" + Date.now(),
      from: "user",
      text: textToSend,
      timestamp: nowTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textToSend }),
      });

      let replyText = "";
      if (res.ok) {
        const data = await res.json();
        replyText = data.assistantMessage?.content || generateAIResponse(textToSend);
      } else {
        replyText = generateAIResponse(textToSend);
      }
      setTimeout(() => {
        const assistantMsg: Message = {
          id: "celys_" + Date.now(),
          from: "celys",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
        audioSynth?.playPopSound(720);
        speakText(replyText, assistantMsg.id);
      }, 700);
    } catch {
      setTimeout(() => {
        const fallbackText = generateAIResponse(textToSend);
        const assistantMsg: Message = {
          id: "celys_" + Date.now(),
          from: "celys",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
        audioSynth?.playPopSound(720);
        speakText(fallbackText, assistantMsg.id);
      }, 700);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages(getInitialMessages(user));
    audioSynth?.playPopSound(380);
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto px-2 sm:px-3 pt-1 pb-1 justify-between overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col items-center text-center py-1 flex-shrink-0 relative w-full">
        <h2
          className="font-serif text-xl sm:text-2xl font-bold tracking-wide"
          style={{
            background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px rgba(245, 215, 110, 0.25)",
          }}
        >
          Celys Care Chat
        </h2>
        <p className="text-[11px] text-purple-200/60 mt-0.5">
          Your judgment-free companion
        </p>
        <SparkleDivider className="my-1.5" />
      </div>

      {/* Online Status & Audio Controls Banner */}
      <div
        className="flex items-center justify-between px-3 py-1.5 rounded-2xl mb-1 flex-shrink-0"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(180, 120, 255, 0.15)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-[#f5d76e] animate-ping" : "bg-emerald-400 animate-pulse"}`} />
          <span className="text-[11px] font-medium" style={{ color: isSpeaking ? "#f5d76e" : "rgba(240,232,255,0.7)" }}>
            {isSpeaking ? "Celys is Speaking…" : "Celys Companion is Online"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Text-to-Speech Voice Toggle */}
          <button
            onClick={toggleVoice}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${isSpeaking ? "animate-pulse ring-2 ring-[#f5d76e]/60 bg-[#f5d76e]/20" : "hover:bg-white/10"
              }`}
            style={{
              background: voiceEnabled ? "rgba(245,215,110,0.18)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${voiceEnabled ? "rgba(245,215,110,0.45)" : "rgba(180,120,255,0.2)"}`,
            }}
            title={
              voiceEnabled
                ? isSpeaking
                  ? "Click to Silence Voice"
                  : "Voice Audio Enabled (Click to Mute)"
                : "Voice Muted (Click to Read Aloud)"
            }
          >
            {voiceEnabled ? (
              <Volume2 size={13} className="text-[#f5d76e]" />
            ) : (
              <VolumeX size={13} className="text-purple-200/40" />
            )}
          </button>

          {/* Clear Conversation */}
          <button
            onClick={clearChat}
            className="p-1.5 rounded-full transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(180,120,255,0.2)",
            }}
            title="Clear conversation"
          >
            <Trash2 size={13} className="text-purple-200/40 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5 my-1 pr-1.5 p-2.5 rounded-2xl scroll-smooth transition-all duration-300"
        style={{
          background: currentTheme.cardBg,
          border: `1px solid ${currentTheme.cardBorder}`,
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2 ${m.from === "user" ? "flex-row-reverse" : "flex-row"
              }`}
          >
            {m.from === "celys" && (
              <div
                className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5 relative shadow-md"
                style={{ border: "1.5px solid rgba(201,162,39,0.55)" }}
              >
                <img
                  src="/images/profile.jpg?v=7"
                  alt="Celys"
                  className="w-full h-full object-cover rounded-full block"
                  loading="eager"
                />
              </div>
            )}
            <div className="flex flex-col max-w-[85%]">
              <div
                onClick={() => {
                  if (m.from === "celys") {
                    if (speakingMessageId === m.id) {
                      stopSpeaking();
                    } else {
                      speakText(m.text, m.id, true);
                    }
                  }
                }}
                className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words relative transition-all ${m.from === "celys" ? "cursor-pointer hover:brightness-105" : ""
                  }`}
                style={{
                  background:
                    m.from === "celys"
                      ? speakingMessageId === m.id
                        ? "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))"
                        : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))"
                      : currentTheme.navActiveGradient,
                  border: `1px solid ${m.from === "celys"
                    ? speakingMessageId === m.id
                      ? "rgba(245,215,110,0.6)"
                      : currentTheme.border
                    : currentTheme.borderStrong
                    }`,
                  color: "#f0e8ff",
                  borderTopLeftRadius: m.from === "celys" ? 4 : 16,
                  borderTopRightRadius: m.from === "user" ? 4 : 16,
                  boxShadow: m.from === "user" ? `0 0 14px ${currentTheme.glow}` : speakingMessageId === m.id ? "0 0 16px rgba(245,215,110,0.25)" : "none",
                }}
              >
                <span>{m.text}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 px-1">
                {m.timestamp && (
                  <span
                    className={`text-[9px] ${m.from === "user" ? "ml-auto" : "mr-auto"}`}
                    style={{ color: "rgba(240,232,255,0.35)" }}
                  >
                    {m.timestamp}
                  </span>
                )}
                {m.from === "celys" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (speakingMessageId === m.id) {
                        stopSpeaking();
                      } else {
                        speakText(m.text, m.id, true);
                      }
                    }}
                    className={`inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer ${speakingMessageId === m.id
                      ? "bg-[#f5d76e]/25 text-[#f5d76e] border-[#f5d76e]/50 animate-pulse"
                      : "bg-white/5 text-purple-200/60 border-purple-300/20 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    <Volume2 size={10} className={speakingMessageId === m.id ? "text-[#f5d76e]" : ""} />
                    <span>{speakingMessageId === m.id ? "Playing…" : "Read Aloud"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center">
            <div
              className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 relative"
              style={{ border: "1px solid rgba(201,162,39,0.5)" }}
            >
              <img
                src="/images/profile.jpg?v=7"
                alt="Celys"
                className="w-full h-full object-cover rounded-full block"
                loading="eager"
              />
            </div>
            <div
              className="px-3.5 py-2 rounded-2xl text-xs"
              style={{
                background: "rgba(124,58,237,0.25)",
                border: "1px solid rgba(124,58,237,0.35)",
                color: "rgba(240,232,255,0.7)",
              }}
            >
              <span className="inline-block animate-pulse">Celys is reflecting… ✦</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Prompt Free-Scrolling Slider (Exact Reference Match) */}
      <div className="relative my-1 w-full overflow-hidden flex-shrink-0">
        <div
          ref={promptScrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          className="flex gap-1.5 overflow-x-auto py-1 scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => onPromptClick(p)}
              className="text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all hover:bg-white/15 active:scale-95 flex-shrink-0 cursor-pointer"
              style={{
                background: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                color: "rgba(240,232,255,0.88)",
              }}
            >
              ✦ {p}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Bar */}
      <div className="flex items-center gap-2 pt-1 pb-1 flex-shrink-0 w-full">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Share what is on your heart…"
          className="flex-1 min-w-0 rounded-2xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-white/40"
          style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.cardBorder}`,
            color: "#f0e8ff",
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 cursor-pointer"
          style={{
            background: currentTheme.navActiveGradient,
            boxShadow: `0 0 14px ${currentTheme.glow}`,
          }}
          title="Send message"
        >
          <Send size={14} color="white" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;

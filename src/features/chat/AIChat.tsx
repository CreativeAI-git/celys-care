"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { useAuth } from "@/app/providers";

interface Message {
  id: string;
  from: "celys" | "user";
  text: string;
}

const INIT_MSGS: Message[] = [
  {
    id: "init-1",
    from: "celys",
    text: "Hello beautiful soul 💜 I'm Celys, your AI wellness companion. I'm here to listen without judgment. How are you feeling today?",
  },
  {
    id: "init-2",
    from: "user",
    text: "I've been feeling really stressed lately.",
  },
  {
    id: "init-3",
    from: "celys",
    text: "I hear you, and I want you to know that stress is a signal that you care deeply. You're not alone in this. Would you like to talk about what's been weighing on you, or would a breathing exercise help right now? 🌸",
  },
];

export const AIChat: React.FC = () => {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Message[]>(INIT_MSGS);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMsgs(
            data.messages.map((m: any) => ({
              id: m.id,
              from: m.fromUser ? "user" : "celys",
              text: m.content,
            }))
          );
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");

    const userMsg: Message = {
      id: "usr_" + Date.now(),
      from: "user",
      text,
    };
    setMsgs((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (res.ok) {
        const data = await res.json();
        setMsgs((m) => [
          ...m,
          {
            id: data.assistantMessage.id,
            from: "celys",
            text: data.assistantMessage.content,
          },
        ]);
      } else {
        setMsgs((m) => [
          ...m,
          {
            id: "reply_" + Date.now(),
            from: "celys",
            text: "Thank you for sharing that with me. Your feelings are valid 💜 Let's take this one step at a time together 🌸",
          },
        ]);
      }
    } catch {
      setMsgs((m) => [
        ...m,
        {
          id: "reply_" + Date.now(),
          from: "celys",
          text: "I'm right here with you. Take a slow, deep breath with me. Inhale for 4... hold for 4... exhale for 6. You are safe here. 🌸",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMsgs(INIT_MSGS);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-3 w-full max-w-sm mx-auto" style={{ minHeight: 520 }}>
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-left">
          <h2
            className="font-serif text-xl font-bold tracking-wide"
            style={{
              background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Celys Care Chat
          </h2>
          <p className="text-[11px] text-purple-200/60 font-medium">
            Your judgment-free companion
          </p>
        </div>
        {msgs.length > INIT_MSGS.length && (
          <button
            onClick={clearHistory}
            className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 transition-all hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(180,120,255,0.2)",
              color: "rgba(240,232,255,0.5)",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {!user && (
        <p className="text-[10px] mb-2 text-left text-purple-200/35">
          Log in to save your chat history
        </p>
      )}

      {/* Messages Scroll Area */}
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-2.5 mb-3 pr-1 py-2"
        style={{ maxHeight: 370 }}
      >
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2 ${
              m.from === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {m.from === "celys" && (
              <div
                className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1 relative"
                style={{ border: "1px solid rgba(201,162,39,0.5)" }}
              >
                <Image
                  src="/images/lion-emblem-hq.jpg"
                  alt="Celys"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div
              className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
              style={{
                background:
                  m.from === "celys"
                    ? "rgba(124,58,237,0.3)"
                    : "rgba(201,108,204,0.25)",
                border: `1px solid ${
                  m.from === "celys"
                    ? "rgba(124,58,237,0.4)"
                    : "rgba(201,108,204,0.4)"
                }`,
                color: "#f0e8ff",
                borderTopLeftRadius: m.from === "celys" ? 4 : 16,
                borderTopRightRadius: m.from === "user" ? 4 : 16,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 flex-row items-center">
            <div
              className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative"
              style={{ border: "1px solid rgba(201,162,39,0.5)" }}
            >
              <Image
                src="/images/lion-emblem-hq.jpg"
                alt="Celys"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="px-3.5 py-2 rounded-2xl text-xs"
              style={{
                background: "rgba(124,58,237,0.3)",
                border: "1px solid rgba(124,58,237,0.4)",
                color: "rgba(240,232,255,0.7)",
              }}
            >
              Celys is reflecting... ✦
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 mt-auto">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Share what's on your heart…"
          className="flex-1 rounded-2xl px-4 py-3 text-xs outline-none transition-all placeholder:text-purple-200/35"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(180,120,255,0.25)",
            color: "#f0e8ff",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #c96ccc, #7c3aed)",
            boxShadow: "0 2px 10px rgba(201,108,204,0.3)",
          }}
        >
          <Send size={15} color="white" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;

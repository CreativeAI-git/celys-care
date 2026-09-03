import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ChatMessageSchema } from "@/validations/wellness";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "harm myself",
  "want to die",
  "take my own life",
  "cutting myself",
  "self-harm",
  "hang myself",
  "overdose",
];

const GREETING_REPLIES = [
  "Hello! 🌸 I'm Celys, your wellness companion. It is so wonderful to connect with you. How is your heart feeling today?",
  "Hi there! ✨ Welcome to your quiet sanctuary. I'm right here listening without judgment. How has your day been?",
  "Hey beautiful soul! 💜 I'm so glad you stopped by. What is on your mind right now?",
  "Hello! 🌿 Taking a moment to pause and check in with yourself is a gift. How are you feeling today?",
];

const HOW_ARE_YOU_REPLIES = [
  "I'm feeling peaceful, grounded, and truly grateful to hold this safe space with you. 💜 More importantly, how has your day been treating you?",
  "I'm here, calm and present. How is your energy today—are you feeling refreshed, or has it been a bit heavy? 🌸",
  "Doing wonderful, thank you for asking! ✨ Tell me, how are things going in your world today?",
];

const GRATITUDE_REPLIES = [
  "You are so very welcome! 💜 Taking time for your inner peace is a beautiful act of self-love. I'm always right here whenever you need me.",
  "It is an absolute honor to walk alongside your journey. Breathe easy, beautiful soul! ✨",
  "Always here for you! Remember that your peace and well-being matter deeply. 🌸",
];

const COMPANION_KNOWLEDGE = [
  {
    category: "anxiety",
    keywords: ["anxious", "anxiety", "panic", "fear", "scared", "nervous", "shaking", "palpitations"],
    reply: "Take a slow, deep breath with me right now. Inhale for 4... hold for 4... and release for 6. 🌸\n\nYour nervous system is just trying to protect you, but right here in this moment, you are safe. Place a gentle hand on your heart and feel your own steady warmth. Would you like to do a 1-minute grounding exercise together, or try our Quiet Room sanctuary?",
    tone: "grounding",
  },
  {
    category: "overwhelm",
    keywords: ["overwhelm", "overwhelmed", "too much", "stress", "stressed", "exhausted", "burnout", "can't cope"],
    reply: "I hear you, and it makes complete sense that you feel overwhelmed. When everything pulls at you at once, remember: you do not have to carry the whole mountain today. Just take one tiny breath at a time.\n\nLet's put down the heavy things for just five minutes. What is one gentle thing you can do for your body right now—a sip of water, loosening your shoulders, or closing your eyes?",
    tone: "comforting",
  },
  {
    category: "sadness",
    keywords: ["sad", "depressed", "heavy", "crying", "hurt", "lonely", "alone", "hopeless", "grief"],
    reply: "Your feelings are completely valid, beautiful soul. It's okay not to be okay. You don't need to force a smile or rush through this heavy moment. I am here with you, holding this quiet space.\n\nImagine wrapped in a soft, luminous golden blanket. You are loved, you matter deeply, and this season will gently pass. ♡",
    tone: "compassionate",
  },
  {
    category: "sleep",
    keywords: ["sleep", "insomnia", "tired", "bedtime", "rest", "night", "can't sleep"],
    reply: "Let the day dissolve into the twilight. Everything that was done today is enough; everything left undone can wait for the dawn. 🌙\n\nClose your eyes, relax your jaw, unclench your hands, and let your pillow support your full weight. Would you like to listen to our Deep Forest or Celestial Harmony ambient soundscape as you drift off?",
    tone: "serene",
  },
  {
    category: "grounding",
    keywords: ["ground", "grounding", "54321", "focus", "dizzy", "unreal", "dissociating"],
    reply: "Let's do the 5-4-3-2-1 Grounding Practice together:\n\n👁️ Look around: Name 5 things you can see.\n✋ Touch: Notice 4 textures around you (your clothes, your chair).\n👂 Listen: Hear 3 distinct sounds.\n👃 Scent: Notice 2 subtle aromas.\n👅 Taste: Acknowledge 1 taste in your mouth.\n\nNotice how the earth beneath you is steady and holding you.",
    tone: "grounding",
  },
  {
    category: "affirmation",
    keywords: ["affirmation", "pep talk", "motivat", "inspire", "quote", "mantra", "positivity"],
    reply: "Here is an uplifting reminder for your soul today:\n\n'I am safe in my body, peaceful in my mind, and worthy of every good thing unfolding for me. I release what I cannot control and trust in my own quiet strength.' ✨\n\nClose your eyes and breathe that in gently.",
    tone: "uplifting",
  },
  {
    category: "boredom",
    keywords: ["bored", "boredom", "what should i do", "tell me a joke", "make me laugh"],
    reply: "Whenever your mind feels restless or bored, it's often a quiet invitation to reset. 🌿\n\nWhy did the meditator refuse Novocain at the dentist? ... Because they wanted to transcend dental medication! 😄\n\nWould you like to try popping bubbles in our tactile Bubble Game, explore your constellation on Soul Map, or try a 2-minute breathing visualizer?",
    tone: "playful-comfort",
  },
];

async function generateCompanionReply(
  userText: string
): Promise<{ reply: string; tone: string; isCrisis: boolean }> {
  const trimmed = userText.trim();
  const lower = trimmed.toLowerCase();

  // 1. Safety Check: Crisis trigger
  const isCrisisTrigger = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
  if (isCrisisTrigger) {
    return {
      reply: `Please know that your life is deeply precious and you do not have to carry this pain alone. Immediate, confidential, free support is available 24/7:

📞 988 Suicide & Crisis Lifeline: Call or text 988 (US & Canada)
💬 Crisis Text Line: Text HOME to 741741
🌍 International Resources: https://findahelpline.com
🚨 If you are in immediate physical danger, please call your local emergency services (911 / 999 / 112).

Please reach out to a trusted professional, counselor, or loved one right away. We care about you deeply. ♡`,
      tone: "crisis-support",
      isCrisis: true,
    };
  }

  // 2. Google Gemini API (Free Tier from Google AI Studio: https://aistudio.google.com/)
  const geminiKey = process.env.GEMINI_API_KEY || (process.env.AI_API_KEY?.startsWith("AIza") ? process.env.AI_API_KEY : null);
  if (geminiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are Celys Care, a compassionate, soothing, and therapeutic AI mindfulness companion. Always speak with warm, gentle, empathetic, and grounding wisdom. Keep your answers concise (2 to 4 sentences max). If the user greets with 'hi', 'hello', or casual remarks, greet them back warmly and ask how their heart or day is feeling. Never sound clinical, robotic, or detached.",
              },
            ],
          },
          contents: [{ parts: [{ text: trimmed }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        }),
      });
      clearTimeout(timeoutId);

      if (geminiRes.ok) {
        const gData = await geminiRes.json();
        const content = gData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (content) {
          return { reply: content, tone: "gemini-ai", isCrisis: false };
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, using companion synthesizer fallback:", e);
    }
  }

  // 3. Groq API (Free Tier from https://console.groq.com/)
  if (process.env.GROQ_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are Celys Care, a compassionate, soothing, and therapeutic AI mindfulness companion. Always speak with warm, gentle, empathetic, and grounding wisdom. Keep answers concise (2 to 4 sentences max). For greetings like 'hi' or 'hello', reply warmly and ask how their day or heart is feeling.",
            },
            { role: "user", content: trimmed },
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });
      clearTimeout(timeoutId);

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const content = groqData.choices?.[0]?.message?.content?.trim();
        if (content) {
          return { reply: content, tone: "groq-ai", isCrisis: false };
        }
      }
    } catch (e) {
      console.warn("Groq API call failed, using companion synthesizer fallback:", e);
    }
  }

  // 4. Custom OpenAI Compatible API
  if (process.env.AI_API_KEY && process.env.AI_ENDPOINT && !geminiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const aiRes = await fetch(process.env.AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are Celys Care, a compassionate mindfulness and mental wellness companion. You speak with warm, gentle, grounding, therapeutic wisdom. Keep answers concise (2-4 sentences). Always greet users warmly when they say hi or hello.",
            },
            { role: "user", content: trimmed },
          ],
          temperature: 0.7,
        }),
      });
      clearTimeout(timeoutId);

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const content = aiData.choices?.[0]?.message?.content?.trim();
        if (content) {
          return { reply: content, tone: "mindful-ai", isCrisis: false };
        }
      }
    } catch (e) {
      console.warn("External AI call failed, using companion synthesizer fallback:", e);
    }
  }

  // 5. Intelligent Conversational Companion Synthesizer

  // 5A. Morning Greetings
  if (/\b(good\s*morning|morning|shubh\s*prabhat)\b/i.test(lower)) {
    return {
      reply: "Good morning! 🌅 Wishing you a gentle, grounded start to your day. Have you taken a deep mindful breath this morning?",
      tone: "greeting",
      isCrisis: false,
    };
  }

  // 5B. Evening / Night Greetings
  if (/\b(good\s*night|goodnight|shubh\s*ratri)\b/i.test(lower)) {
    return {
      reply: "Good night! 🌙 Let the day's weight gently dissolve into the twilight. Sleep peacefully knowing you are safe and valued.",
      tone: "serene",
      isCrisis: false,
    };
  }
  if (/\b(good\s*evening)\b/i.test(lower)) {
    return {
      reply: "Good evening, beautiful soul. ✨ As the sky turns to dusk, release whatever you've been carrying today. How are you feeling right now?",
      tone: "greeting",
      isCrisis: false,
    };
  }

  // 5C. General Friendly Greetings ("hi", "hello", "hey", "hlo", "hii", "namaste", "yo")
  if (/\b(hi|hello|hey|hii|heyy|hlo|hola|namaste|yo|greetings|wassup|sup)\b/i.test(lower)) {
    const chosen = GREETING_REPLIES[Math.floor(Math.random() * GREETING_REPLIES.length)];
    return {
      reply: chosen,
      tone: "greeting",
      isCrisis: false,
    };
  }

  // 5D. Inquiries: "How are you", "Kaise ho", "Kya haal hai", "Kya chal raha"
  if (/\b(how\s*(are|r)\s*(you|u)|how('?s| is)\s*it\s*going|kaise\s*ho|kese\s*ho|kya\s*hal|kya\s*chal\s*raha|whats\s*up|what's\s*up)\b/i.test(lower)) {
    const chosen = HOW_ARE_YOU_REPLIES[Math.floor(Math.random() * HOW_ARE_YOU_REPLIES.length)];
    return {
      reply: chosen,
      tone: "friendly",
      isCrisis: false,
    };
  }

  // 5E. Identity: "Who are you", "What can you do"
  if (/\b(who\s*(are|r)\s*(you|u)|what\s*(are|r)\s*(you|u)|what\s*can\s*you\s*do|tum\s*kaun\s*ho|aap\s*kaun\s*ho|tell\s*me\s*about\s*yourself)\b/i.test(lower)) {
    return {
      reply: "I am Celys, your personal AI wellness and mindfulness companion. 🌸 I'm here 24/7 to listen without judgment, guide you through anxiety and stress, share uplifting affirmations, walk you through calming breathwork, or simply keep you company whenever you need a safe sanctuary.",
      tone: "informative",
      isCrisis: false,
    };
  }

  // 5F. Gratitude: "Thank you", "Thanks", "Shukriya"
  if (/\b(thank\s*(you|u)|thanks|thx|shukriya|dhanyawad|dhanyavaad|appreciate\s*it)\b/i.test(lower)) {
    const chosen = GRATITUDE_REPLIES[Math.floor(Math.random() * GRATITUDE_REPLIES.length)];
    return {
      reply: chosen,
      tone: "gratitude",
      isCrisis: false,
    };
  }

  // 5G. Positive Check-ins: "I am good", "Feeling happy", "Badhiya"
  if (/\b(feeling\s*good|i'?m\s*good|happy|great|fine|doing\s*well|all\s*good|theek\s*hu|badhiya)\b/i.test(lower)) {
    return {
      reply: "That brings so much warmth to my heart! 🌟 Savoring moments of joy and lightness helps anchor inner resilience. What has brought a smile to your face today?",
      tone: "uplifting",
      isCrisis: false,
    };
  }

  // 5H. Categorized Knowledge Synthesis (Anxiety, Overwhelm, Sadness, Sleep, Grounding, Affirmations, Boredom)
  for (const item of COMPANION_KNOWLEDGE) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return { reply: item.reply, tone: item.tone, isCrisis: false };
    }
  }

  // 5I. Natural Empathetic Fallbacks (Varied and Human-Like)
  const dynamicFallbacks = [
    "I hear you, and whatever you are experiencing right now is completely welcome in this sanctuary. 🌸 Tell me a little more—how does that feel inside your body?",
    "Thank you for sharing that with me. You have my full attention and zero judgment. What would feel most comforting or nourishing for you right now? 💜",
    "I am right here with you. Let's take this one breath at a time. Would you like an uplifting affirmation, a gentle reflection question, or simply a safe space to vent? ✨",
  ];

  return {
    reply: dynamicFallbacks[Math.floor(Math.random() * dynamicFallbacks.length)],
    tone: "supportive",
    isCrisis: false,
  };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ messages: [] });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId") || "default";

    const messages = await prisma.chatMessage.findMany({
      where: { userId, sessionId },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`chat_${ip}`, 30, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Please pause a moment before sending more messages." }, { status: 429 });
    }

    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = ChatMessageSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { content, sessionId = "default" } = validated.data;

    // Save user message
    const userMsg = await prisma.chatMessage.create({
      data: {
        userId,
        sessionId,
        fromUser: true,
        content,
        emotionalTone: "user_inquiry",
      },
    });

    // Generate AI response & check crisis
    const { reply, tone, isCrisis } = await generateCompanionReply(content);

    // If crisis detected, audit log crisis event
    if (isCrisis) {
      await prisma.crisisEvent.create({
        data: {
          userId,
          triggeredKeywords: content.slice(0, 200),
          helplineOffered: "988 Lifeline & Crisis Text Line",
          sessionId,
          ipHash: ip,
        },
      });
    }

    // Save assistant message
    const assistantMsg = await prisma.chatMessage.create({
      data: {
        userId,
        sessionId,
        fromUser: false,
        content: reply,
        emotionalTone: tone,
      },
    });

    return NextResponse.json({
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      isCrisis,
    });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

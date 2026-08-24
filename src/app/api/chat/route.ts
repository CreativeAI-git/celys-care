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
];

async function generateCompanionReply(
  userText: string
): Promise<{ reply: string; tone: string; isCrisis: boolean }> {
  const lower = userText.toLowerCase();

  // Check for crisis trigger
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

  // If external AI key is available (OpenAI / Gemini compatible), use it
  if (process.env.AI_API_KEY && process.env.AI_ENDPOINT) {
    try {
      const aiRes = await fetch(process.env.AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are Celys Care, a compassionate mindfulness and mental wellness companion. You speak with warm, gentle, grounding, therapeutic wisdom. Always remind users of their inherent worth, suggest gentle breathwork or reflections, and clarify that you are a supportive companion, not a substitute for clinical medical advice.",
            },
            { role: "user", content: userText },
          ],
          temperature: 0.7,
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const content = aiData.choices?.[0]?.message?.content;
        if (content) {
          return { reply: content, tone: "mindful-ai", isCrisis: false };
        }
      }
    } catch (e) {
      console.warn("External AI call failed, using companion synthesizer fallback:", e);
    }
  }

  // Empathetic Knowledge Synthesizer
  for (const item of COMPANION_KNOWLEDGE) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return { reply: item.reply, tone: item.tone, isCrisis: false };
    }
  }

  return {
    reply: `Thank you for sharing that with me. Every thought and emotion you bring here is received with love and zero judgment. ✨\n\nHow is your heart feeling in this exact moment? Would you like an uplifting affirmation, a gentle reflection question, or a calming breathwork session?`,
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

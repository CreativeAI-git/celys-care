import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { CompleteMeditationSchema } from "@/validations/wellness";

const MEDITATION_TRACKS = [
  {
    id: "med-1",
    title: "Morning Golden Radiance",
    category: "Energy & Clarity",
    duration: 300, // 5 mins
    description: "Awaken your body with gentle breath and solar visualization to inspire vitality for your day.",
    soundscape: "celestial",
    icon: "🌅",
  },
  {
    id: "med-2",
    title: "Deep Somatic Anxiety Release",
    category: "Grounding",
    duration: 600, // 10 mins
    description: "Unclench physical tension in the jaw, shoulders, and chest using gentle body-scan cues.",
    soundscape: "bowls",
    icon: "🌿",
  },
  {
    id: "med-3",
    title: "Theta Wave Sleep Sanctuary",
    category: "Sleep",
    duration: 900, // 15 mins
    description: "Drift into deep subconscious restorative sleep backed by 432Hz theta binaural resonance.",
    soundscape: "binaural",
    icon: "🌙",
  },
  {
    id: "med-4",
    title: "Heart Chakra Lotus Expansion",
    category: "Self-Love",
    duration: 480, // 8 mins
    description: "Open the center of your chest with emerald and rose light to cultivate forgiveness and unconditional warmth.",
    soundscape: "rain",
    icon: "🌸",
  },
  {
    id: "med-5",
    title: "Ocean Tide Breathwork Sync",
    category: "Breath Sync",
    duration: 420, // 7 mins
    description: "Synchronize your natural breathing rhythm with the rhythmic rise and fall of oceanic tides.",
    soundscape: "ocean",
    icon: "🌊",
  },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    const history = userId
      ? await prisma.meditationSession.findMany({
          where: { userId },
          orderBy: { completedAt: "desc" },
          take: 20,
        })
      : [];

    const totalMinutes = Math.round(
      history.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
    );

    return NextResponse.json({
      tracks: MEDITATION_TRACKS,
      history,
      totalMinutes,
    });
  } catch (error) {
    console.error("Meditations GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
    const validated = CompleteMeditationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { sessionTitle, category, durationSeconds } = validated.data;

    const session = await prisma.meditationSession.create({
      data: {
        userId,
        sessionTitle,
        category,
        durationSeconds,
      },
    });

    // Also place a star on the Soul Map
    await prisma.soulMapStar.create({
      data: {
        userId,
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 70) + 15,
        color: "#c96ccc",
        emoji: "🧘",
        label: `Meditation: ${sessionTitle}`,
        category: "Meditation",
        magnitude: 1.3,
      },
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Meditation complete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

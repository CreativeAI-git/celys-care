import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { PullOracleCardSchema } from "@/validations/wellness";

const ORACLE_DECK = [
  {
    title: "The Golden Lion of Inner Courage",
    symbol: "🦁",
    theme: "Dignity & Sovereignty",
    wisdom: "Step forward with quiet dignity. You do not need to roar to be powerful; your steady presence commands light.",
    affirmation: "I stand peacefully in my divine power and truth.",
  },
  {
    title: "The Luminous Lotus of Awakening",
    symbol: "🌸",
    theme: "Purity & Transformation",
    wisdom: "Rooted in muddy depths, the lotus blossoms in untouched perfection. Your hardships are fertilizing your rebirth.",
    affirmation: "I am blossoming beyond all past limitations.",
  },
  {
    title: "The Celestial Phoenix of Renewal",
    symbol: "🔥",
    theme: "Rebirth & Passion",
    wisdom: "From every ash of grief, a sacred fire is born. Release old versions of yourself with gratitude.",
    affirmation: "I welcome new beginnings with wide-open arms.",
  },
  {
    title: "The Silent Mountain of Stillness",
    symbol: "🏔️",
    theme: "Grounding & Equanimity",
    wisdom: "Winds howl and storms rage across the sky, yet the mountain remains unbothered and immovable.",
    affirmation: "I am steady, deeply rooted, and calm within.",
  },
  {
    title: "The Sacred River of Surrender",
    symbol: "🌊",
    theme: "Flow & Non-Resistance",
    wisdom: "The river never struggles against the rocks; it carves through them by yielding and flowing.",
    affirmation: "I trust the gentle rhythm of life's unfolding.",
  },
  {
    title: "The North Star of Intuition",
    symbol: "✨",
    theme: "Guidance & Faith",
    wisdom: "When the night seems darkest, look inward to your guiding spark. You already know your next step.",
    affirmation: "My intuition illuminates every path I walk.",
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
      ? await prisma.oracleCard.findMany({
          where: { userId },
          orderBy: { pulledAt: "desc" },
          take: 10,
        })
      : [];

    return NextResponse.json({ deck: ORACLE_DECK, history });
  } catch (error) {
    console.error("Oracle GET error:", error);
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
    const validated = PullOracleCardSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { cardTitle, cardSymbol, cardWisdom, interpretation } = validated.data;

    const card = await prisma.oracleCard.create({
      data: {
        userId,
        cardTitle,
        cardSymbol,
        cardWisdom,
        interpretation: interpretation || "Trust the wisdom of today's draw.",
      },
    });

    return NextResponse.json({ success: true, card });
  } catch (error) {
    console.error("Oracle POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

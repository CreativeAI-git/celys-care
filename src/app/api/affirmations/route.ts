import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const AFFIRMATIONS_CATALOG = [
  { index: 0, text: "I am deserving of peace, gentleness, and unconditional love.", category: "Self-Love", author: "Celys Care" },
  { index: 1, text: "My breath anchors me in this sacred present moment.", category: "Serenity", author: "Celys Care" },
  { index: 2, text: "I release what I cannot control and embrace what heals me.", category: "Resilience", author: "Celys Care" },
  { index: 3, text: "I breathe in radiant healing light; I exhale all doubt and fatigue.", category: "Healing", author: "Celys Care" },
  { index: 4, text: "I am stronger than my heaviest days and softer than my sharpest thoughts.", category: "Strength", author: "Celys Care" },
  { index: 5, text: "Peace begins within my own quiet heartbeat.", category: "Serenity", author: "Celys Care" },
  { index: 6, text: "I give myself permission to rest without earning it.", category: "Self-Love", author: "Celys Care" },
  { index: 7, text: "The universe is gently guiding me toward my highest joy.", category: "Abundance", author: "Celys Care" },
  { index: 8, text: "I honor my sensitivity; it is my intuition and super power.", category: "Empowerment", author: "Celys Care" },
  { index: 9, text: "Every cell in my body is vibrating with harmony and vitality.", category: "Healing", author: "Celys Care" },
  { index: 10, text: "I am rooted like an ancient tree, unmoved by passing storms.", category: "Grounding", author: "Celys Care" },
  { index: 11, text: "My heart is open to receive unexpected miracles today.", category: "Abundance", author: "Celys Care" },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    const liked = userId
      ? await prisma.likedAffirmation.findMany({
          where: { userId },
          select: { affirmationIndex: true },
        })
      : [];

    const custom = userId
      ? await prisma.customAffirmation.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        })
      : [];

    const likedSet = new Set(liked.map((l) => l.affirmationIndex));

    const standardAffirmations = AFFIRMATIONS_CATALOG.map((a) => ({
      ...a,
      isLiked: likedSet.has(a.index),
    }));

    const customAffirmations = custom.map((c, i) => ({
      index: 1000 + i,
      text: c.text,
      category: c.category,
      author: c.author,
      isLiked: true,
    }));

    return NextResponse.json({
      affirmations: [...customAffirmations, ...standardAffirmations],
    });
  } catch (error) {
    console.error("Affirmations GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

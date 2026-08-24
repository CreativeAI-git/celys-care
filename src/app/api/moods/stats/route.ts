import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({
        totalCheckins: 0,
        averageIntensity: 0,
        distribution: {},
        recentHistory: [],
      });
    }

    const checkins = await prisma.moodCheckin.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const totalCheckins = checkins.length;
    const avgIntensity =
      totalCheckins > 0
        ? (checkins.reduce((acc, c) => acc + c.intensity, 0) / totalCheckins).toFixed(1)
        : "0";

    const distribution: Record<string, number> = {};
    checkins.forEach((c) => {
      distribution[c.mood] = (distribution[c.mood] || 0) + 1;
    });

    return NextResponse.json({
      totalCheckins,
      averageIntensity: Number(avgIntensity),
      distribution,
      recentHistory: checkins.slice(0, 7),
    });
  } catch (error) {
    console.error("Mood stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

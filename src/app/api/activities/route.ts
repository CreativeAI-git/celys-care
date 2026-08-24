import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { CompleteActivitySchema } from "@/validations/wellness";

const DAILY_ACTIVITIES = [
  {
    id: "act-1",
    title: "Morning Sun Hydration",
    subtitle: "Drink 2 glasses of pure water with lemon",
    category: "Hydration",
    xp: 20,
    icon: "💧",
  },
  {
    id: "act-2",
    title: "10-Minute Mindful Walk",
    subtitle: "Notice 5 natural colors in your surroundings",
    category: "Movement",
    xp: 35,
    icon: "🌿",
  },
  {
    id: "act-3",
    title: "Spinal & Shoulder Release",
    subtitle: "Gentle cat-cow and neck stretches",
    category: "Physical",
    xp: 25,
    icon: "✨",
  },
  {
    id: "act-4",
    title: "Evening Digital Twilight",
    subtitle: "Switch off screens 30 mins before sleep",
    category: "Sleep",
    xp: 40,
    icon: "🌙",
  },
  {
    id: "act-5",
    title: "Gratitude Whisper",
    subtitle: "Thank someone or thank yourself for staying strong",
    category: "Gratitude",
    xp: 30,
    icon: "🌸",
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

    // Get today's completed activities
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const completedToday = userId
      ? await prisma.completedActivity.findMany({
          where: {
            userId,
            completedAt: { gte: startOfDay },
          },
        })
      : [];

    const completedSet = new Set(completedToday.map((c) => c.activityId));

    const activities = DAILY_ACTIVITIES.map((a) => ({
      ...a,
      isCompleted: completedSet.has(a.id),
    }));

    return NextResponse.json({ activities, completedToday: completedToday.length });
  } catch (error) {
    console.error("Activities GET error:", error);
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
    const validated = CompleteActivitySchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { activityId, activityTitle, category } = validated.data;

    // Check if already completed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await prisma.completedActivity.findFirst({
      where: {
        userId,
        activityId,
        completedAt: { gte: startOfDay },
      },
    });

    if (existing) {
      // Toggle off / remove
      await prisma.completedActivity.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, isCompleted: false });
    }

    const completed = await prisma.completedActivity.create({
      data: {
        userId,
        activityId,
        activityTitle,
        category,
      },
    });

    return NextResponse.json({ success: true, isCompleted: true, completed });
  } catch (error) {
    console.error("Activities POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

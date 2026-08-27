import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { CompleteActivitySchema } from "@/validations/wellness";

const DAILY_ACTIVITIES = [
  {
    id: "mindful-walking",
    title: "Mindful Walking",
    subtitle: "Walk slowly and notice 5 things in your surroundings",
    category: "Grounding",
    xp: 35,
    icon: "🚶",
    time: "10 min",
  },
  {
    id: "gratitude-practice",
    title: "Gratitude Practice",
    subtitle: "Write down 3 things you are deeply thankful for",
    category: "Reflection",
    xp: 25,
    icon: "🙏",
    time: "5 min",
  },
  {
    id: "muscle-relaxation",
    title: "Muscle Relaxation",
    subtitle: "Tense and release each muscle group mindfully",
    category: "Body",
    xp: 40,
    icon: "💪",
    time: "12 min",
  },
  {
    id: "cold-water-splash",
    title: "Cold Water Splash",
    subtitle: "Splash cold water on your face for vagus nerve reset",
    category: "Quick Reset",
    xp: 15,
    icon: "💧",
    time: "1 min",
  },
  {
    id: "creative-drawing",
    title: "Creative Drawing",
    subtitle: "Doodle freely without judgment or goal",
    category: "Creative",
    xp: 30,
    icon: "✏️",
    time: "15 min",
  },
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding",
    subtitle: "Engage all 5 senses to return to the present moment",
    category: "Grounding",
    xp: 30,
    icon: "🌳",
    time: "3 min",
  },
  {
    id: "yoga-stretch",
    title: "Yoga Stretch",
    subtitle: "3 gentle stretches to release held physical tension",
    category: "Body",
    xp: 30,
    icon: "🧘",
    time: "8 min",
  },
  {
    id: "connect-someone",
    title: "Connect with Someone",
    subtitle: "Reach out to someone who lifts your spirits",
    category: "Social",
    xp: 35,
    icon: "📞",
    time: "Any",
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

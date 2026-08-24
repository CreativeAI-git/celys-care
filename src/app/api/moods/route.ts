import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { MoodCheckinSchema } from "@/validations/wellness";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const userId = user?.id;

    if (!userId) {
      // Return demo user moods
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      const moods = demoUser
        ? await prisma.moodCheckin.findMany({
            where: { userId: demoUser.id },
            orderBy: { createdAt: "desc" },
            take: 20,
          })
        : [];
      return NextResponse.json({ moods });
    }

    const moods = await prisma.moodCheckin.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ moods });
  } catch (error) {
    console.error("Moods GET error:", error);
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
    const validated = MoodCheckinSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { mood, label, color, intensity, tags, note } = validated.data;

    const checkin = await prisma.moodCheckin.create({
      data: {
        userId,
        mood,
        label,
        color,
        intensity,
        tags,
        note,
      },
    });

    // Update user profile streak
    await prisma.profile.updateMany({
      where: { userId },
      data: {
        streakCount: { increment: 1 },
        lastCheckInDate: new Date(),
      },
    });

    return NextResponse.json({ success: true, checkin });
  } catch (error) {
    console.error("Moods POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

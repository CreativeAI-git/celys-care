import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { UpdateProfileSchema } from "@/validations/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      // Return demo profile if guest
      return NextResponse.json({
        profile: {
          displayName: "Beautiful Soul",
          bio: "Walking my journey towards inner peace and radiant healing. ♡",
          dailyGoal: 3,
          streakCount: 1,
        },
      });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ profile, user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = UpdateProfileSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { displayName, bio, dailyGoal, reminderTime, themePreferences } = validated.data;

    if (displayName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { displayName },
      });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        bio,
        dailyGoal: dailyGoal ?? 3,
        reminderTime: reminderTime ?? "09:00",
        themePreferences: themePreferences ?? "cosmic-dark",
      },
      update: {
        bio,
        dailyGoal,
        reminderTime,
        themePreferences,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

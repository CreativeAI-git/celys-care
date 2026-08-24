import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { LikeAffirmationSchema } from "@/validations/wellness";

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
    const validated = LikeAffirmationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { affirmationIndex, affirmationText, category } = validated.data;

    // Toggle like
    const existing = await prisma.likedAffirmation.findUnique({
      where: {
        userId_affirmationIndex: {
          userId,
          affirmationIndex,
        },
      },
    });

    if (existing) {
      await prisma.likedAffirmation.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, isLiked: false });
    } else {
      await prisma.likedAffirmation.create({
        data: {
          userId,
          affirmationIndex,
          affirmationText,
          category: category || "General",
        },
      });
      return NextResponse.json({ success: true, isLiked: true });
    }
  } catch (error) {
    console.error("Affirmation like error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { SoulMapStarSchema } from "@/validations/wellness";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    const stars = userId
      ? await prisma.soulMapStar.findMany({
          where: { userId },
          orderBy: { createdAt: "asc" },
        })
      : [];

    return NextResponse.json({ stars });
  } catch (error) {
    console.error("Soul map GET error:", error);
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
    const validated = SoulMapStarSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { x, y, color, emoji, label, category, magnitude } = validated.data;

    const star = await prisma.soulMapStar.create({
      data: {
        userId,
        x,
        y,
        color,
        emoji,
        label,
        category,
        magnitude,
      },
    });

    return NextResponse.json({ success: true, star });
  } catch (error) {
    console.error("Soul map POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

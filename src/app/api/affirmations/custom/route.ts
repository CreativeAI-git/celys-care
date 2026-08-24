import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { CustomAffirmationSchema } from "@/validations/wellness";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    const affirmations = userId
      ? await prisma.customAffirmation.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        })
      : [];

    return NextResponse.json({ affirmations });
  } catch (error) {
    console.error("Custom affirmations GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`custom_aff_${ip}`, 20, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

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
    const validated = CustomAffirmationSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { text, category, author } = validated.data;

    const affirmation = await prisma.customAffirmation.create({
      data: {
        userId,
        text,
        category,
        author: author || "My Soul",
      },
    });

    return NextResponse.json({ success: true, affirmation });
  } catch (error) {
    console.error("Custom affirmation POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

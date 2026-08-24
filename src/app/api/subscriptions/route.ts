import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { UpgradeSubscriptionSchema } from "@/validations/wellness";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    const subscription = userId
      ? await prisma.subscription.findUnique({ where: { userId } })
      : null;

    return NextResponse.json({
      subscription: subscription || { plan: "free", status: "active" },
    });
  } catch (error) {
    console.error("Subscription GET error:", error);
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
    const validated = UpgradeSubscriptionSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { plan } = validated.data;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const subscription = await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        status: "active",
        startedAt: new Date(),
        expiresAt,
      },
      update: {
        plan,
        status: "active",
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("Subscription POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

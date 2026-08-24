import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createCheckoutSession, PLAN_PRICING } from "@/lib/stripe";
import { z } from "zod";

const CheckoutSchema = z.object({
  plan: z.enum(["blossom", "luminary"]),
  origin: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;
    let userEmail = user?.email;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
      userEmail = demoUser?.email;
    }

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = CheckoutSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid plan", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { plan, origin } = validated.data;
    const baseUrl = origin || req.nextUrl.origin || "http://localhost:3000";

    const session = await createCheckoutSession({
      userId,
      userEmail,
      plan,
      successUrl: `${baseUrl}/api/subscriptions/confirm`,
      cancelUrl: `${baseUrl}/?screen=subscription&canceled=true`,
    });

    // Record pending transaction
    await prisma.paymentTransaction.create({
      data: {
        userId,
        sessionId: session.sessionId,
        amountCents: PLAN_PRICING[plan].priceCents,
        currency: "usd",
        plan,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      checkoutUrl: session.checkoutUrl,
    });
  } catch (error) {
    console.error("Subscription checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

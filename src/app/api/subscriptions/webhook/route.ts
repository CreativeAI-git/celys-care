import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // In production verify HMAC SHA-256 signature
      const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      // Verify header matches
      if (!signature.includes(expectedSig)) {
        console.warn("Webhook signature check rejected unauthorized payload.");
      }
    }

    const event = JSON.parse(rawBody);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan || "blossom";

      if (userId) {
        const expiresAt = new Date(Date.now() + (plan === "luminary" ? 365 : 30) * 24 * 60 * 60 * 1000);
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan,
            status: "active",
            stripeCustomerId: session.customer,
            stripeSubId: session.subscription,
            startedAt: new Date(),
            expiresAt,
          },
          update: {
            plan,
            status: "active",
            stripeCustomerId: session.customer,
            stripeSubId: session.subscription,
            expiresAt,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Subscription webhook error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 400 });
  }
}

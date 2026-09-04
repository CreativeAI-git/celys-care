import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * RevenueCat Server-to-Server Webhook Handler
 * Handles real-time subscription events:
 * - INITIAL_PURCHASE
 * - RENEWAL
 * - CANCELLATION
 * - EXPIRATION
 * - PRODUCT_CHANGE
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;

    // Verify secret if configured (flexible to match with or without 'Bearer ')
    if (
      webhookSecret &&
      webhookSecret.trim() !== "" &&
      webhookSecret !== "rc_webhook_secret_placeholder"
    ) {
      const cleanHeader = (authHeader || "").replace(/^Bearer\s+/i, "").trim();
      const cleanSecret = webhookSecret.replace(/^Bearer\s+/i, "").trim();

      if (cleanHeader !== cleanSecret) {
        console.warn("RevenueCat webhook: Unauthorized authorization header.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = await req.json();
    const event = payload?.event;

    if (!event) {
      return NextResponse.json({ error: "No event object found" }, { status: 400 });
    }

    const { type, app_user_id, entitlement_id, entitlement_ids = [], expiration_at_ms } = event;

    // Handle RevenueCat Dashboard "Test Webhook" action immediately
    if (type === "TEST") {
      console.info("RevenueCat test webhook event received successfully!");
      return NextResponse.json({
        success: true,
        message: "RevenueCat test webhook received successfully!",
        event,
      });
    }
    const isCelestial =
      entitlement_id === "celys_care_pro" ||
      entitlement_id === "celestial_premium" ||
      (Array.isArray(entitlement_ids) &&
        (entitlement_ids.includes("celys_care_pro") ||
          entitlement_ids.includes("celestial_premium")));

    // Find the user associated with this app_user_id (which is the database user.id or rc_...)
    let user = await prisma.user.findUnique({
      where: { id: app_user_id },
    });

    if (!user) {
      // In case app_user_id had a prefix or was an alias, try checking by email or stripeSubId
      const existingSub = await prisma.subscription.findFirst({
        where: { stripeSubId: `rc_${app_user_id}` },
        include: { user: true },
      });
      if (existingSub?.user) {
        user = existingSub.user;
      }
    }

    if (!user) {
      console.warn(`RevenueCat webhook: User not found for app_user_id: ${app_user_id}`);
      return NextResponse.json({ received: true, note: "User not found locally" });
    }

    const expiresAt = expiration_at_ms ? new Date(expiration_at_ms) : null;

    switch (type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "UNCANCELLATION":
      case "PRODUCT_CHANGE": {
        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            plan: isCelestial ? "celestial_premium" : "blossom",
            status: "active",
            stripeSubId: `rc_${app_user_id}`,
            startedAt: new Date(),
            expiresAt,
          },
          update: {
            plan: isCelestial ? "celestial_premium" : "blossom",
            status: "active",
            stripeSubId: `rc_${app_user_id}`,
            expiresAt,
          },
        });
        break;
      }

      case "CANCELLATION": {
        // User cancelled auto-renew; subscription remains active until period ends
        break;
      }

      case "EXPIRATION": {
        await prisma.subscription.updateMany({
          where: { userId: user.id },
          data: {
            status: "canceled",
          },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true, event: type });
  } catch (error) {
    console.error("RevenueCat webhook error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { rcAppUserId, activeEntitlements = [], planPeriod = "annual", expiresAt } = body;
    const isPremium =
      activeEntitlements.includes("celys_care_pro") ||
      activeEntitlements.includes("celestial_premium") ||
      activeEntitlements.length > 0;

    const plan = planPeriod === "monthly" ? "monthly" : "annual";
    const expirationDate = expiresAt ? new Date(expiresAt) : null;

    if (isPremium) {
      const subscription = await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          plan,
          status: "active",
          stripeSubId: `rc_${rcAppUserId || user.id}_${plan}`,
          expiresAt: expirationDate,
        },
        update: {
          plan,
          status: "active",
          stripeSubId: `rc_${rcAppUserId || user.id}_${plan}`,
          expiresAt: expirationDate,
        },
      });

      return NextResponse.json({
        success: true,
        message: "RevenueCat subscription synced successfully",
        subscription,
      });
    } else {
      const currentSub = await prisma.subscription.findUnique({ where: { userId: user.id } });
      if (
        currentSub &&
        (currentSub.plan === "celestial_premium" || currentSub.plan === "celys_care_pro") &&
        currentSub.status === "active"
      ) {
        const updated = await prisma.subscription.update({
          where: { userId: user.id },
          data: { status: "canceled" },
        });
        return NextResponse.json({ success: true, message: "Subscription revoked", subscription: updated });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



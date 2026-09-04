import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/**
 * 7-Day In-App Free Trial API
 * Managed completely by Celys Care backend (No credit card or App Store purchase required)
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({
        hasUsedTrial: false,
        isTrialActive: false,
        daysRemaining: 0,
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.trialStart || !subscription.trialEnd) {
      return NextResponse.json({
        hasUsedTrial: false,
        isTrialActive: false,
        daysRemaining: 0,
      });
    }

    const now = new Date();
    const trialEnd = new Date(subscription.trialEnd);
    const isTrialActive = subscription.status === "trialing" && now < trialEnd;
    const diffMs = trialEnd.getTime() - now.getTime();
    const daysRemaining = isTrialActive ? Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24))) : 0;

    return NextResponse.json({
      hasUsedTrial: true,
      isTrialActive,
      trialStart: subscription.trialStart,
      trialEnd: subscription.trialEnd,
      daysRemaining,
      status: subscription.status,
    });
  } catch (error) {
    console.error("Trial GET error:", error);
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

    const currentSub = await prisma.subscription.findUnique({
      where: { userId },
    });

    // If user already has an active paid subscription
    if (currentSub && currentSub.status === "active" && currentSub.plan !== "free" && currentSub.plan !== "celestial_trial") {
      return NextResponse.json({
        error: "You already have an active premium subscription.",
      }, { status: 400 });
    }

    // Check if trial was already used in the past
    if (currentSub?.trialStart) {
      const now = new Date();
      const trialEnd = currentSub.trialEnd ? new Date(currentSub.trialEnd) : new Date(0);
      if (now > trialEnd) {
        return NextResponse.json({
          error: "You have already used your 7-Day Free Trial. Please choose a monthly or annual plan.",
          trialExpired: true,
        }, { status: 400 });
      } else {
        // Trial is already running
        const diffMs = trialEnd.getTime() - now.getTime();
        const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        return NextResponse.json({
          success: true,
          message: "Your 7-Day Free Trial is already active.",
          subscription: currentSub,
          daysRemaining,
        });
      }
    }

    // Start 7-Day Free Trial
    const trialStart = new Date();
    const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const subscription = await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: "celestial_trial",
        status: "trialing",
        trialStart,
        trialEnd,
        startedAt: trialStart,
        expiresAt: trialEnd,
      },
      update: {
        plan: "celestial_trial",
        status: "trialing",
        trialStart,
        trialEnd,
        expiresAt: trialEnd,
      },
    });

    return NextResponse.json({
      success: true,
      message: "7-Day Free Trial activated successfully!",
      subscription,
      daysRemaining: 7,
    });
  } catch (error) {
    console.error("Trial POST error:", error);
    return NextResponse.json({ error: "Failed to activate trial" }, { status: 500 });
  }
}

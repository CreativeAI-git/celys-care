import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const plan = (searchParams.get("plan") as "blossom" | "luminary") || "blossom";

    if (!sessionId) {
      return NextResponse.redirect(new URL("/?screen=subscription", req.url));
    }

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { sessionId },
    });

    if (transaction) {
      const expiresAt = new Date(Date.now() + (plan === "luminary" ? 365 : 30) * 24 * 60 * 60 * 1000);

      // Activate subscription and mark transaction completed
      await prisma.$transaction([
        prisma.subscription.upsert({
          where: { userId: transaction.userId },
          create: {
            userId: transaction.userId,
            plan: transaction.plan,
            status: "active",
            startedAt: new Date(),
            expiresAt,
          },
          update: {
            plan: transaction.plan,
            status: "active",
            expiresAt,
          },
        }),
        prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: { status: "completed" },
        }),
        prisma.auditLog.create({
          data: {
            userId: transaction.userId,
            action: "SUBSCRIPTION_ACTIVATED",
            metadata: JSON.stringify({ plan: transaction.plan, sessionId }),
          },
        }),
      ]);
    }

    return NextResponse.redirect(new URL("/?screen=subscription&upgraded=true", req.url));
  } catch (error) {
    console.error("Subscription confirm error:", error);
    return NextResponse.redirect(new URL("/?screen=subscription&error=true", req.url));
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email?.trim()?.toLowerCase();
    const reason = body?.reason || "Not specified";
    const confirmed = body?.confirmed === true;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required to submit a deletion request." },
        { status: 400 }
      );
    }

    if (!confirmed) {
      return NextResponse.json(
        { error: "You must confirm the permanent deletion acknowledgment." },
        { status: 400 }
      );
    }

    // Check if the user is currently authenticated
    let authUser = null;
    try {
      authUser = await getAuthUser(req);
    } catch {
      // Unauthenticated or cookies access in route handler
    }
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    let targetUser = null;
    try {
      // Lookup user by email in database
      targetUser = await prisma.user.findUnique({
        where: { email },
      });

      if (targetUser) {
        // Log the deletion request for compliance auditing
        await prisma.auditLog.create({
          data: {
            userId: targetUser.id,
            action: "ACCOUNT_DELETION_REQUESTED_WEB",
            ipHash: ip,
            userAgent: userAgent.slice(0, 255),
            metadata: JSON.stringify({
              requestedEmail: email,
              reason,
              isAuthUser: authUser?.id === targetUser.id,
              submittedAt: new Date().toISOString(),
            }),
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB operation notice during account deletion request:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message:
        "Your account deletion request has been registered. If an account matches this email, all corresponding personal records, reflections, and account data will be permanently purged within 24–48 hours.",
    });
  } catch (error: any) {
    console.error("Web account deletion request error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred. Please contact support@celyscare.com directly." },
      { status: 500 }
    );
  }
}

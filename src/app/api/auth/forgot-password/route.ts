import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { ForgotPasswordSchema } from "@/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`forgot_pw_${ip}`, 3, 60000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many password reset requests. Please wait." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = ForgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const { email } = validated.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    let resetToken: string | null = null;

    if (user) {
      // Invalidate existing tokens
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      // Generate secure 32-byte hex token
      resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 3600000), // 1 hour expiration
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PASSWORD_RESET_REQUESTED",
          ipHash: ip,
          userAgent: req.headers.get("user-agent"),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "If this email is registered, a password reset link has been dispatched.",
      ...(process.env.NODE_ENV !== "production" && resetToken ? { devResetToken: resetToken } : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const ResetPasswordSchema = z.object({
  token: z.string().min(10, "Invalid reset token"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`reset_pw_${ip}`, 5, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many reset attempts. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const validated = ResetPasswordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = validated.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Reset token is invalid or has expired." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(password);

    // Update password and invalidate token in transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          userId: resetRecord.userId,
          action: "PASSWORD_RESET_SUCCESS",
          ipHash: ip,
          userAgent: req.headers.get("user-agent"),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password has been securely reset. You may now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

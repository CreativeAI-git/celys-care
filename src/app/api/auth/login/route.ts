import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { LoginSchema } from "@/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`login_${ip}`, 10, 60000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Please try again in 1 minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid credentials", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { profile: true, subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        profile: user.profile,
        subscription: user.subscription,
      },
    });

    setAuthCookie(response, token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN_SUCCESS",
        ipHash: ip,
        userAgent: req.headers.get("user-agent"),
      },
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

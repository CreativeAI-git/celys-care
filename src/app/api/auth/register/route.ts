import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { RegisterSchema } from "@/validations/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`register_${ip}`, 5, 60000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait 1 minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, displayName } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const nameFromEmail = normalizedEmail.split("@")[0].replace(/[._-]/g, " ");
    const defaultName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    // Create user and profile in transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          displayName: displayName && displayName.trim() ? displayName.trim() : defaultName,
          role: "USER",
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          bio: "Walking my journey toward inner peace and radiant healing. ♡",
          dailyGoal: 3,
          reminderTime: "09:00",
          streakCount: 1,
          themePreferences: "cosmic-dark",
        },
      });

      const subscription = await tx.subscription.create({
        data: {
          userId: user.id,
          plan: "free",
          status: "active",
        },
      });

      // Default welcome soul map star
      await tx.soulMapStar.create({
        data: {
          userId: user.id,
          x: 50,
          y: 40,
          color: "#f5d76e",
          emoji: "🌸",
          label: "Beginning of My Sanctuary",
          category: "Origin",
          magnitude: 1.5,
        },
      });

      return { ...user, profile, subscription };
    });

    const token = await createToken({
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          displayName: newUser.displayName,
          avatarUrl: newUser.avatarUrl,
          role: newUser.role,
          profile: newUser.profile,
          subscription: newUser.subscription,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: "USER_REGISTERED",
        ipHash: ip,
        userAgent: req.headers.get("user-agent"),
      },
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

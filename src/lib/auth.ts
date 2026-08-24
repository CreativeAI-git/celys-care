import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "celys_care_default_jwt_secret_key_wellness_2026";
export const AUTH_COOKIE_NAME = "celys_auth_token";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  displayName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload | any): string {
  const normPayload = {
    userId: payload.userId || payload.id,
    email: payload.email,
    role: payload.role || "USER",
    displayName: payload.displayName,
  };
  return jwt.sign(normPayload, JWT_SECRET, { expiresIn: "30d" });
}

export const createToken = signToken;

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function getAuthUser(req?: NextRequest) {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch {
      // ignore
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        subscription: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      profile: user.profile,
      subscription: user.subscription,
    };
  } catch {
    return null;
  }
}

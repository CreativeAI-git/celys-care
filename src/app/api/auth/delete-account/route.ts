import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to delete your account." },
        { status: 401 }
      );
    }

    // Check if user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser) {
      // Prisma cascade deletes all related models:
      // Profile, MoodCheckin, JournalEntry, ChatMessage, LikedAffirmation,
      // CustomAffirmation, MeditationSession, SoulMapStar, CompletedActivity,
      // OracleCard, Subscription, OfflineSyncQueue, PaymentTransaction, PasswordResetToken
      await prisma.user.delete({
        where: { id: user.id },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "Your account and all associated personal data have been permanently deleted.",
    });

    // Clear authentication cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}

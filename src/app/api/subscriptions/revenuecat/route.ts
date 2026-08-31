import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import prisma from "@/lib/prisma";
// import { getAuthUser } from "@/lib/auth";

export async function POST() {
  // RevenueCat subscription webhook sync (Temporarily Disabled)
  return NextResponse.json({
    message: "RevenueCat sync is currently disabled.",
  });
}


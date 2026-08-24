import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { JournalEntrySchema } from "@/validations/wellness";
import { encryptJournalText, decryptJournalText } from "@/lib/encryption";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`journal_get_${ip}`, 100, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }

    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ entries: [] });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || "";
    const moodTag = searchParams.get("mood") || "";

    const rawEntries = await prisma.journalEntry.findMany({
      where: {
        userId,
        ...(moodTag ? { moodTag: { contains: moodTag } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    // Decrypt encrypted entries for the authorized user
    const entries = rawEntries.map((e) => {
      let content = e.content;
      if (e.isEncrypted && e.encryptionIv && e.authTag) {
        content = decryptJournalText(e.content, e.encryptionIv, e.authTag);
      }
      return {
        ...e,
        content,
      };
    }).filter((e) => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return (
        (e.title && e.title.toLowerCase().includes(lower)) ||
        e.content.toLowerCase().includes(lower) ||
        (e.tags && e.tags.toLowerCase().includes(lower))
      );
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Journal GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`journal_post_${ip}`, 30, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many entries created. Please pause." }, { status: 429 });
    }

    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = JournalEntrySchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, content, prompt, moodTag, tags, isEncrypted } = validated.data;

    let finalContent = content;
    let encryptionIv: string | null = null;
    let authTag: string | null = null;

    if (isEncrypted) {
      const encrypted = encryptJournalText(content);
      finalContent = encrypted.ciphertext;
      encryptionIv = encrypted.iv;
      authTag = encrypted.authTag;
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        title: title || "Mindful Reflection",
        content: finalContent,
        prompt,
        moodTag,
        tags,
        isEncrypted: isEncrypted ?? true,
        encryptionIv,
        authTag,
      },
    });

    return NextResponse.json({
      success: true,
      entry: {
        ...entry,
        content, // return decrypted content to creator
      },
    });
  } catch (error) {
    console.error("Journal POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

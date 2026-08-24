import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { JournalEntrySchema } from "@/validations/wellness";
import { encryptJournalText } from "@/lib/encryption";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`journal_put_${ip}`, 30, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
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

    const updated = await prisma.journalEntry.updateMany({
      where: { id: params.id, userId },
      data: {
        title,
        content: finalContent,
        prompt,
        moodTag,
        tags,
        isEncrypted,
        encryptionIv,
        authTag,
      },
    });

    return NextResponse.json({ success: true, updatedCount: updated.count });
  } catch (error) {
    console.error("Journal PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@celyscare.com" } });
      userId = demoUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.journalEntry.deleteMany({
      where: { id: params.id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Journal DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { BatchSyncSchema } from "@/validations/wellness";
import { encryptJournalText } from "@/lib/encryption";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`sync_${ip}`, 60, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Sync rate limit reached. Please wait." }, { status: 429 });
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
    const validated = BatchSyncSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { items } = validated.data;
    let processedCount = 0;

    for (const item of items) {
      try {
        const payload = item.payload;
        const idempotencyKey = item.idempotencyKey || `mut_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        // Check if mutation was already synced to prevent duplicate creation
        const existingSync = await prisma.offlineSyncQueue.findUnique({
          where: { idempotencyKey },
        });

        if (existingSync && existingSync.status === "SYNCED") {
          processedCount++;
          continue;
        }

        if (item.entityType === "mood" && item.action === "CREATE") {
          await prisma.moodCheckin.create({
            data: {
              userId,
              mood: payload.mood || "Calm",
              label: payload.label || "Peaceful",
              color: payload.color || "#7c3aed",
              intensity: payload.intensity || 3,
              tags: payload.tags || "",
              note: payload.note || "",
            },
          });
        } else if (item.entityType === "journal" && item.action === "CREATE") {
          const isEnc = payload.isEncrypted !== false;
          let content = payload.content || "";
          let iv: string | null = null;
          let tag: string | null = null;

          if (isEnc) {
            const enc = encryptJournalText(content);
            content = enc.ciphertext;
            iv = enc.iv;
            tag = enc.authTag;
          }

          await prisma.journalEntry.create({
            data: {
              userId,
              title: payload.title || "Mindful Reflection",
              content,
              prompt: payload.prompt || "",
              moodTag: payload.moodTag || "",
              tags: payload.tags || "",
              isEncrypted: isEnc,
              encryptionIv: iv,
              authTag: tag,
            },
          });
        } else if (item.entityType === "star" && item.action === "CREATE") {
          await prisma.soulMapStar.create({
            data: {
              userId,
              x: payload.x || 50,
              y: payload.y || 50,
              color: payload.color || "#f5d76e",
              emoji: payload.emoji || "✨",
              label: payload.label || "Offline Reflection",
              category: payload.category || "Offline",
              magnitude: payload.magnitude || 1.0,
            },
          });
        } else if (item.entityType === "activity" && item.action === "CREATE") {
          await prisma.completedActivity.create({
            data: {
              userId,
              activityId: payload.activityId || "act-offline",
              activityTitle: payload.activityTitle || "Mindful Moment",
              category: payload.category || "Ritual",
            },
          });
        } else if (item.entityType === "chat" && item.action === "CREATE") {
          await prisma.chatMessage.create({
            data: {
              userId,
              sessionId: payload.sessionId || "default",
              fromUser: payload.fromUser ?? true,
              content: payload.content || "",
              emotionalTone: payload.emotionalTone || "offline",
            },
          });
        }

        // Record in sync queue
        await prisma.offlineSyncQueue.upsert({
          where: { idempotencyKey },
          create: {
            userId,
            entityType: item.entityType,
            action: item.action,
            payload: JSON.stringify(item.payload),
            idempotencyKey,
            clientTimestamp: new Date(item.clientTimestamp),
            status: "SYNCED",
            syncedAt: new Date(),
          },
          update: {
            status: "SYNCED",
            syncedAt: new Date(),
          },
        });

        processedCount++;
      } catch (err: any) {
        console.error("Batch mutation sync error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      received: items.length,
      processed: processedCount,
    });
  } catch (error) {
    console.error("Batch sync API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

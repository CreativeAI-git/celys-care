import { z } from "zod";

export const MoodCheckinSchema = z.object({
  mood: z.string().min(1, "Mood is required"),
  label: z.string().min(1, "Label is required"),
  color: z.string().min(1, "Color is required"),
  intensity: z.number().int().min(1).max(5).default(3),
  tags: z.string().optional().default(""),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional().default(""),
});

export const JournalEntrySchema = z.object({
  title: z.string().max(100).optional().default("Mindful Reflection"),
  content: z.string().min(1, "Journal entry cannot be empty"),
  prompt: z.string().optional().default(""),
  moodTag: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  isEncrypted: z.boolean().optional().default(true),
});

export const ChatMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  sessionId: z.string().optional().default("default"),
});

export const LikeAffirmationSchema = z.object({
  affirmationIndex: z.number().int(),
  affirmationText: z.string().min(1),
  category: z.string().optional().default("General"),
});

export const CustomAffirmationSchema = z.object({
  text: z.string().min(1, "Affirmation cannot be empty").max(200),
  category: z.string().default("Self-Love"),
  author: z.string().optional().default("My Soul"),
});

export const CompleteMeditationSchema = z.object({
  sessionTitle: z.string().min(1),
  category: z.string().default("Mindfulness"),
  durationSeconds: z.number().int().min(1),
});

export const SoulMapStarSchema = z.object({
  x: z.number(),
  y: z.number(),
  color: z.string().min(1),
  emoji: z.string().min(1),
  label: z.string().min(1),
  category: z.string().default("Reflection"),
  magnitude: z.number().default(1.0),
});

export const CompleteActivitySchema = z.object({
  activityId: z.string().min(1),
  activityTitle: z.string().min(1),
  category: z.string().default("Ritual"),
});

export const PullOracleCardSchema = z.object({
  cardTitle: z.string().min(1),
  cardSymbol: z.string().min(1),
  cardWisdom: z.string().min(1),
  interpretation: z.string().optional(),
});

export const UpgradeSubscriptionSchema = z.object({
  plan: z.enum(["free", "blossom", "luminary"]),
});

export const BatchSyncSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().optional(),
      idempotencyKey: z.string().optional(),
      entityType: z.string(),
      action: z.enum(["CREATE", "UPDATE", "DELETE"]),
      payload: z.record(z.any()),
      clientTimestamp: z.string(),
    })
  ),
});

export type MoodCheckinInput = z.infer<typeof MoodCheckinSchema>;
export type JournalEntryInput = z.infer<typeof JournalEntrySchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
export type LikeAffirmationInput = z.infer<typeof LikeAffirmationSchema>;
export type CustomAffirmationInput = z.infer<typeof CustomAffirmationSchema>;
export type CompleteMeditationInput = z.infer<typeof CompleteMeditationSchema>;
export type SoulMapStarInput = z.infer<typeof SoulMapStarSchema>;
export type CompleteActivityInput = z.infer<typeof CompleteActivitySchema>;
export type PullOracleCardInput = z.infer<typeof PullOracleCardSchema>;
export type UpgradeSubscriptionInput = z.infer<typeof UpgradeSubscriptionSchema>;
export type BatchSyncInput = z.infer<typeof BatchSyncSchema>;

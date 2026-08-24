import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Celys Care database...");

  const passwordHash = await bcrypt.hash("wellness123", 10);

  // 1. Create or update Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@celyscare.com" },
    update: {},
    create: {
      email: "demo@celyscare.com",
      passwordHash,
      displayName: "Celeste Soul",
      role: "USER",
      profile: {
        create: {
          bio: "Walking my journey towards inner peace and radiant healing. ♡",
          dailyGoal: 4,
          reminderTime: "08:30",
          streakCount: 7,
          lastCheckInDate: new Date(),
          themePreferences: "cosmic-dark",
        },
      },
      subscription: {
        create: {
          plan: "blossom",
          status: "active",
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  console.log(`Created/Verified demo user: ${demoUser.email} (id: ${demoUser.id})`);

  // 2. Initial Mood Check-ins
  const existingMoods = await prisma.moodCheckin.count({ where: { userId: demoUser.id } });
  if (existingMoods === 0) {
    await prisma.moodCheckin.createMany({
      data: [
        {
          userId: demoUser.id,
          mood: "Peaceful",
          label: "Gentle & Grounded",
          color: "#7c3aed",
          intensity: 4,
          tags: "Nature, Morning Walk, Gratitude",
          note: "Felt the crisp morning breeze and meditated under the sun.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          userId: demoUser.id,
          mood: "Radiant",
          label: "Full of Joy & Light",
          color: "#f5d76e",
          intensity: 5,
          tags: "Accomplishment, Friendship, Creativity",
          note: "Connected deeply with loved ones and felt aligned.",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          userId: demoUser.id,
          mood: "Calm",
          label: "Centered & Serene",
          color: "#c96ccc",
          intensity: 4,
          tags: "Tea, Breathwork, Soft Music",
          note: "Taking deep grounding breaths before starting today's rituals.",
          createdAt: new Date(),
        },
      ],
    });
    console.log("Seeded initial mood check-ins.");
  }

  // 3. Initial Journal Entries
  const existingJournal = await prisma.journalEntry.count({ where: { userId: demoUser.id } });
  if (existingJournal === 0) {
    await prisma.journalEntry.createMany({
      data: [
        {
          userId: demoUser.id,
          title: "Whispers of the Evening Wind",
          content: "Tonight I release all the tension I carried through the week. I allow myself to rest without feeling guilty. My worth is not tied to my productivity; my breath is enough.",
          prompt: "What can you release with love today?",
          moodTag: "Peaceful",
          isEncrypted: false,
          tags: "Release, Healing, Nightfall",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          userId: demoUser.id,
          title: "Gratitude for the Light",
          content: "Today I noticed three small miracles: the golden light shining through my window, the warmth of herbal chamomile tea, and the feeling of ease in my chest.",
          prompt: "What three small miracles touched your day?",
          moodTag: "Radiant",
          isEncrypted: false,
          tags: "Gratitude, Miracles, Light",
          createdAt: new Date(),
        },
      ],
    });
    console.log("Seeded initial journal entries.");
  }

  // 4. Initial Liked Affirmations
  const existingAffirmations = await prisma.likedAffirmation.count({ where: { userId: demoUser.id } });
  if (existingAffirmations === 0) {
    await prisma.likedAffirmation.createMany({
      data: [
        {
          userId: demoUser.id,
          affirmationIndex: 0,
          affirmationText: "I am deserving of peace, gentleness, and unconditional love.",
          category: "Self-Love",
        },
        {
          userId: demoUser.id,
          affirmationIndex: 3,
          affirmationText: "I breathe in radiant healing light; I exhale all doubt and fatigue.",
          category: "Healing",
        },
        {
          userId: demoUser.id,
          affirmationIndex: 7,
          affirmationText: "The universe is gently guiding me toward my highest joy.",
          category: "Abundance",
        },
      ],
    });
    console.log("Seeded initial affirmations.");
  }

  // 5. Initial Soul Map Stars
  const existingStars = await prisma.soulMapStar.count({ where: { userId: demoUser.id } });
  if (existingStars === 0) {
    await prisma.soulMapStar.createMany({
      data: [
        {
          userId: demoUser.id,
          x: 25.5,
          y: 35.0,
          color: "#f5d76e",
          emoji: "✨",
          label: "First Step into Serenity",
          category: "Milestone",
          magnitude: 1.2,
        },
        {
          userId: demoUser.id,
          x: 52.0,
          y: 48.0,
          color: "#c96ccc",
          emoji: "🌸",
          label: "Soft Heart, Resilient Soul",
          category: "Affirmation",
          magnitude: 1.0,
        },
        {
          userId: demoUser.id,
          x: 78.0,
          y: 28.0,
          color: "#7c3aed",
          emoji: "🌙",
          label: "Deep Midnight Breath",
          category: "Meditation",
          magnitude: 1.4,
        },
      ],
    });
    console.log("Seeded initial soul map stars.");
  }

  // 6. Initial Oracle Cards
  const existingOracle = await prisma.oracleCard.count({ where: { userId: demoUser.id } });
  if (existingOracle === 0) {
    await prisma.oracleCard.create({
      data: {
        userId: demoUser.id,
        cardTitle: "The Golden Lion of Inner Courage",
        cardSymbol: "🦁",
        cardWisdom: "Step forward with quiet dignity. You do not need to roar to be powerful; your steady presence commands light.",
        interpretation: "Today invites you to trust your intuitive authority and stand peacefully in your truth.",
        pulledAt: new Date(),
      },
    });
    console.log("Seeded initial oracle card.");
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

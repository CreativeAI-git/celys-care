import AppShell from "@/components/layout/AppShell";

// Map human-friendly route aliases to registry IDs
const ROUTE_MAP: Record<string, string> = {
  sanctuary: "calm",
  calm: "calm",
  "check-in": "mood",
  mood: "mood",
  "ai-companion": "chat",
  chat: "chat",
  affirmations: "affirmations",
  breathing: "breathing",
  journal: "journal",
  meditate: "meditation",
  meditation: "meditation",
  sounds: "soundscapes",
  soundscapes: "soundscapes",
  "bubble-game": "bubble",
  bubble: "bubble",
  "coping-games": "coping",
  coping: "coping",
  puzzles: "puzzles",
  activities: "activities",
  "soul-map": "soulmap",
  soulmap: "soulmap",
  "aura-visualizer": "aura",
  aura: "aura",
  "quiet-room": "quiet",
  quiet: "quiet",
  "energy-release": "release",
  release: "release",
  oracle: "oracle",
  subscription: "subscription",
  disclaimer: "disclaimer",
  screenshots: "preview",
  preview: "preview",
  tour: "preview",
  login: "login",
  signup: "login",
};

export function generateStaticParams() {
  return Object.keys(ROUTE_MAP).map((feature) => ({ feature }));
}

export default function FeaturePage({
  params,
}: {
  params: { feature: string };
}) {
  const resolvedFeature = ROUTE_MAP[params.feature.toLowerCase()] || "calm";
  return <AppShell initialScreen={resolvedFeature} />;
}

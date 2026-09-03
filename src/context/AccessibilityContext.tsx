"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/providers";

export const CALMING_COLORS = [
  "#c96ccc", // Lotus Pink
  "#7ec8a0", // Healing Emerald
  "#60a5fa", // Celestial Azure
  "#f5d76e", // Radiant Gold
  "#f87171", // Sunset Coral
];

export interface CalmingThemeConfig {
  id: string;
  name: string;
  color: string;
  glow: string;
  border: string;
  borderStrong: string;
  bgGradient: string;
  toggleGradient: string;
  cardBg: string;
  cardBorder: string;
  navBg: string;
  navFade: string;
  navActiveGradient: string;
  scrollbarThumb: string;
  scrollbarTrack: string;
}

export const CALMING_THEMES: CalmingThemeConfig[] = [
  {
    id: "lotus-purple",
    name: "Lotus Purple",
    color: "#c96ccc",
    glow: "rgba(201, 108, 204, 0.4)",
    border: "rgba(201, 108, 204, 0.22)",
    borderStrong: "rgba(201, 108, 204, 0.55)",
    bgGradient: "radial-gradient(ellipse at 50% 15%, #2a0d5e 0%, #0d0a1e 55%, #15082e 100%)",
    toggleGradient: "linear-gradient(135deg, #c96ccc, #7c3aed)",
    cardBg: "rgba(26, 16, 52, 0.65)",
    cardBorder: "rgba(201, 108, 204, 0.2)",
    navBg: "rgba(20, 12, 38, 0.94)",
    navFade: "linear-gradient(to top, rgba(13, 10, 30, 0.98) 75%, transparent 100%)",
    navActiveGradient: "linear-gradient(135deg, #7c3aed 0%, #c96ccc 100%)",
    scrollbarThumb: "rgba(201, 108, 204, 0.4)",
    scrollbarTrack: "rgba(13, 10, 30, 0.6)",
  },
  {
    id: "healing-emerald",
    name: "Healing Emerald",
    color: "#7ec8a0",
    glow: "rgba(126, 200, 160, 0.4)",
    border: "rgba(126, 200, 160, 0.22)",
    borderStrong: "rgba(126, 200, 160, 0.55)",
    bgGradient: "radial-gradient(ellipse at 50% 15%, #0f3d26 0%, #04140d 55%, #08261a 100%)",
    toggleGradient: "linear-gradient(135deg, #7ec8a0, #059669)",
    cardBg: "rgba(8, 30, 20, 0.65)",
    cardBorder: "rgba(126, 200, 160, 0.2)",
    navBg: "rgba(5, 22, 15, 0.94)",
    navFade: "linear-gradient(to top, rgba(4, 18, 12, 0.98) 75%, transparent 100%)",
    navActiveGradient: "linear-gradient(135deg, #059669 0%, #7ec8a0 100%)",
    scrollbarThumb: "rgba(126, 200, 160, 0.4)",
    scrollbarTrack: "rgba(4, 18, 12, 0.6)",
  },
  {
    id: "celestial-azure",
    name: "Celestial Azure",
    color: "#60a5fa",
    glow: "rgba(96, 165, 250, 0.4)",
    border: "rgba(96, 165, 250, 0.22)",
    borderStrong: "rgba(96, 165, 250, 0.55)",
    bgGradient: "radial-gradient(ellipse at 50% 15%, #0c2e5e 0%, #030e1d 55%, #061e3d 100%)",
    toggleGradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
    cardBg: "rgba(8, 26, 52, 0.65)",
    cardBorder: "rgba(96, 165, 250, 0.2)",
    navBg: "rgba(4, 16, 34, 0.94)",
    navFade: "linear-gradient(to top, rgba(3, 13, 28, 0.98) 75%, transparent 100%)",
    navActiveGradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
    scrollbarThumb: "rgba(96, 165, 250, 0.4)",
    scrollbarTrack: "rgba(3, 13, 28, 0.6)",
  },
  {
    id: "radiant-gold",
    name: "Radiant Gold",
    color: "#f5d76e",
    glow: "rgba(245, 215, 110, 0.4)",
    border: "rgba(245, 215, 110, 0.22)",
    borderStrong: "rgba(245, 215, 110, 0.55)",
    bgGradient: "radial-gradient(ellipse at 50% 15%, #3c2a08 0%, #130d03 55%, #261906 100%)",
    toggleGradient: "linear-gradient(135deg, #f5d76e, #d97706)",
    cardBg: "rgba(36, 26, 7, 0.65)",
    cardBorder: "rgba(245, 215, 110, 0.2)",
    navBg: "rgba(24, 17, 5, 0.94)",
    navFade: "linear-gradient(to top, rgba(19, 13, 3, 0.98) 75%, transparent 100%)",
    navActiveGradient: "linear-gradient(135deg, #d97706 0%, #f5d76e 100%)",
    scrollbarThumb: "rgba(245, 215, 110, 0.4)",
    scrollbarTrack: "rgba(19, 13, 3, 0.6)",
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral",
    color: "#f87171",
    glow: "rgba(248, 113, 113, 0.4)",
    border: "rgba(248, 113, 113, 0.22)",
    borderStrong: "rgba(248, 113, 113, 0.55)",
    bgGradient: "radial-gradient(ellipse at 50% 15%, #46111a 0%, #170509 55%, #2e0c14 100%)",
    toggleGradient: "linear-gradient(135deg, #f87171, #e11d48)",
    cardBg: "rgba(38, 10, 17, 0.65)",
    cardBorder: "rgba(248, 113, 113, 0.2)",
    navBg: "rgba(28, 7, 13, 0.94)",
    navFade: "linear-gradient(to top, rgba(23, 5, 10, 0.98) 75%, transparent 100%)",
    navActiveGradient: "linear-gradient(135deg, #e11d48 0%, #f87171 100%)",
    scrollbarThumb: "rgba(248, 113, 113, 0.4)",
    scrollbarTrack: "rgba(23, 5, 10, 0.6)",
  },
];

export const CALMING_SCENES = [
  "🌊 Ocean",
  "🌿 Forest",
  "🌙 Night Sky",
  "🌸 Garden",
  "🏔️ Mountain",
];

export interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleHighContrast: () => void;
  largeText: boolean;
  setLargeText: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleLargeText: () => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleReducedMotion: () => void;
  activeColor: number;
  setActiveColor: (index: number) => void;
  calmingColor: string;
  currentTheme: CalmingThemeConfig;
  scene: number;
  setScene: (index: number) => void;
  calmingScene: string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  // 1. By default, all 3 toggles are strictly OFF (false) for new users
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<number>(0);
  const [scene, setScene] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const lastSyncedUserRef = useRef<string | null>(null);

  // Apply DOM styling and classes helper
  const applyDomClasses = (hc: boolean, lt: boolean, rm: boolean, ac: number) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("high-contrast", hc);
    root.classList.toggle("large-text", lt);
    root.classList.toggle("reduce-motion", rm);

    const theme = CALMING_THEMES[ac] || CALMING_THEMES[0];
    root.style.setProperty("--calming-accent-color", theme.color);
    root.style.setProperty("--calming-accent-glow", theme.glow);
    root.style.setProperty("--calming-border-color", theme.border);
    root.style.setProperty("--calming-border-strong", theme.borderStrong);
    root.style.setProperty("--calming-bg-gradient", theme.bgGradient);
    root.style.setProperty("--calming-toggle-gradient", theme.toggleGradient);
    root.style.setProperty("--calming-nav-gradient", theme.navActiveGradient);
    root.style.setProperty("--calming-nav-bg", theme.navBg);
    root.style.setProperty("--calming-card-bg", theme.cardBg);
    root.style.setProperty("--calming-card-border", theme.cardBorder);
    root.style.setProperty("--calming-scrollbar-thumb", theme.scrollbarThumb);
    root.style.setProperty("--calming-scrollbar-track", theme.scrollbarTrack);
  };

  // 1. Initial Mount: Load cached preferences from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedHighContrast = localStorage.getItem("celys_a11y_high_contrast") === "true";
      const savedLargeText = localStorage.getItem("celys_a11y_large_text") === "true";
      const savedReducedMotion = localStorage.getItem("celys_a11y_reduced_motion") === "true";

      const savedColor = localStorage.getItem("celys_a11y_active_color");
      const parsedColor = savedColor !== null ? parseInt(savedColor, 10) : 0;
      const validColor = isNaN(parsedColor) || parsedColor < 0 || parsedColor >= CALMING_COLORS.length ? 0 : parsedColor;

      const savedScene = localStorage.getItem("celys_a11y_scene");
      const parsedScene = savedScene !== null ? parseInt(savedScene, 10) : 0;
      const validScene = isNaN(parsedScene) || parsedScene < 0 || parsedScene >= CALMING_SCENES.length ? 0 : parsedScene;

      setHighContrast(savedHighContrast);
      setLargeText(savedLargeText);
      setReducedMotion(savedReducedMotion);
      setActiveColor(validColor);
      setScene(validScene);

      applyDomClasses(savedHighContrast, savedLargeText, savedReducedMotion, validColor);
    } catch { }

    setIsHydrated(true);
  }, []);

  // 2. User Account Sync on Login: Whenever a user logs in on any device, restore their account preferences
  useEffect(() => {
    if (!user) {
      lastSyncedUserRef.current = null;
      return;
    }

    if (user.id !== lastSyncedUserRef.current) {
      lastSyncedUserRef.current = user.id;

      // Check if user has saved preferences in their database profile
      if (user.profile?.themePreferences) {
        try {
          const prefs = JSON.parse(user.profile.themePreferences);
          if (typeof prefs === "object" && prefs !== null) {
            const hc = Boolean(prefs.highContrast);
            const lt = Boolean(prefs.largeText);
            const rm = Boolean(prefs.reducedMotion);
            const ac = typeof prefs.activeColor === "number" && prefs.activeColor >= 0 && prefs.activeColor < CALMING_COLORS.length
              ? prefs.activeColor
              : 0;
            const sc = typeof prefs.scene === "number" && prefs.scene >= 0 && prefs.scene < CALMING_SCENES.length
              ? prefs.scene
              : 0;

            setHighContrast(hc);
            setLargeText(lt);
            setReducedMotion(rm);
            setActiveColor(ac);
            setScene(sc);

            applyDomClasses(hc, lt, rm, ac);

            // Update local storage cache
            try {
              localStorage.setItem("celys_a11y_high_contrast", String(hc));
              localStorage.setItem("celys_a11y_large_text", String(lt));
              localStorage.setItem("celys_a11y_reduced_motion", String(rm));
              localStorage.setItem("celys_a11y_active_color", String(ac));
              localStorage.setItem("celys_a11y_scene", String(sc));
            } catch { }
          }
        } catch {
          // If themePreferences is not JSON (e.g. default "cosmic-dark"), keep clean defaults
        }
      }
    }
  }, [user]);

  // 3. Persist and sync to database profile whenever user changes preferences
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    // Cache locally
    try {
      localStorage.setItem("celys_a11y_high_contrast", String(highContrast));
      localStorage.setItem("celys_a11y_large_text", String(largeText));
      localStorage.setItem("celys_a11y_reduced_motion", String(reducedMotion));
      localStorage.setItem("celys_a11y_active_color", String(activeColor));
      localStorage.setItem("celys_a11y_scene", String(scene));
    } catch { }

    applyDomClasses(highContrast, largeText, reducedMotion, activeColor);

    // If user is authenticated, sync to their cloud account profile in real-time
    if (user?.id) {
      const preferencesPayload = JSON.stringify({
        highContrast,
        largeText,
        reducedMotion,
        activeColor,
        scene,
      });

      // Avoid unnecessary network call if already matches user profile
      if (user.profile?.themePreferences !== preferencesPayload) {
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ themePreferences: preferencesPayload }),
        }).catch(() => {
          // Silently handle if offline; offlineSync or next session will persist
        });
      }
    }
  }, [isHydrated, highContrast, largeText, reducedMotion, activeColor, scene, user]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleLargeText = () => setLargeText((prev) => !prev);
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev);

  const calmingColor = CALMING_COLORS[activeColor] || CALMING_COLORS[0];
  const calmingScene = CALMING_SCENES[scene] || CALMING_SCENES[0];
  const currentTheme = CALMING_THEMES[activeColor] || CALMING_THEMES[0];

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        setHighContrast,
        toggleHighContrast,
        largeText,
        setLargeText,
        toggleLargeText,
        reducedMotion,
        setReducedMotion,
        toggleReducedMotion,
        activeColor,
        setActiveColor,
        calmingColor,
        currentTheme,
        scene,
        setScene,
        calmingScene,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

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
    root.style.setProperty("--calming-accent-color", CALMING_COLORS[ac] || CALMING_COLORS[0]);
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
        scene,
        setScene,
        calmingScene,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

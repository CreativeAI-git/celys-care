import confetti from "canvas-confetti";

/**
 * Platform-wide safe confetti trigger.
 * Strictly respects the "Reduce Motion" accessibility mode.
 */
export const triggerConfetti = (options?: confetti.Options) => {
  if (typeof document !== "undefined") {
    if (document.documentElement.classList.contains("reduce-motion")) {
      return; // Do not trigger confetti particles when reduce-motion is active
    }
  }
  try {
    confetti(options);
  } catch {
    // Ignore audio/canvas context errors on older devices
  }
};

export default triggerConfetti;

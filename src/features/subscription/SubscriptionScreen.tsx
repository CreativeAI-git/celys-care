"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Gamepad2,
  MessageCircle,
  Wind,
  BookOpen,
  Music,
  Shield,
  Star,
  Check,
  Sparkles,
  Clock,
  Crown,
} from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAuth } from "@/app/providers";
import { useAccessibility } from "@/context/AccessibilityContext";
import { toast } from "sonner";
import { triggerConfetti as confetti } from "@/lib/confetti";
import {
  getRevenueCatOfferings,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  checkRevenueCatSubscription,
  RevenueCatPlan,
} from "@/lib/revenuecat";

const SUB_FEATURES = [
  { icon: Brain, label: "Mood-Based Affirmations" },
  { icon: Gamepad2, label: "All Coping Games & Puzzles" },
  { icon: MessageCircle, label: "Unlimited AI Chat with Celys" },
  { icon: Wind, label: "Breathing & Meditation Tools" },
  { icon: BookOpen, label: "Unlimited Journal & Prompts" },
  { icon: Music, label: "Full Relaxation Music Library" },
  { icon: Shield, label: "Private, Secure & Ad-Free" },
];

export const SubscriptionScreen: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { currentTheme } = useAccessibility();
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const [rcPlans, setRcPlans] = useState<RevenueCatPlan[]>([]);
  const [trialData, setTrialData] = useState<{
    hasUsedTrial: boolean;
    isTrialActive: boolean;
    daysRemaining: number;
  }>({
    hasUsedTrial: false,
    isTrialActive: false,
    daysRemaining: 0,
  });

  // Check paid subscription (RevenueCat or Stripe active)
  const isPaidSubscriber = Boolean(
    user?.subscription?.status === "active" &&
    user?.subscription?.plan !== "free" &&
    user?.subscription?.plan !== "celestial_trial"
  );

  // Load trial status & RevenueCat offerings on mount
  useEffect(() => {
    // 1. Fetch internal trial status from our backend
    fetch("/api/subscriptions/trial")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isTrialActive === "boolean") {
          setTrialData({
            hasUsedTrial: data.hasUsedTrial,
            isTrialActive: data.isTrialActive,
            daysRemaining: data.daysRemaining || 0,
          });
        }
      })
      .catch(() => {
        // Fallback to local storage
        const localTrialStart = localStorage.getItem("celys_trial_start");
        const localTrialEnd = localStorage.getItem("celys_trial_end");
        if (localTrialStart && localTrialEnd) {
          const end = new Date(localTrialEnd);
          const diffMs = end.getTime() - Date.now();
          const active = diffMs > 0;
          setTrialData({
            hasUsedTrial: true,
            isTrialActive: active,
            daysRemaining: active ? Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24))) : 0,
          });
        }
      });

    // 2. Fetch offerings from RevenueCat (for Annual & Monthly IAPs)
    getRevenueCatOfferings().then((offerings) => {
      if (offerings && offerings.length > 0) {
        setRcPlans(offerings);
      }
    });

    // 3. Check active RevenueCat entitlements
    checkRevenueCatSubscription().then((isPremium) => {
      if (isPremium) {
        localStorage.setItem("celys_subscribed", "true");
        refreshUser();
      }
    });
  }, [user, refreshUser]);

  const triggerSuccessCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f5d76e", "#c96ccc", "#7c3aed"],
    });
  };

  /**
   * Internal 7-Day Free Trial (Managed by our backend, no credit card required)
   */
  const startInternalTrial = async () => {
    if (isPaidSubscriber) {
      toast.info("You already have an active Celestial Premium subscription!");
      return;
    }
    if (trialData.hasUsedTrial && !trialData.isTrialActive) {
      toast.error("You have already used your 7-Day Free Trial. Please choose a subscription.");
      return;
    }
    if (trialData.isTrialActive) {
      toast.info(`Your 7-Day Free Trial is active (${trialData.daysRemaining} days remaining).`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start trial");
      }

      const trialStart = data.subscription?.trialStart || new Date().toISOString();
      const trialEnd = data.subscription?.trialEnd || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      localStorage.setItem("celys_trial_start", trialStart);
      localStorage.setItem("celys_trial_end", trialEnd);
      localStorage.setItem("celys_subscribed", "true");

      setTrialData({
        hasUsedTrial: true,
        isTrialActive: true,
        daysRemaining: data.daysRemaining || 7,
      });

      triggerSuccessCelebration();
      await refreshUser();
      toast.success("7-Day Free Trial Activated! Enjoy full sanctuary access ✨");
    } catch (err: any) {
      // Local offline fallback
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      localStorage.setItem("celys_trial_start", now.toISOString());
      localStorage.setItem("celys_trial_end", end.toISOString());
      localStorage.setItem("celys_subscribed", "true");

      setTrialData({
        hasUsedTrial: true,
        isTrialActive: true,
        daysRemaining: 7,
      });

      triggerSuccessCelebration();
      toast.success("7-Day Free Trial Activated! Enjoy sanctuary access ✨");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Find selected plan from RevenueCat offerings
   */
  const selectedPlan = rcPlans.find((p) =>
    billing === "annual"
      ? p.id.toLowerCase().includes("annual") || p.period.toLowerCase().includes("annual") || p.period.toLowerCase().includes("year")
      : p.id.toLowerCase().includes("monthly") || p.period.toLowerCase().includes("month")
  ) || rcPlans[0];

  /**
   * Purchase via RevenueCat (Apple In-App Purchase / Google Play Billing)
   */
  const handleRevenueCatSubscribe = async () => {
    setLoading(true);

    // If native platform with raw RevenueCat package
    if (selectedPlan && selectedPlan.rawPackage) {
      try {
        const result = await purchaseRevenueCatPackage(selectedPlan.rawPackage);
        if (result.success && result.isPremium) {
          localStorage.setItem("celys_subscribed", "true");
          triggerSuccessCelebration();
          await refreshUser();
          toast.success("Celestial Premium Activated! Welcome to Sanctuary ✨");
          setLoading(false);
          return;
        } else if (result.error) {
          toast.error(result.error);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn("Native purchase fallback:", err);
      }
    }

    // Web fallback (Stripe or notice)
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billing === "annual" ? "luminary" : "blossom" }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.info("In-app subscriptions are managed via Google Play Store & Apple App Store in the mobile app.");
      }
    } catch {
      toast.info("In-app subscriptions are managed via Google Play Store & Apple App Store in the mobile app.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Restore purchases via RevenueCat
   */
  const handleRestorePurchases = async () => {
    setLoading(true);
    try {
      const res = await restoreRevenueCatPurchases();
      if (res.isPremium) {
        localStorage.setItem("celys_subscribed", "true");
        triggerSuccessCelebration();
        await refreshUser();
        toast.success("Purchases restored! Active subscription unlocked ✨");
      } else {
        toast.info("No active previous purchases found for this account.");
      }
    } catch {
      toast.info("Purchase restoration completed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-5 pt-4 pb-6 text-center w-full max-w-sm mx-auto">
      {/* Centered Golden Logo */}
      <div className="mb-2 flex items-center justify-center">
        <CelysLogo size={80} />
      </div>

      {/* Screen Title & Subtitle */}
      <h2
        className="font-serif text-2xl sm:text-3xl font-bold mt-1"
        style={{
          background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Celys Care Premium
      </h2>
      <p className="text-xs text-purple-200/60 mt-0.5">
        Understand. Support. Empower. You.
      </p>
      <SparkleDivider className="my-2" />

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={13} fill="#f5d76e" style={{ color: "#f5d76e" }} />
        ))}
        <span className="text-xs ml-1.5 text-purple-200/50">
          Trusted by thousands
        </span>
      </div>

      {/* Hero Banner Card (Dynamic based on state) */}
      {isPaidSubscriber ? (
        <div
          className="w-full rounded-3xl p-5 mb-4 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.25), rgba(124,58,237,0.25))",
            border: "2px solid rgba(201,162,39,0.6)",
            boxShadow: "0 0 30px rgba(201,162,39,0.2)",
          }}
        >
          <div className="flex justify-center mb-1.5">
            <Crown size={28} className="text-[#f5d76e]" />
          </div>
          <p
            className="text-[10px] font-bold mb-1 tracking-[0.18em]"
            style={{ color: "#c9a227" }}
          >
            ✦ CELESTIAL MEMBER ✦
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f5d76e, #c9a227)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            Sanctuary Unlocked
          </p>
          <p className="text-xs mt-1 text-purple-100/90">
            Full lifetime cosmic soundscapes, AI chat & rituals active.
          </p>
        </div>
      ) : trialData.isTrialActive ? (
        <div
          className="w-full rounded-3xl p-5 mb-4 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.25), rgba(76,29,149,0.25))",
            border: "2px solid rgba(201,162,39,0.55)",
            boxShadow: "0 0 30px rgba(201,162,39,0.18)",
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-[#f5d76e] text-xs font-semibold mb-1">
            <Clock size={14} />
            <span className="tracking-[0.15em] text-[10px] uppercase font-bold text-[#c9a227]">
              Free Trial In Progress
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.3rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f5d76e, #c9a227)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            {trialData.daysRemaining} {trialData.daysRemaining === 1 ? "Day" : "Days"} Left
          </p>
          <p className="text-xs mt-1 text-purple-100/90">
            Complimentary trial active. Lock in your annual/monthly plan anytime.
          </p>
          <p className="text-[11px] mt-0.5 text-purple-200/50">
            {billing === "annual"
              ? (selectedPlan?.priceString ? `Then ${selectedPlan.priceString}` : "Then $5.83/mo (billed $69.99/yr)")
              : (selectedPlan?.priceString ? `Then ${selectedPlan.priceString}` : "Then $9.99/month")}
          </p>
        </div>
      ) : trialData.hasUsedTrial ? (
        <div
          className="w-full rounded-3xl p-5 mb-4 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(124,58,237,0.18))",
            border: "2px solid rgba(239,68,68,0.35)",
            boxShadow: "0 0 25px rgba(239,68,68,0.1)",
          }}
        >
          <p
            className="text-[10px] font-bold mb-1 tracking-[0.18em]"
            style={{ color: "#f87171" }}
          >
            ✦ TRIAL CONCLUDED ✦
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.1rem",
              fontWeight: 700,
              color: "#fecaca",
              lineHeight: 1.1,
            }}
          >
            Sanctuary Paused
          </p>
          <p className="text-xs mt-1 text-purple-100/80">
            Choose a plan below to continue unlimited AI guidance & rituals.
          </p>
          <p className="text-[11px] mt-0.5 text-purple-200/50">
            {billing === "annual"
              ? (selectedPlan?.priceString ? `${selectedPlan.priceString}` : "$5.83/mo (billed $69.99/yr)")
              : (selectedPlan?.priceString ? `${selectedPlan.priceString}` : "$9.99/month")}
          </p>
        </div>
      ) : (
        <div
          className="w-full rounded-3xl p-5 mb-4 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.22), rgba(124,58,237,0.18))",
            border: "2px solid rgba(201,162,39,0.5)",
            boxShadow: "0 0 30px rgba(201,162,39,0.15)",
          }}
        >
          <div
            className="absolute -top-4 -right-4 rounded-full"
            style={{
              width: 80,
              height: 80,
              background:
                "radial-gradient(circle, rgba(245,215,110,0.25) 0%, transparent 70%)",
            }}
          />
          <p
            className="text-[10px] font-bold mb-1 tracking-[0.18em]"
            style={{ color: "#c9a227" }}
          >
            ✦ LIMITED OFFER ✦
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.4rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f5d76e, #c9a227)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            7 Days Free
          </p>
          <p className="text-xs mt-1 text-purple-100/80">
            Try everything. No credit card required.
          </p>
          <p className="text-[11px] mt-0.5 text-purple-200/40">
            Then {billing === "annual"
              ? (selectedPlan?.priceString ? `${selectedPlan.priceString}` : "$5.83/mo (billed $69.99/yr)")
              : (selectedPlan?.priceString ? `${selectedPlan.priceString}` : "$9.99/month")}
          </p>
        </div>
      )}

      {/* Billing Pill Switcher (for RevenueCat Monthly vs Annual) */}
      <div
        className="flex rounded-full p-1 mb-4 w-full"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(180,120,255,0.2)",
        }}
      >
        {(["monthly", "annual"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className="flex-1 py-2 rounded-full text-xs font-semibold transition-all relative cursor-pointer"
            style={{
              background:
                billing === b
                  ? currentTheme.navActiveGradient
                  : "transparent",
              color: billing === b ? "#fff" : "rgba(240,232,255,0.75)",
            }}
          >
            {b === "monthly" ? "Monthly" : "Annual"}
            {b === "annual" && (
              <span
                className="absolute -top-2.5 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #f5d76e, #c9a227)",
                  color: "#1a0d3d",
                }}
              >
                SAVE 42%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Features List */}
      <div className="flex flex-col gap-2.5 w-full mb-4 text-left">
        {SUB_FEATURES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(124,58,237,0.25)",
                border: "1px solid rgba(180,120,255,0.3)",
              }}
            >
              <Icon size={13} style={{ color: "#c96ccc" }} />
            </div>
            <span className="text-xs flex-1 text-purple-100/90 font-medium">
              {label}
            </span>
            <Check size={13} style={{ color: "#c9a227" }} />
          </div>
        ))}
      </div>

      {/* Action CTA Buttons */}

      {/* 1. Internal 7-Day Free Trial Button (Only for users who haven't started trial yet) */}
      {!isPaidSubscriber && !trialData.hasUsedTrial && (
        <button
          onClick={startInternalTrial}
          disabled={loading}
          className="w-full rounded-full py-3.5 font-bold transition-all hover:brightness-105 active:scale-[0.98] mb-2.5 text-xs text-[#1a0d3d] cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
          style={{
            background: "linear-gradient(135deg, #f5d76e, #c9a227)",
            boxShadow: "0 4px 20px rgba(201,162,39,0.35)",
          }}
        >
          <Sparkles size={14} />
          {loading ? "Activating..." : "✦ Start 7-Day Free Trial"}
        </button>
      )}

      {/* 2. Trial Active Indicator Pill (Shown when trial is running) */}
      {!isPaidSubscriber && trialData.isTrialActive && (
        <div
          className="w-full rounded-full py-2.5 mb-2.5 text-xs font-semibold text-[#f5d76e] flex items-center justify-center gap-2"
          style={{
            background: "rgba(201,162,39,0.12)",
            border: "1px solid rgba(201,162,39,0.3)",
          }}
        >
          <Clock size={13} />
          <span>7-Day Free Trial Active ({trialData.daysRemaining} days remaining)</span>
        </div>
      )}

      {/* 3. RevenueCat Subscription Button (Always manages Annual & Monthly In-App Purchases) */}
      <button
        onClick={handleRevenueCatSubscribe}
        disabled={loading || isPaidSubscriber}
        className="w-full rounded-full py-3 font-semibold text-white transition-all hover:opacity-95 text-xs cursor-pointer shadow-lg disabled:opacity-60"
        style={{
          background: isPaidSubscriber
            ? "rgba(34,197,94,0.2)"
            : currentTheme.navActiveGradient,
          border: isPaidSubscriber
            ? "1px solid rgba(34,197,94,0.4)"
            : `1px solid ${currentTheme.borderStrong}`,
          boxShadow: `0 4px 16px ${currentTheme.glow}`,
        }}
      >
        {isPaidSubscriber
          ? "✓ Celestial Premium Active"
          : loading
          ? "Connecting to Store..."
          : `Subscribe Now — ${selectedPlan?.priceString || (billing === "annual" ? "$69.99/yr" : "$9.99/mo")}`}
      </button>

      <p className="text-[10px] mt-2.5 text-purple-200/35">
        {!trialData.hasUsedTrial
          ? "No credit card needed for 7-day trial · Cancel anytime"
          : "Secure in-app purchase processed via Google Play / Apple App Store"}
      </p>

      {/* Restore Button */}
      <button
        onClick={handleRestorePurchases}
        disabled={loading}
        className="text-[10px] mt-1 text-purple-200/40 hover:text-purple-200 cursor-pointer"
      >
        Restore purchase
      </button>
    </div>
  );
};

export default SubscriptionScreen;

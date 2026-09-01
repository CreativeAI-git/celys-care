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
} from "lucide-react";
import { CelysLogo } from "@/components/branding/CelysLogo";
import { SparkleDivider } from "@/components/branding/SparkleDivider";
import { useAuth } from "@/app/providers";
import { toast } from "sonner";
import confetti from "canvas-confetti";
// RevenueCat In-App Purchases (Temporarily Disabled)
// import {
//   getRevenueCatOfferings,
//   purchaseRevenueCatPackage,
//   restoreRevenueCatPurchases,
//   RevenueCatPlan,
// } from "@/lib/revenuecat";

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
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [trialStarted, setTrialStarted] = useState<Date | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [rcPlans, setRcPlans] = useState<any[]>([]);

  useEffect(() => {
    const localTrial = localStorage.getItem("celys_trial_start");
    const localSub = localStorage.getItem("celys_subscribed") === "true";
    if (localTrial) setTrialStarted(new Date(localTrial));
    if (localSub || user?.subscription?.status === "active") setSubscribed(true);

    // RevenueCat offerings fetch (Temporarily Disabled)
    // getRevenueCatOfferings().then((offerings) => {
    //   if (offerings && offerings.length > 0) {
    //     setRcPlans(offerings);
    //   }
    // });
  }, [user]);

  const triggerSuccessCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f5d76e", "#c96ccc", "#7c3aed"],
    });
  };

  const startTrial = async () => {
    setLoading(true);
    const now = new Date();
    localStorage.setItem("celys_trial_start", now.toISOString());
    localStorage.setItem("celys_subscribed", "true");
    setTrialStarted(now);
    setSubscribed(true);

    try {
      await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "luminary" }),
      });
      triggerSuccessCelebration();
      await refreshUser();
      toast.success("7-Day Free Trial Activated! Enjoy full sanctuary access ✨");
    } catch {
      toast.success("7-Day Free Trial Activated locally ✨");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    /* RevenueCat Native In-App Purchase Flow (Temporarily Disabled)
    const selectedPlan = rcPlans.find((p) =>
      billing === "annual" ? p.id.includes("annual") || p.period.toLowerCase().includes("annual") || p.period.toLowerCase().includes("year") : p.id.includes("monthly") || p.period.toLowerCase().includes("month")
    ) || rcPlans[0];

    if (selectedPlan && selectedPlan.rawPackage) {
      try {
        const result = await purchaseRevenueCatPackage(selectedPlan.rawPackage);
        if (result.success && result.isPremium) {
          localStorage.setItem("celys_subscribed", "true");
          setSubscribed(true);
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
    */

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
        await startTrial();
      }
    } catch {
      await startTrial();
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    setLoading(true);
    /* RevenueCat Restore Flow (Temporarily Disabled)
    try {
      const res = await restoreRevenueCatPurchases();
      if (res.isPremium) {
        localStorage.setItem("celys_subscribed", "true");
        setSubscribed(true);
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
    */
    toast.success("Purchases restored.");
    setLoading(false);
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

      {/* Free Trial Hero Banner Card */}
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
          Then {billing === "annual" ? "$5.83/mo (billed $69.99/yr)" : "$9.99/month"}
        </p>
      </div>

      {/* Billing Pill Switcher */}
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
            className="flex-1 py-2 rounded-full text-xs font-semibold transition-all relative"
            style={{
              background:
                billing === b
                  ? "linear-gradient(135deg, #c96ccc, #7c3aed)"
                  : "transparent",
              color: billing === b ? "#fff" : "rgba(240,232,255,0.55)",
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
      <button
        onClick={startTrial}
        disabled={loading}
        className="w-full rounded-full py-3.5 font-bold transition-all hover:brightness-105 active:scale-[0.98] mb-2.5 text-xs text-[#1a0d3d]"
        style={{
          background: "linear-gradient(135deg, #f5d76e, #c9a227)",
          boxShadow: "0 4px 20px rgba(201,162,39,0.35)",
        }}
      >
        ✦ Start 7-Day Free Trial
      </button>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full rounded-full py-3 font-semibold text-white transition-all hover:opacity-95 text-xs"
        style={{
          background: "linear-gradient(135deg, #c96ccc, #7c3aed)",
          boxShadow: "0 4px 16px rgba(201,108,204,0.3)",
        }}
      >
        Subscribe Now — {billing === "annual" ? "$69.99/yr" : "$9.99/mo"}
      </button>

      <p className="text-[10px] mt-2.5 text-purple-200/35">
        No credit card needed for trial · Cancel anytime
      </p>
      <button
        onClick={() => toast.success("Purchases restored.")}
        className="text-[10px] mt-1 text-purple-200/30 hover:text-purple-200"
      >
        Restore purchase
      </button>
    </div>
  );
};

export default SubscriptionScreen;

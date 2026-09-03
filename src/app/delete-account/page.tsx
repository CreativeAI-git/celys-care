import type { Metadata } from "next";
import {
  LogIn,
  Menu,
  User,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
} from "lucide-react";
import { StarField } from "@/components/branding/StarField";
import { LotusCorners } from "@/components/branding/LotusCorners";
import { CelysLogo } from "@/components/branding/CelysLogo";

export const metadata: Metadata = {
  title: "How to Delete Your Account — Celys Care",
  description:
    "Simple step-by-step guidance on how to permanently delete your Celys Care account, mood check-ins, journal reflections, and personal data.",
  robots: {
    index: true,
    follow: true,
  },
};

const STEPS = [
  {
    step: 1,
    title: "Step 1: Log In to Your Sanctuary",
    icon: LogIn,
    iconColor: "text-[#f5d76e]",
    description:
      "Open the Celys Care app on your device and make sure you are signed in with the account you wish to delete.",
  },
  {
    step: 2,
    title: "Step 2: Open the Directory Menu",
    icon: Menu,
    iconColor: "text-[#c96ccc]",
    description:
      "Tap the Menu icon (☰) in the top-right navigation bar to open your sanctuary directory and account drawer.",
  },
  {
    step: 3,
    title: "Step 3: Scroll to Your Profile Card",
    icon: User,
    iconColor: "text-[#60a5fa]",
    description:
      "Scroll down to the bottom of the menu drawer to locate your Profile Card, which displays your name and email address.",
  },
  {
    step: 4,
    title: "Step 4: Tap 'Delete Account'",
    icon: Trash2,
    iconColor: "text-rose-400",
    description:
      "In the Danger Zone section directly beneath your profile details, tap the red 'Delete Account' button.",
  },
  {
    step: 5,
    title: "Step 5: Confirm Permanent Deletion",
    icon: AlertTriangle,
    iconColor: "text-[#f5d76e]",
    description:
      "A confirmation dialog will appear asking if you are sure. Tap 'Yes, Permanently Delete' to confirm your request.",
  },
  {
    step: 6,
    title: "Step 6: Account Erased & Logged Out",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    description:
      "Your account, mood check-ins, encrypted journals, affirmations, and personal data are permanently erased from our servers immediately. You will be automatically signed out.",
  },
];

export default function DeleteAccountPage() {
  return (
    <div
      className="min-h-screen relative w-full flex flex-col items-center justify-start py-10 sm:py-16 px-4 sm:px-6 overflow-x-hidden antialiased select-none"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, #2a0d5e 0%, #0d0a1e 45%, #1a0838 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Ambient Sanctuary Starfield & Lotus Accents */}
      <StarField count={40} />
      <LotusCorners />

      <main className="relative z-10 w-full max-w-xl flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-4">
          <CelysLogo size={64} />
        </div>

        {/* Top Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-950/60 border border-purple-400/30 text-[#f5d76e] shadow-inner">
            <Sparkles size={11} className="text-[#f5d76e]" />
            ACCOUNT GUIDE
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center mb-2">
          How to Delete Your Account
        </h1>

        <p className="text-xs sm:text-sm text-purple-200/70 text-center mb-6 max-w-md">
          Simple step-by-step guidance to permanently delete your Celys Care account and personal records.
        </p>

        {/* Dashed Notice Box (Celys Care Sanctuary Theme) */}
        <div
          className="w-full rounded-2xl p-4 sm:p-5 mb-8 text-left relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1.5px dashed rgba(180, 120, 255, 0.35)",
          }}
        >
          <p className="text-xs sm:text-[13px] text-purple-200/90 leading-relaxed mb-2.5">
            If you no longer wish to use the <strong className="text-[#f5d76e]">Celys Care</strong> app, you can permanently delete your account and all associated data directly within the app.
          </p>
          <p className="text-xs sm:text-[13px] text-purple-200/70 leading-relaxed">
            Follow the simple steps outlined below to permanently remove your profile and wipe all records from our servers.
          </p>
        </div>

        {/* Section Header */}
        <div className="w-full flex items-center gap-2.5 mb-6">
          <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-[#f5d76e]">
            <Sparkles size={14} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Step-by-Step Guide
          </h2>
        </div>

        {/* Timeline Steps */}
        <div className="w-full space-y-3.5 relative">
          {STEPS.map((item, index) => {
            const IconComponent = item.icon;
            const isLast = index === STEPS.length - 1;

            return (
              <div key={item.step} className="flex items-start gap-3 sm:gap-4 relative">
                {/* Left Number & Vertical Connecting Line */}
                <div className="flex flex-col items-center flex-shrink-0 self-stretch">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#f5d76e] flex-shrink-0 shadow-sm z-10"
                    style={{
                      background: "rgba(124, 58, 237, 0.35)",
                      border: "1px solid rgba(201, 108, 204, 0.5)",
                    }}
                  >
                    {item.step}
                  </div>
                  {!isLast && (
                    <div className="w-[1.5px] bg-purple-400/20 flex-1 my-1" />
                  )}
                </div>

                {/* Step Card Box */}
                <div
                  className="flex-1 rounded-2xl p-4 sm:p-5 text-left transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(180, 120, 255, 0.18)",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <IconComponent size={15} className={`${item.iconColor} flex-shrink-0`} />
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-[13px] text-purple-200/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-purple-400/15 my-8" />

        {/* Important Note Header */}
        <div className="w-full flex items-center gap-2 mb-3.5">
          <AlertTriangle size={17} className="text-rose-400" />
          <h2 className="text-sm sm:text-base font-bold text-rose-300 tracking-wide">
            Important Note
          </h2>
        </div>

        {/* Important Note Card */}
        <div
          className="w-full rounded-2xl p-4 sm:p-5 text-left flex items-start gap-3.5 sm:gap-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(225, 29, 72, 0.12) 0%, rgba(31, 11, 36, 0.4) 100%)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
            <AlertOctagon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white mb-1">
              Permanent &amp; Irreversible
            </h3>
            <p className="text-xs sm:text-[13px] font-semibold text-rose-200/90 mb-1.5">
              Account deletion is irreversible. Once deleted, your data cannot be recovered.
            </p>
            <p className="text-xs sm:text-[12.5px] text-purple-200/70 leading-relaxed">
              This action completely removes your user profile, mood check-ins, encrypted journal entries, affirmations, and milestone records from our servers. Additionally, your local session and cache will be wiped upon confirmation.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-center text-purple-200/40 mt-8">
          © 2026 Celys Care · Your safe space. Your support. Your journey. ♡
        </p>
      </main>
    </div>
  );
}

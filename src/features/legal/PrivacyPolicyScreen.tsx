"use client";

import React from "react";
import { ShieldCheck, Database, EyeOff, Lock } from "lucide-react";

export const PrivacyPolicyScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center px-4 pt-1 pb-8 text-center w-full max-w-md mx-auto select-none">


      {/* Intro Overview Card */}
      <div
        className="w-full rounded-2xl p-4 mb-3 text-left relative overflow-hidden shadow-xl"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(180, 120, 255, 0.22)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: "rgba(124, 58, 237, 0.3)",
              border: "1px solid rgba(201, 108, 204, 0.4)",
            }}
          >
            <ShieldCheck size={16} className="text-[#f5d76e]" />
          </div>
          <p className="text-xs leading-relaxed text-purple-100/90">
            Thank you for using <strong className="text-[#f5d76e]">Celys Care</strong>. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our platform. Chat messages are processed through the Gemini API and are not stored in our database. Your mood records, journal entries, and personalized insights are securely saved to your account.
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div
        className="w-full rounded-2xl p-4 mb-3 text-left shadow-md transition-all hover:bg-white/[0.05]"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(180, 120, 255, 0.18)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <Database size={15} className="text-[#c96ccc]" />
          <h2 className="text-xs sm:text-sm font-semibold text-[#f5d76e] tracking-wide">
            1. Information We Collect
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-purple-200/80">
          We may collect personal information such as your name, email, and usage data to improve our platform and provide personalized experiences. Your chat messages are processed via Gemini API but not retained by us.
        </p>
      </div>

      {/* Section 2 */}
      <div
        className="w-full rounded-2xl p-4 mb-3 text-left shadow-md transition-all hover:bg-white/[0.05]"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(180, 120, 255, 0.18)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <EyeOff size={15} className="text-[#7ec8a0]" />
          <h2 className="text-xs sm:text-sm font-semibold text-[#f5d76e] tracking-wide">
            2. How We Use Your Information
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-purple-200/80">
          Your information is used strictly to enhance <strong className="text-white">Celys Care</strong>, communicate with you, and ensure security. We do not sell your personal data to third parties.
        </p>
      </div>

      {/* Section 3 */}
      <div
        className="w-full rounded-2xl p-4 mb-4 text-left shadow-md transition-all hover:bg-white/[0.05]"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(180, 120, 255, 0.18)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <Lock size={15} className="text-[#60a5fa]" />
          <h2 className="text-xs sm:text-sm font-semibold text-[#f5d76e] tracking-wide">
            3. Data Security
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-purple-200/80">
          We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure.
        </p>
      </div>

      {/* Footer Note */}
      <p
        className="text-[10px] text-center text-purple-200/40"
      >
        © 2026 Celys Care · All rights reserved · Your safe space. Your support. Your journey. 💜
      </p>
    </div>
  );
};

export default PrivacyPolicyScreen;

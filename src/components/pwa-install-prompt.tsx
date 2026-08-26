"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // Check if already installed / standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (iosDevice && !isStandalone) {
      const dismissedIos = localStorage.getItem("celys_pwa_ios_dismissed");
      if (!dismissedIos) {
        setShowBanner(true);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted PWA installation");
      }
      setDeferredPrompt(null);
      setShowBanner(false);
    } else if (isIos) {
      setShowIosModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (isIos) {
      localStorage.setItem("celys_pwa_ios_dismissed", "true");
    }
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-[#171233]/95 text-white p-4 rounded-2xl border border-[#c96ccc]/30 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#9d4edd] to-[#c96ccc] p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#f0e8ff]">Install Celys Care App</h4>
            <p className="text-xs text-[#b8a9db] truncate">
              Get fast offline access & sanctuary on your home screen.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#c96ccc] hover:bg-[#b55bb8] text-white flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-[#8c7cb0] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#171233] text-white max-w-sm w-full p-6 rounded-3xl border border-[#c96ccc]/40 shadow-2xl relative">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8c7cb0] hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-2 text-[#f0e8ff]">Install on iOS</h3>
            <p className="text-xs text-[#b8a9db] mb-4">
              Follow these simple steps in Safari to add Celys Care to your Home Screen:
            </p>
            <ol className="text-xs text-[#d1c4ef] space-y-2 mb-6 list-decimal list-inside bg-black/20 p-3 rounded-xl">
              <li>Tap the <span className="font-semibold text-white">Share button</span> in Safari toolbar.</li>
              <li>Scroll down and select <span className="font-semibold text-white">&quot;Add to Home Screen&quot;</span>.</li>
              <li>Tap <span className="font-semibold text-white">&quot;Add&quot;</span> in top right corner.</li>
            </ol>
            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#c96ccc] text-white text-xs font-semibold shadow-lg"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

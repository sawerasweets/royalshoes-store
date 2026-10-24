"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("[PWA] Service Worker active"))
        .catch((err) => console.log("[PWA] Registration failed:", err));
    }

    // 2. Capture install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install banner if not previously dismissed
      const dismissed = localStorage.getItem("royal_pwa_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem("royal_pwa_dismissed", "true");
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 bg-[#111111] border border-[#D4AF37] p-4 shadow-2xl animate-fade-in text-xs text-[#F5F0E6]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#080808] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
            <Smartphone size={20} />
          </div>
          <div>
            <div className="font-brand font-bold text-sm text-[#D4AF37]">
              INSTALL ROYAL SHOES APP
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Install the mobile app on your phone for 1-tap store management and fast checkout.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 border border-[#2A2A2A] text-gray-400 hover:text-white text-[11px]"
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#AA8822] text-[#080808] font-bold px-4 py-1.5 uppercase tracking-luxury text-[11px] shadow transition-colors"
        >
          <Download size={13} />
          <span>Install App</span>
        </button>
      </div>
    </div>
  );
}

export default PwaRegister;

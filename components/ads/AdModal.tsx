"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import GoogleAd from "@/components/ads/GoogleAd";

/**
 * AdModal — overlay yang menampilkan Google AdSense sebelum konten muncul.
 * Ganti AD_SLOT_ID dengan Slot ID dari dashboard Google AdSense Anda.
 */
const AD_SLOT_ID = "3555135595404080";

interface AdModalProps {
  onDone: () => void;
  skipAfter?: number;
}

export default function AdModal({ onDone, skipAfter = 5 }: AdModalProps) {
  const [countdown, setCountdown] = useState(skipAfter);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const progressPct = skipAfter > 0 ? (countdown / skipAfter) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0a1019 0%, #070c14 100%)",
          borderColor: "rgba(76,150,255,0.2)",
        }}
      >
        {/* ── Progress bar ── */}
        <div className="w-full h-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #00e5ff, #a855f7)",
            }}
          />
        </div>

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "rgba(76,150,255,0.1)" }}
        >
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#66768a" }}
          >
            Advertisement
          </span>

          {countdown > 0 ? (
            <span
              className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", color: "#8494a8" }}
            >
              Skip in {countdown}s
            </span>
          ) : (
            <button
              onClick={onDone}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all hover:bg-white/10 active:scale-95"
              style={{ color: "#00e5ff", border: "1px solid rgba(0,229,255,0.3)" }}
            >
              <X size={12} />
              Skip Ad
            </button>
          )}
        </div>

        {/* ── Google AdSense Unit ── */}
        <div className="px-6 py-6 min-h-[250px] flex items-center justify-center">
          <GoogleAd
            adSlot={AD_SLOT_ID}
            adFormat="auto"
            fullWidthResponsive
            style={{ minHeight: "250px", width: "100%" }}
          />
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 text-center">
          <button
            onClick={onDone}
            disabled={countdown > 0}
            className="text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
            style={{ color: "#66768a" }}
          >
            {countdown > 0
              ? `Content available in ${countdown}s…`
              : "No thanks, continue to content"}
          </button>
        </div>
      </div>
    </div>
  );
}

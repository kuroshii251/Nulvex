"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface Ad {
    id: string;
    title: string;
    description: string;
    cta: string;
    url: string;
    badge?: string;
}

// ─── Ad data ─────────────────────────────────────────────────────────────────
// Replace or extend this array with real ads / fetch from an API
const ADS: Ad[] = [
    {
        id: "ad-1",
        title: "🛡️ HackTheBox — Start Hacking Now",
        description: "Train on real-world cyber security challenges. Build practical skills with CTFs, Pro Labs, and a global community.",
        cta: "Join for Free",
        url: "https://hackthebox.com",
        badge: "Sponsored",
    },
    {
        id: "ad-2",
        title: "🔍 TryHackMe — Learn Cybersecurity",
        description: "Guided learning paths, hands-on rooms, and competitions designed for every skill level from beginner to expert.",
        cta: "Explore Rooms",
        url: "https://tryhackme.com",
        badge: "Sponsored",
    },
    {
        id: "ad-3",
        title: "📡 Shodan — The Internet's Search Engine",
        description: "Discover exposed devices, services, and vulnerabilities across the internet. The essential tool for security researchers.",
        cta: "Try Shodan",
        url: "https://shodan.io",
        badge: "Sponsored",
    },
];

const C = {
    bg: "rgba(0,0,0,0.75)",
    panel: "linear-gradient(180deg, #0a1019 0%, #070c14 100%)",
    border: "rgba(76,150,255,0.2)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
};

interface AdModalProps {
    /** Called when the ad is dismissed and content should be shown */
    onDone: () => void;
    /** Countdown seconds before skip button appears */
    skipAfter?: number;
}

export default function AdModal({ onDone, skipAfter = 5 }: AdModalProps) {
    const [countdown, setCountdown] = useState(skipAfter);
    const [ad] = useState<Ad>(() => ADS[Math.floor(Math.random() * ADS.length)]);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    // progress bar width (100% -> 0% as countdown goes from skipAfter to 0)
    const progressPct = skipAfter > 0 ? (countdown / skipAfter) * 100 : 0;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: C.bg, backdropFilter: "blur(3px)" }}
        >
            <div
                className="relative w-full max-w-md rounded-2xl border overflow-hidden"
                style={{ background: C.panel, borderColor: C.border }}
            >
                {/* ── Progress bar ──────────────────────────────────────────────────── */}
                <div className="w-full h-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div
                        className="h-full transition-all duration-1000 ease-linear"
                        style={{
                            width: `${progressPct}%`,
                            background: "linear-gradient(90deg, #00e5ff, #a855f7)",
                        }}
                    />
                </div>

                {/* ── Header ────────────────────────────────────────────────────────── */}
                <div
                    className="flex items-center justify-between px-5 py-3 border-b"
                    style={{ borderColor: "rgba(76,150,255,0.1)" }}
                >
                    <span
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: C.muted }}
                    >
                        {ad.badge ?? "Advertisement"}
                    </span>

                    {countdown > 0 ? (
                        <span
                            className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(255,255,255,0.05)", color: C.muted2 }}
                        >
                            Skip in {countdown}s
                        </span>
                    ) : (
                        <button
                            onClick={onDone}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all hover:bg-white/10 active:scale-95"
                            style={{ color: C.cyan, border: `1px solid rgba(0,229,255,0.3)` }}
                        >
                            <X size={12} />
                            Skip Ad
                        </button>
                    )}
                </div>

                {/* ── Ad body ───────────────────────────────────────────────────────── */}
                <div className="px-6 py-8 flex flex-col gap-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: "rgba(0,229,255,0.08)" }}
                    >
                        {ad.title.slice(0, 2)}
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-2" style={{ color: C.text }}>
                            {ad.title.replace(/^.{0,3}/, "").trim()}
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: C.muted2 }}>
                            {ad.description}
                        </p>
                    </div>

                    <a
                        href={ad.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-95"
                        style={{
                            background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(168,85,247,0.15))",
                            border: "1px solid rgba(0,229,255,0.25)",
                            color: C.cyan,
                        }}
                    >
                        {ad.cta}
                        <ExternalLink size={14} />
                    </a>

                    <button
                        onClick={onDone}
                        disabled={countdown > 0}
                        className="text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
                        style={{ color: C.muted }}
                    >
                        {countdown > 0 ? `Content available in ${countdown}s…` : "No thanks, continue to content"}
                    </button>
                </div>
            </div>
        </div>
    );
}

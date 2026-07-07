"use client";

import {
    Terminal, Lock, KeyRound, Fingerprint, ScanLine, Link2, Globe, Server,
} from "lucide-react";

const C = {
    panel: "#0a1019",
    panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)",
    borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff",
    muted: "#66768a",
    muted2: "#8494a8",
};

export default function ToolsSection() {
    const tools = [
        { name: "Hash generator", note: "MD5 · SHA-1 · SHA-256", icon: Terminal },
        { name: "Base64 encoder", note: "Encode / decode", icon: KeyRound },
        { name: "AES encryptor", note: "256-bit CBC / GCM", icon: Lock },
        { name: "Password generator", note: "Configurable entropy", icon: Fingerprint },
        { name: "JWT decoder", note: "Header · payload · sig", icon: ScanLine },
        { name: "URL encoder", note: "Percent-encoding", icon: Link2 },
        { name: "DNS lookup", note: "A · AAAA · MX · TXT", icon: Globe },
        { name: "WHOIS lookup", note: "Registrar · dates · NS", icon: Server },
    ];

    return (
        <section id="tools" className="max-w-7xl mx-auto px-7 pb-20">
            <div className="mb-7">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Essential security forge</h2>
                <p style={{ color: C.muted2 }} className="text-sm max-w-md">
                    Quick-access utilities for cryptographic operations and network reconnaissance — no install required.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {tools.map((tool, i) => (
                    <div
                        key={i}
                        className="p-5 rounded-lg border transition-all hover:-translate-y-1"
                        style={{ background: C.panel, borderColor: C.border }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderStrong)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 border"
                            style={{ background: C.panel2, borderColor: C.border }}
                        >
                            <tool.icon size={16} color={C.cyan} />
                        </div>
                        <h3 className="text-[13.5px] font-semibold text-white mb-1">{tool.name}</h3>
                        <p className="text-[11px]" style={{ color: C.muted, fontFamily: "monospace" }}>{tool.note}</p>
                    </div>
                ))}
            </div>
            <div className="flex items-center bg-red-600 p-3 rounded-xl justify-center mx-auto">
                <a href="/tools">View More</a>
            </div>
        </section>
    );
}
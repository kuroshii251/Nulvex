"use client";

import { Lock, ShieldAlert, Terminal, FileCode, Search, KeyRound, Fingerprint, ScanLine, Globe, Link2, Server, MapPin, Cpu, Network } from "lucide-react";

const C = {
    panel: "#0f0f0f",
    panel2: "#171717",
    border: "#262626",
    borderStrong: "rgba(239,68,68,0.35)",
    accent: "#ef4444",
    text: "#ffffff",
    muted: "#a3a3a3",
    muted2: "#d4d4d4",
};

interface SidebarProps {
    activeTool: string;
    setActiveTool: (tool: string) => void;
}

export default function Sidebar({ activeTool, setActiveTool }: SidebarProps) {
    const menuSections = [
        {
            title: "Cryptography",
            icon: Lock,
            items: [
                { id: "base64", name: "Base64 Encoder", icon: FileCode },
                { id: "aes", name: "AES Encryptor", icon: Lock },
                { id: "hash", name: "Hash Generator", icon: Fingerprint },
                { id: "jwt", name: "JWT Decoder", icon: ScanLine },
            ],
        },
        {
            title: "Web Security",
            icon: ShieldAlert,
            items: [
                { id: "clickjackingtest", name: "Clickjacking Test", icon: ShieldAlert },
                { id: "corstest", name: "CORS Tester", icon: Globe },
                { id: "headersanalyzer", name: "Headers Analyzer", icon: Server },
                { id: "urlencode", name: "URL Encoder", icon: Link2 },
            ],
        },
        {
            title: "OSINT & Recon",
            icon: Search,
            items: [
                { id: "whoislookup", name: "WHOIS Lookup", icon: Search },
                { id: "dnslookup", name: "DNS Lookup", icon: Network },
                { id: "subdomain", name: "Subdomain Scanner", icon: Server },
                { id: "ipgeo", name: "IP Geolocation", icon: MapPin },
            ],
        },
        {
            title: "Utilities",
            icon: Terminal,
            items: [
                { id: "reporttemplate", name: "Report Generator", icon: Terminal },
                { id: "passwordgenerator", name: "Password Generator", icon: KeyRound },
                { id: "maclookup", name: "MAC Lookup", icon: Cpu },
            ],
        },
    ];

    return (
        <aside
            className="w-full md:w-64 p-6 flex flex-col gap-6 shrink-0 h-auto md:h-[calc(100vh-5rem)] md:sticky md:top-20 border-r overflow-y-auto"
            style={{ background: C.panel, borderColor: C.border, scrollbarWidth: "none" }}
        >
            {menuSections.map((section, idx) => {
                const SectionIcon = section.icon;
                return (
                <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2 px-3 mb-1">
                        <SectionIcon size={12} style={{ color: C.accent }} />
                        <h4
                            className="text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: C.muted, fontFamily: "monospace" }}
                        >
                            {section.title}
                        </h4>
                    </div>

                    <nav className="space-y-1">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTool === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTool(item.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left border"
                                    style={
                                        isActive
                                            ? {
                                                background: "rgba(239,68,68,0.1)",
                                                borderColor: C.borderStrong,
                                                color: C.text,
                                                boxShadow: "0 0 16px -4px rgba(239,68,68,0.35)",
                                            }
                                            : {
                                                background: "transparent",
                                                borderColor: "transparent",
                                                color: C.text,
                                            }
                                    }
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                            e.currentTarget.style.color = C.text;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = C.text;
                                        }
                                    }}
                                >
                                    <Icon size={15} style={{ color: C.accent }} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            )})}
        </aside>
    );
}
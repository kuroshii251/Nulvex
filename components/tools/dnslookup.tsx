"use client";

import React, { useState } from "react";
import { Network, Loader2, ChevronDown, ChevronRight } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463", amber: "#f59e0b",
};

const RECORD_COLORS: Record<string, string> = {
    A: "#4cd97b", AAAA: "#00e5ff", MX: "#f59e0b", TXT: "#a78bfa", CNAME: "#ff8a3d"
};

export default function DNSLookup() {
    const [domain, setDomain] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState<Record<string, boolean>>({ A: true, MX: true, TXT: true });

    const handleLookup = async () => {
        if (!domain) return;
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(`/api/tools/dns?domain=${encodeURIComponent(domain)}`);
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data);
        } catch { setError("DNS lookup failed."); }
        setLoading(false);
    };

    const toggle = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }));

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Network size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>DNS Lookup</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Query A, AAAA, MX, TXT, and CNAME records for any domain.</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Domain Name</label>
                <div className="flex gap-3">
                    <input value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLookup()}
                        placeholder="example.com"
                        className="flex-1 bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                        style={{ borderColor: C.border }} />
                    <button onClick={handleLookup} disabled={loading || !domain}
                        className="px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ background: "rgba(0,229,255,0.1)", color: C.accent, border: `1px solid ${C.borderStrong}` }}>
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Network size={15} />} Lookup
                    </button>
                </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: "1px solid rgba(255,68,99,0.2)", color: C.danger }}>{error}</div>}

            {result && (
                <div className="space-y-3">
                    <p className="text-sm font-mono font-bold" style={{ color: C.muted }}>Results for <span style={{ color: C.accent }}>{result.domain}</span></p>
                    {Object.entries(result.records as Record<string, any[]>).map(([type, records]) => (
                        <div key={type} className="rounded-2xl border overflow-hidden" style={{ background: C.panel, borderColor: C.border }}>
                            <button onClick={() => toggle(type)} className="w-full flex items-center justify-between p-4 text-left">
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-black tracking-widest" style={{ background: `${RECORD_COLORS[type] || C.accent}18`, color: RECORD_COLORS[type] || C.accent }}>{type}</span>
                                    <span className="text-sm" style={{ color: C.text }}>{records.length} record{records.length !== 1 ? "s" : ""}</span>
                                </div>
                                {expanded[type] ? <ChevronDown size={15} style={{ color: C.muted }} /> : <ChevronRight size={15} style={{ color: C.muted }} />}
                            </button>
                            {expanded[type] && records.length > 0 && (
                                <div className="border-t" style={{ borderColor: C.border }}>
                                    {records.map((r, i) => (
                                        <div key={i} className="px-4 py-2.5 font-mono text-xs border-b last:border-0" style={{ borderColor: C.border, color: C.muted2 }}>
                                            {typeof r === "object" ? JSON.stringify(r) : Array.isArray(r) ? r.join(" ") : String(r)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

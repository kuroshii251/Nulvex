"use client";

import React, { useState } from "react";
import { Server, Loader2, Copy, Check } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463",
};

export default function SubdomainScanner() {
    const [domain, setDomain] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState("");

    const handleScan = async () => {
        if (!domain) return;
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(`/api/tools/subdomain?domain=${encodeURIComponent(domain)}`);
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data);
        } catch { setError("Scan failed. Try again."); }
        setLoading(false);
    };

    const filtered = result?.subdomains?.filter((s: string) => s.includes(filter)) ?? [];

    const handleCopy = () => {
        navigator.clipboard.writeText(filtered.join("\n"));
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Server size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>Subdomain Scanner</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Discover subdomains using certificate transparency logs (crt.sh). Passive — no active probing.</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Target Domain</label>
                <div className="flex gap-3">
                    <input value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === "Enter" && handleScan()}
                        placeholder="example.com"
                        className="flex-1 bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                        style={{ borderColor: C.border }} />
                    <button onClick={handleScan} disabled={loading || !domain}
                        className="px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ background: "rgba(0,229,255,0.1)", color: C.accent, border: `1px solid ${C.borderStrong}` }}>
                        {loading ? <><Loader2 size={15} className="animate-spin" /> Scanning...</> : <><Server size={15} /> Scan</>}
                    </button>
                </div>
                <p className="text-xs" style={{ color: C.muted }}>⚠ Results from certificate transparency logs. May take up to 30 seconds for large domains.</p>
            </div>

            {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: "1px solid rgba(255,68,99,0.2)", color: C.danger }}>{error}</div>}

            {result && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold" style={{ color: C.text }}>Found <span style={{ color: C.accent }}>{result.count}</span> subdomains</p>
                        <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors"
                            style={{ borderColor: C.border, color: copied ? C.success : C.muted2 }}>
                            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied!" : "Copy All"}
                        </button>
                    </div>
                    <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter results..."
                        className="w-full bg-black border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                        style={{ borderColor: C.border }} />
                    <div className="rounded-2xl border overflow-hidden" style={{ background: C.panel, borderColor: C.border }}>
                        <div className="max-h-80 overflow-y-auto">
                            {filtered.length > 0 ? filtered.map((s: string, i: number) => (
                                <div key={i} className="px-4 py-2.5 font-mono text-sm border-b last:border-0" style={{ borderColor: "rgba(76,150,255,0.06)", color: C.accent }}>
                                    {s}
                                </div>
                            )) : <p className="text-center py-8 text-sm" style={{ color: C.muted }}>No matching subdomains</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

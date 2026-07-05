"use client";

import React, { useState } from "react";
import { Server, ShieldCheck, ShieldX, Loader2 } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463", amber: "#f59e0b",
};

const SECURITY_HEADERS = [
    { key: "strict-transport-security", label: "Strict-Transport-Security (HSTS)", desc: "Forces HTTPS connections.", severity: "high" },
    { key: "content-security-policy", label: "Content-Security-Policy (CSP)", desc: "Prevents XSS and injection attacks.", severity: "high" },
    { key: "x-frame-options", label: "X-Frame-Options", desc: "Prevents clickjacking attacks.", severity: "medium" },
    { key: "x-content-type-options", label: "X-Content-Type-Options", desc: "Prevents MIME sniffing.", severity: "medium" },
    { key: "referrer-policy", label: "Referrer-Policy", desc: "Controls referer header disclosure.", severity: "low" },
    { key: "permissions-policy", label: "Permissions-Policy", desc: "Controls browser feature access.", severity: "low" },
];

export default function HeadersAnalyzer() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!url) return;
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(`/api/tools/headers?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data);
        } catch { setError("Failed to connect. Check URL."); }
        setLoading(false);
    };

    const score = result?.score ?? 0;
    const scoreColor = score >= 75 ? C.success : score >= 50 ? C.amber : C.danger;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Server size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>HTTP Headers Analyzer</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Scan a website for missing or misconfigured security headers.</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Target URL</label>
                <div className="flex gap-3">
                    <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                        placeholder="https://example.com"
                        className="flex-1 bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                        style={{ borderColor: C.border }} />
                    <button onClick={handleAnalyze} disabled={loading || !url}
                        className="px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ background: "rgba(0,229,255,0.1)", color: C.accent, border: `1px solid ${C.borderStrong}` }}>
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Server size={15} />} Analyze
                    </button>
                </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: "1px solid rgba(255,68,99,0.2)", color: C.danger }}>{error}</div>}

            {result && (
                <div className="space-y-4">
                    {/* Score Card */}
                    <div className="p-5 rounded-2xl border flex items-center justify-between" style={{ background: C.panel, borderColor: C.border }}>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: C.text }}>Security Score</p>
                            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{result.missingHeaders?.length} of {SECURITY_HEADERS.length} critical headers missing</p>
                        </div>
                        <div className="text-5xl font-black tabular-nums" style={{ color: scoreColor }}>{score}<span className="text-2xl">/100</span></div>
                    </div>

                    {/* Headers Grid */}
                    <div className="grid gap-3">
                        {SECURITY_HEADERS.map(h => {
                            const present = !result.missingHeaders?.includes(h.label);
                            return (
                                <div key={h.key} className="p-4 rounded-xl border flex items-start gap-3"
                                    style={{ background: C.panel, borderColor: present ? "rgba(76,217,123,0.2)" : "rgba(255,68,99,0.15)" }}>
                                    {present ? <ShieldCheck size={18} style={{ color: C.success, flexShrink: 0, marginTop: 2 }} /> : <ShieldX size={18} style={{ color: C.danger, flexShrink: 0, marginTop: 2 }} />}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold font-mono" style={{ color: present ? C.success : C.danger }}>{h.label}</p>
                                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{h.desc}</p>
                                        {present && result.rawHeaders?.[h.key] && (
                                            <p className="text-[11px] mt-1 truncate" style={{ color: C.accent }}>{result.rawHeaders[h.key]}</p>
                                        )}
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                                        style={{ background: h.severity === "high" ? "rgba(255,68,99,0.1)" : h.severity === "medium" ? "rgba(245,158,11,0.1)" : "rgba(76,150,255,0.1)", color: h.severity === "high" ? C.danger : h.severity === "medium" ? C.amber : C.accent }}>
                                        {h.severity}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

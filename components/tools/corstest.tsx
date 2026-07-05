"use client";

import React, { useState } from "react";
import { Globe, ShieldCheck, ShieldX, Loader2 } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463", amber: "#f59e0b",
};

export default function CORSTester() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTest = async () => {
        if (!url) return;
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(`/api/tools/cors?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data);
        } catch { setError("Request failed. Check the URL format."); }
        setLoading(false);
    };

    const isVulnerable = result?.allowOrigin === "*" || result?.analysis?.includes("Vulnerable");
    const statusColor = result ? (isVulnerable ? C.danger : C.success) : C.muted;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Globe size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>CORS Misconfiguration Tester</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Test a URL for permissive CORS policies that could allow cross-origin attacks.</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Target URL</label>
                <div className="flex gap-3">
                    <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleTest()}
                        placeholder="https://api.example.com"
                        className="flex-1 bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono transition-colors"
                        style={{ borderColor: C.border }} />
                    <button onClick={handleTest} disabled={loading || !url}
                        className="px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ background: "rgba(0,229,255,0.1)", color: C.accent, border: `1px solid ${C.borderStrong}` }}>
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />} Test
                    </button>
                </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: "1px solid rgba(255,68,99,0.2)", color: C.danger }}>{error}</div>}

            {result && (
                <div className="space-y-4">
                    <div className="p-5 rounded-2xl border flex items-center gap-4" style={{ background: C.panel, borderColor: isVulnerable ? "rgba(255,68,99,0.4)" : "rgba(76,217,123,0.4)" }}>
                        {isVulnerable ? <ShieldX size={28} style={{ color: C.danger }} /> : <ShieldCheck size={28} style={{ color: C.success }} />}
                        <div>
                            <p className="font-bold text-base" style={{ color: statusColor }}>{result.analysis}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{result.url}</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl border space-y-3" style={{ background: C.panel, borderColor: C.border }}>
                        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>CORS Headers</span>
                        {[
                            { key: "Access-Control-Allow-Origin", val: result.allowOrigin },
                            { key: "Access-Control-Allow-Credentials", val: result.allowCredentials },
                            { key: "Access-Control-Allow-Methods", val: result.allowMethods },
                        ].map(row => (
                            <div key={row.key} className="flex items-start justify-between gap-4 py-2 border-b" style={{ borderColor: C.border }}>
                                <span className="text-xs font-mono" style={{ color: C.muted2 }}>{row.key}</span>
                                <span className="text-xs font-mono font-bold" style={{ color: row.val === "*" ? C.danger : row.val === "None" ? C.muted : C.accent }}>{row.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

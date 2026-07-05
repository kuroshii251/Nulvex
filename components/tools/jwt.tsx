"use client";

import React, { useState } from "react";
import { ScanLine, Copy, Check, AlertTriangle } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463", amber: "#f59e0b",
};

function base64UrlDecode(str: string): string {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + (4 - (str.length % 4)) % 4, "=");
    try { return decodeURIComponent(escape(atob(padded))); } catch { return atob(padded); }
}

function formatJSON(str: string) {
    try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str; }
}

export default function JWTDecoder() {
    const [token, setToken] = useState("");
    const [copied, setCopied] = useState<string | null>(null);

    const parts = token.trim().split(".");
    const isValid = parts.length === 3;

    let header: any = null, payload: any = null, headerRaw = "", payloadRaw = "";
    if (isValid) {
        try { headerRaw = formatJSON(base64UrlDecode(parts[0])); header = JSON.parse(headerRaw); } catch {}
        try { payloadRaw = formatJSON(base64UrlDecode(parts[1])); payload = JSON.parse(payloadRaw); } catch {}
    }

    const isExpired = payload?.exp ? (payload.exp * 1000 < Date.now()) : null;

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <ScanLine size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>JWT Decoder</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Decode and inspect JSON Web Tokens. Everything runs in your browser — no server.</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>JWT Token</label>
                <textarea value={token} onChange={e => setToken(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none min-h-[100px] font-mono resize-y break-all transition-colors"
                    style={{ borderColor: C.border }} />
            </div>

            {token && !isValid && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: `1px solid rgba(255,68,99,0.2)`, color: C.danger }}>
                    <AlertTriangle size={15} /> Invalid JWT format — must have 3 dot-separated parts.
                </div>
            )}

            {isValid && (
                <div className="grid gap-4">
                    {/* Expiry Status */}
                    {isExpired !== null && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                            style={{ background: isExpired ? "rgba(255,68,99,0.08)" : "rgba(76,217,123,0.08)", border: `1px solid ${isExpired ? "rgba(255,68,99,0.25)" : "rgba(76,217,123,0.25)"}`, color: isExpired ? C.danger : C.success }}>
                            <span className={`w-2 h-2 rounded-full inline-block`} style={{ background: isExpired ? C.danger : C.success }} />
                            {isExpired ? "Token is EXPIRED" : `Valid until ${new Date((payload.exp * 1000)).toLocaleString()}`}
                        </div>
                    )}

                    {[
                        { title: "Header", raw: headerRaw, data: header, key: "header" },
                        { title: "Payload", raw: payloadRaw, data: payload, key: "payload" },
                    ].map(({ title, raw, data, key }) => (
                        <div key={key} className="p-5 rounded-2xl border space-y-3" style={{ background: C.panel, borderColor: C.border }}>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>{title}</span>
                                <button onClick={() => handleCopy(raw, key)} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border transition-colors"
                                    style={{ borderColor: C.border, color: copied === key ? C.success : C.muted2 }}>
                                    {copied === key ? <Check size={12} /> : <Copy size={12} />} {copied === key ? "Copied!" : "Copy"}
                                </button>
                            </div>
                            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-all" style={{ color: C.accent }}>{raw || "—"}</pre>
                        </div>
                    ))}

                    <div className="p-5 rounded-2xl border" style={{ background: C.panel, borderColor: C.border }}>
                        <span className="text-[11px] font-bold uppercase tracking-widest block mb-3" style={{ color: C.muted }}>Signature</span>
                        <p className="font-mono text-xs break-all" style={{ color: "#a78bfa" }}>{parts[2]}</p>
                        <p className="text-[11px] mt-2" style={{ color: C.muted }}>⚠ Signature verification requires the secret key. This decoder does not verify signatures.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { Cpu, Loader2 } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463",
};

function formatMAC(raw: string) {
    const clean = raw.replace(/[^a-fA-F0-9]/g, "").slice(0, 12);
    return clean.match(/.{1,2}/g)?.join(":") ?? clean;
}

export default function MACLookup() {
    const [mac, setMac] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLookup = async () => {
        const cleanMac = mac.replace(/[^a-fA-F0-9]/g, "");
        if (cleanMac.length < 6) { setError("Please enter at least 6 hex characters of a MAC address."); return; }
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(`/api/tools/mac?mac=${encodeURIComponent(cleanMac)}`);
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data);
        } catch { setError("Lookup failed."); }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Cpu size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>MAC Address Lookup</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Identify the hardware vendor from the OUI (first 3 bytes) of any MAC address.</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>MAC Address</label>
                <div className="flex gap-3">
                    <input
                        value={mac}
                        onChange={e => setMac(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleLookup()}
                        placeholder="e.g. 00:1A:2B:3C:4D:5E"
                        className="flex-1 bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                        style={{ borderColor: C.border }}
                    />
                    <button onClick={handleLookup} disabled={loading || !mac}
                        className="px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ background: "rgba(0,229,255,0.1)", color: C.accent, border: `1px solid ${C.borderStrong}` }}>
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Cpu size={15} />} Lookup
                    </button>
                </div>
                <p className="text-xs" style={{ color: C.muted }}>Accepts any format: AA:BB:CC:DD:EE:FF, AA-BB-CC, AABBCC, etc.</p>
            </div>

            {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: "1px solid rgba(255,68,99,0.2)", color: C.danger }}>{error}</div>}

            {result && (
                <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ background: "rgba(0,229,255,0.08)", border: `1px solid ${C.borderStrong}` }}>
                            <Cpu size={28} style={{ color: C.accent }} />
                        </div>
                        <div>
                            <p className="text-xl font-bold" style={{ color: C.text }}>{result.vendor}</p>
                            <p className="text-sm font-mono mt-1" style={{ color: C.muted }}>{formatMAC(result.mac)}</p>
                        </div>
                    </div>
                    <div className="pt-3 border-t" style={{ borderColor: C.border }}>
                        <p className="text-xs" style={{ color: C.muted }}>OUI (Organizationally Unique Identifier) data sourced from IEEE registry via macvendors.com</p>
                    </div>
                </div>
            )}
        </div>
    );
}

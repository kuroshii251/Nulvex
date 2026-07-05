"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463",
};

export default function IPGeolocation() {
    const [ip, setIp] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLookup = async (targetIp = ip) => {
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(`/api/tools/ipgeo${targetIp ? `?ip=${encodeURIComponent(targetIp)}` : ""}`);
            const data = await res.json();
            if (data.status === "fail" || data.error) setError(data.message || data.error || "Lookup failed");
            else setResult(data);
        } catch { setError("Lookup failed."); }
        setLoading(false);
    };

    const fields = result ? [
        { label: "IP Address", value: result.query },
        { label: "Country", value: `${result.country} (${result.countryCode})` },
        { label: "Region", value: result.regionName },
        { label: "City", value: result.city },
        { label: "ZIP Code", value: result.zip || "—" },
        { label: "Timezone", value: result.timezone },
        { label: "ISP", value: result.isp },
        { label: "Organization", value: result.org },
        { label: "ASN", value: result.as },
        { label: "Latitude", value: result.lat },
        { label: "Longitude", value: result.lon },
    ] : [];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <MapPin size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>IP Geolocation</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Locate any IP address with ISP, ASN, and geographic data. Leave blank to look up your own IP.</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>IP Address (leave blank for your own)</label>
                <div className="flex gap-3">
                    <input value={ip} onChange={e => setIp(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLookup()}
                        placeholder="e.g. 8.8.8.8"
                        className="flex-1 bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                        style={{ borderColor: C.border }} />
                    <button onClick={() => handleLookup()} disabled={loading}
                        className="px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        style={{ background: "rgba(0,229,255,0.1)", color: C.accent, border: `1px solid ${C.borderStrong}` }}>
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />} Locate
                    </button>
                </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: "1px solid rgba(255,68,99,0.2)", color: C.danger }}>{error}</div>}

            {result && (
                <div className="p-5 rounded-2xl border space-y-1" style={{ background: C.panel, borderColor: C.border }}>
                    {fields.map(f => (
                        <div key={f.label} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: "rgba(76,150,255,0.06)" }}>
                            <span className="text-xs" style={{ color: C.muted }}>{f.label}</span>
                            <span className="text-sm font-mono font-semibold" style={{ color: C.text }}>{String(f.value || "—")}</span>
                        </div>
                    ))}
                    {result.lat && result.lon && (
                        <a href={`https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}&zoom=12`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 pt-3 text-sm font-semibold transition-colors hover:opacity-80"
                            style={{ color: C.accent }}>
                            <MapPin size={14} /> View on Map →
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

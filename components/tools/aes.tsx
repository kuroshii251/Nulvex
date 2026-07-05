"use client";

import React, { useState } from "react";
import { Lock, Copy, Check } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019", panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)", borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff", text: "#e7edf5", muted: "#66768a", muted2: "#8494a8",
    success: "#4cd97b", danger: "#ff4463",
};

function b64ToUint8(base64: string) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
function uint8ToB64(buffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export default function AESEncryptor() {
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
    const [input, setInput] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const deriveKey = async (password: string) => {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
        return crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: enc.encode("nulvex-salt"), iterations: 100000, hash: "SHA-256" },
            keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
        );
    };

    const handleProcess = async () => {
        if (!input || !secretKey) { setError("Please fill in both fields."); return; }
        setError(""); setLoading(true);
        try {
            const key = await deriveKey(secretKey);
            if (mode === "encrypt") {
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const enc = new TextEncoder();
                const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(input));
                const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
                combined.set(iv, 0); combined.set(new Uint8Array(encrypted), iv.byteLength);
                setOutput(uint8ToB64(combined.buffer));
            } else {
                const combined = b64ToUint8(input);
                const iv = combined.slice(0, 12);
                const data = combined.slice(12);
                const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
                setOutput(new TextDecoder().decode(decrypted));
            }
        } catch (e: any) {
            setError(mode === "decrypt" ? "Decryption failed. Wrong key or corrupted data." : e.message);
            setOutput("");
        }
        setLoading(false);
    };

    const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Lock size={22} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>AES-256 Encryptor</h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted2 }}>Client-side AES-256-GCM encryption. Your key never leaves your browser.</p>
                </div>
            </div>

            <div className="flex bg-black rounded-xl p-1 border w-max" style={{ borderColor: C.border }}>
                {(["encrypt", "decrypt"] as const).map(m => (
                    <button key={m} onClick={() => { setMode(m); setOutput(""); setError(""); }}
                        className="px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all capitalize"
                        style={{ background: mode === m ? "rgba(0,229,255,0.1)" : "transparent", color: mode === m ? C.accent : C.muted, border: mode === m ? `1px solid ${C.borderStrong}` : "1px solid transparent" }}>
                        {m}
                    </button>
                ))}
            </div>

            <div className="grid gap-5">
                <div className="p-6 rounded-2xl border space-y-4" style={{ background: C.panel, borderColor: C.border }}>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Secret Key (Password)</label>
                        <input value={secretKey} onChange={e => setSecretKey(e.target.value)} type="password"
                            placeholder="Enter your secret key..."
                            className="w-full bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-mono"
                            style={{ borderColor: C.border }} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>
                            {mode === "encrypt" ? "Plaintext Input" : "Encrypted Input (Base64)"}
                        </label>
                        <textarea value={input} onChange={e => setInput(e.target.value)}
                            placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Paste base64 encrypted string..."}
                            className="w-full bg-black border rounded-xl px-4 py-3 text-sm text-white focus:outline-none min-h-[110px] font-mono resize-y transition-colors"
                            style={{ borderColor: C.border }} />
                    </div>
                    {error && <p className="text-sm px-3 py-2 rounded-lg" style={{ color: C.danger, background: "rgba(255,68,99,0.08)", border: `1px solid rgba(255,68,99,0.2)` }}>{error}</p>}
                    <button onClick={handleProcess} disabled={loading}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                        style={{ background: "rgba(0,229,255,0.12)", color: C.accent, border: `1px solid ${C.borderStrong}` }}>
                        {loading ? "Processing..." : mode === "encrypt" ? "Encrypt →" : "Decrypt →"}
                    </button>
                </div>

                {output && (
                    <div className="p-6 rounded-2xl border space-y-3" style={{ background: C.panel, borderColor: C.borderStrong }}>
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>Output</label>
                            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border transition-colors"
                                style={{ borderColor: C.border, color: copied ? C.success : C.muted2 }}>
                                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <p className="font-mono text-sm break-all leading-relaxed" style={{ color: C.accent }}>{output}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

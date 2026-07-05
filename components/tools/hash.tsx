"use client";

import React, { useState, useEffect } from "react";
import { Fingerprint, Copy, Check } from "lucide-react";

const C = {
    accent: "text-red-500",
    panel: "#0a1019",
    panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)",
    borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
};

export default function HashGenerator() {
    const [input, setInput] = useState("");
    const [algo, setAlgo] = useState("SHA-256");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!input) {
            setOutput("");
            return;
        }

        const generateHash = async () => {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(input);
                const hashBuffer = await crypto.subtle.digest(algo, data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                setOutput(hashHex);
            } catch (e) {
                setOutput("Error generating hash");
            }
        };

        generateHash();
    }, [input, algo]);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Fingerprint size={24} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>Hash Generator</h2>
                    <p className="text-sm mt-1" style={{ color: C.muted2 }}>Generate cryptographic hashes instantly.</p>
                </div>
            </div>
            
            <div className="p-6 rounded-2xl border space-y-6" style={{ background: C.panel, borderColor: C.border }}>
               <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Algorithm</label>
                 <select 
                    value={algo} 
                    onChange={e => setAlgo(e.target.value)}
                    className="w-full bg-black border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
                    style={{ borderColor: C.border }}
                 >
                    <option value="SHA-1">SHA-1</option>
                    <option value="SHA-256">SHA-256</option>
                    <option value="SHA-384">SHA-384</option>
                    <option value="SHA-512">SHA-512</option>
                 </select>
               </div>

               <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Input Text</label>
                 <textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter text to hash..."
                    className="w-full bg-black border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors min-h-[120px] font-mono resize-y"
                    style={{ borderColor: C.border }}
                 />
               </div>

               <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Hash Output</label>
                 <div className="relative">
                    <textarea 
                        readOnly
                        value={output}
                        placeholder="Hash output will appear here..."
                        className="w-full bg-black border rounded-lg px-4 py-3 text-sm focus:outline-none min-h-[120px] font-mono break-all resize-none"
                        style={{ borderColor: C.border, color: C.accent, background: "rgba(0,229,255,0.03)" }}
                    />
                    {output && (
                        <button 
                            onClick={handleCopy}
                            className="absolute top-3 right-3 p-1.5 rounded-md border transition-colors hover:bg-white/10"
                            style={{ borderColor: C.border, background: C.panel2, color: C.text }}
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                        </button>
                    )}
                 </div>
               </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { Link2, ArrowRightLeft, Copy, Check } from "lucide-react";

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

export default function URLEncoder() {
    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!input) {
            setOutput("");
            return;
        }

        try {
            if (mode === "encode") {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch (e) {
            setOutput("Error: Invalid URL encoding");
        }
    }, [input, mode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg border" style={{ background: C.panel2, borderColor: C.border }}>
                    <Link2 size={24} style={{ color: C.accent }} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: C.text }}>URL Encoder / Decoder</h2>
                    <p className="text-sm mt-1" style={{ color: C.muted2 }}>Encode or decode URL percent-encoded strings.</p>
                </div>
            </div>
            
            <div className="p-6 rounded-2xl border space-y-6" style={{ background: C.panel, borderColor: C.border }}>
               <div className="flex bg-black rounded-lg p-1 border w-max" style={{ borderColor: C.border }}>
                  <button 
                     onClick={() => setMode("encode")}
                     className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${mode === "encode" ? "bg-white/10 text-white" : ""}`}
                     style={{ color: mode === "encode" ? C.text : C.muted }}
                  >
                     Encode
                  </button>
                  <button 
                     onClick={() => setMode("decode")}
                     className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${mode === "decode" ? "bg-white/10 text-white" : ""}`}
                     style={{ color: mode === "decode" ? C.text : C.muted }}
                  >
                     Decode
                  </button>
               </div>

               <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Input String</label>
                 <textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Enter text to ${mode}...`}
                    className="w-full bg-black border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors min-h-[120px] font-mono resize-y"
                    style={{ borderColor: C.border }}
                 />
               </div>

               <div>
                 <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>Output</label>
                 <div className="relative">
                    <textarea 
                        readOnly
                        value={output}
                        placeholder={`Output will appear here...`}
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

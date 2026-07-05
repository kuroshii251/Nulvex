"use client";

import React, { useState, useEffect } from "react";

type AlgoType = "base64" | "hex" | "rsa-key" | "caesar";

export default function CryptoTool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [algo, setAlgo] = useState<AlgoType>("base64");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    // Opsi spesifik untuk masing-masing algoritma (Kayak Cryptii)
    const [b64Variant, setB64Variant] = useState<"standard" | "url-safe">("standard");
    const [hexDelimiter, setHexDelimiter] = useState<"space" | "none" | "comma">("space");
    const [rsaAction, setRsaAction] = useState<"strip" | "wrap">("strip");
    const [caesarShift, setCaesarShift] = useState<number>(3);

    // Fungsi pemrosesan data (otomatis jalan tiap ada perubahan state)
    useEffect(() => {
        if (!input) {
            setOutput("");
            return;
        }

        try {
            let result = "";

            // 1. LOGIC BASE64
            if (algo === "base64") {
                if (mode === "encode") {
                    let encoded = btoa(input);
                    if (b64Variant === "url-safe") {
                        encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
                    }
                    result = encoded;
                } else {
                    let cleanInput = input.trim();
                    if (b64Variant === "url-safe") {
                        cleanInput = cleanInput.replace(/-/g, "+").replace(/_/g, "/");
                        while (cleanInput.length % 4) cleanInput += "=";
                    }
                    result = atob(cleanInput);
                }
            }

            // 2. LOGIC HEXADECIMAL
            else if (algo === "hex") {
                if (mode === "encode") {
                    const delimiter = hexDelimiter === "space" ? " " : hexDelimiter === "comma" ? "," : "";
                    result = Array.from(input)
                        .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0"))
                        .join(delimiter);
                } else {
                    let cleanHex = input;
                    if (hexDelimiter === "space") cleanHex = input.replace(/\s+/g, "");
                    if (hexDelimiter === "comma") cleanHex = input.replace(/,/g, "");

                    const matches = cleanHex.match(/.{1,2}/g);
                    if (!matches) throw new Error();
                    result = matches.map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
                }
            }

            // 3. LOGIC RSA KEY MANAGEMENT
            else if (algo === "rsa-key") {
                if (mode === "decode" && rsaAction === "strip") {
                    // Opsi bersihin header
                    result = input
                        .replace(/-----(BEGIN|END)[A-Z0-9\s]+-----/g, "")
                        .replace(/\s+/g, "");
                } else if (mode === "encode" && rsaAction === "wrap") {
                    // Opsi bungkus teks biasa jadi mock key block
                    const chunks = btoa(input).match(/.{1,64}/g)?.join("\n") || btoa(input);
                    result = `-----BEGIN RSA PRIVATE KEY-----\n${chunks}\n-----END RSA PRIVATE KEY-----`;
                } else {
                    result = input; // fallback jika opsi tidak sinkron dengan mode
                }
            }

            // 4. LOGIC CAESAR CIPHER (Khas Cryptii)
            else if (algo === "caesar") {
                const shift = mode === "encode" ? caesarShift : (26 - caesarShift) % 26;
                result = input.replace(/[a-zA-Z]/g, (ch) => {
                    const code = ch.charCodeAt(0);
                    const base = code >= 65 && code <= 90 ? 65 : 97;
                    return String.fromCharCode(((code - base + shift) % 26) + base);
                });
            }

            setOutput(result);
        } catch (err) {
            setOutput("[ERROR] Input tidak valid atau corrupt untuk opsi yang dipilih.");
        }
    }, [input, algo, mode, b64Variant, hexDelimiter, rsaAction, caesarShift]);

    return (
        <div className="space-y-6 max-w-7xl p-6 bg-gray-900 border border-white/5 rounded-2xl text-gray-200">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Modular Cryptography Interface</h2>
                <p className="text-xs text-gray-500 mt-1">Responsive pipeline architecture inspired by cryptii layout.</p>
            </div>

            {/* 2 Column Layout ala Cryptii */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

                {/* KOLOM KIRI: INPUT & OUTPUT */}
                <div className="flex flex-col space-y-5">
                    {/* INPUT */}
                    <div className="flex flex-col bg-gray-950 border border-white/5 p-4 rounded-xl space-y-2 flex-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source Input</label>
                            <span className="text-[10px] font-mono text-gray-600">{input.length} chars</span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste or type text data here..."
                            className="w-full flex-1 min-h-[250px] p-3 bg-gray-900/50 border border-white/5 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500/50 resize-none"
                        />
                    </div>

                    {/* OUTPUT */}
                    <div className="flex flex-col bg-gray-950 border border-white/5 p-4 rounded-xl space-y-2 flex-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Result Output</label>
                            {output && !output.startsWith("[ERROR]") && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(output)}
                                    className="text-[10px] font-bold text-red-500 hover:underline bg-transparent border-none cursor-pointer"
                                >
                                    [Copy]
                                </button>
                            )}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            placeholder="Result data will render here dynamically..."
                            className={`w-full flex-1 min-h-[250px] p-3 bg-gray-900/50 border border-white/5 rounded-lg text-xs font-mono focus:outline-none resize-none ${output.startsWith("[ERROR]") ? "text-red-400" : "text-red-400"
                                }`}
                        />
                    </div>
                </div>

                {/* KOLOM KANAN: OPTION CONTROL METHOD */}
                <div className="flex flex-col bg-gray-950 border border-red-500/10 p-5 rounded-xl justify-between space-y-4">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                            Method & Parameters
                        </h3>

                        {/* Pilih Algoritma */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Select Converter</label>
                            <select
                                value={algo}
                                onChange={(e) => setAlgo(e.target.value as AlgoType)}
                                className="w-full p-2 bg-gray-900 border border-white/5 rounded-lg text-xs font-bold text-gray-300 focus:outline-none"
                            >
                                <option value="base64">Base64 Format</option>
                                <option value="hex">Hexadecimal Dump</option>
                                <option value="rsa-key">RSA Key Handler</option>
                                <option value="caesar">Caesar Cipher</option>
                            </select>
                        </div>

                        {/* Pilih Mode (Encode/Decode) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Direction</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setMode("encode")}
                                    className={`py-1 text-xs font-bold rounded-md transition-all ${mode === "encode" ? "bg-white/10 text-white" : "text-gray-500"}`}
                                >
                                    ENCODE
                                </button>
                                <button
                                    onClick={() => setMode("decode")}
                                    className={`py-1 text-xs font-bold rounded-md transition-all ${mode === "decode" ? "bg-white/10 text-white" : "text-gray-500"}`}
                                >
                                    DECODE
                                </button>
                            </div>
                        </div>

                        {/* OPSI SPESIFIK BERDASARKAN ALGORITMA YANG DIPILIH */}
                        <div className="pt-2 border-t border-white/5 space-y-3">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Specific Parameters</span>

                            {/* Opsi Khususs Base64 */}
                            {algo === "base64" && (
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400">Alphabet Variant</label>
                                    <select
                                        value={b64Variant}
                                        onChange={(e) => setB64Variant(e.target.value as "standard" | "url-safe")}
                                        className="w-full p-2 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none"
                                    >
                                        <option value="standard">Standard (RFC 4648)</option>
                                        <option value="url-safe">URL-Safe Signatures (- /)</option>
                                    </select>
                                </div>
                            )}

                            {/* Opsi Khusus Hex */}
                            {algo === "hex" && (
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400">Byte Delimiter</label>
                                    <select
                                        value={hexDelimiter}
                                        onChange={(e) => setHexDelimiter(e.target.value as "space" | "none" | "comma")}
                                        className="w-full p-2 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none"
                                    >
                                        <option value="space">Space Separated (0a 0d)</option>
                                        <option value="none">No Spacing (0a0d)</option>
                                        <option value="comma">Comma Separated (0a,0d)</option>
                                    </select>
                                </div>
                            )}

                            {/* Opsi Khusus RSA */}
                            {algo === "rsa-key" && (
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400">Key Execution Action</label>
                                    <select
                                        value={rsaAction}
                                        onChange={(e) => setRsaAction(e.target.value as "strip" | "wrap")}
                                        className="w-full p-2 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none"
                                    >
                                        <option value="strip">Strip Headers (Get Raw Content)</option>
                                        <option value="wrap">Wrap inside PEM Blocks</option>
                                    </select>
                                    <span className="text-[9px] text-gray-500 block leading-tight mt-1">
                                        *Strip cocok digunakan di mode DECODE, Wrap untuk mode ENCODE.
                                    </span>
                                </div>
                            )}

                            {/* Opsi Khusus Caesar Cipher */}
                            {algo === "caesar" && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] text-gray-400">Shift Value</label>
                                        <span className="text-xs text-red-400 font-mono font-bold">{caesarShift}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="25"
                                        value={caesarShift}
                                        onChange={(e) => setCaesarShift(parseInt(e.target.value))}
                                        className="w-full accent-red-500 bg-gray-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-[10px] text-center text-gray-600 border-t border-white/5 pt-2">
                        Reactive Pipeline Pipeline Active
                    </div>
                </div>

            </div>
        </div>
    );
}
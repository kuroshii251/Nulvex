"use client";

import React, { useState, useEffect, useCallback } from "react";

const LOOKALIKES = "il1Lo0O";
const AMBIGUOUS = "{}[]()/\\'\"`~,;:.<>";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*_+-=?";

interface CharsetOptions {
    lower: boolean;
    upper: boolean;
    digits: boolean;
    symbols: boolean;
    excludeLookalikes: boolean;
    excludeAmbiguous: boolean;
}

function buildCharset(options: CharsetOptions): string {
    const { lower, upper, digits, symbols, excludeLookalikes, excludeAmbiguous } = options;
    let set = "";
    if (lower) set += LOWER;
    if (upper) set += UPPER;
    if (digits) set += DIGITS;
    if (symbols) set += SYMBOLS;

    if (excludeLookalikes) {
        set = set.split("").filter((c) => !LOOKALIKES.includes(c)).join("");
    }
    if (excludeAmbiguous) {
        set = set.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
    }
    return set;
}

function secureRandomInt(max: number): number {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
}

function generatePassword(length: number, options: CharsetOptions): string {
    const charset = buildCharset(options);
    if (!charset.length) return "";

    // Ensure at least one char from each selected category when possible
    const categories: string[] = [];
    if (options.lower) categories.push(LOWER);
    if (options.upper) categories.push(UPPER);
    if (options.digits) categories.push(DIGITS);
    if (options.symbols) categories.push(SYMBOLS);

    const filtered: string[] = categories
        .map((cat: string) => {
            let c = cat;
            if (options.excludeLookalikes) c = c.split("").filter((ch) => !LOOKALIKES.includes(ch)).join("");
            if (options.excludeAmbiguous) c = c.split("").filter((ch) => !AMBIGUOUS.includes(ch)).join("");
            return c;
        })
        .filter((c: string) => c.length > 0);

    const chars: string[] = [];
    filtered.forEach((cat: string) => {
        chars.push(cat[secureRandomInt(cat.length)]);
    });

    while (chars.length < length) {
        chars.push(charset[secureRandomInt(charset.length)]);
    }

    // Fisher-Yates shuffle
    for (let i = chars.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.slice(0, length).join("");
}

function estimateEntropy(length: number, options: CharsetOptions): number {
    const charset = buildCharset(options);
    if (!charset.length || length === 0) return 0;
    return Math.round(length * Math.log2(charset.length));
}

interface Strength {
    label: string;
    color: string;
    bar: string;
}

function strengthLabel(bits: number): Strength {
    if (bits === 0) return { label: "N/A", color: "text-gray-500", bar: "0%" };
    if (bits < 40) return { label: "Weak", color: "text-red-400", bar: "20%" };
    if (bits < 60) return { label: "Fair", color: "text-red-400", bar: "45%" };
    if (bits < 80) return { label: "Good", color: "text-red-400", bar: "70%" };
    if (bits < 100) return { label: "Strong", color: "text-red-400", bar: "90%" };
    return { label: "Excellent", color: "text-red-400", bar: "100%" };
}

interface ToggleProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    sub?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, sub }) => (
    <button
        onClick={() => onChange(!checked)}
        className="w-full flex items-center justify-between p-2.5 bg-gray-900 border border-white/5 rounded-lg hover:border-red-500/30 transition-colors"
    >
        <div className="text-left">
            <div className="text-xs font-bold text-gray-300">{label}</div>
            {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
        </div>
        <div
            className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${checked ? "bg-red-600" : "bg-gray-700"
                }`}
        >
            <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"
                    }`}
            />
        </div>
    </button>
);

export default function PasswordGenerator() {
    const [length, setLength] = useState<number>(16);
    const [lower, setLower] = useState<boolean>(true);
    const [upper, setUpper] = useState<boolean>(true);
    const [digits, setDigits] = useState<boolean>(true);
    const [symbols, setSymbols] = useState<boolean>(true);
    const [excludeLookalikes, setExcludeLookalikes] = useState<boolean>(false);
    const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

    const [password, setPassword] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [copied, setCopied] = useState<boolean>(false);

    const options: CharsetOptions = { lower, upper, digits, symbols, excludeLookalikes, excludeAmbiguous };
    const charsetSize = buildCharset(options).length;
    const bits = estimateEntropy(length, options);
    const strength = strengthLabel(bits);

    const regenerate = useCallback(() => {
        const pwd = generatePassword(length, options);
        setPassword(pwd);
        setCopied(false);
        if (pwd) {
            setHistory((h) => [pwd, ...h].slice(0, 6));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [length, lower, upper, digits, symbols, excludeLookalikes, excludeAmbiguous]);

    useEffect(() => {
        regenerate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        regenerate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [length, lower, upper, digits, symbols, excludeLookalikes, excludeAmbiguous]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="space-y-6 max-w-7xl p-6 bg-gray-900 border border-white/5 rounded-2xl text-gray-200">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Password Generator</h2>
                <p className="text-xs text-gray-500 mt-1">
                    Bikin password acak yang kuat pakai Web Crypto API (crypto.getRandomValues), bukan Math.random.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

                {/* KOLOM KIRI: CONFIG */}
                <div className="bg-gray-950 border border-white/5 p-4 rounded-xl space-y-4">
                    <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                        Generator Configuration
                    </h3>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Length</label>
                            <span className="text-xs text-red-400 font-mono font-bold">{length} chars</span>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="64"
                            value={length}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLength(parseInt(e.target.value, 10))}
                            className="w-full accent-red-500 bg-gray-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="space-y-2">
                        <Toggle checked={lower} onChange={setLower} label="Lowercase" sub="a-z" />
                        <Toggle checked={upper} onChange={setUpper} label="Uppercase" sub="A-Z" />
                        <Toggle checked={digits} onChange={setDigits} label="Digits" sub="0-9" />
                        <Toggle checked={symbols} onChange={setSymbols} label="Symbols" sub="!@#$%^&*_+-=?" />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <Toggle
                            checked={excludeLookalikes}
                            onChange={setExcludeLookalikes}
                            label="Exclude lookalikes"
                            sub="i, l, 1, L, o, 0, O"
                        />
                        <Toggle
                            checked={excludeAmbiguous}
                            onChange={setExcludeAmbiguous}
                            label="Exclude ambiguous"
                            sub="{ } [ ] ( ) / \ etc"
                        />
                    </div>

                    <button
                        onClick={regenerate}
                        disabled={charsetSize === 0}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 disabled:text-gray-500 text-xs font-bold rounded-lg transition-all tracking-wider uppercase mt-2"
                    >
                        Generate New
                    </button>
                    {charsetSize === 0 && (
                        <p className="text-[10px] text-red-400 text-center">Pilih minimal satu jenis karakter.</p>
                    )}
                </div>

                {/* KOLOM KANAN: RESULT & HISTORY */}
                <div className="flex flex-col space-y-5">
                    {/* RESULT + STRENGTH */}
                    <div className="bg-gray-950 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                                Generated Password
                            </h3>

                            <div className="relative">
                                <div className="w-full p-4 bg-gray-900 border border-white/10 rounded-xl font-mono text-lg text-red-400 break-all text-center min-h-[70px] flex items-center justify-center">
                                    {password || "—"}
                                </div>
                                <button
                                    onClick={() => password && copyToClipboard(password)}
                                    className="absolute top-2 right-2 text-[10px] font-bold text-red-400 hover:underline bg-gray-950/70 px-2 py-1 rounded"
                                >
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Strength</span>
                                    <span className={`text-xs font-mono font-bold ${strength.color}`}>
                                        {strength.label} ({bits} bits)
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${bits < 40
                                                ? "bg-red-500"
                                                : bits < 60
                                                    ? "bg-yellow-500"
                                                    : bits < 80
                                                        ? "bg-red-500"
                                                        : "bg-red-500"
                                            }`}
                                        style={{ width: strength.bar }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="bg-gray-900 p-2 rounded-lg border border-white/5">
                                    <span className="text-gray-500 block">Charset size</span>
                                    <span className="text-gray-300 font-mono font-bold">{charsetSize}</span>
                                </div>
                                <div className="bg-gray-900 p-2 rounded-lg border border-white/5">
                                    <span className="text-gray-500 block">Combinations</span>
                                    <span className="text-gray-300 font-mono font-bold">~2^{bits}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] text-gray-500 leading-normal bg-gray-900 p-2.5 rounded-lg border border-white/5 mt-3">
                            <span className="text-red-500 font-bold">Tips:</span> Use a minimum length of 16 characters and enable all character types for best results. Do not reuse passwords across multiple accounts — store them in a password manager.
                        </div>
                    </div>

                    {/* HISTORY */}
                    <div className="flex flex-col bg-gray-950 border border-white/5 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent History</label>
                            <button
                                onClick={() => setHistory([])}
                                className="text-[10px] font-bold text-gray-500 hover:text-red-400 hover:underline bg-transparent border-none cursor-pointer"
                            >
                                [Clear]
                            </button>
                        </div>
                        <div className="flex-1 min-h-[350px] space-y-2 overflow-auto">
                            {history.length === 0 ? (
                                <div className="text-xs text-gray-600 italic text-center py-20 border border-dashed border-white/5 rounded-xl">
                                    Password yang di-generate akan muncul di sini.
                                </div>
                            ) : (
                                history.map((pwd: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => copyToClipboard(pwd)}
                                        className="w-full text-left p-2.5 bg-gray-900/40 border border-white/5 rounded-lg text-xs font-mono text-gray-400 hover:text-red-400 hover:border-red-500/30 break-all transition-colors"
                                    >
                                        {pwd}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
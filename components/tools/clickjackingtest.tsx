"use client";

import React, { useState } from "react";

export default function ClickjackingTester() {
    const [targetUrl, setTargetUrl] = useState("https://example.com");
    const [iframeWidth, setIframeWidth] = useState("500");
    const [iframeHeight, setIframeHeight] = useState("400");
    const [opacity, setOpacity] = useState("50"); // Buat simulasi transparansi serangan (UI Redressing)
    const [testTriggered, setTestTriggered] = useState(false);

    const generatePocHtml = () => {
        return (`<!DOCTYPE html>
<html>
<head>
    <title>Clickjacking PoC - White Hat Test</title>
    <style>
        iframe {
            width: ${iframeWidth}px;
            height: ${iframeHeight}px;
            position: absolute;
            top: 0;
            left: 0;
            opacity: ${parseInt(opacity) / 100};
            z-index: 2;
        }
        .decoy-button {
            position: absolute;
            top: 50px;
            left: 50px;
            padding: 10px 20px;
            background: red;
            color: white;
            z-index: 1;
        }
    </style>
</head>
<body>
    <button class="decoy-button">Klik di Sini untuk Hadiah!</button>
    <iframe src="${targetUrl}"></iframe>
</body>
</html>`);
    };

    return (
        <div className="space-y-6 max-w-7xl p-6 bg-gray-900 border border-white/5 rounded-2xl text-gray-200">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Clickjacking / UI Redressing Auditor</h2>
                <p className="text-xs text-gray-500 mt-1">
                    Uji apakah target endpoint mengizinkan rendering iframe (X-Frame-Options / CSP mitigation bypass test).
                </p>
            </div>

            {/* 3 Column Layout ala Cryptii */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

                {/* KOLOM KIRI: PARAMETER & TARGET CONFIG */}
                <div className="bg-gray-950 border border-white/5 p-4 rounded-xl space-y-4">
                    <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                        Target Configuration
                    </h3>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Target URL</label>
                        <input
                            type="text"
                            value={targetUrl}
                            onChange={(e) => {
                                setTargetUrl(e.target.value);
                                setTestTriggered(false);
                            }}
                            placeholder="https://vulnerable-target.com/login"
                            className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Frame Width (px)</label>
                            <input
                                type="number"
                                value={iframeWidth}
                                onChange={(e) => setIframeWidth(e.target.value)}
                                className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs font-mono text-gray-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Frame Height (px)</label>
                            <input
                                type="number"
                                value={iframeHeight}
                                onChange={(e) => setIframeHeight(e.target.value)}
                                className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs font-mono text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Simulate Opacity (PoC)</label>
                            <span className="text-xs text-red-400 font-mono font-bold">{opacity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={opacity}
                            onChange={(e) => setOpacity(e.target.value)}
                            className="w-full accent-red-500 bg-gray-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <button
                        onClick={() => setTestTriggered(true)}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-gray-950 text-xs font-bold rounded-lg transition-all tracking-wider uppercase mt-2"
                    >
                        Test Vulnerability
                    </button>
                </div>

                {/* KOLOM KANAN: LIVE IFRAME & CODE GENERATOR */}
                <div className="flex flex-col space-y-5">
                    {/* LIVE IFRAME SANDBOX VIEW */}
                    <div className="bg-gray-950 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2 mb-3">
                                Live Sandbox Area
                            </h3>

                            {!testTriggered ? (
                                <div className="text-xs text-gray-600 italic text-center py-20 border border-dashed border-white/5 rounded-xl">
                                    Input target URL dan klik "Test Vulnerability" untuk merender frame.
                                </div>
                            ) : (
                                <div className="relative border border-white/10 rounded-xl overflow-auto bg-white p-2 flex justify-center items-center h-[280px]">
                                    {/* Layer Umpan Balik Tombol Palsu di Belakang Iframe */}
                                    <div className="absolute text-center select-none pointer-events-none">
                                        <button className="px-4 py-2 bg-red-600 text-white rounded font-bold text-sm shadow-md animate-pulse">
                                            👉 CLICK ME (DECOY BUTTON) 👈
                                        </button>
                                        <p className="text-[10px] text-gray-400 mt-2">Tombol umpan berada di bawah frame</p>
                                    </div>

                                    {/* Iframe Target Utama */}
                                    <iframe
                                        src={targetUrl}
                                        title="Clickjacking Target Sandbox"
                                        width={iframeWidth}
                                        height={iframeHeight}
                                        style={{ opacity: parseInt(opacity) / 100 }}
                                        className="max-w-full max-h-full border border-gray-300 bg-transparent relative z-10"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="text-[10px] text-gray-500 leading-normal bg-gray-900 p-2.5 rounded-lg border border-white/5 mt-3">
                            <span className="text-red-500 font-bold">Result Analysis:</span> If the target web page appears over the red button (you can slide the opacity), the web is **Vulnerable**. If the frame remains blank or shows a Refused by X-Frame-Options error, the web is **Secure**.
                        </div>
                    </div>

                    {/* AUTOMATED EXPLOIT CODE GENERATOR */}
                    <div className="flex flex-col bg-gray-950 border border-white/5 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PoC Exploit Code (.html)</label>
                            <button
                                onClick={() => navigator.clipboard.writeText(generatePocHtml())}
                                className="text-[10px] font-bold text-red-400 hover:underline bg-transparent border-none cursor-pointer"
                            >
                                [Copy Code]
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={generatePocHtml()}
                            className="w-full flex-1 min-h-[350px] p-3 bg-gray-900/40 border border-white/5 rounded-lg text-xs font-mono text-red-400 focus:outline-none resize-none"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
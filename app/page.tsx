"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert, Terminal, Activity, Globe, Lock, Cpu, Smartphone,
  Cloud, ChevronRight, Zap, Radio, KeyRound, Fingerprint, Link2,
  ScanLine, Server
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer/main";
import axios from "axios";
import { getCache, setCache } from "@/lib/local-cache";

const FEATURED_CVES = [
  { id: "CVE-2026-46817", score: "9.8", severity: "CRITICAL", desc: "Unauthenticated RCE in Oracle Payments Module", time: "2h ago" },
  { id: "CVE-2026-48558", score: "9.8", severity: "CRITICAL", desc: "Auth bypass in SimpleHelp OIDC flow", time: "5h ago" },
  { id: "CVE-2026-45607", score: "8.4", severity: "HIGH", desc: "Hyper-V escape via out-of-bounds read", time: "1d ago" },
  { id: "CVE-2026-44291", score: "7.9", severity: "HIGH", desc: "Privilege escalation in Kubernetes admission controller", time: "1d ago" },
];

const SECURITY_NEWS = [
  { title: "Microsoft June 2026 Patch Tuesday fixes 80+ flaws", date: "June 29", tag: "Patch update", color: "#35d399" },
  { title: "New Cl0p ransomware variant targets ESXi hosts", date: "June 28", tag: "Threat actor", color: "#ff4463" },
  { title: "Critical zero-day found in Linux kernel networking stack", date: "June 27", tag: "Zero-day", color: "#ffb13d" },
];

const TICKER_ITEMS = [
  "CVE-2026-46817 — Oracle Payments Module RCE — 9.8 CRITICAL",
  "CVE-2026-48558 — SimpleHelp OIDC auth bypass — 9.8 CRITICAL",
  "Cl0p ransomware variant seen targeting ESXi hosts",
  "Linux kernel networking stack zero-day under active exploitation",
  "Microsoft Patch Tuesday ships fixes for 80+ flaws",
];


const C = {
  void: "#000",
  panel: "#0a1019",
  panel2: "#0d1826",
  border: "rgba(76,150,255,0.14)",
  borderStrong: "rgba(76,150,255,0.35)",
  blue: "#3aa9ff",
  cyan: "#00e5ff",
  danger: "#ff4463",
  warning: "#ffb13d",
  ok: "#35d399",
  text: "#e7edf5",
  muted: "#66768a",
  muted2: "#8494a8",
};

const SEV_COLORS: Record<string, string> = {
  CRITICAL: C.danger,
  HIGH: C.warning,
  MEDIUM: C.warning,
  LOW: C.ok,
};





const Hero = () => (
  <section className="relative overflow-hidden py-24 px-6">
    <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-white max-w-4xl">
        Track every threat <br /> Respond before it <span className="text-red-500">strikes</span>
        <br />
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: C.muted2 }}>
        Cydef gives researchers everything they need in one place: live CVE tracking, verified threat intelligence, security news, and a full toolkit of hashing, encoding, and lookup utilities </p>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <a
          href="/login"
          className="px-7 py-3.5 rounded-lg text-sm font-bold bg-red-600 transition-all hover:-translate-y-0.5">

          Get Started
        </a>

        <a
          href="#feed"
          className="px-7 py-3.5 rounded-lg border text-sm font-semibold"
          style={{ borderColor: C.borderStrong, color: C.text }}
        >
          View More
        </a>
      </div>

    </div>
  </section >
);







type Cve = {
  id: string;
  description: string;
  published: string;
  severity: string;
  score: number | null;
};

interface NewsSource {
  id?: string | number;
  name: string;
  url?: string;
  country?: string;
}

interface NewsItem {
  id: string | number;
  title: string;
  image?: string;
  url?: string;
  publishedAt: string;
  source?: NewsSource;
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function formatNewsDate(dateStr: string) {
  try {
    return new Date(dateStr)
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  } catch {
    return dateStr;
  }
}



const FeedSection = () => (
  <section id="feed" className="max-w-7xl mx-auto px-7 pb-20 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-11">
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert size={20} color={C.danger} /> Featured CVEs
        </h2>
        <a href="#" className="text-xs font-semibold flex items-center gap-1" style={{ color: C.muted2 }}>
          View all <ChevronRight size={13} />
        </a>
      </div>
      <div className="space-y-2.5">
        {FEATURED_CVES.map((cve, i) => {
          const sevColor = SEV_COLORS[cve.severity] ?? C.muted2;
          return (
            <div
              key={i}
              className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 rounded-lg border transition-transform hover:translate-x-1"
              style={{ background: C.panel, borderColor: C.border, borderLeft: `3px solid ${sevColor}` }}
            >
              <span className="text-[10.5px] font-bold whitespace-nowrap" style={{ color: sevColor, fontFamily: "monospace" }}>
                {cve.severity} · {cve.score}
              </span>
              <div>
                <span className="block text-[11.5px] mb-1" style={{ color: C.muted2, fontFamily: "monospace" }}>{cve.id}</span>
                <span className="text-[14.5px] font-medium text-white">{cve.desc}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold" style={{ color: sevColor, fontFamily: "monospace" }}>{cve.score}</span>
                <span className="text-[10.5px]" style={{ color: C.muted }}>{cve.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity size={20} color={C.ok} /> Security news
        </h2>
      </div>
      <div className="space-y-2.5">
        {SECURITY_NEWS.map((news, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border cursor-pointer transition-transform hover:translate-x-1"
            style={{ background: C.panel, borderColor: C.border, borderLeft: `3px solid ${news.color}` }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: news.color }}>{news.tag}</span>
            <h4 className="text-sm font-semibold text-white mt-1.5 mb-2 leading-snug">{news.title}</h4>
            <span className="text-[10.5px]" style={{ color: C.muted, fontFamily: "monospace" }}>{news.date}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ToolsSection = () => {
  const tools = [
    { name: "Hash generator", note: "MD5 · SHA-1 · SHA-256", icon: Terminal },
    { name: "Base64 encoder", note: "Encode / decode", icon: KeyRound },
    { name: "AES encryptor", note: "256-bit CBC / GCM", icon: Lock },
    { name: "Password generator", note: "Configurable entropy", icon: Fingerprint },
    { name: "JWT decoder", note: "Header · payload · sig", icon: ScanLine },
    { name: "URL encoder", note: "Percent-encoding", icon: Link2 },
    { name: "DNS lookup", note: "A · AAAA · MX · TXT", icon: Globe },
    { name: "WHOIS lookup", note: "Registrar · dates · NS", icon: Server },
  ];
  return (
    <section id="tools" className="max-w-7xl mx-auto px-7 pb-20">
      <div className="mb-7">
        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight text-center">Collection of <span className="text-red-600">Tools</span></h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {tools.map((tool, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-zinc-800 transition-all hover:-translate-y-1"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 border"
              style={{ background: C.panel2, borderColor: C.border }}
            >
              <tool.icon size={16} color="red" />
            </div>
            <h3 className="text-[13.5px] font-semibold text-white mb-1">{tool.name}</h3>
            <p className="text-[11px]" style={{ color: C.muted, fontFamily: "monospace" }}>{tool.note}</p>
          </div>
        ))}

      </div>
      <div className="flex mt-7  items-center justify-center bg-gray-900 hover:bg-gray-800 transition-colors p-2 px-6 rounded-xl mx-auto w-fit">
        <a href="/tools" className="text-white text-center mx-auto font-semibold">View More</a>
      </div>
    </section>
  );
};

const WhyCydef = () => {
  const items = [
    { title: "Real-time CVE feed", desc: "Critical and high-severity CVEs like unauthenticated RCEs and auth bypasses. Surface as soon as they're disclosed." },
    { title: "Curated security news", desc: "Patch Tuesday roundups, zero-day alerts, and threat actor activity, tracked in one feed instead of ten different sources." },
    { title: "Free security tools", desc: "Hashing, encoding, and lookup utilities, ready to use without an account." },
    { title: "In-depth write-ups", desc: "Deep dives and analysis on active exploits and campaigns, not just headline-level news." },
    { title: "Built for every workflow", desc: "From a solo researcher checking CVEs in the morning to a team monitoring dozens of vendors at once." },
    { title: "Signal, not noise", desc: "Every feature exists to cut through alert fatigue — only what security teams actually need to act on." },
  ];

  return (
    <section className="py-16 px-7 border-t border-b" style={{ borderColor: C.border }}>
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-14">
        <h2 className="text-3xl md:text-5xl text-center font-bold text-white leading-tight tracking-tight">
          Built for the pace<br />of{" "}
          <span className="text-red-600">modern threats.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-5 rounded-xl border transition-colors hover:border-red-600/50"
              style={{ borderColor: C.border, backgroundColor: "bg-gray-950)" }}
            >
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-[12.5px] leading-relaxed" style={{ color: C.muted2 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function Banner() {
  return (
    <section className="  p-5 ">
      <div className="">
        <h1 className="text-black text-center p-2 text-3xl font-bold">DONT GIVE UP</h1>
      </div>
    </section>
  )
}


export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: C.void, color: C.text }}>
      <Header />
      <Hero />
      <FeedSection />
      <ToolsSection />
      <WhyCydef />
      <Banner />
      <Footer />
    </div>
  );
}
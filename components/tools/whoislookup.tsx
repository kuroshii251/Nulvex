"use client";

import React, { useState, useCallback } from "react";

interface WhoisData {
    domain?: string;
    registrar?: string;
    registrant?: string;
    created?: string;
    updated?: string;
    expires?: string;
    status?: string;
    dnssec?: string;
    nameServers: string[];
    raw: unknown;
    [key: string]: unknown;
}

interface RdapEvent {
    eventAction: string;
    eventDate: string;
}

interface RdapVCardEntry extends Array<unknown> {
    0: string;
    3: string;
}

interface RdapEntity {
    roles?: string[];
    vcardArray?: [string, unknown[]];
    publicIds?: { identifier: string }[];
    handle?: string;
}

interface RdapNameserver {
    ldhName?: string;
}

interface RdapResponse {
    ldhName?: string;
    status?: string[];
    events?: RdapEvent[];
    entities?: RdapEntity[];
    nameservers?: RdapNameserver[];
    secureDNS?: { delegationSigned?: boolean };
}

interface BootstrapService {
    services: [string[], string[]][];
}

const FIELDS: { key: string; label: string }[] = [
    { key: "domain", label: "Domain" },
    { key: "registrar", label: "Registrar" },
    { key: "registrant", label: "Registrant" },
    { key: "created", label: "Created" },
    { key: "updated", label: "Updated" },
    { key: "expires", label: "Expires" },
    { key: "status", label: "Status" },
    { key: "dnssec", label: "DNSSEC" },
];

const isValidDomain = (val: string): boolean =>
    /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.[a-zA-Z0-9-]{1,63})+$/.test(val.trim());

let bootstrapCache: BootstrapService | null = null;

async function getRdapServer(domain: string): Promise<string> {
    const tld = domain.split(".").pop()!.toLowerCase();

    if (!bootstrapCache) {
        const res = await fetch("https://data.iana.org/rdap/dns.json");
        if (!res.ok) throw new Error("Failed to fetch RDAP server list from IANA.");
        bootstrapCache = (await res.json()) as BootstrapService;
    }

    const entry = bootstrapCache.services.find(([tlds]: [string[], string[]]) => tlds.includes(tld));
    if (!entry) {
        throw new Error(`TLD ".${tld}" does not have a public RDAP server registered with IANA.`);
    }

    let server = entry[1][0];
    if (!server.endsWith("/")) server += "/";
    return server;
}

function extractVCardValue(vcardArray: [string, unknown[]] | undefined, field: string): string | null {
    if (!vcardArray || !Array.isArray(vcardArray[1])) return null;
    const entry = (vcardArray[1] as RdapVCardEntry[]).find((item) => item[0] === field);
    return entry ? entry[3] : null;
}

function findEntity(entities: RdapEntity[] | undefined, role: string): RdapEntity | null {
    if (!Array.isArray(entities)) return null;
    return entities.find((e) => e.roles?.includes(role)) ?? null;
}

function normalize(json: RdapResponse, domainInput: string): WhoisData {
    const events = json.events || [];
    const getEvent = (action: string): string | undefined =>
        events.find((e) => e.eventAction === action)?.eventDate;

    const registrarEntity = findEntity(json.entities, "registrar");
    const registrantEntity = findEntity(json.entities, "registrant");

    const registrarName =
        extractVCardValue(registrarEntity?.vcardArray, "fn") ||
        registrarEntity?.publicIds?.[0]?.identifier ||
        registrarEntity?.handle;

    const registrantName =
        extractVCardValue(registrantEntity?.vcardArray, "fn") ||
        extractVCardValue(registrantEntity?.vcardArray, "org");

    return {
        domain: json.ldhName || domainInput,
        registrar: registrarName || "Tidak tersedia",
        registrant: registrantName || "Redacted / Private",
        created: getEvent("registration"),
        updated: getEvent("last changed"),
        expires: getEvent("expiration"),
        status: Array.isArray(json.status) ? json.status.join(", ") : json.status,
        dnssec: json.secureDNS?.delegationSigned ? "Signed" : "Unsigned",
        nameServers: (json.nameservers || []).map((ns) => ns.ldhName).filter((v): v is string => Boolean(v)),
        raw: json,
    };
}

export default function WhoisLookup() {
    const [query, setQuery] = useState<string>("");
    const [data, setData] = useState<WhoisData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);

    const lookup = useCallback(
        async (target?: string) => {
            const q = (target ?? query).trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

            if (!q) {
                setError("Please enter a domain name first, e.g., example.com");
                return;
            }
            if (!isValidDomain(q)) {
                setError("Format domain tidak valid. Contoh yang benar: example.com");
                return;
            }

            setLoading(true);
            setError("");

            try {
                const server = await getRdapServer(q);
                const res = await fetch(`${server}domain/${q}`, {
                    headers: { Accept: "application/rdap+json" },
                });
                if (!res.ok) {
                    throw new Error(
                        res.status === 404
                            ? "Domain not found / not registered."
                            : `Registry mengembalikan error (${res.status})`
                    );
                }
                const json = (await res.json()) as RdapResponse;
                const normalized = normalize(json, q);
                setData(normalized);
                setHistory((h) => [q, ...h.filter((x) => x !== q)].slice(0, 6));
            } catch (e) {
                const err = e as Error;
                setError(
                    err.message === "Failed to fetch"
                        ? "Gagal terhubung ke server RDAP registry (mungkin TLD ini belum support akses browser langsung)."
                        : err.message || "Gagal mengambil data WHOIS. Coba lagi."
                );
                setData(null);
            } finally {
                setLoading(false);
            }
        },
        [query]
    );

    return (
        <div className="space-y-6 max-w-7xl p-6 bg-gray-900 border border-white/5 rounded-2xl text-gray-200">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">WHOIS Lookup</h2>
                <p className="text-xs text-gray-500 mt-1">
                    Search for domain registration info — registrar, expiration date, status, and nameservers.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

                {/* KOLOM KIRI: QUERY CONFIG */}
                <div className="bg-gray-950 border border-white/5 p-4 rounded-xl space-y-4">
                    <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                        Lookup Configuration
                    </h3>

                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Domain Name</label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && lookup()}
                            placeholder="example.com"
                            className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500/50"
                        />
                    </div>

                    <button
                        onClick={() => lookup()}
                        disabled={loading}
                        className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-gray-950 disabled:text-gray-500 text-xs font-bold rounded-lg transition-all tracking-wider uppercase mt-2"
                    >
                        {loading ? "Looking up..." : "Lookup Domain"}
                    </button>

                    {error && (
                        <div className="text-[10px] text-red-400 bg-red-950/30 border border-red-500/20 p-2.5 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Recent Lookups</label>
                        {history.length === 0 ? (
                            <p className="text-[10px] text-gray-600 italic">Belum ada history.</p>
                        ) : (
                            history.map((d: string) => (
                                <button
                                    key={d}
                                    onClick={() => {
                                        setQuery(d);
                                        lookup(d);
                                    }}
                                    className="w-full text-left p-2 bg-gray-900 border border-white/5 rounded-lg text-[10px] font-mono text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                                >
                                    {d}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN: SUMMARY & DETAILED FIELDS */}
                <div className="flex flex-col space-y-5">
                    {/* SUMMARY */}
                    <div className="bg-gray-950 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                                Registration Summary
                            </h3>

                            {loading ? (
                                <div className="text-xs text-gray-600 italic text-center py-24 border border-dashed border-white/5 rounded-xl">
                                    Mengambil data WHOIS...
                                </div>
                            ) : !data ? (
                                <div className="text-xs text-gray-600 italic text-center py-24 border border-dashed border-white/5 rounded-xl">
                                    Enter a domain and click "Lookup Domain".
                                </div>
                            ) : (
                                <>
                                    <div className="text-center py-3 border-b border-white/5">
                                        <div className="text-lg font-bold text-white font-mono">{data.domain}</div>
                                        <div className="text-xs text-gray-400 mt-1">{data.registrar || "Registrar tidak tersedia"}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                        <div className="bg-gray-900 p-2.5 rounded-lg border border-white/5">
                                            <span className="text-gray-500 block mb-0.5">Created</span>
                                            <span className="text-gray-300 font-mono">{data.created?.slice(0, 10) || "—"}</span>
                                        </div>
                                        <div className="bg-gray-900 p-2.5 rounded-lg border border-white/5">
                                            <span className="text-gray-500 block mb-0.5">Expires</span>
                                            <span className="text-gray-300 font-mono">{data.expires?.slice(0, 10) || "—"}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase">Name Servers</label>
                                        {data.nameServers?.length ? (
                                            <div className="space-y-1">
                                                {data.nameServers.map((ns: string, i: number) => (
                                                    <div key={i} className="text-[10px] font-mono text-red-400 bg-gray-900/40 p-1.5 rounded">
                                                        {ns}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-gray-600 italic">Tidak ada data.</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="text-[10px] text-gray-500 leading-normal bg-gray-900 p-2.5 rounded-lg border border-white/5 mt-3">
                            <span className="text-red-500 font-bold">Catatan:</span> Sebagian data registrant sengaja disamarkan (redacted) oleh registrar demi privasi (GDPR), ini normal.
                        </div>
                    </div>

                    {/* DETAILED FIELDS */}
                    <div className="flex flex-col bg-gray-950 border border-white/5 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Raw Details</label>
                            <button
                                onClick={() => data && navigator.clipboard.writeText(JSON.stringify(data.raw, null, 2))}
                                disabled={!data}
                                className="text-[10px] font-bold text-red-400 hover:underline bg-transparent border-none cursor-pointer disabled:text-gray-600 disabled:no-underline"
                            >
                                [Copy JSON]
                            </button>
                        </div>
                        <div className="flex-1 min-h-[350px] space-y-1.5 overflow-auto">
                            {!data ? (
                                <div className="text-xs text-gray-600 italic text-center py-20 border border-dashed border-white/5 rounded-xl">
                                    Detail field akan muncul di sini setelah lookup.
                                </div>
                            ) : (
                                FIELDS.map(({ key, label }) => (
                                    <div
                                        key={key}
                                        className="flex justify-between items-center gap-2 p-2 bg-gray-900/40 border border-white/5 rounded-lg"
                                    >
                                        <span className="text-[10px] text-gray-500 font-bold uppercase flex-shrink-0">{label}</span>
                                        <span className="text-xs font-mono text-red-400 text-right break-all">
                                            {data[key] !== undefined && data[key] !== null && data[key] !== ""
                                                ? String(data[key])
                                                : "—"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
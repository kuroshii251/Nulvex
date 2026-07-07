"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { X, ExternalLink, ShieldAlert, Tag, ChevronLeft, ChevronRight, Search } from "lucide-react";
import AdModal from "@/components/ads/AdModal";

type Affected = {
    vendor: string;
    product: string;
    versions: string[];
};

type CpeMatch = {
    criteria: string;
    vulnerable: boolean;
    versionStartIncluding: string | null;
    versionEndIncluding: string | null;
    versionStartExcluding: string | null;
    versionEndExcluding: string | null;
};

type Reference = {
    url: string;
    source: string;
};

type Cve = {
    id: string;
    url: string;
    description: string;
    published: string;
    lastModified: string;
    vulnStatus: string;
    sourceIdentifier: string | null;
    severity: string;
    score: number | null;
    vectorString: string | null;
    exploitabilityScore: number | null;
    impactScore: number | null;
    cveTags?: string[];
    affected?: Affected[];
    cpeMatches?: CpeMatch[];
    weaknesses?: string[];
    references?: Reference[];
};

const PAGE_SIZE = 50;

const severityColor: Record<string, string> = {
    CRITICAL: "#ff4463",
    HIGH: "#ff8a3d",
    MEDIUM: "#ffd93d",
    LOW: "#4cd97b",
    UNKNOWN: "#66768a",
};

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h3
            className="text-[11px] font-bold uppercase tracking-wider mb-2 pb-1.5 border-b"
            style={{ color: "#8494a8", borderColor: "rgba(76,150,255,0.1)" }}
        >
            {children}
        </h3>
    );
}

export default function Cvess() {
    const [cves, setCves] = useState<Cve[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Cve | null>(null);
    const [adTarget, setAdTarget] = useState<Cve | null>(null);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageInput, setPageInput] = useState("1");

    const [keywordInput, setKeywordInput] = useState("");
    const [keyword, setKeyword] = useState("");

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            setError(null);
            try {
                const startIndex = (page - 1) * PAGE_SIZE;
                const res = await axios.get("/api/cves", {
                    params: {
                        limit: PAGE_SIZE,
                        startIndex,
                        ...(keyword ? { keyword } : {}),
                    },
                });
                setCves(res.data.items ?? []);
                setTotal(res.data.total ?? 0);
            } catch (err) {
                console.error("Error fetching data", err);
                setError("Failed to load CVE data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [page, keyword]);

    useEffect(() => {
        setPageInput(String(page));
    }, [page]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelected(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const goToPage = (n: number) => {
        const clamped = Math.min(Math.max(1, n), totalPages);
        setPage(clamped);
    };

    const handlePageInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const n = parseInt(pageInput, 10);
        if (!isNaN(n)) goToPage(n);
        else setPageInput(String(page));
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setKeyword(keywordInput.trim());
    };

    const clearSearch = () => {
        setKeywordInput("");
        setKeyword("");
        setPage(1);
    };

    const sevColor = (s: string) => severityColor[s] ?? "#66768a";

    return (
        <>
            <form onSubmit={handleSearchSubmit} className="mb-5">
                <div
                    className="flex items-center gap-2 rounded-xl border px-3 py-2"
                    style={{ background: "#0a1019", borderColor: "rgba(76,150,255,0.14)" }}
                >
                    <Search size={15} style={{ color: "#66768a" }} />
                    <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Search CVEs by keyword (e.g. apache, sql injection)..."
                        className="flex-1 bg-transparent text-sm outline-none"
                        style={{ color: "#e7edf5" }}
                    />
                    {keywordInput && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="p-0.5 rounded transition-colors hover:bg-white/5"
                            style={{ color: "#66768a" }}
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                        style={{ background: "rgba(0,229,255,0.1)", color: "white" }}
                    >
                        Search
                    </button>
                </div>
                {keyword && (
                    <p className="text-[11px] mt-2" style={{ color: "#66768a" }}>
                        Showing results for "<span style={{ color: "#8494a8" }}>{keyword}</span>"
                    </p>
                )}
            </form>

            {loading ? (
                <div className="py-10 text-center text-sm" style={{ color: "#66768a" }}>
                    Loading latest CVEs...
                </div>
            ) : error ? (
                <div className="py-10 text-center text-sm" style={{ color: "#ff4463" }}>
                    {error}
                </div>
            ) : cves.length === 0 ? (
                <div className="py-10 text-center text-sm" style={{ color: "#66768a" }}>
                    No CVEs found{keyword ? ` for "${keyword}"` : ""}.
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {cves.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setAdTarget(item)}
                                className="text-left block rounded-xl border p-4 transition-colors hover:border-white cursor-pointer"
                                style={{ background: "#0a1019", borderColor: "rgba(76,150,255,0.14)" }}
                            >
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <h2 className="text-sm font-bold" style={{ color: "#e7edf5" }}>
                                        {item.id}
                                    </h2>
                                    <span
                                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                                        style={{ background: `${sevColor(item.severity)}22`, color: sevColor(item.severity) }}
                                    >
                                        {item.severity}
                                        {item.score !== null ? ` · ${item.score}` : ""}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#8494a8" }}>
                                    {item.description}
                                </p>
                                <div className="mt-2 text-[11px]" style={{ color: "#66768a" }}>
                                    Published: {fmtDate(item.published)}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* ── Pagination ── */}
                    <div
                        className="flex items-center justify-between gap-3 mt-6 pt-4 border-t flex-wrap"
                        style={{ borderColor: "rgba(76,150,255,0.1)" }}
                    >
                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page <= 1}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: "rgba(0,229,255,0.08)", color: "#00e5ff" }}
                        >
                            <ChevronLeft size={14} />
                            Previous
                        </button>

                        <div className="flex items-center gap-2 text-xs" style={{ color: "#8494a8" }}>
                            <span>Page</span>
                            <form onSubmit={handlePageInputSubmit}>
                                <input
                                    type="number"
                                    min={1}
                                    max={totalPages}
                                    value={pageInput}
                                    onChange={(e) => setPageInput(e.target.value)}
                                    onBlur={handlePageInputSubmit}
                                    className="w-14 text-center rounded-md px-1.5 py-1 text-xs outline-none"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(76,150,255,0.14)",
                                        color: "#e7edf5",
                                    }}
                                />
                            </form>
                            <span>of {totalPages}</span>
                        </div>

                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= totalPages}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: "rgba(0,229,255,0.08)", color: "white" }}
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </>
            )}

            {/* ── Ad interstitial (muncul sebelum detail CVE) ── */}
            {adTarget && (
                <AdModal
                    onDone={() => {
                        setSelected(adTarget);
                        setAdTarget(null);
                    }}
                />
            )}

            {/* ── Modal ── */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)" }}
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="w-full max-w-2xl rounded-2xl border relative flex flex-col"
                        style={{
                            background: "linear-gradient(180deg, #0a1019 0%, #070c14 100%)",
                            borderColor: "rgba(76,150,255,0.2)",
                            maxHeight: "88vh",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Sticky header */}
                        <div
                            className="flex items-start justify-between gap-4 p-6 pb-4 border-b sticky top-0"
                            style={{ borderColor: "rgba(76,150,255,0.12)", background: "#0a1019" }}
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <ShieldAlert size={16} style={{ color: sevColor(selected.severity) }} />
                                    <h2 className="text-lg font-bold" style={{ color: "#e7edf5" }}>
                                        {selected.id}
                                    </h2>
                                    <span
                                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                                        style={{ background: `${sevColor(selected.severity)}22`, color: sevColor(selected.severity) }}
                                    >
                                        {selected.severity}
                                        {selected.score !== null ? ` · CVSS ${selected.score}` : ""}
                                    </span>
                                </div>
                                <div className="text-[11px] flex flex-wrap gap-x-3" style={{ color: "#66768a" }}>
                                    <span>Status: {selected.vulnStatus}</span>
                                    {selected.sourceIdentifier && <span>Source: {selected.sourceIdentifier}</span>}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="p-1.5 rounded-lg transition-colors hover:bg-white/5 shrink-0"
                                style={{ color: "#66768a" }}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="p-6 pt-4 overflow-y-auto flex flex-col gap-5">
                            {(selected.cveTags ?? []).length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {(selected.cveTags ?? []).map((t, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                                            style={{ background: "rgba(0,229,255,0.08)", color: "#00e5ff" }}
                                        >
                                            <Tag size={9} />
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-sm leading-relaxed" style={{ color: "#c8d4e3" }}>
                                {selected.description}
                            </p>

                            {/* Dates */}
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: "#66768a" }}>
                                <span>Published: {fmtDate(selected.published)}</span>
                                <span>Last Modified: {fmtDate(selected.lastModified)}</span>
                            </div>

                            {(selected.vectorString || selected.exploitabilityScore !== null) && (
                                <div>
                                    <SectionTitle>CVSS Details</SectionTitle>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div
                                            className="rounded-lg px-3 py-2"
                                            style={{ background: "rgba(255,255,255,0.03)" }}
                                        >
                                            <div className="text-[10px] uppercase" style={{ color: "#66768a" }}>
                                                Exploitability
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: "#e7edf5" }}>
                                                {selected.exploitabilityScore ?? "—"}
                                            </div>
                                        </div>
                                        <div
                                            className="rounded-lg px-3 py-2"
                                            style={{ background: "rgba(255,255,255,0.03)" }}
                                        >
                                            <div className="text-[10px] uppercase" style={{ color: "#66768a" }}>
                                                Impact
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: "#e7edf5" }}>
                                                {selected.impactScore ?? "—"}
                                            </div>
                                        </div>
                                    </div>
                                    {selected.vectorString && (
                                        <code
                                            className="block text-xs px-3 py-2 rounded-lg break-all"
                                            style={{ background: "rgba(0,0,0,0.35)", color: "#00e5ff" }}
                                        >
                                            {selected.vectorString}
                                        </code>
                                    )}
                                </div>
                            )}

                            {/* Weaknesses / CWE */}
                            {(selected.weaknesses ?? []).length > 0 && (
                                <div>
                                    <SectionTitle>Weakness (CWE)</SectionTitle>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(selected.weaknesses ?? []).map((w, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-md text-[11px]"
                                                style={{ background: "rgba(0,229,255,0.08)", color: "#00e5ff" }}
                                            >
                                                {w}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Affected Products (legacy field) */}
                            {(selected.affected ?? []).filter((a) => a.vendor !== "n/a").length > 0 && (
                                <div>
                                    <SectionTitle>Affected Products</SectionTitle>
                                    <div className="flex flex-col gap-1.5">
                                        {(selected.affected ?? [])
                                            .filter((a) => a.vendor !== "n/a")
                                            .map((a, i) => (
                                                <div
                                                    key={i}
                                                    className="text-xs px-3 py-2 rounded-lg"
                                                    style={{ background: "rgba(255,255,255,0.03)", color: "#c8d4e3" }}
                                                >
                                                    <span style={{ color: "#e7edf5", fontWeight: 600 }}>
                                                        {a.vendor} / {a.product}
                                                    </span>
                                                    {a.versions?.length > 0 && a.versions[0] !== "n/a" && (
                                                        <span style={{ color: "#66768a" }}> — versions: {a.versions.join(", ")}</span>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* CPE Configurations */}
                            {(selected.cpeMatches ?? []).length > 0 && (
                                <div>
                                    <SectionTitle>
                                        Affected Configurations ({(selected.cpeMatches ?? []).length})
                                    </SectionTitle>
                                    <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                                        {(selected.cpeMatches ?? []).map((m, i) => (
                                            <div
                                                key={i}
                                                className="text-[11px] px-3 py-2 rounded-lg font-mono break-all"
                                                style={{
                                                    background: "rgba(255,255,255,0.03)",
                                                    color: m.vulnerable ? "#c8d4e3" : "#66768a",
                                                }}
                                            >
                                                {m.criteria}
                                                {(m.versionStartIncluding ||
                                                    m.versionEndIncluding ||
                                                    m.versionStartExcluding ||
                                                    m.versionEndExcluding) && (
                                                        <div className="text-[10px] mt-0.5" style={{ color: "#66768a" }}>
                                                            {m.versionStartIncluding && `≥ ${m.versionStartIncluding} `}
                                                            {m.versionStartExcluding && `> ${m.versionStartExcluding} `}
                                                            {m.versionEndIncluding && `≤ ${m.versionEndIncluding}`}
                                                            {m.versionEndExcluding && `< ${m.versionEndExcluding}`}
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* References */}
                            {(selected.references ?? []).length > 0 && (
                                <div>
                                    <SectionTitle>References ({(selected.references ?? []).length})</SectionTitle>
                                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                                        {(selected.references ?? []).map((r, i) => (
                                            <a key={i}
                                                href={r.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs truncate transition-colors hover:text-white"
                                                style={{ color: "#3aa9ff" }}
                                            >
                                                {r.url}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky footer */}
                        <div
                            className="p-4 border-t sticky bottom-0"
                            style={{ borderColor: "rgba(76,150,255,0.12)", background: "#0a1019" }}
                        >
                            <a href={selected.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                                style={{ color: "#00e5ff" }}>
                                View full record on NVD
                                <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
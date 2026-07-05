
import { ShieldAlert, ChevronRight, Activity } from "lucide-react";
import { fetchCves } from "@/lib/cve-service";
import { fetchNews } from "@/lib/news-service";

const C = {
    panel: "#0a1019",
    border: "rgba(76,150,255,0.14)",
    muted: "#66768a",
    muted2: "#8494a8",
    danger: "#ff4463",
    ok: "#35d399",
};

const SEV_COLORS: Record<string, string> = {
    CRITICAL: "#ff4463",
    HIGH: "#ff8a3d",
    MEDIUM: "#ffd93d",
    LOW: "#4cd97b",
    UNKNOWN: "#66768a",
};

const NEWS_COLORS = ["#00e5ff", "#35d399", "#ffb13d", "#3aa9ff"];

type Cve = {
    id: string;
    description: string;
    published: string;
    severity: string;
    score: number | null;
};

interface NewsItem {
    id: string | number;
    title: string;
    url?: string;
    publishedAt: string;
    source?: { name: string };
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
            .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
            .toUpperCase();
    } catch {
        return dateStr;
    }
}

// ── Helper fetch, taruh di sini, sebelum component ──
async function getFeaturedCves(): Promise<{ items: Cve[]; error: string | null }> {
    try {
        const data = await fetchCves({ resultsPerPage: "4", startIndex: "0", light: true });
        return { items: data.items ?? [], error: null };
    } catch {
        return { items: [], error: "Failed to load CVEs." };
    }
}

async function getFeaturedNews(): Promise<{ items: NewsItem[]; error: string | null }> {
    try {
        const items = await fetchNews({ max: "4" });
        return { items, error: null };
    } catch {
        return { items: [], error: "SIGNAL LOST — couldn't reach the feed." };
    }
}

// ── Component utama, dipanggil di page.tsx ──
export default async function FeedSection() {
    const [{ items: cves, error: cvesError }, { items: news, error: newsError }] =
        await Promise.all([getFeaturedCves(), getFeaturedNews()]);

    return (
        <section
            id="feed"
            className="max-w-7xl mx-auto px-7 pb-20 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-11"
        >
            {/* ── Featured CVEs ── */}
            <div>
                <div className="flex items-baseline justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldAlert size={20} color={C.danger} /> Featured CVEs
                    </h2>
                    <a href="/cves" className="text-xs font-semibold flex items-center gap-1" style={{ color: C.muted2 }}>
                        View all <ChevronRight size={13} />
                    </a>
                </div>

                {cvesError ? (
                    <div className="py-6 text-center text-sm" style={{ color: C.danger }}>
                        {cvesError}
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {cves.map((item) => {
                            const sevColor = SEV_COLORS[item.severity] ?? C.muted2;
                            return (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 rounded-lg border transition-transform hover:translate-x-1"
                                    style={{ background: C.panel, borderColor: C.border, borderLeft: `3px solid ${sevColor}` }}
                                >
                                    <span className="text-[10.5px] font-bold whitespace-nowrap" style={{ color: sevColor, fontFamily: "monospace" }}>
                                        {item.severity}{item.score !== null ? ` · ${item.score}` : ""}
                                    </span>
                                    <div>
                                        <span className="block text-[11.5px] mb-1" style={{ color: C.muted2, fontFamily: "monospace" }}>
                                            {item.id}
                                        </span>
                                        <span className="text-[14.5px] font-medium text-white line-clamp-1">
                                            {item.description}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs font-bold" style={{ color: sevColor, fontFamily: "monospace" }}>
                                            {item.score ?? "—"}
                                        </span>
                                        <span className="text-[10.5px]" style={{ color: C.muted }}>
                                            {timeAgo(item.published)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Security News ── */}
            <div>
                <div className="flex items-baseline justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity size={20} color={C.ok} /> Security news
                    </h2>
                </div>

                {newsError ? (
                    <div className="py-6 text-center text-sm" style={{ color: C.danger }}>
                        {newsError}
                    </div>
                ) : news.length === 0 ? (
                    <div className="py-6 text-center text-sm" style={{ color: C.muted }}>
                        No news found.
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {news.map((item, i) => {
                            const color = NEWS_COLORS[i % NEWS_COLORS.length];
                            return (
                                
                                    <a key={item.id}
                                    href={item.url ?? "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-lg border cursor-pointer transition-transform hover:translate-x-1"
                                    style={{ background: C.panel, borderColor: C.border, borderLeft: `3px solid ${color}` }}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
                                        {item.source?.name ?? "UNKNOWN SOURCE"}
                                    </span>
                                    <h4 className="text-sm font-semibold text-white mt-1.5 mb-2 leading-snug line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <span className="text-[10.5px]" style={{ color: C.muted, fontFamily: "monospace" }}>
                                        {formatNewsDate(item.publishedAt)}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
"use client"
import { useEffect, useState } from "react";

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

function NewsCard() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getNews() {
            try {
                setLoading(true);
                const res = await fetch("/api/news");
                if (!res.ok) throw new Error("Failed to fetch news");
                const data = await res.json();
                setNews(data);
            } catch (err) {
                setError("SIGNAL LOST — couldn't reach the feed.");
            } finally {
                setLoading(false);
            }
        }
        getNews();
    }, []);

    function formatDate(dateStr: string) {
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

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse overflow-hidden rounded-md border border-cyan-500/10 bg-[#0a0e14]"
                    >
                        <div className="h-40 bg-white/5" />
                        <div className="space-y-3 p-4">
                            <div className="h-3 w-3/4 rounded bg-white/10" />
                            <div className="h-3 w-1/3 rounded bg-white/10" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-md border border-red-500/30 bg-red-500/5 p-6 text-center font-mono text-sm text-red-400">
                {"// "}{error}
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="rounded-md border border-cyan-500/20 bg-[#0a0e14] p-6 text-center font-mono text-sm text-cyan-500/70">
                {"// "}NO_TRANSMISSIONS_FOUND
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
                <a
                    key={item.id}
                    href={item.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col overflow-hidden rounded-md border border-cyan-500/15 bg-[#0a0e14] transition-all duration-200 hover:border-cyan-400/50 hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.35)]"
                >
                    {/* corner brackets, signature touch */}
                    <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-cyan-400/0 transition-colors duration-200 group-hover:border-cyan-400/70" />
                    <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-cyan-400/0 transition-colors duration-200 group-hover:border-cyan-400/70" />
                    <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-cyan-400/0 transition-colors duration-200 group-hover:border-cyan-400/70" />
                    <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-cyan-400/0 transition-colors duration-200 group-hover:border-cyan-400/70" />

                    <div className="relative h-40 w-full overflow-hidden bg-white/5">
                        <img
                            src={item.image || "/placeholder-news.jpg"}
                            alt={item.title}
                            className="h-full w-full object-cover opacity-90 grayscale-[30%] transition duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-news.jpg";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-100 transition-colors group-hover:text-cyan-300">
                            {item.title}
                        </h3>
                        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[11px] tracking-wide">
                            {item.source?.name ? (
                                <span className="truncate text-emerald-400/80">
                                    {"> "}{item.source.name}
                                </span>
                            ) : <span />}
                            <time dateTime={item.publishedAt} className="shrink-0 text-gray-500">
                                {formatDate(item.publishedAt)}
                            </time>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}

export default NewsCard;
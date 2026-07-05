import axios from "axios";

type CacheEntry = { data: any; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function fetchNews({ query = "cybersecurity", max = "10" }: { query?: string; max?: string }) {
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) throw new Error("GNEWS_API_KEY is not configured");

    const cacheKey = `${query}:${max}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.data;

    try {
        const res = await axios.get("https://gnews.io/api/v4/search", {
            params: { q: query, max, apikey: apiKey },
            timeout: 10000,
        });
        const articles = res.data?.articles ?? [];
        cache.set(cacheKey, { data: articles, expiresAt: Date.now() + CACHE_TTL_MS });
        return articles;
    } catch (error) {
        console.error("Error fetching news data:", error);
        if (cached) return cached.data;
        throw error;
    }
}
type CacheEntry<T> = {
    data: T;
    expiresAt: number;
};

export function getCache<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (entry.expiresAt < Date.now()) {
            localStorage.removeItem(key);
            return null;
        }
        return entry.data;
    } catch {
        return null;
    }
}

export function setCache<T>(key: string, data: T, ttlMs: number) {
    if (typeof window === "undefined") return;
    try {
        const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
        localStorage.setItem(key, JSON.stringify(entry));
    } catch (err) {
        console.error("Failed to write cache", err);
    }
}
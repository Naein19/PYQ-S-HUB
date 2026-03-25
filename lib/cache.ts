/**
 * High-performance Tiered Caching Utility
 * L1: In-memory (Global Variable) - Instant access, resets on refresh
 * L2: LocalStorage (24h TTL) - Persistent across sessions
 * Deduplication: Prevents simultaneous identical network requests
 */

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface CacheItem<T> {
    data: T;
    expiry: number;
}

// L1 Memory Cache
const l1Cache: Record<string, { data: any; expiry: number }> = {};

// Request Deduplication Registry
const pendingRequests: Record<string, Promise<any> | undefined> = {};

export const CacheManager = {
    /**
     * Get item from Tiered Cache (L1 -> L2)
     */
    get<T>(key: string): T | null {
        const fullKey = key.startsWith('pyqs_') ? key : `pyqs_${key}`;
        const now = Date.now();

        // 1. Check L1 (Memory)
        if (l1Cache[fullKey]) {
            if (now < l1Cache[fullKey].expiry) {
                return l1Cache[fullKey].data;
            }
            delete l1Cache[fullKey];
        }

        // 2. Check L2 (LocalStorage)
        if (typeof window !== 'undefined') {
            try {
                const itemStr = localStorage.getItem(fullKey);
                if (itemStr) {
                    const item: CacheItem<T> = JSON.parse(itemStr);
                    if (now < item.expiry) {
                        // Hydrate L1 from L2
                        l1Cache[fullKey] = { data: item.data, expiry: item.expiry };
                        return item.data;
                    }
                    localStorage.removeItem(fullKey);
                }
            } catch (e) {
                console.warn('Cache L2 read error:', e);
            }
        }

        return null;
    },

    /**
     * Set item in Tiered Cache (L1 + L2)
     */
    set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
        const fullKey = key.startsWith('pyqs_') ? key : `pyqs_${key}`;
        const expiry = Date.now() + ttl;

        // Set L1
        l1Cache[fullKey] = { data, expiry };

        // Set L2
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(fullKey, JSON.stringify({ data, expiry }));
            } catch (e) {
                console.warn('Cache L2 write error:', e);
            }
        }
    },

    /**
     * Unified Fetch with Deduplication and Tiered Caching
     */
    async fetch<T>(
        url: string,
        cacheKey: string,
        ttl: number = DEFAULT_TTL
    ): Promise<T> {
        // 1. Check Cache
        const cached = this.get<T>(cacheKey);
        if (cached) return cached;

        // 2. Check Pending Requests (Deduplication)
        if (pendingRequests[url]) return pendingRequests[url];

        // 3. Perform Network Fetch
        const request = fetch(url)
            .then(async (res) => {
                if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
                const data = await res.json();
                this.set(cacheKey, data, ttl);
                return data;
            })
            .finally(() => {
                delete pendingRequests[url];
            });

        pendingRequests[url] = request;
        return request;
    },

    /**
     * Deduplicate any asynchronous operation by key
     */
    async deduplicate<T>(key: string, promiseFn: () => Promise<T>): Promise<T> {
        if (pendingRequests[key]) return pendingRequests[key];

        const promise = promiseFn().finally(() => {
            delete pendingRequests[key];
        });

        pendingRequests[key] = promise;
        return promise;
    },

    remove(key: string): void {
        const fullKey = key.startsWith('pyqs_') ? key : `pyqs_${key}`;
        delete l1Cache[fullKey];
        if (typeof window !== 'undefined') {
            localStorage.removeItem(fullKey);
        }
    },

    clear(prefix: string = 'pyqs_'): void {
        Object.keys(l1Cache).forEach(k => { if (k.startsWith(prefix)) delete l1Cache[k]; });
        if (typeof window !== 'undefined') {
            Object.keys(localStorage)
                .filter(key => key.startsWith(prefix))
                .forEach(key => localStorage.removeItem(key));
        }
    }
};

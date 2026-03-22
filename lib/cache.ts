/**
 * High-performance Caching Utility for Edge Request Reduction
 */

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface CacheItem<T> {
    data: T;
    expiry: number;
}

export const LocalStorageCache = {
    /**
     * Get item from cache
     */
    get<T>(key: string): T | null {
        if (typeof window === 'undefined') return null;

        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;

            const item: CacheItem<T> = JSON.parse(itemStr);
            const now = new Date().getTime();

            if (now > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return item.data;
        } catch (error) {
            console.error('Cache read error:', error);
            return null;
        }
    },

    /**
     * Set item in cache
     */
    set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
        if (typeof window === 'undefined') return;

        try {
            const expiry = new Date().getTime() + ttl;
            const item: CacheItem<T> = { data, expiry };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error('Cache write error:', error);
        }
    },

    /**
     * Clear specific key or all app cache
     */
    remove(key: string): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    },

    clear(): void {
        if (typeof window === 'undefined') return;
        // Clear only app-specific keys if needed, but here we can clear all for simplicity
        // or use a prefix. Let's use a prefix-based clear for safety.
        Object.keys(localStorage)
            .filter(key => key.startsWith('pyqs_'))
            .forEach(key => localStorage.removeItem(key));
    }
};

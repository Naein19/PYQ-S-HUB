import { CacheManager } from './cache';

/**
 * Unified data fetcher with deduplication and caching. 
 * Wrapper for CacheManager.fetch for backward compatibility.
 */
export async function cachedFetch<T>(
    url: string,
    cacheKey?: string,
    ttl?: number
): Promise<T> {
    if (!cacheKey) {
        // If no cache key, just fetch normally but still deduplicate via a temporary key
        const tempKey = `temp_fetch_${url}`;
        return CacheManager.fetch<T>(url, tempKey, 0);
    }

    return CacheManager.fetch<T>(url, cacheKey, ttl);
}

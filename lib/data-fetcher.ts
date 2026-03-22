import { LocalStorageCache } from './cache';

/**
 * Request Deduplication State
 */
const pendingRequests: Record<string, Promise<any>> = {};

/**
 * Unified data fetcher with deduplication and caching. 
 * Prevents multiple identical edge requests and uses local cache when possible.
 */
export async function cachedFetch<T>(
    url: string,
    cacheKey?: string,
    ttl?: number
): Promise<T> {
    // 1. Check Cache first
    if (cacheKey) {
        const cachedData = LocalStorageCache.get<T>(cacheKey);
        if (cachedData) {
            console.log(`[Cache Hit] ${cacheKey}`);
            return cachedData;
        }
    }

    // 2. Request Deduplication: If already fetching this URL, return existing promise
    if (pendingRequests[url] !== undefined) {
        console.log(`[Deduplication] Joining pending request for ${url}`);
        return pendingRequests[url];
    }

    // 3. Perform Fetch
    console.log(`[Network Fetch] ${url}`);
    const fetchPromise = fetch(url).then(async (response) => {
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const data = await response.json();

        // 4. Save to Cache if key provided
        if (cacheKey) {
            LocalStorageCache.set(cacheKey, data, ttl);
        }

        // Cleanup pending request
        delete pendingRequests[url];
        return data;
    }).catch((error) => {
        delete pendingRequests[url];
        throw error;
    });

    pendingRequests[url] = fetchPromise;
    return fetchPromise;
}

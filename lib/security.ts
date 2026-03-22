import { LocalStorageCache } from './cache';

/**
 * Basic Input Sanitization
 * Strips HTML tags and excessive whitespace to prevent basic XSS/Injection
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';
    return input
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .replace(/[<>]/g, '')    // Strip remaining brackets
        .trim();
}

/**
 * Simple Throttle Utility
 * Limits the rate at which a function can fire.
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Bot/Scraper Guard
 * Simple check for rapid repeated requests to main data endpoints
 */
export const SecurityGuard = {
    isSpamming(action: string, limit: number = 20, windowMs: number = 60000): boolean {
        const key = `sec_burst_${action}`;
        const now = Date.now();
        const data = LocalStorageCache.get<{ count: number; first: number }>(key);

        if (!data) {
            LocalStorageCache.set(key, { count: 1, first: now }, windowMs);
            return false;
        }

        if (now - data.first > windowMs) {
            LocalStorageCache.set(key, { count: 1, first: now }, windowMs);
            return false;
        }

        if (data.count > limit) return true;

        LocalStorageCache.set(key, { ...data, count: data.count + 1 }, windowMs);
        return false;
    }
};

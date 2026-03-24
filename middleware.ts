import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Lightweight IP-based rate limiting
 * Note: In a serverless/edge environment, this Map resets on cold starts.
 * For a production SaaS, use a shared KV store like Redis.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT = 100; // max requests
const WINDOW_MS = 60 * 1000; // 1 minute window

export function middleware(request: NextRequest) {
    const ip = request.ip || 'anonymous';
    const now = Date.now();
    const url = request.nextUrl.pathname;

    // 1. Rate Limiting Logic
    const rateData = rateLimitMap.get(ip);
    if (!rateData || now - rateData.lastReset > WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
        rateData.count++;
        if (rateData.count > RATE_LIMIT) {
            console.warn(`[Rate Limit Exceeded] IP: ${ip} Path: ${url}`);
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: { 'Retry-After': '60' }
            });
        }
    }

    // 2. Domain Consistency (Consolidate traffic to primary domain)
    const host = request.headers.get('host');
    const primaryDomain = 'pyqs-hub.vercel.app';
    if (host && host !== primaryDomain && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        return NextResponse.redirect(`https://${primaryDomain}${request.nextUrl.pathname}${request.nextUrl.search}`, 301);
    }

    // 3. Security Headers (Harden CSP and others)
    const response = NextResponse.next();

    // Security Headers with PostHog support
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
    const csp = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://vvpunocthcpgwtdywnny.supabase.co https://*.supabase.co; connect-src 'self' https://vvpunocthcpgwtdywnny.supabase.co https://*.supabase.co https://vitals.vercel-insights.com ${posthogHost}; frame-src 'self' https://vvpunocthcpgwtdywnny.supabase.co https://*.supabase.co; object-src 'self' blob:; frame-ancestors 'none'; upgrade-insecure-requests;`;

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // 3. Anti-Scraping: Detect abnormal patterns (e.g., rapid JSON fetches)
    if (url.endsWith('.json') && rateData && rateData.count > 20) {
        // Stricter limit for data files
        console.warn(`[Scraping Attempt] IP: ${ip} Path: ${url}`);
        // Throttle instead of block? Or block.
        // return new NextResponse('Forbidden', { status: 403 });
    }

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

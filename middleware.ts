import { NextRequest, NextResponse } from 'next/server'

/**
 * Known scraping/automation clients to block outright. Search engines and
 * link-preview bots (Googlebot, Bingbot, Slackbot, etc.) are intentionally
 * NOT in this list — blocking them would break SEO and social link previews.
 */
const BLOCKED_USER_AGENT_PATTERNS = [
    /curl\//i,
    /wget\//i,
    /python-requests/i,
    /python-urllib/i,
    /\bscrapy\b/i,
    /\baiohttp\b/i,
    /node-fetch/i,
    /\baxios\/\d/i,
    /libwww-perl/i,
    /go-http-client/i,
    /HttpClient/i,
    /GPTBot/i,
    /ChatGPT-User/i,
    /CCBot/i,
    /ClaudeBot/i,
    /anthropic-ai/i,
    /Bytespider/i,
    /PetalBot/i,
    /MJ12bot/i,
    /DotBot/i,
    /AhrefsBot/i,
    /SemrushBot/i,
    /serpstatbot/i,
    /\bscanner\b/i,
    /masscan/i,
    /\bzgrab\b/i,
]

// In-memory best-effort rate limit. Not distributed/atomic across edge
// regions or cold starts — it's a cheap first line of defense against
// single-instance scraping bursts, not a substitute for a real store.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 240
const requestLog = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = requestLog.get(ip)

    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        requestLog.set(ip, { count: 1, windowStart: now })
        return false
    }

    entry.count += 1
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return true
    }
    return false
}

// Keep the map from growing unbounded on long-lived warm instances.
function pruneRequestLog(now: number) {
    if (requestLog.size < 5000) return
    requestLog.forEach((entry, ip) => {
        if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
            requestLog.delete(ip)
        }
    })
}

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || ''

    if (BLOCKED_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
        return new NextResponse('Forbidden', { status: 403 })
    }

    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'

    if (ip !== 'unknown') {
        pruneRequestLog(Date.now())
        if (isRateLimited(ip)) {
            return new NextResponse('Too Many Requests', {
                status: 429,
                headers: { 'Retry-After': '60' },
            })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Run on everything except Next.js internals and static assets,
         * so bots hitting pages/data get filtered but images/fonts don't
         * pay the middleware cost.
         */
        '/((?!_next/static|_next/image|favicon|site.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|woff|woff2)$).*)',
    ],
}

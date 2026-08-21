import posthog from 'posthog-js'

let initialized = false

export function initPostHog() {
    if (initialized || typeof window === 'undefined') return

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (!key || !host) return

    posthog.init(key, {
        api_host: host,
        capture_pageview: false, // handled manually on route change
        capture_pageleave: true,
        autocapture: false,
        capture_dead_clicks: false,
        capture_performance: false,
        disable_surveys: true,
        disable_web_experiments: true,
        disable_session_recording: true,
        persistence: 'localStorage+cookie',
    })

    initialized = true
}

export { posthog }

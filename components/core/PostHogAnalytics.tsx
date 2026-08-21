'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { initPostHog, posthog } from '@/lib/posthog'

function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        initPostHog()
    }, [])

    useEffect(() => {
        if (!pathname) return
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
        posthog.capture('$pageview', { $current_url: url })
    }, [pathname, searchParams])

    return null
}

/**
 * PostHog route tracking for the Next.js App Router.
 * Wrapped in Suspense to safely use useSearchParams() in a client component.
 */
export default function PostHogAnalytics() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    )
}

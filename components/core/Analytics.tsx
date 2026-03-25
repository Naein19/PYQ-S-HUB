'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function AnalyticsContent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID

    useEffect(() => {
        if (pathname && window.gtag && GA_ID) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

            window.gtag('config', GA_ID, {
                page_path: url,
            })
        }
    }, [pathname, searchParams, GA_ID])

    return null
}

/**
 * Analytics component to handle Google Analytics route tracking in Next.js SPA.
 * Wrapped in Suspense to safely use useSearchParams() in a client component.
 */
export default function Analytics() {
    if (process.env.NODE_ENV !== 'production') return null

    return (
        <Suspense fallback={null}>
            <AnalyticsContent />
        </Suspense>
    )
}

// Declare gtag for TypeScript
declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string,
            config?: Record<string, any>
        ) => void;
        dataLayer: any[];
    }
}

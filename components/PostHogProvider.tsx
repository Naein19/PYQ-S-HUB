'use client'

import posthog from '@/instrumentation-client'
import { ReactNode, useEffect } from 'react'

export default function PostHogProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        // PostHog initialization is handled in instrumentation-client.ts
        // This provider ensures the module is loaded and side effects run on the client.
    }, [])

    return <>{children}</>
}

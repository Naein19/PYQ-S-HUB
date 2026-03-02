'use client'

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Loading from '@/components/ui/Loading'

interface LoadingContextType {
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

function RouteChangeListener({ setIsInternalLoading }: { setIsInternalLoading: (loading: boolean) => void }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // When pathname or searchParams change, the route has "finished" its transition
        // handled by Next.js. We stop the global loader.
        setIsInternalLoading(false)
    }, [pathname, searchParams, setIsInternalLoading])

    return null
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()

    // Trigger loader on pathname change (start of transition)
    // Note: Next.js App Router doesn't have a reliable "routeChangeStart" event 
    // without hacking the Link component, so we use a combination of 
    // manual triggers for async actions and immediate state for context-aware transitions.

    // We provide basic manual control for now
    const contextValue = {
        isLoading,
        setIsLoading
    }

    return (
        <LoadingContext.Provider value={contextValue}>
            <Suspense fallback={null}>
                <RouteChangeListener setIsInternalLoading={setIsLoading} />
            </Suspense>

            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#EAE0D5]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <Loading size="lg" text="Processing Academic Archive..." />
                </div>
            )}

            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}

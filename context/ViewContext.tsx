'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { PYQ } from '@/lib/queries'
import DesktopWindow from '@/components/ui/DesktopWindow'

interface ViewContextType {
    viewPaper: (paper: PYQ) => void
    activeDesktopPaper: PYQ | null
    closeDesktopWindow: () => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

import { useRouter } from 'next/navigation'

export function ViewProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isDesktop, setIsDesktop] = useState(false)
    const [activeDesktopPaper, setActiveDesktopPaper] = useState<PYQ | null>(null)

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    const viewPaper = (paper: PYQ) => {
        if (isDesktop) {
            setActiveDesktopPaper(paper)
        } else {
            router.push(`/viewer/${paper.id}`)
        }
    }

    const closeDesktopWindow = () => {
        setActiveDesktopPaper(null)
    }

    return (
        <ViewContext.Provider value={{ viewPaper, activeDesktopPaper, closeDesktopWindow }}>
            {children}
            {isDesktop && activeDesktopPaper && (
                <DesktopWindow
                    pyq={activeDesktopPaper}
                    onClose={closeDesktopWindow}
                />
            )}
        </ViewContext.Provider>
    )
}

export function useView() {
    const context = useContext(ViewContext)
    if (context === undefined) {
        throw new Error('useView must be used within a ViewProvider')
    }
    return context
}

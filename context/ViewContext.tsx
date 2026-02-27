'use client'

import React, { createContext, useContext, useState } from 'react'
import type { PYQ } from '@/lib/queries'

interface ViewContextType {
    activePaper: PYQ | null
    isOpen: boolean
    viewPaper: (paper: PYQ) => void
    closeViewer: () => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

export function ViewProvider({ children }: { children: React.ReactNode }) {
    const [activePaper, setActivePaper] = useState<PYQ | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const viewPaper = (paper: PYQ) => {
        setActivePaper(paper)
        setIsOpen(true)
    }

    const closeViewer = () => {
        setIsOpen(false)
        // Reset paper after animation
        setTimeout(() => setActivePaper(null), 300)
    }

    return (
        <ViewContext.Provider value={{ activePaper, isOpen, viewPaper, closeViewer }}>
            {children}
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

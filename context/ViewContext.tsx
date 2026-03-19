'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { PYQ } from '@/lib/queries'
import DesktopWindow from '@/components/ui/DesktopWindow'
import SidebarBubbles from '@/components/ui/SidebarBubbles'
import { useRouter } from 'next/navigation'

const MAX_BUBBLES = 4

interface ViewContextType {
    viewPaper: (paper: PYQ) => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

export function ViewProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isDesktop, setIsDesktop] = useState(false)
    const [activePaper, setActivePaper] = useState<PYQ | null>(null)
    const [bubblePapers, setBubblePapers] = useState<PYQ[]>([])

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    const viewPaper = (paper: PYQ) => {
        if (!isDesktop) {
            router.push(`/viewer/${paper.id}`)
            return
        }

        // Already the main window — do nothing
        if (activePaper && activePaper.id === paper.id) return

        // Already in a bubble — swap it to main, push current main to bubbles
        const inBubble = bubblePapers.find(b => b.id === paper.id)
        if (inBubble) {
            setBubblePapers(prev => {
                const rest = prev.filter(b => b.id !== paper.id)
                if (activePaper && rest.length < MAX_BUBBLES) return [...rest, activePaper]
                return rest
            })
            setActivePaper(paper)
            return
        }

        // No main window yet — open as main
        if (!activePaper) {
            setActivePaper(paper)
            return
        }

        // Max bubbles already full (4) — just replace main, discard oldest would need UX choice
        // We simply replace main only; bubbles stay
        if (bubblePapers.length >= MAX_BUBBLES) {
            setActivePaper(paper)
            return
        }

        // Push current main to bubbles, open new as main
        setBubblePapers(prev => [...prev, activePaper])
        setActivePaper(paper)
    }

    const minimizeMain = () => {
        if (!activePaper) return
        if (bubblePapers.length < MAX_BUBBLES) {
            setBubblePapers(prev => [...prev, activePaper])
        }
        setActivePaper(null)
    }

    const restoreFromBubble = (paper: PYQ) => {
        setBubblePapers(prev => {
            const rest = prev.filter(b => b.id !== paper.id)
            if (activePaper && rest.length < MAX_BUBBLES) return [...rest, activePaper]
            return rest
        })
        setActivePaper(paper)
    }

    const closeMain = () => setActivePaper(null)

    const closeBubble = (paper: PYQ) =>
        setBubblePapers(prev => prev.filter(b => b.id !== paper.id))

    return (
        <ViewContext.Provider value={{ viewPaper }}>
            {children}
            {isDesktop && (
                <>
                    {activePaper && (
                        <DesktopWindow
                            pyq={activePaper}
                            onClose={closeMain}
                            onMinimize={minimizeMain}
                        />
                    )}
                    {bubblePapers.length > 0 && (
                        <SidebarBubbles
                            papers={bubblePapers}
                            onRestore={restoreFromBubble}
                            onClose={closeBubble}
                        />
                    )}
                </>
            )}
        </ViewContext.Provider>
    )
}

export function useView() {
    const context = useContext(ViewContext)
    if (context === undefined) throw new Error('useView must be used within a ViewProvider')
    return context
}

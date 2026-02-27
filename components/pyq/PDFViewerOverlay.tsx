'use client'

import React, { useEffect, useState } from 'react'
import { useView } from '@/context/ViewContext'
import Window from '@/components/ui/Window'
import Drawer from '@/components/ui/Drawer'
import { Loader2 } from 'lucide-react'

export default function PDFViewerOverlay() {
    const { activePaper, isOpen, closeViewer } = useView()
    const [isDesktop, setIsDesktop] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    useEffect(() => {
        if (isOpen) setIsLoading(true)
    }, [isOpen, activePaper])

    if (!activePaper) return null

    const viewerContent = (
        <div className="w-full h-full relative bg-black/5">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#FBF9F7]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#111827]" />
                    <p className="mt-4 font-mono text-xs font-black uppercase tracking-widest">
                        Initializing Renderer...
                    </p>
                </div>
            )}
            <iframe
                src={`${activePaper.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none"
                onLoad={() => setIsLoading(false)}
                title={activePaper.paper_title}
            />
        </div>
    )

    if (isDesktop) {
        return (
            <Window
                isOpen={isOpen}
                onClose={closeViewer}
                title={`${activePaper.subject_code} // ${activePaper.paper_title}`}
            >
                {viewerContent}
            </Window>
        )
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={closeViewer}
            title={activePaper.subject_code}
        >
            <div className="h-[60vh]">
                {viewerContent}
            </div>
        </Drawer>
    )
}

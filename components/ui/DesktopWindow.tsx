'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Maximize2, Minimize2, ExternalLink, Download, GripHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PYQ } from '@/lib/queries'

interface DesktopWindowProps {
    pyq: PYQ
    onClose: () => void
    onMinimize: () => void
}

const WINDOW_W = 820
const WINDOW_H = 640

export default function DesktopWindow({ pyq, onClose, onMinimize }: DesktopWindowProps) {
    const [isMaximized, setIsMaximized] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const windowRef = useRef<HTMLDivElement>(null)

    // Drag state kept in refs — never causes re-renders during drag
    const isDragging = useRef(false)
    const dragOffset = useRef({ x: 0, y: 0 })
    const position = useRef({ x: 0, y: 0 })

    // Centre on mount, then fade in
    useEffect(() => {
        const x = Math.max(0, (window.innerWidth - WINDOW_W) / 2)
        const y = Math.max(0, (window.innerHeight - WINDOW_H) / 2)
        position.current = { x, y }
        if (windowRef.current) {
            windowRef.current.style.left = `${x}px`
            windowRef.current.style.top = `${y}px`
        }
        requestAnimationFrame(() => setIsVisible(true))
    }, [])

    // ── Pointer-capture drag (silky smooth — no React state changes during drag) ──
    const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (isMaximized) return
        // Only primary button
        if (e.button !== 0) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        isDragging.current = true
        dragOffset.current = {
            x: e.clientX - position.current.x,
            y: e.clientY - position.current.y,
        }
    }

    const handleTitlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current || isMaximized) return
        const newX = Math.max(0, e.clientX - dragOffset.current.x)
        const newY = Math.max(0, e.clientY - dragOffset.current.y)
        position.current = { x: newX, y: newY }
        // Mutate DOM directly — no setState = no re-render = butter smooth
        if (windowRef.current) {
            windowRef.current.style.left = `${newX}px`
            windowRef.current.style.top = `${newY}px`
        }
    }

    const handleTitlePointerUp = () => {
        isDragging.current = false
    }

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 180)
    }

    const handleDownload = async () => {
        try {
            const response = await fetch(pyq.file_url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${pyq.subject_code}_${pyq.paper_title}.pdf`.replace(/\s+/g, '_')
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch {
            window.open(pyq.file_url, '_blank')
        }
    }

    return (
        <>
            {/* Transparent click-catcher — click outside window minimizes to bubble */}
            <div
                onClick={onMinimize}
                className="fixed inset-0 z-[90]"
                style={{ background: 'transparent' }}
                aria-label="Minimize viewer"
            />

            {/* ── Main Window ──────────────────────────────────────────── */}
            <div
                ref={windowRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: isMaximized ? '100vw' : WINDOW_W,
                    height: isMaximized ? '100vh' : WINDOW_H,
                    ...(isMaximized ? { top: 0, left: 0 } : {}),
                    willChange: 'transform',
                }}
                className={cn(
                    'fixed z-[100] flex flex-col',
                    'bg-[#FBF9F7] border-2 border-[#111827]',
                    'shadow-[8px_8px_0px_#111827]',
                    'rounded-sm overflow-hidden',
                    'transition-opacity duration-180',
                    isMaximized ? 'shadow-none border-0' : '',
                    isVisible ? 'opacity-100' : 'opacity-0'
                )}
            >
                {/* ── Title Bar ────────────────────────────────────────── */}
                <div
                    onPointerDown={handleTitlePointerDown}
                    onPointerMove={handleTitlePointerMove}
                    onPointerUp={handleTitlePointerUp}
                    className={cn(
                        'h-11 bg-[#111827] flex items-center justify-between px-3 flex-shrink-0 select-none border-b border-white/10',
                        !isMaximized && 'cursor-grab active:cursor-grabbing'
                    )}
                >
                    {/* Left — paper meta */}
                    <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)] flex-shrink-0" />
                        <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.18em] truncate max-w-[320px]">
                            {pyq.subject_code} // {pyq.paper_title}
                        </span>
                    </div>

                    <GripHorizontal className="w-4 h-4 text-white/15 flex-shrink-0 pointer-events-none" />

                    {/* Right — action buttons (stop pointer-down from propagating to drag handler) */}
                    <div
                        className="flex items-center gap-0.5 flex-shrink-0"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleDownload}
                            className="w-8 h-8 flex items-center justify-center rounded-sm text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            title="Download PDF"
                            aria-label="Download PDF"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={() => window.open(pyq.file_url, '_blank')}
                            className="w-8 h-8 flex items-center justify-center rounded-sm text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            title="Open in new tab"
                            aria-label="Open in new tab"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <button
                            onClick={() => setIsMaximized(v => !v)}
                            className="w-8 h-8 flex items-center justify-center rounded-sm text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            title={isMaximized ? 'Restore window' : 'Maximise'}
                        >
                            {isMaximized
                                ? <Minimize2 className="w-3.5 h-3.5" />
                                : <Maximize2 className="w-3.5 h-3.5" />
                            }
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center rounded-sm text-white/40 hover:bg-[#FF5F56] hover:text-white transition-all"
                            title="Close"
                            aria-label="Close viewer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* ── PDF Iframe ────────────────────────────────────────── */}
                <div className="flex-1 bg-white overflow-hidden" style={{ isolation: 'isolate' }}>
                    <iframe
                        src={`${pyq.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-none block"
                        title={pyq.paper_title}
                    />
                </div>

                {/* ── Status Bar ───────────────────────────────────────── */}
                <div className="h-7 bg-[#EAE0D5] border-t border-[#111827]/10 flex items-center justify-between px-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                        <span className="text-[8px] font-mono font-black text-[#6B7280] uppercase tracking-[0.2em]">
                            DATA_STREAM_STABLE_v2.1
                        </span>
                    </div>
                    <div className="text-[8px] font-mono font-black text-[#111827]/40 uppercase tracking-[0.2em]">
                        ENCRYPTED_ARCHIVE_VIEW
                    </div>
                </div>
            </div>
        </>
    )
}

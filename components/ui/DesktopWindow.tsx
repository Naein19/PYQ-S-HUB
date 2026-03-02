'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Minus, Maximize2, Minimize2, ExternalLink, Download, GripHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PYQ } from '@/lib/queries'

interface DesktopWindowProps {
    pyq: PYQ
    onClose: () => void
}

export default function DesktopWindow({ pyq, onClose }: DesktopWindowProps) {
    const [isMaximized, setIsMaximized] = useState(false)
    const [position, setPosition] = useState({ x: 100, y: 100 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const windowRef = useRef<HTMLDivElement>(null)

    // Handle dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || isMaximized) return
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            })
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, dragOffset, isMaximized])

    const startDrag = (e: React.MouseEvent) => {
        if (isMaximized) return
        setIsDragging(true)
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        })
    }

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized)
    }

    return (
        <div
            ref={windowRef}
            style={{
                left: isMaximized ? 0 : position.x,
                top: isMaximized ? 0 : position.y,
                width: isMaximized ? '100vw' : '800px',
                height: isMaximized ? '100vh' : '600px',
                zIndex: 100
            }}
            className={cn(
                "fixed bg-[#FBF9F7] border-2 border-[#111827] shadow-[12px_12px_0px_#111827] flex flex-col transition-all duration-300 ease-out overflow-hidden rounded-sm",
                isMaximized ? "shadow-none border-0" : ""
            )}
        >
            {/* Title Bar (macOS Style) */}
            <div
                onMouseDown={startDrag}
                className="h-10 bg-[#111827] flex items-center justify-between px-4 cursor-grab active:cursor-grabbing border-b border-white/10"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 flex items-center justify-center group transition-colors"
                        title="Close"
                    >
                        <X className="w-2 h-2 text-transparent group-hover:text-black/40" />
                    </button>
                    <button
                        className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 flex items-center justify-center group transition-colors"
                        title="Minimize"
                    >
                        <Minus className="w-2 h-2 text-transparent group-hover:text-black/40" />
                    </button>
                    <button
                        onClick={toggleMaximize}
                        className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 flex items-center justify-center group transition-colors"
                        title={isMaximized ? "Restore" : "Maximize"}
                    >
                        {isMaximized ? (
                            <Minimize2 className="w-2 h-2 text-transparent group-hover:text-black/40" />
                        ) : (
                            <Maximize2 className="w-2 h-2 text-transparent group-hover:text-black/40" />
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.2em] pointer-events-none">
                        {pyq.subject_code} // {pyq.paper_title}
                    </span>
                    <GripHorizontal className="w-4 h-4 text-white/20" />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.open(pyq.file_url, '_blank')}
                        className="p-1.5 hover:bg-white/10 rounded-sm text-white/60 hover:text-white transition-colors"
                        title="Open Original"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Content Stage */}
            <div className="flex-1 bg-white relative">
                <iframe
                    src={`${pyq.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-none"
                    title={pyq.paper_title}
                />
            </div>

            {/* Window Status Bar */}
            <div className="h-8 bg-[#EAE0D5] border-t border-[#111827]/10 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[8px] font-mono font-black text-[#6B7280] uppercase tracking-[0.2em]">
                        DATA_STREAM_STABLE_v2.1
                    </span>
                </div>
                <div className="text-[8px] font-mono font-black text-[#111827]/40 uppercase tracking-[0.2em]">
                    ENCRYPTED_ARCHIVE_VIEW
                </div>
            </div>
        </div>
    )
}

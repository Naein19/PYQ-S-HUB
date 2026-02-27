'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Maximize2, Minimize2, Move } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WindowProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export default function Window({ isOpen, onClose, title, children }: WindowProps) {
    const [isMaximized, setIsMaximized] = useState(false)
    const [position, setPosition] = useState({ x: 100, y: 100 })
    const [size, setSize] = useState({ width: 800, height: 600 })
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const dragOffset = useRef({ x: 0, y: 0 })
    const windowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                })
            }
            if (isResizing) {
                const rect = windowRef.current?.getBoundingClientRect()
                if (rect) {
                    setSize({
                        width: Math.max(400, e.clientX - rect.left),
                        height: Math.max(300, e.clientY - rect.top)
                    })
                }
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            setIsResizing(false)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isOpen, isDragging, isResizing])

    if (!isOpen) return null

    const handleDragStart = (e: React.MouseEvent) => {
        if (isMaximized) return
        setIsDragging(true)
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
    }

    return (
        <div
            ref={windowRef}
            className={cn(
                "fixed z-[100] bg-white rounded-xl border border-[#111827]/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-200 overflow-hidden",
                isMaximized ? "inset-4 w-auto h-auto" : "ring-1 ring-[#111827]/5"
            )}
            style={isMaximized ? {} : {
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height
            }}
        >
            {/* Window Header */}
            <div
                onMouseDown={handleDragStart}
                className={cn(
                    "h-11 bg-[#FBF9F7] border-b border-[#111827]/5 flex items-center justify-between px-4 cursor-move select-none",
                    isMaximized && "cursor-default"
                )}
            >
                {/* macOS Traffic Lights */}
                <div className="flex items-center gap-2.5 w-[80px]">
                    <button
                        onClick={onClose}
                        className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] transition-all hover:bg-[#FF5F56] active:scale-95 flex items-center justify-center group/btn shadow-sm"
                        title="Close"
                    >
                        <X className="w-2 h-2 text-black/60 opacity-0 group-hover/btn:opacity-100" />
                    </button>
                    <button
                        onClick={() => {/* Mock minimize */ }}
                        className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] transition-all hover:bg-[#FFBD2E] active:scale-95 flex items-center justify-center group/btn shadow-sm"
                        title="Minimize"
                    >
                        <div className="w-1.5 h-[1.5px] bg-black/60 opacity-0 group-hover/btn:opacity-100" />
                    </button>
                    <button
                        onClick={() => setIsMaximized(!isMaximized)}
                        className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] transition-all hover:bg-[#27C93F] active:scale-95 flex items-center justify-center group/btn shadow-sm"
                        title={isMaximized ? "Restore" : "Maximize"}
                    >
                        {isMaximized ? (
                            <Minimize2 className="w-2 h-2 text-black/60 opacity-0 group-hover/btn:opacity-100" />
                        ) : (
                            <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover/btn:opacity-100" />
                        )}
                    </button>
                </div>

                {/* Window Title */}
                <div className="flex-1 text-center">
                    <span className="text-[11px] font-bold text-[#111827]/70 truncate block px-4 tracking-tight">
                        {title}
                    </span>
                </div>

                {/* Right Area Spacer */}
                <div className="w-[80px] flex justify-end">
                    {/* Could add a search or share icon here later */}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-white relative">
                {children}

                {/* Resize Handle (bottom-right) */}
                {!isMaximized && (
                    <div
                        onMouseDown={() => setIsResizing(true)}
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-20"
                    />
                )}
            </div>

            {/* Status Bar (Subtle) */}
            <div className="h-7 border-t border-[#111827]/5 bg-[#FBF9F7] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-[#111827]/40 uppercase tracking-widest">
                        System_Encapsulation_Active
                    </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-[#111827]/40 uppercase tracking-widest">
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                </span>
            </div>
        </div>
    )
}

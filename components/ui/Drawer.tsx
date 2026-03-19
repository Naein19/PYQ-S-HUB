import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export default function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!mounted) return null

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/80 z-[9998] transition-opacity duration-300 backdrop-blur-md",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] z-[9999] rounded-t-[32px] border-t-2 border-[var(--color-border)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] max-h-[92vh] overflow-hidden flex flex-col shadow-[0_-10px_60px_rgba(0,0,0,0.5)]",
                    isOpen ? "translate-y-0" : "translate-y-full"
                )}
            >
                {/* Handle bar for dragging (visual indicator) */}
                <div className="flex justify-center pt-3 pb-2" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-[var(--color-text)]/10 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-8 pb-3 flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--color-text)]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-card)] hover:bg-[var(--color-text)] hover:text-[var(--color-surface)] transition-all transform active:scale-95 shadow-sm"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto px-8 py-6 pb-12">
                    {children}
                </div>
            </div>
        </>,
        document.body
    )
}

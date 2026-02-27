'use client'

import React, { useEffect, useState } from 'react'
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

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 z-[70] transition-opacity duration-300 backdrop-blur-sm",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 bg-white z-[80] rounded-t-[24px] border-t border-[#111827] transition-transform duration-300 ease-out max-h-[85vh] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]",
                    isOpen ? "translate-y-0" : "translate-y-full"
                )}
            >
                {/* Handle */}
                <div className="flex justify-center py-4" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-[#111827]/10 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 pb-6 flex items-center justify-between border-b border-[#111827]/5">
                    <h2 className="text-xl font-black uppercase tracking-tight text-[#111827]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full border border-[#111827] flex items-center justify-center bg-[#EAE0D5] hover:bg-[#111827] hover:text-white transition-all transform active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#FBF9F7]">
                    {children}
                </div>
            </div>
        </>
    )
}

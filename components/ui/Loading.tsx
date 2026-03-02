'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    text?: string
    fullPage?: boolean
}

export default function Loading({
    size = 'md',
    className,
    text,
    fullPage = false
}: LoadingProps) {
    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-20 h-20'
    }

    const loader = (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className="relative inline-flex flex-col items-center">
                {/* Document Icon */}
                <FileText className={cn(
                    iconSizes[size],
                    "text-[#111827] opacity-20"
                )} />

                {/* Horizontal Scanning Line */}
                <div className={cn(
                    "absolute left-0 right-0 h-[1.5px] bg-[#4338CA] shadow-[0_0_8px_rgba(67,56,202,0.6)] z-10 pointer-events-none",
                    "animate-scan-vertical"
                )} />
            </div>

            {text && (
                <p className={cn(
                    "font-mono font-black uppercase tracking-[0.2em] text-[#111827]/40 animate-pulse",
                    size === 'sm' ? "text-[8px]" : "text-[10px]"
                )}>
                    {text}
                </p>
            )}
        </div>
    )

    if (fullPage) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center w-full bg-transparent">
                {loader}
            </div>
        )
    }

    return loader
}

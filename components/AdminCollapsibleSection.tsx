'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminCollapsibleSectionProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    badge?: string
}

export default function AdminCollapsibleSection({ 
    title, 
    children, 
    defaultOpen = true,
    badge
}: AdminCollapsibleSectionProps) {
    const [isCollapsed, setIsCollapsed] = useState(!defaultOpen)

    return (
        <div className="space-y-8">
            <div className="pb-4 border-b border-[var(--color-border)]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-[var(--color-text)] uppercase tracking-tighter">{title}</h2>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded-sm border border-[var(--color-border)]/20 hover:bg-[var(--color-surface)] transition-all"
                        title={isCollapsed ? "Expand Section" : "Collapse Section"}
                    >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    {badge && (
                        <span className="text-[8px] font-mono font-black text-[#4338CA] uppercase tracking-widest animate-pulse ml-2">
                            {badge}
                        </span>
                    )}
                </div>
            </div>

            {!isCollapsed && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {children}
                </div>
            )}
        </div>
    )
}

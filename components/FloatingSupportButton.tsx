'use client'

import React, { useState, useEffect } from 'react'
import { Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import SupportTicketModal from './SupportTicketModal'

export default function FloatingSupportButton() {
    const { user } = useAuth()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const allowedRoutes = ['/dashboard', '/explore']
    if (!mounted || !user || !allowedRoutes.includes(pathname)) return null

    return (
        <>
            <div className="fixed bottom-10 right-10 z-[500]">
                {/* FAB Button - Hard Shell Action Chip */}
                <button
                    onClick={() => setIsOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                        "group flex items-center gap-3 px-6 py-3 transition-all duration-200 active:scale-95 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                        "bg-[var(--color-card)] border-2 border-[var(--color-border)] text-[var(--color-text)]",
                        "rounded-xl font-black uppercase tracking-widest text-[10px]",
                        "shadow-[4px_4px_0px_var(--color-border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_var(--color-border)]"
                    )}
                    aria-label="Report Issue or Send Feedback"
                >
                    <Flag className="w-3.5 h-3.5 text-[#4338CA] transition-transform group-hover:rotate-12" />
                    <span className="hidden md:inline">REPORT_ISSUE</span>
                    <span className="md:hidden">REPORT</span>
                </button>
            </div>

            <SupportTicketModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                context={pathname}
            />
        </>
    )
}

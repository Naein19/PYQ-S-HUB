'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Megaphone, X, Settings as SettingsIcon } from 'lucide-react'
import Link from 'next/link'

import { useAuth } from '@/context/AuthContext'
import { useNotices } from '@/context/NoticeContext'

export default function NoticeTicker() {
    const { user, role } = useAuth()
    const { notices } = useNotices()
    const [isVisible, setIsVisible] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || !isVisible) return null

    // Filter notices based on user status
    const filteredNotices = notices.filter(n =>
        n.isActive && (n.type === 'all' || (n.type === 'signed' && user))
    )

    if (filteredNotices.length === 0) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] w-full bg-[var(--color-card)] border-t border-[var(--color-border)] overflow-hidden h-10 flex items-center shadow-[0_-8px_20px_rgba(0,0,0,0.15)]">
            <div className="flex items-center w-full px-4 gap-4">
                <div className="flex-shrink-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#4338CA] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] hidden sm:inline">NOTICE</span>
                </div>

                <div className="flex-1 overflow-hidden relative h-full flex items-center">
                    <div className="flex whitespace-nowrap animate-marquee items-center gap-12">
                        {/* Render all notices twice for seamless loop */}
                        {[...filteredNotices, ...filteredNotices].map((notice, idx) => (
                            <span key={`${notice.id}-${idx}`} className="text-[11px] font-bold text-[var(--color-text)] uppercase tracking-tight">
                                {notice.text}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {role === 'admin' && (
                        <Link
                            href="/admin#notices"
                            className="flex-shrink-0 hover:bg-[#4338CA]/20 rounded-full p-1.5 transition-colors group/settings"
                            title="Manage Notices"
                        >
                            <SettingsIcon className="w-3.5 h-3.5 text-[#4338CA] group-hover/settings:rotate-90 transition-transform duration-500" />
                        </Link>
                    )}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 hover:bg-[#4338CA]/20 rounded-full p-1.5 transition-colors"
                        title="Close Notice"
                    >
                        <X className="w-3.5 h-3.5 text-[#4338CA]" />
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: inline-flex;
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    AlertTriangle,
    ArrowLeft,
    Search,
    ShieldAlert,
    FileQuestion,
    Database,
    Zap
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function NotFound() {
    const [glitch, setGlitch] = useState(false)
    const [currentTime, setCurrentTime] = useState('')
    const [requestId, setRequestId] = useState('')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Generate stable-for-client-render random ID
        setRequestId(`ERR_${Math.random().toString(36).substr(2, 6).toUpperCase()}`)

        // Toggle glitch effect randomly
        const glitchInterval = setInterval(() => {
            setGlitch(prev => !prev)
            setTimeout(() => setGlitch(false), 150)
        }, 3000)

        // Update system clock
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }))
        }, 1000)

        return () => {
            clearInterval(glitchInterval)
            clearInterval(timeInterval)
        }
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-[#111827] text-[#EAE0D5] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Archival Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#EAE0D5 1px, transparent 1px), linear-gradient(90deg, #EAE0D5 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {/* Scanning Line Animation */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <div className="w-full h-[2px] bg-[#4338CA]/20 shadow-[0_0_15px_#4338CA] animate-scan absolute" />
            </div>

            {/* Top Status Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center border-b border-[#EAE0D5]/10 bg-[#111827]/80 backdrop-blur-sm z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#EAE0D5]/40">
                        <ShieldAlert className="w-3 h-3 text-red-500" />
                        SYSTEM_STATUS: CORRUPT_NODE
                    </div>
                    <div className="hidden md:block h-3 w-px bg-[#EAE0D5]/10" />
                    <div className="hidden md:flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#EAE0D5]/40">
                        <Database className="w-3 h-3 text-[#4338CA]" />
                        SECTOR: ARCHIVE_DELTA_9
                    </div>
                </div>
                <div className="font-mono text-[10px] font-black text-[#EAE0D5]/40 whitespace-nowrap">
                    REQ_ID: {requestId || 'INITIALIZING...'} // {currentTime}
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">

                {/* Visual Header */}
                <div className="relative mb-12">
                    <div className={cn(
                        "text-[120px] md:text-[220px] font-black leading-none tracking-tighter transition-all duration-75",
                        glitch ? "translate-x-1 skew-x-3 text-[#4338CA]" : "text-[#EAE0D5]"
                    )}>
                        404
                    </div>
                    {glitch && (
                        <div className="absolute inset-0 text-[120px] md:text-[220px] font-black leading-none tracking-tighter text-red-500 mix-blend-screen -translate-x-1 -skew-x-2 opacity-50">
                            404
                        </div>
                    )}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#4338CA] text-white px-4 py-1.5 rounded-sm font-mono text-[12px] font-black uppercase tracking-widest whitespace-nowrap shadow-[4px_4px_0px_#111827] border border-[#111827]">
                        ARCHIVE_SEGMENT_MISSING
                    </div>
                </div>

                {/* Warning Card */}
                <div className="bg-[#1a2234] border-2 border-[#EAE0D5]/20 p-8 md:p-12 rounded-sm relative shadow-[20px_20px_0px_rgba(67,56,202,0.1)] group hover:border-[#4338CA]/50 transition-colors max-w-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileQuestion className="w-16 h-16" />
                    </div>

                    <div className="flex items-center gap-3 mb-6 justify-center">
                        <div className="w-8 h-8 rounded-sm bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#EAE0D5]">
                            RESTRICTED_ACCESS_VIOLATION.
                        </h2>
                    </div>

                    <p className="text-[#6B7280] font-medium leading-relaxed mb-8 text-sm md:text-base">
                        The requested academic resource has been <span className="bg-[#EAE0D5] text-[#111827] px-1 font-black">REDACTED</span> or
                        relocated to a highly secure sector. Your current credentials do not grant
                        read/write access to this directory. Extended searches yield no relevant data.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button className="w-full bg-[#EAE0D5] text-[#111827] hover:bg-white flex items-center justify-center gap-2 group/btn py-4">
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                                RETURN_TO_STATION
                            </Button>
                        </Link>
                        <Link href="/explore" className="w-full sm:w-auto">
                            <Button variant="ghost" className="w-full border-[#EAE0D5]/20 hover:border-[#4338CA] text-[#EAE0D5] flex items-center justify-center gap-2 group/btn py-4">
                                <Search className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                RESCAN_INDEX
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer Quote / Meta */}
                <div className="mt-16 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-[#EAE0D5]/10" />
                        <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-[0.4em] font-bold">
                            "KNOWLEDGE_IS_THE_ULTIMATE_CURRENCY"
                        </p>
                        <div className="h-px w-12 bg-[#EAE0D5]/10" />
                    </div>

                    <div className="flex gap-8">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-mono font-black text-[#EAE0D5]/20 uppercase">Core_Ver</span>
                            <span className="text-[11px] font-bold text-[#EAE0D5]/40 italic">2.0.4-industrial</span>
                        </div>
                        <div className="flex flex-col items-center text-[#4338CA]">
                            <Zap className="w-4 h-4 mb-1 animate-pulse" />
                            <span className="text-[10px] font-mono font-black uppercase">Low_Lat_Link</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Industrial Decals */}
            <div className="absolute bottom-10 left-10 hidden lg:block opacity-[0.05]">
                <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-2">
                            <div className="w-8 h-8 rounded-sm bg-[#EAE0D5]" />
                            <div className="w-24 h-8 rounded-sm border border-[#EAE0D5]" />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { top: -2%; }
                    100% { top: 100%; }
                }
                .animate-scan {
                    animation: scan 4s linear infinite;
                }
            `}</style>
        </div>
    )
}

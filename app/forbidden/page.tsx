'use client'

import React from 'react'
import Link from 'next/link'
import {
    ShieldAlert,
    ArrowLeft,
    Search,
    Lock,
    EyeOff,
    Terminal
} from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen bg-[#111827] text-[#EAE0D5] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Archival Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#EAE0D5 1px, transparent 1px), linear-gradient(90deg, #EAE0D5 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {/* Top Status Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center border-b border-red-500/20 bg-[#111827]/80 backdrop-blur-sm z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-red-500">
                        <ShieldAlert className="w-4 h-4" />
                        ACCESS_CLEARANCE_FAILURE: 403
                    </div>
                </div>
                <div className="font-mono text-[10px] font-black text-[#EAE0D5]/20 uppercase">
                    SECTOR_LOCK_V8.4
                </div>
            </div>

            <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">
                {/* Visual Header */}
                <div className="relative mb-12 group">
                    <div className="text-[120px] md:text-[220px] font-black leading-none tracking-tighter text-red-600/20 absolute -inset-1 blur-lg opacity-40 group-hover:opacity-60 transition-opacity">
                        403
                    </div>
                    <div className="text-[120px] md:text-[220px] font-black leading-none tracking-tighter text-[#EAE0D5] relative">
                        403
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-5 py-2 rounded-sm font-mono text-[12px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-[6px_6px_0px_#111827] border-2 border-[#111827]">
                        RESTRICTED_NODE_ACCESS
                    </div>
                </div>

                {/* Restricted Card */}
                <div className="bg-[#1a2234] border-2 border-red-500/30 p-10 md:p-14 rounded-sm relative shadow-[24px_24px_0px_rgba(220,38,38,0.05)] max-w-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Lock className="w-24 h-24" />
                    </div>

                    <div className="flex items-center gap-4 mb-8 justify-center text-red-500">
                        <EyeOff className="w-8 h-8" />
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                            CREDENTIALS_INSUFFICIENT.
                        </h2>
                    </div>

                    <p className="text-[#6B7280] font-medium leading-relaxed mb-10 text-sm md:text-base">
                        Your current authentication level is <span className="text-[#EAE0D5] font-black underline decoration-red-500">UNAUTHORIZED</span> for this high-density archival sector.
                        Unauthorized access attempts are logged and transmitted to the central administrator.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button className="w-full bg-[#EAE0D5] text-[#111827] hover:bg-white flex items-center justify-center gap-3 py-4 font-black tracking-widest text-xs">
                                <ArrowLeft className="w-4 h-4" />
                                RETURN_TO_STATION
                            </Button>
                        </Link>
                        <Link href="/explore" className="w-full sm:w-auto">
                            <Button variant="ghost" className="w-full border-red-500/20 hover:border-red-500 text-red-500 hover:bg-red-500/5 flex items-center justify-center gap-3 py-4 font-black tracking-widest text-xs">
                                <Search className="w-4 h-4" />
                                EXPLORE_AVAILABLE
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-16 flex flex-col items-center gap-6 opacity-30">
                    <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                        <Terminal className="w-3 h-3" />
                        SEC_PROTOCOL: 0xFD43
                    </div>
                </div>
            </div>
        </div>
    )
}

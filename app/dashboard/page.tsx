'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import PYQCard from '@/components/PYQCard'
import {
    BookOpen,
    Download,
    Clock,
    Star,
    TrendingUp,
    LayoutGrid,
    ShieldCheck,
    Activity,
    ChevronRight,
    MapPin,
    Calendar,
    Target
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { usePapers } from '@/hooks/usePapers'
import { useSubjects } from '@/hooks/useSubjects'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/ui/Loading'
import PYQCardSkeleton from '@/components/pyq/PYQCardSkeleton'
import SubjectRowSkeleton from '@/components/pyq/SubjectRowSkeleton'

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const filters = useMemo(() => ({}), [])
    const { papers: recentPYQs, loading: papersLoading } = usePapers(filters, 1)
    const { subjects, loading: subjectsLoading } = useSubjects()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    if (!user && !authLoading) return null

    return (
        <div className="bg-[#FBF9F7] min-h-screen animate-fade-in pb-20">
            {/* Top Security Bar */}
            <div className="bg-[#111827] text-white py-2 overflow-hidden border-b border-[#4338CA]/30">
                <div className="container-main flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            Security_Shield: ACTIVE_V4.2
                        </div>
                        <div className="hidden md:flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                            <Activity className="w-3 h-3 text-[#4338CA]" />
                            LATENCY: 24MS // REGION: IN-SOUTH-1
                        </div>
                    </div>
                    <div className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                        EXTRACTION_TOKEN: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>
            </div>

            <div className="container-main pt-12 lg:pt-20">
                {/* Hero Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 lg:gap-12 pb-12 border-b-2 border-[#111827]">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-3 py-1 bg-[#111827] text-white text-[10px] font-mono font-black uppercase tracking-widest rounded-sm">
                                IDENTITY_VERIFIED
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#111827]/30 uppercase tracking-[0.3em]">
                                UID: {user?.id.slice(0, 8)}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-[#111827] uppercase tracking-tighter mb-4 leading-none">
                            ACADEMIC <br /> STATION.
                        </h1>
                        <p className="text-lg md:text-xl text-[#6B7280] font-medium max-w-2xl">
                            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}. Automated resource extraction
                            terminal for the academic archive.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="p-6 bg-white border border-[#111827] rounded-sm flex flex-col justify-between min-w-[200px]">
                            <span className="text-[9px] font-mono font-black text-[#111827]/40 uppercase tracking-[0.2em] mb-4">EXTRACTION_CAP</span>
                            <div>
                                <div className="text-3xl font-black text-[#111827] mb-1 tabular-nums transition-all">
                                    {authLoading ? '.../100' : `${user?.user_metadata?.extraction_used || 34}/100`}
                                </div>
                                <div className="w-full bg-[#EAE0D5] h-1.5 mt-2 overflow-hidden rounded-full">
                                    <div
                                        className="bg-[#111827] h-full transition-all duration-1000"
                                        style={{ width: `${authLoading ? 0 : (user?.user_metadata?.extraction_used || 34)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-[#4338CA] text-white rounded-sm flex flex-col justify-between min-w-[200px] border border-[#111827]">
                            <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-[0.2em] mb-4">TOTAL_SESSIONS</span>
                            <div>
                                <div className="text-3xl font-black text-white mb-1 tabular-nums">
                                    {authLoading ? '...' : (user?.user_metadata?.total_sessions || 124)}
                                </div>
                                <div className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/60">AVG_VELOCITY: 4.2H</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Panel: Identity & Stats */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Identity Card */}
                        <section>
                            <h3 className="text-[10px] font-mono font-black text-[#111827] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                SESSION_CONTEXT
                            </h3>
                            <Card noHover className="bg-white p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EAE0D5]/30 rounded-bl-full -mr-8 -mt-8 -z-0 transition-transform group-hover:scale-110" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-mono font-black text-[#111827]/30 uppercase tracking-widest text-[#6B7280]">DEPARTMENT_UNIT</span>
                                        <span className="text-sm font-black text-[#111827] uppercase tracking-tighter">
                                            {user?.user_metadata?.department || 'Academic Researcher'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-mono font-black text-[#111827]/30 uppercase tracking-widest">PROGRAM_TYPE</span>
                                            <span className="text-sm font-black text-[#111827] uppercase tracking-tighter">
                                                {user?.user_metadata?.program_type || 'BTech'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                            <span className="text-[9px] font-mono font-black text-[#111827]/30 uppercase tracking-widest">SEMESTER</span>
                                            <span className="text-sm font-black text-[#111827] uppercase tracking-tighter">
                                                {user?.user_metadata?.semester || '1'}_CYCLE
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-[#111827]/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[9px] font-mono font-black text-green-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            ENCRYPTED_AUTH
                                        </div>
                                        <button className="text-[9px] font-mono font-black text-[#4338CA] hover:underline uppercase tracking-widest">
                                            MANAGE_IDENTITY
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Quick Prep Area */}
                        <section>
                            <h3 className="text-[10px] font-mono font-black text-[#111827] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                PREP_VELOCITY
                            </h3>
                            <div className="space-y-4">
                                <div className="p-5 bg-[#EAE0D5] border border-[#111827] group hover:bg-[#111827] transition-all cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[8px] font-mono font-black text-[#111827]/60 group-hover:text-white/60 uppercase tracking-[0.2em]">CURRENT_FOCUS</span>
                                        <ChevronRight className="w-4 h-4 text-[#111827] group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h4 className="font-black text-[#111827] group-hover:text-white uppercase tracking-tighter">DATA STRUCTURES // CS301</h4>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="flex-1 bg-white/50 h-1 rounded-full overflow-hidden">
                                            <div className="bg-[#111827] group-hover:bg-white h-full w-[45%]" />
                                        </div>
                                        <span className="text-[10px] font-mono font-black text-[#111827] group-hover:text-white">45%</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-white border border-[#111827] group hover:bg-[#111827] transition-all cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[8px] font-mono font-black text-[#111827]/30 group-hover:text-white/60 uppercase tracking-[0.2em]">UPNEXT_QUEUE</span>
                                        <ChevronRight className="w-4 h-4 text-[#111827] group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h4 className="font-black text-[#111827] group-hover:text-white uppercase tracking-tighter">OPERATING SYSTEMS // CS401</h4>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Middle Panel: Activity */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Metrics Bar */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: 'EXTRACTED', value: user?.user_metadata?.extracted_count || '34', icon: BookOpen },
                                { label: 'DOWNLOADS', value: user?.user_metadata?.download_count || '12', icon: Download },
                                { label: 'SAVED', value: user?.user_metadata?.saved_count || '08', icon: Star }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <stat.icon className="w-3.5 h-3.5 text-[#111827]/40" />
                                        <span className="text-[9px] font-mono font-black text-[#111827]/30 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <div className="text-4xl font-black text-[#111827] tracking-tighter tabular-nums">
                                        {authLoading ? '...' : stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Extractions */}
                        <section>
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#111827]/10">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-[#4338CA]" />
                                    <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">RECENT EXTRACTION ACTIVITY</h2>
                                </div>
                                <Link href="/explore" className="text-[10px] font-mono font-black text-[#111827] hover:text-[#4338CA] transition-colors uppercase tracking-[0.2em] flex items-center gap-1">
                                    VIEW_ALL_LOGS
                                    <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {papersLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                    {[...Array(4)].map((_, i) => (
                                        <PYQCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                    {recentPYQs.slice(0, 4).map((pyq) => (
                                        <PYQCard key={pyq.id} pyq={pyq} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Subject Repository Access */}
                        <section>
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#111827]/10">
                                <Calendar className="w-5 h-5 text-[#111827]" />
                                <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">SUBJECT ACCESS TERMINAL</h2>
                            </div>
                            {subjectsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(6)].map((_, i) => (
                                        <SubjectRowSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {subjects.slice(0, 6).map((subject) => (
                                        <Link
                                            key={subject.subject_code}
                                            href={`/subject/${subject.subject_code}`}
                                            className="group flex items-center justify-between p-4 bg-white border border-[#111827]/10 hover:border-[#111827] hover:bg-white transition-all rounded-sm cursor-pointer"
                                        >
                                            <div className="flex-1 truncate">
                                                <p className="text-[11px] font-black text-[#111827] uppercase tracking-tight group-hover:text-[#4338CA] transition-colors truncate">
                                                    {getCleanSubjectTitle(subject.subject_code, subject.subject_title)}
                                                </p>
                                                <p className="font-mono text-[9px] text-[#111827]/30 font-bold uppercase tracking-widest mt-0.5">{getNormalizedSubjectCode(subject.subject_code)}</p>
                                            </div>
                                            <div className="ml-4 w-7 h-7 border border-[#111827]/10 flex items-center justify-center bg-[#FBF9F7] group-hover:bg-[#111827] group-hover:text-white transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            <div className="pt-8">
                                <Link href="/explore">
                                    <Button variant="ghost" className="w-full border-[#111827]/10 hover:bg-[#111827] hover:text-white uppercase font-black tracking-widest text-[10px]">
                                        ACCESS_FULL_FACILITY_DIRECTORY
                                    </Button>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

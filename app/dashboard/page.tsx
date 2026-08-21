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
import { useSubjects } from '@/hooks/useSubjects'
import { usePaperContext } from '@/context/PaperContext'
import { getCleanSubjectTitle, getNormalizedSubjectCode, getSubjectSlug } from '@/lib/subject-titles'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loading from '@/components/ui/Loading'
import PYQCardSkeleton from '@/components/pyq/PYQCardSkeleton'
import SubjectRowSkeleton from '@/components/pyq/SubjectRowSkeleton'
import { getUserStats, getRecentActivityPaperIds, getSavedPaperIds, type UserStats } from '@/lib/activity'
import type { PYQ } from '@/lib/queries'

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const { allPapers, loading: papersLoading } = usePaperContext()
    const { subjects, loading: subjectsLoading } = useSubjects()
    const [extractionToken, setExtractionToken] = React.useState('')
    const [mounted, setMounted] = React.useState(false)
    const [stats, setStats] = React.useState<UserStats>({ viewed: 0, downloaded: 0, saved: 0 })
    const [statsLoading, setStatsLoading] = React.useState(true)
    const [recentActivityIds, setRecentActivityIds] = React.useState<string[]>([])
    const [savedIds, setSavedIds] = React.useState<string[]>([])

    useEffect(() => {
        setMounted(true)
        setExtractionToken(Math.random().toString(36).substr(2, 9).toUpperCase())
    }, [])

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (!user) return
        setStatsLoading(true)
        Promise.all([
            getUserStats(user.id),
            getRecentActivityPaperIds(user.id, 4),
            getSavedPaperIds(user.id),
        ]).then(([userStats, activityIds, saved]) => {
            setStats(userStats)
            setRecentActivityIds(activityIds)
            setSavedIds(saved)
            setStatsLoading(false)
        })
    }, [user])

    const recentActivityPapers = useMemo(
        () => recentActivityIds
            .map(id => allPapers.find(p => p.id === id))
            .filter((p): p is PYQ => !!p),
        [recentActivityIds, allPapers]
    )

    const savedPapers = useMemo(
        () => savedIds
            .map(id => allPapers.find(p => p.id === id))
            .filter((p): p is PYQ => !!p)
            .slice(0, 2),
        [savedIds, allPapers]
    )

    if (!user && !authLoading) return null

    return (
        <>
            <div className="bg-[var(--color-surface)] min-h-screen animate-fade-in pb-20">
            {/* Top Security Bar */}
            <div className="bg-[var(--color-border)] text-white py-2 overflow-hidden border-b border-[#4338CA]/30">
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
                        EXTRACTION_TOKEN: {extractionToken || 'INITIALIZING...'}
                    </div>
                </div>
            </div>

            <div className="container-main pt-12 lg:pt-20">
                {/* Hero Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 lg:gap-12 pb-12 border-b-2 border-[var(--color-border)]">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-3 py-1 bg-[var(--color-text)] text-[var(--color-surface)] text-[10px] font-mono font-black uppercase tracking-widest rounded-sm">
                                IDENTITY_VERIFIED
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[var(--color-text)]/30 uppercase tracking-[0.3em]">
                                UID: {user?.id.slice(0, 8)}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-[var(--color-text)] uppercase tracking-tighter mb-4 leading-none">
                            ACADEMIC <br /> STATION.
                        </h1>
                        <p className="text-lg md:text-xl text-[var(--color-muted)] font-medium max-w-2xl">
                            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}. Automated resource extraction
                            terminal for the academic archive.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-sm flex flex-col justify-between min-w-[200px]">
                            <span className="text-[9px] font-mono font-black text-[var(--color-text)]/40 uppercase tracking-[0.2em] mb-4">ARCHIVE_COVERAGE</span>
                            <div>
                                <div className="text-3xl font-black text-[var(--color-text)] mb-1 tabular-nums transition-all">
                                    {statsLoading ? `.../${allPapers.length || '...'}` : `${stats.viewed}/${allPapers.length}`}
                                </div>
                                <div className="w-full bg-[var(--color-surface)] h-1.5 mt-2 overflow-hidden rounded-full border border-[var(--color-border)]/10">
                                    <div
                                        className="bg-[var(--color-text)] h-full transition-all duration-1000"
                                        style={{ width: `${statsLoading || !allPapers.length ? 0 : Math.min(100, (stats.viewed / allPapers.length) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-[#4338CA] text-white rounded-sm flex flex-col justify-between min-w-[200px] border border-[var(--color-border)]">
                            <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-[0.2em] mb-4">TOTAL_ACTIVITY</span>
                            <div>
                                <div className="text-3xl font-black text-white mb-1 tabular-nums">
                                    {statsLoading ? '...' : (stats.viewed + stats.downloaded + stats.saved)}
                                </div>
                                <div className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/60">SAVED: {statsLoading ? '...' : stats.saved}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Panel: Identity & Stats */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Identity Card */}
                        <section>
                            <h3 className="text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                SESSION_CONTEXT
                            </h3>
                            <Card noHover className="bg-[var(--color-card)] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-surface)]/30 rounded-bl-full -mr-8 -mt-8 -z-0 transition-transform group-hover:scale-110" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-mono font-black text-[var(--color-text)]/30 uppercase tracking-widest">DEPARTMENT_UNIT</span>
                                        <span className="text-sm font-black text-[var(--color-text)] uppercase tracking-tighter">
                                            {user?.user_metadata?.department || 'Academic Researcher'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-mono font-black text-[var(--color-text)]/30 uppercase tracking-widest">PROGRAM_TYPE</span>
                                            <span className="text-sm font-black text-[var(--color-text)] uppercase tracking-tighter">
                                                {user?.user_metadata?.program_type || 'BTech'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                            <span className="text-[9px] font-mono font-black text-[var(--color-text)]/30 uppercase tracking-widest">SEMESTER</span>
                                            <span className="text-sm font-black text-[var(--color-text)] uppercase tracking-tighter">
                                                {user?.user_metadata?.semester || '1'}_CYCLE
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-[var(--color-border)]/5 flex items-center justify-between">
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
                            <h3 className="text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                SAVED_FOR_LATER
                            </h3>
                            {statsLoading ? (
                                <div className="space-y-4">
                                    <SubjectRowSkeleton />
                                    <SubjectRowSkeleton />
                                </div>
                            ) : savedPapers.length > 0 ? (
                                <div className="space-y-4">
                                    {savedPapers.map((paper) => (
                                        <Link
                                            key={paper.id}
                                            href={`/subject/${getSubjectSlug(paper.subject_code, paper.subject_title)}`}
                                            className="block p-5 bg-[var(--color-card)] border border-[var(--color-border)] group hover:bg-[var(--color-border)] transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[8px] font-mono font-black text-[var(--color-text)]/30 group-hover:text-[var(--color-card)]/60 uppercase tracking-[0.2em]">
                                                    {getNormalizedSubjectCode(paper.subject_code)}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-[var(--color-text)] group-hover:text-[var(--color-card)] group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <h4 className="font-black text-[var(--color-text)] group-hover:text-[var(--color-card)] uppercase tracking-tighter line-clamp-1">
                                                {paper.paper_title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-5 bg-[var(--color-card)] border border-dashed border-[var(--color-border)]/40 text-center">
                                    <p className="text-xs font-mono text-[var(--color-muted)] uppercase tracking-widest">
                                        No papers saved yet
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Middle Panel: Activity */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Metrics Bar */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: 'EXTRACTED', value: stats.viewed, icon: BookOpen },
                                { label: 'DOWNLOADS', value: stats.downloaded, icon: Download },
                                { label: 'SAVED', value: stats.saved, icon: Star }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <stat.icon className="w-3.5 h-3.5 text-[var(--color-text)]/40" />
                                        <span className="text-[9px] font-mono font-black text-[var(--color-text)]/30 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <div className="text-4xl font-black text-[var(--color-text)] tracking-tighter tabular-nums">
                                        {statsLoading ? '...' : stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Extractions */}
                        <section>
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-border)]/10">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-[#4338CA]" />
                                    <h2 className="text-xl font-black text-[var(--color-text)] uppercase tracking-tighter">RECENT EXTRACTION ACTIVITY</h2>
                                </div>
                                <Link href="/explore" className="text-[10px] font-mono font-black text-[var(--color-text)] hover:text-[#4338CA] transition-colors uppercase tracking-[0.2em] flex items-center gap-1">
                                    VIEW_ALL_LOGS
                                    <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {papersLoading || statsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                    {[...Array(4)].map((_, i) => (
                                        <PYQCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : recentActivityPapers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                    {recentActivityPapers.map((pyq) => (
                                        <PYQCard key={pyq.id} pyq={pyq} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 border border-dashed border-[var(--color-border)]/40 text-center">
                                    <p className="text-sm font-mono text-[var(--color-muted)] uppercase tracking-widest mb-4">
                                        No activity yet
                                    </p>
                                    <Link href="/explore">
                                        <Button variant="secondary" className="text-[10px] font-black uppercase tracking-widest">
                                            EXPLORE_REPOSITORY
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Subject Repository Access */}
                        <section>
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]/10">
                                <Calendar className="w-5 h-5 text-[var(--color-text)]" />
                                <h2 className="text-xl font-black text-[var(--color-text)] uppercase tracking-tighter">SUBJECT ACCESS TERMINAL</h2>
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
                                            className="group flex items-center justify-between p-4 bg-[var(--color-card)] border border-[var(--color-border)]/10 hover:border-[var(--color-border)] hover:bg-[var(--color-card)] transition-all rounded-sm cursor-pointer"
                                        >
                                            <div className="flex-1 truncate">
                                                <p className="text-[11px] font-black text-[var(--color-text)] uppercase tracking-tight group-hover:text-[#4338CA] transition-colors truncate">
                                                    {getCleanSubjectTitle(subject.subject_code, subject.subject_title)}
                                                </p>
                                                <p className="font-mono text-[9px] text-[var(--color-text)]/30 font-bold uppercase tracking-widest mt-0.5">{getNormalizedSubjectCode(subject.subject_code)}</p>
                                            </div>
                                            <div className="ml-4 w-7 h-7 border border-[var(--color-border)]/10 flex items-center justify-center bg-[var(--color-surface)] group-hover:bg-[var(--color-border)] group-hover:text-[var(--color-card)] transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            <div className="pt-8">
                                <Link href="/explore">
                                    <Button variant="ghost" className="w-full border-[var(--color-border)]/10 hover:bg-[var(--color-border)] hover:text-[var(--color-card)] uppercase font-black tracking-widest text-[10px]">
                                        ACCESS_FULL_FACILITY_DIRECTORY
                                    </Button>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

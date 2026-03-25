'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Check, ArrowLeft, BookOpen, Clock, FileText, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PYQCard from '@/components/PYQCard'
import PYQCardSkeleton from '@/components/pyq/PYQCardSkeleton'
import { usePaperContext } from '@/context/PaperContext'
import { useSubjectPapers } from '@/hooks/usePapers'
import { getCleanSubjectTitle, getNormalizedSubjectCode, getSubjectCodeFromSlug } from '@/lib/subject-titles'
import { PYQ } from '@/lib/queries'

interface SubjectClientProps {
    slug: string
}

export default function SubjectClient({ slug }: SubjectClientProps) {
    const subjectCode = getSubjectCodeFromSlug(slug)
    const [activeFilter, setActiveFilter] = useState('ALL')
    const [copied, setCopied] = useState(false)
    const [isValid, setIsValid] = useState<boolean | null>(null)
    const { allPapers, loading: papersLoading } = usePaperContext()
    const { papers, loading: filterLoading, error } = useSubjectPapers(subjectCode, activeFilter === 'ALL' ? undefined : activeFilter)

    // Instant Route Validation using Centralized State
    useEffect(() => {
        if (!papersLoading && allPapers.length > 0) {
            const exists = allPapers.some((p: PYQ) => p.subject_code === subjectCode)
            setIsValid(exists)
        }
    }, [allPapers, papersLoading, subjectCode])

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    if (isValid === false) {
        return (
            <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-10 text-center border-dashed border-[#111827]/20">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Repository Not Found</h2>
                    <p className="text-[#6B7280] mb-8 font-mono text-xs uppercase tracking-widest leading-relaxed">
                        The requested subject identifier "{subjectCode}" does not exist in our industrial archives.
                    </p>
                    <Link href="/explore">
                        <Button className="w-full uppercase font-black tracking-widest">Return to Index</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    // Get subject info from first paper if available
    const subjectInfo = papers.length > 0 ? {
        code: getNormalizedSubjectCode(papers[0].subject_code),
        title: getCleanSubjectTitle(papers[0].subject_code, papers[0].subject_title),
    } : {
        code: getNormalizedSubjectCode(subjectCode),
        title: getCleanSubjectTitle(subjectCode, 'Subject Archive'),
    }

    const filters = ['ALL', 'CAT-1', 'CAT-2', 'FAT', 'OTHER']

    return (
        <div className="bg-[var(--color-surface)] min-h-screen">
            <div className="container-main py-8 md:py-12 lg:py-20">
                {/* Navigation */}
                <div className="mb-10">
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-3 text-xs font-mono font-bold text-[#6B7280] hover:text-[#111827] uppercase tracking-[0.2em] transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Repository
                    </Link>
                </div>

                {/* Subject Industrial Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
                    <Card noHover className="lg:col-span-2 p-6 md:p-8 bg-[var(--color-card)] border-[var(--color-border)] shadow-[var(--shadow-offset)_var(--shadow-offset)_0px_var(--color-border)]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-sm border-2 border-[var(--color-border)] bg-[#D4C9BC] flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-8 h-8 text-[#111827]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-mono font-bold text-[#4338CA] uppercase tracking-[0.3em] mb-1">
                                        {subjectInfo.code}
                                    </span>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#111827] uppercase tracking-tighter leading-[0.85]">
                                        {subjectInfo.title}
                                    </h1>
                                </div>
                            </div>
                            <button
                                onClick={handleShare}
                                className="icon-3d w-12 h-12 bg-white hover:bg-[#111827] hover:text-white transition-colors duration-150 flex-shrink-0"
                                title="Share Repository"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Filter Bar Inside Header */}
                        <div className="flex flex-wrap gap-2 pt-8 border-t border-[var(--color-border)]/5">
                            {filters.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveFilter(category)}
                                    className={cn(
                                        "px-4 py-1.5 text-[10px] font-mono font-black uppercase tracking-widest border transition-all",
                                        activeFilter === category
                                            ? "bg-[#111827] text-white border-[#111827]"
                                            : "bg-transparent text-[#6B7280] border-[#111827]/10 hover:border-[#111827] hover:text-[#111827]"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card noHover className="p-6 md:p-10 bg-[#111827] text-white flex flex-col justify-between shadow-[var(--shadow-offset)_var(--shadow-offset)_0px_var(--color-border)]">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-mono font-bold text-[#A3A3A3] uppercase tracking-widest">Archive Statistics</span>
                            <FileText className="w-5 h-5 text-[#4338CA]" />
                        </div>
                        <div>
                            <div className="text-6xl font-black uppercase tracking-tighter leading-none mb-1">
                                {filterLoading ? '...' : papers.length}
                            </div>
                            <p className="text-sm font-mono font-bold text-[#A3A3A3] uppercase tracking-widest">
                                Documents Available
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-3 text-xs font-mono text-[#6B7280]">
                            <Clock className="w-4 h-4" />
                            <span>LAST_SYNC: ACTIVE</span>
                        </div>
                    </Card>
                </div>

                {/* Section Title */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--color-border)]">
                    <h2 className="text-2xl font-black text-[var(--color-text)] uppercase tracking-tighter">THE QUESTION ARCHIVE.</h2>
                    <p className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest hidden sm:block">
                        {filterLoading ? 'STATUS: SYNCHRONIZING...' : `${papers.length} IDENTIFIED DOCUMENTS`}
                    </p>
                </div>

                {/* Grid */}
                {filterLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[...Array(6)].map((_, i) => (
                            <PYQCardSkeleton key={i} />
                        ))}
                    </div>
                ) : papers.length === 0 ? (
                    <Card className="py-32 text-center border-dashed border-[#111827]/30 bg-transparent">
                        <p className="text-lg font-bold text-[#6B7280] uppercase tracking-widest">NO DOCUMENTS MATCHING "{activeFilter}" IN THIS REPOSITORY</p>
                        <Button variant="ghost" className="mt-4 uppercase text-[10px] font-black tracking-widest" onClick={() => setActiveFilter('ALL')}>RESET_FILTERS</Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {papers.map((pyq) => (
                            <PYQCard key={pyq.id} pyq={pyq} />
                        ))}
                    </div>
                )}

                {/* Related CTA */}
                <div className="mt-32">
                    <Card noHover className="bg-white p-12 flex flex-col md:flex-row items-center justify-between gap-10 border-2 border-[#111827] shadow-[var(--shadow-offset)_var(--shadow-offset)_0px_var(--color-border)]">
                        <div className="max-w-xl">
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">Can&apos;t find a specific paper?</h3>
                            <p className="text-[#6B7280] text-lg">Help us expand the industrial archive by contributing your own question papers.</p>
                        </div>
                        <Link href="/dashboard">
                            <Button size="lg" className="px-10 font-black uppercase tracking-widest">
                                UPLOAD TO ARCHIVE
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    )
}

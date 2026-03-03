'use client'

import PYQCard from '@/components/PYQCard'
import { ArrowLeft, BookOpen, Clock, FileText, Share2 } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useSubjectPapers } from '@/hooks/usePapers'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'

interface SubjectClientProps {
    slug: string
}

export default function SubjectClient({ slug }: SubjectClientProps) {
    const [activeFilter, setActiveFilter] = useState('ALL')
    const { papers, loading, error } = useSubjectPapers(slug, activeFilter === 'ALL' ? undefined : activeFilter)

    if (error) {
        return (
            <div className="container-main py-20 text-center">
                <h1 className="text-2xl font-black uppercase">Archive Connection Failure</h1>
                <p className="text-[#6B7280] mt-4">Unable to retrieve documents from the repository.</p>
                <Button onClick={() => window.location.reload()} className="mt-8">RETRY_CONNECTION</Button>
            </div>
        )
    }

    // Get subject info from first paper if available
    const subjectInfo = papers.length > 0 ? {
        code: getNormalizedSubjectCode(papers[0].subject_code),
        title: getCleanSubjectTitle(papers[0].subject_code, papers[0].subject_title),
    } : {
        code: getNormalizedSubjectCode(slug),
        title: getCleanSubjectTitle(slug, 'Subject Archive'),
    }

    const filters = ['ALL', 'CAT-1', 'CAT-2', 'FAT', 'OTHER']

    return (
        <div className="bg-[#EAE0D5] min-h-screen animate-fade-in">
            <div className="container-main py-12 lg:py-20">
                {/* Navigation */}
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6B7280] hover:text-[#111827] transition-all mb-12 uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Repository
                </Link>

                {/* Subject Industrial Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    <Card noHover className="lg:col-span-2 p-10 bg-white">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 rounded-sm border border-[#111827] bg-[#EAE0D5] flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_#111827]">
                                    <BookOpen className="w-8 h-8 text-[#111827]" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-mono text-xs font-black text-[#4338CA] mb-2 uppercase tracking-[0.2em]">{subjectInfo.code}</p>
                                        <h1 className="text-3xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter mb-4 leading-none break-words max-w-full">
                                            {subjectInfo.title}
                                        </h1>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {filters.map(filter => (
                                            <button
                                                key={filter}
                                                onClick={() => setActiveFilter(filter)}
                                                className={cn(
                                                    "px-4 py-1.5 text-[10px] font-mono font-black uppercase tracking-widest border transition-all",
                                                    activeFilter === filter
                                                        ? "bg-[#111827] text-white border-[#111827]"
                                                        : "bg-white text-[#6B7280] border-[#111827]/10 hover:border-[#111827]"
                                                )}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="secondary" size="sm" className="p-3">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card noHover className="p-10 bg-[#111827] text-white flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-mono font-bold text-[#A3A3A3] uppercase tracking-widest">Archive Statistics</span>
                            <FileText className="w-5 h-5 text-[#4338CA]" />
                        </div>
                        <div>
                            <div className="text-6xl font-black uppercase tracking-tighter leading-none mb-1">
                                {loading ? '...' : papers.length}
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
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#111827]">
                    <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter">THE QUESTION ARCHIVE.</h2>
                    <p className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest hidden sm:block">
                        {loading ? 'STATUS: SYNCHRONIZING...' : `${papers.length} IDENTIFIED DOCUMENTS`}
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <Loading className="py-32" />
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
                    <Card noHover className="bg-white p-12 flex flex-col md:flex-row items-center justify-between gap-10 border-2 border-[#111827]">
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

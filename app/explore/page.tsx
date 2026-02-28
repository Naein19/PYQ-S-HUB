'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PYQCard from '@/components/PYQCard'
import SearchBar from '@/components/SearchBar'
import FilterDropdown from '@/components/ui/FilterDropdown'
import { Trash2, LayoutGrid, List, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { usePapers } from '@/hooks/usePapers'
import { useSubjects } from '@/hooks/useSubjects'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'

export interface FilterState {
    subject_code: string
    exam_type: string
    search_term: string
    year?: string
    department?: string
    semester?: string
}

const examCategories = [
    { label: 'CAT-1', value: 'CAT-1' },
    { label: 'CAT-2', value: 'CAT-2' },
    { label: 'FAT', value: 'FAT' },
    { label: 'OTHER', value: 'OTHER' },
]

const defaultFilters: FilterState = {
    subject_code: '',
    exam_type: '',
    search_term: '',
}

function ExploreContent() {
    const searchParams = useSearchParams()

    // Initialize state from URL params if present
    const [filters, setFilters] = useState<FilterState>(() => ({
        subject_code: searchParams?.get('subject_code') || '',
        exam_type: searchParams?.get('exam_type') || '',
        search_term: searchParams?.get('search') || '',
    }))

    const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search_term)

    // Sync with searchParams if they change
    useEffect(() => {
        const examType = searchParams?.get('exam_type')
        const subjectCode = searchParams?.get('subject_code')
        if (examType || subjectCode) {
            setFilters(prev => ({
                ...prev,
                exam_type: examType || prev.exam_type,
                subject_code: subjectCode || prev.subject_code
            }))
        }
    }, [searchParams])

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters(prev => ({ ...prev, search_term: debouncedSearch }))
        }, 300)
        return () => clearTimeout(handler)
    }, [debouncedSearch])

    const { subjects } = useSubjects()
    const { papers, loading, loadingMore, hasMore, totalCount, loadMore } = usePapers(filters)

    const subjectOptions = subjects.map(s => ({
        label: `${getNormalizedSubjectCode(s.subject_code)} - ${getCleanSubjectTitle(s.subject_code, s.subject_title)}`,
        value: s.subject_code
    }))

    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const activeFilterCount = Object.values(filters).filter(Boolean).length

    return (
        <div className="bg-[#FBF9F7] min-h-screen animate-fade-in pb-20">
            <div className="container-main py-10 lg:py-24">
                {/* Page Header - Cinematic Industrial Vault */}
                <div className="relative mb-16 lg:mb-24 p-10 lg:p-20 overflow-hidden bg-[#0A0A0A] border-2 border-[#111827] shadow-[8px_8px_0px_#111827]">
                    {/* Background Illustration */}
                    <div className="absolute inset-0 z-0 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <img
                            src="/assets/explore_vault.png"
                            alt="Central Vault"
                            className="w-full h-full object-cover opacity-60 brightness-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/40" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/20" />
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-white/20 bg-white/5 backdrop-blur-md mb-8 lg:mb-12 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#4338CA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />
                            CENTRAL_ARCHIVE_EXPLORER_v2.1
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                            <div>
                                <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.85]">
                                    EXPLORE <br />
                                    <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>REPOSITORY.</span>
                                </h1>
                                <p className="text-lg md:text-2xl text-[#A3A3A3] max-w-2xl font-medium leading-relaxed">
                                    Primary resource extraction interface for collegiate technical archives.
                                    Filtering protocol established and ready for synchronization.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="hidden sm:flex border border-white/10 rounded-sm overflow-hidden bg-white/5 backdrop-blur-md p-1">
                                    <button
                                        onClick={() => setViewType('grid')}
                                        className={cn("p-4 rounded-sm transition-all", viewType === 'grid' ? "bg-white text-[#111827]" : "text-white/40 hover:text-white")}
                                    >
                                        <LayoutGrid className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setViewType('list')}
                                        className={cn("p-4 rounded-sm transition-all", viewType === 'list' ? "bg-white text-[#111827]" : "text-white/40 hover:text-white")}
                                    >
                                        <List className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="mb-10 lg:mb-16 space-y-6 lg:space-y-8">
                    <div className="relative group">
                        <SearchBar
                            className="w-full"
                            placeholder="Identify subject code or document name..."
                            onSearch={setDebouncedSearch}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FilterDropdown
                            label="Subject"
                            options={subjectOptions}
                            value={filters.subject_code}
                            onChange={(val: string) => updateFilter('subject_code', val)}
                        />
                        <FilterDropdown
                            label="Tier"
                            options={examCategories}
                            value={filters.exam_type}
                            onChange={(val: string) => updateFilter('exam_type', val)}
                        />
                        <div className="hidden lg:block" /> {/* Spacer */}
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setFilters(defaultFilters)
                                setDebouncedSearch('')
                            }}
                            className={cn(
                                "uppercase font-black text-[10px] tracking-widest py-3",
                                activeFilterCount === 0 && "opacity-50 pointer-events-none"
                            )}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            RES_PARAMS
                        </Button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-8 lg:space-y-10">
                    <div className="flex items-center justify-between pb-4 lg:pb-6 border-b border-[#111827]/10">
                        <p className="text-[10px] font-mono font-black text-[#6B7280] uppercase tracking-[0.2em]">
                            REVISION_RESULTS: {loading ? '...' : totalCount} DOCUMENTS_IDENTIFIED
                        </p>
                        <div className="hidden sm:flex gap-6">
                            <span className="text-[8px] font-mono text-[#111827]/30 uppercase tracking-[0.3em] font-bold">STATUS: {loading ? 'FETCHING' : 'ARCHIVE_LIVE'}</span>
                            <span className="text-[8px] font-mono text-[#111827]/30 uppercase tracking-[0.3em] font-bold">LATENCY: ACTIVE</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 animate-spin text-[#111827]" />
                            <p className="mt-4 font-mono text-xs uppercase tracking-widest font-black">Synchronizing with central archive...</p>
                        </div>
                    ) : papers.length === 0 ? (
                        <div className="py-20 lg:py-32 flex flex-col items-center justify-center border-2 border-dashed border-[#111827]/10 rounded-sm bg-black/5 animate-pulse">
                            <h3 className="text-lg lg:text-xl font-black text-[#111827] uppercase tracking-tighter mb-4">NO MATCHING ARCHIVE DATA</h3>
                            <p className="text-xs lg:text-sm font-bold text-[#6B7280] uppercase tracking-widest mb-8 text-center px-6">The combination of parameters yielded null results from the central server.</p>
                            <Button onClick={() => { setFilters(defaultFilters); setDebouncedSearch(''); }} className="uppercase font-black text-xs">RE-INITIALIZE_SEARCH</Button>
                        </div>
                    ) : (
                        <>
                            <div className={cn(
                                "grid gap-6 lg:gap-10",
                                viewType === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                            )}>
                                {papers.map((pyq) => (
                                    <PYQCard key={pyq.id} pyq={pyq} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="flex justify-center pt-10">
                                    <Button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="px-10 py-4 uppercase font-black tracking-widest"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                LOADING_BLOCKS...
                                            </>
                                        ) : (
                                            'LOAD_NEXT_BLOCK'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ExplorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FBF9F7]">
                <Loader2 className="w-12 h-12 animate-spin text-[#111827]" />
            </div>
        }>
            <ExploreContent />
        </Suspense>
    )
}

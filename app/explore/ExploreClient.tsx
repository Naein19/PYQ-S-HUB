'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PYQCard from '@/components/PYQCard'
import SearchBar from '@/components/SearchBar'
import FilterDropdown from '@/components/ui/FilterDropdown'
import { Trash2, LayoutGrid, List, X } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
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

export default function ExploreClient() {
    const searchParams = useSearchParams()

    // Initialize state from URL params if present
    const [filters, setFilters] = useState<FilterState>(() => ({
        subject_code: searchParams?.get('subject_code') || '',
        exam_type: searchParams?.get('exam_type') || '',
        search_term: searchParams?.get('search') || '',
    }))

    const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
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
                    <div className="absolute inset-0 z-0 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <img
                            src="/assets/explore_vault.png"
                            alt="Central Vault Archive for VIT-AP exam papers"
                            className="w-full h-full object-cover opacity-80 brightness-100"
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-[#0A0A0A]/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/30" />
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
                            suggestions={subjects.map(s => ({
                                label: s.subject_code,
                                value: s.subject_code,
                                sublabel: getCleanSubjectTitle(s.subject_code, s.subject_title)
                            }))}
                            onSearch={setDebouncedSearch}
                        />
                    </div>

                    <div className="hidden lg:grid grid-cols-4 gap-4">
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
                        <div />
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

                    <Drawer
                        isOpen={isFilterDrawerOpen}
                        onClose={() => setIsFilterDrawerOpen(false)}
                        title="Archive Filters"
                    >
                        <div className="space-y-8">
                            <FilterDropdown
                                label="Subject Repository"
                                options={subjectOptions}
                                value={filters.subject_code}
                                onChange={(val: string) => updateFilter('subject_code', val)}
                            />
                            <FilterDropdown
                                label="Examination Tier"
                                options={examCategories}
                                value={filters.exam_type}
                                onChange={(val: string) => updateFilter('exam_type', val)}
                            />
                            <div className="flex flex-col gap-4 pt-4">
                                <Button
                                    variant="primary"
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="w-full py-4 uppercase font-black tracking-widest text-[10px]"
                                >
                                    APPLY_PARAMETERS
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setFilters(defaultFilters)
                                        setDebouncedSearch('')
                                        setIsFilterDrawerOpen(false)
                                    }}
                                    className="w-full py-4 uppercase font-black tracking-widest text-[10px] opacity-60"
                                >
                                    RESET_ALL
                                </Button>
                            </div>
                        </div>
                    </Drawer>
                </div>

                {/* Results Section */}
                <div className="space-y-8 lg:space-y-10">
                    <div className="flex flex-col gap-6 pb-4 lg:pb-6 border-b border-[#111827]/10">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-mono font-black text-[#6B7280] uppercase tracking-[0.2em]">
                                REVISION_RESULTS: {loading ? '...' : totalCount} DOCUMENTS_IDENTIFIED
                            </p>
                            <div className="hidden sm:flex gap-6">
                                <span className="text-[8px] font-mono text-[#111827]/30 uppercase tracking-[0.3em] font-bold">STATUS: {loading ? 'FETCHING' : 'ARCHIVE_LIVE'}</span>
                                <span className="text-[8px] font-mono text-[#111827]/30 uppercase tracking-[0.3em] font-bold">LATENCY: ACTIVE</span>
                            </div>
                        </div>

                        {/* Active Filter Pills (Desktop & Mobile) */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                {filters.subject_code && (
                                    <button
                                        onClick={() => updateFilter('subject_code', '')}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827] text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-red-600 transition-colors group"
                                    >
                                        <span>SUBJECT: {filters.subject_code}</span>
                                        <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                                    </button>
                                )}
                                {filters.exam_type && (
                                    <button
                                        onClick={() => updateFilter('exam_type', '')}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4338CA] text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-red-600 transition-colors group"
                                    >
                                        <span>TIER: {filters.exam_type}</span>
                                        <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                                    </button>
                                )}
                                {filters.search_term && (
                                    <button
                                        onClick={() => setDebouncedSearch('')}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111827]/10 text-[#111827] text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-red-600 hover:text-white transition-colors group"
                                    >
                                        <span>QUERY: {filters.search_term}</span>
                                        <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                                    </button>
                                )}
                                <button
                                    onClick={() => { setFilters(defaultFilters); setDebouncedSearch(''); }}
                                    className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest hover:text-[#111827] underline underline-offset-4 ml-2"
                                >
                                    CLEAR_ALL
                                </button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <Loading className="py-20" text="Synchronizing with central archive..." />
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
                                                <Loading size="sm" className="mr-2" />
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

            {/* Sticky Mobile Filter FAB */}
            <div className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-10 duration-500">
                <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center gap-3 bg-[#111827] text-white px-8 py-4 rounded-full border-2 border-[#111827] shadow-[6px_6px_0px_rgba(17,24,39,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">REFINE_ARCHIVE</span>
                    {activeFilterCount > 0 && (
                        <span className="w-5 h-5 flex items-center justify-center bg-[#4338CA] rounded-full text-[9px] font-black">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}

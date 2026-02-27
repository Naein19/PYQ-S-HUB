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
import { getCleanSubjectTitle } from '@/lib/subject-titles'

export interface FilterState {
    subject_code: string
    exam_type: string
    search_term: string
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
        label: `${s.subject_code} - ${getCleanSubjectTitle(s.subject_code, s.subject_title)}`,
        value: s.subject_code
    }))

    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const activeFilterCount = Object.values(filters).filter(Boolean).length

    return (
        <div className="bg-[#FBF9F7] min-h-screen animate-fade-in pb-20">
            <div className="container-main py-10 lg:py-24">
                {/* Page Header */}
                <div className="mb-10 lg:mb-16 border-b-2 border-[#111827] pb-8 lg:pb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#111827] bg-[#EAE0D5] mb-6 lg:mb-8 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#111827]">
                        Industrial Archive Explorer
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 lg:gap-8">
                        <div>
                            <h1 className="text-4xl md:text-7xl font-black text-[#111827] uppercase tracking-tighter mb-3 leading-[0.9]">
                                EXPLORE <br />REPOSITORY.
                            </h1>
                            <p className="text-base md:text-xl text-[#6B7280] max-w-2xl font-medium">
                                Technical extraction interface for collegiate historical papers.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="hidden sm:flex border border-[#111827] rounded-sm overflow-hidden bg-white">
                                <button
                                    onClick={() => setViewType('grid')}
                                    className={cn("p-3 transition-colors", viewType === 'grid' ? "bg-[#111827] text-white" : "bg-white text-[#111827] hover:bg-black/5")}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewType('list')}
                                    className={cn("p-3 transition-colors", viewType === 'list' ? "bg-[#111827] text-white" : "bg-white text-[#111827] hover:bg-black/5")}
                                >
                                    <List className="w-5 h-5" />
                                </button>
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

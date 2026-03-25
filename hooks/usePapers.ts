import { useState, useEffect, useCallback, useMemo } from 'react';
import { PYQ } from '@/lib/queries';
import { getSubjectCodeFromSlug, getNormalizedSubjectCode } from '@/lib/subject-titles';
import { usePaperContext } from '@/context/PaperContext';

const PAGE_SIZE = 20;

/**
 * usePapers: High-performance hook for listing academic papers.
 * Consumes the centralized PaperContext to prevent redundant fetching.
 */
export function usePapers(filters: {
    subject_code?: string;
    exam_type?: string;
    search_term?: string;
}, initialPage: number = 1, options?: { disablePagination?: boolean }) {
    const { allPapers, loading, error } = usePaperContext();
    const [page, setPage] = useState(initialPage);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(filters.search_term || '');

    // 1. Debounce Search Term (Performance: 300ms delay)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(filters.search_term || '');
        }, 300);
        return () => clearTimeout(handler);
    }, [filters.search_term]);

    // 2. Local Filtering (High Efficiency: useMemo)
    const filteredPapers = useMemo(() => {
        if (!allPapers.length) return [];

        return allPapers.filter(paper => {
            // A. Subject Filter
            if (filters.subject_code && filters.subject_code !== 'ALL') {
                const searchCode = getNormalizedSubjectCode(
                    filters.subject_code.includes('-')
                        ? getSubjectCodeFromSlug(filters.subject_code)
                        : filters.subject_code
                );

                if (getNormalizedSubjectCode(paper.subject_code) !== searchCode) return false;
            }

            // B. Exam Type Filter
            if (filters.exam_type && filters.exam_type !== 'ALL') {
                if (paper.exam_type !== filters.exam_type) return false;
            }

            // C. Search Term Filter (Case Insensitive)
            if (debouncedSearchTerm) {
                const search = debouncedSearchTerm.toLowerCase();
                return (
                    paper.subject_code.toLowerCase().includes(search) ||
                    paper.subject_title.toLowerCase().includes(search) ||
                    paper.paper_title.toLowerCase().includes(search)
                );
            }

            return true;
        });
    }, [allPapers, filters.subject_code, filters.exam_type, debouncedSearchTerm]);

    // 3. Local Pagination logic
    const papers = useMemo(() => {
        if (options?.disablePagination) return filteredPapers;
        return filteredPapers.slice(0, page * PAGE_SIZE);
    }, [filteredPapers, page, options?.disablePagination]);

    const hasMore = !options?.disablePagination && papers.length < filteredPapers.length;
    const totalCount = filteredPapers.length;

    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;
        setPage(prev => prev + 1);
    }, [loading, hasMore]);

    // Reset pagination when filters change to ensure consistent UX
    useEffect(() => {
        if (!options?.disablePagination) {
            setPage(1);
        }
    }, [filters.subject_code, filters.exam_type, debouncedSearchTerm, options?.disablePagination]);

    return {
        papers,
        loading,
        loadingMore: false, // Local pagination is near-instant
        error,
        hasMore,
        totalCount,
        loadMore
    };
}

/**
 * useSubjectPapers: Specialized version of usePapers for subject-specific views.
 * Bypasses pagination to load all documents by default.
 */
export function useSubjectPapers(subjectCode: string, examType?: string) {
    const filters = useMemo(() => ({
        subject_code: subjectCode,
        exam_type: examType
    }), [subjectCode, examType]);

    const { papers, loading, error } = usePapers(filters, 1, { disablePagination: true });
    return { papers, loading, error };
}

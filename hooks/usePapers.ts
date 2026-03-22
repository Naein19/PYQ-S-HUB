import { useState, useEffect, useCallback, useMemo } from 'react';
import { PYQ } from '@/lib/queries';
import { cachedFetch } from '@/lib/data-fetcher';
import { getSubjectCodeFromSlug } from '@/lib/subject-titles';

const PAGE_SIZE = 20;

export function usePapers(filters: {
    subject_code?: string;
    exam_type?: string;
    search_term?: string;
}, initialPage: number = 1) {
    const [allPapers, setAllPapers] = useState<PYQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(initialPage);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(filters.search_term || '');

    // 1. Fetch ALL papers once (cached)
    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true);
                const data = await cachedFetch<PYQ[]>(
                    '/data/papers.json',
                    'pyqs_all_papers'
                );
                setAllPapers(data);
            } catch (err: any) {
                console.error('Error fetching papers:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    // 2. Debounce Search Term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(filters.search_term || '');
        }, 300); // 300ms debounce
        return () => clearTimeout(handler);
    }, [filters.search_term]);

    // 3. Apply Filtering Locally
    const filteredPapers = useMemo(() => {
        if (!allPapers.length) return [];

        return allPapers.filter(paper => {
            // Subject Filter
            if (filters.subject_code && filters.subject_code !== 'ALL') {
                const searchCode = filters.subject_code.includes('-')
                    ? getSubjectCodeFromSlug(filters.subject_code)
                    : filters.subject_code;

                if (paper.subject_code !== searchCode) return false;
            }

            // Exam Type Filter
            if (filters.exam_type && filters.exam_type !== 'ALL') {
                if (paper.exam_type !== filters.exam_type) return false;
            }

            // Search Term Filter
            if (debouncedSearchTerm) {
                const search = debouncedSearchTerm.toLowerCase();
                const matches =
                    paper.subject_code.toLowerCase().includes(search) ||
                    paper.subject_title.toLowerCase().includes(search) ||
                    paper.paper_title.toLowerCase().includes(search);

                if (!matches) return false;
            }

            return true;
        });
    }, [allPapers, filters.subject_code, filters.exam_type, debouncedSearchTerm]);

    // 4. Apply Pagination Locally
    const papers = useMemo(() => {
        return filteredPapers.slice(0, page * PAGE_SIZE);
    }, [filteredPapers, page]);

    const hasMore = papers.length < filteredPapers.length;
    const totalCount = filteredPapers.length;

    const loadMore = useCallback(() => {
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    }, [hasMore]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [filters.subject_code, filters.exam_type, debouncedSearchTerm]);

    return {
        papers,
        loading,
        loadingMore: false, // Local pagination is instant
        error,
        hasMore,
        totalCount,
        loadMore
    };
}

export function useSubjectPapers(subjectCode: string, examType?: string) {
    const filters = useMemo(() => ({
        subject_code: subjectCode,
        exam_type: examType
    }), [subjectCode, examType]);

    const { papers, loading, error } = usePapers(filters);

    return { papers, loading, error };
}

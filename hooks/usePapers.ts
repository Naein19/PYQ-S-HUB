import { useState, useEffect, useCallback } from 'react';
import { getPaginatedPapers, PYQ, getPapersBySubject } from '@/lib/queries';

export function usePapers(filters: {
    subject_code?: string;
    exam_type?: string;
    search_term?: string;
}, initialPage: number = 1) {
    const [papers, setPapers] = useState<PYQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const fetchPapers = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const result = await getPaginatedPapers(filters, pageNum);

            if (isLoadMore) {
                setPapers(prev => [...prev, ...result.data]);
            } else {
                setPapers(result.data);
            }

            setHasMore(result.hasMore);
            setTotalCount(result.count);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters]);

    useEffect(() => {
        setPage(1);
        fetchPapers(1, false);
    }, [JSON.stringify(filters), fetchPapers]);

    const loadMore = useCallback(() => {
        if (hasMore && !loadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPapers(nextPage, true);
        }
    }, [hasMore, loadingMore, page, fetchPapers]);

    return { papers, loading, loadingMore, error, hasMore, totalCount, loadMore };
}

/**
 * Simpler hook for subject-specific page without complex pagination required initially
 * (or if we want to follow the same pattern as above but dedicated)
 */
export function useSubjectPapers(subjectCode: string, examType?: string) {
    const [papers, setPapers] = useState<PYQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetch() {
            if (!subjectCode) return;
            try {
                setLoading(true);
                const data = await getPapersBySubject(subjectCode, examType);
                setPapers(data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, [subjectCode, examType]);

    return { papers, loading, error };
}

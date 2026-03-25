'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PYQ } from '@/lib/queries';
import { cachedFetch } from '@/lib/data-fetcher';
import { supabase } from '@/lib/supabase';
import { CacheManager } from '@/lib/cache';

interface PaperContextType {
    allPapers: PYQ[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

// Internal Cache for valid IDs to prevent repeated heavy Supabase calls (5-minute TTL)
let validIdsCache: Set<string> | null = null;
let lastIdFetch = 0;
const ID_CACHE_TTL = 5 * 60 * 1000;

/**
 * PaperProvider: The single source of truth for the academic archive.
 * Centrally manages fetching, merging, and real-time synchronization.
 */
export function PaperProvider({ children }: { children: React.ReactNode }) {
    const [allPapers, setAllPapers] = useState<PYQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const now = Date.now();
            let validIdSet = validIdsCache;

            // 1. Fetch Valid IDs (with 5-min internal cache + Request Deduplication)
            if (!validIdSet || now - lastIdFetch > ID_CACHE_TTL) {
                const idData = await CacheManager.deduplicate('supabase_valid_ids', async () => {
                    const { data, error: idError } = await supabase.from('pyqs').select('id');
                    if (idError) throw idError;
                    return data;
                });

                if (idData) {
                    validIdSet = new Set(idData.map((i: { id: string }) => i.id));
                    validIdsCache = validIdSet;
                    lastIdFetch = now;
                }
            }

            // 2. Fetch Static Data (L1/L2 Cached via data-fetcher)
            const staticData = await cachedFetch<PYQ[]>(
                '/data/papers.json',
                'papers',
                24 * 60 * 60 * 1000 // 24h TTL
            );

            // 3. Filter Static Data against Live IDs (Defensive Strategy)
            const filteredStatic = validIdSet
                ? staticData.filter(p => validIdSet!.has(p.id))
                : staticData;

            // 4. Fetch Recent Live Ingestions (Last 50 + Request Deduplication)
            const liveData = await CacheManager.deduplicate('supabase_recent_live', async () => {
                const { data, error: liveError } = await supabase
                    .from('pyqs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(200);
                if (liveError) throw liveError;
                return data;
            });

            // 5. Merge, Deduplicate, and Sort (Newest First)
            const merged = [...(liveData || []), ...filteredStatic];
            const uniquePapers = Array.from(
                new Map(merged.map(item => [item.id, item])).values()
            );

            uniquePapers.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
            });

            setAllPapers(uniquePapers);
        } catch (err: any) {
            console.error('[PaperContext] Global fetch error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        // Real-time synchronization for deletions (Global Event Bus)
        const handleGlobalDelete = (e: any) => {
            const id = e.detail?.id;
            if (id) {
                setAllPapers(prev => prev.filter(p => p.id !== id));
                if (validIdsCache) validIdsCache.delete(id);
            }
        };

        window.addEventListener('pyq-deleted', handleGlobalDelete as any);
        return () => window.removeEventListener('pyq-deleted', handleGlobalDelete as any);
    }, [fetchData]);

    const value = useMemo(() => ({
        allPapers,
        loading,
        error,
        refresh: fetchData
    }), [allPapers, loading, error, fetchData]);

    return <PaperContext.Provider value={value}>{children}</PaperContext.Provider>;
}

export const usePaperContext = () => {
    const context = useContext(PaperContext);
    if (!context) throw new Error('usePaperContext must be used within a PaperProvider');
    return context;
};

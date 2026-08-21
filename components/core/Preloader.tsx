'use client';

import { useEffect } from 'react';
import { getSubjects, getNotices } from '@/lib/queries';
import { CacheManager } from '@/lib/cache';

/**
 * RootPreloader: Aggressively primes the L1/L2 cache on app load.
 * Ensures that all subsequent navigations and searches are 100% local.
 */
export default function RootPreloader() {
    useEffect(() => {
        const preloadData = async () => {
            try {
                // 1. Preload Subjects
                const subjectsPromise = getSubjects();

                // 2. Preload Papers
                const papersPromise = CacheManager.fetch(
                    '/data/papers.json',
                    'papers'
                );

                // 3. Preload Notices
                const noticesPromise = getNotices();

                // Wait for all to finish
                await Promise.all([subjectsPromise, papersPromise, noticesPromise]);
            } catch (error) {
                console.error('[Preloader] Failed to prime cache:', error);
            }
        };

        preloadData();
    }, []);

    return null; // Invisible component
}

import { useState, useEffect } from 'react';
import { Subject } from '@/lib/queries';
import { cachedFetch } from '@/lib/data-fetcher';

export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchSubjects() {
            try {
                setLoading(true);
                // Fetch from static JSON with 24h cache
                const data = await cachedFetch<Subject[]>(
                    '/data/subjects.json',
                    'pyqs_subjects'
                );
                setSubjects(data);
            } catch (err: any) {
                console.error('Error fetching subjects:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchSubjects();
    }, []);

    return { subjects, loading, error };
}

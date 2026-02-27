import { useState, useEffect } from 'react';
import { getSubjects, Subject } from '@/lib/queries';

export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchSubjects() {
            try {
                setLoading(true);
                const data = await getSubjects();
                setSubjects(data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchSubjects();
    }, []);

    return { subjects, loading, error };
}

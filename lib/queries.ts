import { CacheManager } from '@/lib/cache';
import { supabase } from '@/lib/supabase';

export interface PYQ {
    id: string;
    subject_code: string;
    subject_title: string;
    exam_type: string;
    paper_title: string;
    file_path: string;
    file_url: string;
    mime_type: string;
    created_at: string;
}

export interface Subject {
    subject_code: string;
    subject_title: string;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    type: 'all' | 'signed-in';
    created_at: string;
}

/**
 * Fetch distinct subjects from static JSON with L1/L2 caching
 */
export async function getSubjects(): Promise<Subject[]> {
    return CacheManager.fetch<Subject[]>(
        '/data/subjects.json',
        'subjects',
        24 * 60 * 60 * 1000 // 24h TTL
    );
}

/**
 * Fetch all notices from static JSON
 */
export async function getNotices(): Promise<Notice[]> {
    return CacheManager.fetch<Notice[]>(
        '/data/notices.json',
        'notices',
        24 * 60 * 60 * 1000
    );
}

/**
 * Fetch papers for a specific subject (Filtered locally from static JSON)
 */
export async function getPapersBySubject(subject_code: string, exam_type?: string): Promise<PYQ[]> {
    const allPapers = await CacheManager.fetch<PYQ[]>(
        '/data/papers.json',
        'papers',
        24 * 60 * 60 * 1000
    );

    let filtered = allPapers.filter(p => p.subject_code === subject_code);

    if (exam_type && exam_type !== 'ALL') {
        filtered = filtered.filter(p => p.exam_type === exam_type);
    }

    return filtered.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

/**
 * Search papers with local filters and pagination
 */
export async function getPaginatedPapers(filters: {
    subject_code?: string;
    exam_type?: string;
    search_term?: string;
}, page: number = 1, limit: number = 20) {
    const allPapers = await CacheManager.fetch<PYQ[]>(
        '/data/papers.json',
        'papers',
        24 * 60 * 60 * 1000
    );

    let filtered = allPapers;

    if (filters.subject_code && filters.subject_code !== 'ALL') {
        filtered = filtered.filter(p => p.subject_code === filters.subject_code);
    }

    if (filters.exam_type && filters.exam_type !== 'ALL') {
        filtered = filtered.filter(p => p.exam_type === filters.exam_type);
    }

    if (filters.search_term) {
        const search = filters.search_term.toLowerCase();
        filtered = filtered.filter(p =>
            p.subject_code.toLowerCase().includes(search) ||
            p.subject_title.toLowerCase().includes(search) ||
            p.paper_title.toLowerCase().includes(search)
        );
    }

    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedData = filtered.slice(from, to);

    return {
        data: paginatedData,
        count: filtered.length,
        hasMore: to < filtered.length
    };
}

/**
 * Fetch a single paper by ID (Fallback to live Supabase fetch)
 */
export async function getPaperById(id: string): Promise<PYQ | null> {
    const { data, error } = await supabase
        .from('pyqs')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching paper by ID:', error)
        return null
    }

    return data as PYQ
}

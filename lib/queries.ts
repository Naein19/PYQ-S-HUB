import { supabase } from '@/lib/supabase';
import { getSubjectCodeFromSlug } from '@/lib/subject-titles';

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

/**
 * Fetch distinct subjects (subject_code + subject_title)
 */
export async function getSubjects() {
    const { data, error } = await supabase
        .from('pyqs')
        .select('subject_code, subject_title')
        .order('subject_code', { ascending: true });

    if (error) throw error;

    // Manual distinct since Supabase select('subject_code, subject_title', { count: 'exact', head: false }) 
    // doesn't support easy "distinct on" for multiple columns in a way that matches the requirement simple.
    // We'll use a trick or just unique the array. 
    // Actually, a better way in Supabase for distinct if the table is large is a RPC or a View, 
    // but for now, we'll filter unique values in JS if the dataset is manageable, or use a select trick.

    const uniqueSubjects = data?.reduce((acc: Subject[], current) => {
        const x = acc.find(item => item.subject_code === current.subject_code);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return uniqueSubjects || [];
}

/**
 * Fetch papers for a specific subject
 */
export async function getPapersBySubject(subject_code: string, exam_type?: string) {
    let query = supabase
        .from('pyqs')
        .select('*')
        .eq('subject_code', subject_code)
        .order('exam_type', { ascending: true })
        .order('created_at', { ascending: false });

    if (exam_type && exam_type !== 'ALL') {
        query = query.eq('exam_type', exam_type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as PYQ[];
}

/**
 * Search papers with filters and pagination
 */
export async function getPaginatedPapers(filters: {
    subject_code?: string;
    exam_type?: string;
    search_term?: string;
}, page: number = 1, limit: number = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('pyqs')
        .select('*', { count: 'exact' });

    if (filters.subject_code && filters.subject_code !== 'ALL') {
        // If it's a slug (contains a hyphen), extract the code
        const subjectCode = filters.subject_code.includes('-')
            ? getSubjectCodeFromSlug(filters.subject_code)
            : filters.subject_code;

        query = query.eq('subject_code', subjectCode);
    }

    if (filters.exam_type && filters.exam_type !== 'ALL') {
        query = query.eq('exam_type', filters.exam_type);
    }

    if (filters.search_term) {
        // Search by subject_code, subject_title, or paper_title
        query = query.or(`subject_code.ilike.%${filters.search_term}%,subject_title.ilike.%${filters.search_term}%,paper_title.ilike.%${filters.search_term}%`);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw error;

    return {
        data: data as PYQ[],
        count: count || 0,
        hasMore: count ? (from + limit < count) : false
    };
}

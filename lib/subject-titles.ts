/**
 * VITAP Course Code to Subject Title Mapping
 * This utility helps replace raw database strings with accurate academic titles.
 */

const courseMapping: Record<string, string> = {
    // CSE
    'CSE1005': 'Software Engineering',
    'CSE1006': 'FOUNDATION TO DATA ANALYTICS',
    'CSE1007': 'Java Programming',
    'CSE1008': 'Theory of Computation',
    'CSE1021': 'Introduction to Problem Solving and Programming',
    'CSE1022': 'Introduction to Programming and Problem Solving',
    'CSE2001': 'Computer Architecture and Organization',
    'CSE2007': 'Data Structures and Algorithms',
    'CSE2008': 'Network and Information Security',
    'CSE2009': 'Computer Networks',
    'CSE2013': 'Theory of Computation',
    'CSE3002': 'Internet of Things',
    'CSE3003': 'Embedded Systems',
    'CSE3004': 'Mobile Application Development',
    'CSE3006': 'Artificial Intelligence',
    'CSE3008': 'Machine Learning',
    'CSE3009': 'Deep Learning',
    'CSE3015': 'Blockchain Technology',
    'CSE4001': 'Cloud Computing',
    'CSE4004': 'Web Technologies',
    'CSE4006': 'Compiler Design',
    'CSE4007': 'Distributed Systems',
    'CSE4016': 'Cyber Security',
    // ECE
    'ECE1001': 'Fundamentals of Electronics Engineering',
    'ECE1010': 'Digital Logic and Circuit Design',
    'ECE2001': 'Circuit Theory',
    'ECE2005': 'Microcontroller and Applications',
    'ECE2014': 'Microprocessor and Microcontroller',
    'ECE2002': 'Computer Organization and Architecture',
    // FRL
    'FRL1001': 'French for Beginners',
    'FRL1004': 'German for Beginners',
    'FRL1005': 'Spanish for Beginners',
    'FRL2002': 'Japanese for Beginners',
    'FRL2004': 'German Level II',
    // MAT
    'MAT1003': 'Calculus and Laplace Transforms',
    'MAT2003': 'Applied Numerical Methods',
    'MAT1011': 'Calculus for Engineers',
    // MGT
    'MGT1040': 'Financial Management',
    'MGT2006': 'Entrepreneurship',
    // PHY
    'PHY1001': 'Engineering Physics',
    'PHY2003': 'Solid State Physics/Materials Science',
    // Others
    'CSE1001': 'Problem Solving and Programming',
    'CSE1002': 'Problem Solving and Object Oriented Programming',
    'CSE2005': 'Operating Systems',
    'CSE4012': 'UI/UX USER EXPREIENCE DESING',
    '4012': 'UI/UX USER EXPREIENCE DESING',
    '4012S': 'UI/UX USER EXPREIENCE DESING',
    '4012_-_PREVIOUS_YEAR_QUESTION_PAPERS - 4012S': 'UI/UX USER EXPREIENCE DESING',
};

/**
 * Normalizes a subject code to its clean academic format.
 */
export function getNormalizedSubjectCode(code: string): string {
    const ucCode = code.toUpperCase().trim();
    if (ucCode.includes('4012') || ucCode === '4012S') {
        return 'CSE4012';
    }
    return ucCode;
}

/**
 * Normalizes a subject code and returns the official title if known.
 * If not known, it attempts to clean the provided title.
 */
export function getCleanSubjectTitle(code: string, rawTitle?: string): string {
    const normalizedCode = getNormalizedSubjectCode(code);

    // Check if we have a mapping for this code
    if (courseMapping[normalizedCode]) {
        return courseMapping[normalizedCode];
    }

    // Fallback: If no mapping, clean the raw title
    if (rawTitle) {
        // Remove common patterns like "_-_PREVIOUS_YEAR_QUESTION_PAPER" etc.
        let cleaned = rawTitle
            .replace(/_-_PREVIOUS_YEAR_QUESTION_PAPER/gi, '')
            .replace(/_/g, ' ')
            .trim();

        // If it starts with the code, remove it from the title
        if (cleaned.toUpperCase().startsWith(normalizedCode)) {
            cleaned = cleaned.substring(normalizedCode.length).replace(/^[\s\-_]+/, '').trim();
        }

        return cleaned || `Subject ${normalizedCode}`;
    }

    return `Subject ${normalizedCode}`;
}

/**
 * Generates an SEO-friendly slug from a course code and it's title.
 * Example: 'CSE2007', 'Data Structures' -> 'cse2007-data-structures'
 */
export function getSubjectSlug(code: string, rawTitle?: string): string {
    const normalizedCode = getNormalizedSubjectCode(code).toLowerCase();
    const title = getCleanSubjectTitle(normalizedCode, rawTitle)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${normalizedCode}-${title}`;
}

/**
 * Extracts the subject code from a slug.
 * Example: 'cse2007-data-structures' -> 'CSE2007'
 */
export function getSubjectCodeFromSlug(slug: string): string {
    const match = slug.match(/^([a-z0-9]+)-/i);
    return match ? match[1].toUpperCase() : slug.toUpperCase();
}

export function getAllMappedCodes(): string[] {
    return Object.keys(courseMapping);
}

export type ExamCategory = 'CAT-1' | 'CAT-2' | 'FAT'

export type Subject = {
    id: string
    slug: string
    name: string
    code: string
    department: string
    semester: number
    pyqCount: number
    tags: string[]
}

export type PYQ = {
    id: string
    title: string
    subjectSlug: string
    subjectName: string
    year: number
    semester: 'ODD' | 'EVEN'
    examType: 'MID' | 'END'
    examCategory: ExamCategory
    department: string
    fileUrl: string
    uploadedAt: string
    views: number
    downloads: number
}

export type Department = {
    id: string
    name: string
    shortName: string
}

export type ExamType = {
    id: string
    label: ExamCategory
    full_name: string
    description: string
}

export const examTypes: ExamType[] = [
    {
        id: 'cat-1',
        label: 'CAT-1',
        full_name: 'Mid Term Exam 1',
        description:
            'First continuous assessment test, typically covering the initial units of the syllabus. Usually held in weeks 5–6 of the semester.',
    },
    {
        id: 'cat-2',
        label: 'CAT-2',
        full_name: 'Mid Term Exam 2',
        description:
            'Second continuous assessment test, focusing on the middle units of the syllabus. Held around weeks 10–11 of the semester.',
    },
    {
        id: 'fat',
        label: 'FAT',
        full_name: 'Final Assessment Test',
        description:
            'The end-semester comprehensive examination covering the entire syllabus. Worth the highest weightage in the final grade.',
    },
]

export const departments: Department[] = [
    { id: 'cse', name: 'Computer Science & Engineering', shortName: 'CSE' },
    { id: 'ece', name: 'Electronics & Communication Engineering', shortName: 'ECE' },
    { id: 'me', name: 'Mechanical Engineering', shortName: 'ME' },
    { id: 'ce', name: 'Civil Engineering', shortName: 'CE' },
    { id: 'eee', name: 'Electrical & Electronics Engineering', shortName: 'EEE' },
]

export const subjects: Subject[] = [
    {
        id: '1',
        slug: 'data-structures',
        name: 'Data Structures',
        code: 'CS301',
        department: 'CSE',
        semester: 3,
        pyqCount: 12,
        tags: ['algorithms', 'linked-lists', 'trees'],
    },
    {
        id: '2',
        slug: 'operating-systems',
        name: 'Operating Systems',
        code: 'CS401',
        department: 'CSE',
        semester: 4,
        pyqCount: 9,
        tags: ['processes', 'memory', 'scheduling'],
    },
    {
        id: '3',
        slug: 'database-management',
        name: 'Database Management Systems',
        code: 'CS402',
        department: 'CSE',
        semester: 4,
        pyqCount: 14,
        tags: ['sql', 'normalization', 'transactions'],
    },
    {
        id: '4',
        slug: 'computer-networks',
        name: 'Computer Networks',
        code: 'CS501',
        department: 'CSE',
        semester: 5,
        pyqCount: 11,
        tags: ['tcp-ip', 'routing', 'protocols'],
    },
    {
        id: '5',
        slug: 'analog-circuits',
        name: 'Analog Circuits',
        code: 'EC301',
        department: 'ECE',
        semester: 3,
        pyqCount: 8,
        tags: ['amplifiers', 'filters', 'op-amp'],
    },
    {
        id: '6',
        slug: 'signals-and-systems',
        name: 'Signals & Systems',
        code: 'EC401',
        department: 'ECE',
        semester: 4,
        pyqCount: 10,
        tags: ['fourier', 'laplace', 'z-transform'],
    },
    {
        id: '7',
        slug: 'thermodynamics',
        name: 'Thermodynamics',
        code: 'ME301',
        department: 'ME',
        semester: 3,
        pyqCount: 7,
        tags: ['entropy', 'cycles', 'heat-transfer'],
    },
    {
        id: '8',
        slug: 'structural-analysis',
        name: 'Structural Analysis',
        code: 'CE401',
        department: 'CE',
        semester: 4,
        pyqCount: 6,
        tags: ['beams', 'trusses', 'frames'],
    },
]

export const pyqs: PYQ[] = [
    {
        id: 'p1',
        title: 'CS301 Data Structures — FAT 2023',
        subjectSlug: 'data-structures',
        subjectName: 'Data Structures',
        year: 2023,
        semester: 'ODD',
        examType: 'END',
        examCategory: 'FAT',
        department: 'CSE',
        fileUrl: '#',
        uploadedAt: '2024-01-10',
        views: 342,
        downloads: 128,
    },
    {
        id: 'p2',
        title: 'CS301 Data Structures — CAT-1 2023',
        subjectSlug: 'data-structures',
        subjectName: 'Data Structures',
        year: 2023,
        semester: 'ODD',
        examType: 'MID',
        examCategory: 'CAT-1',
        department: 'CSE',
        fileUrl: '#',
        uploadedAt: '2023-09-20',
        views: 210,
        downloads: 89,
    },
    {
        id: 'p3',
        title: 'CS401 Operating Systems — FAT 2023',
        subjectSlug: 'operating-systems',
        subjectName: 'Operating Systems',
        year: 2023,
        semester: 'EVEN',
        examType: 'END',
        examCategory: 'FAT',
        department: 'CSE',
        fileUrl: '#',
        uploadedAt: '2024-02-15',
        views: 198,
        downloads: 76,
    },
    {
        id: 'p4',
        title: 'CS402 DBMS — CAT-2 2022',
        subjectSlug: 'database-management',
        subjectName: 'Database Management Systems',
        year: 2022,
        semester: 'EVEN',
        examType: 'MID',
        examCategory: 'CAT-2',
        department: 'CSE',
        fileUrl: '#',
        uploadedAt: '2023-03-05',
        views: 401,
        downloads: 187,
    },
    {
        id: 'p5',
        title: 'CS501 Computer Networks — CAT-1 2023',
        subjectSlug: 'computer-networks',
        subjectName: 'Computer Networks',
        year: 2023,
        semester: 'ODD',
        examType: 'MID',
        examCategory: 'CAT-1',
        department: 'CSE',
        fileUrl: '#',
        uploadedAt: '2023-10-12',
        views: 156,
        downloads: 62,
    },
    {
        id: 'p6',
        title: 'EC301 Analog Circuits — FAT 2022',
        subjectSlug: 'analog-circuits',
        subjectName: 'Analog Circuits',
        year: 2022,
        semester: 'ODD',
        examType: 'END',
        examCategory: 'FAT',
        department: 'ECE',
        fileUrl: '#',
        uploadedAt: '2023-01-18',
        views: 134,
        downloads: 54,
    },
]

export const stats = {
    totalPYQs: 1240,
    totalSubjects: 86,
    totalDepartments: 5,
    activeUsers: 3200,
}

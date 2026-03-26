import { Metadata } from 'next'
import SubjectClient from './SubjectClient'
import { getCleanSubjectTitle, getNormalizedSubjectCode, getSubjectCodeFromSlug } from '@/lib/subject-titles'
import fs from 'fs'
import path from 'path'
import { Subject, PYQ } from '@/lib/queries'

interface SubjectPageProps {
    params: { slug: string }
}

// Helper to generate slug consistently with build-time logic
function getSubjectSlug(code: string, title?: string): string {
    const safeTitle = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'archive'
    return `${code.toLowerCase()}-${safeTitle}`
}

export async function generateStaticParams() {
    try {
        const filePath = path.join(process.cwd(), 'public/data/subjects.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const subjects: Subject[] = JSON.parse(fileContent)

        return subjects.map((s) => ({
            slug: getSubjectSlug(s.subject_code, s.subject_title),
        }))
    } catch (error) {
        console.error('Error generating static params for subject:', error)
        return []
    }
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
    const code = getNormalizedSubjectCode(getSubjectCodeFromSlug(params.slug))
    const title = getCleanSubjectTitle(code)

    return {
        title: `${code} Previous Year Papers | VIT-AP CAT 1, CAT 2, FAT`,
        description: `Download verified ${code} - ${title} previous year question papers for CAT 1, CAT 2, and FAT at VIT-AP Amaravati. Direct PDF access for industrial academic success.`,
        keywords: [
            `${code} papers`,
            `${code} VITAP`,
            `${title} PYQ`,
            'VIT-AP exam papers',
            'VIT AP CAT 1 papers',
            'VIT AP CAT 2 papers',
            'VIT AP FAT papers'
        ],
        openGraph: {
            title: `${code} Previous Year Papers | VIT-AP Amaravati`,
            description: `Complete archive of ${code} - ${title} previous year papers at VIT-AP. CAT 1, CAT 2, and FAT resources available.`,
        },
        alternates: {
            canonical: `/subject/${params.slug}`,
        }
    }
}

export const dynamic = 'force-static'

export default async function SubjectPage({ params }: SubjectPageProps) {
    const subjectCode = getSubjectCodeFromSlug(params.slug)

    // Pre-fetch papers for this subject to pass to client
    let initialPapers: PYQ[] = []
    try {
        const filePath = path.join(process.cwd(), 'public/data/papers.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const allPapers: PYQ[] = JSON.parse(fileContent)
        initialPapers = allPapers.filter(p => p.subject_code === subjectCode)
    } catch (error) {
        console.error('Error reading papers.json in SubjectPage:', error)
    }

    return <SubjectClient slug={params.slug} initialPapers={initialPapers} />
}

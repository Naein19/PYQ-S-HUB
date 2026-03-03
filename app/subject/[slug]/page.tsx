import { Metadata } from 'next'
import SubjectClient from './SubjectClient'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'

interface SubjectPageProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
    const code = getNormalizedSubjectCode(params.slug)
    const title = getCleanSubjectTitle(params.slug)

    return {
        title: `${code} Previous Year Papers | VIT-AP CAT-1, CAT-2, FAT`,
        description: `Download ${code} - ${title} previous year question papers for CAT-1, CAT-2, and FAT at VIT-AP. Verified industrial-grade archive for ${title}.`,
        keywords: [`${code} papers`, `${code} VITAP`, `${title} PYQ`, 'VIT-AP exam papers'],
        openGraph: {
            title: `${code} Previous Year Papers | VIT-AP`,
            description: `Complete archive of ${code} - ${title} previous year papers at VIT-AP.`,
        }
    }
}

export default function SubjectPage({ params }: SubjectPageProps) {
    return <SubjectClient slug={params.slug} />
}

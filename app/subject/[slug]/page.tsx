import { Metadata } from 'next'
import SubjectClient from './SubjectClient'
import { getCleanSubjectTitle, getNormalizedSubjectCode, getSubjectCodeFromSlug } from '@/lib/subject-titles'

interface SubjectPageProps {
    params: { slug: string }
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

export default function SubjectPage({ params }: SubjectPageProps) {
    return <SubjectClient slug={params.slug} />
}

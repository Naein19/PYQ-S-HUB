import { MetadataRoute } from 'next'
import { getSubjects, Subject } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://pyqs-hub.vercel.app'

    let subjects: Subject[] = []
    try {
        subjects = await getSubjects()
    } catch (e) {
        console.error('Failed to fetch subjects for sitemap', e)
    }

    const subjectUrls = subjects.map((subject: Subject) => ({
        url: `${baseUrl}/subject/${subject.subject_code.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/explore`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/academic-integrity`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/cookies`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

    return [...staticUrls, ...subjectUrls]
}

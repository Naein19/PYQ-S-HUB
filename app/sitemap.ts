import { MetadataRoute } from 'next'
import { Subject } from '@/lib/queries'
import { getSubjectSlug } from '@/lib/subject-titles'
import fs from 'fs'
import path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://pyqs-hub.vercel.app'

    let subjects: Subject[] = []
    try {
        const filePath = path.join(process.cwd(), 'public/data/subjects.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        subjects = JSON.parse(fileContent)
    } catch (e) {
        console.error('Failed to read subjects for sitemap from filesystem', e)
    }

    const subjectUrls = subjects.map((subject: Subject) => ({
        url: `${baseUrl}/subject/${getSubjectSlug(subject.subject_code, subject.subject_title)}`,
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

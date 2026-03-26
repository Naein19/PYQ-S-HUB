import fs from 'fs'
import path from 'path'
import HomeClient from './HomeClient'
import { Subject, PYQ } from '@/lib/queries'

export const dynamic = 'force-static'

export default async function HomePage() {
    let subjects: Subject[] = []
    let recentPYQs: PYQ[] = []

    try {
        const subjectsPath = path.join(process.cwd(), 'public/data/subjects.json')
        const subjectsData = fs.readFileSync(subjectsPath, 'utf8')
        subjects = JSON.parse(subjectsData).slice(0, 8)

        const papersPath = path.join(process.cwd(), 'public/data/papers.json')
        const papersData = fs.readFileSync(papersPath, 'utf8')
        recentPYQs = JSON.parse(papersData)
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3)
    } catch (error) {
        console.error('Error pre-fetching home data:', error)
    }

    return <HomeClient initialSubjects={subjects} initialRecentPYQs={recentPYQs} />
}

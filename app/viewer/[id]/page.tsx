import { Metadata } from 'next'
import ViewerClient from './ViewerClient'
import { PYQ } from '@/lib/queries'
import fs from 'fs'
import path from 'path'

interface Props {
    params: { id: string }
}

// 1. Pre-render all possible paper IDs at build time
export async function generateStaticParams() {
    try {
        const filePath = path.join(process.cwd(), 'public/data/papers.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const papers: PYQ[] = JSON.parse(fileContent)

        return papers.map((paper) => ({
            id: paper.id,
        }))
    } catch (error) {
        console.error('Error generating static params for viewer:', error)
        return []
    }
}

// 2. Metadata generation (Static)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const filePath = path.join(process.cwd(), 'public/data/papers.json')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const papers: PYQ[] = JSON.parse(fileContent)
    const paper = papers.find(p => p.id === params.id)

    if (!paper) return { title: 'Document Not Found' }

    return {
        title: `${paper.paper_title} | ${paper.subject_code} | VIT-AP Archive`,
        description: `View ${paper.subject_title} (${paper.exam_type}) question paper for ${paper.subject_code} at VIT-AP Amaravati. Total secure access.`,
    }
}

export const dynamicParams = true // Allow looking up new IDs at runtime if needed, but they will trigger a function call

export default async function ViewerPage({ params }: Props) {
    let paper: PYQ | null = null

    try {
        const filePath = path.join(process.cwd(), 'public/data/papers.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const papers: PYQ[] = JSON.parse(fileContent)
        paper = papers.find(p => p.id === params.id) || null
    } catch (error) {
        console.error('Error reading papers.json in ViewerPage:', error)
    }

    return <ViewerClient initialPaper={paper} />
}

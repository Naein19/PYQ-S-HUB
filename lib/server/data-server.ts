import fs from 'fs'
import path from 'path'
import { Subject, PYQ } from '../queries'

/**
 * Server-only data fetching from local JSON files
 */

export async function getServerSubjects(): Promise<Subject[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/subjects.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(fileContent)
    } catch (error) {
        console.error('Error reading subjects.json on server:', error)
        return []
    }
}

export async function getServerPapers(): Promise<PYQ[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/data/papers.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(fileContent)
    } catch (error) {
        console.error('Error reading papers.json on server:', error)
        return []
    }
}

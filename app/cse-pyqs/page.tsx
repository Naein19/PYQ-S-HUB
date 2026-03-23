import { Metadata } from 'next'
import CSELandingClient from './CSELandingClient'

export const metadata: Metadata = {
    title: 'VIT-AP CSE Previous Year Papers | Computer Science PYQs',
    description: 'Download VIT-AP Computer Science and Engineering (CSE) CAT-1, CAT-2, and FAT previous year question papers. Comprehensive archive for all CSE modules at VIT Amaravati.',
    keywords: ['VIT-AP CSE papers', 'Computer Science VITAP PYQ', 'CSE CAT-1 papers', 'CSE CAT-2 papers', 'CSE FAT papers', 'VIT Amaravati CSE question papers'],
    alternates: {
        canonical: '/cse-pyqs',
    }
}

export const dynamic = 'force-static'

export default function CSELandingPage() {
    return <CSELandingClient />
}

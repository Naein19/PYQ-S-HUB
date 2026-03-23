import { Metadata } from 'next'
import ECELandingClient from './ECELandingClient'

export const metadata: Metadata = {
    title: 'VIT-AP ECE Previous Year Papers | Electronics PYQs',
    description: 'Download VIT-AP Electronics and Communication Engineering (ECE) CAT-1, CAT-2, and FAT previous year question papers. Verified archive for ECE students at VIT Amaravati.',
    keywords: ['VIT-AP ECE papers', 'Electronics Engineering VITAP PYQ', 'ECE CAT-1 papers', 'ECE CAT-2 papers', 'ECE FAT papers', 'VIT Amaravati ECE question papers'],
    alternates: {
        canonical: '/ece-pyqs',
    }
}

export const dynamic = 'force-static'

export default function ECELandingPage() {
    return <ECELandingClient />
}

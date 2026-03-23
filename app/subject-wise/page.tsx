import { Metadata } from 'next'
import SubjectWiseClient from './SubjectWiseClient'

export const metadata: Metadata = {
    title: 'VIT-AP Subject-Wise Previous Year Papers | Module Index',
    description: 'Browse the complete index of VIT-AP previous year question papers by subject. Comprehensive repository of all engineering modules at VIT Amaravati.',
    keywords: ['VIT-AP subjects', 'VITAP module-wise papers', 'Subject wise PYQ VITAP', 'VIT Amaravati module archive'],
    alternates: {
        canonical: '/subject-wise',
    }
}

export const dynamic = 'force-static'

export default function SubjectWisePage() {
    return <SubjectWiseClient />
}

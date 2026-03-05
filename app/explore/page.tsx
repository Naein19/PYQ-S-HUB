import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from '@/components/ui/Loading'
import ExploreClient from './ExploreClient'

export const metadata: Metadata = {
    title: 'Explore Repository | VIT-AP Previous Year Papers',
    description: 'Search and filter through the complete archive of VIT-AP CAT-1, CAT-2, and FAT question papers. Organized by subject and department.',
    keywords: [
        'Explore Papers',
        'VIT-AP Archive',
        'Search PYQs',
        'Subject Papers',
        'VIT-AP CAT-1 papers',
        'VIT-AP CAT-2 papers',
        'VIT-AP FAT papers',
        'engineering question papers',
        'VIT-AP semester papers'
    ],
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<Loading fullPage />}>
            <ExploreClient />
        </Suspense>
    )
}

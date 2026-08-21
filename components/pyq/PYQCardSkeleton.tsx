'use client'

import React from 'react'
import Card from '@/components/ui/Card'

export default function PYQCardSkeleton() {
    return (
        <Card size="sm" noHover className="flex flex-col h-full gap-4 relative">
            {/* Subject Archive & Share Shortcuts Skeleton */}
            <div className="hidden md:flex absolute top-4 right-4 gap-3 z-10">
                <div className="w-11 h-11 skeleton" />
                <div className="w-11 h-11 skeleton" />
            </div>

            {/* Header Skeleton */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-[8px] skeleton" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 skeleton" />
                    <div className="h-3 w-1/2 skeleton" />
                </div>
            </div>

            {/* Meta Badges Skeleton */}
            <div className="flex flex-wrap gap-1.5 pt-2">
                <div className="h-5 w-16 skeleton" />
                <div className="h-5 w-20 skeleton" />
            </div>

            {/* Footer Skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]/10">
                <div className="h-11 w-28 skeleton" />
                <div className="h-4 w-20 skeleton" />
            </div>
        </Card>
    )
}

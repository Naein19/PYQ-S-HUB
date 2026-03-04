'use client'

import React from 'react'
import Card from '@/components/ui/Card'

export default function SubjectCardSkeleton() {
    return (
        <Card noHover className="flex flex-col h-full bg-white border-[#111827] p-8">
            <div className="mb-6 flex-1">
                <div className="w-12 h-12 rounded-sm skeleton mb-6" />
                <div className="h-3 w-16 skeleton mb-3" />
                <div className="space-y-2">
                    <div className="h-6 w-full skeleton" />
                    <div className="h-6 w-5/6 skeleton" />
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[#111827]/10 flex items-center justify-between">
                <div className="h-3 w-24 skeleton" />
                <div className="w-10 h-10 rounded-sm skeleton" />
            </div>
        </Card>
    )
}

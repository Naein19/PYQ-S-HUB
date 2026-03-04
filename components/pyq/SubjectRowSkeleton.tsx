'use client'

import React from 'react'

export default function SubjectRowSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-[#111827]/10 rounded-sm">
            <div className="flex-1 space-y-2 truncate">
                <div className="h-3 w-3/4 skeleton" />
                <div className="h-2 w-1/4 skeleton" />
            </div>
            <div className="ml-4 w-7 h-7 skeleton shrink-0" />
        </div>
    )
}

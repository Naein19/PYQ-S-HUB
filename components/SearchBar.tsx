'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
    placeholder?: string
    onSearch?: (query: string) => void
    className?: string
}

export default function SearchBar({ placeholder = 'Search...', onSearch, className }: SearchBarProps) {
    const [query, setQuery] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        onSearch?.(val)
    }

    const clearSearch = () => {
        setQuery('')
        onSearch?.('')
    }

    return (
        <div className={cn("relative group", className)}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#111827]/40 group-focus-within:text-[#4338CA] transition-colors" />
            </div>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder.toUpperCase()}
                className="w-full bg-white border border-[#111827] rounded-sm pl-12 pr-12 py-4 text-xs font-black placeholder:text-[#111827]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] shadow-[4px_4px_0px_rgba(17,24,39,0.05)] focus:shadow-[6px_6px_0px_#111827] transition-all uppercase tracking-tight"
            />
            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-4 flex items-center text-[#111827]/40 hover:text-[#111827] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Industrial corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#111827] -translate-x-0.5 -translate-y-0.5 pointer-events-none transition-transform group-focus-within:scale-150" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#111827] translate-x-0.5 translate-y-0.5 pointer-events-none transition-transform group-focus-within:scale-150" />
        </div>
    )
}

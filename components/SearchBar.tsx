'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sanitizeInput } from '@/lib/security'

interface Suggestion {
    label: string
    value: string
    sublabel?: string
}

interface SearchBarProps {
    placeholder?: string
    onSearch?: (query: string) => void
    suggestions?: Suggestion[]
    className?: string
}

export default function SearchBar({ placeholder = 'Search...', onSearch, suggestions = [], className }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (query.length > 0 && suggestions.length > 0) {
            const filtered = suggestions.filter(s =>
                s.label.toLowerCase().includes(query.toLowerCase()) ||
                s.value.toLowerCase().includes(query.toLowerCase()) ||
                s.sublabel?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5)
            setFilteredSuggestions(filtered)
            if (filtered.length === 0) {
                setShowSuggestions(false)
            }
        } else {
            setFilteredSuggestions([])
            setShowSuggestions(false)
        }
        setSelectedIndex(-1)
    }, [query, suggestions])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = sanitizeInput(e.target.value)
        setQuery(val)
        onSearch?.(val)
        if (val.length > 0) {
            setShowSuggestions(true)
        }
    }

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setQuery(suggestion.value)
        onSearch?.(suggestion.value)
        setShowSuggestions(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
                handleSuggestionClick(filteredSuggestions[selectedIndex])
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
        }
    }

    const clearSearch = () => {
        setQuery('')
        onSearch?.('')
        setShowSuggestions(false)
    }

    return (
        <div ref={containerRef} className={cn("relative group", className)}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[var(--color-text)]/40 group-focus-within:text-[#4338CA] transition-colors" />
            </div>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => query.length > 0 && filteredSuggestions.length > 0 && setShowSuggestions(true)}
                placeholder={placeholder.toUpperCase()}
                className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-sm pl-12 pr-12 py-4 text-xs font-black placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] shadow-[4px_4px_0px_rgba(var(--color-text-rgb,17,24,39),0.05)] focus:shadow-[6px_6px_0px_var(--color-border)] transition-all uppercase tracking-tight"
            />
            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-4 flex items-center text-[var(--color-text)]/40 hover:text-[var(--color-text)] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-[8px_8px_0px_var(--color-border)] z-50 overflow-hidden divide-y divide-[var(--color-border)]/10">
                    <div className="bg-[var(--color-surface)] px-4 py-2 border-b border-[var(--color-border)]">
                        <p className="text-[8px] font-mono font-black text-[var(--color-muted)] uppercase tracking-widest">Available_Resources_Identified</p>
                    </div>
                    {filteredSuggestions.map((suggestion, index) => (
                        <button
                            key={suggestion.value}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3 text-left transition-colors",
                                index === selectedIndex ? "bg-[#4338CA] text-white" : "hover:bg-[var(--color-surface)] text-[var(--color-text)]"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-sm border flex items-center justify-center shrink-0",
                                index === selectedIndex ? "border-white/20 bg-white/10" : "border-[var(--color-border)]/10 bg-[var(--color-surface)]"
                            )}>
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-tight truncate">{suggestion.label}</p>
                                {suggestion.sublabel && (
                                    <p className={cn(
                                        "text-[8px] font-mono uppercase tracking-widest truncate",
                                        index === selectedIndex ? "text-white/60" : "text-[var(--color-muted)]"
                                    )}>
                                        {suggestion.sublabel}
                                    </p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Industrial corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-border)] -translate-x-0.5 -translate-y-0.5 pointer-events-none transition-transform group-focus-within:scale-150" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-border)] translate-x-0.5 translate-y-0.5 pointer-events-none transition-transform group-focus-within:scale-150" />
        </div>
    )
}

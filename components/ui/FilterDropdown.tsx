'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    label: string
    value: string
}

interface FilterDropdownProps {
    label: string
    options: Option[]
    value: string
    onChange: (value: string) => void
    className?: string
}

export default function FilterDropdown({
    label,
    options,
    value,
    onChange,
    className,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full px-4 py-3 bg-[var(--color-card)] border rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-200",
                    isOpen ? "border-[var(--color-border)] shadow-[4px_4px_0px_var(--color-border)]" : "border-[var(--color-border)]/20 hover:border-[var(--color-border)]"
                )}
            >
                <span className="text-[var(--color-muted)] mr-2">{label}:</span>
                <span className="text-[var(--color-text)] flex-1 text-left">
                    {selectedOption?.label || "Any"}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-[var(--color-text)] transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-sm shadow-[6px_6px_0px_var(--color-border)] z-30 animate-slide-down">
                    <div className="py-2 max-h-60 overflow-y-auto">
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className={cn(
                                "flex items-center justify-between w-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--color-surface)] transition-colors text-left",
                                value === '' ? "text-[#4338CA] bg-[#4338CA]/10" : "text-[var(--color-muted)]"
                            )}
                        >
                            All {label}s
                            {value === '' && <Check className="w-3 h-3" />}
                        </button>
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => { onChange(option.value); setIsOpen(false); }}
                                className={cn(
                                    "flex items-center justify-between w-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--color-surface)] transition-colors text-left",
                                    value === option.value ? "text-[#4338CA] bg-[#4338CA]/10" : "text-[var(--color-text)]"
                                )}
                            >
                                {option.label}
                                {value === option.value && <Check className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

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
                    "flex items-center justify-between w-full px-4 py-3 bg-white border rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-200",
                    isOpen ? "border-[#111827] shadow-[4px_4px_0px_#111827]" : "border-[#111827]/10 hover:border-[#111827]"
                )}
            >
                <span className="text-[#6B7280] mr-2">{label}:</span>
                <span className="text-[#111827] flex-1 text-left">
                    {selectedOption?.label || "Any"}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-[#111827] transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#111827] rounded-sm shadow-[6px_6px_0px_#111827] z-30 animate-slide-down">
                    <div className="py-2 max-h-60 overflow-y-auto">
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className={cn(
                                "flex items-center justify-between w-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#F9FAFB] transition-colors text-left",
                                value === '' ? "text-[#4338CA] bg-[#EEF2FF]/50" : "text-[#6B7280]"
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
                                    "flex items-center justify-between w-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#F9FAFB] transition-colors text-left",
                                    value === option.value ? "text-[#4338CA] bg-[#EEF2FF]/50" : "text-[#111827]"
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

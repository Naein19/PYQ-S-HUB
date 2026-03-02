'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    label: string
    value: string
}

interface SelectProps {
    label?: string
    options: Option[]
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
    error?: boolean
}

export default function Select({
    label,
    options,
    value,
    onChange,
    className,
    placeholder = "Select Option",
    error
}: SelectProps) {
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
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {label && (
                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest mb-3">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full px-4 py-3 bg-[#F9FAFB] border rounded-sm text-xs font-bold transition-all duration-200 text-left",
                    isOpen
                        ? "border-[#111827] bg-white ring-2 ring-[#4338CA]/10 shadow-[4px_4px_0px_#111827]"
                        : "border-[#111827] hover:border-[#4338CA] shadow-[2px_2px_0px_rgba(17,24,39,0.05)]",
                    error && "border-red-500 ring-red-500/10"
                )}
            >
                <span className={cn(
                    "truncate uppercase tracking-tight",
                    !selectedOption && "text-[#111827]/30"
                )}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-[#111827] transition-transform flex-shrink-0 ml-2", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#111827] rounded-sm shadow-[8px_8px_0px_#111827] z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest text-center">
                                No Options Available
                            </div>
                        ) : (
                            options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => { onChange(option.value); setIsOpen(false); }}
                                    className={cn(
                                        "flex items-center justify-between w-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#EAE0D5] transition-colors text-left",
                                        value === option.value ? "text-[#4338CA] bg-[#4338CA]/5" : "text-[#111827]"
                                    )}
                                >
                                    {option.label}
                                    {value === option.value && <Check className="w-3 h-3" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

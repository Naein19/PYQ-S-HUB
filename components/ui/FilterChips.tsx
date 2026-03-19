'use client'

import { cn } from '@/lib/utils'

interface Option {
    label: string
    value: string
}

interface FilterChipsProps {
    label: string
    options: Option[]
    value: string
    onChange: (value: string) => void
    className?: string
}

export default function FilterChips({
    label,
    options,
    value,
    onChange,
    className
}: FilterChipsProps) {
    return (
        <div className={cn("space-y-3", className)}>
            <p className="text-[10px] font-mono font-black text-[var(--color-muted)] uppercase tracking-[0.2em]">
                {label}
            </p>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onChange('')}
                    className={cn(
                        "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                        value === ''
                            ? "bg-[var(--color-text)] text-[var(--color-surface)] border-[var(--color-text)] shadow-[4px_4px_0px_var(--color-border)]"
                            : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]/20 hover:border-[var(--color-border)]"
                    )}
                >
                    ALL
                </button>
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                            value === option.value
                                ? "bg-[#4338CA] text-white border-[#4338CA] shadow-[4px_4px_0px_rgba(67,56,202,0.2)]"
                                : "bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)]/20 hover:border-[var(--color-border)]"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                variant === 'primary' && 'btn-primary',
                variant === 'secondary' && 'btn-secondary',
                variant === 'ghost' && 'inline-flex items-center justify-center gap-2 text-[#111827] font-medium text-sm px-5 py-2.5 rounded-[8px] hover:bg-black/5 transition-all duration-150',
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            {children}
        </button>
    )
}

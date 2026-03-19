import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'
import Loading from './Loading'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
}

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                variant === 'primary' && 'btn-primary',
                variant === 'secondary' && 'btn-secondary',
                variant === 'ghost' && 'inline-flex items-center justify-center gap-2 text-[var(--color-text)] font-medium text-sm px-5 py-2.5 rounded-[8px] hover:bg-[var(--color-text)]/5 transition-all duration-150',
                sizeClasses[size],
                isLoading && 'opacity-80 cursor-not-allowed relative !text-transparent transition-none',
                className,
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Loading size="sm" />
                </span>
            )}
            {children}
        </button>
    )
}

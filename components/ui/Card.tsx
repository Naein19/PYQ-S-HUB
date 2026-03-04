import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    size?: 'default' | 'sm' | 'none'
    noHover?: boolean
}

export default function Card({
    size = 'default',
    noHover = false,
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                'bg-white border border-[#111827] rounded-[8px]',
                !noHover && 'transition-all duration-150 ease-in-out hover:-translate-y-0.5',
                size === 'default' && 'p-6 sm:p-8 lg:p-10',
                size === 'sm' && 'p-4 sm:p-5',
                className,
            )}
            style={{
                boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px #111827',
            }}
            {...props}
        >
            {children}
        </div>
    )
}

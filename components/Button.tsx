import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
}

const variantClasses: Record<Variant, string> = {
    primary: 'bg-primary text-white hover:bg-[#1e40af]',
    secondary: 'bg-white text-textPrimary border border-border hover:bg-slate-50',
    accent: 'bg-accent text-white hover:bg-[#1d4ed8]',
    ghost: 'bg-transparent text-textPrimary hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizeClasses: Record<Size, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    'inline-flex items-center justify-center font-medium rounded-[8px] transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                    variantClasses[variant],
                    sizeClasses[size],
                    className,
                )}
                {...props}
            >
                {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : null}
                {children}
            </button>
        )
    },
)

Button.displayName = 'Button'

export default Button

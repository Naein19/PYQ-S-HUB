import { cn } from '@/lib/utils'
import type { ExamCategory } from '@/lib/mock-data'

type BadgeVariant = 'cat1' | 'cat2' | 'fat' | 'default' | 'year' | 'primary' | 'accent' | 'success' | 'warning'

interface BadgeProps {
    children: React.ReactNode
    variant?: BadgeVariant
    examCategory?: ExamCategory
    className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
    cat1: 'badge-cat1',
    cat2: 'badge-cat2',
    fat: 'badge-fat',
    default: 'badge-default',
    year: 'badge-year',
    primary: 'badge bg-[#EEF2FF] text-[#4338CA] border-[#4338CA]',
    accent: 'badge bg-[#F5F3FF] text-[#6D28D9] border-[#6D28D9]',
    success: 'badge bg-emerald-50 text-emerald-700 border-emerald-300',
    warning: 'badge bg-amber-50 text-amber-700 border-amber-300',
}

export function examCategoryVariant(cat: ExamCategory): BadgeVariant {
    switch (cat) {
        case 'CAT-1': return 'cat1'
        case 'CAT-2': return 'cat2'
        case 'FAT': return 'fat'
    }
}

export default function Badge({ children, variant = 'default', examCategory, className }: BadgeProps) {
    const resolvedVariant = examCategory ? examCategoryVariant(examCategory) : variant
    return (
        <span className={cn(variantClasses[resolvedVariant], className)}>
            {children}
        </span>
    )
}

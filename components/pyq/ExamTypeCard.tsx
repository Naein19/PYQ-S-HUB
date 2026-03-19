import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { ExamType } from '@/lib/mock-data'
import Badge from '@/components/Badge'

interface ExamTypeCardProps {
    exam: ExamType
}

export default function ExamTypeCard({ exam }: ExamTypeCardProps) {
    return (
        <Link href={`/explore?exam_type=${exam.label}`} className="h-full block group/card">
            <Card className="flex flex-col h-full hover:border-[#4338CA]/60 transition-all duration-500 relative overflow-hidden cinematic-border group-hover/card:-translate-y-2 group-hover/card:shadow-[calc(var(--shadow-offset)*1.5)_calc(var(--shadow-offset)*1.5)_0px_rgba(67,56,202,0.15)]">
                {/* Decorative background glow */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#4338CA]/5 rounded-full blur-3xl group-hover/card:bg-[#4338CA]/10 transition-colors duration-500" />

                <div className="mb-6 relative z-10">
                    <Badge examCategory={exam.label} className="mb-4 group-hover/card:scale-105 transition-transform duration-500">
                        {exam.label}
                    </Badge>
                    <h3 className="text-2xl font-bold text-[var(--color-text)] leading-tight mb-3 group-hover/card:text-[#4338CA] transition-colors duration-500">
                        {exam.full_name}
                    </h3>
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-8 font-medium">
                        {exam.description}
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-[var(--color-border)]/10 flex items-center justify-between group-hover/card:border-[#4338CA]/20 transition-colors duration-500 relative z-10">
                    <span className="text-xs font-mono font-bold text-[var(--color-text)] uppercase tracking-widest opacity-70 group-hover/card:opacity-100 transition-opacity">
                        Explore Repository
                    </span>
                    <div className="w-10 h-10 rounded-sm border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-card)] group-hover/card:bg-[#4338CA] group-hover/card:border-[#4338CA] group-hover/card:text-white transition-all duration-500 shadow-sm">
                        <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover/card:translate-x-1" />
                    </div>
                </div>
            </Card>
        </Link>
    )
}

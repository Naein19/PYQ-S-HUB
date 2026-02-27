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
        <Link href={`/explore?exam_type=${exam.label}`} className="h-full block">
            <Card className="flex flex-col group cursor-pointer h-full hover:border-[#4338CA] transition-colors">
                <div className="mb-6">
                    <Badge examCategory={exam.label} className="mb-4">
                        {exam.label}
                    </Badge>
                    <h3 className="text-2xl font-bold text-[#111827] leading-tight mb-3">
                        {exam.full_name}
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                        {exam.description}
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-[#111827]/10 flex items-center justify-between group-hover:border-[#111827] transition-colors">
                    <span className="text-xs font-mono font-bold text-[#111827] uppercase tracking-widest">
                        Explore Repository
                    </span>
                    <div className="w-10 h-10 rounded-sm border border-[#111827] flex items-center justify-center bg-white group-hover:bg-[#111827] group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Card>
        </Link>
    )
}

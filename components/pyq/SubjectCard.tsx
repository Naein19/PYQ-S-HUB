import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import Card from '@/components/ui/Card'
import { Subject } from '@/lib/queries'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'

interface SubjectCardProps {
    subject: Subject
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    return (
        <Card className="flex flex-col group/card cursor-pointer h-full bg-[var(--color-card)] border-[var(--color-border)] relative overflow-hidden transition-all duration-500">
            {/* Background Glow Effect */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#4338CA]/5 rounded-full blur-3xl group-hover/card:bg-[#4338CA]/10 transition-colors duration-500" />
            <div className="mb-6 relative z-10">
                <div className="w-12 h-12 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center mb-6 group-hover/card:bg-[#4338CA] group-hover/card:border-[#4338CA] group-hover/card:text-white transition-all duration-500 shadow-[4px_4px_0px_var(--color-border)] group-hover/card:scale-110">
                    <BookOpen className="w-6 h-6" />
                </div>
                <p className="font-mono text-xs font-black text-[#4338CA] mb-2 uppercase tracking-[0.2em] group-hover/card:scale-105 transition-transform duration-500 origin-left">
                    {getNormalizedSubjectCode(subject.subject_code)}
                </p>
                <h3 className="text-2xl font-bold text-[var(--color-text)] leading-tight mb-3 uppercase tracking-tighter line-clamp-3 break-words group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors duration-500">
                    {getCleanSubjectTitle(subject.subject_code, subject.subject_title)}
                </h3>
            </div>

            <Link href={`/subject/${subject.subject_code}`} className="mt-auto pt-6 border-t border-[var(--color-border)]/10 flex items-center justify-between group-hover/card:border-[#4338CA]/20 transition-colors duration-500 relative z-10">
                <span className="text-xs font-mono font-bold text-[var(--color-text)] uppercase tracking-widest opacity-70 group-hover/card:opacity-100 transition-opacity duration-500">
                    Enter Archive
                </span>
                <div className="w-10 h-10 rounded-sm border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-card)] group-hover/card:bg-[#4338CA] group-hover/card:border-[#4338CA] group-hover/card:text-white transition-all duration-500 shadow-sm">
                    <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover/card:translate-x-1" />
                </div>
            </Link>
        </Card>
    )
}

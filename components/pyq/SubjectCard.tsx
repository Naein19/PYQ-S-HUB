import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import Card from '@/components/ui/Card'
import { Subject } from '@/lib/queries'
import { getCleanSubjectTitle } from '@/lib/subject-titles'

interface SubjectCardProps {
    subject: Subject
}

export default function SubjectCard({ subject }: SubjectCardProps) {
    return (
        <Card className="flex flex-col group cursor-pointer h-full bg-white border-[#111827]">
            <div className="mb-6">
                <div className="w-12 h-12 rounded-sm border border-[#111827] bg-[#EAE0D5] flex items-center justify-center mb-6 group-hover:bg-[#111827] group-hover:text-white transition-colors shadow-[4px_4px_0px_#111827]">
                    <BookOpen className="w-6 h-6" />
                </div>
                <p className="font-mono text-xs font-black text-[#4338CA] mb-2 uppercase tracking-[0.2em]">
                    {subject.subject_code}
                </p>
                <h3 className="text-2xl font-bold text-[#111827] leading-tight mb-3 uppercase tracking-tighter line-clamp-3 break-words">
                    {getCleanSubjectTitle(subject.subject_code, subject.subject_title)}
                </h3>
            </div>

            <Link href={`/subject/${subject.subject_code}`} className="mt-auto pt-6 border-t border-[#111827]/10 flex items-center justify-between group-hover:border-[#111827] transition-colors">
                <span className="text-xs font-mono font-bold text-[#111827] uppercase tracking-widest">
                    Enter Archive
                </span>
                <div className="w-10 h-10 rounded-sm border border-[#111827] flex items-center justify-center bg-white group-hover:bg-[#111827] group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
            </Link>
        </Card>
    )
}

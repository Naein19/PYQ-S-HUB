import Link from 'next/link'
import { Eye, FileText, ExternalLink, Folder, Download } from 'lucide-react'
import Badge from './Badge'
import type { PYQ } from '@/lib/queries'
import { getCleanSubjectTitle } from '@/lib/subject-titles'
import { useView } from '@/context/ViewContext'

interface PYQCardProps {
    pyq: PYQ
}

export default function PYQCard({ pyq }: PYQCardProps) {
    const { viewPaper } = useView()

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(pyq.file_url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${pyq.subject_code}_${pyq.paper_title}.pdf`.replace(/\s+/g, '_')
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Download failed:', error)
            // Fallback to opening in new tab if fetch fails
            window.open(pyq.file_url, '_blank')
        }
    }

    return (
        <article className="card p-5 flex flex-col gap-4 relative group/card">
            {/* Subject Archive Shortcut */}
            <Link
                href={`/subject/${pyq.subject_code}`}
                className="absolute top-4 right-4 flex items-center gap-1.5 p-1.5 rounded-sm bg-[#111827]/5 hover:bg-[#111827] hover:text-white transition-all group/folder z-10"
                title="View All Files"
            >
                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 max-w-0 overflow-hidden group-hover/folder:opacity-100 group-hover/folder:max-w-[100px] transition-all duration-300 pointer-events-none">
                    ALL FILES
                </span>
                <Folder className="w-4 h-4" />
            </Link>

            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-[8px] bg-[#EFF6FF] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-textPrimary leading-snug line-clamp-2 break-words">
                        {pyq.paper_title}
                    </h3>
                    <Link
                        href={`/subject/${pyq.subject_code}`}
                        className="text-xs text-accent hover:underline mt-0.5 inline-block truncate max-w-full"
                    >
                        {getCleanSubjectTitle(pyq.subject_code, pyq.subject_title)}
                    </Link>
                </div>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-1.5">
                <Badge variant="default">{pyq.exam_type}</Badge>
                <Badge variant="default">{pyq.subject_code}</Badge>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        0
                    </span>
                    <button
                        onClick={() => viewPaper(pyq)}
                        className="flex items-center gap-1 hover:text-accent transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        VIEW
                    </button>
                </div>
                <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-primary transition-colors"
                    title="Download PDF"
                >
                    <Download className="w-3.5 h-3.5" />
                    DOWNLOAD
                </button>
            </div>
        </article>
    )
}

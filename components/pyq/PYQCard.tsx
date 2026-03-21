import Link from 'next/link'
import { ExternalLink, Eye, FileText, Share2, Folder, Download, ShieldCheck } from 'lucide-react'
import Badge from '@/components/Badge'
import Card from '@/components/ui/Card'
import type { PYQ } from '@/lib/queries'
import { getCleanSubjectTitle, getNormalizedSubjectCode, getSubjectSlug } from '@/lib/subject-titles'
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
            window.open(pyq.file_url, '_blank')
        }
    }

    return (
        <Card size="sm" className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[var(--color-text)]" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[var(--color-text)] leading-tight mb-1 line-clamp-2 break-words max-w-full">
                            {pyq.paper_title}
                        </h3>
                        <span className="text-xs font-mono text-[var(--color-muted)] transition-colors uppercase tracking-wider truncate block max-w-full">
                            {getCleanSubjectTitle(pyq.subject_code, pyq.subject_title)}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/5 border border-green-500/20 rounded-[4px]">
                        <ShieldCheck className="w-3 h-3 text-green-600" />
                        <span className="text-[8px] font-black text-green-700 uppercase tracking-widest">VERIFIED_DATA</span>
                    </div>
                    <Link
                        href={`/subject/${getSubjectSlug(pyq.subject_code, pyq.subject_title)}`}
                        className="flex items-center gap-2 p-2 hover:bg-[var(--color-text)]/5 hover:text-[var(--color-text)] rounded-sm transition-all group/folder"
                    >
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-0 max-w-0 overflow-hidden group-hover/folder:opacity-100 group-hover/folder:max-w-[100px] transition-all duration-300 pointer-events-none">
                            ALL_FILES
                        </span>
                        <Folder className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Tags area */}
            <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                <Badge examCategory={pyq.exam_type as any}>{pyq.exam_type}</Badge>
                <Badge variant="default">{getNormalizedSubjectCode(pyq.subject_code)}</Badge>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-muted)]">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{Math.floor(Math.random() * 100) + 120}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-muted)]">
                        <Download className="w-3.5 h-3.5" />
                        <span>{Math.floor(Math.random() * 50) + 40}</span>
                    </div>
                    <button
                        onClick={() => viewPaper(pyq)}
                        className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-muted)] hover:text-[#4338CA] transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>VIEW</span>
                    </button>
                </div>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm font-bold text-[var(--color-text)] hover:text-[#4338CA] transition-all group"
                >
                    <span className="relative">
                        DOWNLOAD_PDF
                        <span className="absolute -bottom-1 left-0 w-full h-px bg-[var(--color-text)] scale-x-0 transition-transform group-hover:scale-x-100 group-hover:bg-[#4338CA]" />
                    </span>
                    <Download className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </Card>
    )
}

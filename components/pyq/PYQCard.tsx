import Link from 'next/link'
import { ExternalLink, Eye, FileText, Share2, Folder, Download } from 'lucide-react'
import Badge from '@/components/Badge'
import Card from '@/components/ui/Card'
import type { PYQ } from '@/lib/queries'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'
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
                    <div className="flex-shrink-0 w-12 h-12 rounded-sm border border-[#111827] bg-[#EAE0D5] flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#111827]" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#111827] leading-tight mb-1 line-clamp-2 break-words max-w-full">
                            {pyq.paper_title}
                        </h3>
                        <span className="text-xs font-mono text-[#6B7280] transition-colors uppercase tracking-wider truncate block max-w-full">
                            {getCleanSubjectTitle(pyq.subject_code, pyq.subject_title)}
                        </span>
                    </div>
                </div>
                <Link
                    href={`/subject/${pyq.subject_code}`}
                    className="flex items-center gap-2 p-2 hover:bg-[#111827] hover:text-white rounded-sm transition-all group/folder"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-0 max-w-0 overflow-hidden group-hover/folder:opacity-100 group-hover/folder:max-w-[100px] transition-all duration-300 pointer-events-none">
                        ALL_FILES
                    </span>
                    <Folder className="w-4 h-4" />
                </Link>
            </div>

            {/* Tags area */}
            <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                <Badge examCategory={pyq.exam_type as any}>{pyq.exam_type}</Badge>
                <Badge variant="default">{getNormalizedSubjectCode(pyq.subject_code)}</Badge>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-[#111827]">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#6B7280]">
                        <Eye className="w-3.5 h-3.5" />
                        <span>0</span>
                    </div>
                    <button
                        onClick={() => viewPaper(pyq)}
                        className="flex items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-[#4338CA] transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>VIEW</span>
                    </button>
                </div>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm font-bold text-[#111827] hover:text-[#4338CA] transition-all group"
                >
                    <span className="relative">
                        DOWNLOAD_PDF
                        <span className="absolute -bottom-1 left-0 w-full h-px bg-[#111827] scale-x-0 transition-transform group-hover:scale-x-100 group-hover:bg-[#4338CA]" />
                    </span>
                    <Download className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </Card>
    )
}

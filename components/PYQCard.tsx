import Link from 'next/link'
import { Eye, FileText, ExternalLink, Folder, Download, Share2, Check } from 'lucide-react'
import { useState } from 'react'
import Badge from './Badge'
import type { PYQ } from '@/lib/queries'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'
import { useView } from '@/context/ViewContext'

interface PYQCardProps {
    pyq: PYQ
}

export default function PYQCard({ pyq }: PYQCardProps) {
    const { viewPaper } = useView()

    const [copied, setCopied] = useState(false)

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

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const shareUrl = `${window.location.origin}/subject/${pyq.subject_code}`

        try {
            if (navigator.share) {
                await navigator.share({
                    title: pyq.paper_title,
                    text: `Check out this PYQ for ${pyq.subject_code}`,
                    url: shareUrl
                })
            } else {
                await navigator.clipboard.writeText(shareUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch (err) {
            console.error('Error sharing:', err)
        }
    }

    return (
        <article className="card p-5 flex flex-col gap-4 relative group/card">
            {/* Subject Archive & Share Shortcuts */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                    onClick={handleShare}
                    className="w-9 h-9 icon-3d group/share bg-white hover:bg-white"
                    title="Share Repository"
                >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-[#111827]" />}
                </button>
                <Link
                    href={`/subject/${pyq.subject_code}`}
                    className="w-9 h-9 icon-3d group/folder bg-[#EAE0D5] hover:bg-[#111827] hover:text-white"
                    title="View All Files"
                >
                    <Folder className="w-4 h-4" />
                </Link>
            </div>

            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-[8px] bg-[#EFF6FF] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-textPrimary leading-snug line-clamp-2 break-words">
                        {pyq.paper_title}
                    </h3>
                    <span className="text-xs text-slate-500 mt-0.5 inline-block truncate max-w-full font-medium">
                        {getCleanSubjectTitle(pyq.subject_code, pyq.subject_title)}
                    </span>
                </div>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-1.5">
                <Badge variant="default">{pyq.exam_type}</Badge>
                <Badge variant="default">{getNormalizedSubjectCode(pyq.subject_code)}</Badge>
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest rounded-sm border border-[#111827] shadow-[2px_2px_0px_#111827] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#111827] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#111827] transition-all"
                    >
                        <Eye className="w-4 h-4" />
                        <span>VIEW_FILE</span>
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

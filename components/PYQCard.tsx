import Link from 'next/link'
import { Eye, FileText, Folder, Download, Share2, Check } from 'lucide-react'
import { useState } from 'react'
import Badge from './Badge'
import type { PYQ } from '@/lib/queries'
import { getCleanSubjectTitle, getNormalizedSubjectCode } from '@/lib/subject-titles'
import { useView } from '@/context/ViewContext'
import { useSwipe } from '@/hooks/useSwipe'
import { cn } from '@/lib/utils'

interface PYQCardProps {
    pyq: PYQ
}

export default function PYQCard({ pyq }: PYQCardProps) {
    const { viewPaper } = useView()
    const [copied, setCopied] = useState(false)

    const handleDownload = async (e?: React.MouseEvent) => {
        e?.preventDefault()
        e?.stopPropagation()
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

    const handleShare = async (e?: React.MouseEvent) => {
        e?.preventDefault()
        e?.stopPropagation()
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

    const { onTouchStart, onTouchMove, onTouchEnd, offsetX } = useSwipe({
        onSwipeLeft: () => handleDownload(),
        onSwipeRight: () => viewPaper(pyq),
        threshold: 80
    })

    return (
        <article
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={cn(
                "card p-3 md:p-5 flex flex-col gap-4 relative group/card transition-transform duration-200 overflow-hidden",
                offsetX > 20 && "translate-x-2 border-green-500/30 bg-green-500/5",
                offsetX < -20 && "-translate-x-2 border-blue-500/30 bg-blue-500/5"
            )}
        >
            {/* Swipe Indicators (Mobile Only) */}
            <div className={cn(
                "md:hidden absolute inset-y-0 left-0 w-1 bg-green-500 transition-opacity",
                offsetX > 40 ? "opacity-100" : "opacity-0"
            )} />
            <div className={cn(
                "md:hidden absolute inset-y-0 right-0 w-1 bg-blue-500 transition-opacity",
                offsetX < -40 ? "opacity-100" : "opacity-0"
            )} />

            {/* Subject Archive & Share Shortcuts (Desktop Only) */}
            <div className="hidden md:flex absolute top-4 right-4 gap-3 z-10">
                <button
                    onClick={handleShare}
                    className="w-11 h-11 icon-3d group/share bg-white hover:bg-white flex items-center justify-center border border-[#111827]/10"
                    title="Share Repository"
                >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5 text-[#111827]" />}
                </button>
                <Link
                    href={`/subject/${pyq.subject_code}`}
                    className="w-11 h-11 icon-3d group/folder bg-[#EAE0D5] hover:bg-[#111827] hover:text-white flex items-center justify-center border border-[#111827]/10"
                    title="View All Files"
                >
                    <Folder className="w-5 h-5" />
                </Link>
            </div>

            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-[8px] bg-[#EFF6FF] flex items-center justify-center transition-all">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-xs md:text-sm font-semibold text-textPrimary leading-snug line-clamp-2 break-words">
                        {pyq.paper_title}
                    </h3>
                    <span className="text-[10px] md:text-xs text-slate-500 mt-0.5 inline-block truncate max-w-full font-medium">
                        {getCleanSubjectTitle(pyq.subject_code, pyq.subject_title)}
                    </span>
                </div>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-1.5">
                <Badge variant="default" className="text-[9px] md:text-xs px-1.5 md:px-2.5">{pyq.exam_type}</Badge>
                <Badge variant="default" className="text-[9px] md:text-xs px-1.5 md:px-2.5">{getNormalizedSubjectCode(pyq.subject_code)}</Badge>
            </div>

            {/* Mobile Action Bar (Compact) */}
            <div className="flex md:hidden items-center justify-between pt-2 border-t border-[#111827]/5">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => viewPaper(pyq)}
                        className="w-11 h-11 flex items-center justify-center text-[#111827] bg-[#111827]/5 rounded-sm active:scale-95 transition-all"
                        aria-label="View File"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-11 h-11 flex items-center justify-center text-[#111827] bg-[#111827]/5 rounded-sm active:scale-95 transition-all"
                        aria-label="Share"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                    </button>
                    <Link
                        href={`/subject/${pyq.subject_code}`}
                        className="w-11 h-11 flex items-center justify-center text-[#111827] bg-[#111827]/5 rounded-sm active:scale-95 transition-all"
                        aria-label="View Folder"
                    >
                        <Folder className="w-5 h-5" />
                    </Link>
                </div>
                <button
                    onClick={handleDownload}
                    className="w-11 h-11 flex items-center justify-center bg-[#4338CA] text-white rounded-sm shadow-[3px_3px_0px_#111827] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    aria-label="Download"
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <button
                        onClick={() => viewPaper(pyq)}
                        className="flex items-center gap-2 px-5 py-3 bg-[#111827] text-white text-[11px] font-black uppercase tracking-widest rounded-sm border border-[#111827] shadow-[3px_3px_0px_#111827] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#111827] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#111827] transition-all min-h-[44px]"
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

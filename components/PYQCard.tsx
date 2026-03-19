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
                "bg-[var(--color-card)] border border-[var(--color-border)] p-3 md:p-5 flex flex-col gap-4 relative group/card transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden rounded-[2rem]",
                offsetX > 20 && "translate-x-2 border-green-500/30 bg-green-500/5",
                offsetX < -20 && "-translate-x-2 border-blue-500/30 bg-blue-500/5 shadow-[var(--shadow-offset)_var(--shadow-offset)_0px_var(--color-border)]",
                "hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            )}
            style={{
                boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--color-border)',
            }}
        >
            {/* Background Glow Effect */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#4338CA]/5 rounded-full blur-3xl group-hover/card:bg-[#4338CA]/10 transition-colors duration-500 pointer-events-none" />

            {/* Subject Archive & Share Shortcuts (Desktop Only) */}
            <div className="hidden md:flex absolute top-4 right-4 gap-3 z-20">
                <button
                    onClick={handleShare}
                    className="w-11 h-11 bg-[var(--color-card)] hover:bg-[var(--color-text)] hover:text-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] rounded-xl shadow-sm transition-all active:scale-95"
                    title="Share Repository"
                    aria-label="Share Repository"
                >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5 text-[var(--color-text)]" />}
                </button>
                <Link
                    href={`/subject/${pyq.subject_code}`}
                    className="w-11 h-11 bg-[var(--color-text)]/10 hover:bg-[var(--color-text)] hover:text-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] rounded-xl shadow-sm transition-all active:scale-95"
                    title="View All Files"
                    aria-label="View All Files"
                >
                    <Folder className="w-5 h-5" />
                </Link>
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 relative z-10">
                <button
                    onClick={() => viewPaper(pyq)}
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--color-text)]/5 flex items-center justify-center transition-all duration-300 hover:scale-110 group/btn border border-[var(--color-border)]/10"
                    aria-label="View Paper"
                >
                    <FileText className="w-5 h-5 text-[var(--color-text)] opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                </button>
                <div className="min-w-0">
                    <h3 className="text-xs md:text-sm font-black text-[var(--color-text)] leading-snug line-clamp-2 break-words group-hover/card:text-[#4338CA] dark:group-hover/card:text-indigo-400 transition-colors duration-500 uppercase tracking-tight">
                        {pyq.paper_title}
                    </h3>
                    <span className="text-[10px] md:text-xs text-[var(--color-muted)] mt-0.5 inline-block truncate max-w-full font-mono uppercase tracking-wider">
                        {getCleanSubjectTitle(pyq.subject_code, pyq.subject_title)}
                    </span>
                </div>
            </div>

            {/* Tags area (using Badge correctly) */}
            <div className="flex flex-wrap gap-1.5 relative z-10 mt-auto">
                <Badge examCategory={pyq.exam_type as any} className="text-[9px] md:text-xs px-1.5 md:px-2.5 group-hover/card:scale-105 transition-transform duration-500">{pyq.exam_type}</Badge>
                <Badge variant="default" className="text-[9px] md:text-xs px-1.5 md:px-2.5 group-hover/card:scale-105 transition-transform duration-500">{getNormalizedSubjectCode(pyq.subject_code)}</Badge>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:flex items-center justify-between pt-4 border-t border-[var(--color-border)]/10 group-hover/card:border-[var(--color-border)]/30 transition-colors duration-500 relative z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => viewPaper(pyq)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#4338CA] dark:bg-[var(--color-card)] text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-[var(--color-border)] shadow-[4px_4px_0px_var(--color-border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_var(--color-border)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group/btn"
                    >
                        <Eye className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:scale-110" />
                        <span>VIEW_FILE</span>
                    </button>
                </div>
                <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[var(--color-muted)] hover:text-[#4338CA] dark:hover:text-indigo-400 transition-colors group/dl uppercase"
                    title="Download PDF"
                >
                    <Download className="w-3.5 h-3.5 transition-transform duration-500 group-hover/dl:-translate-y-0.5" />
                    <span>DOWNLOAD</span>
                </button>
            </div>

            {/* Mobile Action Bar (Compact) */}
            <div className="flex md:hidden items-center justify-between pt-2 border-t border-[var(--color-border)]/10">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => viewPaper(pyq)}
                        className="w-11 h-11 flex items-center justify-center text-[var(--color-text)] bg-[var(--color-text)]/5 rounded-xl active:scale-95 transition-all border border-[var(--color-border)]/10"
                        aria-label="View File"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-11 h-11 flex items-center justify-center text-[var(--color-text)] bg-[var(--color-text)]/5 rounded-xl active:scale-95 transition-all border border-[var(--color-border)]/10"
                        aria-label="Share"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                    </button>
                    <Link
                        href={`/subject/${pyq.subject_code}`}
                        className="w-11 h-11 flex items-center justify-center text-[var(--color-text)] bg-[var(--color-text)]/5 rounded-xl active:scale-95 transition-all border border-[var(--color-border)]/10"
                        aria-label="View Folder"
                    >
                        <Folder className="w-5 h-5" />
                    </Link>
                </div>
                <button
                    onClick={handleDownload}
                    className="w-11 h-11 flex items-center justify-center bg-[#4338CA] text-white rounded-xl shadow-[3px_3px_0px_var(--color-border)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    aria-label="Download"
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>
        </article>
    )
}

'use client'

import React from 'react'
import { X, FileText } from 'lucide-react'
import type { PYQ } from '@/lib/queries'
import { getNormalizedSubjectCode } from '@/lib/subject-titles'
import { cn } from '@/lib/utils'

interface SidebarBubblesProps {
    papers: PYQ[]
    onRestore: (paper: PYQ) => void
    onClose: (paper: PYQ) => void
}

export default function SidebarBubbles({ papers, onRestore, onClose }: SidebarBubblesProps) {
    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[101] flex flex-col gap-2">
            {papers.map((paper, i) => (
                <div
                    key={paper.id}
                    className={cn(
                        'relative flex items-stretch',
                        'transition-all duration-300 ease-out',
                    )}
                    style={{
                        // Stagger entrance so they don't all pop at once
                        transitionDelay: `${i * 40}ms`,
                    }}
                >
                    {/* ── Bubble tab ────────────────────────────────── */}
                    <button
                        onClick={() => onRestore(paper)}
                        title={`Restore — ${paper.paper_title}`}
                        aria-label={`Restore ${paper.subject_code}`}
                        className={cn(
                            'group flex flex-col items-center gap-2',
                            'bg-[#111827] text-white',
                            'border-2 border-r-0 border-[#111827]',
                            'rounded-l-md px-3 py-4',
                            'shadow-[-4px_4px_0px_rgba(17,24,39,0.25)]',
                            'hover:bg-[#1f2937] active:bg-[#374151]',
                            'transition-colors duration-150',
                        )}
                    >
                        {/* File icon */}
                        <FileText className="w-4 h-4 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />

                        {/* Subject code — vertical */}
                        <span
                            className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-white/50 group-hover:text-white transition-colors leading-none"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                            {getNormalizedSubjectCode(paper.subject_code)}
                        </span>

                        {/* Live dot */}
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)] flex-shrink-0" />
                    </button>

                    {/* ── Close chip ────────────────────────────────── */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(paper) }}
                        title="Close"
                        aria-label={`Close ${paper.subject_code}`}
                        className={cn(
                            'absolute -top-2 -left-2',
                            'w-5 h-5 rounded-full',
                            'bg-[#111827] border border-white/20',
                            'flex items-center justify-center',
                            'text-white/40 hover:text-white hover:bg-[#FF5F56]',
                            'transition-all duration-150',
                            'shadow-sm',
                        )}
                    >
                        <X className="w-2.5 h-2.5" />
                    </button>
                </div>
            ))}
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CacheManager } from '@/lib/cache'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import { ChevronLeft, Download, Maximize2, Minimize2, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react'
import { getPaperById, type PYQ } from '@/lib/queries'

export const dynamic = 'force-static'

export default function ViewerPage({ initialPaper }: { initialPaper: PYQ | null }) {
    const params = useParams()
    const router = useRouter()
    const [paper, setPaper] = useState<PYQ | null>(initialPaper)
    const [loading, setLoading] = useState(!initialPaper)
    const [error, setError] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const fetchPaper = async () => {
            if (paper) return; // Already have it from server
            try {
                setLoading(true)
                // 1. First try fetching from cache/static JSON (Performance optimized)
                const allPapers = await CacheManager.fetch<PYQ[]>(
                    '/data/papers.json',
                    'papers'
                )

                let found = allPapers.find(p => p.id === params.id)

                // 2. Fallback to live Supabase fetch if not in cache (Fix for new uploads)
                if (!found && typeof params.id === 'string') {
                    found = await getPaperById(params.id) || undefined
                }

                if (!found) {
                    throw new Error('Document not found in archive. Please try again after the system syncs.')
                }

                setPaper(found)
            } catch (err: any) {
                setError(err.message || 'Failed to locate archive document.')
            } finally {
                setLoading(false)
            }
        }

        if (params.id && !paper) fetchPaper()
    }, [params.id, paper])

    const handleDownload = async () => {
        if (!paper) return
        try {
            const response = await fetch(paper.file_url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${paper.subject_code}_${paper.paper_title}.pdf`.replace(/\s+/g, '_')
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            window.open(paper.file_url, '_blank')
        }
    }

    if (loading) return <Loading fullPage text="Decrypting Archive Link..." />

    if (error || !paper) {
        return (
            <div className="min-h-screen bg-[#EAE0D5] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-50 border-2 border-red-500 rounded-full flex items-center justify-center mb-8">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tighter mb-4">ARCHIVE_LINK_BROKEN</h1>
                <p className="text-sm font-bold text-[#6B7280] uppercase tracking-widest mb-10 max-w-md">
                    {error || 'The requested document does not exist in the central repository.'}
                </p>
                <Button onClick={() => router.back()} variant="secondary" className="px-10">
                    RETURN_TO_BASE
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-[#111827] text-white overflow-hidden">
            {/* Control Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-white/10 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/10 rounded-sm transition-colors"
                        aria-label="Back"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="hidden sm:block">
                        <h1 className="text-xs font-black uppercase tracking-widest truncate max-w-[300px]">
                            {paper.paper_title}
                        </h1>
                        <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">
                            {paper.subject_code} // ID: {paper.id.substring(0, 8)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={handleDownload}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest h-10 px-4"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        GET_PDF
                    </Button>
                    <button
                        onClick={() => window.open(paper.file_url, '_blank')}
                        className="p-2.5 hover:bg-white/10 rounded-sm transition-colors border border-white/10"
                        title="Open Original"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="hidden md:block p-2.5 hover:bg-white/10 rounded-sm transition-colors border border-white/10"
                        title="Fullscreen Toggle"
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Viewer Stage */}
            <div className="flex-1 relative bg-[#111827] flex flex-col items-center justify-center p-6 text-center">
                {isMobile ? (
                    <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-16 h-16 bg-[#4338CA]/10 border border-[#4338CA]/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(67,56,202,0.2)]">
                            <ShieldCheck className="w-8 h-8 text-[#4338CA]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-2">SECURE_PDF_ACCESS</h2>
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                                MOBILE_ENVIRONMENT_DETECTED: EMBEDDED_VIEWING_RESTRICTED_FOR_COMPATIBILITY
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => window.open(paper.file_url, '_blank')}
                            className="w-full py-6 text-xs font-black uppercase tracking-[0.2em] bg-[#4338CA] shadow-[0_4px_20px_rgba(67,56,202,0.4)] border-none"
                        >
                            <ExternalLink className="w-4 h-4 mr-3" />
                            VIEW_FILE_EXTERNALLY
                        </Button>
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                            REDIRECTS_TO_BROWSER_SYSTEM_VIEWER
                        </p>
                    </div>
                ) : (
                    <>
                        <iframe
                            src={`${paper.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full border-none"
                            title={paper.paper_title}
                        />
                        {/* Fallback link if iframe stays blank */}
                        <button
                            onClick={() => window.open(paper.file_url, '_blank')}
                            className="absolute bottom-4 right-4 text-[8px] font-mono text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest"
                        >
                            Having trouble? Open externally
                        </button>
                        {/* Mobile Scrim Backdrop for better immersion */}
                        <div className="absolute inset-0 pointer-events-none border-[12px] border-[#111827] opacity-20" />
                    </>
                )}
            </div>

            {/* Status Footer */}
            <div className="px-4 py-2 bg-[#111827] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-[0.3em]">
                        SECURE_STREAM_ACTIVE
                    </span>
                </div>
                <div className="text-[9px] font-mono font-black text-[#4338CA] uppercase tracking-[0.3em]">
                    v2.1_CORE
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import { ChevronLeft, Download, Maximize2, Minimize2, ExternalLink, AlertTriangle } from 'lucide-react'
import type { PYQ } from '@/lib/queries'

export default function ViewerPage() {
    const params = useParams()
    const router = useRouter()
    const [paper, setPaper] = useState<PYQ | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const { data, error } = await supabase
                    .from('pyqs')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (error) throw error
                setPaper(data)
            } catch (err: any) {
                setError(err.message || 'Failed to locate archive document.')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) fetchPaper()
    }, [params.id])

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
            <div className="flex-1 relative bg-[#111827]">
                <iframe
                    src={`${paper.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-none"
                    title={paper.paper_title}
                />

                {/* Mobile Scrim Backdrop for better immersion */}
                <div className="absolute inset-0 pointer-events-none border-[12px] border-[#111827] opacity-20" />
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

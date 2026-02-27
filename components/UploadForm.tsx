'use client'

import { useState } from 'react'
import { Upload, FileText, X, CheckSquare, Layers, Calendar, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import { cn } from '@/lib/utils'
import { useSubjects } from '@/hooks/useSubjects'

const examCategories = [
    { label: 'CAT-1', full_name: 'Continuous Assessment Test 1' },
    { label: 'CAT-2', full_name: 'Continuous Assessment Test 2' },
    { label: 'FAT', full_name: 'Final Assessment Test' },
    { label: 'OTHER', full_name: 'Other Assessment' },
]

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { subjects, loading: subjectsLoading } = useSubjects()

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const dropped = e.dataTransfer.files[0]
        if (dropped?.type === 'application/pdf') setFile(dropped)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1500)) // mock delay
        setLoading(false)
        setSuccess(true)
    }

    if (success) {
        return (
            <Card noHover className="p-16 text-center bg-white border-2 border-[#111827]">
                <div className="w-20 h-20 rounded-sm border border-[#111827] bg-[#EEF2FF] flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_#4338CA]">
                    <CheckCircle2 className="w-10 h-10 text-[#4338CA]" />
                </div>
                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-4 leading-none">INGESTION COMPLETE.</h3>
                <p className="text-[#6B7280] text-lg mb-10">The repository item has been queued for verification.</p>
                <Button variant="secondary" onClick={() => { setSuccess(false); setFile(null) }} className="uppercase font-black tracking-widest text-xs px-8">
                    INGEST ANOTHER ITEM
                </Button>
            </Card>
        )
    }

    return (
        <Card noHover className="p-10 bg-white shadow-[8px_8px_0px_#111827]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Subject */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest" htmlFor="subject">
                            <Layers className="w-3 h-3 text-[#4338CA]" />
                            TARGET_SUBJECT
                        </label>
                        <div className="relative">
                            <select id="subject" className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm pl-4 pr-10 py-3 text-xs font-bold uppercase tracking-tight appearance-none focus:outline-none focus:ring-2 focus:ring-[#4338CA]" required disabled={subjectsLoading}>
                                <option value="">{subjectsLoading ? 'SYNCHRONIZING...' : 'SELECT REPOSITORY...'}</option>
                                {subjects.map((s) => (
                                    <option key={s.subject_code} value={s.subject_code}>{s.subject_title.toUpperCase()} ({s.subject_code})</option>
                                ))}
                            </select>
                            {!subjectsLoading ? (
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111827]/30 pointer-events-none" />
                            ) : (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4338CA] animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Academic Year */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest" htmlFor="year">
                            <Calendar className="w-3 h-3 text-[#4338CA]" />
                            ACADEMIC_YEAR
                        </label>
                        <div className="relative">
                            <select id="year" className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm pl-4 pr-10 py-3 text-xs font-bold uppercase tracking-tight appearance-none focus:outline-none focus:ring-2 focus:ring-[#4338CA]" required>
                                {[2024, 2023, 2022, 2021, 2020].map((y) => (
                                    <option key={y}>{y}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111827]/30 pointer-events-none" />
                        </div>
                    </div>

                    {/* Exam Tier */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest" htmlFor="examType">
                            <CheckSquare className="w-3 h-3 text-[#4338CA]" />
                            EXAMINATION_TIER
                        </label>
                        <div className="relative">
                            <select id="examType" className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm pl-4 pr-10 py-3 text-xs font-bold uppercase tracking-tight appearance-none focus:outline-none focus:ring-2 focus:ring-[#4338CA]" required>
                                {examCategories.map((et) => (
                                    <option key={et.label} value={et.label}>{et.full_name.toUpperCase()}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111827]/30 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* File Drop Zone */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                        <Upload className="w-3 h-3 text-[#4338CA]" />
                        DOCUMENT_SOURCE (PDF_ONLY)
                    </label>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className={cn(
                            "border-2 border-dashed border-[#111827]/20 rounded-sm p-16 text-center transition-all cursor-pointer bg-[#F9FAFB] relative group",
                            file ? "border-[#4338CA] bg-[#EEF2FF]" : "hover:border-[#111827]"
                        )}
                    >
                        {file ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-sm border border-[#4338CA] bg-white flex items-center justify-center shadow-[4px_4px_0px_#4338CA]">
                                    <FileText className="w-8 h-8 text-[#4338CA]" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-[#111827] uppercase tracking-tight">{file.name}</span>
                                    <button type="button" onClick={() => setFile(null)} className="p-1 hover:text-red-500 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-[8px] font-mono font-bold text-[#6B7280] uppercase tracking-widest tracking-[0.3em]">READY_FOR_EXTRACTION</span>
                            </div>
                        ) : (
                            <label htmlFor="file-input" className="cursor-pointer block">
                                <Upload className="w-12 h-12 text-[#111827]/10 mx-auto mb-6 transition-transform group-hover:-translate-y-1" />
                                <p className="text-xs font-black text-[#111827] uppercase tracking-widest mb-2">
                                    DRAG SOURCE FILE OR <span className="text-[#4338CA] underline underline-offset-4">BROWSER_LINK</span>
                                </p>
                                <p className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest">MAX_PAYLOAD: 20MB // FMT: PDF</p>
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".pdf"
                                    className="sr-only"
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#111827]/10">
                    <Button type="submit" size="lg" className="w-full md:w-auto px-12 uppercase font-black tracking-[0.2em]">
                        {loading ? 'SYNCING...' : 'INITIATE EXTRACTION'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}

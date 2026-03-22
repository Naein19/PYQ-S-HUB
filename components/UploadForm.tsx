'use client'

import { useState } from 'react'
import { Upload, FileText, X, CheckSquare, Layers, Book, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { sanitizeInput } from '@/lib/security'

const examCategories = [
    { label: 'CAT-1', full_name: 'Continuous Assessment Test 1' },
    { label: 'CAT-2', full_name: 'Continuous Assessment Test 2' },
    { label: 'FAT', full_name: 'Final Assessment Test' },
]

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form states
    const [subjectCode, setSubjectCode] = useState('')
    const [subjectTitle, setSubjectTitle] = useState('')
    const [examType, setExamType] = useState('CAT-1')
    const [paperTitle, setPaperTitle] = useState('')

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const dropped = e.dataTransfer.files[0]
        validateAndSetFile(dropped)
    }

    const validateAndSetFile = (droppedFile: File | undefined) => {
        if (!droppedFile) return

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        if (!allowedTypes.includes(droppedFile.type)) {
            setError('Invalid file type. Please upload a PDF or an image (JPG, PNG).')
            return
        }

        if (droppedFile.size > 20 * 1024 * 1024) {
            setError('File size too large. Max limit is 20MB.')
            return
        }

        setFile(droppedFile)
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            setError('Please select a file to upload.')
            return
        }

        setLoading(true)
        setError(null)

        let filePath = ''

        try {
            // 1. Sanitize all inputs
            const cleanSubjectCode = sanitizeInput(subjectCode).toUpperCase()
            const cleanSubjectTitle = sanitizeInput(subjectTitle)
            const cleanPaperTitle = sanitizeInput(paperTitle)

            // 2. Generate safe filePath
            const fileExt = file.name.split('.').pop()
            const uniqueId = Math.random().toString(36).substring(2, 15)
            const sanitizedBaseName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')
            const fileName = `${Date.now()}-${uniqueId}-${sanitizedBaseName}`
            filePath = `${cleanSubjectCode}/${fileName}.${fileExt}`

            // 3. Upload to Supabase Storage
            const { data: storageData, error: storageError } = await supabase.storage
                .from('pyqs')
                .upload(filePath, file, {
                    contentType: file.type,
                    upsert: false,
                })

            if (storageError) throw storageError

            // 4. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('pyqs')
                .getPublicUrl(filePath)

            // 5. Insert metadata into public.pyqs table
            const { error: dbError } = await supabase
                .from('pyqs')
                .insert({
                    subject_code: cleanSubjectCode,
                    subject_title: cleanSubjectTitle,
                    exam_type: examType,
                    paper_title: cleanPaperTitle,
                    file_path: filePath,
                    file_url: publicUrl,
                    mime_type: file.type,
                })

            if (dbError) {
                // Rollback: Delete file from storage if DB insert fails
                await supabase.storage.from('pyqs').remove([filePath])
                throw dbError
            }

            setSuccess(true)
            resetForm()
        } catch (err: any) {
            setError(err.message || 'An error occurred during the ingestion process.')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFile(null)
        setSubjectCode('')
        setSubjectTitle('')
        setExamType('CAT-1')
        setPaperTitle('')
    }

    if (success) {
        return (
            <Card noHover className="p-16 text-center bg-[var(--color-card)] border-2 border-[var(--color-border)]">
                <div className="w-20 h-20 rounded-sm border border-[var(--color-border)] bg-[#4338CA]/10 flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_#4338CA]">
                    <CheckCircle2 className="w-10 h-10 text-[#4338CA]" />
                </div>
                <h3 className="text-3xl font-black text-[var(--color-text)] uppercase tracking-tighter mb-4 leading-none">
                    INGESTION COMPLETE.
                </h3>
                <p className="text-[var(--color-muted)] text-lg mb-10">The repository item has been successfully stored and mapped.</p>
                <Button
                    variant="secondary"
                    onClick={() => setSuccess(false)}
                    className="uppercase font-black tracking-widest text-xs px-8"
                >
                    INGEST ANOTHER ITEM
                </Button>
            </Card>
        )
    }

    return (
        <Card noHover className="p-10 bg-[var(--color-card)] shadow-[8px_8px_0px_var(--color-border)] border border-[var(--color-border)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Subject Code */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                            <Layers className="w-3 h-3 text-[#4338CA]" />
                            COURSE_CODE
                        </label>
                        <input
                            type="text"
                            required
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            placeholder="E.G. CSE1007"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-[var(--color-card)] transition-all"
                        />
                    </div>

                    {/* Subject Title */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                            <Book className="w-3 h-3 text-[#4338CA]" />
                            COURSE_TITLE
                        </label>
                        <input
                            type="text"
                            required
                            value={subjectTitle}
                            onChange={(e) => setSubjectTitle(e.target.value)}
                            placeholder="E.G. JAVA PROGRAMMING"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-[var(--color-card)] transition-all"
                        />
                    </div>

                    {/* Paper Title */}
                    <div className="space-y-3 md:col-span-2">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                            <FileText className="w-3 h-3 text-[#4338CA]" />
                            PAPER_TITLE
                        </label>
                        <input
                            type="text"
                            required
                            value={paperTitle}
                            onChange={(e) => setPaperTitle(e.target.value)}
                            placeholder="E.G. FALL SEMESTER 2023-24"
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-[var(--color-card)] transition-all"
                        />
                    </div>

                    {/* Exam Tier */}
                    <div className="space-y-3 md:col-span-2">
                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                            <CheckSquare className="w-3 h-3 text-[#4338CA]" />
                            EXAMINATION_TIER
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {examCategories.map((et) => (
                                <button
                                    key={et.label}
                                    type="button"
                                    onClick={() => setExamType(et.label)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 border rounded-sm transition-all",
                                        examType === et.label
                                            ? "border-[#4338CA] bg-[#4338CA]/10 shadow-[4px_4px_0px_#4338CA] translate-x-[-2px] translate-y-[-2px]"
                                            : "border-[var(--color-border)]/10 bg-[var(--color-card)] hover:border-[var(--color-border)]"
                                    )}
                                >
                                    <span className="text-sm font-black text-[var(--color-text)]">{et.label}</span>
                                    <span className="text-[8px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-tighter">
                                        {et.label === 'FAT' ? 'FINAL' : 'CAT'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* File Drop Zone */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                        <Upload className="w-3 h-3 text-[#4338CA]" />
                        DOCUMENT_SOURCE (PDF / IMAGE)
                    </label>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className={cn(
                            "border-2 border-dashed border-[var(--color-border)]/20 rounded-sm p-12 text-center transition-all cursor-pointer bg-[var(--color-surface)] relative group",
                            file ? "border-[#4338CA] bg-[#4338CA]/10" : "hover:border-[var(--color-border)]"
                        )}
                    >
                        {file ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-sm border border-[#4338CA] bg-[var(--color-card)] flex items-center justify-center shadow-[4px_4px_0px_#4338CA]">
                                    <FileText className="w-8 h-8 text-[#4338CA]" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-[var(--color-text)] uppercase tracking-tight">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="p-1 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-[8px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-[0.3em]">
                                    PAYLOAD_READY: {(file.size / (1024 * 1024)).toFixed(2)}MB
                                </span>
                            </div>
                        ) : (
                            <label htmlFor="file-input" className="cursor-pointer block">
                                <Upload className="w-12 h-12 text-[var(--color-text)]/10 mx-auto mb-6 transition-transform group-hover:-translate-y-1" />
                                <p className="text-xs font-black text-[var(--color-text)] uppercase tracking-widest mb-2">
                                    DRAG SOURCE FILE OR <span className="text-[#4338CA] underline underline-offset-4">CLICK_TO_BROWSE</span>
                                </p>
                                <p className="text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest">
                                    MAX_PAYLOAD: 20MB // FMT: PDF, JPG, PNG
                                </p>
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="sr-only"
                                    onChange={(e) => validateAndSetFile(e.target.files?.[0])}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-[10px] font-mono font-bold uppercase tracking-tight">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-[var(--color-border)]/10">
                    <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="w-full md:w-auto px-12 uppercase font-black tracking-[0.2em]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                SYNCING...
                            </>
                        ) : (
                            'INITIATE EXTRACTION'
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    )
}

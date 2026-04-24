'use client'

import React, { useState } from 'react'
import { X, AlertCircle, CheckCircle2, Mail, Layers, FileText, Flag } from 'lucide-react'
import Button from './ui/Button'
import { ticketService, TicketIssueType } from '@/utils/ticketService'
import { cn } from '@/lib/utils'

interface SupportTicketModalProps {
    isOpen: boolean
    onClose: () => void
    context?: string
}

const issueTypes: TicketIssueType[] = [
    'Bug Report',
    'Feedback / Suggestion',
    'Content Issue',
    'Wrong Subject Mapping',
    'Missing Paper',
    'Upload Issue',
    'Other'
]

export default function SupportTicketModal({ isOpen, onClose, context }: SupportTicketModalProps) {
    const [issueType, setIssueType] = useState<TicketIssueType>('Wrong Subject Mapping')
    const [subjectCode, setSubjectCode] = useState('')
    const [description, setDescription] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!description.trim()) {
            setError('Description is required')
            return
        }

        if (!email.trim() || !validateEmail(email)) {
            setError('A valid email is required')
            return
        }

        setIsSubmitting(true)
        try {
            await ticketService.submitTicket({
                issue_type: issueType,
                subject_code: subjectCode,
                description: context ? `[CONTEXT: ${context}] ${description}` : description,
                email: email,
                paper_id: null
            })
            setIsSuccess(true)
            setTimeout(() => {
                onClose()
                setIsSuccess(false)
                resetForm()
            }, 3000)
        } catch (err: any) {
            console.error('Ticket submission failed:', err)
            setError('Something went wrong. Try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setIssueType('Wrong Subject Mapping')
        setSubjectCode('')
        setDescription('')
        setEmail('')
        setError(null)
    }

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 sm:p-4">
            <div 
                className="absolute inset-0 bg-[#111827]/80 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={onClose} 
            />
            
            <div className="relative w-full max-w-xl bg-[#FBF9F7] border-4 border-[#111827] rounded-sm shadow-[20px_20px_0px_#111827] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Flag className="w-4 h-4 text-[#4338CA]" />
                        REPORT AN ISSUE OR SHARE FEEDBACK
                    </span>
                    <button onClick={onClose} className="hover:rotate-90 transition-transform">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 sm:p-10">
                    {isSuccess ? (
                        <div className="py-10 text-center animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-green-50 border-2 border-green-500 rounded-sm flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_#10B981]">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter mb-4">
                                TICKET_LOGGED.
                            </h2>
                            <p className="text-sm font-medium text-[#6B7280]">
                                Thanks. We’ve received your feedback.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                        Issue Type
                                    </label>
                                    <select
                                        value={issueType}
                                        onChange={(e) => setIssueType(e.target.value as TicketIssueType)}
                                        className="w-full bg-white border-2 border-[#111827] rounded-sm px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#4338CA]/10 transition-all"
                                    >
                                        {issueTypes.map(type => (
                                            <option key={type} value={type}>{type.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                        <Layers className="w-3 h-3 text-[#4338CA]/40" />
                                        Subject Code (Opt.)
                                    </label>
                                    <input
                                        type="text"
                                        value={subjectCode}
                                        onChange={(e) => setSubjectCode(e.target.value)}
                                        placeholder="E.G. CSE1007"
                                        className="w-full bg-white border-2 border-[#111827] rounded-sm px-3 py-2.5 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-4 focus:ring-[#4338CA]/10 transition-all uppercase"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                    <Mail className="w-3 h-3 text-[#4338CA]/40" />
                                    Terminal Contact Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="YOUR@IDENTITY.COM"
                                    className="w-full bg-white border-2 border-[#111827] rounded-sm px-3 py-2.5 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-4 focus:ring-[#4338CA]/10 transition-all uppercase"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                    <FileText className="w-3 h-3 text-[#4338CA]/40" />
                                    Issue Description
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="DESCRIBE THE ARCHIVAL DISCREPANCY..."
                                    className="w-full bg-white border-2 border-[#111827] rounded-sm px-3 py-2.5 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-4 focus:ring-[#4338CA]/10 transition-all uppercase resize-none"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-500 rounded-sm text-red-600 text-[10px] font-bold uppercase tracking-tight">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    className="flex-1 py-4 text-xs font-black uppercase tracking-widest"
                                >
                                    SUBMIT_TICKET
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onClose}
                                    className="px-8 py-4 text-xs font-black uppercase tracking-widest"
                                >
                                    CANCEL
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="bg-[#111827]/5 border-t border-[#111827]/10 px-6 py-2 flex items-center justify-between font-mono text-[8px] font-black text-[#111827]/30 uppercase tracking-[0.4em]">
                    <span>STATUS: READY_FOR_SYNC</span>
                    <span>PROTO: SUPPORT_V1</span>
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import { ticketService, SupportTicket } from '@/utils/ticketService'
import Card from './ui/Card'
import Badge from './Badge'
import { CheckCircle, Trash2, Clock, Mail, Layers, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdminCollapsibleSection from './AdminCollapsibleSection'
import ConfirmActionModal from './ConfirmActionModal'

export default function AdminSupportTickets() {
    const [tickets, setTickets] = useState<SupportTicket[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshing, setRefreshing] = useState(false)
    
    // Modal states
    const [confirmAction, setConfirmAction] = useState<{ 
        id: string, 
        type: 'resolve' | 'delete',
        message: string
    } | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    const fetchTickets = async (isManual = false) => {
        if (isManual) setRefreshing(true)
        try {
            const data = await ticketService.getTickets()
            setTickets(data)
            setError(null)
        } catch (err: any) {
            console.error('Error fetching tickets:', err)
            setError('FAILED_TO_SYNC_TICKETS')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchTickets()
        const interval = setInterval(() => fetchTickets(), 30000) // Refresh every 30s
        return () => clearInterval(interval)
    }, [])

    const handleResolve = async (id: string) => {
        setActionLoading(true)
        try {
            await ticketService.resolveTicket(id)
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t))
            setConfirmAction(null)
        } catch (err) {
            console.error('Resolve failed:', err)
            // Error toast could be added here if a system exists
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setActionLoading(true)
        try {
            await ticketService.deleteTicket(id)
            setTickets(prev => prev.filter(t => t.id !== id))
            setConfirmAction(null)
        } catch (err) {
            console.error('Delete failed:', err)
        } finally {
            setActionLoading(false)
        }
    }

    if (loading && tickets.length === 0) {
        return (
            <div className="p-8 text-center text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest animate-pulse">
                INITIALIZING_SUPPORT_CORE...
            </div>
        )
    }

    return (
        <AdminCollapsibleSection 
            title="SUPPORT TICKETS" 
            badge="SYSTEM_READY"
            defaultOpen={true}
        >
            <div className="pt-4 flex justify-end">
                <button 
                    onClick={() => fetchTickets(true)}
                    className={cn(
                        "p-2 rounded-sm border border-[var(--color-border)]/20 hover:bg-[var(--color-surface)] transition-all",
                        refreshing && "animate-spin"
                    )}
                    title="Refresh Tickets"
                >
                    <RefreshCw className="w-3 h-3 text-[#4338CA]" />
                </button>
            </div>

            {error && (
                <div className="p-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-[10px] font-mono font-bold uppercase tracking-tight flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {tickets && tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <Card key={ticket.id} noHover className="bg-[var(--color-card)] border-2 border-[var(--color-border)]/20 shadow-none">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant={ticket.status === 'open' ? 'primary' : 'default'} className="text-[8px] uppercase tracking-widest">
                                            {ticket.status === 'open' ? 'ACTIVE_QUERY' : 'RESOLVED'}
                                        </Badge>
                                        <Badge variant="default" className="bg-[#4338CA]/10 text-[#4338CA] border-[#4338CA]/20 text-[8px] uppercase tracking-widest">
                                            {ticket.issue_type}
                                        </Badge>
                                        {ticket.subject_code && (
                                            <div className="flex items-center gap-1 text-[9px] font-mono font-black text-[#111827]/40 uppercase">
                                                <Layers className="w-3 h-3" />
                                                {ticket.subject_code}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {ticket.status === 'open' && (
                                            <button
                                                onClick={() => setConfirmAction({
                                                    id: ticket.id!,
                                                    type: 'resolve',
                                                    message: "Mark this ticket as resolved?"
                                                })}
                                                disabled={actionLoading}
                                                className="p-2 rounded-sm border border-green-500/20 bg-green-500/5 text-green-600 hover:bg-green-500/10 transition-all shadow-[2px_2px_0px_rgba(34,197,94,0.1)] disabled:opacity-50"
                                                title="Mark as Resolved"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setConfirmAction({
                                                id: ticket.id!,
                                                type: 'delete',
                                                message: "Are you sure you want to delete this ticket?"
                                            })}
                                            disabled={actionLoading}
                                            className="p-2 rounded-sm border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all shadow-[2px_2px_0px_rgba(239,68,68,0.1)] disabled:opacity-50"
                                            title="Delete Ticket"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-[var(--color-text)] leading-snug line-clamp-2 uppercase tracking-tight">
                                        {ticket.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5 hover:text-[var(--color-text)] transition-colors">
                                            <Mail className="w-3 h-3 opacity-40" />
                                            {ticket.email}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 opacity-40" />
                                            {new Date(ticket.created_at || '').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="p-12 text-center border-2 border-dashed border-[var(--color-border)]/10 rounded-sm">
                        <Ticket className="w-10 h-10 text-[var(--color-text)]/10 mx-auto mb-4" />
                        <p className="text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest">
                            No support tickets yet
                        </p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmActionModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={() => {
                    if (confirmAction?.type === 'resolve') handleResolve(confirmAction.id)
                    else if (confirmAction?.type === 'delete') handleDelete(confirmAction.id)
                }}
                isLoading={actionLoading}
                title={confirmAction?.type === 'delete' ? "Confirm Deletion" : "Confirm Resolution"}
                message={confirmAction?.message || ""}
                variant={confirmAction?.type === 'delete' ? 'danger' : 'primary'}
                confirmText={confirmAction?.type === 'delete' ? "Permanently Delete" : "Resolve Ticket"}
            />
        </AdminCollapsibleSection>
    )
}

function Ticket({ className }: { className?: string }) {
    return (
        <svg 
            className={className} 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
            <path d="M13 5v2"></path>
            <path d="M13 17v2"></path>
            <path d="M13 11v2"></path>
        </svg>
    )
}

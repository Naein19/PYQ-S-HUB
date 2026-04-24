'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import { Shield, FileText, Users, Activity, Lock, LogOut } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { usePapers } from '@/hooks/usePapers'
import { getNormalizedSubjectCode } from '@/lib/subject-titles'
import { useAuth } from '@/context/AuthContext'
import { useNotices } from '@/context/NoticeContext'
import { Trash2, Plus, Power, Megaphone, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import Badge from '@/components/Badge'
import AdminSupportTickets from '@/components/AdminSupportTickets'
import AdminCollapsibleSection from '@/components/AdminCollapsibleSection'

const adminStats = [
    { label: 'Total Paper Archive', value: '1,240', icon: FileText },
    { label: 'Verified Identities', value: '3,200', icon: Users },
    { label: 'Inbound Inquiries', value: '+48', icon: Activity },
]

export default function AdminPage() {
    const router = useRouter()
    const { user, loading: authLoading, signOut } = useAuth()
    const { notices, addNotice, updateNotice, deleteNotice, toggleNotice } = useNotices()
    const [isExpanded, setIsExpanded] = useState(false)
    const [isSectionCollapsed, setIsSectionCollapsed] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const displayLimit = 5

    // Activity feed data - Live fetch from Supabase
    const [recentPYQs, setRecentPYQs] = useState<any[]>([])
    const [papersLoading, setPapersLoading] = useState(true)
    const [papersError, setPapersError] = useState<any>(null)
    const [hasMore, setHasMore] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)

    const fetchPapers = async (pageNumber: number, append: boolean = false) => {
        try {
            if (append) setLoadingMore(true); else setPapersLoading(true)

            const { data, error, count } = await supabase
                .from('pyqs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((pageNumber - 1) * 20, pageNumber * 20 - 1)

            if (error) throw error

            setRecentPYQs(prev => append ? [...prev, ...(data || [])] : (data || []))
            setHasMore((data?.length || 0) + (append ? recentPYQs.length : 0) < (count || 0))
        } catch (err) {
            setPapersError(err)
        } finally {
            setPapersLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchPapers(1)
    }, [])

    // Real-time sync listener for deletions made elsewhere (e.g. Explore section)
    useEffect(() => {
        const handleGlobalDelete = (event: any) => {
            const deletedId = event.detail?.id
            if (deletedId) {
                setRecentPYQs(prev => prev.filter(p => p.id !== deletedId))
            }
        }
        window.addEventListener('pyq-deleted', handleGlobalDelete as any)
        return () => window.removeEventListener('pyq-deleted', handleGlobalDelete as any)
    }, [])

    const loadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchPapers(nextPage, true)
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login')
            } else if (user.user_metadata?.role !== 'admin') {
                router.push('/forbidden')
            }
        }
    }, [user, authLoading, router])

    const handleLogout = async () => {
        await signOut()
        router.push('/login')
    }

    if (!user && !authLoading) return null

    return (
        <div className="bg-[var(--color-surface)] min-h-screen animate-fade-in">
            <div className="container-main py-16 lg:py-24">
                {/* Admin Industrial Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-10 border-b border-[var(--color-border)] gap-8">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-sm border border-[var(--color-border)] bg-[var(--color-border)] text-white flex items-center justify-center shadow-[4px_4px_0px_#4338CA]">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[var(--color-border)] bg-[var(--color-card)] mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text)]">
                                <Lock className="w-3 h-3 text-[#4338CA]" />
                                ADMIN_SECURE_NODE : {user?.email?.split('@')[0].toUpperCase()}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text)] uppercase tracking-tighter leading-none">
                                CONTENT MANAGER.
                            </h1>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={handleLogout} className="font-bold uppercase tracking-widest text-[10px]">
                        <LogOut className="w-4 h-4 mr-2" />
                        Terminate Session
                    </Button>
                </div>

                {/* Industrial Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {adminStats.map(({ label, value, icon: Icon }) => (
                        <Card key={label} noHover size="sm" className="bg-[var(--color-card)] flex items-center gap-6 group hover:border-[#4338CA] transition-colors">
                            <div className="w-12 h-12 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center group-hover:bg-[var(--color-border)] group-hover:text-[var(--color-card)] transition-colors">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-[var(--color-text)] uppercase tracking-tighter">{value}</div>
                                <div className="text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest">{label}</div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Upload Management */}
                    <div className="space-y-8">
                        <div className="pb-4 border-b border-[var(--color-border)]/10">
                            <h2 className="text-xl font-black text-[var(--color-text)] uppercase tracking-tighter">ARCHIVE INGESTION</h2>
                        </div>
                        <UploadForm onUploadSuccess={() => fetchPapers(1)} />
                    </div>

                    {/* Recent Repository Updates */}
                    <div className="space-y-8">
                        <div className="pb-4 border-b border-[var(--color-border)]/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-[var(--color-text)] uppercase tracking-tighter">LIVE FEED ARCHIVE</h2>
                                <button
                                    onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
                                    className="p-1 rounded-sm border border-[var(--color-border)]/20 hover:bg-[var(--color-surface)] transition-all"
                                    title={isSectionCollapsed ? "Expand Section" : "Collapse Section"}
                                >
                                    {isSectionCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                </button>
                            </div>
                            <span className="text-[8px] font-mono font-black text-[#4338CA] uppercase tracking-widest animate-pulse">SYSTEM_SYNCING</span>
                        </div>

                        {!isSectionCollapsed && (
                            <Card noHover size="none" className="bg-[var(--color-card)] divide-y divide-[var(--color-border)]/10 overflow-hidden border border-[var(--color-border)] animate-in fade-in slide-in-from-top-2 duration-300">
                                {papersLoading ? (
                                    <div className="p-8 text-center text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest">
                                        FETCHING_LATEST_DATA...
                                    </div>
                                ) : recentPYQs.length > 0 ? (
                                    <>
                                        {(isExpanded ? recentPYQs : recentPYQs.slice(0, displayLimit)).map((pyq) => (
                                            <div key={pyq.id} className="p-4 flex items-center justify-between hover:bg-[var(--color-surface)] transition-colors group">
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-mono font-black text-[#4338CA] bg-[#4338CA]/10 px-1.5 py-0.5 rounded-sm shrink-0">
                                                            {getNormalizedSubjectCode(pyq.subject_code)}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-[var(--color-text)] truncate uppercase tracking-tight">
                                                            {pyq.paper_title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[9px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest truncate">
                                                        <span className="truncate">{pyq.subject_title}</span>
                                                        <span className="shrink-0">•</span>
                                                        <span className="shrink-0">{new Date(pyq.created_at || '').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={async () => {
                                                            if (confirmDeleteId !== pyq.id) {
                                                                setConfirmDeleteId(pyq.id)
                                                                setTimeout(() => setConfirmDeleteId(null), 3000)
                                                                return
                                                            }
                                                            try {
                                                                // Senior Security: Re-verify session before sensitive action
                                                                const { data: { user }, error: authError } = await supabase.auth.getUser()
                                                                if (authError || !user) throw new Error('Security verification failed. Please sign in again.')

                                                                // 1. Storage remove - explicitly check for error
                                                                const { error: storageError } = await supabase.storage.from('pyqs').remove([pyq.file_path])
                                                                if (storageError) {
                                                                    console.error('Storage removal error:', storageError)
                                                                    // We continue to DB delete if storage fails (maybe file already gone),
                                                                    // but we should log it.
                                                                }

                                                                // 2. DB delete - explicitly check for error
                                                                const { error: dbError } = await supabase.from('pyqs').delete().eq('id', pyq.id)
                                                                if (dbError) throw dbError

                                                                // 3. Sync local state immediately to avoid ghost items
                                                                setRecentPYQs(prev => prev.filter(p => p.id !== pyq.id))

                                                                // 4. Sync local blacklist for other components (Experience/Explore)
                                                                window.dispatchEvent(new CustomEvent('pyq-deleted', { detail: { id: pyq.id } }))

                                                                setConfirmDeleteId(null)
                                                            } catch (err) {
                                                                console.error('Delete failed:', err)
                                                                alert('Failed to delete resource totally. Please check your permissions.')
                                                            }
                                                        }}
                                                        className={cn(
                                                            "h-8 rounded-sm border flex items-center justify-center transition-all shadow-[2px_2px_0px_rgba(239,68,68,0.2)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                                            confirmDeleteId === pyq.id
                                                                ? "bg-red-500 text-white border-red-600 shadow-[2px_2px_0px_#B91C1C] px-3 w-auto"
                                                                : "border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 w-8"
                                                        )}
                                                        title={confirmDeleteId === pyq.id ? "Click again to confirm" : "Delete Paper"}
                                                    >
                                                        {confirmDeleteId === pyq.id ? (
                                                            <span className="text-[10px] font-black italic uppercase tracking-tighter">Confirm</span>
                                                        ) : (
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                    <Link
                                                        href={`/viewer/${pyq.id}`}
                                                        className="w-8 h-8 rounded-sm border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-card)] hover:bg-[var(--color-border)] hover:text-[var(--color-card)] transition-all shadow-[2px_2px_0px_var(--color-border)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}

                                        {(recentPYQs.length > displayLimit || hasMore) && (
                                            <div className="p-2 bg-[var(--color-surface)]/50 border-t border-[var(--color-border)]/10 flex gap-2">
                                                {!isExpanded ? (
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full text-[9px] h-8 font-black uppercase tracking-[0.2em] border border-[var(--color-border)]/10 hover:bg-[var(--color-border)] hover:text-[var(--color-card)] transition-all"
                                                        onClick={() => setIsExpanded(true)}
                                                    >
                                                        SEE_FULL_ARCHIVE ({recentPYQs.length})
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            className="flex-1 text-[9px] h-8 font-black uppercase tracking-[0.2em] border border-[var(--color-border)]/10 hover:bg-[var(--color-border)] hover:text-[var(--color-card)] transition-all"
                                                            onClick={() => setIsExpanded(false)}
                                                        >
                                                            COLLAPSE
                                                        </Button>
                                                        {hasMore && (
                                                            <Button
                                                                variant="primary"
                                                                className="flex-1 text-[9px] h-8 font-black uppercase tracking-[0.2em]"
                                                                onClick={() => loadMore()}
                                                                disabled={loadingMore}
                                                            >
                                                                {loadingMore ? 'SYNCING...' : 'FETCH_MORE'}
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-8 text-center text-[10px] font-mono font-bold text-[var(--color-muted)] uppercase tracking-widest">
                                        NO_RECENT_ACTIVITY_DETECTED
                                    </div>
                                )}
                            </Card>
                        )}

                        <AdminCollapsibleSection 
                            title="GLOBAL NOTICES" 
                            badge="NETWORK_ACTIVE"
                            defaultOpen={false}
                        >
                            <div className="pt-4 flex justify-end">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => addNotice('NEW_NOTICE_STRING', 'all')}
                                    className="text-[10px] h-8 px-4"
                                >
                                    <Plus className="w-3 h-3 mr-2" />
                                    GENERATE_NOTICE
                                </Button>
                            </div>

                            <div className="space-y-4 mt-8">
                                {notices.map((notice) => (
                                    <Card key={notice.id} noHover className="bg-[var(--color-card)] border-dashed border-2 border-[var(--color-border)]/30">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full", notice.isActive ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                                                    <Badge variant={notice.type === 'signed' ? 'primary' : 'default'} className="text-[8px] uppercase tracking-widest">
                                                        {notice.type === 'signed' ? 'AUTH_ONLY' : 'PUBLIC_ACCESS'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleNotice(notice.id)}
                                                        className={cn("p-2 rounded-sm border transition-all", notice.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}
                                                        title={notice.isActive ? "Disable Notice" : "Enable Notice"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteNotice(notice.id)}
                                                        className="p-2 rounded-sm border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                                        title="Delete Notice"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <Megaphone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4338CA]/30" />
                                                <input
                                                    value={notice.text}
                                                    onChange={(e) => updateNotice(notice.id, { text: e.target.value })}
                                                    className="w-full pl-8 bg-transparent border-none text-sm font-bold text-[var(--color-text)] focus:ring-0 placeholder:text-[var(--color-muted)]/30 uppercase tracking-tight"
                                                    placeholder="ENTER NOTICE STRING..."
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateNotice(notice.id, { type: 'all' })}
                                                    className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border", notice.type === 'all' ? "bg-[var(--color-text)] text-[var(--color-card)] border-[var(--color-text)]" : "bg-[var(--color-card)] text-[var(--color-muted)] border-[var(--color-border)]/20")}
                                                >
                                                    Set Public
                                                </button>
                                                <button
                                                    onClick={() => updateNotice(notice.id, { type: 'signed' })}
                                                    className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border", notice.type === 'signed' ? "bg-[var(--color-text)] text-[var(--color-card)] border-[var(--color-text)]" : "bg-[var(--color-card)] text-[var(--color-muted)] border-[var(--color-border)]/20")}
                                                >
                                                    Set Auth Only
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </AdminCollapsibleSection>

                        {/* SUPPORT TICKETS SECTION */}
                        <AdminSupportTickets />
                    </div>
                </div>
            </div>
        </div>
    )
}

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
import { Trash2, Plus, Power, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import Badge from '@/components/Badge'

const adminStats = [
    { label: 'Total Paper Archive', value: '1,240', icon: FileText },
    { label: 'Verified Identities', value: '3,200', icon: Users },
    { label: 'Inbound Inquiries', value: '+48', icon: Activity },
]

export default function AdminPage() {
    const router = useRouter()
    const { user, loading: authLoading, signOut } = useAuth()
    const { notices, addNotice, updateNotice, deleteNotice, toggleNotice } = useNotices()

    // Activity feed data - memoized to prevent infinite loops
    const filters = useMemo(() => ({}), [])
    const { papers: recentPYQs, loading: papersLoading, error: papersError } = usePapers(filters, 1)

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
        <div className="bg-[#EAE0D5] min-h-screen animate-fade-in">
            <div className="container-main py-16 lg:py-24">
                {/* Admin Industrial Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-10 border-b border-[#111827] gap-8">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-sm border border-[#111827] bg-[#111827] text-white flex items-center justify-center shadow-[4px_4px_0px_#4338CA]">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#111827] bg-white mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111827]">
                                <Lock className="w-3 h-3 text-[#4338CA]" />
                                ADMIN_SECURE_NODE : {user?.email?.split('@')[0].toUpperCase()}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter leading-none">
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
                        <Card key={label} noHover size="sm" className="bg-white flex items-center gap-6 group hover:border-[#4338CA] transition-colors">
                            <div className="w-12 h-12 rounded-sm border border-[#111827] bg-[#EAE0D5] flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white transition-colors">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-[#111827] uppercase tracking-tighter">{value}</div>
                                <div className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest">{label}</div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Upload Management */}
                    <div className="space-y-8">
                        <div className="pb-4 border-b border-[#111827]/10">
                            <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">ARCHIVE INGESTION</h2>
                        </div>
                        <UploadForm />
                    </div>

                    {/* Recent Repository Updates */}
                    <div className="space-y-8">
                        <div className="pb-4 border-b border-[#111827]/10 flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">LIVE FEED ARCHIVE</h2>
                            <span className="text-[8px] font-mono font-black text-[#4338CA] uppercase tracking-widest animate-pulse">SYSTEM_SYNCING</span>
                        </div>
                        <Card noHover size="none" className="bg-white divide-y divide-[#111827]/10 overflow-hidden">
                            {/* ... (existing paper list code) ... */}
                        </Card>

                        {/* NOTICE MANAGEMENT SECTION */}
                        <div id="notices" className="pt-12 space-y-8">
                            <div className="pb-4 border-b border-[#111827]/10 flex items-center justify-between">
                                <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">GLOBAL NOTICES</h2>
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

                            <div className="space-y-4">
                                {notices.map((notice) => (
                                    <Card key={notice.id} noHover className="bg-white border-dashed border-2">
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
                                                        className={cn("p-2 rounded-sm border transition-all", notice.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200")}
                                                        title={notice.isActive ? "Disable Notice" : "Enable Notice"}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteNotice(notice.id)}
                                                        className="p-2 rounded-sm border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
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
                                                    className="w-full pl-8 bg-transparent border-none text-sm font-bold text-[#111827] focus:ring-0 placeholder:text-slate-300 uppercase tracking-tight"
                                                    placeholder="ENTER NOTICE STRING..."
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateNotice(notice.id, { type: 'all' })}
                                                    className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border", notice.type === 'all' ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6B7280] border-slate-200")}
                                                >
                                                    Set Public
                                                </button>
                                                <button
                                                    onClick={() => updateNotice(notice.id, { type: 'signed' })}
                                                    className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border", notice.type === 'signed' ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6B7280] border-slate-200")}
                                                >
                                                    Set Auth Only
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

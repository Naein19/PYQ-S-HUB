'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import UploadForm from '@/components/UploadForm'
import Badge from '@/components/Badge'
import { Shield, FileText, Users, Activity, Lock, LogOut } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { usePapers } from '@/hooks/usePapers'
import { getNormalizedSubjectCode } from '@/lib/subject-titles'
import { useAuth } from '@/context/AuthContext'

const adminStats = [
    { label: 'Total Paper Archive', value: '1,240', icon: FileText },
    { label: 'Verified Identities', value: '3,200', icon: Users },
    { label: 'Inbound Inquiries', value: '+48', icon: Activity },
]

export default function AdminPage() {
    const router = useRouter()
    const { user, loading: authLoading, signOut } = useAuth()

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
                            {papersLoading ? (
                                <div className="p-20 flex justify-center">
                                    <Loading size="sm" />
                                </div>
                            ) : papersError ? (
                                <div className="p-12 text-center text-red-600 font-mono text-[10px] uppercase tracking-widest bg-red-50/50">
                                    Archive Link Failed // ERR_SYNC
                                </div>
                            ) : recentPYQs.length > 0 ? (
                                <>
                                    {recentPYQs.slice(0, 5).map((pyq) => (
                                        <div key={pyq.id} className="p-6 flex items-start justify-between gap-6 hover:bg-black/5 transition-colors group">
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-[#111827] uppercase tracking-tight line-clamp-1 group-hover:text-[#4338CA] transition-colors break-words">
                                                    {pyq.paper_title}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="font-mono text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">INGESTED: ACTIVE</p>
                                                    <div className="w-1 h-1 rounded-full bg-[#111827]/10" />
                                                    <p className="font-mono text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">{getNormalizedSubjectCode(pyq.subject_code)}</p>
                                                </div>
                                            </div>
                                            <Badge variant="success" className="text-[8px]">ACTIVE_NODE</Badge>
                                        </div>
                                    ))}
                                    <Link href="/explore" className="block w-full py-4 text-center text-[10px] font-mono font-black text-[#6B7280] hover:text-[#111827] uppercase tracking-[0.2em] bg-[#F9FAFB] border-t border-[#111827]/10 transition-colors">
                                        LOAD_FULL_LOG_FILE
                                    </Link>
                                </>
                            ) : (
                                <div className="p-10 text-center text-[#6B7280] font-mono text-[10px] uppercase tracking-widest">
                                    No records found in active archive
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import UploadForm from '@/components/UploadForm'
import Badge from '@/components/Badge'
import { Shield, FileText, Users, Activity, Lock, Loader2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import { usePapers } from '@/hooks/usePapers'
import { getCleanSubjectTitle } from '@/lib/subject-titles'

const adminStats = [
    { label: 'Total Paper Archive', value: '1,240', icon: FileText },
    { label: 'Verified Identities', value: '3,200', icon: Users },
    { label: 'Inbound Inquiries', value: '+48', icon: Activity },
]

export default function AdminPage() {
    const { papers: recentPYQs, loading } = usePapers({}, 1)

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
                                ADMIN_SECURE_NODE
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter leading-none">
                                CONTENT EXTRACTOR.
                            </h1>
                        </div>
                    </div>
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
                            {loading ? (
                                <div className="p-20 flex justify-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#4338CA]" />
                                </div>
                            ) : (
                                <>
                                    {recentPYQs.map((pyq) => (
                                        <div key={pyq.id} className="p-6 flex items-start justify-between gap-6 hover:bg-black/5 transition-colors group">
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-[#111827] uppercase tracking-tight line-clamp-1 group-hover:text-[#4338CA] transition-colors break-words">
                                                    {pyq.paper_title}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="font-mono text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">INGESTED: ACTIVE</p>
                                                    <div className="w-1 h-1 rounded-full bg-[#111827]/10" />
                                                    <p className="font-mono text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">{pyq.subject_code}</p>
                                                </div>
                                            </div>
                                            <Badge variant="success" className="text-[8px]">ACTIVE_NODE</Badge>
                                        </div>
                                    ))}
                                    <button className="w-full py-4 text-center text-[10px] font-mono font-black text-[#6B7280] hover:text-[#111827] uppercase tracking-[0.2em] bg-[#F9FAFB] border-t border-[#111827]/10 transition-colors">
                                        LOAD_FULL_LOG_FILE
                                    </button>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

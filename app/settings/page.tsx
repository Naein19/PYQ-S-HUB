'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    User,
    Lock,
    Trash2,
    Save,
    Key,
    Mail,
    Fingerprint,
    Calendar,
    ShieldAlert,
    X,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Activity,
    BookOpen
} from 'lucide-react'
import Loading from '@/components/ui/Loading'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { departments } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    // Profile State
    const [profileData, setProfileData] = useState({
        full_name: '',
        program_type: '',
        department: '',
        semester: '',
    })

    // Password State
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    })

    // UI States
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
    const [isDeletingAccount, setIsDeletingAccount] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
        if (user) {
            setProfileData({
                full_name: user.user_metadata?.full_name || '',
                program_type: user.user_metadata?.program_type || 'BTech',
                department: user.user_metadata?.department || '',
                semester: user.user_metadata?.semester || '1',
            })
        }
    }, [user, authLoading, router])

    if (!user && !authLoading) return null

    const getSemesterOptions = (programType: string) => {
        const maxSem = programType === 'BTech' ? 8 : 4
        return Array.from({ length: maxSem }, (_, i) => ({
            label: `Semester ${i + 1}`,
            value: (i + 1).toString(),
        }))
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdatingProfile(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: profileData.full_name,
                    program_type: profileData.program_type,
                    department: profileData.department,
                    semester: profileData.semester,
                }
            })

            if (error) throw error
            setMessage({ type: 'success', text: 'Identity metadata synchronized successfully.' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to sync identity.' })
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.new !== passwordData.confirm) {
            setMessage({ type: 'error', text: 'Security tokens do not match.' })
            return
        }

        setIsUpdatingPassword(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.new
            })

            if (error) throw error
            setMessage({ type: 'success', text: 'Security token re-encrypted. Please use new credentials next time.' })
            setPasswordData({ current: '', new: '', confirm: '' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Token re-encryption failed.' })
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    const handleDeleteAccount = async () => {
        // In a real Supabase setup, you'd usually call an edge function or 
        // handle this via a specific admin API since client-side deletion is restricted.
        // For this implementation, we simulate the flow.
        setIsDeletingAccount(true)
        try {
            // Mocking deletion lag
            await new Promise(resolve => setTimeout(resolve, 2000))
            setMessage({ type: 'error', text: 'Account deletion requires secondary biometric clearance. Contact Administrator.' })
            setShowDeleteModal(false)
        } finally {
            setIsDeletingAccount(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FBF9F7] pb-20 animate-fade-in font-sans">
            {/* Context Header */}
            <div className="bg-[#111827] text-white py-4 border-b border-[#4338CA]/30">
                <div className="container-main flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#4338CA]">
                            <ShieldCheck className="w-4 h-4" />
                            Security_Level: AUTHORIZED
                        </div>
                        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            <Activity className="w-3 h-3" />
                            Terminal: CONFIG_MODULE_V2
                        </div>
                    </div>
                    <div className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                        LATENCY: 12MS
                    </div>
                </div>
            </div>

            <div className="container-main pt-12 lg:pt-20">
                <div className="max-w-5xl mx-auto">
                    {/* Page Title */}
                    <div className="mb-16 pb-8 border-b-2 border-[#111827]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-2 py-0.5 bg-[#4338CA] text-white text-[9px] font-mono font-black uppercase tracking-widest rounded-sm">
                                SYSTEM_PREFERENCES
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#111827] uppercase tracking-tighter leading-none">
                            IDENTITY <br /> CONFIG.
                        </h1>
                    </div>

                    {/* Global Message Display */}
                    {message && (
                        <div className={cn(
                            "mb-10 p-5 border-l-4 rounded-sm animate-in slide-in-from-top-4 duration-300",
                            message.type === 'success' ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
                        )}>
                            <div className="flex items-center gap-3">
                                {message.type === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                                <p className={cn(
                                    "text-xs font-black uppercase tracking-tight",
                                    message.type === 'success' ? "text-green-800" : "text-red-800"
                                )}>
                                    {message.text}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            <section>
                                <h3 className="text-[10px] font-mono font-black text-[#111827] uppercase tracking-[0.3em] mb-6 flex items-center gap-2 text-[#6B7280]">
                                    <Fingerprint className="w-3 h-3" />
                                    IMMUTABLE_IDENTITY
                                </h3>
                                <Card noHover className="bg-[#111827] text-white p-8 relative overflow-hidden">
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-widest">EMAIL_ADDRESS</span>
                                            <span className="text-sm font-black text-white truncate">{user?.email}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-widest">UNIQUE_IDENTIFIER</span>
                                            <span className="text-[11px] font-mono font-bold text-white/60 truncate">{user?.id}</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-mono font-black text-white/30 uppercase tracking-widest text-[#6B7280]">CREATED_ON</span>
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-white/80">
                                                    <Calendar className="w-3 h-3 opacity-40" />
                                                    {new Date(user?.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </section>

                            <div className="p-6 bg-[#EAE0D5] border-2 border-[#111827]/10 rounded-sm">
                                <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-widest mb-4">Support Terminal</h4>
                                <p className="text-[11px] text-[#6B7280] font-medium leading-relaxed mb-6">
                                    Identity errors or archival discrepancies? Submit a synchronization ticket to high-level clearance.
                                </p>
                                <Button variant="secondary" className="w-full text-[10px] font-black tracking-widest uppercase py-3">
                                    OPEN_TICKET
                                </Button>
                            </div>
                        </aside>

                        {/* Main Settings Content */}
                        <div className="lg:col-span-8 space-y-16">
                            {/* Profile Configuration */}
                            <section>
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#111827]/10">
                                    <User className="w-5 h-5 text-[#4338CA]" />
                                    <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">PROFILE_SYNCHRONIZATION</h2>
                                </div>
                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                            Full Name (Legal Identity)
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            className="w-full bg-white border-2 border-[#111827] rounded-sm px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#4338CA]/10 transition-all uppercase tracking-tight"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Select
                                            label="Academic Program"
                                            options={[
                                                { label: 'BTECH', value: 'BTech' },
                                                { label: 'MTECH', value: 'MTech' },
                                                { label: 'PHD', value: 'PhD' },
                                                { label: 'SCHOLAR', value: 'Scholar' },
                                            ]}
                                            value={profileData.program_type}
                                            onChange={(val) => {
                                                const maxSem = val === 'BTech' ? 8 : 4
                                                const currentSem = parseInt(profileData.semester)
                                                setProfileData({
                                                    ...profileData,
                                                    program_type: val,
                                                    semester: currentSem > maxSem ? '1' : profileData.semester
                                                })
                                            }}
                                        />
                                        <Select
                                            label="Department Unit"
                                            options={departments.map(d => ({ label: d.shortName, value: d.name }))}
                                            value={profileData.department}
                                            onChange={(val) => setProfileData({ ...profileData, department: val })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                            Active Semester Cycle
                                        </label>
                                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                            {getSemesterOptions(profileData.program_type).map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setProfileData({ ...profileData, semester: opt.value })}
                                                    className={cn(
                                                        "py-3 text-[11px] font-black border transition-all rounded-sm",
                                                        profileData.semester === opt.value
                                                            ? "bg-[#111827] text-white border-[#111827] shadow-[4px_4px_0px_#4338CA]"
                                                            : "bg-white text-[#111827] border-[#111827]/10 hover:border-[#111827]"
                                                    )}
                                                >
                                                    {opt.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        isLoading={isUpdatingProfile}
                                        className="py-4 px-8 text-xs font-black uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        SYNC_IDENTITY_PROFILE
                                    </Button>
                                </form>
                            </section>

                            {/* Security & Access */}
                            <section>
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#111827]/10">
                                    <Lock className="w-5 h-5 text-[#4338CA]" />
                                    <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">SECURITY_TOKENS</h2>
                                </div>
                                <form onSubmit={handleUpdatePassword} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                                New Security Token
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                className="w-full bg-white border-2 border-[#111827] rounded-sm px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#4338CA]/10 transition-all"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                                Confirm Token
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={passwordData.confirm}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                className="w-full bg-white border-2 border-[#111827] rounded-sm px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#4338CA]/10 transition-all"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <Button
                                            type="submit"
                                            isLoading={isUpdatingPassword}
                                            className="w-full md:w-auto py-4 px-8 text-xs font-black uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <Key className="w-4 h-4" />
                                            RE_ENCRYPT_LOGIN
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => user?.email && supabase.auth.resetPasswordForEmail(user.email)}
                                            className="text-[10px] font-black text-[#6B7280] hover:text-[#111827] uppercase tracking-[0.2em] underline underline-offset-4"
                                        >
                                            Trigger Recovery Key Reset
                                        </button>
                                    </div>
                                </form>
                            </section>

                            {/* Danger Zone */}
                            <section className="pt-12 border-t-2 border-red-500/20">
                                <div className="bg-red-50/50 border border-red-500/20 p-10 rounded-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div>
                                            <div className="flex items-center gap-2 text-red-600 mb-2">
                                                <ShieldAlert className="w-5 h-5" />
                                                <h3 className="text-lg font-black uppercase tracking-tight">TERMINAL_DELETION</h3>
                                            </div>
                                            <p className="text-xs font-medium text-red-900/60 leading-relaxed max-w-md">
                                                Initiating this protocol will permanently purge your academic identity and all associated archives. This action is <span className="font-black italic">IRREVERSIBLE</span>.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="bg-red-600 hover:bg-black text-white hover:text-red-500 border-none px-10 py-4 text-xs font-black uppercase tracking-widest"
                                        >
                                            PURGE_ENTITY
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Deletion Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-[#111827]/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowDeleteModal(false)} />

                    <div className="relative w-full max-w-md bg-white border-4 border-red-600 rounded-sm shadow-[20px_20px_0px_#111827] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                HIGH_ALERT_REQD
                            </span>
                            <button onClick={() => setShowDeleteModal(false)} className="hover:rotate-90 transition-transform">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-50 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Trash2 className="w-10 h-10 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tighter mb-4 leading-tight">
                                CONFIRM TOTAL <br /> IDENTITY PURGE?
                            </h2>
                            <p className="text-sm font-medium text-[#6B7280] leading-relaxed mb-10">
                                This will erase <span className="text-[#111827] font-black">{user.email}</span> from the central archive. You will lose access to all peer resources and personal logs.
                            </p>

                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={handleDeleteAccount}
                                    isLoading={isDeletingAccount}
                                    className="w-full bg-red-600 border-none py-4 text-sm font-black uppercase tracking-widest"
                                >
                                    PROCEED_WITH_PURGE
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full py-4 text-sm font-black uppercase tracking-widest"
                                >
                                    ABORT_OPERATION
                                </Button>
                            </div>
                        </div>

                        <div className="bg-[#F9FAFB] border-t border-[#111827]/5 px-6 py-3 flex items-center justify-center font-mono text-[9px] font-black text-[#111827]/20 uppercase tracking-[0.4em]">
                            PURGE_SEQ: 0x948271
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

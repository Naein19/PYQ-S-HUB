'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, User, Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, Activity } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { departments } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        program_type: 'BTech',
        department: '',
        semester: '1',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const validateEmail = (email: string) => {
        return email.toLowerCase().endsWith('@vitapstudent.ac.in')
    }

    const getSemesterOptions = (programType: string) => {
        const maxSem = programType === 'BTech' ? 8 : 4
        return Array.from({ length: maxSem }, (_, i) => ({
            label: `Semester ${i + 1}`,
            value: (i + 1).toString(),
        }))
    }

    const handleProgramChange = (val: string) => {
        const resetSemester = val === 'BTech' ? formData.semester : (parseInt(formData.semester) > 4 ? '1' : formData.semester)
        setFormData({ ...formData, program_type: val, semester: resetSemester })
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        // Basic Validation
        if (!formData.name || !formData.email || !formData.password || !formData.department) {
            setError('All fields are required.')
            return
        }

        if (!validateEmail(formData.email)) {
            setError('Only VIT-AP student email addresses are allowed.')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setIsLoading(true)

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        program_type: formData.program_type,
                        department: formData.department,
                        semester: formData.semester,
                    },
                },
            })

            if (signUpError) throw signUpError

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#EAE0D5] flex items-center justify-center px-6 py-16 animate-fade-in">
            <div className="w-full max-w-md">
                {/* Header Meta */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <Link href="/" className="mb-8 group">
                        <span className="flex items-center justify-center w-12 h-12 rounded-sm bg-[#111827] text-white shadow-[4px_4px_0px_#4338CA] transition-transform group-hover:scale-105">
                            <BookOpen className="w-6 h-6" />
                        </span>
                    </Link>
                    <p className="text-[10px] font-mono font-black text-[#4338CA] uppercase tracking-[0.3em] mb-4">Industrial Registration</p>
                    <h1 className="text-4xl font-black text-[#111827] uppercase tracking-tighter mb-4 leading-none">CREATE IDENTITY.</h1>
                    <p className="text-[#6B7280] font-medium">Register your academic credentials to join the archive.</p>
                </div>

                <Card className="p-10 bg-white">
                    {success ? (
                        <div className="flex flex-col items-center text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-black text-[#111827] uppercase tracking-tight mb-3">Verification Sent</h2>
                            <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
                                We've sent a verification link to <span className="font-bold text-[#111827]">{formData.email}</span>. Please check your inbox to activate your account.
                            </p>
                            <Link href="/login" className="w-full">
                                <Button variant="secondary" className="w-full py-3 text-xs font-black uppercase tracking-widest">
                                    RETURN TO LOGIN
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="flex flex-col gap-8">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-shake">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                        <p className="text-[11px] font-bold text-red-800 uppercase tracking-tight leading-tight">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                    <User className="w-3 h-3" />
                                    Legal name (Identity)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="ENT_STRING_NAME"
                                    className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm px-4 py-3 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-white transition-all uppercase tracking-tight"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                    <Mail className="w-3 h-3" />
                                    Academic Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="IDENT_STRING@VITAPSTUDENT.AC.IN"
                                    className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm px-4 py-3 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-white transition-all uppercase tracking-tight"
                                />
                            </div>

                            {/* Program Type & Department */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                        <BookOpen className="w-3 h-3" />
                                        Program
                                    </label>
                                    <select
                                        value={formData.program_type}
                                        onChange={(e) => handleProgramChange(e.target.value)}
                                        className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="BTech">BTECH</option>
                                        <option value="MTech">MTECH</option>
                                        <option value="PhD">PHD</option>
                                        <option value="Scholar">SCHOLAR</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                        <User className="w-3 h-3" />
                                        Department
                                    </label>
                                    <select
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>SELECT UNIT</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.name}>{dept.shortName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Semester Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                    <Activity className="w-3 h-3" />
                                    Active Semester Cycle
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {getSemesterOptions(formData.program_type).map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, semester: opt.value })}
                                            className={cn(
                                                "py-3 text-[10px] font-black border transition-all rounded-sm",
                                                formData.semester === opt.value
                                                    ? "bg-[#111827] text-white border-[#111827] shadow-[2px_2px_0px_#4338CA]"
                                                    : "bg-white text-[#111827] border-[#111827]/10 hover:border-[#111827]"
                                            )}
                                        >
                                            SEM {opt.value}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                    <Lock className="w-3 h-3" />
                                    Security Token (Password)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••••••"
                                        className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm px-4 py-3 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111827]/40 hover:text-[#111827] transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full py-4 text-sm font-black uppercase tracking-[0.2em] group"
                            >
                                GENERATE IDENTITY
                                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />}
                            </Button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-10 pt-10 border-t border-[#111827]/10 text-center">
                            <p className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest mb-6">
                                Already have an identity?
                            </p>
                            <Link href="/login">
                                <Button variant="secondary" className="w-full py-3 text-xs font-black uppercase tracking-widest">
                                    ACCESS REPOSITORY
                                </Button>
                            </Link>
                        </div>
                    )}
                </Card>

                {/* Footer Meta */}
                <div className="mt-10 text-center">
                    <p className="text-[8px] font-mono text-[#111827]/30 uppercase tracking-[0.3em]">
                        ACADEMIC CLEARANCE v2.0.4-REG
                    </p>
                </div>
            </div>
        </div>
    )
}

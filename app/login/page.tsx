'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, User, Lock, ArrowRight, AlertCircle, CheckCircle2, Mail } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { normalizeEmail, isVitapEmail } from '@/lib/validation'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showForgot, setShowForgot] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleSendResetEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const normalizedEmail = normalizeEmail(email)

        if (!isVitapEmail(normalizedEmail)) {
            setError('Enter a valid VIT-AP student email')
            setLoading(false)
            return
        }

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (resetError) throw resetError

            setMessage('Reset link sent. Check your email.')
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const normalizedEmail = normalizeEmail(email)

        if (!isVitapEmail(normalizedEmail)) {
            setError('Enter a valid VIT-AP student email')
            setLoading(false)
            return
        }

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password,
            })

            if (authError) throw authError

            if (data?.user) {
                // Redirect to admin after successful login
                router.push('/admin')
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    const isEmailValid = email === '' || isVitapEmail(email)

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[var(--color-surface)] flex items-center justify-center px-6 py-12 animate-fade-in">
            <div className="w-full max-w-md">
                {/* Header Meta */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <Link href="/" className="mb-8 group">
                        <span className="flex items-center justify-center w-12 h-12 rounded-sm bg-[#4338CA] text-white shadow-[4px_4px_0px_var(--color-border)] transition-transform group-hover:scale-105">
                            <BookOpen className="w-6 h-6" />
                        </span>
                    </Link>
                    <p className="text-[10px] font-mono font-black text-[#4338CA] uppercase tracking-[0.3em] mb-4">
                        Industrial Authentication
                    </p>
                    <h1 className="text-4xl font-black text-[var(--color-text)] uppercase tracking-tighter mb-4 leading-none transition-colors">
                        Get Started.
                    </h1>
                    <p className="text-[var(--color-muted)] font-medium transition-colors">Verify your credentials to manage the repository.</p>
                </div>

                <div className="card-frame p-10 bg-[var(--color-card)] relative overflow-hidden border border-[var(--color-border)] shadow-xl transition-colors">
                    {/* Subtle progress bar if loading */}
                    {loading && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-border)] overflow-hidden">
                            <div className="h-full bg-[#4338CA] animate-progress" style={{ width: '50%' }}></div>
                        </div>
                    )}

                    {!showForgot ? (
                        <form onSubmit={handleLogin} className="flex flex-col gap-8">
                            {/* Email */}
                            <div className="space-y-3">
                                <label className="flex items-center justify-between gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Mail className={cn("w-3 h-3", !isEmailValid && email !== '' ? "text-red-500" : "")} />
                                        User Identity (Email)
                                    </div>
                                    {!isEmailValid && email !== '' && (
                                        <span className="text-[8px] text-red-500 normal-case font-bold animate-pulse transition-colors">INVALID_FORMAT</span>
                                    )}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        const val = e.target.value.toLowerCase().replace(/\s+/g, '').replace(/\.@/g, '@');
                                        setEmail(val);
                                    }}
                                    placeholder="name.regno@vitapstudent.ac.in"
                                    className={cn(
                                        "w-full bg-[var(--color-surface)] border rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 transition-all uppercase tracking-tight",
                                        !isEmailValid && email !== ''
                                            ? "border-red-500/50 focus:ring-red-500 focus:bg-red-500/5"
                                            : "border-[var(--color-border)] focus:ring-[#4338CA] focus:bg-[var(--color-card)]"
                                    )}
                                />
                                <p className={cn(
                                    "text-[9px] font-medium leading-relaxed transition-colors",
                                    !isEmailValid && email !== '' ? "text-red-500" : "text-[var(--color-muted)]"
                                )}>
                                    Use your VIT-AP student email (must end with @vitapstudent.ac.in)
                                </p>
                            </div>

                            {/* Password */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest transition-colors">
                                        <Lock className="w-3 h-3" />
                                        Access Key (Password)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgot(true)
                                            setError(null)
                                            setMessage(null)
                                        }}
                                        className="text-[10px] font-mono font-bold text-[#4338CA] hover:underline uppercase tracking-tight"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-[var(--color-card)] transition-all"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-[10px] font-mono font-bold uppercase tracking-tight animate-shake">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || !isVitapEmail(email)}
                                className={cn(
                                    "w-full py-4 text-sm font-black uppercase tracking-[0.2em] group shadow-[4px_4px_0px_rgba(67,56,202,0.2)] hover:shadow-[6px_6px_0px_rgba(67,56,202,0.3)] transition-all",
                                    (loading || !isVitapEmail(email)) && "opacity-50 grayscale cursor-not-allowed shadow-none hover:shadow-none"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <Loading size="sm" className="mr-2" />
                                        AUTHENTICATING...
                                    </>
                                ) : (
                                    <>
                                        INITIATE SESSION
                                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSendResetEmail} className="flex flex-col gap-8">
                            {/* Email */}
                            <div className="space-y-3">
                                <label className="flex items-center justify-between gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Mail className={cn("w-3 h-3", !isEmailValid && email !== '' ? "text-red-500" : "")} />
                                        User Identity (Email)
                                    </div>
                                    {!isEmailValid && email !== '' && (
                                        <span className="text-[8px] text-red-500 normal-case font-bold animate-pulse transition-colors">INVALID_FORMAT</span>
                                    )}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        const val = e.target.value.toLowerCase().replace(/\s+/g, '').replace(/\.@/g, '@');
                                        setEmail(val);
                                    }}
                                    placeholder="name.regno@vitapstudent.ac.in"
                                    className={cn(
                                        "w-full bg-[var(--color-surface)] border rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 transition-all uppercase tracking-tight",
                                        !isEmailValid && email !== ''
                                            ? "border-red-500/50 focus:ring-red-500 focus:bg-red-500/5"
                                            : "border-[var(--color-border)] focus:ring-[#4338CA] focus:bg-[var(--color-card)]"
                                    )}
                                />
                                <p className={cn(
                                    "text-[9px] font-medium leading-relaxed transition-colors",
                                    !isEmailValid && email !== '' ? "text-red-500" : "text-[var(--color-muted)]"
                                )}>
                                    Use your VIT-AP student email (must end with @vitapstudent.ac.in)
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-[10px] font-mono font-bold uppercase tracking-tight animate-shake">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {message && (
                                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-sm text-green-500 text-[10px] font-mono font-bold uppercase tracking-tight">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <p>{message}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || !isVitapEmail(email)}
                                className={cn(
                                    "w-full py-4 text-sm font-black uppercase tracking-[0.2em] group shadow-[4px_4px_0px_rgba(67,56,202,0.2)] hover:shadow-[6px_6px_0px_rgba(67,56,202,0.3)] transition-all",
                                    (loading || !isVitapEmail(email)) && "opacity-50 grayscale cursor-not-allowed shadow-none hover:shadow-none"
                                )}
                            >
                                {loading ? (
                                    <>
                                        <Loading size="sm" className="mr-2" />
                                        SENDING...
                                    </>
                                ) : (
                                    <>
                                        SEND RESET LINK
                                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgot(false)
                                    setError(null)
                                    setMessage(null)
                                }}
                                className="text-[10px] font-mono font-black text-[var(--color-muted)] hover:text-[var(--color-text)] uppercase tracking-widest transition-colors"
                            >
                                ← BACK TO LOGIN
                            </button>
                        </form>
                    )}

                    <div className="mt-10 pt-10 border-t border-[var(--color-border)]/10 text-center">
                        <p className="text-[8px] font-mono font-black text-[var(--color-muted)] uppercase tracking-[0.3em] transition-colors">
                            SECURE ADMINISTRATIVE GATEWAY
                        </p>
                        <div className="mt-10 text-center">
                            <Link href="/" className="text-[10px] font-mono font-black text-[var(--color-muted)] hover:text-[var(--color-text)] uppercase tracking-widest transition-colors">
                                ← RETURN TO PUBLIC REPOSITORY
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

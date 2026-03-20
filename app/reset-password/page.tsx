'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [checkingSession, setCheckingSession] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [sessionValid, setSessionValid] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data } = await supabase.auth.getSession()
                if (data?.session) {
                    setSessionValid(true)
                } else {
                    setError('Invalid or expired reset link')
                    setSessionValid(false)
                }
            } catch (err) {
                setError('Failed to verify session')
                setSessionValid(false)
            } finally {
                setCheckingSession(false)
            }
        }

        checkSession()
    }, [])

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            })

            if (updateError) throw updateError

            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Failed to update password.')
        } finally {
            setLoading(false)
        }
    }

    if (checkingSession) {
        return (
            <div className="min-h-[calc(100vh-5rem)] bg-[var(--color-surface)] flex items-center justify-center">
                <Loading size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[var(--color-surface)] flex items-center justify-center px-6 py-12 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10 text-center">
                    <Link href="/" className="mb-8 group">
                        <span className="flex items-center justify-center w-12 h-12 rounded-sm bg-[#4338CA] text-white shadow-[4px_4px_0px_var(--color-border)] transition-transform group-hover:scale-105">
                            <BookOpen className="w-6 h-6" />
                        </span>
                    </Link>
                    <p className="text-[10px] font-mono font-black text-[#4338CA] uppercase tracking-[0.3em] mb-4">
                        Security Protocol
                    </p>
                    <h1 className="text-4xl font-black text-[var(--color-text)] uppercase tracking-tighter mb-4 leading-none">
                        Reset Access.
                    </h1>
                    <p className="text-[var(--color-muted)] font-medium">Update your security token to restore access.</p>
                </div>

                <Card className="p-10 relative overflow-hidden">
                    {loading && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-border)] overflow-hidden">
                            <div className="h-full bg-[#4338CA] animate-progress" style={{ width: '50%' }}></div>
                        </div>
                    )}

                    {success ? (
                        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-black text-[var(--color-text)] uppercase tracking-tight mb-3">Password Updated</h2>
                            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-8 font-medium">
                                Your access key has been successfully reconfigured. Redirecting to gateway...
                            </p>
                            <Link href="/login" className="w-full">
                                <Button className="w-full py-3 text-xs font-black uppercase tracking-widest">
                                    PROCEED TO LOGIN
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-8">
                            <div className="space-y-6">
                                {/* New Password */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                                        <Lock className="w-3 h-3" />
                                        New Access Key
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        disabled={!sessionValid}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] transition-all disabled:opacity-50"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                                        <Lock className="w-3 h-3" />
                                        Confirm Access Key
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        disabled={!sessionValid}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-[10px] font-mono font-bold uppercase tracking-tight animate-shake">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || !sessionValid}
                                className="w-full py-4 text-sm font-black uppercase tracking-[0.2em] group"
                            >
                                {loading ? (
                                    <>
                                        <Loading size="sm" className="mr-2" />
                                        UPDATING...
                                    </>
                                ) : (
                                    <>
                                        RECONFIGURE ACCESS
                                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>

                            {!sessionValid && (
                                <Link
                                    href="/login"
                                    className="text-[10px] font-mono font-bold text-[#4338CA] hover:underline uppercase tracking-tight text-center"
                                >
                                    Return to Login
                                </Link>
                            )}
                        </form>
                    )}
                </Card>

                <div className="mt-10 pt-10 border-t border-[var(--color-border)] text-center">
                    <p className="text-[8px] font-mono text-[var(--color-muted)] uppercase tracking-[0.3em]">
                        SECURE ADMINISTRATIVE GATEWAY
                    </p>
                </div>
            </div>
        </div>
    )
}

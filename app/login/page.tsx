'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, User, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
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
                    <h1 className="text-4xl font-black text-[var(--color-text)] uppercase tracking-tighter mb-4 leading-none">
                        Get Started.
                    </h1>
                    <p className="text-[var(--color-muted)] font-medium">Verify your credentials to manage the repository.</p>
                </div>

                <div className="card-frame bg-[var(--color-card)] relative overflow-hidden border border-[var(--color-border)]">
                    {/* Subtle progress bar if loading */}
                    {loading && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-border)] overflow-hidden">
                            <div className="h-full bg-[#4338CA] animate-progress" style={{ width: '50%' }}></div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-8">
                        {/* Email */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                                <User className="w-3 h-3" />
                                User Identity (Email)
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="USER.22XXX1234@VITAPSTUDENT.AC.IN"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] transition-all uppercase tracking-tight"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[var(--color-text)] uppercase tracking-widest">
                                    <Lock className="w-3 h-3" />
                                    Access Key (Password)
                                </label>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm px-4 py-3 text-xs font-bold text-[var(--color-text)] placeholder:text-[var(--color-text)]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] transition-all"
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
                            disabled={loading}
                            className="w-full py-4 text-sm font-black uppercase tracking-[0.2em] group"
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

                    <div className="mt-10 pt-10 border-t border-[var(--color-border)] text-center">
                        <p className="text-[8px] font-mono text-[var(--color-muted)] uppercase tracking-[0.3em]">
                            SECURE ADMINISTRATIVE GATEWAY
                        </p>
                        <div className="mt-10 text-center">
                            <Link href="/" className="text-[10px] font-mono font-bold text-[var(--color-muted)] hover:text-[var(--color-text)] uppercase tracking-widest">
                                ← RETURN TO PUBLIC REPOSITORY
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Footer Meta */}
                {/* <div className="mt-10 text-center">
                    <Link href="/" className="text-[10px] font-mono font-bold text-[#6B7280] hover:text-[#111827] uppercase tracking-widest">
                        ← RETURN TO PUBLIC REPOSITORY
                    </Link>
                </div> */}
            </div>
        </div>
    )
}

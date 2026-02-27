import Link from 'next/link'
import { BookOpen, User, Lock, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Log in — Industrial Access' }

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#EAE0D5] flex items-center justify-center px-6 py-12 animate-fade-in">
            <div className="w-full max-w-md">
                {/* Header Meta */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <Link href="/" className="mb-8 group">
                        <span className="flex items-center justify-center w-12 h-12 rounded-sm bg-[#111827] text-white shadow-[4px_4px_0px_#4338CA] transition-transform group-hover:scale-105">
                            <BookOpen className="w-6 h-6" />
                        </span>
                    </Link>
                    <p className="text-[10px] font-mono font-black text-[#4338CA] uppercase tracking-[0.3em] mb-4">Industrial Authentication</p>
                    <h1 className="text-4xl font-black text-[#111827] uppercase tracking-tighter mb-4 leading-none">ACCESS ARCHIVE.</h1>
                    <p className="text-[#6B7280] font-medium">Verify your credentials to enter the repository.</p>
                </div>

                <Card className="p-10 bg-white">
                    <form className="flex flex-col gap-8">
                        {/* Email */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                <User className="w-3 h-3" />
                                User Identity (Email)
                            </label>
                            <input
                                type="email"
                                placeholder="IDENT_STRING@UNIVERSITY.EDU"
                                className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm px-4 py-3 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-white transition-all uppercase tracking-tight"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black text-[#111827] uppercase tracking-widest">
                                    <Lock className="w-3 h-3" />
                                    Access Key (Password)
                                </label>
                                <Link href="#" className="text-[10px] font-mono font-bold text-[#6B7280] hover:text-[#111827] uppercase">FORGOT?</Link>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full bg-[#F9FAFB] border border-[#111827] rounded-sm px-4 py-3 text-xs font-bold placeholder:text-[#111827]/20 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:bg-white transition-all"
                            />
                        </div>

                        <Button type="submit" className="w-full py-4 text-sm font-black uppercase tracking-[0.2em] group">
                            INITIATE SESSION
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-[#111827]/10 text-center">
                        <p className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest mb-6">
                            New to the industrial repository?
                        </p>
                        <Link href="/register">
                            <Button variant="secondary" className="w-full py-3 text-xs font-black uppercase tracking-widest">
                                CREATE ARCHIVE IDENTITY
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Footer Meta */}
                <div className="mt-10 text-center">
                    <p className="text-[8px] font-mono text-[#111827]/30 uppercase tracking-[0.3em]">
                        SECURE ACADEMIC GATEWAY v2.0.4
                    </p>
                </div>
            </div>
        </div>
    )
}

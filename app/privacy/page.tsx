import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Lock, EyeOff, ShieldCheck } from 'lucide-react'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'Privacy Policy | PYQ\'s Hub',
    description: 'Understand how we protect your data and maintain total privacy on the PYQ\'s Hub archive.',
    openGraph: {
        title: 'Privacy Policy | PYQ\'s Hub',
        description: 'Your data security and privacy are our top operational priorities.',
    },
}

export default function PrivacyPage() {
    return (
        <main className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 bg-[#0A0A0A] overflow-hidden border-b border-white/5">
                <div className="container-main relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#4338CA]/30 bg-[#4338CA]/5 mb-8 lg:mb-12 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#4338CA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />
                            DATA_ENCRYPTION_LAYER_v3.2
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.85]">
                            PRIVACY <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>PROTOCOL.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] max-w-2xl font-medium leading-relaxed">
                            Your academic journey is private. Our infrastructure is built to protect your identity
                            and data with industrial-grade security via Supabase.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="bg-white py-24 lg:py-32">
                <div className="container-main">
                    <div className="max-w-[800px] mx-auto">
                        <div className="space-y-16">
                            {/* Section 1 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    01 // DATA_COLLECTION
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Minimalist Architecture.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    We only collect the essential data required for authentication and archive synchronization.
                                    This includes your email address and basic profile information used strictly for
                                    granting access to specialized repositories.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm text-center">
                                        <Lock className="w-6 h-6 text-[#4338CA] mx-auto mb-4" />
                                        <h4 className="font-black text-[10px] text-[#111827] uppercase tracking-widest">NO_RESALE</h4>
                                    </div>
                                    <div className="p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm text-center">
                                        <EyeOff className="w-6 h-6 text-[#4338CA] mx-auto mb-4" />
                                        <h4 className="font-black text-[10px] text-[#111827] uppercase tracking-widest">NO_TRACKING</h4>
                                    </div>
                                    <div className="p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm text-center">
                                        <ShieldCheck className="w-6 h-6 text-[#4338CA] mx-auto mb-4" />
                                        <h4 className="font-black text-[10px] text-[#111827] uppercase tracking-widest">ENCRYPTED</h4>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    02 // SECURITY_INFRASTRUCTURE
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Supabase Powered Security.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    All user authentication and database operations are processed through Supabase,
                                    ensuring that your password never touches our servers. Your data is protected by
                                    PostgreSQL Row-Level Security, guaranteeing that only you can access your personal settings.
                                </p>
                                <p className="text-lg text-[#4B5563] leading-relaxed">
                                    We employ TLS encryption for all data in transit and industry-standard hashing protocols
                                    for all stored credentials.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    03 // YOUR_RIGHTS
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Total Data Agency.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    You have full agency over your archival data. You can request a full data export or
                                    permanent deletion of your account at any time via the user preferences panel.
                                </p>
                                <p className="text-sm font-mono text-[#6B7280] bg-[#F3F4F6] p-4 border-l-2 border-[#4338CA]">
                                    LAST_UPDATE_TIMESTAMP: MARCH_2026_01
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#F3F4F6] border-t border-[#111827]/5">
                <div className="container-main text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter mb-10">
                        TRUSTED ACADEMIC ARCHIVING
                    </h2>
                    <Link href="/explore">
                        <Button size="lg" className="px-12 py-6 uppercase tracking-[0.2em] font-black group">
                            EXPLORE_VERIFIED_PYQS
                            <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    )
}

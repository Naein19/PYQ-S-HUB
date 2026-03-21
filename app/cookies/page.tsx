import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Cookie, Cog, ShieldCheck } from 'lucide-react'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'Cookie Policy | PYQ\'s Hub',
    description: 'Details on how we use functional cookies to manage your archival sessions and authentication.',
    openGraph: {
        title: 'Cookie Policy | PYQ\'s Hub',
        description: 'Transparency regarding technical cookies and session management.',
    },
}

export default function CookiesPage() {
    return (
        <main className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 bg-[#0A0A0A] overflow-hidden border-b border-white/5">
                <div className="container-main relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#4338CA]/30 bg-[#4338CA]/5 mb-8 lg:mb-12 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#4338CA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />
                            SESSION_DATA_OBJECTS_v1.4
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.85]">
                            COOKIE <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>MANAGEMENT.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] max-w-2xl font-medium leading-relaxed">
                            We use minimal, high-performance cookies to ensure your authentication tokens and
                            session preferences remain synchronized with the central repository.
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
                                    01 // ESSENTIAL_COOKIES
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Archive Sustainability.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    These cookies are strictly necessary for the operation of PYQ’s Hub. They enable
                                    core technical functions such as securing your login, maintaining your session
                                    during navigation, and preventing duplicate server requests.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-6 p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm">
                                        <Cookie className="w-6 h-6 text-[#4338CA] shrink-0" />
                                        <div>
                                            <h4 className="font-black text-[#111827] uppercase tracking-tight mb-1">AUTH_TOKEN</h4>
                                            <p className="text-sm text-[#6B7280]">Maintains your encrypted identity session with Supabase. Mandatory for repository access.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm">
                                        <Cog className="w-6 h-6 text-[#4338CA] shrink-0" />
                                        <div>
                                            <h4 className="font-black text-[#111827] uppercase tracking-tight mb-1">SESSION_PREF</h4>
                                            <p className="text-sm text-[#6B7280]">Stores interface parameters such as list/grid view types and filter persistence.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    02 // THIRD_PARTY_INTEGRATION
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Security Proxies.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    We do not allow marketing or advertising cookies from third parties. Our only external
                                    cookie interactions are with Supabase (Database Auth) and our production infrastructure partners,
                                    both of which follow strict non-tracking security standards.
                                </p>
                                <div className="p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm flex items-center gap-4">
                                    <ShieldCheck className="w-8 h-8 text-[#4338CA]" />
                                    <p className="font-bold text-[#111827] uppercase tracking-tight text-sm">NO MARKETING OR TRACKING PIXELS DETECTED IN ARCHIVE.</p>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    03 // CLIENT_SIDE_CONTROLS
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Full Control.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed">
                                    You can modify your browser settings to decline all cookies. However, please note that
                                    the archive synchronization and authentication protocols will be non-functional
                                    without essential session technical cookies.
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
                        TRANSPARENT SYSTEM OPERATIONS
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

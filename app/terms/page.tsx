import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, FileText, CheckSquare } from 'lucide-react'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'Terms of Use | PYQ\'s Hub',
    description: 'Guidelines and terms for accessing the PYQ\'s Hub industrial academic repository.',
    openGraph: {
        title: 'Terms of Use | PYQ\'s Hub',
        description: 'Review the operational parameters for using our academic archives.',
    },
}

export default function TermsPage() {
    return (
        <main className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 bg-[#0A0A0A] overflow-hidden border-b border-white/5">
                <div className="container-main relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#4338CA]/30 bg-[#4338CA]/5 mb-8 lg:mb-12 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#4338CA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />
                            USAGE_PROTOCOL_v4.1
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.85]">
                            TERMS OF <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>SERVICE.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] max-w-2xl font-medium leading-relaxed">
                            Access to the central archive is governed by these operational parameters.
                            By initializing a session, you agree to these legal conditions.
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
                                    01 // ELIGIBILITY_PARAMS
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Institutional Access.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    Access to the premium verified repositories is restricted to active students and educators
                                    within the engineering domain. Users are responsible for maintaining the security
                                    of their authentication tokens.
                                </p>
                                <div className="flex gap-4 p-4 bg-amber-50 border border-amber-200 rounded-sm">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                                    <p className="text-sm text-amber-800 font-medium italic">Sharing credentials with unauthorized third parties will result in immediate archival disconnection.</p>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    02 // LICENSE_STRUCTURE
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Non-Commercial Archive.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    PYQ’s Hub grants a limited, revocable license to access and view archival documents.
                                    Redistribution, commercial resale, or large-scale data scraping of the central
                                    repository is strictly prohibited by our automated security systems.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        { icon: FileText, text: "Documents are provided 'as-is' with experimental verification metadata." },
                                        { icon: CheckSquare, text: "Users retain ownership of their self-uploaded study materials." },
                                        { icon: AlertTriangle, text: "Institutional copyright holders can request document removal via DMCA protocol." }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4 items-center text-sm font-bold text-[#111827] uppercase tracking-tight">
                                            <item.icon className="w-4 h-4 text-[#4338CA]" />
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    03 // LIABILITY_MODELS
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Operational Continuity.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed">
                                    While we strive for 100% archive uptime, PYQ’s Hub is not liable for data loss or
                                    temporary repository desynchronization. We reserve the right to update these
                                    parameters to reflect technical advancements and legal requirements.
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
                        COMPLIANT ARCHIVE ACCESS
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

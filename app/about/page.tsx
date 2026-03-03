import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, ShieldCheck, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'About the Archive | VIT-AP Previous Year Papers',
    description: 'Learn about the mission, vision, and institutional infrastructure behind PYQ\'s Hub—the industrial-grade archive for VIT-AP engineering question papers.',
    openGraph: {
        title: 'About PYQ\'s Hub | VIT-AP Previous Year Papers',
        description: 'The industrial-grade archive for VIT-AP engineering students. Built for precision, structured for success.',
    },
}

export default function AboutPage() {
    return (
        <main className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 bg-[#0A0A0A] overflow-hidden border-b border-white/5">
                <div className="container-main relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#4338CA]/30 bg-[#4338CA]/5 mb-8 lg:mb-12 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#4338CA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />
                            ORGANIZATIONAL_PROVENANCE_v1.0
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.85]">
                            THE ARCHIVE <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>MANIFESTO.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] max-w-2xl font-medium leading-relaxed">
                            PYQ’s Hub is not just a repository. It is a structured engineering protocol designed to eliminate
                            academic noise and provide students with high-fidelity resource extraction.
                        </p>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none grayscale hidden lg:block">
                    <img
                        src="/assets/industrial_bg.png"
                        alt="Structural Element"
                        className="w-full h-full object-cover"
                    />
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
                                    01 // THE_MISSION
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Precision Over Proliferation.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    Engineering students are often overwhelmed by fragmented, low-quality study materials.
                                    Our mission is to consolidate verified, industrial-grade question papers into a single,
                                    high-performance archive.
                                </p>
                                <p className="text-lg text-[#4B5563] leading-relaxed">
                                    We believe that success in complex technical disciplines requires structured data.
                                    By providing a pixel-perfect, organized history of examinations, we enable students
                                    to prepare with surgical precision.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    02 // THE_INFRASTRUCTURE
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Architected for Speed.</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm">
                                        <ShieldCheck className="w-8 h-8 text-[#4338CA] mb-4" />
                                        <h4 className="font-black text-[#111827] uppercase tracking-tight mb-2">Verified Sourcing</h4>
                                        <p className="text-sm text-[#6B7280]">Every document undergoes a multi-stage verification protocol before being committed to the central archive.</p>
                                    </div>
                                    <div className="p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm">
                                        <Zap className="w-8 h-8 text-[#4338CA] mb-4" />
                                        <h4 className="font-black text-[#111827] uppercase tracking-tight mb-2">Rapid Extraction</h4>
                                        <p className="text-sm text-[#6B7280]">Real-time synchronization with Supabase ensures sub-second resource discovery across all subjects.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    03 // THE_FUTURE
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Evolution of Academics.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed">
                                    PYQ’s Hub is evolving into more than just a search tool. We are building the foundational
                                    data layer for engineering preparation—integrating analytics, tier-based classification,
                                    and community-driven verification to ensure the archive remains the gold standard
                                    for academic excellence.
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
                        READY TO SYNC WITH THE ARCHIVE?
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

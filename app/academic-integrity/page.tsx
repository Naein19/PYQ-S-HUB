import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Scale, FileCheck } from 'lucide-react'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'Academic Integrity | PYQ\'s Hub',
    description: 'Our commitment to ethical academic resource sharing and document verification.',
    openGraph: {
        title: 'Academic Integrity | PYQ\'s Hub',
        description: 'Maintaining the highest standards of academic honesty and resource integrity.',
    },
}

export default function AcademicIntegrityPage() {
    return (
        <main className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 bg-[#0A0A0A] overflow-hidden border-b border-white/5">
                <div className="container-main relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#4338CA]/30 bg-[#4338CA]/5 mb-8 lg:mb-12 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#4338CA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />
                            INTEGRITY_PROTOCOL_v2.0
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.85]">
                            ACADEMIC <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>INTEGRITY.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] max-w-2xl font-medium leading-relaxed">
                            Ensuring the ethical use of academic resources is fundamental to the architecture of PYQ’s Hub.
                            We prioritize accuracy, honesty, and institutional respect.
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
                                    01 // GUIDING_PRINCIPLES
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Institutional Respect.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    PYQ’s Hub operates as a non-commercial academic archive. We provide resources to facilitate
                                    preparation and understanding, not to circumvent the evaluative processes of educational institutions.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { icon: Scale, title: "Fair Use", text: "Resources are provided for personal study, research, and preparatory purposes only." },
                                        { icon: FileCheck, title: "Archive Accuracy", text: "We maintain a rigorous standard for document quality and metadata accuracy." },
                                        { icon: ShieldCheck, title: "No Malpractice", text: "The use of these archives during active examinations is strictly prohibited." }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-6 p-6 border border-[#111827]/5 bg-[#F9FAFB] rounded-sm">
                                            <item.icon className="w-6 h-6 text-[#4338CA] shrink-0" />
                                            <div>
                                                <h4 className="font-black text-[#111827] uppercase tracking-tight mb-1">{item.title}</h4>
                                                <p className="text-sm text-[#6B7280]">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    02 // VERIFICATION_STANDARDS
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">Sourced for Precision.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed mb-6">
                                    Every question paper hosted on our platform is sourced from official university records and
                                    manually verified by our administrative team. We ensures that subject codes, examination
                                    years, and semester data are perfectly synced with the official curriculum.
                                </p>
                                <p className="text-lg text-[#4B5563] leading-relaxed">
                                    If you identify any discrepancy or archival error, we encourage the use of our
                                    correction protocol to maintain the integrity of the central repository.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h2 className="text-xs font-mono font-black text-[#111827] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                    03 // STUDENT_RESPONSIBILITY
                                    <span className="h-[1px] flex-grow bg-[#111827]/10" />
                                </h2>
                                <h3 className="text-3xl font-black text-[#111827] uppercase tracking-tighter mb-6">The Ethical Vector.</h3>
                                <p className="text-lg text-[#4B5563] leading-relaxed">
                                    Users are expected to utilize these archives responsibly. PYQ’s Hub does not condone
                                    academic dishonesty in any form. Preparation through archival study is a legitimate
                                    academic exercise, but it must be balanced with original work and adherence to
                                    your institution&apos;s code of conduct.
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
                        ACCESS THE VERIFIED ARCHIVE
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

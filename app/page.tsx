'use client'

import Hero from '@/components/Hero'
import PYQCard from '@/components/PYQCard'
import ExamTypeCard from '@/components/pyq/ExamTypeCard'
import MetadataStrip from '@/components/pyq/MetadataStrip'
import SubjectCard from '@/components/pyq/SubjectCard'
import Link from 'next/link'
import { ArrowRight, BookOpen, ShieldCheck, Zap, Mail, MessageSquare, Globe, Send, Phone } from 'lucide-react'
import Loading from '@/components/ui/Loading'
import { examTypes } from '@/lib/mock-data'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useSubjects } from '@/hooks/useSubjects'
import { usePapers } from '@/hooks/usePapers'
import { useMemo } from 'react'
import Image from 'next/image'
import SubjectCardSkeleton from '@/components/pyq/SubjectCardSkeleton'
import PYQCardSkeleton from '@/components/pyq/PYQCardSkeleton'

export default function HomePage() {
    const { subjects, loading: subjectsLoading } = useSubjects()
    const recentPapersFilters = useMemo(() => ({}), [])
    const { papers: recentPYQs, loading: papersLoading } = usePapers(recentPapersFilters, 1)

    return (
        <div>
            {/* Section 1: Hero (Already in Components) */}
            <Hero />

            {/* Section 2: Exam Type Cards Grid - Industrial backgrounds */}
            <section id="exams" className="relative py-16 lg:py-24 overflow-hidden bg-[#111827] min-h-[calc(100vh-80px)] flex items-center">
                {/* Background Image Overlay with subtle movement */}
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none grayscale contrast-125 animate-float" style={{ animationDuration: '10s' }}>
                    <Image
                        src="/assets/exam_tiers.png"
                        alt="Exam Tiers"
                        fill
                        className="object-cover opacity-50 brightness-150"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-[#111827]/90" />
                </div>

                {/* Decorative gradients for depth */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4338CA]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6D28D9]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container-main relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12 reveal-up">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm mb-8 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                                <span className="w-1 h-1 bg-[#4338CA] rounded-full" />
                                Classification_Parameters
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
                                THE EXAMINATION <br />
                                <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>CATEGORIES.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-[#A3A3A3] font-medium leading-relaxed max-w-2xl">
                                Our archive is partitioned into three discrete assessment tiers.
                                Select a category to isolate specific academic historical data.
                            </p>
                        </div>
                        <Link href="/explore" className="group/btn">
                            <Button size="lg" className="px-10 py-5 uppercase tracking-[0.2em] font-black group-hover:scale-105 transition-transform duration-300">
                                VIEW_FULL_INDEX
                                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 reveal-up" style={{ animationDelay: '0.2s' }}>
                        {examTypes.map((exam) => (
                            <ExamTypeCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Subject Repositories */}
            <section className="bg-[#FBF9F7] py-16 lg:py-24 border-b border-[#111827] min-h-[calc(100vh-80px)] flex items-center">
                <div className="container-main w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter leading-none mb-6">
                                SUBJECT <br /> REPOSITORIES.
                            </h2>
                            <p className="text-lg text-[#6B7280]">
                                Access the complete archive of question papers organized by subject code.
                                High-fidelity scans and verified content for every module.
                            </p>
                        </div>
                        <Link href="/explore">
                            <Button variant="ghost" className="uppercase font-bold tracking-widest flex items-center gap-2 group">
                                View Full Archive
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    {subjectsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <SubjectCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {subjects.slice(0, 8).map((subject) => (
                                <SubjectCard key={subject.subject_code} subject={subject} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section 4: Latest Additions */}
            <section className="bg-white py-16 lg:py-24 border-b border-[#111827] min-h-[calc(100vh-80px)] flex items-center">
                <div className="container-main w-full">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h2 className="text-4xl font-black text-[#111827] uppercase tracking-tighter leading-none mb-4">
                                LATEST ADDITIONS.
                            </h2>
                            <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest">
                                Recently verified documents in the repository
                            </p>
                        </div>
                        <Link href="/explore">
                            <Button variant="ghost" className="uppercase font-bold tracking-widest flex items-center gap-2 group">
                                Browse All
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    {papersLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <PYQCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {recentPYQs.slice(0, 3).map((pyq) => (
                                <PYQCard key={pyq.id} pyq={pyq} />
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* Section 5: Final CTA - Cinematic industrial scale */}
            <section className="relative py-16 lg:py-24 overflow-hidden bg-[#111827] min-h-[calc(100vh-80px)] flex items-center">
                {/* Background Image with Cinematic Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/industrial_library_bg.png"
                        alt="Industrial Archive"
                        fill
                        className="object-cover opacity-80 brightness-100"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent" />
                </div>

                <div className="container-main relative z-10 text-center w-full">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#4338CA]/10 border border-[#4338CA]/30 rounded-sm mb-12 animate-pulse">
                            <ShieldCheck className="w-5 h-5 text-[#4338CA]" />
                            <span className="text-[10px] font-mono font-black text-[#4338CA] uppercase tracking-[0.3em]">SECURE_ARCHIVE_ACCESS_ESTABLISHED_v2.0</span>
                        </div>

                        <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-12">
                            STOP SEARCHING. <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>START PREPARING.</span>
                        </h2>

                        <p className="text-xl md:text-2xl text-[#A3A3A3] font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                            Join the elite industrial hub for engineering question papers.
                            The most structured, verified archive built for digital-first students.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <Link href="/register">
                                <Button size="lg" className="px-12 py-6 text-xl uppercase tracking-[0.2em] font-black group">
                                    INITIALIZE_ENROLLMENT
                                    <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-2" />
                                </Button>
                            </Link>
                            <Link href="/explore">
                                <Button variant="secondary" size="lg" className="px-12 py-6 text-xl uppercase tracking-[0.2em] font-black bg-transparent border-white/20 text-white hover:bg-white hover:text-[#111827] hover:border-white transition-all">
                                    SCAN_REPOSITORIES
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-white tabular-nums">3.2K</span>
                                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#6B7280]">ACTIVE_STUDENTS</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-white tabular-nums">12K+</span>
                                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#6B7280]">VERIFIED_PAPERS</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-white tabular-nums">24MS</span>
                                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#6B7280]">ARCHIVE_LATENCY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

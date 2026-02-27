'use client'

import Hero from '@/components/Hero'
import PYQCard from '@/components/PYQCard'
import ExamTypeCard from '@/components/pyq/ExamTypeCard'
import MetadataStrip from '@/components/pyq/MetadataStrip'
import SubjectCard from '@/components/pyq/SubjectCard'
import Link from 'next/link'
import { ArrowRight, BookOpen, ShieldCheck, Zap, Loader2 } from 'lucide-react'
import { examTypes } from '@/lib/mock-data'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useSubjects } from '@/hooks/useSubjects'
import { usePapers } from '@/hooks/usePapers'
import { useMemo } from 'react'

export default function HomePage() {
    const { subjects, loading: subjectsLoading } = useSubjects()
    const recentPapersFilters = useMemo(() => ({}), [])
    const { papers: recentPYQs, loading: papersLoading } = usePapers(recentPapersFilters, 1)

    return (
        <div className="animate-fade-in">
            {/* Section 1: Hero (Already in Components) */}
            <Hero />

            {/* Section 2: Metadata Strip */}
            <section className="bg-[#EAE0D5] pb-24">
                <div className="container-main">
                    <MetadataStrip />
                </div>
            </section>

            {/* Section 3: About Section (2-column industrial) */}
            <section className="bg-white border-y border-[#111827] py-24">
                <div className="container-main">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <p className="text-[#4338CA] font-mono text-xs font-bold uppercase tracking-[0.3em] mb-6">
                                The Archive Mission
                            </p>
                            <h2 className="text-4xl md:text-5xl font-black text-[#111827] leading-none mb-8 uppercase tracking-tighter">
                                BUILT FOR THE <br />
                                <span className="italic font-serif normal-case tracking-normal">Academic</span> DISCIPLINE.
                            </h2>
                            <p className="text-lg text-[#6B7280] leading-relaxed mb-10">
                                We believe that preparation is 90% of the battle. Our mission is to provide
                                engineering students with the most structured, verified, and high-fidelity
                                question paper archive possible. No fluff, no distractions—just pure discipline.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-black text-[#111827] uppercase tracking-widest text-sm mb-3">Integrity</h4>
                                    <p className="text-sm text-[#6B7280]">All papers undergo a 3-step verification process before upload.</p>
                                </div>
                                <div>
                                    <h4 className="font-black text-[#111827] uppercase tracking-widest text-sm mb-3">Structure</h4>
                                    <p className="text-sm text-[#6B7280]">Organized by department, year, and specific exam category.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card noHover size="sm" className="bg-[#F9FAFB] flex flex-col items-start gap-6">
                                <ShieldCheck className="w-8 h-8 text-[#111827]" />
                                <h3 className="font-black text-xl uppercase tracking-tighter">Verified Content</h3>
                                <p className="text-sm text-[#6B7280]">Official university question papers sourced and scanned at high fidelity.</p>
                            </Card>
                            <Card noHover size="sm" className="bg-[#F9FAFB] flex flex-col items-start gap-6">
                                <Zap className="w-8 h-8 text-[#111827]" />
                                <h3 className="font-black text-xl uppercase tracking-tighter">Rapid Access</h3>
                                <p className="text-sm text-[#6B7280]">Optimized search and filtering system for sub-second paper retrieval.</p>
                            </Card>
                            <Card noHover size="sm" className="col-span-full bg-[#111827] text-white flex flex-row items-center justify-between p-8">
                                <div>
                                    <h3 className="font-black text-2xl uppercase tracking-tighter mb-2">Ready to study?</h3>
                                    <p className="text-sm text-[#A3A3A3]">Join 3,200+ students in the archive.</p>
                                </div>
                                <Link href="/explore">
                                    <Button variant="secondary" className="bg-white text-[#111827] border-none">
                                        ENTER REPOSITORY
                                    </Button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Exam Type Cards Grid */}
            <section id="exams" className="section-warm py-24 border-b border-[#111827]">
                <div className="container-main">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-[#111827] uppercase tracking-tighter leading-none mb-6">
                                THE EXAMINATION <br /> CATEGORIES.
                            </h2>
                            <p className="text-lg text-[#6B7280]">
                                Our archive is categorized into three major continuous assessment and
                                final examination tiers to help you target your specific needs.
                            </p>
                        </div>
                        <Link href="/explore">
                            <Button variant="secondary" className="uppercase tracking-widest font-bold">
                                All Categories
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {examTypes.map((exam) => (
                            <ExamTypeCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Subject Repositories */}
            <section className="bg-[#FBF9F7] py-24 border-b border-[#111827]">
                <div className="container-main">
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
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#4338CA]" />
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

            {/* Section 6: Recent PYQs */}
            <section className="bg-white py-24">
                <div className="container-main">
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
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#4338CA]" />
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

            {/* Final CTA */}
            <section className="bg-[#EAE0D5] py-24">
                <div className="container-main">
                    <Card noHover className="bg-[#111827] text-white p-16 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-sm border border-[#4338CA] flex items-center justify-center bg-[#1E1B4B] mb-8">
                            <BookOpen className="w-8 h-8 text-[#4338CA]" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
                            STOP SEARCHING. <br />
                            START PREPARING.
                        </h2>
                        <p className="text-xl text-[#A3A3A3] max-w-2xl mb-12">
                            Join the industrial hub for engineering question papers.
                            Free forever for students who value structure.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/register">
                                <Button size="lg" className="px-10 py-5 text-lg uppercase tracking-[0.2em] font-black">
                                    Get Started Now
                                </Button>
                            </Link>
                            <Link href="/explore">
                                <Button variant="secondary" size="lg" className="px-10 py-5 text-lg uppercase tracking-[0.2em] font-black bg-transparent border-white text-white hover:bg-white hover:text-[#111827]">
                                    Browse Archive
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    )
}

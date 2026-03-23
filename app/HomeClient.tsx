'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import PYQCard from '@/components/PYQCard';
import ExamTypeCard from '@/components/pyq/ExamTypeCard';
import SubjectCard from '@/components/pyq/SubjectCard';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { examTypes } from '@/lib/mock-data';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { getSubjects, getPaginatedPapers, Subject, PYQ } from '@/lib/queries';
import { Suspense } from 'react';
import SubjectCardSkeleton from '@/components/pyq/SubjectCardSkeleton';
import PYQCardSkeleton from '@/components/pyq/PYQCardSkeleton';

export default function HomeClient() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [recentPYQs, setRecentPYQs] = useState<PYQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const [subjectsData, papersData] = await Promise.all([
                    getSubjects(),
                    getPaginatedPapers({}, 1, 3)
                ]);
                setSubjects(subjectsData.slice(0, 8));
                setRecentPYQs(papersData.data);
            } catch (err) {
                console.error('Failed to load home data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadHomeData();
    }, []);

    return (
        <div>
            <Hero />

            {/* Section 2: Exam Types */}
            <section id="exams" className="relative py-16 lg:py-24 overflow-hidden bg-[#111827] min-h-[calc(100vh-80px)] flex items-center">
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none grayscale contrast-125 animate-float" style={{ animationDuration: '10s' }}>
                    <Image
                        src="/assets/exam_tiers.png"
                        alt="Exam Tiers"
                        fill
                        priority
                        className="object-cover opacity-50 brightness-150"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-[#111827]/90" />
                </div>

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
                            </p>
                        </div>
                        <Link href="/explore">
                            <Button size="lg" className="px-10 py-5 uppercase tracking-[0.2em] font-black group-hover:scale-105 transition-transform duration-300">
                                VIEW_FULL_INDEX
                                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 reveal-up">
                        {examTypes.map((exam) => (
                            <ExamTypeCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Subject Repositories */}
            <section className="bg-[var(--color-surface)] py-16 lg:py-24 border-b border-[var(--color-border)] min-h-[calc(100vh-80px)] flex items-center">
                <div className="container-main w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] uppercase tracking-tighter leading-none mb-6">
                                SUBJECT <br /> REPOSITORIES.
                            </h2>
                        </div>
                        <Link href="/explore">
                            <Button variant="ghost" className="uppercase font-bold tracking-widest flex items-center gap-2 group">
                                View Full Archive
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading
                            ? [...Array(8)].map((_, i) => <SubjectCardSkeleton key={i} />)
                            : subjects.map((subject) => (
                                <SubjectCard key={subject.subject_code} subject={subject} />
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Section 4: Latest Additions */}
            <section className="bg-[var(--color-card)] py-16 lg:py-24 border-b border-[var(--color-border)] min-h-[calc(100vh-80px)] flex items-center">
                <div className="container-main w-full">
                    <div className="flex items-center justify-between mb-16">
                        <h2 className="text-4xl font-black text-[var(--color-text)] uppercase tracking-tighter leading-none mb-4">
                            LATEST ADDITIONS.
                        </h2>
                        <Link href="/explore">
                            <Button variant="ghost" className="uppercase font-bold tracking-widest flex items-center gap-2 group">
                                Browse All
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading
                            ? [...Array(3)].map((_, i) => <PYQCardSkeleton key={i} />)
                            : recentPYQs.map((pyq) => (
                                <PYQCard key={pyq.id} pyq={pyq} />
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Section 5: CTA */}
            <section className="relative py-16 lg:py-24 overflow-hidden bg-[#111827] min-h-[calc(100vh-80px)] flex items-center">
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

                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <Link href="/register">
                                <Button size="lg" className="px-12 py-6 text-xl uppercase tracking-[0.2em] font-black group">
                                    INITIALIZE_ENROLLMENT
                                    <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

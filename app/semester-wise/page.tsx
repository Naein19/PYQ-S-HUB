import { Metadata } from 'next'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'VIT-AP Semester-Wise Previous Year Papers | Winter vs Fall',
    description: 'Access VIT-AP previous year question papers organized by semester. Browse Fall Semester and Winter Semester papers for CAT-1, CAT-2, and FAT at VIT Amaravati.',
    keywords: ['VIT-AP semester papers', 'Winter Semester VITAP PYQ', 'Fall Semester VITAP papers', 'VIT Amaravati semester-wise PYQs'],
    alternates: {
        canonical: '/semester-wise',
    }
}

export default function SemesterWisePage() {
    return (
        <main className="min-h-screen bg-[#FBF9F7]">
            <section className="bg-[#111827] py-20 lg:py-32 text-white relative overflow-hidden">
                <div className="container-main relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm mb-8 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                            <span className="w-1 h-1 bg-[#4338CA] rounded-full" />
                            CHRONOLOGICAL_ARCHIVE // SEMESTERS
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                            SEMESTER-WISE <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>ORGANIZATION.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] font-medium max-w-2xl">
                            Navigate the archive based on the academic calendar.
                            Optimized for Winter and Fall semester preparation tracks.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container-main">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="p-12 border border-[#111827]/10 bg-white relative group overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#4338CA]/5 rounded-full blur-2xl group-hover:bg-[#4338CA]/10 transition-all duration-500" />
                            <Calendar className="w-12 h-12 text-[#4338CA] mb-8" />
                            <h2 className="text-4xl font-black text-[#111827] uppercase tracking-tighter mb-6">Fall Semester</h2>
                            <p className="text-[#6B7280] mb-10 leading-relaxed">
                                Access papers for the July-December cycle.
                                Includes CAT-1, CAT-2, and FAT resources for all core engineering modules.
                            </p>
                            <Link href="/explore?semester=Fall">
                                <Button className="w-full uppercase font-bold tracking-[0.2em] py-6">
                                    INITIALIZE_FALL_SCAN <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <div className="p-12 border border-[#111827]/10 bg-white relative group overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500" />
                            <Calendar className="w-12 h-12 text-indigo-600 mb-8" />
                            <h2 className="text-4xl font-black text-[#111827] uppercase tracking-tighter mb-6">Winter Semester</h2>
                            <p className="text-[#6B7280] mb-10 leading-relaxed">
                                Access papers for the January-May cycle.
                                Optimized for fast delivery of recent module assessments.
                            </p>
                            <Link href="/explore?semester=Winter">
                                <Button variant="secondary" className="w-full uppercase font-bold tracking-[0.2em] py-6">
                                    INITIALIZE_WINTER_SCAN <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

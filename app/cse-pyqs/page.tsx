import { Metadata } from 'next'
import { getSubjects } from '@/lib/queries'
import SubjectCard from '@/components/pyq/SubjectCard'
import { ArrowRight, Book } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'VIT-AP CSE Previous Year Papers | Computer Science PYQs',
    description: 'Download VIT-AP Computer Science and Engineering (CSE) CAT-1, CAT-2, and FAT previous year question papers. Comprehensive archive for all CSE modules at VIT Amaravati.',
    keywords: ['VIT-AP CSE papers', 'Computer Science VITAP PYQ', 'CSE CAT-1 papers', 'CSE CAT-2 papers', 'CSE FAT papers', 'VIT Amaravati CSE question papers'],
    alternates: {
        canonical: '/cse-pyqs',
    }
}

export default async function CSELandingPage() {
    const allSubjects = await getSubjects()
    const cseSubjects = allSubjects.filter(s =>
        s.subject_code.startsWith('CSE') ||
        s.subject_code.startsWith('CS') ||
        s.subject_code.includes('4012') // UI/UX often mapped to 4012
    )

    return (
        <main className="min-h-screen bg-[#FBF9F7]">
            {/* Hero Section */}
            <section className="bg-[#111827] py-20 lg:py-32 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none grayscale">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
                </div>

                <div className="container-main relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm mb-8 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                            <span className="w-1 h-1 bg-[#4338CA] rounded-full" />
                            DEPARTMENT_REPOSITORIES // CSE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                            COMPUTER SCIENCE <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>& ENGINEERING.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] font-medium leading-relaxed max-w-2xl">
                            The definitive archive for all CSE modules at VIT-AP.
                            Verified CAT-1, CAT-2, and FAT resources for engineering excellence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-20 lg:py-24">
                <div className="container-main">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-bold text-[#111827] uppercase tracking-tighter">
                            MODULE REPOSITORIES ({cseSubjects.length})
                        </h2>
                        <div className="h-px flex-grow mx-8 bg-[#111827]/10 hidden md:block" />
                        <Link href="/explore?department=CSE">
                            <Button variant="ghost" className="text-xs uppercase font-bold tracking-widest hidden md:flex items-center gap-2">
                                ADVANCED_FILTERING <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {cseSubjects.map((subject) => (
                            <SubjectCard key={subject.subject_code} subject={subject} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Preparation Tip Section */}
            <section className="bg-white py-20 border-t border-[#111827]/5">
                <div className="container-main">
                    <div className="max-w-4xl mx-auto p-12 border border-[#111817]/10 bg-[#F9FAFB] relative overflow-hidden group">
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#4338CA]/5 rounded-full blur-3xl group-hover:bg-[#4338CA]/10 transition-colors duration-500" />
                        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                            <div className="w-16 h-16 bg-[#4338CA] text-white flex items-center justify-center rounded-sm shrink-0 shadow-[4px_4px_0px_#111827]">
                                <Book className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#111827] uppercase tracking-tighter mb-4">Preparation Protocol // CSE</h3>
                                <p className="text-[#6B7280] leading-relaxed mb-6">
                                    For Computer Science modules, analyze the pattern of CAT-2 and FAT papers specifically for implementation-heavy questions.
                                    Our archive contains specific module variations that are frequently tested in semester exams.
                                </p>
                                <Link href="/explore">
                                    <Button variant="secondary" className="uppercase font-bold tracking-[0.1em] text-xs">
                                        SCAN_FOR_LATEST_ADDITIONS
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

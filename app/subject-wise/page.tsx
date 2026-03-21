import { Metadata } from 'next'
import { getSubjects } from '@/lib/queries'
import SubjectCard from '@/components/pyq/SubjectCard'
import { ArrowRight, Search } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'VIT-AP Subject-Wise Previous Year Papers | Module Index',
    description: 'Browse the complete index of VIT-AP previous year question papers by subject. Comprehensive repository of all engineering modules at VIT Amaravati.',
    keywords: ['VIT-AP subjects', 'VITAP module-wise papers', 'Subject wise PYQ VITAP', 'VIT Amaravati module archive'],
    alternates: {
        canonical: '/subject-wise',
    }
}

export default async function SubjectWisePage() {
    const subjects = await getSubjects()

    return (
        <main className="min-h-screen bg-[#FBF9F7]">
            <section className="bg-[#111827] py-20 lg:py-32 text-white relative overflow-hidden text-center">
                <div className="container-main relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm mb-8 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50">
                            <span className="w-1 h-1 bg-[#4338CA] rounded-full" />
                            MODULAR_ARCHIVE_INDEX
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                            SUBJECT <br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>MASTER_INDEX.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#A3A3A3] font-medium max-w-2xl mx-auto leading-relaxed">
                            Access every module verified in the hub.
                            Structured data extraction for over {subjects.length} engineering subjects.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container-main">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                        <h2 className="text-3xl font-black text-[#111827] uppercase tracking-tighter">THE INDEX // SCANNING ALL MODULES</h2>
                        <Link href="/explore">
                            <Button size="lg" className="uppercase font-bold tracking-widest flex items-center gap-3">
                                <Search className="w-5 h-5" />
                                LAUNCH_GLOBAL_SEARCH
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {subjects.map((subject) => (
                            <SubjectCard key={subject.subject_code} subject={subject} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

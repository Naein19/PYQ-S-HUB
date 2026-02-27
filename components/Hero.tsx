import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Download, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const features = [
    { icon: CheckCircle2, text: 'Verified academic papers' },
    { icon: Clock, text: 'Latest 2024 syllabus content' },
    { icon: BookOpen, text: 'Comprehensive subject coverage' },
    { icon: Download, text: 'Instant industrial-grade downloads' },
]

export default function Hero() {
    return (
        <section className="bg-[#EAE0D5] border-b border-[#111827] overflow-hidden">
            <div className="container-main py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#111827] bg-white mb-8 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111827]">
                            <span className="w-2 h-2 rounded-full bg-[#4338CA] animate-pulse" />
                            Academic Archive v2.0
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-[#111827] leading-[0.9] tracking-[-0.05em] uppercase mb-8">
                            EVERY EXAM <br />PAPER. <br />
                            <span className="text-transparent border-b-4 border-[#111827]" style={{ WebkitTextStroke: '1px #111827' }}>RE-ENGINEERED.</span>
                        </h1>

                        <p className="text-xl text-[#6B7280] leading-relaxed mb-10 max-w-xl">
                            PYQ&apos;s Hub is the structured archive built for serious engineering students.
                            Browse, filter, and extract previous year question papers instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <Link href="/explore">
                                <Button size="lg" className="w-full sm:w-auto uppercase tracking-widest font-black">
                                    Explore Repository
                                    <ArrowRight className="w-5 h-5 ml-1" />
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto uppercase tracking-widest font-black">
                                    Create Archive
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Framed Card */}
                    <div className="relative group">
                        {/* Background structural element */}
                        <div className="absolute -top-6 -right-6 w-full h-full border border-[#111827]/10 rounded-sm pointer-events-none" />

                        <Card className="relative z-10 p-10 bg-white group-hover:shadow-[8px_8px_0px_#111827] transition-all duration-300">
                            <h3 className="text-xs font-mono font-black text-[#111827] uppercase tracking-widest mb-8 pb-4 border-b border-[#111827]/10 flex items-center justify-between">
                                Repository Features
                                <span className="px-2 py-0.5 border border-[#111827] rounded-sm text-[8px]">ACTIVE</span>
                            </h3>
                            <div className="space-y-6">
                                {features.map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-5 group/item">
                                        <div className="w-10 h-10 rounded-sm border border-[#111827] flex items-center justify-center bg-[#EAE0D5] group-hover/item:bg-[#111827] group-hover/item:text-white transition-colors duration-200">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-base font-bold text-[#111827] uppercase tracking-tight ">{text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-[#111827]/10 flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border border-[#111827] bg-[#F3F4F6] flex items-center justify-center text-[10px] font-bold">U{i}</div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase tracking-widest">
                                    3.2k Students Enrolled
                                </span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

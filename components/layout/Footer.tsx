import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'
import Logo from '@/components/Logo'

const footerLinks = {
    Platform: [
        { label: 'Explore PYQs', href: '/explore' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Exam Types', href: '#exams' },
        { label: 'Subject list', href: '/explore' },
    ],
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'Academic integrity', href: '/academic-integrity' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Use', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
            {/* Structural background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#4338CA]/20 blur-[120px] rounded-full" />
            </div>

            <div className="container-main py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 lg:gap-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <Logo className="w-12 h-12 transition-transform group-hover:scale-105" variant="light" />
                            <span className="font-black text-2xl text-white tracking-tighter uppercase leading-none">
                                PYQ&apos;S <br /> HUB
                            </span>
                        </Link>
                        <p className="text-[#A3A3A3] text-lg leading-relaxed max-w-sm mb-10 font-medium">
                            The industrial-grade academic archive for engineering students.
                            Structured, verified, and always accessible.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-12 h-12 rounded-sm border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#111827] hover:border-white transition-all duration-300 group"
                                >
                                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 pb-3 border-b border-white/5">
                                {title}
                            </h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[#A3A3A3] text-sm hover:text-white transition-all duration-200 relative inline-block group font-medium"
                                        >
                                            {link.label}
                                            <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} PYQ&apos;S HUB INC. // ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[10px] text-green-500/80 font-mono font-black uppercase tracking-widest">
                                SYSTEMS_OPERATIONAL: V2.0.4-INDUSTRIAL
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-10">
                        <Link href="#" className="text-[10px] text-[#6B7280] hover:text-white font-black uppercase tracking-[0.2em] transition-colors">ARCHIVE_STATUS</Link>
                        <Link href="#" className="text-[10px] text-[#6B7280] hover:text-white font-black uppercase tracking-[0.2em] transition-colors">SECURITY_MANIFESTO</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

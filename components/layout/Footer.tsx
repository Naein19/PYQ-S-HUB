import Link from 'next/link'
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react'

const footerLinks = {
    Platform: [
        { label: 'Explore PYQs', href: '/explore' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Exam Types', href: '#exams' },
        { label: 'Subject list', href: '/explore' },
    ],
    Company: [
        { label: 'About Us', href: '#' },
        { label: 'Academic integrity', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Feedback', href: '#' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use', href: '#' },
        { label: 'Cookie Policy', href: '#' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-[#EAE0D5] border-t border-[#111827]">
            <div className="container-main py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <span className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#111827] text-white">
                                <BookOpen className="w-5 h-5" />
                            </span>
                            <span className="font-bold text-xl text-[#111827] tracking-tighter uppercase">
                                PYQ&apos;s Hub
                            </span>
                        </Link>
                        <p className="text-[#6B7280] text-base leading-relaxed max-w-sm mb-8">
                            The industrial-grade academic archive for engineering students.
                            Structured, verified, and always accessible.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-sm border border-[#111827] flex items-center justify-center hover:bg-black/5 transition-colors">
                                    <Icon className="w-5 h-5 text-[#111827]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-[#111827] font-bold text-sm uppercase tracking-widest mb-6">
                                {title}
                            </h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[#6B7280] text-sm hover:text-[#111827] transition-colors relative inline-block group"
                                        >
                                            {link.label}
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#111827] transition-all duration-200 group-hover:w-full" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-20 pt-10 border-t border-[#111827]/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
                            &copy; {new Date().getFullYear()} PYQ&apos;s Hub Inc.
                        </p>
                        <div className="h-4 w-px bg-[#111827]/10 hidden sm:block" />
                        <p className="text-xs text-[#6B7280] font-mono">
                            Ver. 2.0.4-industrial
                        </p>
                    </div>
                    <div className="flex gap-8">
                        <Link href="#" className="text-xs text-[#6B7280] hover:text-[#111827] font-medium uppercase tracking-wider">Status</Link>
                        <Link href="#" className="text-xs text-[#6B7280] hover:text-[#111827] font-medium uppercase tracking-wider">System Info</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

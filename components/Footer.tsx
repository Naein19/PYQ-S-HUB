import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const footerLinks = {
    Platform: [
        { label: 'Explore PYQs', href: '/explore' },
        { label: 'Dashboard', href: '/dashboard' },
    ],
    Resources: [
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use', href: '#' },
    ],
}

export default function Footer() {
    return (
        <footer className="bg-white border-t border-border">
            <div className="container-main py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-primary">
                                <BookOpen className="w-4 h-4 text-white" />
                            </span>
                            <span className="font-semibold text-base text-textPrimary">PYQ&apos;s Hub</span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            The academic resource platform for previous year question papers.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                                {title}
                            </h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-600 hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="divider mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} PYQ&apos;s Hub. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-400 font-mono">Built for students, by students.</p>
                </div>
            </div>
        </footer>
    )
}

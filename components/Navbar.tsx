'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
    { href: '/explore', label: 'Explore PYQs' },
    { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-border">
            <nav className="container-main h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-primary">
                        <BookOpen className="w-4 h-4 text-white" />
                    </span>
                    <span className="font-semibold text-base text-textPrimary tracking-tight">
                        PYQ&apos;s Hub
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'nav-link',
                                pathname === link.href && 'text-primary font-semibold',
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="btn-secondary text-xs px-3 py-1.5">Log in</Link>
                    <Link href="/register" className="btn-primary text-xs px-3 py-1.5">Sign up</Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 rounded-[8px] text-slate-600 hover:bg-slate-100 transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-border">
                    <div className="container-main py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'nav-link py-1',
                                    pathname === link.href && 'text-primary font-semibold',
                                )}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="divider" />
                        <div className="flex gap-3">
                            <Link
                                href="/login"
                                className="btn-secondary text-xs px-3 py-1.5 flex-1 justify-center"
                                onClick={() => setMobileOpen(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="btn-primary text-xs px-3 py-1.5 flex-1 justify-center"
                                onClick={() => setMobileOpen(false)}
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

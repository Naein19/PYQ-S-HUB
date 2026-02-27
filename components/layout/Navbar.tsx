'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore PYQs' },
    { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-[#111827] shadow-sm"
                    : "bg-[#EAE0D5] border-b border-transparent"
            )}
        >
            <nav className="container-main h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <span className="flex items-center justify-center w-10 h-10 rounded-sm bg-[#111827] text-white transition-transform group-hover:scale-105">
                        <BookOpen className="w-5 h-5" />
                    </span>
                    <span className="font-bold text-xl text-[#111827] tracking-tighter uppercase">
                        PYQ&apos;s Hub
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'nav-link py-1',
                                pathname === link.href && 'active text-[#111827] font-bold',
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="primary" size="sm">Sign up</Button>
                    </Link>
                </div>

                {/* Profile/Menu (Visible always but simplified) */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="md:hidden">
                        <Button variant="ghost" size="sm" className="font-black text-[10px] tracking-widest px-3">LOGIN</Button>
                    </Link>
                    {/* Mobile Toggle - Kept for secondary links if needed, otherwise simplified */}
                    <button
                        className="p-2 rounded-sm text-[#111827] hover:bg-black/5 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#EAE0D5] border-t border-[#111827] animate-fade-in">
                    <div className="container-main py-6 flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-lg font-bold text-[#111827] uppercase tracking-tight',
                                    pathname === link.href && 'underline underline-offset-8 decoration-2 decoration-[#4338CA]',
                                )}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-[#111827]/10" />
                        <div className="flex flex-col gap-3">
                            <Link href="/login" onClick={() => setMobileOpen(false)}>
                                <Button variant="secondary" className="w-full">Log in</Button>
                            </Link>
                            <Link href="/register" onClick={() => setMobileOpen(false)}>
                                <Button variant="primary" className="w-full">Sign up</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

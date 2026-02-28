'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Settings, ShieldCheck } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const guestLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
]

const authLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
    const pathname = usePathname()
    const { user, role, signOut, loading } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const navLinks = user ? authLinks : guestLinks

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
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
                    {role === 'admin' && (
                        <Link
                            href="/admin"
                            className={cn(
                                'nav-link py-1 text-[#4338CA] font-bold',
                                pathname === '/admin' && 'underline underline-offset-4',
                            )}
                        >
                            Admin
                        </Link>
                    )}
                </div>

                {/* Desktop Auth / Profile */}
                <div className="hidden md:flex items-center gap-4 min-w-[140px] justify-end">
                    {loading ? (
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-8 bg-black/5 animate-pulse rounded-sm" />
                            <div className="w-20 h-8 bg-black/10 animate-pulse rounded-sm" />
                        </div>
                    ) : (
                        <>
                            {!user ? (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">Log in</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="primary" size="sm">Sign up</Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 p-1 rounded-full border-2 border-[#111827] hover:bg-[#111827] hover:text-white transition-all overflow-hidden"
                                    >
                                        <div className="w-8 h-8 bg-[#4338CA] rounded-full flex items-center justify-center text-white">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                    </button>

                                    {/* Premium Dropdown */}
                                    {profileOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white border-2 border-[#111827] shadow-[8px_8px_0px_#111827] rounded-sm py-2 z-[60] animate-in fade-in zoom-in duration-200">
                                            <div className="px-4 py-3 border-b border-[#111827]/10 mb-2">
                                                <p className="text-[10px] font-mono font-black text-[#6B7280] uppercase tracking-widest">Signed in as</p>
                                                <p className="font-bold text-[#111827] truncate">{user.email}</p>
                                                {role === 'admin' && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#4338CA]/10 text-[#4338CA] text-[10px] font-black uppercase tracking-tighter rounded-sm">
                                                        AUTHORIZED_ADMIN
                                                    </span>
                                                )}
                                            </div>

                                            <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#EAE0D5] transition-colors">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>

                                            {role === 'admin' && (
                                                <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-[#4338CA] hover:bg-[#4338CA]/10 transition-colors">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Admin Panel
                                                </Link>
                                            )}

                                            <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-[#111827] hover:bg-[#EAE0D5] transition-colors">
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>

                                            <div className="h-px bg-[#111827]/10 my-2" />

                                            <button
                                                onClick={() => {
                                                    signOut()
                                                    setProfileOpen(false)
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    {!user && (
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-black text-[10px] tracking-widest px-3">LOGIN</Button>
                        </Link>
                    )}
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
                            {!user ? (
                                <>
                                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                                        <Button variant="secondary" className="w-full">Log in</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                                        <Button variant="primary" className="w-full">Sign up</Button>
                                    </Link>
                                </>
                            ) : (
                                <Button
                                    variant="secondary"
                                    className="w-full text-red-600 border-red-200"
                                    onClick={() => {
                                        signOut()
                                        setMobileOpen(false)
                                    }}
                                >
                                    Log out
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

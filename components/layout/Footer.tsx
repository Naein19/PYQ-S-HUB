'use client'

import Link from 'next/link'
import { Github, Mail, Linkedin, Terminal, ShieldCheck, Database, Cpu, Globe } from 'lucide-react'
import Logo from '@/components/Logo'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

const footerLinks = {
    Platform: [
        { label: 'Explore PYQs', href: '/explore' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Exam Types', href: '/#exams' },
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

const socialLinks = [
    { icon: Mail, href: 'mailto:naveen.23bce9344@vitapstudent.ac.in', label: 'Email' },
    { icon: Github, href: 'https://github.com/Naein19', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/naveen-tadaka', label: 'LinkedIn' },
]

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden pt-24 pb-12">



            {/* Layered Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#4338CA]/5 blur-[120px] rounded-full animate-glow" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#6D28D9]/5 blur-[120px] rounded-full animate-glow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="container-main relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                >
                                    <Logo className="w-14 h-14" variant="light" />
                                </motion.div>
                                <div className="flex flex-col">
                                    <span className="font-black text-3xl text-white tracking-widest uppercase leading-none">
                                        PYQ&apos;S <br /> HUB
                                    </span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] font-mono font-bold text-green-500/80 uppercase tracking-[0.2em]">
                                            Core_Engine_Stable
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <p className="text-[#A3A3A3] text-lg leading-relaxed max-w-sm font-medium">
                            Premium academic repository for VIT-AP engineering students.
                            Built for speed, precision, and architectural integrity.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 border border-white/5 bg-white/5 rounded-sm backdrop-blur-sm max-w-xs group hover:border-[#4338CA]/30 transition-colors duration-500">
                                <div className="p-2 bg-[#4338CA]/10 rounded-sm">
                                    <Terminal className="w-4 h-4 text-[#4338CA]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-widest leading-none mb-1">System_Status</span>
                                    <span className="text-xs font-mono text-white/90 font-bold uppercase tracking-widest">Operational // v2.1.0</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {socialLinks.map((social, i) => (
                                    <motion.a
                                        key={i}
                                        href={social.href}
                                        aria-label={social.label}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-11 h-11 rounded-sm border border-white/10 bg-white/5 text-white/70 flex items-center justify-center hover:bg-white hover:text-[#111827] hover:border-white transition-all duration-300 relative group overflow-hidden"
                                    >
                                        <social.icon className="w-5 h-5 relative z-10 transition-transform group-hover:stroke-[2.5px]" />
                                        <motion.div
                                            className="absolute inset-0 bg-white/20 blur-md translate-y-full group-hover:translate-y-0 transition-transform"
                                            initial={false}
                                        />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="space-y-8">
                            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3">
                                <span className="w-1.5 h-[1px] bg-[#4338CA]" />
                                {title}
                            </h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[#A3A3A3] text-sm hover:text-white transition-all duration-300 relative inline-block group font-medium overflow-hidden py-1"
                                        >
                                            <span className="relative z-10">{link.label}</span>
                                            <motion.span
                                                className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4338CA] to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Animated Gradient Divider */}
                <div className="relative h-px w-full overflow-hidden mb-12">
                    <div className="absolute inset-0 bg-white/5" />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4338CA] to-transparent w-full"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* System Metadata Section */}

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] text-[#6B7280] font-mono font-bold uppercase tracking-[0.3em] text-center md:text-left">
                        &copy; {new Date().getFullYear()} PYQ&apos;S HUB  — Developed by Tadaka Naveen.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="group flex items-center gap-2">
                            <span className="text-[9px] text-[#6B7280] group-hover:text-white font-black uppercase tracking-[0.2em] transition-colors">Not affiliated with VIT-AP University</span>
                            <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-[#4338CA] transition-colors" />
                        </Link>
                        <Link href="#" className="group flex items-center gap-2">
                            <span className="text-[9px] text-[#6B7280] group-hover:text-white font-black uppercase tracking-[0.2em] transition-colors">Made with ❤️ for students</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

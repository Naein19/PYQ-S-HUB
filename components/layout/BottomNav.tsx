'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusSquare, BookMarked } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/admin', label: 'Upload', icon: PlusSquare },
    { href: '/dashboard', label: 'Archive', icon: BookMarked },
]

export default function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#111827] z-[60] safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around h-16">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200",
                                isActive ? "text-[#4338CA] translate-y-[-2px]" : "text-[#6B7280] hover:text-[#111827]"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-tighter",
                                !isActive && "opacity-60"
                            )}>
                                {label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 w-8 h-1 bg-[#4338CA] rounded-b-full shadow-[0_2px_10px_rgba(67,56,202,0.4)]" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

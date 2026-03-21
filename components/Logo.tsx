import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    variant?: 'light' | 'dark'
}

export default function Logo({ className = "w-10 h-10", variant = "dark" }: LogoProps) {
    // User requested:
    // Dark theme -> icon_dark.png (White lines)
    // Light theme -> icon_light.png (Dark lines)
    const src = variant === "dark" ? "/assets/icon_dark.png" : "/assets/icon_light.png"

    return (
        <div className={cn("relative overflow-hidden rounded-xl", className)}>
            <Image
                src={src}
                alt="PYQs Hub Logo"
                fill
                className="object-contain transition-all duration-300"
                priority
            />
        </div>
    )
}

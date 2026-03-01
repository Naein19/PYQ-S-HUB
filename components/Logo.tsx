import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    variant?: 'light' | 'dark'
}

export default function Logo({ className = "w-10 h-10", variant = "dark" }: LogoProps) {
    // Mapping as per user request:
    // Dark background (Footer/variant="light") -> icon_dark.png
    // Light background (Navbar/variant="dark") -> icon_light.png
    const src = variant === "light" ? "/assets/icon_dark.png" : "/assets/icon_light.png"

    return (
        <div className={cn("relative overflow-hidden rounded-xl", className)}>
            <Image
                src={src}
                alt="PYQs Hub Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    )
}

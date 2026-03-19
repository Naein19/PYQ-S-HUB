import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    variant?: 'light' | 'dark'
}

export default function Logo({ className = "w-10 h-10", variant = "dark" }: LogoProps) {
    // Fixed logic for intuitive variant names:
    // Light background (Navbar/variant="dark") -> icon_dark.png (visible on white)
    // Dark background (Footer/variant="light") -> icon_light.png (visible on dark)
    const src = variant === "light" ? "/assets/icon_light.png" : "/assets/icon_dark.png"

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

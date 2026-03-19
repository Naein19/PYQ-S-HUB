'use client'

import { useTheme } from '@/context/ThemeContext'
import { useCallback, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const ANCHORS = [
    { x: '0%', y: '0%' },    // Top Left
    { x: '100%', y: '0%' },  // Top Right
    { x: '0%', y: '100%' },  // Bottom Left
    { x: '100%', y: '100%' }, // Bottom Right
    { x: '50%', y: '50%' },   // Center
]

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()
    const overlayRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    /* Hyprland-style "wipe from random anchor" transition */
    const handleToggle = useCallback(() => {
        const overlay = overlayRef.current
        if (!overlay || overlay.classList.contains('animating')) return

        overlay.classList.add('animating')

        // Randomize the start point for variety
        const anchor = ANCHORS[Math.floor(Math.random() * ANCHORS.length)]
        overlay.style.setProperty('--wipe-x', anchor.x)
        overlay.style.setProperty('--wipe-y', anchor.y)

        // Next theme background color
        const nextBg = isDark ? '#EAE0D5' : '#020617'
        overlay.style.setProperty('--wipe-color', nextBg)

        // Kick off the CSS animation
        overlay.style.animation = 'none'
        // Force reflow
        void overlay.offsetWidth
        overlay.style.animation = ''
        overlay.classList.add('theme-wipe-active')

        // Flip theme at the halfway point of the slower animation (~450ms)
        const midTimer = setTimeout(() => {
            toggleTheme()
        }, 450)

        // Clean up after animation (matching 1.2s duration)
        const endTimer = setTimeout(() => {
            overlay.classList.remove('animating', 'theme-wipe-active')
        }, 1200)

        return () => {
            clearTimeout(midTimer)
            clearTimeout(endTimer)
        }
    }, [isDark, toggleTheme])

    const overlayElement = (
        <div
            ref={overlayRef}
            aria-hidden="true"
            id="theme-wipe-overlay"
        />
    )

    return (
        <>
            {/* Full-screen wipe overlay (Hyprland style) - Portaled to Body */}
            {mounted && createPortal(overlayElement, document.body)}

            {/* Toggle button */}
            <button
                onClick={handleToggle}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="theme-toggle-btn group active:scale-95 transition-transform"
                id="theme-toggle"
            >
                {/* Minimalist Sun Icon */}
                <span className={`theme-icon theme-icon-sun ${isDark ? 'icon-hidden' : 'icon-visible'}`}>
                    <svg
                        width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                    >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" /><path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" /><path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                </span>

                {/* Aesthetic Crescent Moon Icon */}
                <span className={`theme-icon theme-icon-moon ${isDark ? 'icon-visible' : 'icon-hidden'}`}>
                    <svg
                        width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]"
                    >
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                </span>
            </button>
        </>
    )
}

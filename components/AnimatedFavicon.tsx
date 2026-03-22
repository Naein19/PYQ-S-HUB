'use client'

import { useEffect } from 'react'

const FRAMES = [
    '/favicon-frame1.png',
    '/favicon-frame2.png',
    '/favicon-frame3.png',
    '/favicon-frame4.png',
]

const CYCLE_TIME = 1500 // Optimized range: 1000-2000ms
const ORIGINAL_TITLE = "PYQ’s Hub | VIT-AP Previous Year Question Papers"
const AWAY_TITLE = "Come back! | PYQ's Hub"

export default function AnimatedFavicon() {
    useEffect(() => {
        // 1. In-memory state to prevent React re-renders
        let frameIndex = 0
        let intervalId: NodeJS.Timeout | null = null

        // 2. Reuse the same DOM node for updates (Single Link Guard)
        const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement

        const updateFavicon = () => {
            if (faviconLink) {
                frameIndex = (frameIndex + 1) % FRAMES.length
                faviconLink.href = FRAMES[frameIndex]
            }
        }

        const startAnimation = () => {
            if (!intervalId) {
                intervalId = setInterval(updateFavicon, CYCLE_TIME)
            }
        }

        const stopAnimation = () => {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
            }
        }

        // 3. Visibility-based Title & Animation Control
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopAnimation()
                document.title = AWAY_TITLE
            } else {
                startAnimation()
                document.title = ORIGINAL_TITLE
            }
        }

        // Initial setup
        if (!document.hidden) {
            startAnimation()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        // 4. Cleanup to prevent memory leaks
        return () => {
            stopAnimation()
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    // Component returns null to avoid any DOM injection or re-renders
    return null
}

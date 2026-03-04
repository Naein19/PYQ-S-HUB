'use client'

import { useEffect, useState } from 'react'

const FRAMES = [
    '/favicon-frame1.png',
    '/favicon-frame2.png',
    '/favicon-frame3.png',
    '/favicon-frame4.png',
]

const CYCLE_TIME = 400 // ms

export default function AnimatedFavicon() {
    const [frameIndex, setFrameIndex] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout

        const updateFavicon = (index: number) => {
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
            if (link) {
                link.href = FRAMES[index]
            }
        }

        const startAnimation = () => {
            interval = setInterval(() => {
                setFrameIndex((prev) => {
                    const next = (prev + 1) % FRAMES.length
                    updateFavicon(next)
                    return next
                })
            }, CYCLE_TIME)
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                startAnimation()
            } else {
                clearInterval(interval)
            }
        }

        // Initial start if visible
        if (document.visibilityState === 'visible') {
            startAnimation()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    return null
}

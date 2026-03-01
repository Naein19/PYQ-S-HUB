'use client'

import { useEffect, useState } from 'react'

const TAB_CONFIG = [
    { title: 'Study', icon: '/assets/study.png' },
    { title: 'Plan', icon: '/assets/plan.png' },
    { title: 'Execute Well', icon: '/assets/icon_dark.png' }
]

export default function TabManager() {
    const [originalTitle, setOriginalTitle] = useState('')
    const [originalIcon, setOriginalIcon] = useState('')

    useEffect(() => {
        // Save original state
        setOriginalTitle(document.title)
        const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
        if (link) {
            setOriginalIcon(link.href)
        }

        let intervalId: NodeJS.Timeout | null = null
        let currentIndex = 0

        const startLoop = () => {
            if (intervalId) return

            intervalId = setInterval(() => {
                const config = TAB_CONFIG[currentIndex]
                document.title = config.title

                // Update Favicon
                let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
                if (!link) {
                    link = document.createElement('link')
                    link.rel = 'icon'
                    document.getElementsByTagName('head')[0].appendChild(link)
                }
                link.href = config.icon

                currentIndex = (currentIndex + 1) % TAB_CONFIG.length
            }, 3000) // 3 seconds interval for the loop
        }

        const stopLoop = () => {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
            }
            document.title = originalTitle
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
            if (link && originalIcon) {
                link.href = originalIcon
            }
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // When user leaves the tab, wait 30 seconds before starting the loop?
                // Or start immediately but repeat every 30s?
                // The user said "every 30 seconds the loop of these title should run"
                // I'll start immediately but let's assume they want it to loop.
                startLoop()
            } else {
                stopLoop()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            if (intervalId) clearInterval(intervalId)
        }
    }, [originalTitle, originalIcon])

    return null
}

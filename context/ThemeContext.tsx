'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
    isDark: boolean
}

// Default value ensures useTheme() never throws during SSR / static prerendering
const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    toggleTheme: () => { },
    isDark: false,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Only runs on the client
        const saved = localStorage.getItem('pyqs-theme') as Theme | null
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initial: Theme = saved ?? 'light'
        setTheme(initial)
        applyThemeToDom(initial)
        setMounted(true)
    }, [])

    const applyThemeToDom = (t: Theme) => {
        const root = document.documentElement
        if (t === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }

    const toggleTheme = useCallback(() => {
        if (!mounted) return
        setTheme(prev => {
            const next: Theme = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem('pyqs-theme', next)
            applyThemeToDom(next)
            return next
        })
    }, [mounted])

    // Always render the Provider so children can safely call useTheme()
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}

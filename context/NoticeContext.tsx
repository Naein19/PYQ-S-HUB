'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Notice {
    id: string
    text: string
    type: 'all' | 'signed'
    isActive: boolean
}

interface NoticeContextType {
    notices: Notice[]
    addNotice: (text: string, type: 'all' | 'signed') => void
    updateNotice: (id: string, updates: Partial<Notice>) => void
    deleteNotice: (id: string) => void
    toggleNotice: (id: string) => void
    activeNotice: Notice | null
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined)

const DEFAULT_NOTICES: Notice[] = [
    { id: '1', text: 'Currently only admins can upload papers. Stay tuned for community uploads!', type: 'all', isActive: true },
    { id: '2', text: 'Welcome back! You have access to the exclusive signed-in user archive.', type: 'signed', isActive: true }
]

export function NoticeProvider({ children }: { children: React.ReactNode }) {
    const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES)

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('pyqs_hub_notices')
        if (saved) {
            try {
                setNotices(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse saved notices', e)
            }
        }
    }, [])

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('pyqs_hub_notices', JSON.stringify(notices))
    }, [notices])

    const addNotice = (text: string, type: 'all' | 'signed') => {
        const newNotice: Notice = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            type,
            isActive: true
        }
        setNotices(prev => [...prev, newNotice])
    }

    const updateNotice = (id: string, updates: Partial<Notice>) => {
        setNotices(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
    }

    const deleteNotice = (id: string) => {
        setNotices(prev => prev.filter(n => n.id !== id))
    }

    const toggleNotice = (id: string) => {
        setNotices(prev => prev.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n))
    }

    // This logic should ideally match what's in NoticeTicker but can be centralized here
    const getActiveNotice = () => {
        // In a real app, this might depend on auth state, 
        // but let's keep it simple and let the consumer filter based on AuthContext
        return notices.find(n => n.isActive) || null
    }

    return (
        <NoticeContext.Provider value={{
            notices,
            addNotice,
            updateNotice,
            deleteNotice,
            toggleNotice,
            activeNotice: getActiveNotice()
        }}>
            {children}
        </NoticeContext.Provider>
    )
}

export function useNotices() {
    const context = useContext(NoticeContext)
    if (context === undefined) {
        throw new Error('useNotices must be used within a NoticeProvider')
    }
    return context
}

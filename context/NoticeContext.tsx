'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { cachedFetch } from '@/lib/data-fetcher'

export interface Notice {
    id: string
    text: string
    type: 'all' | 'signed'
    isActive: boolean
    created_at?: string
}

interface NoticeContextType {
    notices: Notice[]
    addNotice: (text: string, type: 'all' | 'signed') => Promise<void>
    updateNotice: (id: string, updates: Partial<Notice>) => Promise<void>
    deleteNotice: (id: string) => Promise<void>
    toggleNotice: (id: string) => Promise<void>
    activeNotice: Notice | null
    loading: boolean
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined)

export function NoticeProvider({ children }: { children: React.ReactNode }) {
    const [notices, setNotices] = useState<Notice[]>([])
    const [loading, setLoading] = useState(true)

    // Initial fetch - Only ONE fetch per session (or from cache)
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true)
                // Fetch from static JSON with 24h cache strategy
                const data = await cachedFetch<Notice[]>(
                    '/data/notices.json',
                    'pyqs_notices'
                )
                setNotices(data || [])
            } catch (error) {
                console.error('Error fetching notices:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNotices()
    }, [])

    const addNotice = async (text: string, type: 'all' | 'signed') => {
        const { data, error } = await supabase
            .from('notices')
            .insert({
                text,
                type,
                isActive: true
            })
            .select()
            .single()

        if (error) {
            console.error('Error adding notice:', error)
        } else if (data) {
            setNotices(prev => [data as Notice, ...prev])
        }
    }

    const updateNotice = async (id: string, updates: Partial<Notice>) => {
        // Optimistic update
        setNotices(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))

        const { error } = await supabase
            .from('notices')
            .update(updates)
            .eq('id', id)

        if (error) console.error('Error updating notice:', error)
    }

    const deleteNotice = async (id: string) => {
        // Optimistic update
        setNotices(prev => prev.filter(n => n.id !== id))

        const { error } = await supabase
            .from('notices')
            .delete()
            .eq('id', id)

        if (error) console.error('Error deleting notice:', error)
    }

    const toggleNotice = async (id: string) => {
        const notice = notices.find(n => n.id === id)
        if (!notice) return

        const newStatus = !notice.isActive
        // Optimistic update
        setNotices(prev => prev.map(n => n.id === id ? { ...n, isActive: newStatus } : n))

        const { error } = await supabase
            .from('notices')
            .update({ isActive: newStatus })
            .eq('id', id)

        if (error) console.error('Error toggling notice:', error)
    }

    const getActiveNotice = () => {
        return notices.find(n => n.isActive) || null
    }

    return (
        <NoticeContext.Provider value={{
            notices,
            addNotice,
            updateNotice,
            deleteNotice,
            toggleNotice,
            activeNotice: getActiveNotice(),
            loading
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


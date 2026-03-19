'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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

    // Initial fetch and Realtime subscription
    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('notices')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching notices:', error)
            } else {
                setNotices(data || [])
            }
            setLoading(false)
        }

        fetchNotices()

        // Subscribe to real-time changes
        const channel = supabase
            .channel('notices-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notices'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setNotices((prev) => [payload.new as Notice, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setNotices((prev) =>
                            prev.map((n) => (n.id === payload.new.id ? (payload.new as Notice) : n))
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setNotices((prev) => prev.filter((n) => n.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const addNotice = async (text: string, type: 'all' | 'signed') => {
        const { error } = await supabase
            .from('notices')
            .insert({
                text,
                type,
                isActive: true
            })

        if (error) console.error('Error adding notice:', error)
    }

    const updateNotice = async (id: string, updates: Partial<Notice>) => {
        const { error } = await supabase
            .from('notices')
            .update(updates)
            .eq('id', id)

        if (error) console.error('Error updating notice:', error)
    }

    const deleteNotice = async (id: string) => {
        const { error } = await supabase
            .from('notices')
            .delete()
            .eq('id', id)

        if (error) console.error('Error deleting notice:', error)
    }

    const toggleNotice = async (id: string) => {
        const notice = notices.find(n => n.id === id)
        if (!notice) return

        const { error } = await supabase
            .from('notices')
            .update({ isActive: !notice.isActive })
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


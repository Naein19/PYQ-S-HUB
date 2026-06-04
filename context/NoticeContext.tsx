'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { sanitizeInput } from '@/lib/security'

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

    // Initial fetch from Supabase + Real-time subscription
    useEffect(() => {
        const setupNotices = async () => {
            try {
                setLoading(true)
                // Fetch initial notices from Supabase
                const { data, error } = await supabase
                    .from('notices')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) {
                    console.error('Error fetching notices:', error)
                } else {
                    setNotices(data || [])
                }

                // Set up real-time subscription for INSERT/UPDATE/DELETE
                const subscription = supabase
                    .channel('notices_channel')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'notices' },
                        (payload: any) => {
                            if (payload.eventType === 'INSERT') {
                                setNotices(prev => [payload.new as Notice, ...prev])
                            } else if (payload.eventType === 'UPDATE') {
                                setNotices(prev =>
                                    prev.map(n => n.id === payload.new.id ? (payload.new as Notice) : n)
                                )
                            } else if (payload.eventType === 'DELETE') {
                                setNotices(prev => prev.filter(n => n.id !== payload.old.id))
                            }
                        }
                    )
                    .subscribe()

                return () => {
                    subscription.unsubscribe()
                }
            } catch (error) {
                console.error('Error setting up notices:', error)
            } finally {
                setLoading(false)
            }
        }

        const cleanup = setupNotices()
        return () => {
            cleanup?.then(fn => fn?.())
        }
    }, [])

    const addNotice = async (text: string, type: 'all' | 'signed') => {
        const cleanText = sanitizeInput(text)
        const { data, error } = await supabase
            .from('notices')
            .insert({
                text: cleanText,
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
        const sanitizedUpdates = { ...updates }
        if (updates.text) {
            sanitizedUpdates.text = sanitizeInput(updates.text)
        }

        // Optimistic update
        setNotices(prev => prev.map(n => n.id === id ? { ...n, ...sanitizedUpdates } : n))

        const { error } = await supabase
            .from('notices')
            .update(sanitizedUpdates)
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


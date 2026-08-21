'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { getSavedPaperIds } from '@/lib/activity'

interface AuthContextType {
    user: User | null
    role: string | null
    loading: boolean
    signOut: () => Promise<void>
    savedPaperIds: Set<string>
    setSavedPaper: (paperId: string, saved: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [savedPaperIds, setSavedPaperIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        let isMounted = true;

        // onAuthStateChange fires an INITIAL_SESSION event immediately on
        // subscribe with the current session, so a separate getSession()
        // call isn't needed. Calling both concurrently (especially under
        // React StrictMode's double-invoked effects) makes two requests
        // race for the same Web Locks API lock, causing
        // "Lock ... was released because another request stole it".
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null)
                setRole(session?.user?.app_metadata?.role ?? null)
                setLoading(false)
            }
        })

        return () => {
            isMounted = false;
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (!user) {
            setSavedPaperIds(new Set())
            return
        }
        // Fetched once here (a single query) instead of every PYQCard
        // independently querying its own saved status — pages that render
        // many cards at once (e.g. /explore) would otherwise fire one
        // Supabase request per card.
        getSavedPaperIds(user.id).then(ids => setSavedPaperIds(new Set(ids)))
    }, [user])

    const setSavedPaper = (paperId: string, saved: boolean) => {
        setSavedPaperIds(prev => {
            const next = new Set(prev)
            if (saved) next.add(paperId)
            else next.delete(paperId)
            return next
        })
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setRole(null)
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut, savedPaperIds, setSavedPaper }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

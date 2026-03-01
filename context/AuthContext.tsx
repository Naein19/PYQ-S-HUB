'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    role: string | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                // Check active sessions and sets the user
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) throw error;

                if (isMounted) {
                    setUser(session?.user ?? null)
                    setRole(session?.user?.user_metadata?.role ?? null)
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        initializeAuth()

        // Listen for changes on auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null)
                setRole(session?.user?.user_metadata?.role ?? null)
                setLoading(false)
            }
        })

        return () => {
            isMounted = false;
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setRole(null)
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
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

import { supabase } from '@/lib/supabase'
import { CacheManager } from '@/lib/cache'

export type ActivityAction = 'view' | 'download'

// userId is passed in by the caller (from useAuth()/AuthContext's already-
// established session) instead of each function calling supabase.auth.getUser()
// itself. getUser()/getSession() acquire a browser-wide Web Locks API lock on
// the auth token; dozens of PYQCards mounting at once each calling it
// independently caused "Lock ... was released because another request stole
// it" / AbortError crashes on pages like /explore that render many cards.

export async function logActivity(paperId: string, action: ActivityAction, userId: string | null | undefined) {
    if (!userId) return

    await supabase.from('paper_activity').insert({
        user_id: userId,
        paper_id: paperId,
        action,
    })
}

export async function isPaperSaved(paperId: string, userId: string | null | undefined): Promise<boolean> {
    if (!userId) return false

    return CacheManager.deduplicate(`is_saved_${userId}_${paperId}`, async () => {
        const { data } = await supabase
            .from('saved_papers')
            .select('id')
            .eq('paper_id', paperId)
            .maybeSingle()

        return !!data
    })
}

export async function toggleSavePaper(paperId: string, userId: string | null | undefined): Promise<boolean> {
    if (!userId) throw new Error('Sign in to save papers.')

    const { data: existing } = await supabase
        .from('saved_papers')
        .select('id')
        .eq('paper_id', paperId)
        .maybeSingle()

    if (existing) {
        await supabase.from('saved_papers').delete().eq('id', existing.id)
        return false
    }

    await supabase.from('saved_papers').insert({ paper_id: paperId })
    return true
}

export interface UserStats {
    viewed: number
    downloaded: number
    saved: number
}

export async function getUserStats(userId: string | null | undefined): Promise<UserStats> {
    if (!userId) return { viewed: 0, downloaded: 0, saved: 0 }

    return CacheManager.deduplicate(`user_stats_${userId}`, async () => {
        const [viewRes, downloadRes, savedRes] = await Promise.all([
            supabase.from('paper_activity').select('id', { count: 'exact', head: true }).eq('action', 'view'),
            supabase.from('paper_activity').select('id', { count: 'exact', head: true }).eq('action', 'download'),
            supabase.from('saved_papers').select('id', { count: 'exact', head: true }),
        ])

        return {
            viewed: viewRes.count || 0,
            downloaded: downloadRes.count || 0,
            saved: savedRes.count || 0,
        }
    })
}

export async function getRecentActivityPaperIds(userId: string | null | undefined, limit: number = 4): Promise<string[]> {
    if (!userId) return []

    return CacheManager.deduplicate(`recent_activity_${userId}_${limit}`, async () => {
        const { data } = await supabase
            .from('paper_activity')
            .select('paper_id, created_at')
            .order('created_at', { ascending: false })
            .limit(limit * 3)

        if (!data) return []

        const seen = new Set<string>()
        const ids: string[] = []
        for (const row of data) {
            if (!seen.has(row.paper_id)) {
                seen.add(row.paper_id)
                ids.push(row.paper_id)
            }
            if (ids.length >= limit) break
        }
        return ids
    })
}

export async function getSavedPaperIds(userId: string | null | undefined): Promise<string[]> {
    if (!userId) return []

    return CacheManager.deduplicate(`saved_paper_ids_${userId}`, async () => {
        const { data } = await supabase
            .from('saved_papers')
            .select('paper_id')
            .order('created_at', { ascending: false })

        return (data || []).map(row => row.paper_id)
    })
}

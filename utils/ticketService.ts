import { supabase } from '@/lib/supabase'

export type TicketIssueType = 
    | 'Bug Report'
    | 'Feedback / Suggestion'
    | 'Content Issue'
    | 'Wrong Subject Mapping'
    | 'Missing Paper'
    | 'Upload Issue'
    | 'UI Bug'
    | 'Other'

export interface SupportTicket {
    id?: string
    created_at?: string
    issue_type: TicketIssueType
    subject_code?: string
    description: string
    email: string
    paper_id?: string | null
    status?: 'open' | 'closed'
}

export const ticketService = {
    async submitTicket(ticket: SupportTicket) {
        const response = await supabase
            .from('support_tickets')
            .insert([{
                issue_type: ticket.issue_type,
                description: ticket.description,
                email: ticket.email,
                subject_code: ticket.subject_code || null,
                paper_id: ticket.paper_id || null,
                status: 'open'
            }])
            .select()

        console.log("INSERT RESPONSE:", response.data, response.error)

        if (response.error) throw response.error
        return response.data?.[0]
    },

    async getTickets() {
        const response = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false })

        console.log("FETCH RESPONSE:", response.data, response.error)

        if (response.error) {
            console.error(response.error)
            throw response.error
        }
        return (response.data || []) as SupportTicket[]
    },

    async resolveTicket(id: string) {
        const { error } = await supabase
            .from('support_tickets')
            .update({ status: 'closed' })
            .eq('id', id)

        if (error) throw error
    },

    async deleteTicket(id: string) {
        const { error } = await supabase
            .from('support_tickets')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}

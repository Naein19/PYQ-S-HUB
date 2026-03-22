import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function exportData() {
    console.log('Fetching subjects from Supabase...')
    const { data: subjectsData, error: subjectsError } = await supabase
        .from('pyqs')
        .select('subject_code, subject_title')
        .order('subject_code', { ascending: true })

    if (subjectsError) {
        console.error('Error fetching subjects:', subjectsError)
        process.exit(1)
    }

    // Manual distinct since Supabase select('subject_code, subject_title') doesn't support easy "distinct on"
    const subjects = subjectsData.reduce((acc, current) => {
        const x = acc.find(item => item.subject_code === current.subject_code)
        if (!x) {
            return acc.concat([current])
        } else {
            return acc
        }
    }, [])

    console.log(`Found ${subjects.length} unique subjects. Saving to public/data/subjects.json...`)
    fs.writeFileSync('public/data/subjects.json', JSON.stringify(subjects, null, 2))

    console.log('Fetching all papers from Supabase...')
    const { data: papersData, error: papersError } = await supabase
        .from('pyqs')
        .select('*')
        .order('created_at', { ascending: false })

    if (papersError) {
        console.error('Error fetching papers:', papersError)
        process.exit(1)
    }

    console.log(`Found ${papersData.length} papers. Saving to public/data/papers.json...`)
    fs.writeFileSync('public/data/papers.json', JSON.stringify(papersData, null, 2))

    console.log('Fetching all notices from Supabase...')
    const { data: noticesData, error: noticesError } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })

    if (noticesError) {
        console.error('Error fetching notices:', noticesError)
        process.exit(1)
    }

    console.log(`Found ${noticesData.length} notices. Saving to public/data/notices.json...`)
    fs.writeFileSync('public/data/notices.json', JSON.stringify(noticesData, null, 2))

    console.log('Data export complete!')
}

exportData()

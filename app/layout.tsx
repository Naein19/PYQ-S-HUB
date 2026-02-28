import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'
import { ViewProvider } from '@/context/ViewContext'
import PDFViewerOverlay from '@/components/pyq/PDFViewerOverlay'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: "PYQ's Hub — Previous Year Question Papers",
        template: "%s | PYQ's Hub",
    },
    description:
        "Industrial academic archive for engineering students. Organized by department, semester, and exam tier.",
    keywords: ['PYQ', 'engineering', 'CAT-1', 'CAT-2', 'FAT', 'question papers'],
}

import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${jetbrains.variable} scroll-smooth`}>
            <body className="bg-[#EAE0D5] text-[#111827] min-h-screen flex flex-col font-sans">
                <AuthProvider>
                    <ViewProvider>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <PDFViewerOverlay />
                    </ViewProvider>
                </AuthProvider>
            </body>
        </html>
    )
}

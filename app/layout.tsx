import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'
import { ViewProvider } from '@/context/ViewContext'

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import TabManager from '@/components/layout/TabManager'

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

import JsonLd from '@/components/SEO/JsonLd'

export const metadata: Metadata = {
    metadataBase: new URL('https://pyqs-hub.vercel.app'),
    title: {
        default: "VIT-AP Previous Year Question Papers | PYQ’s Hub",
        template: "%s | PYQ's Hub",
    },
    description:
        "Access VIT-AP CAT-1, CAT-2, and FAT previous year question papers organized by subject, semester, and department. Industrial academic archive for engineering students.",
    keywords: ['VIT-AP', 'VITAP', 'Previous Year Papers', 'PYQ', 'engineering', 'CAT-1', 'CAT-2', 'FAT', 'question papers', 'VIT AP exam papers'],
    authors: [{ name: 'PYQ’s Hub Team' }],
    creator: 'PYQ’s Hub',
    publisher: 'PYQ’s Hub',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "VIT-AP Previous Year Question Papers | PYQ’s Hub",
        description: "Access VIT-AP CAT-1, CAT-2, and FAT previous year question papers organized by subject, semester, and department.",
        url: 'https://pyqs-hub.vercel.app',
        siteName: "PYQ’s Hub",
        images: [
            {
                url: '/assets/og-image.png',
                width: 1200,
                height: 630,
                alt: "PYQ’s Hub - VIT-AP Previous Year Papers",
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "VIT-AP Previous Year Question Papers | PYQ’s Hub",
        description: "Access VIT-AP CAT-1, CAT-2, and FAT previous year question papers organized by subject, semester, and department.",
        images: ['/assets/og-image.png'],
        creator: '@pyqshub',
    },
    icons: {
        icon: '/assets/icon_light.png',
        shortcut: '/assets/icon_light.png',
        apple: '/assets/icon_light.png',
    },
}

import { AuthProvider } from '@/context/AuthContext'
import { LoadingProvider } from '@/context/LoadingContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${jetbrains.variable} scroll-smooth`}>
            <head>
                <JsonLd />
            </head>
            <body className="bg-[#EAE0D5] text-[#111827] min-h-screen flex flex-col font-sans">
                <AuthProvider>
                    <LoadingProvider>
                        <ViewProvider>
                            <Navbar />
                            <main className="flex-1">{children}</main>
                            <Footer />
                            <Analytics />
                            <SpeedInsights />
                            <TabManager />
                        </ViewProvider>
                    </LoadingProvider>
                </AuthProvider>
            </body>
        </html>
    )
}

import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'
import { ViewProvider } from '@/context/ViewContext'

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import TabManager from '@/components/layout/TabManager'
import AnimatedFavicon from '@/components/AnimatedFavicon'
import NoticeTicker from '@/components/layout/NoticeTicker'

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

export const viewport: Viewport = {
    themeColor: '#EAE0D5',
}

export const metadata: Metadata = {
    metadataBase: new URL('https://pyqs-hub.vercel.app'),
    title: {
        default: "PYQ’s Hub | VIT-AP Previous Year Question Papers",
        template: "%s | PYQ's Hub",
    },
    description:
        "Access VIT-AP CAT-1, CAT-2, and FAT previous year question papers organized by subject, semester, and department. The ultimate industrial-grade academic archive for VIT Amaravati students.",
    keywords: [
        'VIT-AP PYQs',
        'VIT Amaravati Previous Year Papers',
        'VIT AP Question Papers',
        'CAT-1 CAT-2 FAT VIT AP',
        'VITAP Exam Papers',
        'PYQ’s Hub',
        'Engineering PYQs',
        'Subject Wise Papers VITAP'
    ],
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
    manifest: '/site.webmanifest',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: "PYQ's Hub",
    },
    openGraph: {
        title: "PYQ’s Hub | VIT-AP Previous Year Question Papers",
        description: "Industrial academic archive for VIT-AP engineering students. CAT-1, CAT-2, and FAT papers organized by subject and semester.",
        url: 'https://pyqs-hub.vercel.app',
        siteName: "PYQ’s Hub",
        images: [
            {
                url: '/og-image.png',
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
        title: "PYQ’s Hub | VIT-AP Previous Year Papers",
        description: "Access VIT-AP CAT-1, CAT-2, and FAT previous year question papers organized by subject, semester, and department.",
        images: ['/og-image.png'],
        creator: '@pyqshub',
    },
    icons: {
        icon: '/favicon-frame1.png',
    },
}

import { AuthProvider } from '@/context/AuthContext'
import { LoadingProvider } from '@/context/LoadingContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { NoticeProvider } from '@/context/NoticeContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable} scroll-smooth`}>
            <head>
                <JsonLd />
                {/* Preload Favicon Animation Frames to prevent repeated network requests */}
                <link rel="preload" href="/favicon-frame1.png" as="image" />
                <link rel="preload" href="/favicon-frame2.png" as="image" />
                <link rel="preload" href="/favicon-frame3.png" as="image" />
                <link rel="preload" href="/favicon-frame4.png" as="image" />

                {/* Inline script: apply saved theme before first paint to prevent FOUC */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('pyqs-theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
                    }}
                />
            </head>
            <body className="bg-[var(--color-surface)] text-[var(--color-text)] min-h-screen flex flex-col font-sans">
                <AnimatedFavicon />
                <ThemeProvider>
                    <AuthProvider>
                        <NoticeProvider>
                            <LoadingProvider>
                                <ViewProvider>
                                    <NoticeTicker />
                                    <Navbar />
                                    <main className="flex-1">{children}</main>
                                    <Footer />
                                    <TabManager />
                                </ViewProvider>
                            </LoadingProvider>
                        </NoticeProvider>
                    </AuthProvider>
                </ThemeProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}

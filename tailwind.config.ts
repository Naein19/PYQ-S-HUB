import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Light theme
                'surface': '#EAE0D5',   // warm beige section BG
                'card': '#FFFFFF',   // card surface
                'primary-text': '#111827',   // strong text
                'muted': '#6B7280',   // muted text
                'border-ink': '#111827',   // dark border for cards

                // Brand gradient colors
                'brand-start': '#4338CA',
                'brand-end': '#6D28D9',

                // Exam badge colors
                'cat1-bg': '#EEF2FF',
                'cat1-text': '#4338CA',
                'cat2-bg': '#ECFEFF',
                'cat2-text': '#0891B2',
                'fat-bg': '#F3F4F6',
                'fat-text': '#374151',

                // Dark mode tokens
                'dark-bg': '#000000',
                'dark-card': '#0A0A0A',
                'dark-border': '#1A1A1A',
                'dark-text': '#FFFFFF',
                'dark-muted': '#A3A3A3',

                // Legacy compat
                primary: '#4338CA',
                accent: '#6D28D9',
                background: '#EAE0D5',
                textPrimary: '#111827',
                border: '#111827',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
            },
            maxWidth: {
                container: '1280px',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            boxShadow: {
                'card-frame': '6px 6px 0px #111827',
                'card-frame-dark': '6px 6px 0px #1A1A1A',
                'card-hover': '8px 8px 0px #111827',
                'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
            },
            borderRadius: {
                DEFAULT: '8px',
                card: '8px',
            },
            animation: {
                'fade-in': 'fadeIn 200ms ease-out forwards',
                'scan-vertical': 'scan-vertical 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scan-vertical': {
                    '0%': { top: '0%', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { top: '100%', opacity: '0' },
                },
            },
            transitionDuration: {
                '150': '150ms',
            },
        },
    },
    plugins: [],
}

export default config

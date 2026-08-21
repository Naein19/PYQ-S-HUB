import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/dashboard/', '/settings/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'CCBot',
                    'ClaudeBot',
                    'anthropic-ai',
                    'Bytespider',
                    'PetalBot',
                    'MJ12bot',
                    'DotBot',
                    'AhrefsBot',
                    'SemrushBot',
                    'serpstatbot',
                ],
                disallow: '/',
            },
        ],
        sitemap: 'https://pyqs-hub.vercel.app/sitemap.xml',
    }
}

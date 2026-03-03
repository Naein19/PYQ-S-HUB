import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/settings/'],
        },
        sitemap: 'https://pyqs-hub.vercel.app/sitemap.xml',
    }
}

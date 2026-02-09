import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Rohit Raj — Freelance Founding Engineer',
        short_name: 'Rohit Raj',
        description:
            'Freelance Founding Engineer building production AI systems. View projects, case studies, and reliability engineering.',
        start_url: '/en',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#3b82f6',
        orientation: 'portrait-primary',
        categories: ['portfolio', 'technology', 'developer'],
        icons: [
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };
}

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'JANI AI',
        short_name: 'jani_ai',
        description: 'A Traceability software for farmers',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/jani.svg',
                sizes: '192x192',
                type: 'image/svg',
            },
        ],
    }
}
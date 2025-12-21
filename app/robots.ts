import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Example: exclude private areas if you have any
        },
        sitemap: 'https://flashh-portfolio.netlify.app/sitemap.xml', // Replace with your domain
    };
}

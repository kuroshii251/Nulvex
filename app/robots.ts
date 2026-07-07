import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Disallow crawling of admin routes
    },
    // Replace with your actual production domain
    sitemap: 'https://nulvex.io/sitemap.xml',
  };
}

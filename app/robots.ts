import type { MetadataRoute } from 'next';
import { siteConfig, isIndexable } from '@/constants/site';

export default function robots(): MetadataRoute.Robots {
  // Preview/staging deployments are fully public but must not be indexed:
  // placeholder content should never rank, and the .vercel.app URL would
  // otherwise compete with the real domain once it launches.
  if (!isIndexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nothing under /api is useful to a crawler, and the contact endpoint
        // should not be discovered by one.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

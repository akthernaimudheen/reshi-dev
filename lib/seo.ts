import type { Metadata } from 'next';
import { siteConfig } from '@/constants/site';

type SeoInput = {
  title: string;
  description: string;
  /** Path only, with a leading slash. */
  path: string;
  /** Suppresses the "| Reshi AI" suffix — used by the home page. */
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  noIndex?: boolean;
};

/**
 * Builds a complete metadata object: canonical, OpenGraph, Twitter card and
 * robots directives. Pages should never hand-roll these.
 */
export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = 'website',
  publishedTime,
  noIndex = false,
}: SeoInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const resolvedTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;

  // The OG image is generated per-route by `opengraph-image.tsx`; passing the
  // route path lets Next resolve it, and the array stays empty so Next's own
  // file-convention images are not overridden.
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type,
      url,
      title: resolvedTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      creator: '@reshiai',
    },
  };
}

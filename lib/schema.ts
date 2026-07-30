import { siteConfig } from '@/constants/site';
import type { CaseStudy, FaqItem, Service } from '@/types';

/**
 * JSON-LD builders. Each returns a plain object that a page embeds via the
 * `<JsonLd>` component. Keeping them here means the `@id` values stay
 * consistent, which is what lets Google stitch the graph together.
 */

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    foundingDate: siteConfig.founded,
    founder: {
      '@type': 'Person',
      name: siteConfig.founder.name,
      jobTitle: siteConfig.founder.role,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: siteConfig.contact.email,
      ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
      availableLanguage: ['English', 'Malayalam'],
    },
    // Only real profiles; an empty or invented sameAs entry is worse than none.
    sameAs: Object.values(siteConfig.social).filter((url) => url.length > 0),
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}/opengraph-image`,
    url: siteConfig.url,
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    email: siteConfig.contact.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:30',
        closes: '18:30',
      },
    ],
    areaServed: [
      { '@type': 'State', name: 'Kerala' },
      { '@type': 'Country', name: 'India' },
    ],
    parentOrganization: { '@id': ORGANIZATION_ID },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    url: `${siteConfig.url}/services/${service.slug}`,
    provider: { '@id': ORGANIZATION_ID },
    serviceType: service.title,
    areaServed: { '@type': 'Country', name: 'India' },
    ...(service.startingPrice
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            description: `Starting from ${service.startingPrice}`,
          },
        }
      : {}),
  };
}

export function caseStudySchema(study: CaseStudy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.excerpt,
    url: `${siteConfig.url}/case-studies/${study.slug}`,
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    about: study.client,
  };
}

export function blogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `${siteConfig.url}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };
}

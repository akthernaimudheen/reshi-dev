/**
 * Single source of truth for identity, contact details and navigation.
 * Every page title, JSON-LD block, footer link and mailto: reads from here.
 */

export const siteConfig = {
  name: 'Reshi AI',
  legalName: 'Reshi AI',
  tagline: 'Websites, automation and AI for growing local businesses',
  /**
   * Shorter tagline used in <title>. Search results truncate around 60
   * characters, and `name + separator + this` has to fit inside that.
   */
  metaTagline: 'Websites, Automation & AI for Local Business',
  description:
    'Reshi AI builds custom websites, business automation and AI systems that turn local restaurants, hotels, clinics and brands into growing businesses.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reshi.ai',
  locale: 'en_IN',
  founded: '2023',

  founder: {
    name: 'Akther Naimudheen',
    role: 'Founder & Lead Engineer',
  },

  /**
   * Anything blank here is HIDDEN everywhere it would render, rather than
   * shown as a dead link. Fill each in as it becomes real.
   */
  contact: {
    email: 'hello@reshi.ai',
    // `as string` widens these past the literal '' that `as const` would infer,
    // so a truthy guard narrows to string rather than to `never`.
    /** e.g. '+91 98765 43210'. Blank until a real line exists. */
    phone: '' as string,
    /** Digits only — WhatsApp deep links reject spaces and punctuation. */
    whatsapp: '' as string,
    /** Full booking URL. Blank until the calendar is live. */
    calendly: '' as string,
  },

  address: {
    locality: 'Kochi',
    region: 'Kerala',
    country: 'IN',
    countryName: 'India',
  },

  /** Latitude/longitude power the LocalBusiness schema and the contact map. */
  geo: {
    latitude: 9.9312,
    longitude: 76.2673,
  },

  /** Blank entries are filtered out of the footer and the JSON-LD graph. */
  social: {
    instagram: '' as string,
    linkedin: '' as string,
    x: '' as string,
    github: '' as string,
  },

  /**
   * Standards we build to — NOT a track record. Do not put project counts or
   * client results here until they are real and measured.
   */
  stats: [
    { value: '6', label: 'Industries we focus on' },
    { value: '<1.5s', label: 'Load time we build to' },
    { value: '100', label: 'Accessibility target' },
    { value: '8 wks', label: 'Typical build' },
  ],
} as const;

/**
 * Search engines are told to index the site ONLY when this is explicitly
 * enabled. It defaults to off so preview and staging deployments can never be
 * indexed by accident — set NEXT_PUBLIC_SITE_INDEXABLE=true on the production
 * domain once the content is real.
 */
export const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true';

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href: string;
  /** Presence of `items` is what promotes a nav entry to a mega-menu. */
  items?: NavItem[];
};

export const mainNav: NavGroup[] = [
  {
    label: 'Services',
    href: '/services',
    items: [
      {
        label: 'Website Development',
        href: '/services/website-development',
        description: 'Fast, editorial sites that convert visitors into enquiries.',
      },
      {
        label: 'Business Automation',
        href: '/services/business-automation',
        description: 'Retire the manual work that eats your team’s week.',
      },
      {
        label: 'AI Solutions',
        href: '/services/ai-solutions',
        description: 'Assistants and agents trained on your own operations.',
      },
      {
        label: 'Local SEO',
        href: '/services/local-seo',
        description: 'Own the map pack and the searches that carry intent.',
      },
      {
        label: 'Branding',
        href: '/services/branding',
        description: 'Identity systems that hold up across every surface.',
      },
      {
        label: 'Digital Marketing',
        href: '/services/digital-marketing',
        description: 'Campaigns measured in revenue, not impressions.',
      },
    ],
  },
  {
    label: 'Work',
    href: '/work',
    items: [
      {
        label: 'All projects',
        href: '/work',
        description: 'Worked scenarios, filterable by industry.',
      },
      {
        label: 'Case studies',
        href: '/case-studies',
        description: 'The problem, the build and the numbers we target.',
      },
      {
        label: 'Industries',
        href: '/industries',
        description: 'How we approach restaurants, hotels, clinics and more.',
      },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
];

export const footerNav = [
  {
    title: 'Services',
    links: [
      { label: 'Website Development', href: '/services/website-development' },
      { label: 'Business Automation', href: '/services/business-automation' },
      { label: 'AI Solutions', href: '/services/ai-solutions' },
      { label: 'Local SEO', href: '/services/local-seo' },
      { label: 'Branding', href: '/services/branding' },
      { label: 'Digital Marketing', href: '/services/digital-marketing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Work', href: '/work' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'Industries', href: '/industries' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
] as const;

/**
 * Null when no WhatsApp number is configured, so callers can omit the button
 * instead of rendering a wa.me link with no recipient.
 */
export const whatsappLink = siteConfig.contact.whatsapp
  ? `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
      'Hi Reshi AI — I’d like to discuss a project.',
    )}`
  : null;

/** Social entries that actually have a URL. */
export const socialLinks = (
  Object.entries(siteConfig.social) as [keyof typeof siteConfig.social, string][]
).filter(([, url]) => url.length > 0);

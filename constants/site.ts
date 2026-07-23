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

  contact: {
    email: 'hello@reshi.ai',
    phone: '+91 00000 00000',
    /** Digits only — WhatsApp deep links reject spaces and punctuation. */
    whatsapp: '910000000000',
    calendly: 'https://calendly.com/reshi-ai/intro',
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

  social: {
    instagram: 'https://instagram.com/reshi.ai',
    linkedin: 'https://linkedin.com/company/reshi-ai',
    x: 'https://x.com/reshiai',
    github: 'https://github.com/reshi-ai',
  },

  /** Cheap credibility numbers used in the hero and about page. */
  stats: [
    { value: '40+', label: 'Projects delivered' },
    { value: '3.4×', label: 'Average lead lift' },
    { value: '<1.5s', label: 'Median load time' },
    { value: '6', label: 'Industries served' },
  ],
} as const;

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
        description: 'The full portfolio, filterable by industry.',
      },
      {
        label: 'Case studies',
        href: '/case-studies',
        description: 'The problem, the build and the numbers afterwards.',
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

export const whatsappLink = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
  'Hi Reshi AI — I’d like to discuss a project.',
)}`;

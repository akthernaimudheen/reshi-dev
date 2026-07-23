import type { LucideIcon } from 'lucide-react';

export type Service = {
  slug: string;
  title: string;
  /** One line for cards; the full pitch lives in `summary`. */
  tagline: string;
  summary: string;
  icon: LucideIcon;
  deliverables: string[];
  outcomes: { metric: string; label: string }[];
  /** Ordered phases shown on the service detail page. */
  process: { title: string; description: string }[];
  startingPrice?: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  industry: Industry['slug'];
  year: string;
  services: string[];
  /** Short line used on portfolio cards. */
  excerpt: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: { value: string; label: string }[];
  /** Hex pair driving the card's gradient placeholder. */
  palette: [string, string];
  featured: boolean;
  liveUrl?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
};

export type Industry = {
  slug: string;
  name: string;
  icon: LucideIcon;
  headline: string;
  description: string;
  painPoints: string[];
  solutions: string[];
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  /** Two-letter fallback shown in the avatar circle. */
  initials: string;
};

export type PricingTier = {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
  note?: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  duration: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  readingTime: number;
  featured?: boolean;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  headings: { id: string; text: string; level: number }[];
};

import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { siteConfig, isIndexable } from '@/constants/site';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SmoothScroll } from '@/components/shared/smooth-scroll';
import { BootSequence } from '@/components/shared/boot-sequence';
import { DeviceTierProvider } from '@/hooks/use-device-tier';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  // Self-hosted and subset at build time, so there is no third-party request
  // and no flash of fallback text beyond the first paint.
  //
  // Only the four weights the design system actually uses. 300 and 800 were
  // declared originally and referenced by nothing — every unused weight is
  // another file competing with the LCP text for bandwidth.
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.metaTagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.founder.name }],
  creator: siteConfig.founder.name,
  publisher: siteConfig.legalName,
  keywords: [
    'digital agency',
    'website development',
    'business automation',
    'AI solutions',
    'local SEO',
    'branding',
    'Kochi',
    'Kerala',
  ],
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: '@reshiai',
  },
  robots: isIndexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FBFC' },
    { media: '(prefers-color-scheme: dark)', color: '#05111F' },
  ],
  width: 'device-width',
  initialScale: 1,
  // Zoom is left unrestricted — capping it is a WCAG 1.4.4 failure.
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="sr-only rounded-pill bg-navy-900 px-5 py-3 text-sm font-semibold text-ink-inverse focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200"
        >
          Skip to content
        </a>

        {/* The provider wraps everything so one shared frame probe decides the
            motion tier for the whole page. */}
        <DeviceTierProvider>
          <BootSequence />
          <SmoothScroll />
          <Header />

          <main id="main" tabIndex={-1}>
            {children}
          </main>

          <Footer />
        </DeviceTierProvider>
      </body>
    </html>
  );
}

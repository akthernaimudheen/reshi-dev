import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { footerNav, siteConfig } from '@/constants/site';
import { Logo } from './logo';
import { NewsletterForm } from '@/components/shared/newsletter-form';

const socialLabels: Record<keyof typeof siteConfig.social, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X',
  github: 'GitHub',
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-surface-dark text-ink-inverse">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-60" />
      {/* Soft cyan bloom anchoring the footer to the CTA band above it. */}
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
      />

      <div className="relative container-content">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <Logo tone="dark" />
            <p className="max-w-sm text-ink-inverse-muted">
              We build the websites, automation and AI systems that turn local businesses
              into growing brands.
            </p>

            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-2.5 text-ink-inverse-muted transition-colors duration-200 hover:text-cyan-300"
                >
                  <Mail aria-hidden="true" className="size-4" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2.5 text-ink-inverse-muted transition-colors duration-200 hover:text-cyan-300"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-ink-inverse-muted">
                <MapPin aria-hidden="true" className="size-4" />
                {siteConfig.address.locality}, {siteConfig.address.region}
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-eyebrow text-cyan-300 uppercase">{group.title}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-inverse-muted transition-colors duration-200 hover:text-ink-inverse"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="grid gap-8 border-t border-line-dark py-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <h2 className="text-h3 text-ink-inverse">One useful email a month</h2>
            <p className="mt-2 max-w-sm text-sm text-ink-inverse-muted">
              What we are learning about local search, automation and AI. No newsletter
              padding.
            </p>
          </div>
          <div className="lg:max-w-md lg:justify-self-end">
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-line-dark py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-inverse-muted">
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-5">
            {(Object.keys(siteConfig.social) as (keyof typeof siteConfig.social)[]).map(
              (key) => (
                <li key={key}>
                  <a
                    href={siteConfig.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-ink-inverse-muted transition-colors duration-200 hover:text-cyan-300"
                  >
                    {socialLabels[key]}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}

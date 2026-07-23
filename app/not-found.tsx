import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Aurora } from '@/components/shared/aurora';
import { Reveal } from '@/components/shared/reveal';
import { MagneticLink } from '@/components/ui/magnetic-button';
import { ButtonLink } from '@/components/ui/button';

const suggestions = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
];

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[85vh] place-items-center overflow-hidden py-32">
      <Aurora />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_70%)]"
      />

      <div className="relative container-content">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 text-center">
          <Reveal y={12} blur={false}>
            <p className="text-gradient text-display leading-none">404</p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-h2 text-navy-900">
              That page does not exist — or it moved.
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="max-w-lg text-lead text-ink-muted">
              If you followed a link from somewhere on this site, that is our mistake and
              we would like to know about it.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3">
              <MagneticLink href="/" size="lg" variant="primary">
                Back to home
                <ArrowUpRight aria-hidden="true" />
              </MagneticLink>
              <ButtonLink href="/contact" size="lg" variant="outline">
                Report a broken link
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <nav aria-label="Suggested pages" className="pt-4">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {suggestions.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-navy-900 hover:decoration-cyan-500"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

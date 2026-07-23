import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { siteConfig, whatsappLink } from '@/constants/site';
import { Aurora } from '@/components/shared/aurora';
import { Reveal } from '@/components/shared/reveal';
import { MagneticLink } from '@/components/ui/magnetic-button';
import { ButtonLink } from '@/components/ui/button';

type CtaSectionProps = {
  title?: string;
  description?: string;
};

export function CtaSection({
  title = 'Let’s find out what your business is leaving on the table.',
  description = 'A 30-minute call, no deck. We will tell you what we would do, roughly what it costs, and whether it is worth doing at all.',
}: CtaSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900">
      <Aurora tone="dark" />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-40" />

      <div className="relative container-content py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <Reveal>
            <h2 className="text-h1 text-ink-inverse">{title}</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-2xl text-lead text-ink-inverse-muted">{description}</p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex flex-wrap justify-center gap-3">
              <MagneticLink href="/contact" size="lg" variant="accent">
                Book a call
                <ArrowUpRight aria-hidden="true" />
              </MagneticLink>
              <ButtonLink
                href={whatsappLink}
                size="lg"
                variant="outline-inverse"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                WhatsApp us
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="text-sm text-ink-inverse-muted">
              Or email{' '}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-cyan-300 underline decoration-cyan-300/40 underline-offset-4 transition-colors hover:decoration-cyan-300"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

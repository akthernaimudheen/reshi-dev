import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/constants/site';
import { timeline, values } from '@/content/site-content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { Counter } from '@/components/shared/counter';
import { CtaSection } from '@/components/shared/cta-section';
import { SectionHeading } from '@/components/ui/section-heading';
import { MagneticLink } from '@/components/ui/magnetic-button';

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Reshi AI is a digital studio in Kerala building websites, automation and AI systems for local businesses. Founded by Akther Naimudheen.',
  path: '/about',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHero
        eyebrow="About"
        title="A small studio that would rather be useful than large."
        description="We started because local businesses were being sold templates at custom prices, and nobody was telling them what would actually move the needle."
        breadcrumbs={breadcrumbs}
      />

      <section className="border-y border-line bg-surface-raised py-12">
        <div className="container-content">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {siteConfig.stats.map((stat) => (
              <Reveal key={stat.label}>
                <div className="flex flex-col gap-1.5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-h2 font-bold tracking-[-0.04em] text-navy-900">
                    <Counter value={stat.value} />
                  </dd>
                  <p aria-hidden="true" className="text-sm text-ink-muted">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y">
        <div className="container-content grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Mission"
              title={
                <>
                  Technology should be{' '}
                  <span className="text-gradient">boringly useful</span>
                </>
              }
            />
            <div className="flex flex-col gap-5 leading-relaxed text-ink-muted">
              <p>
                A restaurant does not need a design award. It needs the table filled on a
                Tuesday. A hotel does not need a rebrand as much as it needs to stop
                paying a fifth of every booking to an aggregator. Our job is to know the
                difference and to say so.
              </p>
              <p>
                We build the digital layer of a business — the site people arrive at, the
                automation that catches the enquiry, the system that answers at midnight —
                and we judge it on whether the business is measurably better off. If a
                project will not pay for itself, we would rather tell you before we
                invoice than after.
              </p>
              <p>That is the whole philosophy. Everything else is craft.</p>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6 rounded-hero border border-line bg-surface-raised p-8 shadow-sm lg:p-10">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center rounded-full bg-navy-900 text-xl font-bold text-cyan-400"
                >
                  AN
                </span>
                <div>
                  <p className="text-h3 text-navy-900">{siteConfig.founder.name}</p>
                  <p className="text-sm text-ink-muted">{siteConfig.founder.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 leading-relaxed text-ink-muted">
                <p>
                  I started Reshi AI after watching too many businesses around me pay real
                  money for a website that loaded in nine seconds and could not be edited
                  without a support ticket.
                </p>
                <p>
                  I still write the code on most projects. That is deliberate — it keeps
                  the promises we make in a proposal tied to the person who has to keep
                  them.
                </p>
              </div>

              <MagneticLink
                href="/contact"
                variant="primary"
                size="md"
                className="self-start"
              >
                Talk to me directly
                <ArrowUpRight aria-hidden="true" />
              </MagneticLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface-sunken section-y">
        <div className="container-content">
          <SectionHeading
            eyebrow="Values"
            title="Four things we will not trade away"
            description="These cost us work occasionally. That is what makes them values rather than marketing."
          />

          <ul className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
            {values.map((value, index) => (
              <Reveal as="li" key={value.title} delay={index * 0.06}>
                <div className="flex h-full flex-col gap-3 bg-surface-raised p-8">
                  <span className="text-sm font-bold text-cyan-600 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-h3 text-navy-900">{value.title}</h3>
                  <p className="leading-relaxed text-ink-muted">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-content grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Timeline" title="How we got here" />
          </div>

          <ol className="flex flex-col">
            {timeline.map((entry, index) => (
              <Reveal as="li" key={entry.year} delay={index * 0.06}>
                {/* The rail is drawn with a left border on the content column
                    so it stays continuous regardless of entry height. */}
                <div className="relative border-l border-line pb-10 pl-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-cyan-500 ring-4 ring-surface"
                  />
                  <p className="text-sm font-semibold text-cyan-700">{entry.year}</p>
                  <h3 className="mt-1.5 text-h3 text-navy-900">{entry.title}</h3>
                  <p className="mt-2 max-w-[58ch] leading-relaxed text-ink-muted">
                    {entry.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection
        title="Want to know if we are a fit?"
        description="The fastest way to find out is a call. We will tell you honestly whether this is work we should be doing."
      />
    </>
  );
}

import { Check, Sparkles } from 'lucide-react';
import { faqs, pricingTiers, retainerAddOns } from '@/content/site-content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { CtaSection } from '@/components/shared/cta-section';
import { SectionHeading } from '@/components/ui/section-heading';
import { Accordion } from '@/components/ui/accordion';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Pricing',
  description:
    'Transparent project pricing for websites, automation and AI systems. Three engagement tiers plus optional monthly retainers.',
  path: '/pricing',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
];

/** Pricing questions only — the general set lives on the home page. */
const pricingFaqs = faqs.filter((faq) =>
  [
    'How do payments work?',
    'Do I own the work?',
    'How long does a project take?',
  ].includes(faq.question),
);

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(pricingFaqs)]} />

      <PageHero
        eyebrow="Pricing"
        title="Real numbers, published."
        description="Most agencies make you sit through a call to hear a price. Here is roughly what things cost. The final figure comes from scope, and we will tell you which parts of it you can skip."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-20">
        <div className="container-content">
          <ul className="grid items-start gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Reveal as="li" key={tier.name} delay={index * 0.08}>
                <div
                  className={cn(
                    'relative flex h-full flex-col gap-7 rounded-hero border p-8 lg:p-9',
                    tier.featured
                      ? 'border-navy-900 bg-navy-900 text-ink-inverse shadow-xl lg:-mt-4 lg:pb-12'
                      : 'border-line bg-surface-raised shadow-xs',
                  )}
                >
                  {tier.featured ? (
                    <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-pill bg-cyan-500 px-3 py-1 text-xs font-semibold text-navy-950">
                      <Sparkles aria-hidden="true" className="size-3" />
                      Most chosen
                    </span>
                  ) : null}

                  <div className="flex flex-col gap-3">
                    <h2
                      className={cn(
                        'text-h3',
                        tier.featured ? 'text-ink-inverse' : 'text-navy-900',
                      )}
                    >
                      {tier.name}
                    </h2>
                    <p
                      className={cn(
                        'text-sm leading-relaxed',
                        tier.featured ? 'text-ink-inverse-muted' : 'text-ink-muted',
                      )}
                    >
                      {tier.description}
                    </p>
                  </div>

                  <p className="flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        'text-h2 font-bold tracking-[-0.04em]',
                        tier.featured ? 'text-ink-inverse' : 'text-navy-900',
                      )}
                    >
                      {tier.price}
                    </span>
                    {tier.cadence ? (
                      <span
                        className={cn(
                          'text-sm',
                          tier.featured ? 'text-ink-inverse-muted' : 'text-ink-muted',
                        )}
                      >
                        {tier.cadence}
                      </span>
                    ) : null}
                  </p>

                  <ButtonLink
                    href={tier.cta.href}
                    size="lg"
                    variant={tier.featured ? 'accent' : 'outline'}
                    className="w-full"
                  >
                    {tier.cta.label}
                  </ButtonLink>

                  <ul
                    className={cn(
                      'flex flex-col gap-3 border-t pt-7',
                      tier.featured ? 'border-line-dark' : 'border-line',
                    )}
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm">
                        <Check
                          aria-hidden="true"
                          className={cn(
                            'mt-0.5 size-4 shrink-0',
                            tier.featured ? 'text-cyan-400' : 'text-cyan-600',
                          )}
                        />
                        <span
                          className={
                            tier.featured ? 'text-ink-inverse-muted' : 'text-ink-muted'
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {tier.note ? (
                    <p
                      className={cn(
                        'mt-auto text-xs',
                        tier.featured ? 'text-ink-inverse-muted/70' : 'text-ink-muted/80',
                      )}
                    >
                      {tier.note}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-sm text-ink-muted">
              All prices exclude GST. Payment is split 40 / 40 / 20 across kickoff, design
              sign-off and launch.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface-raised section-y">
        <div className="container-content grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="Ongoing"
            title="Retainers, only if they earn it"
            description="Optional monthly work for clients who want us to keep running a channel rather than hand it over. Thirty days’ notice, no lock-in."
          />

          <Reveal delay={0.1}>
            <ul className="divide-y divide-line border-y border-line">
              {retainerAddOns.map((addOn) => (
                <li
                  key={addOn.name}
                  className="flex items-center justify-between gap-6 py-5"
                >
                  <span className="font-medium text-navy-900">{addOn.name}</span>
                  <span className="whitespace-nowrap text-ink-muted">{addOn.price}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-content grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Pricing questions" title="Before you ask" />
          </div>
          <Reveal delay={0.1}>
            <Accordion items={pricingFaqs} />
          </Reveal>
        </div>
      </section>

      <CtaSection
        title="Not sure which tier fits?"
        description="Tell us what you are trying to fix and we will point you at the smallest thing that would work."
      />
    </>
  );
}

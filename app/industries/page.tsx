import { ArrowUpRight, Check, X } from 'lucide-react';
import { industries } from '@/content/industries';
import { caseStudies } from '@/content/work';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { CaseStudyCard } from '@/components/work/case-study-card';
import { CtaSection } from '@/components/shared/cta-section';

export const metadata = buildMetadata({
  title: 'Industries',
  description:
    'How Reshi AI approaches restaurants, hotels, clinics, fashion brands, event venues and educational institutions.',
  path: '/industries',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Industries', path: '/industries' },
];

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHero
        eyebrow="Industries"
        title="We have seen your problem before."
        description="Six sectors we work in repeatedly. Enough repetition that discovery starts from what we already know is usually true, and spends its time on what makes you different."
        breadcrumbs={breadcrumbs}
      />

      <div className="flex flex-col">
        {industries.map((industry, index) => {
          const Icon = industry.icon;
          const work = caseStudies.filter((study) => study.industry === industry.slug);
          const isAlternate = index % 2 === 1;

          return (
            <section
              key={industry.slug}
              id={industry.slug}
              // Offset so the anchor target is not hidden behind the fixed header.
              className={`scroll-mt-24 py-20 lg:py-24 ${
                isAlternate ? 'bg-surface-raised' : ''
              }`}
            >
              <div className="container-content grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
                <div className="flex flex-col gap-6">
                  <Reveal>
                    <span className="grid size-12 place-items-center rounded-card bg-navy-900 text-cyan-400">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                  </Reveal>

                  <Reveal delay={0.05}>
                    <div className="flex flex-col gap-3">
                      <p className="text-eyebrow text-cyan-700 uppercase">
                        {industry.name}
                      </p>
                      <h2 className="max-w-[18ch] text-h2 text-navy-900">
                        {industry.headline}
                      </h2>
                      <p className="max-w-[52ch] text-lead text-ink-muted">
                        {industry.description}
                      </p>
                    </div>
                  </Reveal>

                  {work.length > 0 ? (
                    <Reveal delay={0.12}>
                      <a
                        href={`#${industry.slug}-work`}
                        className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-navy-900"
                      >
                        See {work.length === 1 ? 'the project' : 'the projects'}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    </Reveal>
                  ) : null}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Reveal delay={0.08}>
                    <div className="flex h-full flex-col gap-4 rounded-panel border border-line bg-surface p-7">
                      <h3 className="text-eyebrow text-ink-muted uppercase">
                        What usually hurts
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {industry.painPoints.map((point) => (
                          <li key={point} className="flex gap-2.5 text-sm text-ink-muted">
                            <X
                              aria-hidden="true"
                              className="mt-0.5 size-4 shrink-0 text-red-400"
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>

                  <Reveal delay={0.14}>
                    <div className="flex h-full flex-col gap-4 rounded-panel border border-cyan-500/25 bg-cyan-500/6 p-7">
                      <h3 className="text-eyebrow text-cyan-700 uppercase">
                        What we do about it
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {industry.solutions.map((solution) => (
                          <li
                            key={solution}
                            className="flex gap-2.5 text-sm text-navy-900"
                          >
                            <Check
                              aria-hidden="true"
                              className="mt-0.5 size-4 shrink-0 text-cyan-600"
                            />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>
              </div>

              {work.length > 0 ? (
                <div
                  id={`${industry.slug}-work`}
                  className="container-content mt-14 scroll-mt-24"
                >
                  <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {work.map((study, workIndex) => (
                      <Reveal as="li" key={study.slug} delay={workIndex * 0.06}>
                        <CaseStudyCard study={study} />
                      </Reveal>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <CtaSection
        title="Not on this list?"
        description="We take on work outside these sectors when the problem is one we recognise. Tell us what you are dealing with and we will say honestly whether we are the right studio."
      />
    </>
  );
}

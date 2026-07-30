import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Quote } from 'lucide-react';
import { caseStudies, getCaseStudy } from '@/content/work';
import { getIndustry } from '@/content/industries';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, caseStudySchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { Counter } from '@/components/shared/counter';
import { CaseStudyCard } from '@/components/work/case-study-card';
import { IllustrativeNotice } from '@/components/work/illustrative-notice';
import { CtaSection } from '@/components/shared/cta-section';
import { Badge } from '@/components/ui/badge';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    return buildMetadata({
      title: 'Not found',
      description: '',
      path: '/case-studies',
      noIndex: true,
    });
  }

  return buildMetadata({
    // Client + lead discipline, rather than the full editorial headline —
    // that plus the "| Reshi AI" suffix overruns the SERP truncation point.
    title: `${study.client} — ${study.services[0]}`,
    description: study.excerpt,
    path: `/case-studies/${study.slug}`,
    type: 'article',
  });
}

const sections = [
  { key: 'challenge', label: 'The challenge' },
  { key: 'solution', label: 'What we built' },
  { key: 'result', label: 'The result' },
] as const;

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  const industry = getIndustry(study.industry);
  const related = caseStudies.filter((item) => item.slug !== study.slug).slice(0, 3);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Case studies', path: '/case-studies' },
    { name: study.client, path: `/case-studies/${study.slug}` },
  ];

  return (
    <>
      <JsonLd data={[caseStudySchema(study), breadcrumbSchema(breadcrumbs)]} />

      <PageHero
        eyebrow={study.client}
        title={study.title}
        description={study.excerpt}
        breadcrumbs={breadcrumbs}
      >
        <ul className="flex flex-wrap gap-2">
          {study.services.map((service) => (
            <li key={service}>
              <Badge variant="navy">{service}</Badge>
            </li>
          ))}
          {industry ? (
            <li>
              <Badge variant="accent">{industry.name}</Badge>
            </li>
          ) : null}
        </ul>
      </PageHero>

      {/* Full-bleed project canvas. Replace with a real screenshot when
          available — the aspect ratio is already reserved. */}
      <div className="container-content">
        <IllustrativeNotice className="mb-8" />
        <Reveal>
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-hero shadow-xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${study.palette[0]}, ${study.palette[1]})`,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-grid-dark opacity-25"
            />
            <div className="absolute inset-x-8 top-10 bottom-0 rounded-t-panel border border-white/15 bg-white/8 backdrop-blur-[2px] sm:inset-x-16 sm:top-16">
              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
                <span className="size-2.5 rounded-full bg-white/25" />
                <span className="size-2.5 rounded-full bg-white/25" />
                <span className="size-2.5 rounded-full bg-white/25" />
                <span className="ml-4 h-2.5 w-40 rounded-full bg-white/15" />
              </div>
              <div className="flex flex-col gap-4 p-8">
                <span className="h-4 w-2/3 rounded-full bg-white/25" />
                <span className="h-3 w-1/2 rounded-full bg-white/15" />
                <span className="mt-3 h-11 w-40 rounded-pill bg-white/20" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <section className="section-y">
        <div className="container-content">
          <dl className="grid gap-8 border-y border-line py-10 sm:grid-cols-2 lg:grid-cols-4">
            {study.metrics.map((metric) => (
              <Reveal key={metric.label}>
                <div className="flex flex-col gap-1.5">
                  <dt className="sr-only">{metric.label}</dt>
                  <dd className="text-h2 font-bold tracking-[-0.04em] text-navy-900">
                    <Counter value={metric.value} />
                  </dd>
                  <p aria-hidden="true" className="text-sm text-ink-muted">
                    {metric.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </dl>

          <div className="mt-16 flex flex-col gap-14">
            {sections.map((section, index) => (
              <Reveal key={section.key} delay={index * 0.05}>
                <div className="grid gap-6 lg:grid-cols-[0.5fr_1.5fr] lg:gap-16">
                  <h2 className="text-eyebrow text-cyan-700 uppercase lg:pt-2">
                    {section.label}
                  </h2>
                  <p className="max-w-[68ch] text-lead leading-relaxed text-navy-900/85">
                    {study[section.key]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {study.testimonial ? (
            <Reveal>
              <figure className="mt-16 flex flex-col gap-6 rounded-hero border border-line bg-surface-raised p-10 shadow-sm lg:p-14">
                <Quote aria-hidden="true" className="size-8 text-cyan-500/40" />
                <blockquote className="max-w-[40ch] text-h3 text-navy-900">
                  “{study.testimonial.quote}”
                </blockquote>
                <figcaption className="text-sm text-ink-muted">
                  <span className="font-semibold text-navy-900">
                    {study.testimonial.author}
                  </span>
                  {' — '}
                  {study.testimonial.role}
                </figcaption>
              </figure>
            </Reveal>
          ) : null}

          {study.liveUrl ? (
            <Reveal>
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-navy-900"
              >
                Visit the live site
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="bg-surface-raised section-y">
        <div className="container-content">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-h2 text-navy-900">More work</h2>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-navy-900"
            >
              All projects
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {related.map((item, index) => (
              <Reveal as="li" key={item.slug} delay={index * 0.06}>
                <CaseStudyCard study={item} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

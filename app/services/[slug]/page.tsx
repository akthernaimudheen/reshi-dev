import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { getService, services } from '@/content/services';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { Counter } from '@/components/shared/counter';
import { CtaSection } from '@/components/shared/cta-section';
import { SectionHeading } from '@/components/ui/section-heading';
import { MagneticLink } from '@/components/ui/magnetic-button';

type PageProps = { params: Promise<{ slug: string }> };

/** Statically renders all six service pages at build time. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service)
    return buildMetadata({
      title: 'Not found',
      description: '',
      path: '/services',
      noIndex: true,
    });

  return buildMetadata({
    title: service.title,
    description: service.summary.slice(0, 155),
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${service.slug}` },
  ];

  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[serviceSchema(service), breadcrumbSchema(breadcrumbs)]} />

      <PageHero
        eyebrow="Service"
        title={service.tagline}
        description={service.summary}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex flex-wrap items-center gap-3">
          <MagneticLink href="/contact" size="lg" variant="primary">
            Discuss this service
            <ArrowUpRight aria-hidden="true" />
          </MagneticLink>
          {service.startingPrice ? (
            <span className="text-sm text-ink-muted">
              Projects start from{' '}
              <strong className="font-semibold text-navy-900">
                {service.startingPrice}
              </strong>
            </span>
          ) : null}
        </div>
      </PageHero>

      <section className="border-y border-line bg-surface-raised py-12">
        <div className="container-content">
          <dl className="grid gap-8 sm:grid-cols-3">
            {service.outcomes.map((outcome) => (
              <Reveal key={outcome.label}>
                <div className="flex flex-col gap-1.5">
                  <dt className="sr-only">{outcome.label}</dt>
                  <dd className="text-h2 font-bold tracking-[-0.04em] text-navy-900">
                    <Counter value={outcome.metric} />
                  </dd>
                  <p aria-hidden="true" className="text-sm text-ink-muted">
                    {outcome.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y">
        <div className="container-content grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="What you get"
              title="Everything included, written down"
              description="No line items appearing halfway through the project. This is the scope."
            />
          </div>

          <ul className="flex flex-col">
            {service.deliverables.map((item, index) => (
              <Reveal as="li" key={item} delay={index * 0.05}>
                <div className="flex items-start gap-4 border-b border-line py-5 first:pt-0 last:border-0">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-cyan-500/12 text-cyan-600">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="leading-relaxed text-navy-900">{item}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface-sunken section-y">
        <div className="container-content">
          <SectionHeading
            eyebrow="Process"
            title="How this one runs"
            description="Four phases. You will know what is happening in each of them and roughly when it ends."
          />

          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-panel border border-line bg-surface-raised p-7">
                  <span className="text-sm font-bold text-cyan-600 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-h3 text-navy-900">{step.title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="container-content">
          <SectionHeading eyebrow="Also worth a look" title="Other services" />

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {others.map((other, index) => {
              const Icon = other.icon;
              return (
                <Reveal as="li" key={other.slug} delay={index * 0.06}>
                  <Link
                    href={`/services/${other.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-panel border border-line bg-surface-raised p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-cyan-500/30"
                  >
                    <Icon aria-hidden="true" className="size-5 text-cyan-600" />
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-navy-900">
                      {other.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {other.tagline}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

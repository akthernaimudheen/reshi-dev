import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/services';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { CtaSection } from '@/components/shared/cta-section';
import { Badge } from '@/components/ui/badge';

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'Custom websites, business automation, AI solutions, local SEO, branding and digital marketing — built as one system for local businesses.',
  path: '/services',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHero
        eyebrow="Services"
        title="Everything your business needs to grow online, under one roof."
        description="Six disciplines that we run against a single set of numbers. You can buy them individually — most clients start with one and add the next when the first has paid for itself."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content flex flex-col gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal key={service.slug} delay={index * 0.04}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-8 rounded-panel border border-line bg-surface-raised p-8 shadow-xs transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg lg:grid-cols-[auto_1fr_auto] lg:items-start lg:p-10"
                >
                  <span className="grid size-14 place-items-center rounded-card border border-line bg-surface transition-colors duration-500 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10">
                    <Icon
                      aria-hidden="true"
                      className="size-6 text-navy-900 transition-colors duration-500 group-hover:text-cyan-600"
                    />
                  </span>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-h3 text-navy-900">{service.title}</h2>
                      <p className="max-w-[70ch] leading-relaxed text-ink-muted">
                        {service.summary}
                      </p>
                    </div>

                    <ul className="flex flex-wrap gap-2">
                      {service.deliverables.slice(0, 4).map((item) => (
                        <li key={item}>
                          <Badge>{item}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-start gap-2 lg:items-end lg:text-right">
                    {service.startingPrice ? (
                      <>
                        <span className="text-xs tracking-wide text-ink-muted uppercase">
                          From
                        </span>
                        <span className="text-h3 whitespace-nowrap text-navy-900">
                          {service.startingPrice}
                        </span>
                      </>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-navy-900">
                      Details
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

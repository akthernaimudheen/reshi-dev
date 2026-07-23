import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/services';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/shared/reveal';
import { Scroll3D } from '@/components/shared/scroll-3d';
import { TiltCard } from '@/components/shared/tilt-card';

export function ServicesSection() {
  return (
    <section id="services" className="section-y">
      <div className="container-content">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Six disciplines, run as <span className="text-gradient">one system</span>
              </>
            }
            description="Most agencies sell these separately and hand you the integration problem. We do not — the site, the automation and the marketing are designed against the same set of numbers."
          />
          <Reveal delay={0.15}>
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] font-semibold text-navy-900"
            >
              All services
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            // Scroll3D replaces Reveal here — running both would apply two
            // entrance animations to the same card.
            return (
              <Scroll3D as="li" key={service.slug} variant="lift" intensity={12}>
                <TiltCard className="h-full">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-panel border border-line bg-surface-raised p-7 shadow-xs transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg"
                  >
                    {/* Cyan wash that blooms in from the top-right on hover. */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-24 -right-24 size-56 rounded-full bg-cyan-400/16 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <span className="relative grid size-12 place-items-center rounded-card border border-line bg-surface transition-colors duration-500 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10">
                      <Icon
                        aria-hidden="true"
                        className="size-5 text-navy-900 transition-colors duration-500 group-hover:text-cyan-600"
                      />
                    </span>

                    <div className="relative flex flex-col gap-2">
                      <h3 className="text-h3 text-navy-900">{service.title}</h3>
                      <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                        {service.tagline}
                      </p>
                    </div>

                    <span className="relative mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-navy-900">
                      Learn more
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </TiltCard>
              </Scroll3D>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

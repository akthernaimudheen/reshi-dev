import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { industries } from '@/content/industries';
import { SectionHeading } from '@/components/ui/section-heading';
import { Scroll3D } from '@/components/shared/scroll-3d';

export function IndustriesSection() {
  return (
    <section className="section-y">
      <div className="container-content">
        <SectionHeading
          eyebrow="Industries"
          title={
            <>
              We know your business <span className="text-gradient">before</span> the
              first call
            </>
          }
          description="Six industries, deeply enough that discovery starts from what we already know is true about them rather than from a blank page."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => {
            const Icon = industry.icon;

            return (
              <Scroll3D as="li" key={industry.slug} variant="swivel" intensity={9}>
                <Link
                  href={`/industries#${industry.slug}`}
                  className="group flex h-full flex-col gap-4 bg-surface-raised p-8 transition-colors duration-500 hover:bg-navy-900"
                >
                  <span className="flex items-center justify-between">
                    <Icon
                      aria-hidden="true"
                      className="size-6 text-cyan-600 transition-colors duration-500 group-hover:text-cyan-400"
                    />
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-ink-muted opacity-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-400 group-hover:opacity-100"
                    />
                  </span>

                  <h3 className="text-h3 text-navy-900 transition-colors duration-500 group-hover:text-ink-inverse">
                    {industry.name}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted transition-colors duration-500 group-hover:text-ink-inverse-muted">
                    {industry.headline}
                  </p>
                </Link>
              </Scroll3D>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

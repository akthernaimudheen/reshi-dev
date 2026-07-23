import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CaseStudyCardProps = {
  study: CaseStudy;
  /** `feature` gets a taller canvas and the metric strip. */
  variant?: 'feature' | 'compact';
  className?: string;
};

export function CaseStudyCard({
  study,
  variant = 'compact',
  className,
}: CaseStudyCardProps) {
  const isFeature = variant === 'feature';

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface-raised shadow-xs',
        'transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-quint)]',
        'hover:-translate-y-1.5 hover:border-cyan-500/30 hover:shadow-xl',
        className,
      )}
    >
      {/* Gradient canvas standing in for the project screenshot. Swap this
          block for a <Image fill> when real captures are available — the
          aspect ratios are already reserved, so nothing will shift. */}
      <div
        className={cn(
          'relative overflow-hidden',
          isFeature ? 'aspect-[16/10]' : 'aspect-[16/11]',
        )}
        style={{
          backgroundImage: `linear-gradient(135deg, ${study.palette[0]}, ${study.palette[1]})`,
        }}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-30" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent"
        />

        {/* Holographic sweep. A single specular band crosses the panel on
            hover — the cue that sells a surface as glass rather than paint.
            Pure transform, so it composites without touching layout. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-full w-2/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:translate-x-[250%] motion-reduce:hidden"
        />

        {/* A stylised browser chrome, so the card reads as a product shot
            rather than a coloured rectangle. */}
        <div className="absolute inset-x-6 top-6 bottom-0 origin-top rounded-t-card border border-white/15 bg-white/8 backdrop-blur-[2px] transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:translate-y-2 group-hover:scale-[1.03]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="ml-3 h-2 w-24 rounded-full bg-white/15" />
          </div>
          <div className="flex flex-col gap-2.5 p-5">
            <span className="h-2.5 w-2/3 rounded-full bg-white/25" />
            <span className="h-2 w-1/2 rounded-full bg-white/15" />
            <span className="mt-2 h-8 w-28 rounded-pill bg-white/20" />
          </div>
        </div>

        <span className="absolute top-5 left-5 z-10 rounded-pill bg-navy-950/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {study.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-7">
        <div className="flex flex-wrap gap-2">
          {study.services.slice(0, isFeature ? 3 : 2).map((service) => (
            <Badge key={service}>{service}</Badge>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-eyebrow text-cyan-700 uppercase">{study.client}</p>
          <h3
            className={cn(
              'text-navy-900',
              isFeature ? 'text-h3' : 'text-lg font-semibold tracking-[-0.02em]',
            )}
          >
            {study.title}
          </h3>
          <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
            {study.excerpt}
          </p>
        </div>

        {isFeature ? (
          <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
            {study.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-0.5">
                <dt className="sr-only">{metric.label}</dt>
                <dd className="text-xl font-bold tracking-[-0.03em] text-navy-900">
                  {metric.value}
                </dd>
                <p aria-hidden="true" className="text-xs text-ink-muted">
                  {metric.label}
                </p>
              </div>
            ))}
          </dl>
        ) : null}

        <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-navy-900">
          Read the case study
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

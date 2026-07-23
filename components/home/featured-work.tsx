import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { featuredCaseStudies } from '@/content/work';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/shared/reveal';
import { Scroll3D } from '@/components/shared/scroll-3d';
import { CaseStudyCard } from '@/components/work/case-study-card';

export function FeaturedWork() {
  const [lead, ...rest] = featuredCaseStudies;

  return (
    <section className="section-y">
      <div className="container-content">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Projects with <span className="text-gradient">numbers</span> attached
              </>
            }
            description="Every case study names the problem, the build and what changed afterwards. Where a result was modest, we say that too."
          />
          <Reveal delay={0.15}>
            <Link
              href="/work"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] font-semibold text-navy-900"
            >
              View all projects
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-5">
          {lead ? (
            // Gentler than the grid below it: this card is large, and a big
            // surface rotating far reads as wobble rather than depth.
            <Scroll3D variant="lift" intensity={7}>
              <CaseStudyCard study={lead} variant="feature" />
            </Scroll3D>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {rest.map((study) => (
              <Scroll3D key={study.slug} variant="lift" intensity={11}>
                <CaseStudyCard study={study} />
              </Scroll3D>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

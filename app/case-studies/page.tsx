import { caseStudies } from '@/content/work';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { CaseStudyCard } from '@/components/work/case-study-card';
import { CtaSection } from '@/components/shared/cta-section';

export const metadata = buildMetadata({
  title: 'Case Studies',
  description:
    'The problem, the build and what changed afterwards — detailed case studies from restaurants, hotels, venues, clinics and retail brands.',
  path: '/case-studies',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Case studies', path: '/case-studies' },
];

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHero
        eyebrow="Case studies"
        title="The full story, including the parts that were difficult."
        description="Each one covers what was broken, what we built, and what the numbers did after launch."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content flex flex-col gap-5">
          {caseStudies.map((study, index) => (
            <Reveal key={study.slug} delay={index * 0.05}>
              <CaseStudyCard study={study} variant="feature" />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

import { caseStudies } from '@/content/work';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { CaseStudyCard } from '@/components/work/case-study-card';
import { IllustrativeNotice } from '@/components/work/illustrative-notice';
import { CtaSection } from '@/components/shared/cta-section';

export const metadata = buildMetadata({
  title: 'Case Studies',
  description:
    'Worked scenarios showing how we diagnose and rebuild for restaurants, hotels, venues, clinics and retail brands.',
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
        title="The full thinking, start to finish."
        description="Each one covers what is typically broken in that industry, what we would build, and the numbers the approach is designed to move."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content flex flex-col gap-5">
          <IllustrativeNotice className="mb-5" />
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

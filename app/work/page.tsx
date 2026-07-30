import { caseStudies } from '@/content/work';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { WorkGrid } from '@/components/work/work-grid';
import { IllustrativeNotice } from '@/components/work/illustrative-notice';
import { CtaSection } from '@/components/shared/cta-section';

export const metadata = buildMetadata({
  title: 'Work',
  description:
    'How we approach websites, automation and AI for restaurants, hotels, clinics, venues and retail brands — illustrated industry by industry.',
  path: '/work',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Work', path: '/work' },
];

export default function WorkPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHero
        eyebrow="Portfolio"
        title="How we would approach your industry."
        description="Reshi AI is a new studio, so these are worked scenarios rather than delivered projects — the same thinking we bring to a real engagement. Filter by industry to see the one closest to your business."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content">
          <IllustrativeNotice className="mb-10" />
          <WorkGrid studies={caseStudies} />
        </div>
      </section>

      <CtaSection />
    </>
  );
}

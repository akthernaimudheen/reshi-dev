import { caseStudies } from '@/content/work';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { WorkGrid } from '@/components/work/work-grid';
import { CtaSection } from '@/components/shared/cta-section';

export const metadata = buildMetadata({
  title: 'Work',
  description:
    'Websites, automation and AI systems built for restaurants, hotels, clinics, venues and retail brands — with the results attached.',
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
        title="Work we are happy to be judged on."
        description="Every project here is live and every number is measured, not estimated. Filter by industry to see the ones closest to your business."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content">
          <WorkGrid studies={caseStudies} />
        </div>
      </section>

      <CtaSection />
    </>
  );
}

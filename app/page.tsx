import { faqs } from '@/content/site-content';
import { faqSchema, localBusinessSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { Hero } from '@/components/home/hero';
import { ServicesSection } from '@/components/home/services-section';
import { WhyReshi } from '@/components/home/why-reshi';
import { FeaturedWork } from '@/components/home/featured-work';
import { ProcessSection } from '@/components/home/process-section';
import { TechSection } from '@/components/home/tech-section';
import { IndustriesSection } from '@/components/home/industries-section';
import { FaqSection } from '@/components/home/faq-section';
import { CoreShowcase } from '@/components/home/core-showcase';
import { CtaSection } from '@/components/shared/cta-section';
import { ScanReveal } from '@/components/shared/scan-reveal';

export default function HomePage() {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), faqSchema(faqs)]} />

      <Hero />

      {/* Scan sweeps are applied to the three bands that introduce a new idea,
          not to every section. Used everywhere it would stop reading as an
          accent and start reading as a tic. */}
      <ScanReveal>
        <ServicesSection />
      </ScanReveal>

      <WhyReshi />

      <ScanReveal>
        <FeaturedWork />
      </ScanReveal>

      <ProcessSection />
      <TechSection />

      <ScanReveal>
        <IndustriesSection />
      </ScanReveal>

      <FaqSection />

      {/* Cinematic vision beat, immediately before the call to action. */}
      <CoreShowcase />

      <CtaSection />
    </>
  );
}

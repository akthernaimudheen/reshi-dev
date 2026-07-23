import Link from 'next/link';
import { faqs } from '@/content/site-content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Accordion } from '@/components/ui/accordion';
import { Reveal } from '@/components/shared/reveal';

export function FaqSection() {
  return (
    <section className="section-y">
      <div className="container-content grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Questions"
            title="The things people ask before hiring us"
            description={
              <>
                Not covered here?{' '}
                <Link
                  href="/contact"
                  className="font-medium text-navy-900 underline decoration-cyan-500 decoration-2 underline-offset-4 transition-colors hover:text-cyan-700"
                >
                  Ask us directly
                </Link>{' '}
                — a real person replies.
              </>
            }
          />
        </div>

        <Reveal delay={0.1}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </section>
  );
}

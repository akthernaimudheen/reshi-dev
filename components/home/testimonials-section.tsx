import { Quote } from 'lucide-react';
import { testimonials } from '@/content/site-content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/shared/reveal';

export function TestimonialsSection() {
  return (
    <section className="bg-surface-raised section-y">
      <div className="container-content">
        <SectionHeading
          align="center"
          eyebrow="Client words"
          title={
            <>
              What people say when the{' '}
              <span className="text-gradient">invoice is paid</span>
            </>
          }
        />

        {/* Masonry via CSS columns: the quotes vary a lot in length, and a
            rigid grid would leave large gaps under the short ones. */}
        <div className="mt-14 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.author} delay={(index % 3) * 0.08}>
              <figure className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-7 shadow-xs transition-shadow duration-500 hover:shadow-md">
                <Quote aria-hidden="true" className="size-7 shrink-0 text-cyan-500/40" />

                <blockquote className="leading-relaxed text-navy-900">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-semibold text-cyan-400"
                  >
                    {testimonial.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-navy-900">
                      {testimonial.author}
                    </span>
                    <span className="text-sm text-ink-muted">
                      {testimonial.role}, {testimonial.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

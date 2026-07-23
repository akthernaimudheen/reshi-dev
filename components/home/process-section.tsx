import { processSteps } from '@/content/site-content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/shared/reveal';

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-surface-dark section-y">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-50" />
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-40 size-[36rem] rounded-full bg-cyan-500/8 blur-[130px]"
      />

      <div className="relative container-content">
        <SectionHeading
          tone="dark"
          eyebrow="How we work"
          title={
            <>
              Eight weeks, and you see it{' '}
              <span className="text-gradient">every single one</span>
            </>
          }
          description="No three-month silence followed by a reveal. A staging URL from week one, a demo every week, and a written record of what changed."
        />

        <ol className="mt-16 flex flex-col">
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 0.06}>
              <div className="group grid gap-5 border-t border-line-dark py-8 transition-colors duration-500 hover:bg-white/[0.03] lg:grid-cols-[auto_1fr_auto] lg:items-baseline lg:gap-10 lg:py-10">
                <span className="text-h3 font-bold text-cyan-400/70 tabular-nums transition-colors duration-500 group-hover:text-cyan-400 lg:w-20">
                  {step.number}
                </span>

                <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-[1fr_1.6fr] lg:items-baseline lg:gap-10">
                  <h3 className="text-h3 text-ink-inverse">{step.title}</h3>
                  <p className="max-w-[62ch] leading-relaxed text-ink-inverse-muted">
                    {step.description}
                  </p>
                </div>

                <span className="text-sm whitespace-nowrap text-ink-inverse-muted/70">
                  {step.duration}
                </span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

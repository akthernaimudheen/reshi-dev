import { techStack } from '@/content/site-content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/shared/reveal';

export function TechSection() {
  return (
    <section className="bg-surface-sunken section-y">
      <div className="container-content grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <SectionHeading
          eyebrow="Technology"
          title={
            <>
              Boring tools, chosen <span className="text-gradient">deliberately</span>
            </>
          }
          description="We are not interested in being early to a framework. Everything here is proven, widely supported, and something another developer can pick up if you ever move on from us."
        />

        <Reveal delay={0.1}>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3">
            {techStack.map((tech) => (
              <li
                key={tech.name}
                className="group flex flex-col gap-1 bg-surface-raised px-5 py-6 transition-colors duration-300 hover:bg-navy-900"
              >
                <span className="font-semibold text-navy-900 transition-colors duration-300 group-hover:text-ink-inverse">
                  {tech.name}
                </span>
                <span className="text-xs text-ink-muted transition-colors duration-300 group-hover:text-cyan-400">
                  {tech.category}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

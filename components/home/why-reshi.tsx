import { Gauge, HandshakeIcon, LineChart, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/shared/reveal';

const reasons = [
  {
    icon: Gauge,
    title: 'Speed is a feature, not a nice-to-have',
    body: 'Every site ships with a performance budget enforced in CI. If a change pushes the homepage past its limit, the build fails. That is why our median load time is under a second and a half on real phones, not on a laptop in an office.',
  },
  {
    icon: LineChart,
    title: 'We agree the numbers before we start',
    body: 'Discovery ends with three metrics this project has to move — covers, direct bookings, qualified enquiries. Everything after that is judged against them, including the ideas we talk you out of.',
  },
  {
    icon: HandshakeIcon,
    title: 'You own everything',
    body: 'Code, design files, domains, analytics, hosting. All in your name from day one. Nothing about our setup makes leaving us difficult, which is the only honest way to earn a renewal.',
  },
  {
    icon: ShieldCheck,
    title: 'Built to be handed over',
    body: 'Documentation, a runbook and training so your team can change copy, pricing and menu items without calling anyone. We would rather be hired for the next project than retained for the last one.',
  },
];

export function WhyReshi() {
  return (
    <section className="bg-surface-raised section-y">
      <div className="container-content grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Why Reshi AI"
            title={
              <>
                The difference is what we <span className="text-gradient">refuse</span> to
                do
              </>
            }
            description="There is no shortage of people who will sell you a website. Fewer will tell you when you do not need one."
          />
        </div>

        <ul className="flex flex-col">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <Reveal as="li" key={reason.title} delay={index * 0.06}>
                <div className="flex gap-5 border-b border-line py-8 first:pt-0 last:border-0 last:pb-0">
                  <span className="grid size-11 shrink-0 place-items-center rounded-card bg-navy-900 text-cyan-400">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-h3 text-navy-900">{reason.title}</h3>
                    <p className="max-w-[56ch] leading-relaxed text-ink-muted">
                      {reason.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

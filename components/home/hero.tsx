import { ArrowUpRight, Star } from 'lucide-react';
import { siteConfig } from '@/constants/site';
import { Aurora } from '@/components/shared/aurora';
import { Spotlight } from '@/components/shared/spotlight';
import { SplitText } from '@/components/shared/split-text';
import { Reveal } from '@/components/shared/reveal';
import { Counter } from '@/components/shared/counter';
import { JarvisCore } from '@/components/home/jarvis-core';
import { MagneticLink } from '@/components/ui/magnetic-button';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <Spotlight className="isolate overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <Aurora />
      {/* No ambient particle field here — the neuron core is the hero's 3D
          element and is given clean space. The antigravity field runs on the
          other pages' mastheads instead. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]"
      />

      <div className="relative container-content">
        {/* Copy leads on desktop; the core sits beside it. On mobile the core
            drops below the buttons so the headline still owns the first
            screen — it is the LCP element and the actual message. */}
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col items-start gap-7">
            <Reveal y={12} blur={false}>
              <Badge variant="accent">
                <Star aria-hidden="true" className="size-3 fill-current" />
                Trusted by 40+ businesses across 6 industries
              </Badge>
            </Reveal>

            {/* Server-rendered text in a self-hosted font, so it paints on the
                first frame — the entrance animation only transforms what is
                already there. */}
            <h1 className="text-display text-navy-900">
              <SplitText text="Websites and systems that turn" />{' '}
              <SplitText text="local businesses" className="text-gradient" delay={0.18} />{' '}
              <SplitText text="into growing brands." delay={0.32} />
            </h1>

            <Reveal delay={0.5} y={16}>
              <p className="max-w-xl text-lead text-ink-muted">
                We design and build the digital layer of your business — the site, the
                automation, the AI that answers at midnight — and we measure it in
                bookings, not impressions.
              </p>
            </Reveal>

            <Reveal delay={0.6} y={16}>
              <div className="flex flex-wrap items-center gap-3">
                <MagneticLink href="/contact" size="lg" variant="primary">
                  Discuss your project
                  <ArrowUpRight aria-hidden="true" />
                </MagneticLink>
                <ButtonLink href="/work" size="lg" variant="outline">
                  See our work
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.35} y={28}>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <JarvisCore />

              <p className="mt-5 max-w-sm text-sm text-ink-muted lg:mx-auto lg:text-center">
                <span className="font-semibold text-navy-900">The Reshi core.</span> The
                system we are building toward — one layer that learns your business and
                runs it. Today it powers the assistants and automations we ship.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.75}>
          <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-h2 font-bold tracking-[-0.04em] text-navy-900">
                  <Counter value={stat.value} />
                </dd>
                <p aria-hidden="true" className="text-sm text-ink-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Spotlight>
  );
}

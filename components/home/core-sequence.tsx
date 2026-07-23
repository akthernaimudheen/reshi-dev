'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { buildCoreGeometry, buildMorphTargets, stageAt } from '@/lib/core-geometry';
import { CoreRenderer, PALETTES } from '@/lib/core-renderer';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useMotionCapability } from '@/hooks/use-device-tier';
import { Eyebrow } from '@/components/ui/eyebrow';
import { cn } from '@/lib/utils';

/**
 * The core, reconfiguring itself as the reader scrolls.
 *
 * A tall section with a sticky viewport-height stage: scrolling through it
 * drives the point cloud between four shapes, each one standing for a stage of
 * what the system does. The scroll position IS the timeline — nothing plays on
 * its own, so the reader is always in control of the pace.
 *
 * The whole scene is one canvas and one geometry. The morph is a per-point
 * interpolation inside the existing render loop, so this section costs a few
 * hundred bytes of code rather than a new rendering stack.
 */

const STAGES = [
  {
    id: 'sphere',
    label: 'One system',
    copy: 'Every part of your digital operation modelled as a single connected thing, rather than six tools that do not talk to each other.',
  },
  {
    id: 'torus',
    label: 'Reading signals',
    copy: 'Searches, reviews, enquiries, booking patterns. The system watches where demand actually comes from instead of guessing.',
  },
  {
    id: 'cone',
    label: 'Qualifying demand',
    copy: 'Every enquiry scored and routed, so your team spends its hours on the ones that convert and none on the ones that never will.',
  },
  {
    id: 'cube',
    label: 'Structured operations',
    copy: 'Bookings, confirmations, follow-ups and reporting — running the same way whether or not anyone is watching.',
  },
] as const;

export function CoreSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const reducedMotionPreference = usePrefersReducedMotion();
  const { allowsContinuous } = useMotionCapability();
  const still = reducedMotionPreference || !allowsContinuous;

  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;
    const store: { renderer: CoreRenderer | null } = { renderer: null };

    const paint = (progress: number) => {
      const renderer = store.renderer;
      if (!renderer) return;

      const { from, to, blend } = stageAt(progress, STAGES.length);

      renderer.render(ctx, width, height, {
        yaw: progress * 4.2,
        pitch: 0.22 + Math.sin(progress * Math.PI) * 0.16,
        engagement: 0.35,
        morphFrom: from,
        morphTo: to,
        morphT: blend,
      });
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round(Math.min(3400, Math.max(900, width * 4.5)));
      const geometry = buildCoreGeometry(target);
      store.renderer = new CoreRenderer(
        geometry,
        PALETTES.cyan,
        buildMorphTargets(geometry),
      );

      // Repaint immediately — assigning canvas.width wipes the surface.
      paint(scrollYProgress.get());
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);

    if (!still) {
      const loop = () => {
        if (disposed) return;
        paint(scrollYProgress.get());
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [still, scrollYProgress]);

  // Drive the caption from the same progress value, but as discrete state —
  // text crossfading continuously would be unreadable.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setActiveStage(stageAt(value, STAGES.length).nearest);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const stage = STAGES[activeStage]!;

  return (
    <section
      ref={sectionRef}
      // Tall enough to give each transition room to breathe — shorter than
      // ~250vh and the shapes flick past before they resolve. Mobile gets a
      // shorter run so the pinned stretch does not overstay; leaving it at
      // auto height would give the morph no scroll range at all and freeze
      // the core on whichever shape the progress happened to land on.
      className="relative h-[250vh] bg-surface-dark lg:h-[360vh]"
      aria-label="How the Reshi core works"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-30" />

      <div className="sticky top-0 h-screen">
        <div className="container-content flex h-full flex-col justify-center gap-5 overflow-hidden py-10 lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:py-0">
          <div className="relative z-10 flex flex-col gap-4 lg:gap-6">
            <Eyebrow tone="dark">The core</Eyebrow>

            <h2 className="max-w-[16ch] text-h2 text-ink-inverse">
              One system that keeps <span className="text-gradient">reconfiguring</span>{' '}
              around your business
            </h2>

            {/* Reserved height stops the copy swap from nudging the layout as
                the stage text changes. */}
            <div className="min-h-[7rem] max-w-md lg:min-h-[9.5rem]">
              <p className="text-eyebrow text-cyan-300 uppercase">{stage.label}</p>
              <p className="mt-3 leading-relaxed text-ink-inverse-muted">{stage.copy}</p>
            </div>

            <ol className="flex gap-2" aria-label="Sequence progress">
              {STAGES.map((item, index) => (
                <li key={item.id}>
                  <span
                    className={cn(
                      'block h-0.5 w-12 rounded-full transition-colors duration-500',
                      index <= activeStage ? 'bg-cyan-400' : 'bg-white/15',
                    )}
                  />
                  <span className="sr-only">
                    {item.label}
                    {index === activeStage ? ' (current)' : ''}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div
            ref={stageRef}
            // Capped by viewport height as well as width: inside a 100vh
            // sticky stage the copy, the core and the progress rail all have
            // to fit, and a square sized purely on width overflows a phone.
            className="relative mx-auto aspect-square w-full max-w-[min(20rem,42vh)] sm:max-w-[min(26rem,46vh)] lg:max-w-[min(34rem,70vh)]"
            role="img"
            aria-label={`Visualisation of the Reshi core in its ${stage.label.toLowerCase()} state`}
          >
            <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

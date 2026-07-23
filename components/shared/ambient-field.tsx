'use client';

import { useEffect, useRef } from 'react';
import {
  AMBIENT_PALETTES,
  AmbientRenderer,
  type AmbientPalette,
} from '@/lib/ambient-field';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useMotionCapability } from '@/hooks/use-device-tier';
import { cn } from '@/lib/utils';

type AmbientFieldProps = {
  className?: string;
  /** `light` = dark points on a pale hero; `dark` = light points on a dark one. */
  tone?: keyof typeof AMBIENT_PALETTES;
};

/**
 * The antigravity field, mounted absolutely inside a page masthead.
 *
 * It is a BACKGROUND, so it is built to disappear the moment the device cannot
 * spare the frames:
 *   - Full tier animates; anything lower paints one static frame.
 *   - `prefers-reduced-motion` paints one static frame and stops.
 *   - The loop halts when the masthead scrolls out of view (this is a hero
 *     element, so a few pixels of scroll takes it off-screen).
 *   - Device pixel ratio is capped at 2.
 *   - The whole thing is `aria-hidden` and pointer-transparent; the copy in
 *     front of it carries every bit of meaning.
 *
 * It never gates content: the canvas fades in over whatever is painted behind
 * it, and if the script never runs the page is simply the page.
 */
export function AmbientField({ className, tone = 'light' }: AmbientFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reducedMotionPreference = usePrefersReducedMotion();
  const { allowsContinuous, allowsScrollMotion } = useMotionCapability();

  // Pointer influence lives in a ref so it never triggers a React render.
  const input = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    // The field is pure decoration — if there is no motion budget at all,
    // skip it entirely rather than paint a static dot cloud nobody asked for.
    if (!allowsScrollMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const animate = allowsContinuous && !reducedMotionPreference;
    const palette: AmbientPalette = AMBIENT_PALETTES[tone];

    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;
    let onScreen = true;
    let opacity = 0;
    const start = performance.now();
    const store: { renderer: AmbientRenderer | null } = { renderer: null };

    const readScroll = () => {
      const rect = host.getBoundingClientRect();
      // 0 at the top of the masthead, 1 once it has scrolled a screen up.
      return Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
    };

    const paint = (now: number) => {
      const renderer = store.renderer;
      if (!renderer) return;
      const time = (now - start) / 1000;
      // Ease the master opacity up on first appearance.
      opacity += (1 - opacity) * 0.04;

      renderer.render(ctx, width, height, {
        time: animate ? time : 6,
        pointerX: input.current.x,
        pointerY: input.current.y,
        scroll: readScroll(),
        opacity: animate ? opacity : 1,
      });
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale count with area, so a tall desktop masthead is denser than a
      // short phone one, but never expensive.
      const area = width * height;
      const count = Math.round(Math.min(220, Math.max(70, area / 7000)));
      store.renderer = new AmbientRenderer(count, palette);

      // Repaint at once — assigning canvas.width wipes the surface.
      paint(performance.now());
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? true;
        if (onScreen && animate && !disposed && frame === 0) {
          frame = requestAnimationFrame(loop);
        }
      },
      { rootMargin: '0px' },
    );
    visibility.observe(host);

    function loop(now: number) {
      if (disposed) return;
      if (!onScreen) {
        frame = 0; // parked; the observer restarts it on re-entry
        return;
      }
      paint(now);
      frame = requestAnimationFrame(loop);
    }

    if (animate) {
      frame = requestAnimationFrame(loop);
    }
    // Static tiers already painted one frame inside resize().

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      input.current.x = (event.clientX - rect.left) / rect.width - 0.5;
      input.current.y = (event.clientY - rect.top) / rect.height - 0.5;
    };
    if (animate) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [allowsContinuous, allowsScrollMotion, reducedMotionPreference, tone]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

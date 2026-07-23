'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * Momentum scrolling.
 *
 * Deliberately subtle — `lerp` at 0.12 smooths the wheel without introducing
 * the laggy, detached feeling that kills long-form reading. Touch devices keep
 * their native scrolling entirely: nothing we can implement beats the
 * platform's own, and hijacking it breaks pull-to-refresh.
 */
export function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      smoothWheel: true,
      // Native scrolling on touch — see note above.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors need to be routed through Lenis, or the browser's own
    // jump fights the smoothed scroll position.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  // App Router keeps the scroll position mid-transition in some cases; force
  // the top on every navigation so pages always start where they should.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

'use client';

import { useEffect, useState } from 'react';

type ScrollState = {
  /** True once the page has scrolled past `threshold`. Drives the nav shrink. */
  scrolled: boolean;
  /** True when scrolling down and past the header — hides the nav. */
  hidden: boolean;
};

/**
 * Header scroll behaviour, computed in a rAF-throttled listener so we never do
 * layout work more than once per frame.
 */
export function useScrollState(threshold = 16, hideAfter = 240): ScrollState {
  const [state, setState] = useState<ScrollState>({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      // Ignore sub-pixel jitter and the elastic overscroll region.
      const delta = y - lastY;

      setState((previous) => {
        const scrolled = y > threshold;
        const hidden =
          y > hideAfter && delta > 4 ? true : delta < -4 ? false : previous.hidden;

        if (scrolled === previous.scrolled && hidden === previous.hidden) {
          return previous;
        }
        return { scrolled, hidden };
      });

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, hideAfter]);

  return state;
}

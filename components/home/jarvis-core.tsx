'use client';

import { useEffect, useRef, useState } from 'react';
import { buildNeuronCore, NeuronRenderer, NEURON_PALETTE } from '@/lib/neuron-core';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useMotionCapability } from '@/hooks/use-device-tier';
import { cn } from '@/lib/utils';

/**
 * The Reshi core — a brain-like neuron sphere. Dendrites branch from a central
 * soma out to surface nodes, and signal pulses fire along them: the "learning
 * and expertise" made visible.
 *
 * FLOATS ON LIGHT, NO BOX. Rendered in navy ink with cyan nodes and normal
 * alpha compositing (see `lib/neuron-core` for why not the glowing additive
 * approach), so it sits directly on the pale hero with no dark panel behind
 * it. The canvas is transparent.
 *
 * COST CONTROL:
 *   - Node count scales with rendered area.
 *   - Device pixel ratio capped at 2.
 *   - One frame painted synchronously on mount, so it is never a blank gap
 *     while waiting for the first requestAnimationFrame.
 *   - The loop stops when the core scrolls out of view.
 *   - Below the `full` tier, or under prefers-reduced-motion, it paints a
 *     single static frame and does not animate.
 */
export function JarvisCore({ className }: { className?: string }) {
  const reducedMotionPreference = usePrefersReducedMotion();
  const { allowsContinuous } = useMotionCapability();

  // The heaviest thing on the page freezes first when the device cannot keep
  // up. It still renders one static frame — it simply stops animating.
  const still = reducedMotionPreference || !allowsContinuous;

  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // Pointer influence lives in a ref, read every frame, never a React render.
  const input = useRef({ x: 0, y: 0, engagement: 0, target: 0 });

  // Pause while scrolled away — the core sits in the hero of a long page.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry?.isIntersecting ?? true),
      { rootMargin: '120px' },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;
    const store: { renderer: NeuronRenderer | null } = { renderer: null };
    const start = performance.now();

    const paint = (now: number) => {
      const renderer = store.renderer;
      if (!renderer) return;
      const state = input.current;
      state.engagement += (state.target - state.engagement) * 0.06;
      renderer.render(ctx, width, height, {
        time: still ? 4 : (now - start) / 1000,
        pointerX: state.x,
        pointerY: state.y,
        engagement: state.engagement,
        opacity: 1,
      });
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Surface node count scales with width; hubs and lines derive from it.
      const target = Math.round(Math.min(320, Math.max(120, width * 0.6)));
      store.renderer = new NeuronRenderer(buildNeuronCore(target), NEURON_PALETTE);

      // Repaint at once — assigning canvas.width wipes the surface.
      paint(performance.now());
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    if (!still && onScreen) {
      const loop = (now: number) => {
        if (disposed) return;
        paint(now);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [still, onScreen]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (still || event.pointerType !== 'mouse' || !hostRef.current) return;
    const rect = hostRef.current.getBoundingClientRect();
    input.current.x = (event.clientX - rect.left) / rect.width - 0.5;
    input.current.y = (event.clientY - rect.top) / rect.height - 0.5;
    input.current.target = 1;
  };

  const handlePointerLeave = () => {
    input.current.x = 0;
    input.current.y = 0;
    input.current.target = 0;
  };

  return (
    <div
      ref={hostRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('relative aspect-square w-full', className)}
      role="img"
      aria-label="Animated neuron sphere representing the Reshi AI core learning"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />
    </div>
  );
}

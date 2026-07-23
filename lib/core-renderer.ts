import type { CoreGeometry, MorphTarget } from './core-geometry';

/**
 * Canvas renderer for the Reshi core.
 *
 * WHY CANVAS AND NOT WEBGL. This draws a few thousand additively-blended line
 * segments. Three.js would cost ~150kb gzipped to do projection maths that is
 * forty lines here, and this page's whole JS budget is 167kb. WebGL would earn
 * its weight at 100k+ primitives; at this scale Canvas 2D wins outright.
 *
 * WHY NOT SVG. Same drawing as DOM nodes would be several thousand elements
 * re-laid-out every frame. Not survivable.
 *
 * PER-FRAME COST. One pass projects every node into preallocated arrays. Edges
 * are then bucketed by depth into a fixed number of batches, so the whole
 * sphere is drawn in ~8 `stroke()` calls instead of thousands. Nothing is
 * allocated inside the loop.
 */

export type Palette = {
  deep: string;
  mid: string;
  hot: string;
  core: string;
};

export const PALETTES: Record<'gold' | 'cyan', Palette> = {
  // Matches the Iron Man reference.
  gold: { deep: '255,107,0', mid: '255,165,31', hot: '255,214,128', core: '255,247,226' },
  // Brand-native alternative.
  cyan: { deep: '13,148,153', mid: '18,199,199', hot: '54,216,255', core: '234,254,255' },
};

/** Depth batches. More is smoother shading; each costs one stroke call. */
const DEPTH_BANDS = 6;

export type RenderState = {
  /** Continuous spin, in radians. */
  yaw: number;
  /** Tilt, in radians. */
  pitch: number;
  /** 0…1, ramps up while the pointer is over the core. */
  engagement: number;
  /** Index of the shape being morphed from. Ignored without morph targets. */
  morphFrom?: number;
  /** Index of the shape being morphed to. */
  morphTo?: number;
  /** 0…1 blend between the two. */
  morphT?: number;
};

export class CoreRenderer {
  private readonly geometry: CoreGeometry;
  private palette: Palette;

  // Projection scratch space, sized once.
  private readonly sx: Float32Array;
  private readonly sy: Float32Array;
  private readonly depth: Float32Array;

  // Current model-space positions after morph blending. The corona spikes
  // project outward from these; reading the geometry's original positions
  // instead would leave the spikes behind whenever the shape changed.
  private readonly mx: Float32Array;
  private readonly my: Float32Array;
  private readonly mz: Float32Array;

  // Batched segment coordinates, one flat buffer per depth band.
  private readonly bands: Float32Array[];
  private readonly bandCounts: Uint32Array;

  private readonly targets: MorphTarget[] | null;

  constructor(geometry: CoreGeometry, palette: Palette, targets?: MorphTarget[]) {
    this.geometry = geometry;
    this.palette = palette;
    this.targets = targets && targets.length > 0 ? targets : null;

    this.sx = new Float32Array(geometry.count);
    this.sy = new Float32Array(geometry.count);
    this.depth = new Float32Array(geometry.count);
    this.mx = new Float32Array(geometry.count);
    this.my = new Float32Array(geometry.count);
    this.mz = new Float32Array(geometry.count);

    // Worst case every edge and spike lands in one band.
    const capacity = (geometry.edgeCount + geometry.spikeCount) * 4;
    this.bands = Array.from({ length: DEPTH_BANDS }, () => new Float32Array(capacity));
    this.bandCounts = new Uint32Array(DEPTH_BANDS);
  }

  setPalette(palette: Palette) {
    this.palette = palette;
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    state: RenderState,
  ) {
    const { geometry, sx, sy, depth, mx, my, mz, bands, bandCounts } = this;
    const { palette } = this;

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.345;
    // Focal length in sphere radii. Lower is a wider, more dramatic lens.
    const focal = 3.1;

    const cosY = Math.cos(state.yaw);
    const sinY = Math.sin(state.yaw);
    const cosP = Math.cos(state.pitch);
    const sinP = Math.sin(state.pitch);

    ctx.clearRect(0, 0, width, height);
    // Additive blending is what makes overlapping filaments bloom into the
    // hot core instead of muddying into flat colour.
    ctx.globalCompositeOperation = 'lighter';

    // Resolve the two shapes being blended. Falls back to the geometry's own
    // positions when the renderer was built without morph targets.
    const targets = this.targets;
    const from = targets?.[state.morphFrom ?? 0] ?? null;
    const to = targets?.[state.morphTo ?? state.morphFrom ?? 0] ?? null;
    const blend = state.morphT ?? 0;

    // --- Project every node once ---------------------------------------
    for (let i = 0; i < geometry.count; i += 1) {
      let x: number;
      let y: number;
      let z: number;

      if (from && to) {
        // Linear interpolation between shapes. Points travel in straight
        // lines rather than along arcs, which reads as a controlled machine
        // reconfiguring itself — an arc would look organic, and this object
        // is meant to feel engineered.
        const ax = from.x[i]!;
        const ay = from.y[i]!;
        const az = from.z[i]!;
        x = ax + (to.x[i]! - ax) * blend;
        y = ay + (to.y[i]! - ay) * blend;
        z = az + (to.z[i]! - az) * blend;
      } else {
        x = geometry.x[i]!;
        y = geometry.y[i]!;
        z = geometry.z[i]!;
      }

      mx[i] = x;
      my[i] = y;
      mz[i] = z;

      // Yaw about Y, then pitch about X.
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;

      // z2 = +1 nearest the viewer.
      const scale = focal / (focal - z2);

      sx[i] = cx + x1 * radius * scale;
      sy[i] = cy + y2 * radius * scale;
      depth[i] = z2;
    }

    bandCounts.fill(0);

    // --- Bucket filaments by depth --------------------------------------
    for (let e = 0; e < geometry.edgeCount; e += 1) {
      const a = geometry.edgeA[e]!;
      const b = geometry.edgeB[e]!;

      // Midpoint depth, remapped from -1…1 to 0…1.
      const d = (depth[a]! + depth[b]! + 2) * 0.25;
      let band = (d * DEPTH_BANDS) | 0;
      if (band >= DEPTH_BANDS) band = DEPTH_BANDS - 1;

      const buffer = bands[band]!;
      const offset = bandCounts[band]!;
      buffer[offset] = sx[a]!;
      buffer[offset + 1] = sy[a]!;
      buffer[offset + 2] = sx[b]!;
      buffer[offset + 3] = sy[b]!;
      bandCounts[band] = offset + 4;
    }

    // --- Corona spikes, into the same buckets ---------------------------
    for (let s = 0; s < geometry.spikeCount; s += 1) {
      const node = geometry.spikeNode[s]!;
      const length = geometry.spikeLen[s]! * (0.75 + state.engagement * 0.55);

      // Morphed positions, so the corona follows the shape as it changes.
      const x = mx[node]!;
      const y = my[node]!;
      const z = mz[node]!;

      const outer = 1 + length;
      const ox = x * outer;
      const oy = y * outer;
      const oz = z * outer;

      const x1 = ox * cosY - oz * sinY;
      const z1 = ox * sinY + oz * cosY;
      const y2 = oy * cosP - z1 * sinP;
      const z2 = oy * sinP + z1 * cosP;
      const scale = focal / (focal - z2);

      const d = (depth[node]! + z2 + 2) * 0.25;
      let band = (d * DEPTH_BANDS) | 0;
      if (band >= DEPTH_BANDS) band = DEPTH_BANDS - 1;

      const buffer = bands[band]!;
      const offset = bandCounts[band]!;
      buffer[offset] = sx[node]!;
      buffer[offset + 1] = sy[node]!;
      buffer[offset + 2] = cx + x1 * radius * scale;
      buffer[offset + 3] = cy + y2 * radius * scale;
      bandCounts[band] = offset + 4;
    }

    // --- Stroke each band once ------------------------------------------
    for (let band = 0; band < DEPTH_BANDS; band += 1) {
      const used = bandCounts[band]!;
      if (used === 0) continue;

      const t = band / (DEPTH_BANDS - 1);
      // Back of the sphere is dim and deep-orange; the front burns hot.
      const colour = t < 0.45 ? palette.deep : t < 0.8 ? palette.mid : palette.hot;
      // Rear bands stay legible (0.16) so the sphere reads as volume rather
      // than a lit front face floating in nothing.
      const alpha = (0.16 + t * t * 0.62) * (0.85 + state.engagement * 0.3);

      ctx.strokeStyle = `rgba(${colour},${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.5 + t * 0.7;

      const buffer = bands[band]!;
      ctx.beginPath();
      for (let i = 0; i < used; i += 4) {
        ctx.moveTo(buffer[i]!, buffer[i + 1]!);
        ctx.lineTo(buffer[i + 2]!, buffer[i + 3]!);
      }
      ctx.stroke();
    }

    // --- Orbital arcs ----------------------------------------------------
    for (let r = 0; r < geometry.rings.length; r += 1) {
      const ring = geometry.rings[r]!;
      const segments = ring.x.length;

      // Faint: the arcs are an accent. Earlier they were bright enough to
      // dominate the filament shell, which read as three ellipses over a
      // dim ball rather than as a dense sphere.
      ctx.strokeStyle = `rgba(${palette.hot},${(0.09 + state.engagement * 0.07).toFixed(3)})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();

      for (let s = 0; s <= segments; s += 1) {
        const index = s % segments;
        const x = ring.x[index]!;
        const y = ring.y[index]!;
        const z = ring.z[index]!;

        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosP - z1 * sinP;
        const z2 = y * sinP + z1 * cosP;
        const scale = focal / (focal - z2);

        const projX = cx + x1 * radius * scale;
        const projY = cy + y2 * radius * scale;

        if (s === 0) ctx.moveTo(projX, projY);
        else ctx.lineTo(projX, projY);
      }
      ctx.stroke();
    }

    // --- Node lights ------------------------------------------------------
    // Only the brightest nodes on the near hemisphere, so the front face
    // sparkles without the whole shell turning to noise.
    ctx.fillStyle = `rgba(${palette.core},0.85)`;
    for (let i = 0; i < geometry.count; i += 1) {
      if (geometry.bright[i]! < 0.68 || depth[i]! < 0.15) continue;
      const size = depth[i]! > 0.7 ? 1.9 : 1.2;
      ctx.fillRect(sx[i]! - size / 2, sy[i]! - size / 2, size, size);
    }

    // --- Core bloom -------------------------------------------------------
    // Tight. A wide soft bloom washes the middle of the sphere and erases the
    // filament detail that is the whole point of the visual.
    const bloomRadius = radius * 0.55;
    const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomRadius);
    bloom.addColorStop(0, `rgba(${palette.core},${0.42 + state.engagement * 0.18})`);
    bloom.addColorStop(0.18, `rgba(${palette.hot},0.2)`);
    bloom.addColorStop(0.5, `rgba(${palette.mid},0.07)`);
    bloom.addColorStop(1, `rgba(${palette.deep},0)`);
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, bloomRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  }
}

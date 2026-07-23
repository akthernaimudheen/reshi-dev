/**
 * Ambient antigravity field — a weightless 3D particle cloud for page
 * mastheads. Sits behind the hero copy on every page.
 *
 * Same approach as the core (`lib/core-renderer`): a point cloud projected by
 * hand in Canvas 2D, no WebGL, no dependency. This one is far lighter — a
 * couple of hundred drifting points rather than thousands of filaments —
 * because it runs on EVERY page and behind readable text, so it has to be
 * nearly free and never assertive.
 *
 * "Antigravity" is a specific motion, not just movement: each point bobs on
 * its own slow, bounded loop with no shared direction and no downward pull, so
 * the cloud reads as buoyant rather than falling or flying. The whole field
 * turns very slowly on its vertical axis, and drifts with the pointer and the
 * scroll, which is what gives it depth.
 */

export type AmbientPalette = {
  /** Far, faint points. `r,g,b` triplet. */
  deep: string;
  /** Near, brighter points and the reactor-cyan accents. */
  hot: string;
  /** Connective lines between neighbours. */
  line: string;
};

export const AMBIENT_PALETTES = {
  // Light theme: dark navy points on a pale surface, cyan on the near ones.
  light: { deep: '8,26,58', hot: '18,199,199', line: '8,26,58' },
  // Dark theme / dark hero grounds.
  dark: { deep: '148,168,192', hot: '54,216,255', line: '120,180,210' },
} as const satisfies Record<string, AmbientPalette>;

/** Deterministic pseudo-random in 0…1 — identical on server and client. */
function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

type Field = {
  count: number;
  /** Base positions in a [-1,1] box. */
  bx: Float32Array;
  by: Float32Array;
  bz: Float32Array;
  /** Per-axis bob amplitude, frequency and phase. */
  amp: Float32Array;
  freq: Float32Array;
  phase: Float32Array;
  /** 0…1 — drives size and brightness; a few points are "bright". */
  weight: Float32Array;
  /** Neighbour pairs, flat, for the faint connective lines. */
  edgeA: Uint16Array;
  edgeB: Uint16Array;
  edgeCount: number;
};

function buildField(count: number): Field {
  const bx = new Float32Array(count);
  const by = new Float32Array(count);
  const bz = new Float32Array(count);
  const amp = new Float32Array(count * 3);
  const freq = new Float32Array(count * 3);
  const phase = new Float32Array(count * 3);
  const weight = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    // Spread through a box, biased so the centre (behind the headline) stays
    // a little sparser than the edges.
    bx[i] = (hash(i * 1.1) - 0.5) * 2;
    by[i] = (hash(i * 2.3) - 0.5) * 2;
    bz[i] = (hash(i * 3.7) - 0.5) * 2;

    for (let a = 0; a < 3; a += 1) {
      const k = i * 3 + a;
      // Small amplitude and low frequency: buoyant, not busy.
      amp[k] = 0.03 + hash(i * 5.1 + a * 13.3) * 0.05;
      freq[k] = 0.08 + hash(i * 7.9 + a * 4.7) * 0.14;
      phase[k] = hash(i * 9.3 + a * 2.1) * Math.PI * 2;
    }

    // Roughly a fifth of the points read as bright cyan sparks.
    weight[i] = hash(i * 11.7) > 0.8 ? 0.7 + hash(i * 15.1) * 0.3 : hash(i * 6.3) * 0.4;
  }

  // Connect each point to its nearest few neighbours. count is small (a few
  // hundred), so the O(n²) pass runs once at build and never per frame.
  const edgeA: number[] = [];
  const edgeB: number[] = [];
  const maxDistSq = 0.42 * 0.42;

  for (let i = 0; i < count; i += 1) {
    let linked = 0;
    for (let j = i + 1; j < count && linked < 2; j += 1) {
      const dx = bx[i]! - bx[j]!;
      const dy = by[i]! - by[j]!;
      const dz = bz[i]! - bz[j]!;
      if (dx * dx + dy * dy + dz * dz <= maxDistSq) {
        edgeA.push(i);
        edgeB.push(j);
        linked += 1;
      }
    }
  }

  return {
    count,
    bx,
    by,
    bz,
    amp,
    freq,
    phase,
    weight,
    edgeA: Uint16Array.from(edgeA),
    edgeB: Uint16Array.from(edgeB),
    edgeCount: edgeA.length,
  };
}

export type AmbientState = {
  /** Seconds since start. */
  time: number;
  /** -0.5…0.5 pointer position, or 0 when idle. */
  pointerX: number;
  pointerY: number;
  /** 0…1 scroll progress through the hero, lifts the field as you descend. */
  scroll: number;
  /** Master opacity, ramped on entry so the field fades in. */
  opacity: number;
};

export class AmbientRenderer {
  private readonly field: Field;
  private palette: AmbientPalette;

  private readonly sx: Float32Array;
  private readonly sy: Float32Array;
  private readonly sz: Float32Array;
  private readonly sr: Float32Array;

  constructor(count: number, palette: AmbientPalette) {
    this.field = buildField(count);
    this.palette = palette;
    this.sx = new Float32Array(this.field.count);
    this.sy = new Float32Array(this.field.count);
    this.sz = new Float32Array(this.field.count);
    this.sr = new Float32Array(this.field.count);
  }

  setPalette(palette: AmbientPalette) {
    this.palette = palette;
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    state: AmbientState,
  ) {
    const { field, sx, sy, sz, sr, palette } = this;

    ctx.clearRect(0, 0, width, height);
    if (state.opacity <= 0.001) return;

    const cx = width / 2;
    const cy = height / 2;
    // The cloud is wider than tall, so it fills a masthead rather than a square.
    const scaleX = width * 0.62;
    const scaleY = height * 0.62;
    const focal = 3.4;

    // Very slow turn, nudged by the pointer for parallax.
    const yaw = state.time * 0.03 + state.pointerX * 0.5;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const pitch = state.pointerY * 0.3;
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    // Scroll lifts the whole field upward — the antigravity cue. Canvas Y
    // grows downward, so a rise is a NEGATIVE model-space offset.
    const lift = -state.scroll * 0.6;

    for (let i = 0; i < field.count; i += 1) {
      const k = i * 3;
      const bob = (axis: number, base: number) =>
        base +
        field.amp[k + axis]! *
          Math.sin(
            state.time * field.freq[k + axis]! * Math.PI * 2 + field.phase[k + axis]!,
          );

      const px = bob(0, field.bx[i]!);
      const py = bob(1, field.by[i]!) + lift;
      const pz = bob(2, field.bz[i]!);

      // Yaw about Y, then a little pitch about X.
      const x1 = px * cosY - pz * sinY;
      const z1 = px * sinY + pz * cosY;
      const y2 = py * cosP - z1 * sinP;
      const z2 = py * sinP + z1 * cosP;

      const perspective = focal / (focal - z2);
      sx[i] = cx + x1 * scaleX * perspective * 0.5;
      sy[i] = cy + y2 * scaleY * perspective * 0.5;
      sz[i] = z2;
      sr[i] = perspective;
    }

    // Connective lines first, so points sit on top of them.
    ctx.lineWidth = 1;
    for (let e = 0; e < field.edgeCount; e += 1) {
      const a = field.edgeA[e]!;
      const b = field.edgeB[e]!;
      // Fade with the deeper endpoint, so lines recede into the distance.
      const depth = (Math.min(sz[a]!, sz[b]!) + 1) * 0.5;
      const alpha = depth * 0.14 * state.opacity;
      if (alpha < 0.01) continue;
      ctx.strokeStyle = `rgba(${palette.line},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(sx[a]!, sy[a]!);
      ctx.lineTo(sx[b]!, sy[b]!);
      ctx.stroke();
    }

    for (let i = 0; i < field.count; i += 1) {
      const depth = (sz[i]! + 1) * 0.5; // 0 far … 1 near
      const w = field.weight[i]!;
      const radius = (0.6 + depth * 1.8 + w * 1.4) * sr[i]!;
      const bright = w > 0.65;
      const alpha = (0.12 + depth * 0.5) * (bright ? 1 : 0.7) * state.opacity;

      ctx.fillStyle = `rgba(${bright ? palette.hot : palette.deep},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(sx[i]!, sy[i]!, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

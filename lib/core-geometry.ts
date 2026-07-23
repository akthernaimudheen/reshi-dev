/**
 * Geometry for the Reshi core — a volumetric sphere of glowing filaments.
 *
 * Built once and reused for every frame. The renderer only rotates and
 * projects these unit-sphere coordinates, so per-frame work is arithmetic on
 * flat typed arrays with no allocation.
 */

/** Golden angle. Successive points step this far around the sphere. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Neighbour offsets on a Fibonacci lattice are Fibonacci numbers — a point's
 * spatial neighbours sit at index ±13, ±21, ±34, ±55 rather than ±1. Joining
 * consecutive indices instead would draw long chords straight through the
 * sphere. Several offsets are used together so the mesh reads as dense
 * interlocking spirals rather than a single thread.
 *
 * CRITICAL: these offsets are only meaningful on the *complete* lattice.
 * Removing points before wiring the mesh breaks the index-to-neighbour
 * relationship and the sphere falls apart into a handful of stray segments.
 * Sparse regions are therefore carved by dropping edges, never points.
 */
const NEIGHBOUR_OFFSETS = [13, 21, 34, 55] as const;

/** One complete set of positions the point cloud can occupy. */
export type MorphTarget = {
  id: string;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
};

export type CoreGeometry = {
  count: number;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  /** 0…1 density field. Drives alpha and which edges survive. */
  bright: Float32Array;
  edgeA: Uint32Array;
  edgeB: Uint32Array;
  edgeCount: number;
  spikeNode: Uint32Array;
  spikeLen: Float32Array;
  spikeCount: number;
  rings: { x: Float32Array; y: Float32Array; z: Float32Array }[];
  /** Unit directions, retained so morph targets can be derived from them. */
  ux: Float32Array;
  uy: Float32Array;
  uz: Float32Array;
  /** Per-point shell offset, so every target keeps the same volume. */
  shell: Float32Array;
};

/**
 * Cheap deterministic value noise at low frequency, so the sphere resolves
 * into a few large "continents" of dense circuitry with quieter space
 * between — that uneven density is most of what makes the reference read as
 * a structure rather than a uniform wireframe ball.
 */
function densityAt(x: number, y: number, z: number) {
  const a = Math.sin(x * 2.1 + y * 1.3) * Math.cos(z * 1.9 - x * 1.1);
  const b = Math.sin(y * 2.7 - z * 1.6) * Math.cos(x * 2.3 + y * 0.9);
  const c = Math.sin(z * 3.4 + x * 1.8) * Math.cos(y * 2.2);
  return (a * 0.45 + b * 0.35 + c * 0.2 + 1) / 2;
}

/** Deterministic pseudo-random in 0…1, so server and client agree. */
function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export function buildCoreGeometry(count: number): CoreGeometry {
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const z = new Float32Array(count);
  const bright = new Float32Array(count);

  // Unit directions, kept alongside the jittered positions. Adjacency is an
  // angular relationship, so the neighbour test must run on these — measuring
  // distance between jittered points would reject genuine neighbours that
  // happen to sit at opposite ends of the shell thickness.
  const ux = new Float32Array(count);
  const uy = new Float32Array(count);
  const uz = new Float32Array(count);
  const shellOffset = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    // Even area distribution: y walks linearly, radius follows the chord.
    const py = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - py * py));
    const theta = GOLDEN_ANGLE * i;

    const dirX = Math.cos(theta) * ring;
    const dirZ = Math.sin(theta) * ring;

    ux[i] = dirX;
    uy[i] = py;
    uz[i] = dirZ;
    bright[i] = densityAt(dirX, py, dirZ);

    // Push each point off the exact shell. A mathematically perfect sphere
    // reads as a wireframe globe; scattering points through a thin volume is
    // what gives the reference its depth and its layered, built quality.
    const shell = 0.93 + hash(i * 2.13) * 0.12;
    shellOffset[i] = shell;

    x[i] = dirX * shell;
    y[i] = py * shell;
    z[i] = dirZ * shell;
  }

  // Mean spacing between adjacent lattice points on a unit sphere.
  const spacing = 2 / Math.sqrt(count);
  // Tight. A looser bound admits offset-55 pairs that are not really adjacent;
  // once the radial jitter pulls their endpoints apart those render as long
  // chords slashing across the shell, and the sphere reads as tangled string
  // rather than fine circuitry.
  const maxChord = spacing * 2.4;
  const maxChordSq = maxChord * maxChord;

  const edgeA: number[] = [];
  const edgeB: number[] = [];

  for (let i = 0; i < count; i += 1) {
    for (let k = 0; k < NEIGHBOUR_OFFSETS.length; k += 1) {
      const offset = NEIGHBOUR_OFFSETS[k]!;
      const j = i + offset;
      if (j >= count) continue;

      // Carve the sparse regions here, on edges — never by deleting points.
      const local = (bright[i]! + bright[j]!) * 0.5;
      if (local < 0.36) continue;

      // Wiring every offset everywhere produces a perfectly regular diamond
      // mesh that reads as a wireframe globe. Selecting offsets per node,
      // weighted by local density, breaks that regularity into the uneven
      // circuit-like structure the reference has: dense blocks in the
      // continents, loose strands at their edges.
      if (hash(i * 7.31 + k * 53.7) > 0.18 + local * 0.86) continue;

      const dx = ux[i]! - ux[j]!;
      const dy = uy[i]! - uy[j]!;
      const dz = uz[i]! - uz[j]!;
      if (dx * dx + dy * dy + dz * dz > maxChordSq) continue;

      edgeA.push(i);
      edgeB.push(j);
    }
  }

  // Corona: radial spikes off the denser regions, where the reference throws
  // its longest filaments.
  const spikeNode: number[] = [];
  const spikeLen: number[] = [];

  for (let i = 0; i < count; i += 1) {
    if (bright[i]! < 0.5) continue;
    if (hash(i) > 0.075) continue;
    spikeNode.push(i);
    spikeLen.push(0.04 + hash(i * 3.7) * 0.3);
  }

  // A few orbital arcs sweeping around the shell. Kept sparse and faint —
  // they are an accent, not the structure.
  const rings = Array.from({ length: 3 }, (_, index) => {
    const segments = 120;
    const tilt = hash(index * 11.3) * Math.PI;
    const yaw = hash(index * 17.9) * Math.PI * 2;
    const radius = 1.02 + hash(index * 5.1) * 0.12;

    const rx = new Float32Array(segments);
    const ry = new Float32Array(segments);
    const rz = new Float32Array(segments);

    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);

    for (let s = 0; s < segments; s += 1) {
      const a = (s / segments) * Math.PI * 2;
      const cx = Math.cos(a) * radius;
      const cy = Math.sin(a) * radius;
      const ty = cy * cosT;
      const tz = cy * sinT;

      rx[s] = cx * cosY - tz * sinY;
      ry[s] = ty;
      rz[s] = cx * sinY + tz * cosY;
    }

    return { x: rx, y: ry, z: rz };
  });

  return {
    count,
    x,
    y,
    z,
    bright,
    edgeA: Uint32Array.from(edgeA),
    edgeB: Uint32Array.from(edgeB),
    edgeCount: edgeA.length,
    spikeNode: Uint32Array.from(spikeNode),
    spikeLen: Float32Array.from(spikeLen),
    spikeCount: spikeNode.length,
    rings,
    ux,
    uy,
    uz,
    shell: shellOffset,
  };
}

/**
 * Map scroll progress (0…1) onto a pair of shapes and a blend between them.
 *
 * Pulled out of the component so the pacing is testable in isolation — it is
 * the part most likely to be tuned, and the easiest to get subtly wrong (an
 * off-by-one here either skips the final shape or wraps back to the first).
 */
export function stageAt(progress: number, stageCount: number) {
  const clamped = Math.min(1, Math.max(0, progress));
  const scaled = clamped * (stageCount - 1);

  // Clamp the source index to the penultimate shape: the last shape has no
  // successor, so the final segment holds on it rather than wrapping around
  // to the first and undoing the narrative the section just told.
  const from = Math.min(Math.floor(scaled), stageCount - 2);
  const raw = scaled - from;

  // Smoothstep, so each shape settles and reads as itself before the next
  // transition begins. A linear blend never lets a shape resolve.
  const blend = raw * raw * (3 - 2 * raw);

  return { from, to: from + 1, blend, nearest: Math.round(scaled) };
}

/**
 * The shapes the core morphs through as the reader scrolls.
 *
 * Every target is a SMOOTH DEFORMATION of the original sphere directions, and
 * that constraint is not cosmetic — it is what keeps the visual intact. The
 * filament mesh wires point `i` to `i+21/34/55`, which are neighbours only
 * because those indices are neighbours *on the sphere*. Any target that
 * scatters points arbitrarily (a random cloud, a text shape, a loaded model)
 * would leave every edge stretched across the whole form, and the elegant
 * lattice would collapse into a hairball. Deform the sphere and the mesh
 * deforms with it.
 *
 * Each shape also carries meaning for the page it sits on:
 *   sphere → one connected system
 *   torus  → reading signals around the market
 *   cone   → qualifying demand down to what converts
 *   cube   → structured, repeatable operations
 */
export function buildMorphTargets(geometry: CoreGeometry): MorphTarget[] {
  const { count, ux, uy, uz, shell } = geometry;

  const make = (
    id: string,
    project: (
      dirX: number,
      dirY: number,
      dirZ: number,
      index: number,
    ) => [number, number, number],
  ): MorphTarget => {
    const x = new Float32Array(count);
    const y = new Float32Array(count);
    const z = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const [px, py, pz] = project(ux[i]!, uy[i]!, uz[i]!, i);
      // Keep the per-point shell jitter in every shape, so the cloud retains
      // its thickness rather than collapsing onto a mathematical surface.
      x[i] = px * shell[i]!;
      y[i] = py * shell[i]!;
      z[i] = pz * shell[i]!;
    }

    return { id, x, y, z };
  };

  return [
    make('sphere', (dx, dy, dz) => [dx, dy, dz]),

    make('torus', (dx, dy, dz) => {
      // Longitude drives the ring; latitude drives the tube.
      const theta = Math.atan2(dz, dx);
      const v = Math.acos(Math.max(-1, Math.min(1, dy))) * 2;
      const major = 0.74;
      const minor = 0.3;
      const ring = major + minor * Math.cos(v);
      return [Math.cos(theta) * ring, minor * Math.sin(v), Math.sin(theta) * ring];
    }),

    make('cone', (dx, dy, dz) => {
      // Wide at the top, converging to a point at the bottom — a funnel.
      const theta = Math.atan2(dz, dx);
      const t = (dy + 1) / 2;
      const radius = t * 1.05;
      return [Math.cos(theta) * radius, dy * 1.05, Math.sin(theta) * radius];
    }),

    make('cube', (dx, dy, dz) => {
      // Push each direction out to the surface of a cube. Order from chaos.
      const m = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) || 1;
      return [(dx / m) * 0.82, (dy / m) * 0.82, (dz / m) * 0.82];
    }),
  ];
}

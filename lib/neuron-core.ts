/**
 * Neuron core — a brain-like sphere whose dendrites branch out from a central
 * soma, with signal pulses firing along them. This is the hero centrepiece.
 *
 * WHY A SEPARATE RENDERER FROM `core-renderer`. That one glows: additive
 * blending, bright cyan on a dark panel. This one floats on the LIGHT home
 * page with no box behind it, and additive blending is invisible on white
 * (lighter + white = white). So this draws with normal alpha compositing in
 * navy ink, with cyan nodes and pulses — which reads as a precise, living
 * brain diagram rather than a boxed screen, and needs no dark background.
 *
 * TOPOLOGY. A real dendritic tree, not spokes:
 *   soma (centre) --trunk--> hub --branch--> surface node
 * Hubs sit at mid radius; each surface node attaches to its nearest hub, so
 * the branches fan into trees instead of a sea-urchin of straight lines. A
 * sparse web of node-to-node synapses sits over the surface.
 *
 * LEARNING. Pulses travel soma -> hub -> node along the dendrites on their own
 * loops, so the brain looks like it is continuously firing signals outward —
 * the "learning and expertise" the lines represent.
 */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

/** Points spread evenly on a sphere of the given radius (with jitter). */
function fibSphere(count: number, radius: number, jitter: number, seed: number) {
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const z = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const py = 1 - (i / Math.max(1, count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - py * py));
    const theta = GOLDEN_ANGLE * i;
    const r = radius * (1 - jitter + hash(i * 3.1 + seed) * jitter * 2);
    x[i] = Math.cos(theta) * ring * r;
    y[i] = py * r;
    z[i] = Math.sin(theta) * ring * r;
  }
  return { x, y, z };
}

export type NeuronGeometry = {
  hubCount: number;
  hx: Float32Array;
  hy: Float32Array;
  hz: Float32Array;
  nodeCount: number;
  nx: Float32Array;
  ny: Float32Array;
  nz: Float32Array;
  /** Brightness weight per node, so some fire brighter. */
  nw: Float32Array;
  /** Hub index each node branches from. */
  nodeHub: Uint16Array;
  /** Sparse node-to-node synapses, flat pairs. */
  synA: Uint16Array;
  synB: Uint16Array;
  synCount: number;
  /** Pulse definitions: which node's path, plus a speed and phase. */
  pulseNode: Uint16Array;
  pulseSpeed: Float32Array;
  pulsePhase: Float32Array;
  pulseCount: number;
};

export function buildNeuronCore(nodeCount: number): NeuronGeometry {
  const hubCount = Math.max(6, Math.round(nodeCount / 7));
  const hubs = fibSphere(hubCount, 0.46, 0.14, 11.3);
  const nodes = fibSphere(nodeCount, 1.0, 0.09, 41.7);

  const nw = new Float32Array(nodeCount);
  const nodeHub = new Uint16Array(nodeCount);

  for (let i = 0; i < nodeCount; i += 1) {
    nw[i] = hash(i * 7.7) > 0.78 ? 0.7 + hash(i * 9.1) * 0.3 : 0.25 + hash(i * 5.3) * 0.4;

    // Attach to the nearest hub so branches form trees, not a spray.
    let best = 0;
    let bestDist = Infinity;
    for (let h = 0; h < hubCount; h += 1) {
      const dx = nodes.x[i]! - hubs.x[h]!;
      const dy = nodes.y[i]! - hubs.y[h]!;
      const dz = nodes.z[i]! - hubs.z[h]!;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestDist) {
        bestDist = d;
        best = h;
      }
    }
    nodeHub[i] = best;
  }

  // Surface synapses: connect roughly half the nodes to their single nearest
  // neighbour. A brute-force search is used because the true nearest neighbour
  // on a Fibonacci sphere is not at a fixed index offset for small point
  // counts. O(n²) once at build, with n in the low hundreds — negligible.
  const synA: number[] = [];
  const synB: number[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < nodeCount; i += 1) {
    if (hash(i * 2.9) > 0.5) continue;
    let best = -1;
    let bestDist = Infinity;
    for (let j = 0; j < nodeCount; j += 1) {
      if (j === i) continue;
      const dx = nodes.x[i]! - nodes.x[j]!;
      const dy = nodes.y[i]! - nodes.y[j]!;
      const dz = nodes.z[i]! - nodes.z[j]!;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestDist) {
        bestDist = d;
        best = j;
      }
    }
    // Dedupe the undirected pair so each synapse is drawn once.
    const key = i < best ? i * nodeCount + best : best * nodeCount + i;
    if (best >= 0 && !seen.has(key)) {
      seen.add(key);
      synA.push(i);
      synB.push(best);
    }
  }

  // Pulses fire along roughly a third of the dendrites.
  const pulseNode: number[] = [];
  const pulseSpeed: number[] = [];
  const pulsePhase: number[] = [];
  for (let i = 0; i < nodeCount; i += 1) {
    if (hash(i * 13.1) > 0.34) continue;
    pulseNode.push(i);
    pulseSpeed.push(0.18 + hash(i * 17.7) * 0.32);
    pulsePhase.push(hash(i * 19.3));
  }

  return {
    hubCount,
    hx: hubs.x,
    hy: hubs.y,
    hz: hubs.z,
    nodeCount,
    nx: nodes.x,
    ny: nodes.y,
    nz: nodes.z,
    nw,
    nodeHub,
    synA: Uint16Array.from(synA),
    synB: Uint16Array.from(synB),
    synCount: synA.length,
    pulseNode: Uint16Array.from(pulseNode),
    pulseSpeed: Float32Array.from(pulseSpeed),
    pulsePhase: Float32Array.from(pulsePhase),
    pulseCount: pulseNode.length,
  };
}

export type NeuronPalette = {
  /** Dendrite lines. `r,g,b`. */
  line: string;
  /** Surface nodes. */
  node: string;
  /** Firing pulses and the soma core. */
  pulse: string;
};

export const NEURON_PALETTE: NeuronPalette = {
  line: '8,26,58', // navy
  node: '18,199,199', // cyan
  pulse: '54,216,255', // accent
};

export type NeuronState = {
  time: number;
  pointerX: number;
  pointerY: number;
  /** 0…1, lifts pulse brightness and count while hovered. */
  engagement: number;
  opacity: number;
};

export class NeuronRenderer {
  private readonly g: NeuronGeometry;
  private palette: NeuronPalette;

  // Projected screen positions: hubs, then nodes, then the soma at the end.
  private readonly px: Float32Array;
  private readonly py: Float32Array;
  private readonly pz: Float32Array;
  private readonly pscale: Float32Array;

  constructor(geometry: NeuronGeometry, palette: NeuronPalette) {
    this.g = geometry;
    this.palette = palette;
    const total = geometry.hubCount + geometry.nodeCount + 1;
    this.px = new Float32Array(total);
    this.py = new Float32Array(total);
    this.pz = new Float32Array(total);
    this.pscale = new Float32Array(total);
  }

  setPalette(palette: NeuronPalette) {
    this.palette = palette;
  }

  /** Soma is the last projected index. */
  private get somaIndex() {
    return this.g.hubCount + this.g.nodeCount;
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    state: NeuronState,
  ) {
    const { g, px, py, pz, pscale, palette } = this;
    ctx.clearRect(0, 0, width, height);
    if (state.opacity <= 0.001) return;

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.4;
    const focal = 3.2;

    const yaw = state.time * 0.12 + state.pointerX * 0.9;
    const pitch = 0.12 + state.pointerY * 0.5;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    const project = (x: number, y: number, z: number, index: number) => {
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;
      const s = focal / (focal - z2);
      px[index] = cx + x1 * radius * s;
      py[index] = cy + y2 * radius * s;
      pz[index] = z2;
      pscale[index] = s;
    };

    for (let h = 0; h < g.hubCount; h += 1) project(g.hx[h]!, g.hy[h]!, g.hz[h]!, h);
    for (let n = 0; n < g.nodeCount; n += 1) {
      project(g.nx[n]!, g.ny[n]!, g.nz[n]!, g.hubCount + n);
    }
    project(0, 0, 0, this.somaIndex);

    const depthAlpha = (z: number, front: number, back: number) => {
      // z is -1 (far) … 1 (near). Map to a back…front alpha range.
      const t = (z + 1) * 0.5;
      return back + (front - back) * t;
    };

    // --- Synaptic web (faintest, drawn first) --------------------------
    ctx.lineWidth = 0.75;
    for (let s = 0; s < g.synCount; s += 1) {
      const a = g.hubCount + g.synA[s]!;
      const b = g.hubCount + g.synB[s]!;
      const alpha = depthAlpha(Math.min(pz[a]!, pz[b]!), 0.16, 0.03) * state.opacity;
      if (alpha < 0.01) continue;
      ctx.strokeStyle = `rgba(${palette.line},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(px[a]!, py[a]!);
      ctx.lineTo(px[b]!, py[b]!);
      ctx.stroke();
    }

    // --- Branches: hub -> node ------------------------------------------
    for (let n = 0; n < g.nodeCount; n += 1) {
      const nodeIdx = g.hubCount + n;
      const hubIdx = g.nodeHub[n]!;
      const alpha =
        depthAlpha(pz[nodeIdx]!, 0.42, 0.08) * state.opacity * (0.7 + g.nw[n]! * 0.5);
      ctx.strokeStyle = `rgba(${palette.line},${Math.min(0.6, alpha).toFixed(3)})`;
      ctx.lineWidth = 0.6 + depthAlpha(pz[nodeIdx]!, 0.7, 0);
      ctx.beginPath();
      ctx.moveTo(px[hubIdx]!, py[hubIdx]!);
      ctx.lineTo(px[nodeIdx]!, py[nodeIdx]!);
      ctx.stroke();
    }

    // --- Trunks: soma -> hub (strongest lines) --------------------------
    const soma = this.somaIndex;
    for (let h = 0; h < g.hubCount; h += 1) {
      const alpha = depthAlpha(pz[h]!, 0.5, 0.14) * state.opacity;
      ctx.strokeStyle = `rgba(${palette.line},${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.8 + depthAlpha(pz[h]!, 1, 0.2);
      ctx.beginPath();
      ctx.moveTo(px[soma]!, py[soma]!);
      ctx.lineTo(px[h]!, py[h]!);
      ctx.stroke();
    }

    // --- Surface nodes ---------------------------------------------------
    for (let n = 0; n < g.nodeCount; n += 1) {
      const idx = g.hubCount + n;
      const depth = (pz[idx]! + 1) * 0.5;
      const w = g.nw[n]!;
      const size = (0.7 + depth * 1.6 + w * 1.3) * pscale[idx]!;
      const alpha = (0.2 + depth * 0.55) * state.opacity;
      ctx.fillStyle = `rgba(${palette.node},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px[idx]!, py[idx]!, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- Firing pulses ---------------------------------------------------
    const pulseBoost = 0.6 + state.engagement * 0.6;
    for (let p = 0; p < g.pulseCount; p += 1) {
      const n = g.pulseNode[p]!;
      const nodeIdx = g.hubCount + n;
      const hubIdx = g.nodeHub[n]!;

      // Loop 0…1: first half soma->hub, second half hub->node.
      const t = (state.time * g.pulseSpeed[p]! + g.pulsePhase[p]!) % 1;
      let ax: number;
      let ay: number;
      let az: number;
      let bx: number;
      let by: number;
      let bz: number;
      let seg: number;
      if (t < 0.5) {
        ax = px[soma]!;
        ay = py[soma]!;
        az = pz[soma]!;
        bx = px[hubIdx]!;
        by = py[hubIdx]!;
        bz = pz[hubIdx]!;
        seg = t * 2;
      } else {
        ax = px[hubIdx]!;
        ay = py[hubIdx]!;
        az = pz[hubIdx]!;
        bx = px[nodeIdx]!;
        by = py[nodeIdx]!;
        bz = pz[nodeIdx]!;
        seg = (t - 0.5) * 2;
      }

      const x = ax + (bx - ax) * seg;
      const y = ay + (by - ay) * seg;
      const z = az + (bz - az) * seg;
      const depth = (z + 1) * 0.5;
      const alpha = (0.35 + depth * 0.6) * state.opacity * pulseBoost;
      const size = (1 + depth * 1.6) * pscale[nodeIdx]!;

      ctx.fillStyle = `rgba(${palette.pulse},${Math.min(1, alpha).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- Soma: a soft cyan cell body ------------------------------------
    // A radial gradient reads as a glowing core even on a light ground,
    // because it is cyan-on-pale rather than additive light.
    const sx = px[soma]!;
    const sy = py[soma]!;
    const bloom = radius * 0.34;
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, bloom);
    grad.addColorStop(0, `rgba(${palette.pulse},${(0.9 * state.opacity).toFixed(3)})`);
    grad.addColorStop(0.4, `rgba(${palette.node},${(0.4 * state.opacity).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${palette.node},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, bloom, 0, Math.PI * 2);
    ctx.fill();
  }
}

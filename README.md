# Reshi AI

Marketing site for Reshi AI — a digital studio building websites, automation and AI
systems for local businesses.

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion

---

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev
```

Contact and newsletter notifications require `RESEND_API_KEY`,
`CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`. The sender address must use a domain
verified in Resend. If delivery is not configured or the provider rejects a
message, the forms show an error instead of claiming success.

**Setup walkthrough: [`docs/email-setup.md`](docs/email-setup.md)** — domain
verification, API key, `.env.local`, and exactly what the newsletter does and does
not do. After configuring, verify the endpoints end to end:

```bash
node scripts/verify-email.mjs
```

| Script           | Does                                           |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Dev server                                     |
| `npm run build`  | Production build                               |
| `npm run start`  | Serve the production build                     |
| `npm run check`  | Typecheck + lint + format check (run pre-push) |
| `npm run format` | Write Prettier formatting                      |

---

## Project shape

```
app/            Routes, API handlers, sitemap/robots/OG image
components/
  ui/           Primitives (button, badge, field, accordion, headings)
  layout/       Header, mega-menu, mobile drawer, footer, logo
  home/         Homepage sections
  work/         Case study card + filterable grid
  blog/         Table of contents
  shared/       Cross-page pieces (reveal, aurora, spotlight, forms, CTA)
constants/      site.ts — identity, contact details, navigation
content/        Typed content modules + blog MDX
hooks/          reduced-motion, scroll state, magnetic, media query
lib/            utils, motion tokens, SEO, JSON-LD, blog reader, validation
types/          Shared domain types
```

**All copy lives in `content/` and `constants/site.ts`.** No strings are hardcoded in
components, so the site can be rewritten without touching a component.

---

## Editing content

| To change             | Edit                      |
| --------------------- | ------------------------- |
| Contact details, nav  | `constants/site.ts`       |
| Services              | `content/services.ts`     |
| Case studies          | `content/work.ts`         |
| Industries            | `content/industries.ts`   |
| Pricing, FAQs, values | `content/site-content.ts` |
| Blog posts            | `content/blog/*.mdx`      |

New blog post: drop an `.mdx` file in `content/blog/` with `title`, `description`,
`date`, `category` and `author` frontmatter. Routing, the index, reading time, the
table of contents, JSON-LD and the sitemap all pick it up automatically.

---

## Design system

Tokens live in `app/globals.css` under `@theme` — Tailwind v4 is configured CSS-first,
so every token becomes a utility (`--color-navy-900` → `bg-navy-900`). Type is a fluid
`clamp()` scale, so there is no separate mobile type scale.

Motion constants are in `lib/motion.ts`. Durations are limited to four values
(200/300/500/800ms); anything else is a bug. Reveal animations run **once**, on entry.

### Accessibility

- Every animated component reads `usePrefersReducedMotion` and renders statically when
  set — CSS alone cannot stop a JS spring.
- Mobile drawer implements the full dialog contract: focus move-in, focus trap, focus
  restore, Escape, scroll lock.
- Skip link, visible focus rings, `aria-live` on the work filter, decorative layers
  marked `aria-hidden`.

---

## Deliberate technical decisions

**No Spline / React Three Fiber / GSAP / Rive.** The brief listed these but noted "only
when needed". A WebGL hero costs 300kb–1.5MB and reliably degrades LCP on mid-tier
Android — the target audience's device. The aurora, parallax, spotlight, tilt and scroll
choreography are CSS + Framer Motion, GPU-composited. Add Spline later behind a lazy
boundary if a specific scene justifies it.

**No root `loading.tsx`.** One was written and removed after testing: a root-level
loading file wraps the whole tree in Suspense, which made Next emit a skeleton inside
`<main>` and defer the real content — including the `<h1>` — into a hidden streaming
container. Nothing on this site fetches async data, so the boundary bought nothing and
broke landmark semantics in the served HTML.

**The hero core is a neuron brain, floating with no box.** `lib/neuron-core.ts` +
`components/home/jarvis-core.tsx` draw a brain-like sphere: dendrites branch from a
central soma (`soma → hub → surface node`, a real dendritic tree, not spokes) with signal
pulses firing outward along them — the "learning" made visible. It sits directly on the
pale hero with a transparent canvas and no dark panel.

Rendered in **navy ink with normal alpha compositing**, not the glowing additive approach
of the sphere below — additive blending is invisible on a light background (`lighter` +
white = white), so a glowing cyan brain would vanish on the pale hero. Navy dendrites +
cyan nodes + accent-cyan pulses read as a precise living brain and need no dark backing.
Nearest-hub attachment and nearest-neighbour synapses are both brute-force searches (O(n²)
once at build, n in the low hundreds) because true neighbours on a Fibonacci sphere are
not at fixed index offsets for small point counts.

> A subtle failure this surfaced: the device-tier frame probe was starting 900ms after
> mount and measuring across the boot sequence + hydration, so it saw a busy load tail and
> downgraded a fast 12-core machine to `reduced`, which froze the hero core. The probe now
> starts at 2200ms (after boot), uses a 32ms median threshold, and never returns a verdict
> while the tab is hidden (throttled rAF would condemn every device). See
> `hooks/use-device-tier.tsx`.

**The morph sequence still uses the glowing filament core** (`lib/core-geometry.ts` +
`lib/core-renderer.ts`) because it sits on a dark section where additive glow works. Two
cores, two renderers, deliberately.

**The filament core (used by the scroll sequence) is Canvas 2D with hand-rolled 3D, not
WebGL.** A volumetric sphere of glowing filaments, modelled on the neural-net sphere from
_Age of Ultron_. Three files:

| File                              | Does                                                   |
| --------------------------------- | ------------------------------------------------------ |
| `lib/core-geometry.ts`            | Builds the point cloud, filament mesh, spikes and arcs |
| `lib/core-renderer.ts`            | Projects and draws it                                  |
| `components/home/jarvis-core.tsx` | React lifecycle, pointer input, telemetry chrome       |

It costs **+3 kB** of First Load JS (165 → 168 kB). Three.js would be ~150 kB gzipped to
do projection maths that is forty lines here; WebGL earns its weight at 100k+ primitives,
and this draws a few thousand.

Two ideas carry the whole visual, and both are easy to break:

- **Fibonacci-lattice adjacency.** Points are distributed by golden angle, and a point's
  spatial neighbours sit at Fibonacci index offsets (13, 21, 34, 55) — not at ±1. Joining
  those offsets produces the interlocking spiral mesh for free. This only works on the
  _complete_ lattice: an earlier version deleted low-density points before wiring the
  mesh, which destroyed the index-to-neighbour relationship and collapsed the sphere into
  a few stray segments. Sparse regions are carved by dropping **edges**, never points.
- **Irregularity is deliberate.** Wiring every offset everywhere gives a perfectly regular
  diamond mesh that reads as a wireframe globe. Edges are selected per node weighted by
  local density, and points are jittered off the exact shell (0.93–1.05), which is what
  produces depth and circuit-like structure instead of a hollow ball.

**Every page opens on a 3D masthead.** `components/shared/ambient-field.tsx` +
`lib/ambient-field.ts` are the "antigravity" field — a weightless constellation of
depth-sorted particles drifting behind the hero copy on the home page and on every
`PageHero` (About, Services, Work, Contact, …). Same hand-rolled Canvas 2D projection as
the core, so no new dependency; it costs **+1 kB** on the home route and **~0** on inner
pages, because the renderer sits in the shared chunk.

Deliberately NOT a single fixed layer behind the whole site: almost every section has a
solid background (`bg-surface`, `bg-surface-raised`, `bg-surface-dark`), so a field behind
them would be covered and invisible — and punching transparency into every section to fix
that wrecks text contrast on the light theme and forces a full-viewport repaint on every
scroll frame (an INP killer on mid-tier Android). The field lives in the masthead zone,
where it is visible, content sits on solid panels below, and readability is untouched.

It is a background and behaves like one: full tier animates, lower tiers paint one static
frame, `static` skips it entirely, it fades in over already-painted content, and it
**freezes via IntersectionObserver the moment the masthead scrolls off-screen** — which
matters because it is on every page. "Antigravity" is specific motion: each point bobs on
its own bounded loop with no shared direction and no downward pull (buoyant, not
falling/flying), the cloud turns slowly on its vertical axis, and scrolling lifts it
upward.

**The core morphs on scroll.** `components/home/core-sequence.tsx` is a pinned section
where scroll position drives the point cloud through four shapes — sphere → torus → cone
→ cube — standing for one system, reading signals, qualifying demand, structured
operations. Scroll _is_ the timeline; nothing plays on its own.

Every morph target is a **smooth deformation of the original sphere directions**, and
that constraint is structural, not stylistic. The mesh wires point `i` to `i+21/34/55`,
which are neighbours only because those indices are neighbours _on the sphere_. Any
target that scatters points arbitrarily — a random cloud, a text shape, a loaded model —
would stretch every edge across the whole form and collapse the lattice into a hairball.
Deform the sphere and the mesh deforms with it.

Pacing lives in `stageAt()` in `lib/core-geometry.ts`, extracted from the component so it
can be tested in isolation. It is the piece most likely to be tuned and the easiest to
get subtly wrong — an off-by-one either skips the final shape or wraps back to the first.

Tuning knobs, in rough order of usefulness: node count (`width * 6`, capped 3400, in
`jarvis-core.tsx`), `maxChord` and the `shell` jitter range in `core-geometry.ts`, and the
per-band alpha in `core-renderer.ts`. Palette is a prop — `<JarvisCore palette="cyan" />`
switches it from the film's gold to the brand cyan.

Two rules it follows:

- **Every number on the panel is real** — pointer vector, session uptime, viewport.
  Nothing is invented. Fabricated "live" business metrics read as a claim rather than a
  decoration, and a visitor who catches one stops believing the case studies too.
- **It does not display a frame-rate counter.** An earlier version did, and whenever the
  browser throttled rAF the hero advertised "FPS 001" and read as a broken site. Frame
  rate is a developer metric.

It paints one frame synchronously on mount (so it is never a blank panel while waiting
for the first `requestAnimationFrame`), freezes via IntersectionObserver when scrolled
out of view, caps device pixel ratio at 2, and renders a single static frame under
`prefers-reduced-motion`.

**Its frame rate has not been measured.** The preview browser used during development
renders at ~2 FPS regardless of page content, so no honest number could be taken. Check it
on real hardware; if it struggles, lower the node count first.

**Motion tiering.** `hooks/use-device-tier.tsx` decides how much motion the visitor gets.
Static hints (memory, cores, save-data, connection type, reduced-motion) give an instant
guess, then a runtime probe measures 60 real frames and downgrades if the median exceeds
20ms. The probe is what actually protects mid-tier Android: `deviceMemory` is bucketed and
absent on Safari, and a phone can report eight cores while thermally throttled. It uses
the median, not the mean, so one GC pause cannot condemn a healthy device. One shared
probe per page — several would compete for the frames they are measuring.

| Tier      | Gets                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `full`    | Every signature moment, including the continuously rendering core                  |
| `reduced` | Entrances, scan sweeps and scroll-linked transforms; core renders one static frame |
| `static`  | No motion at all                                                                   |

**Scroll-driven 3D is CSS, not WebGL.** `components/shared/scroll-3d.tsx` binds
`rotateX` / `rotateY` / `translateZ` to scroll position via Framer Motion values, so cards
turn in real perspective as they approach. Used on the services, featured-work and
industries grids. Costs nothing beyond Framer Motion, which was already a dependency.

Two things to know before reusing it:

- **Do not combine it with `Reveal`.** Both are entrance animations; together they
  double up. `Reveal` is a one-shot for text, `Scroll3D` stays bound to scroll position
  for cards and panels.
- **The completion offset is `['start end', 'center 65%']`, not `'center center'`.** An
  element near the bottom of the document can never reach the viewport centre — there is
  no scroll left beneath it — so it would stay permanently tilted and semi-transparent.

The core also reads scroll: `scrollY` drives its yaw, and scroll _velocity_ raises its
engagement, so the sphere turns and brightens as the reader moves. Both are read with
`.get()` inside the render loop rather than subscribed to, which would re-render the
component on every scroll frame.

**shadcn/ui primitives written by hand.** Same cva + tailwind-merge patterns, without
pulling the CLI and its Radix dependency graph for four components.

**Case study imagery is gradient placeholders.** Aspect ratios are already reserved, so
dropping in real screenshots will not shift layout.

---

## Before launch

These are known gaps, not oversights:

1. **Resend must be configured before launch.** Contact enquiries and newsletter signup
   notices are delivered to `CONTACT_TO_EMAIL`. Newsletter signups currently arrive as
   inbox notifications; an audience, double opt-in and automated unsubscribe flow still
   need a newsletter platform before active promotion.
2. **Rate limiting is in-memory.** Fine for a single instance; move to Upstash/Redis if
   you deploy multi-region.
3. **Placeholder contact details** in `constants/site.ts` — phone, WhatsApp number,
   Calendly URL and social handles.
4. **Legal pages are drafts, not legal advice.** Have `app/privacy` and `app/terms`
   reviewed against the DPDP Act (and GDPR if you take EU enquiries).
5. **Husky + commitlint not installed** — the repo is not a git repository yet. Run
   `git init` first.
6. **Lighthouse and cross-browser testing not run.** The build was verified structurally
   (see below), but no Lighthouse run, visual regression suite or real-device test has
   happened.

## Bugs found and fixed during verification

Recorded because each was invisible from the source alone:

1. **`<h1>` rendered outside `<main>`.** A root `app/loading.tsx` wrapped the tree in
   Suspense, so Next emitted a skeleton inside `<main>` and deferred all real content
   into a hidden streaming container. Removed the file.
2. **Stat numbers shipped as `visibility: hidden`.** `Counter` hid the value until the
   first `requestAnimationFrame`, so no-JS clients, crawlers and background tabs saw
   empty stats. Now server-renders the true value.
3. **The honeypot returned 400 and named itself.** `z.string().max(0)` failed schema
   validation _before_ the route's honeypot branch, so the branch was dead code and the
   400 body told a bot which field was the trap. Now parses freely and the route answers
   200 while dropping the submission.
4. **Dangling `aria-controls` on the accordion.** Closed panels unmount, so the attribute
   pointed at a non-existent id (`aria-valid-attr-value` failure). Now set only when open.
5. **Article promised "Eleven things" and listed ten.** Copy corrected.

## What was actually verified

- `npm run build` passes; 34 routes, all prerendered except `/contact` (reads a query
  param) and the API handlers.
- `tsc --noEmit` clean under `strict` + `noUncheckedIndexedAccess`.
- ESLint clean, Prettier clean.
- Served HTML checked on 15 routes: exactly one `<h1>` each, inside `<main>`; canonical,
  title and description present and within SERP length limits; all JSON-LD parses as
  valid JSON (Organization, WebSite, ProfessionalService, FAQPage, Service, Article,
  BlogPosting, BreadcrumbList).
- No external resource requests — fonts self-hosted via `next/font` with `font-display:
swap`.
- Contact form fully server-rendered in the initial HTML.

Interactively exercised in a real browser:

- **Accordion** — opens, closes the previous, `aria-expanded` tracks state.
- **Work filter** — filters to the correct project, `aria-pressed` toggles, live region
  announces "Showing 1 of 6 projects."
- **Mobile drawer** — opens, `aria-modal`, focus moves inside, scroll locks, Escape
  closes, focus returns to the trigger, scroll lock releases.
- **Contact form** — empty submit produces three `role="alert"` errors with `aria-invalid`
  and resolving `aria-describedby`; `?plan=growth` pre-selects the service.
- **API route** — valid payload 200 and logged; invalid 400 with per-field issues;
  honeypot 200 with nothing logged.
- **Blog** — TOC anchors all resolve to real heading ids (hand-rolled `slugify` matches
  `rehype-slug`), syntax highlighting applies, tables scroll inside their own container.

> Note: `npm run build` and `npm run dev` share `.next`. Running a build while the dev
> server is up will 500 it until you restart the dev server.

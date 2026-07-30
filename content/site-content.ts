import type { FaqItem, PricingTier, ProcessStep } from '@/types';

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      'A working session, not a questionnaire. We map how your business actually makes money, where enquiries leak out, and which three numbers this project has to move. You leave with that written down whether or not you hire us.',
    duration: 'Week 1',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Structure before surface. Wireframes and content model first, then a full visual system built with your real copy and real photography. Nothing gets approved on lorem ipsum.',
    duration: 'Weeks 2-3',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Component-driven development against a staging URL you can open from day one. Weekly demos, no reveals. Performance and accessibility budgets are enforced in CI, so quality is not a final-week scramble.',
    duration: 'Weeks 4-7',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'Redirect mapping, structured data, analytics and search console handover, then a supervised go-live. We watch rankings and Core Web Vitals for thirty days afterwards and fix what moves.',
    duration: 'Week 8',
  },
  {
    number: '05',
    title: 'Grow',
    description:
      'The launch is the start of the data, not the end of the project. Monthly reporting in revenue terms, with the next set of priorities attached — or a clean handover if you would rather run it yourselves.',
    duration: 'Ongoing',
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: 'Launch',
    price: '₹85,000',
    description:
      'A fast, credible presence for a business that needs to look serious and be found. Built properly, not templated.',
    features: [
      'Up to 6 custom-designed pages',
      'Bespoke design system, no themes',
      'Mobile-first build with Core Web Vitals in the green',
      'On-page SEO and structured data',
      'Contact and enquiry flows',
      'Analytics and search console setup',
      '30 days of post-launch support',
    ],
    cta: { label: 'Start with Launch', href: '/contact?plan=launch' },
    note: 'Typically 4-5 weeks end to end.',
  },
  {
    name: 'Growth',
    price: '₹1,85,000',
    description:
      'For businesses ready to treat the website as a channel: more surface area, real local visibility, and the manual work automated.',
    features: [
      'Everything in Launch',
      'Up to 15 pages with editable content model',
      'Local SEO programme and Google Business Profile',
      'Booking, ordering or reservation automation',
      'CRM and WhatsApp integration',
      'Conversion tracking and monthly reporting',
      'Brand refresh and asset library',
      '90 days of support and iteration',
    ],
    cta: { label: 'Start with Growth', href: '/contact?plan=growth' },
    featured: true,
    note: 'Our most-chosen engagement. Typically 7-9 weeks.',
  },
  {
    name: 'Systems',
    price: 'From ₹4,00,000',
    description:
      'A full operating layer — AI assistants, deep automation and the reporting to run it — for businesses where the website is only one part of the problem.',
    features: [
      'Everything in Growth',
      'AI assistant grounded in your own data',
      'Automated lead qualification and routing',
      'Multi-system integration and data pipelines',
      'Custom dashboards and reporting',
      'Multi-location or multi-language support',
      'Dedicated engineering time each month',
      'Ongoing partnership with quarterly planning',
    ],
    cta: { label: 'Talk about Systems', href: '/contact?plan=systems' },
    note: 'Scoped per engagement after a discovery session.',
  },
];

export const retainerAddOns = [
  { name: 'Local SEO retainer', price: '₹25,000/mo' },
  { name: 'Paid media management', price: '₹40,000/mo' },
  { name: 'Content and social', price: '₹35,000/mo' },
  { name: 'Automation maintenance', price: '₹20,000/mo' },
] as const;

export const faqs: FaqItem[] = [
  {
    question: 'How long does a project take?',
    answer:
      'A Launch site is typically four to five weeks. Growth engagements run seven to nine weeks. Systems work is scoped after discovery, but we deliver in increments rather than disappearing for three months — you will see working software every week.',
  },
  {
    question: 'Do you work with businesses outside Kerala?',
    answer:
      'Yes. We work remotely across India and the Gulf. Discovery happens on video, and we run the same weekly demo cadence regardless of where you are. For local SEO engagements we do need to understand your physical catchment, but that does not require us to be in it.',
  },
  {
    question: 'What happens if I want to change something after launch?',
    answer:
      'Every site ships with a content model your team can edit without touching code — copy, images, menu items, pricing, team members. Structural changes are covered by your support window, and after that we quote them as small pieces of work. We do not lock anyone into a retainer to change a phone number.',
  },
  {
    question: 'Do I own the work?',
    answer:
      'Completely. Code, design files, domains, analytics and hosting accounts are all in your name and handed over at launch. If you decide to move to another agency, nothing about our setup makes that difficult.',
  },
  {
    question: 'Is AI actually useful for a business like mine?',
    answer:
      'Sometimes, and we will tell you when it is not. It earns its place when you are answering the same questions repeatedly, qualifying leads by hand, or losing enquiries out of hours. It does not earn its place as a chatbot bolted onto a site nobody visits — that is a traffic problem wearing an AI costume.',
  },
  {
    question: 'What do you need from me during the project?',
    answer:
      'Roughly two hours a week: one demo call and asynchronous feedback. The heaviest lift is content and photography, and we will tell you exactly what is needed in week one so it is not a bottleneck in week six.',
  },
  {
    question: 'How do payments work?',
    answer:
      'Forty percent to start, forty at design sign-off, twenty on launch. Retainers are billed monthly in advance and can be cancelled with thirty days’ notice. No long lock-ins.',
  },
  {
    question: 'Can you fix our existing site instead of rebuilding it?',
    answer:
      'Often, yes, and it is usually the cheaper answer. We will audit what you have first and tell you honestly whether remediation gets you there. Rebuilds make sense when the foundation cannot carry what you need, not by default.',
  },
];

export const values = [
  {
    title: 'Say the unprofitable thing',
    description:
      'If a project will not pay for itself, we say so before we invoice for it — including when that means talking you out of a rebuild you do not need.',
  },
  {
    title: 'Ship in the open',
    description:
      'A staging URL from week one and a demo every week. No reveals, no surprises, no three months of silence followed by a presentation.',
  },
  {
    title: 'Build for the handover',
    description:
      'Documentation, training and full ownership of every account. Our work should survive us leaving.',
  },
  {
    title: 'Measure what pays',
    description:
      'Impressions are not a result. We report in bookings, enquiries and revenue, and we will name the channels that are not working.',
  },
] as const;

export const timeline = [
  {
    year: '2023',
    title: 'First lines of code',
    description:
      'Reshi AI starts as a one-person studio building sites for restaurants in Kochi who were being sold templates at custom prices.',
  },
  {
    year: '2024',
    title: 'Beyond the website',
    description:
      'Clients kept asking for the same thing after launch — stop the manual work. Automation becomes a core practice alongside design and build.',
  },
  {
    year: '2025',
    title: 'AI, grounded',
    description:
      'The first production assistants ship for venues and clinics, trained on client data rather than bolted on. Deflection rates cross sixty percent.',
  },
  {
    year: 'Today',
    title: 'A growth partner',
    description:
      'A studio built around one idea: judge the work by the numbers a business actually reports on, and say so plainly when something will not pay for itself.',
  },
] as const;

export const techStack = [
  { name: 'Next.js', category: 'Framework' },
  { name: 'React', category: 'UI' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Vercel', category: 'Infrastructure' },
  { name: 'Claude', category: 'AI' },
  { name: 'PostgreSQL', category: 'Data' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'Framer Motion', category: 'Motion' },
  { name: 'Sanity', category: 'Content' },
  { name: 'Resend', category: 'Email' },
  { name: 'Twilio', category: 'Messaging' },
] as const;

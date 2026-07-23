import { Bot, Globe, Megaphone, MapPin, Sparkles, Workflow } from 'lucide-react';
import type { Service } from '@/types';

export const services: Service[] = [
  {
    slug: 'website-development',
    title: 'Website Development',
    tagline: 'Sites that load in under two seconds and read like a brand.',
    summary:
      'Custom, hand-built websites on a modern stack. No page builders, no themes, no 4MB homepages. Every site ships with a content model your team can actually edit, analytics wired in from day one, and Core Web Vitals in the green before we hand over the keys.',
    icon: Globe,
    deliverables: [
      'Bespoke design system and page templates',
      'Next.js build with server rendering and edge caching',
      'Editable content model — no developer needed for copy changes',
      'Booking, ordering or enquiry flows tailored to your business',
      'Analytics, consent and conversion tracking configured',
      'Performance budget enforced in CI',
    ],
    outcomes: [
      { metric: '<1.5s', label: 'Median load' },
      { metric: '+62%', label: 'Enquiry rate' },
      { metric: '100', label: 'Accessibility score' },
    ],
    process: [
      {
        title: 'Audit',
        description:
          'We benchmark your current site against competitors on speed, structure and conversion, and agree the three numbers the rebuild has to move.',
      },
      {
        title: 'Design',
        description:
          'Wireframes first, then a full visual system in Figma. You see real content in real layouts, not lorem ipsum.',
      },
      {
        title: 'Build',
        description:
          'Component-driven development with a staging URL from week one. You watch it come together instead of waiting for a reveal.',
      },
      {
        title: 'Launch',
        description:
          'Redirect mapping, schema markup, search console handover and a 30-day watch window on rankings and vitals.',
      },
    ],
    startingPrice: '₹85,000',
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    tagline: 'Retire the manual work that quietly eats your week.',
    summary:
      'Most local businesses lose ten to fifteen hours a week to copying data between WhatsApp, spreadsheets, billing software and a booking system that does not talk to any of them. We map those flows, then remove them — with integrations that keep running when nobody is watching.',
    icon: Workflow,
    deliverables: [
      'Process map of every manual handoff in your operation',
      'Automated booking, ordering and reservation pipelines',
      'WhatsApp and email notification sequences',
      'Invoice, receipt and reporting automation',
      'CRM sync so no enquiry is ever retyped',
      'Failure alerting — you hear about breakage before customers do',
    ],
    outcomes: [
      { metric: '12h', label: 'Saved weekly' },
      { metric: '0', label: 'Missed enquiries' },
      { metric: '4×', label: 'Faster response' },
    ],
    process: [
      {
        title: 'Shadow',
        description:
          'We sit with your team for a day and document what actually happens, which is rarely what the process document says.',
      },
      {
        title: 'Prioritise',
        description:
          'Every candidate automation gets scored on hours saved against build cost. We start with the top three.',
      },
      {
        title: 'Automate',
        description:
          'Built incrementally and run in parallel with the manual process until it has proven itself for two weeks.',
      },
      {
        title: 'Hand over',
        description:
          'Documentation, a runbook and training so your team can adjust the rules without calling us.',
      },
    ],
    startingPrice: '₹60,000',
  },
  {
    slug: 'ai-solutions',
    title: 'AI Solutions',
    tagline: 'Assistants trained on your operation, not the open internet.',
    summary:
      'AI is only useful when it knows your menu, your rooms, your pricing and your policies. We build assistants and agents grounded in your own data — answering enquiries, qualifying leads and drafting responses in your voice, with a human in the loop wherever it matters.',
    icon: Sparkles,
    deliverables: [
      'Customer-facing assistant trained on your catalogue and policies',
      'Automated lead qualification and routing',
      'AI-drafted replies for enquiries, reviews and follow-ups',
      'Document and menu ingestion pipeline that stays current',
      'Guardrails, escalation paths and human review',
      'Usage dashboard so you can see what it is actually answering',
    ],
    outcomes: [
      { metric: '68%', label: 'Enquiries deflected' },
      { metric: '24/7', label: 'Response coverage' },
      { metric: '2min', label: 'Median first reply' },
    ],
    process: [
      {
        title: 'Ground',
        description:
          'We gather the sources of truth — menus, tariffs, FAQs, policies — and build the pipeline that keeps them synced.',
      },
      {
        title: 'Prototype',
        description:
          'A working assistant in week one, evaluated against real historical enquiries rather than invented test cases.',
      },
      {
        title: 'Harden',
        description:
          'Guardrails, refusal behaviour and escalation rules, so it hands off to a person the moment it should.',
      },
      {
        title: 'Measure',
        description:
          'Deflection rate, satisfaction and escalation volume tracked weekly. If it is not earning its keep, we change it.',
      },
    ],
    startingPrice: '₹1,20,000',
  },
  {
    slug: 'local-seo',
    title: 'Local SEO',
    tagline: 'Own the map pack and the searches that carry real intent.',
    summary:
      'For a local business, ranking third in the map pack is worth more than any national keyword. We fix the technical foundation, build out the location and service pages that actually rank, and turn your Google Business Profile into a channel rather than a listing.',
    icon: MapPin,
    deliverables: [
      'Technical SEO audit and remediation',
      'Google Business Profile optimisation and posting cadence',
      'Location and service landing pages built to rank',
      'Structured data — LocalBusiness, FAQ, review markup',
      'Citation cleanup across directories',
      'Review generation flow that does not annoy customers',
    ],
    outcomes: [
      { metric: '+180%', label: 'Map pack views' },
      { metric: 'Top 3', label: 'Local rankings' },
      { metric: '+45%', label: 'Direction requests' },
    ],
    process: [
      {
        title: 'Audit',
        description:
          'Crawl, index and profile audit against the three competitors currently outranking you.',
      },
      {
        title: 'Fix',
        description:
          'Technical debt first — speed, crawlability, schema, duplicate listings. Rankings rarely move until this is clean.',
      },
      {
        title: 'Build',
        description:
          'Pages built around how people actually search locally, with genuine content rather than spun location templates.',
      },
      {
        title: 'Compound',
        description:
          'Monthly reporting on rankings, calls and direction requests, with the next month’s priorities attached.',
      },
    ],
    startingPrice: '₹25,000',
  },
  {
    slug: 'branding',
    title: 'Branding',
    tagline: 'An identity that survives contact with the real world.',
    summary:
      'A logo is the easy part. We build the whole system — type, colour, photography direction, tone of voice and the rules for using them — so your signage, your Instagram grid and your website all look like they came from the same company.',
    icon: Megaphone,
    deliverables: [
      'Brand strategy and positioning workshop',
      'Logo system with responsive marks',
      'Type, colour and photography direction',
      'Tone of voice guide with real examples',
      'Print, signage and packaging applications',
      'Brand guidelines your team can follow without you',
    ],
    outcomes: [
      { metric: '3×', label: 'Recall in testing' },
      { metric: '1', label: 'Consistent system' },
      { metric: '+28%', label: 'Premium perception' },
    ],
    process: [
      {
        title: 'Discover',
        description:
          'Interviews with you, your team and your regulars. The best positioning is usually already true — it just is not written down.',
      },
      {
        title: 'Direct',
        description:
          'Two or three distinct territories, presented in context rather than on a white page.',
      },
      {
        title: 'Craft',
        description:
          'The chosen direction is built out into a full system across every surface you actually use.',
      },
      {
        title: 'Equip',
        description:
          'Guidelines, source files and templates so the brand holds together after we leave.',
      },
    ],
    startingPrice: '₹75,000',
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    tagline: 'Campaigns measured in revenue, not impressions.',
    summary:
      'We run paid and organic together, because they are not separate problems. Every rupee is tracked to an outcome you care about — a booking, a table, an appointment — and we will tell you when a channel is not working rather than reporting on reach.',
    icon: Bot,
    deliverables: [
      'Channel strategy grounded in your unit economics',
      'Meta and Google campaign build and management',
      'Content calendar and creative production',
      'Landing pages built for the campaign, not repurposed',
      'Conversion tracking that survives iOS and cookie loss',
      'Monthly reporting in revenue terms',
    ],
    outcomes: [
      { metric: '4.2×', label: 'Return on ad spend' },
      { metric: '-38%', label: 'Cost per lead' },
      { metric: '+90%', label: 'Repeat visits' },
    ],
    process: [
      {
        title: 'Model',
        description:
          'What a customer is worth and what you can afford to pay for one. Everything downstream depends on this number.',
      },
      {
        title: 'Test',
        description:
          'Small, fast experiments across channels and creative to find what converts before we scale spend.',
      },
      {
        title: 'Scale',
        description:
          'Budget moves toward what works, weekly. No channel gets funded out of habit.',
      },
      {
        title: 'Report',
        description:
          'One page, in plain language: spend, leads, revenue, and what changes next month.',
      },
    ],
    startingPrice: '₹40,000/mo',
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

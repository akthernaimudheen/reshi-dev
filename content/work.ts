import type { CaseStudy } from '@/types';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'seaking-restaurant',
    client: 'SeaKing Restaurant',
    title: 'A coastal kitchen that finally looked like its food',
    industry: 'restaurants',
    year: '2024',
    services: ['Website Development', 'Local SEO', 'Branding'],
    excerpt:
      'Rebuilt the identity and site around the kitchen, then made the whole thing findable.',
    challenge:
      'SeaKing had a loyal weekend crowd and almost no weekday trade. The site was a single-page template with a PDF menu that took eleven seconds to open on mobile, and the restaurant did not appear in the map pack for any of the searches that mattered locally. Reservations arrived through three different WhatsApp numbers and were tracked in a paper diary.',
    solution:
      'We rebuilt the brand around the kitchen rather than the seafood clichés, then shipped a fast, image-led site with a live menu, an integrated reservation flow and structured data on every dish. Local SEO ran in parallel: profile cleanup, service pages built around genuine local search intent, and a review flow triggered after each visit. Reservations now land in one inbox with automatic confirmations.',
    result:
      'Weekday covers rose 47% within four months and the reservation diary was retired. SeaKing now holds a top-three map pack position for its core searches, and the site loads in under a second on a mid-range phone.',
    metrics: [
      { value: '+47%', label: 'Weekday covers' },
      { value: '0.9s', label: 'Load time' },
      { value: 'Top 3', label: 'Map pack' },
      { value: '+210%', label: 'Direction requests' },
    ],
    palette: ['#0d9499', '#081a3a'],
    featured: true,
    testimonial: {
      quote:
        'We stopped losing bookings to the phone. The site does the work now, and it finally looks like the food we actually serve.',
      author: 'Rashid K.',
      role: 'Owner, SeaKing Restaurant',
    },
  },
  {
    slug: 'seaking-suites',
    client: 'SeaKing Suites',
    title: 'Direct bookings, taken back from the aggregators',
    industry: 'hotels',
    year: '2024',
    services: ['Website Development', 'Business Automation', 'Digital Marketing'],
    excerpt:
      'A booking engine and automation stack that cut commission spend by more than half.',
    challenge:
      'Almost nine in ten bookings came through aggregators, each one costing 18-22% in commission. The property had no booking engine of its own, no way to see availability without calling the front desk, and no follow-up with past guests. Every enquiry was answered manually, often hours late.',
    solution:
      'We built a direct booking experience with live availability, transparent pricing and a two-step checkout, then automated the surrounding operation: instant confirmations, pre-arrival sequences, post-stay review requests and a returning-guest offer that runs itself. A retargeting campaign catches guests who compared on an aggregator and left.',
    result:
      'Direct bookings went from 11% to 38% of total volume in seven months. Commission spend fell by 54%, and the front desk stopped fielding availability calls entirely.',
    metrics: [
      { value: '38%', label: 'Direct bookings' },
      { value: '-54%', label: 'Commission spend' },
      { value: '2min', label: 'Enquiry response' },
      { value: '+31%', label: 'Repeat guests' },
    ],
    palette: ['#36d8ff', '#163055'],
    featured: true,
    testimonial: {
      quote:
        'The commission line on our P&L halved. That alone paid for the project twice over in the first year.',
      author: 'Nazia P.',
      role: 'General Manager, SeaKing Suites',
    },
  },
  {
    slug: 'sadhoo-mandapam',
    client: 'Sadhoo Mandapam',
    title: 'From paper enquiry forms to a qualified pipeline',
    industry: 'events',
    year: '2025',
    services: ['Website Development', 'AI Solutions', 'Business Automation'],
    excerpt:
      'An AI assistant that answers venue questions at midnight and books the serious ones.',
    challenge:
      'A wedding venue receives the same forty questions from every enquiry — capacity, catering rules, parking, dates, tariffs — and most arrive outside office hours. Sadhoo Mandapam was answering them one at a time on WhatsApp, losing enquiries to whoever replied first, and had no record of which dates were actually held.',
    solution:
      'We built an assistant grounded in the venue’s own tariff sheet, policies and availability calendar. It answers the routine forty instantly, in Malayalam or English, then qualifies the enquiry and hands warm ones to the team with a summary attached. Serious enquiries can hold a date and book a site visit without a human touching the thread.',
    result:
      'Enquiry-to-site-visit conversion nearly doubled, and the team now spends its time on the enquiries that convert rather than the ones asking about parking.',
    metrics: [
      { value: '68%', label: 'Enquiries deflected' },
      { value: '1.9×', label: 'Visit conversion' },
      { value: '24/7', label: 'Coverage' },
      { value: '-70%', label: 'Admin hours' },
    ],
    palette: ['#12c7c7', '#05111f'],
    featured: true,
    testimonial: {
      quote:
        'It answers at two in the morning better than we answered at two in the afternoon.',
      author: 'Sudheer M.',
      role: 'Partner, Sadhoo Mandapam',
    },
  },
  {
    slug: 'aurea-clinic',
    client: 'Aurea Skin Clinic',
    title: 'A booking flow patients complete on the first try',
    industry: 'clinics',
    year: '2025',
    services: ['Website Development', 'Local SEO'],
    excerpt:
      'Rebuilt around one question: how quickly can someone book the right consultation?',
    challenge:
      'The clinic’s booking form asked for nineteen fields before showing a single available slot. Two-thirds of people who started it never finished, and the ones who did frequently booked the wrong treatment.',
    solution:
      'We rebuilt the flow around treatment first, slot second, details last — three screens, six fields, availability visible immediately. Each treatment got a genuine page explaining who it suits and who it does not, which cut mis-booked consultations sharply.',
    result:
      'Form completion rose from 34% to 79%, and the front desk now spends far less time rescheduling people into the right appointment.',
    metrics: [
      { value: '79%', label: 'Form completion' },
      { value: '+140%', label: 'Online bookings' },
      { value: '-60%', label: 'Mis-bookings' },
    ],
    palette: ['#6ae6e8', '#21447c'],
    featured: false,
  },
  {
    slug: 'meridian-label',
    client: 'Meridian Label',
    title: 'A fashion brand that reads as premium on a phone',
    industry: 'fashion',
    year: '2025',
    services: ['Branding', 'Website Development', 'Digital Marketing'],
    excerpt:
      'Editorial storefront, honest photography direction, and a checkout that gets out of the way.',
    challenge:
      'Meridian sold well in person and poorly online. The storefront was a stock theme where every product photo fought the interface, and the brand had no consistent voice across its channels.',
    solution:
      'A restrained identity system, a photography direction the in-house team could actually execute, and an editorial storefront where the product is the only thing competing for attention. Checkout was cut to two steps.',
    result:
      'Online revenue grew 3.1× year on year, with average order value up 22% as customers moved into higher-priced pieces.',
    metrics: [
      { value: '3.1×', label: 'Online revenue' },
      { value: '+22%', label: 'Order value' },
      { value: '-45%', label: 'Cart abandonment' },
    ],
    palette: ['#2fd2d6', '#0f172a'],
    featured: false,
  },
  {
    slug: 'northfield-academy',
    client: 'Northfield Academy',
    title: 'Admissions, without the spreadsheet',
    industry: 'education',
    year: '2025',
    services: ['Business Automation', 'Website Development'],
    excerpt: 'One pipeline from enquiry to enrolment, visible to everyone who needs it.',
    challenge:
      'Admissions ran across four spreadsheets, two inboxes and a WhatsApp group. Nobody could say how many applications were in progress, and families were being chased twice or not at all.',
    solution:
      'A single application pipeline with stage tracking, automated document collection and reminder sequences, plus a parent-facing status page so families stop calling to ask where things stand.',
    result:
      'Application-to-enrolment conversion improved 34%, and the admissions team cut roughly fifteen hours a week of follow-up.',
    metrics: [
      { value: '+34%', label: 'Enrolment rate' },
      { value: '15h', label: 'Saved weekly' },
      { value: '1', label: 'Source of truth' },
    ],
    palette: ['#386eb6', '#081a3a'],
    featured: false,
  },
];

export const featuredCaseStudies = caseStudies.filter((study) => study.featured);

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

import type { CaseStudy } from '@/types';

/**
 * ILLUSTRATIVE SCENARIOS — NOT DELIVERED CLIENT WORK.
 *
 * These describe how we approach problems that recur in each industry, using
 * anonymised composite examples. The figures are target outcomes that the
 * approach is designed to move, not results measured for a named client.
 *
 * Every surface that renders this data also renders `illustrativeNotice`
 * below, so a visitor is never left to assume these are delivered projects.
 * When real engagements complete, replace an entry wholesale — name the
 * client only with their written permission, and only with measured numbers.
 */

/** Shown wherever case studies appear. Keep it plain and unmissable. */
export const illustrativeNotice =
  'Illustrative scenarios showing how we approach each industry. These are not delivered client projects, and the figures are targets rather than measured results.';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'coastal-restaurant',
    client: 'Coastal seafood restaurant',
    title: 'Filling the weekday tables, not just the weekend ones',
    industry: 'restaurants',
    year: 'Scenario',
    services: ['Website Development', 'Local SEO', 'Branding'],
    excerpt:
      'Rebuild the identity and site around the kitchen, then make the whole thing findable.',
    challenge:
      'A restaurant with a loyal weekend crowd and almost no weekday trade. The site is a single-page template with a PDF menu that takes eleven seconds to open on a phone, and the business appears nowhere in the map pack for the searches that actually carry intent locally. Reservations arrive across three different WhatsApp numbers and are tracked in a paper diary.',
    solution:
      'Rebuild the brand around the kitchen rather than the seafood clichés, then ship a fast, image-led site with a live menu, an integrated reservation flow and structured data on every dish. Local SEO runs in parallel: profile cleanup, service pages built around genuine local search intent, and a review flow triggered after each visit. Reservations land in one inbox with automatic confirmations.',
    result:
      'The targets this approach is built to hit: weekday covers up within a season, the paper diary retired, a top-three map pack position for core local searches, and a site that loads in under a second on a mid-range phone.',
    metrics: [
      { value: '+40%', label: 'Weekday covers' },
      { value: '<1s', label: 'Load time' },
      { value: 'Top 3', label: 'Map pack' },
      { value: '+150%', label: 'Direction requests' },
    ],
    palette: ['#0d9499', '#081a3a'],
    featured: true,
  },
  {
    slug: 'boutique-hotel',
    client: 'Boutique hotel',
    title: 'Taking bookings back from the aggregators',
    industry: 'hotels',
    year: 'Scenario',
    services: ['Website Development', 'Business Automation', 'Digital Marketing'],
    excerpt:
      'A booking engine and automation stack built to cut commission spend by more than half.',
    challenge:
      'Almost nine in ten bookings arrive through aggregators, each costing 18–22% in commission. The property has no booking engine of its own, no way to see availability without calling the front desk, and no follow-up with past guests. Every enquiry is answered by hand, often hours late.',
    solution:
      'Build a direct booking experience with live availability, transparent pricing and a two-step checkout, then automate the surrounding operation: instant confirmations, pre-arrival sequences, post-stay review requests and a returning-guest offer that runs itself. A retargeting campaign catches guests who compared on an aggregator and left.',
    result:
      'The approach targets a direct-booking share in the mid-thirties within a year, roughly halving commission spend, and a front desk that no longer fields availability calls.',
    metrics: [
      { value: '35%', label: 'Direct bookings' },
      { value: '-50%', label: 'Commission spend' },
      { value: '2min', label: 'Enquiry response' },
      { value: '+30%', label: 'Repeat guests' },
    ],
    palette: ['#36d8ff', '#163055'],
    featured: true,
  },
  {
    slug: 'wedding-venue',
    client: 'Wedding venue',
    title: 'From paper enquiry forms to a qualified pipeline',
    industry: 'events',
    year: 'Scenario',
    services: ['Website Development', 'AI Solutions', 'Business Automation'],
    excerpt:
      'An assistant that answers venue questions at midnight and books the serious enquiries.',
    challenge:
      'A wedding venue receives the same forty questions from every enquiry — capacity, catering rules, parking, dates, tariffs — and most arrive outside office hours. They are answered one at a time on WhatsApp, enquiries are lost to whoever replies first, and there is no record of which dates are actually held.',
    solution:
      'Build an assistant grounded in the venue’s own tariff sheet, policies and availability calendar. It answers the routine forty instantly, in Malayalam or English, then qualifies the enquiry and hands warm ones to the team with a summary attached. Serious enquiries can hold a date and book a site visit without a human touching the thread.',
    result:
      'The approach targets a large majority of routine questions handled automatically, and enquiry-to-site-visit conversion close to doubling, so the team spends its hours on enquiries that convert.',
    metrics: [
      { value: '60%+', label: 'Enquiries deflected' },
      { value: '1.8×', label: 'Visit conversion' },
      { value: '24/7', label: 'Coverage' },
      { value: '-60%', label: 'Admin hours' },
    ],
    palette: ['#12c7c7', '#05111f'],
    featured: true,
  },
  {
    slug: 'skin-clinic',
    client: 'Skin clinic',
    title: 'A booking flow patients complete on the first try',
    industry: 'clinics',
    year: 'Scenario',
    services: ['Website Development', 'Local SEO'],
    excerpt:
      'Rebuilt around one question: how quickly can someone book the right consultation?',
    challenge:
      'A booking form that asks for nineteen fields before showing a single available slot. Most people who start it never finish, and the ones who do frequently book the wrong treatment.',
    solution:
      'Rebuild the flow around treatment first, slot second, details last — three screens, six fields, availability visible immediately. Each treatment gets a genuine page explaining who it suits and who it does not, which cuts mis-booked consultations sharply.',
    result:
      'The approach targets form completion in the high seventies and materially fewer appointments that have to be rescheduled into the right slot.',
    metrics: [
      { value: '75%+', label: 'Form completion' },
      { value: '+120%', label: 'Online bookings' },
      { value: '-50%', label: 'Mis-bookings' },
    ],
    palette: ['#6ae6e8', '#21447c'],
    featured: false,
  },
  {
    slug: 'fashion-label',
    client: 'Fashion label',
    title: 'A storefront that reads as premium on a phone',
    industry: 'fashion',
    year: 'Scenario',
    services: ['Branding', 'Website Development', 'Digital Marketing'],
    excerpt:
      'Editorial storefront, honest photography direction, and a checkout that gets out of the way.',
    challenge:
      'A label that sells well in person and poorly online. The storefront is a stock theme where every product photo fights the interface, and the brand has no consistent voice across its channels.',
    solution:
      'A restrained identity system, a photography direction the in-house team can actually execute, and an editorial storefront where the product is the only thing competing for attention. Checkout cut to two steps.',
    result:
      'The approach targets a multiple on online revenue year over year, with average order value rising as customers move into higher-priced pieces.',
    metrics: [
      { value: '2.5×', label: 'Online revenue' },
      { value: '+20%', label: 'Order value' },
      { value: '-40%', label: 'Cart abandonment' },
    ],
    palette: ['#2fd2d6', '#0f172a'],
    featured: false,
  },
  {
    slug: 'private-academy',
    client: 'Private academy',
    title: 'Admissions, without the spreadsheet',
    industry: 'education',
    year: 'Scenario',
    services: ['Business Automation', 'Website Development'],
    excerpt: 'One pipeline from enquiry to enrolment, visible to everyone who needs it.',
    challenge:
      'Admissions running across four spreadsheets, two inboxes and a WhatsApp group. Nobody can say how many applications are in progress, and families are chased twice or not at all.',
    solution:
      'A single application pipeline with stage tracking, automated document collection and reminder sequences, plus a parent-facing status page so families stop calling to ask where things stand.',
    result:
      'The approach targets a meaningful lift in application-to-enrolment conversion and roughly fifteen hours a week of follow-up removed from the admissions team.',
    metrics: [
      { value: '+30%', label: 'Enrolment rate' },
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

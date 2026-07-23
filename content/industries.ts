import {
  Building2,
  GraduationCap,
  HeartPulse,
  PartyPopper,
  Shirt,
  UtensilsCrossed,
} from 'lucide-react';
import type { Industry } from '@/types';

export const industries: Industry[] = [
  {
    slug: 'restaurants',
    name: 'Restaurants',
    icon: UtensilsCrossed,
    headline: 'Fill the weekday tables, not just the weekend ones',
    description:
      'Restaurants rarely have a demand problem on Saturday. They have a discovery problem on Tuesday. We build the site, the local presence and the reservation flow that turn a search into a booked table.',
    painPoints: [
      'PDF menus nobody opens on mobile',
      'Bookings spread across three WhatsApp numbers',
      'Invisible in the map pack for local searches',
      'No way to bring a first-time diner back',
    ],
    solutions: [
      'Live menus with dish-level structured data',
      'One reservation inbox with automatic confirmations',
      'Local SEO built around genuine search intent',
      'Post-visit review and return-offer flows',
    ],
  },
  {
    slug: 'hotels',
    name: 'Hotels & Stays',
    icon: Building2,
    headline: 'Take your bookings back from the aggregators',
    description:
      'Every booking that arrives through an aggregator costs you a fifth of the room rate. A direct channel that guests actually prefer is the highest-return project most properties can run.',
    painPoints: [
      '18-22% commission on nearly every booking',
      'No live availability outside the front desk',
      'Enquiries answered hours after they arrive',
      'Past guests never contacted again',
    ],
    solutions: [
      'Direct booking engine with live availability',
      'Instant confirmations and pre-arrival sequences',
      'Retargeting for guests who compared and left',
      'Returning-guest offers that run themselves',
    ],
  },
  {
    slug: 'clinics',
    name: 'Clinics & Healthcare',
    icon: HeartPulse,
    headline: 'Appointments booked correctly, the first time',
    description:
      'Most clinic websites lose patients in the booking form and then spend staff time fixing the appointments that do come through. Both problems have the same fix.',
    painPoints: [
      'Long booking forms with high abandonment',
      'Patients booking the wrong consultation',
      'Phone lines tied up with routine questions',
      'No structured follow-up or recall',
    ],
    solutions: [
      'Three-step booking with availability shown upfront',
      'Honest treatment pages that pre-qualify patients',
      'Assistants that answer the routine questions',
      'Automated reminders, recalls and follow-ups',
    ],
  },
  {
    slug: 'fashion',
    name: 'Fashion & Retail',
    icon: Shirt,
    headline: 'A storefront that does not fight the product',
    description:
      'Premium products sold through a stock theme read as mid-market. The interface should disappear and let the photography carry the brand.',
    painPoints: [
      'Templates that flatten a premium product',
      'Inconsistent voice across web and social',
      'Checkout friction killing conversion',
      'No repeat-purchase mechanic',
    ],
    solutions: [
      'Editorial storefronts built around the imagery',
      'A brand system your team can execute in-house',
      'Two-step checkout with wallet payments',
      'Lifecycle campaigns that bring buyers back',
    ],
  },
  {
    slug: 'events',
    name: 'Events & Venues',
    icon: PartyPopper,
    headline: 'Answer the routine forty questions automatically',
    description:
      'Venue enquiries are remarkably repetitive and overwhelmingly out of hours. Whoever replies first usually wins the booking, which makes this the clearest AI use case we work on.',
    painPoints: [
      'The same capacity and tariff questions, endlessly',
      'Enquiries arriving at midnight, answered at ten',
      'No record of which dates are actually held',
      'Losing bookings to faster competitors',
    ],
    solutions: [
      'Assistants grounded in your tariffs and policies',
      'Instant multilingual replies, day or night',
      'Date holds and site visits booked without staff',
      'Qualified enquiries handed over with a summary',
    ],
  },
  {
    slug: 'education',
    name: 'Education',
    icon: GraduationCap,
    headline: 'One admissions pipeline everyone can see',
    description:
      'Admissions usually runs across spreadsheets, inboxes and a group chat. The cost is not just staff time — it is the families who quietly drop out of a process nobody was tracking.',
    painPoints: [
      'Applications scattered across four systems',
      'Families chased twice, or not at all',
      'No visibility into pipeline stage or volume',
      'Document collection done entirely by hand',
    ],
    solutions: [
      'A single pipeline from enquiry to enrolment',
      'Automated document collection and reminders',
      'Parent-facing status pages that cut inbound calls',
      'Reporting that shows where applicants drop out',
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

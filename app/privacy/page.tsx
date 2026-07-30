import { siteConfig } from '@/constants/site';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/shared/page-hero';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How Reshi AI collects, uses and protects the personal information you share with us.',
  path: '/privacy',
});

/**
 * NOTE: this is a reasonable starting draft, not legal advice. Have it
 * reviewed against the DPDP Act and GDPR before launch if you take enquiries
 * from the EU.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated 22 July 2026."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content">
          <div className="prose-article">
            <h2>What we collect</h2>
            <p>
              When you submit our contact form we collect your name, email address and any
              company, phone number, budget range and project details you choose to
              provide. When you subscribe to our newsletter we collect your email address.
              We do not collect anything else about you directly.
            </p>

            <h2>Why we collect it</h2>
            <p>
              To reply to your enquiry, to prepare a proposal, and — if you subscribed —
              to email you when we publish something worth reading. That is the complete
              list. We do not sell your information, and we do not share it with third
              parties for their own marketing.
            </p>

            <h2>Analytics</h2>
            <p>
              We measure aggregate traffic to understand which pages are useful. This data
              is not used to identify you individually, and we do not run advertising or
              cross-site tracking pixels on this website.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Enquiries are retained for as long as we have an active or prospective
              relationship, and for up to three years afterwards for our own records.
              Newsletter subscriptions are kept until you ask us to remove you — email us
              and we will delete your address.
            </p>

            <h2>Your rights</h2>
            <p>
              You can ask us for a copy of what we hold about you, ask us to correct it,
              or ask us to delete it. Email{' '}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>{' '}
              and we will respond within thirty days. You do not need to give a reason.
            </p>

            <h2>Security</h2>
            <p>
              Data is transmitted over encrypted connections and stored with reputable
              providers. No system is perfectly secure, and we will not claim otherwise —
              but we do not retain anything we do not need, which is the most reliable
              protection available.
            </p>

            <h2>Cookies</h2>
            <p>
              This website uses only the cookies required for it to function. We do not
              set advertising or profiling cookies.
            </p>

            <h2>Changes</h2>
            <p>
              If this policy changes materially we will update the date at the top of this
              page. Continued use of the website after a change means you accept the
              revised policy.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy can go to{' '}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
              , or by post to {siteConfig.legalName}, {siteConfig.address.locality},{' '}
              {siteConfig.address.region}, {siteConfig.address.countryName}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

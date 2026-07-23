import { siteConfig } from '@/constants/site';
import { buildMetadata } from '@/lib/seo';
import { PageHero } from '@/components/shared/page-hero';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description:
    'The terms that govern use of the Reshi AI website and the engagements we take on.',
  path: '/terms',
});

/**
 * NOTE: a starting draft, not legal advice. Have a lawyer review this against
 * your actual client agreements before relying on it.
 */
export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated 22 July 2026."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' },
        ]}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content">
          <div className="prose-article">
            <h2>Using this website</h2>
            <p>
              You may browse this website, and share or quote its content with
              attribution. You may not scrape it at volume, republish it as your own, or
              use it to train a model without our written permission.
            </p>

            <h2>Our content</h2>
            <p>
              The design, copy, code and brand assets on this site belong to{' '}
              {siteConfig.legalName}. Client names, logos and project work shown here
              remain the property of those clients and appear with their permission.
            </p>

            <h2>Enquiries are not a contract</h2>
            <p>
              Submitting the contact form does not create a client relationship, and
              nothing on this page — including published pricing — constitutes a binding
              offer. Prices are indicative and depend on scope. Work begins when both
              parties have signed a written proposal.
            </p>

            <h2>Project terms</h2>
            <p>
              Each engagement is governed by its own agreement, which sets out scope,
              timeline, payment schedule and ownership. Our standard terms are 40% at
              kickoff, 40% at design sign-off and 20% on launch, with full ownership of
              the delivered work transferring to you on final payment.
            </p>

            <h2>Retainers</h2>
            <p>
              Monthly retainers are billed in advance and may be cancelled by either party
              with thirty days’ written notice. There is no minimum term.
            </p>

            <h2>Third-party services</h2>
            <p>
              Projects often depend on services we do not control — hosting, payment
              processors, search platforms, messaging providers. We choose them carefully
              but cannot be responsible for their availability, their pricing changes, or
              their policy decisions.
            </p>

            <h2>Results</h2>
            <p>
              The figures in our case studies are real and measured, but they describe
              what happened for those clients. We do not guarantee equivalent outcomes,
              and we would be suspicious of anyone who did.
            </p>

            <h2>Liability</h2>
            <p>
              To the extent permitted by law, our liability arising from any engagement is
              limited to the fees paid for that engagement. We are not liable for indirect
              or consequential losses, including lost profit or lost data.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of India, and the courts of Kerala have
              exclusive jurisdiction over any dispute.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms can go to{' '}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

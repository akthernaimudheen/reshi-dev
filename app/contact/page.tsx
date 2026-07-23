import { Calendar, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteConfig, whatsappLink } from '@/constants/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { ContactForm } from '@/components/shared/contact-form';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Start a project with Reshi AI. Tell us what you are trying to fix and we will reply within one working day.',
  path: '/contact',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

/** `/contact?plan=growth` pre-selects a sensible service in the form. */
const planToService: Record<string, string> = {
  launch: 'Website Development',
  growth: 'Website Development',
  systems: 'AI Solutions',
};

type PageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const { plan } = await searchParams;
  const defaultService = plan ? planToService[plan] : undefined;

  const channels = [
    {
      icon: Mail,
      label: 'Email',
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      note: 'Replies within one working day',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Message us',
      href: whatsappLink,
      note: 'Fastest for anything urgent',
      external: true,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phone.replace(/\s/g, '')}`,
      note: 'Mon–Fri, 9.30am to 6.30pm IST',
    },
    {
      icon: Calendar,
      label: 'Book a call',
      value: '30-minute intro',
      href: siteConfig.contact.calendly,
      note: 'Pick a slot that suits you',
      external: true,
    },
  ];

  return (
    <>
      <JsonLd data={[localBusinessSchema(), breadcrumbSchema(breadcrumbs)]} />

      <PageHero
        eyebrow="Contact"
        title="Tell us what is not working."
        description="The more specific you are, the more useful our first reply will be. A real person reads every enquiry — there is no sales team here to route you through."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <Reveal>
            <div className="rounded-hero border border-line bg-surface-raised p-8 shadow-sm lg:p-10">
              <ContactForm defaultService={defaultService} />
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">
            <Reveal delay={0.1}>
              <ul className="flex flex-col gap-px overflow-hidden rounded-panel border border-line bg-line">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <li key={channel.label}>
                      <a
                        href={channel.href}
                        {...(channel.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="group flex items-start gap-4 bg-surface-raised p-6 transition-colors duration-300 hover:bg-surface-sunken"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-card bg-navy-900 text-cyan-400">
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-xs tracking-wide text-ink-muted uppercase">
                            {channel.label}
                          </span>
                          <span className="font-semibold text-navy-900">
                            {channel.value}
                          </span>
                          <span className="text-sm text-ink-muted">{channel.note}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="flex flex-col gap-4 rounded-panel border border-line bg-surface-raised p-6">
                <span className="flex items-center gap-2.5 text-sm font-semibold text-navy-900">
                  <MapPin aria-hidden="true" className="size-4 text-cyan-600" />
                  Where we are
                </span>

                {/* Static map placeholder. An embedded iframe here would cost
                    ~700kb and a third-party cookie on a page whose only job is
                    to load fast — wire up a real map only if it earns its
                    weight. */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-navy-900">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-grid-dark opacity-70"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="flex flex-col items-center gap-2">
                      <span className="relative grid size-10 place-items-center">
                        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30" />
                        <span className="relative size-3 rounded-full bg-cyan-400" />
                      </span>
                      <span className="text-sm font-medium text-ink-inverse">
                        {siteConfig.address.locality}, {siteConfig.address.region}
                      </span>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-ink-muted">
                  We work remotely with clients across India and the Gulf. Happy to meet
                  in person if you are nearby.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

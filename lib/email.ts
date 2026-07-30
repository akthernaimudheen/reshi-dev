import { Resend } from 'resend';
import type { ContactInput } from '@/lib/validations';

/**
 * Email delivery via Resend.
 *
 * All three environment variables are required:
 *   RESEND_API_KEY     — from Resend.
 *   CONTACT_TO_EMAIL   — where enquiries and signup notices land.
 *   CONTACT_FROM_EMAIL — a sender on a domain verified in Resend.
 *
 * The functions below never throw. Their callers return a failure response
 * when delivery is not configured or the provider rejects the message, so a
 * visitor is never shown a false success state.
 */

type DeliveryResult =
  | { delivered: true }
  | { delivered: false; reason: 'not-configured' | 'error'; detail?: string };

type EmailConfig = {
  client: Resend;
  from: string;
  to: string;
};

/** Lazily constructed so missing configuration does not crash the site. */
function getConfig(): EmailConfig | null {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();

  if (!key || !from || !to) return null;
  return { client: new Resend(key), from, to };
}

/** Minimal HTML escape — enquiry fields are user input rendered into email. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Notify the studio of a new enquiry, and set `replyTo` to the sender so a
 * reply from the inbox goes straight back to the prospect.
 */
export async function sendContactNotification(
  enquiry: Omit<ContactInput, 'website'>,
): Promise<DeliveryResult> {
  const config = getConfig();
  if (!config) return { delivered: false, reason: 'not-configured' };

  const rows: [string, string | undefined][] = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Company', enquiry.company],
    ['Phone', enquiry.phone],
    ['Service', enquiry.service],
    ['Budget', enquiry.budget],
  ];

  const rowsHtml = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#64748b;font-size:14px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#0f172a;font-size:14px">${escapeHtml(value!)}</td></tr>`,
    )
    .join('');

  const html = `
    <div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#081a3a;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <span style="color:#36d8ff;font-size:12px;letter-spacing:0.16em;text-transform:uppercase">New enquiry</span>
        <h1 style="color:#f8fbfc;font-size:20px;margin:6px 0 0">${escapeHtml(enquiry.name)} · ${escapeHtml(enquiry.service)}</h1>
      </div>
      <table style="border-collapse:collapse;width:100%;margin-bottom:20px">${rowsHtml}</table>
      <div style="border-top:1px solid #e2eaf0;padding-top:16px">
        <p style="color:#64748b;font-size:14px;margin:0 0 6px">Message</p>
        <p style="color:#0f172a;font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0">${escapeHtml(enquiry.message)}</p>
      </div>
    </div>`;

  try {
    const { error } = await config.client.emails.send({
      from: config.from,
      to: config.to,
      replyTo: enquiry.email,
      subject: `New enquiry — ${enquiry.name} (${enquiry.service})`,
      html,
    });
    if (error) return { delivered: false, reason: 'error', detail: error.message };
    return { delivered: true };
  } catch (error) {
    return {
      delivered: false,
      reason: 'error',
      detail: error instanceof Error ? error.message : 'unknown',
    };
  }
}

/** Notify the studio of a newsletter signup. */
export async function sendNewsletterNotification(email: string): Promise<DeliveryResult> {
  const config = getConfig();
  if (!config) return { delivered: false, reason: 'not-configured' };

  try {
    const { error } = await config.client.emails.send({
      from: config.from,
      to: config.to,
      replyTo: email,
      subject: `Newsletter signup — ${email}`,
      html: `<p style="font-family:-apple-system,Segoe UI,sans-serif;font-size:15px;color:#0f172a">New newsletter subscriber: <strong>${escapeHtml(email)}</strong></p>`,
    });
    if (error) return { delivered: false, reason: 'error', detail: error.message };
    return { delivered: true };
  } catch (error) {
    return {
      delivered: false,
      reason: 'error',
      detail: error instanceof Error ? error.message : 'unknown',
    };
  }
}

# Email delivery setup (Resend)

The contact and newsletter forms return **HTTP 503** until all three variables below
are set and valid. That is deliberate: a visitor is never shown "message sent" when
nothing was delivered.

---

## 1. Verify a sending domain

You cannot send from an unverified domain. Resend will reject the message and the
form will 503.

1. Sign in at [resend.com](https://resend.com) → **Domains** → **Add Domain**.
2. Enter your domain (e.g. `reshi.ai`).
3. Resend shows a set of DNS records — typically:
   - a `TXT` record for **SPF**
   - one or more `CNAME`/`TXT` records for **DKIM**
   - optionally a `TXT` record for **DMARC**
4. Add each record at whichever registrar/DNS host controls the domain.
5. Back in Resend, press **Verify**. Propagation is usually minutes, occasionally
   up to a few hours.

**Do not skip to production without this.** An unverified domain is the single most
common cause of "the form says error and I don't know why".

### Testing before your domain is verified

Resend provides `onboarding@resend.dev` as a sandbox sender. Important limitation:
it can **only deliver to the email address that owns the Resend account**. Useful
for a first end-to-end test, useless for real traffic.

```
CONTACT_FROM_EMAIL="Reshi AI <onboarding@resend.dev>"
CONTACT_TO_EMAIL=your-resend-account-email@example.com
```

---

## 2. Create an API key

Resend → **API Keys** → **Create API Key**.

- Permission: **Sending access** is sufficient. Do not grant full access.
- Copy the key immediately — Resend shows it exactly once.

Treat it like a password. It is a live credential that can send mail as your domain.

---

## 3. Create `.env.local`

In the project root, create a file named exactly `.env.local`:

```
RESEND_API_KEY=re_your_key_here
CONTACT_FROM_EMAIL="Reshi AI <noreply@reshi.ai>"
CONTACT_TO_EMAIL=hello@reshi.ai
```

Notes:

- `.env.local` is already covered by `.gitignore` (`.env*.local`). Never commit it.
- `CONTACT_FROM_EMAIL` **must** be on the domain you verified in step 1.
- The `"Name <address>"` form is optional but gives a nicer sender label.
- Restart the dev server after creating or editing this file — Next.js only reads
  env files at startup.

---

## 4. Verify it works

```bash
npm run dev
```

Then submit the contact form at `/contact`. Expected:

- **Success** → the studio inbox (`CONTACT_TO_EMAIL`) receives "New enquiry — …",
  and replying goes to the visitor, because `replyTo` is set to their address.
- **Failure** → the form shows an error and the server log prints
  `[contact] delivery failed` with a reason. It never shows a false success.

---

## Production

Set the same three variables in your host's environment settings (on Vercel:
Project → Settings → Environment Variables). `.env.local` is local-only and is not
deployed.

---

## What the newsletter form actually does

Be precise about this, because the wording on the site depends on it.

**Implemented:** the signup emails a notification to `CONTACT_TO_EMAIL`. You learn
that someone subscribed, and you can reply to them directly.

**Not implemented:**

- No subscriber is added to any audience or list.
- No confirmation / double opt-in email is sent to the subscriber.
- There is no unsubscribe link or automated unsubscribe handling.

The site copy has been kept consistent with that reality — it does not promise
confirmation emails or one-click unsubscribe. If you want those, the honest path is
to add a real newsletter platform (Resend Audiences, Mailchimp, Buttondown) and
implement double opt-in before making the claim.

Marketing email to recipients who never confirmed, with no unsubscribe mechanism,
is also a compliance problem under GDPR/CAN-SPAM if you ever mail this list.

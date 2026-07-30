/**
 * End-to-end verification for the contact and newsletter endpoints.
 *
 * Exercises every branch that matters and reports pass/fail per case. It does
 * NOT read or print RESEND_API_KEY — it only observes HTTP behaviour, so it is
 * safe to run and safe to paste output from.
 *
 * Usage, with the dev server already running:
 *   node scripts/verify-email.mjs [baseUrl]
 *
 * Default baseUrl is http://localhost:4000.
 *
 * Note: the contact endpoint rate-limits to 5 requests/minute per IP. This
 * script sends 4 contact requests, staying inside that budget.
 */

const BASE = process.argv[2] ?? 'http://localhost:4000';

const results = [];

function record(name, passed, detail) {
  results.push({ name, passed, detail });
  const tag = passed === true ? 'PASS' : passed === false ? 'FAIL' : 'SKIP';
  console.log(`${tag}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function post(path, body) {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, json };
}

const stamp = Date.now();

// A payload that satisfies contactSchema: message must be >= 20 chars.
const validContact = {
  name: 'Verification Test',
  email: `verify+${stamp}@example.com`,
  company: 'Reshi AI QA',
  phone: '+91 90000 00000',
  service: 'AI Solutions',
  budget: 'Not sure yet',
  message:
    'Automated end-to-end verification of the contact endpoint. Please ignore this message.',
  website: '',
};

console.log(`\nVerifying against ${BASE}\n${'-'.repeat(56)}`);

// --- 1. Invalid payloads must be rejected with 400 --------------------------
{
  const { status } = await post('/api/contact', {
    name: 'A',
    email: 'not-an-email',
    service: '',
    message: 'short',
  });
  record('contact: invalid payload → 400', status === 400, `got ${status}`);
}

{
  const { status } = await post('/api/newsletter', { email: 'not-an-email' });
  record('newsletter: invalid email → 400', status === 400, `got ${status}`);
}

// --- 2. Honeypot must return 200 and send nothing ---------------------------
{
  const { status, json } = await post('/api/contact', {
    ...validContact,
    email: `bot+${stamp}@example.com`,
    website: 'http://spam.example',
  });
  const passed = status === 200 && json?.ok === true;
  record(
    'contact: honeypot → 200, no email sent',
    passed,
    `got ${status}; confirm no email arrived for bot+${stamp}@example.com`,
  );
}

// --- 3. Valid submissions -------------------------------------------------
// 503 => delivery unavailable/rejected (key missing, domain unverified, etc.)
// 200 => delivered; the inbox check below is a MANUAL step.
let contactDelivered = false;
{
  const { status, json } = await post('/api/contact', validContact);
  if (status === 200 && json?.ok === true) {
    contactDelivered = true;
    record('contact: valid enquiry → 200 delivered', true, 'check inbox');
  } else if (status === 503) {
    record(
      'contact: valid enquiry → delivery unavailable (503)',
      null,
      'expected until RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL are set and the domain is verified',
    );
  } else {
    record('contact: valid enquiry', false, `unexpected status ${status}`);
  }
}

{
  const { status, json } = await post('/api/newsletter', {
    email: `verify-news+${stamp}@example.com`,
  });
  if (status === 200 && json?.ok === true) {
    record('newsletter: valid signup → 200 delivered', true, 'check inbox');
  } else if (status === 503) {
    record('newsletter: valid signup → delivery unavailable (503)', null, 'same cause');
  } else {
    record('newsletter: valid signup', false, `unexpected status ${status}`);
  }
}

// --- 4. Rate limit still enforced ------------------------------------------
{
  // The limit is 5 requests/minute per IP and this script has already spent
  // part of that budget, so keep sending until a 429 appears rather than
  // assuming a fixed remaining count. Any 429 within a small burst proves the
  // limiter is active; never seeing one across 8 tries means it is not.
  let tripped = false;
  let lastStatus = 0;
  for (let i = 0; i < 8 && !tripped; i += 1) {
    const { status } = await post('/api/contact', {
      ...validContact,
      email: `rate+${stamp}-${i}@example.com`,
    });
    lastStatus = status;
    tripped = status === 429;
  }
  record(
    'contact: rate limit → 429',
    tripped,
    tripped ? 'limiter active' : `never tripped, last status ${lastStatus}`,
  );
}

// --- Summary ---------------------------------------------------------------
const failed = results.filter((r) => r.passed === false);
const skipped = results.filter((r) => r.passed === null);

console.log('-'.repeat(56));
console.log(
  `${results.filter((r) => r.passed === true).length} passed, ` +
    `${failed.length} failed, ${skipped.length} pending configuration`,
);

if (contactDelivered) {
  console.log(
    '\nMANUAL CHECKS still required:\n' +
      '  1. The enquiry arrived at CONTACT_TO_EMAIL.\n' +
      `  2. Reply-To on that email is verify+${stamp}@example.com (the visitor).\n` +
      '  3. The newsletter notification arrived.\n' +
      `  4. NOTHING arrived for bot+${stamp}@example.com (honeypot).`,
  );
}

if (skipped.length > 0) {
  console.log('\nSee docs/email-setup.md to configure delivery, then re-run.');
}

process.exit(failed.length > 0 ? 1 : 0);

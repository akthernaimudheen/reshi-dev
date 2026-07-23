import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * Security headers. `Content-Security-Policy` is intentionally omitted here —
 * Next's inline bootstrap scripts need a per-request nonce, which belongs in
 * middleware rather than a static header.
 */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // An unrelated lockfile sits in the parent directory, so Next's automatic
  // workspace-root inference picks the wrong folder. Pin it to this project.
  outputFileTracingRoot: path.resolve(process.cwd()),

  images: {
    // AVIF first, WebP fallback — both are generated on demand by the optimizer.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    // Tree-shakes barrel imports so a single icon does not pull the whole set.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;

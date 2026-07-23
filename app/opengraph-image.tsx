import { ImageResponse } from 'next/og';
import { siteConfig } from '@/constants/site';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Default social card, generated at build time.
 *
 * Uses system fonts rather than fetching a webfont — an OG image is rendered
 * by crawlers, so an extra network dependency here is a needless failure mode.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        backgroundColor: '#081A3A',
        backgroundImage:
          'radial-gradient(circle at 15% 0%, rgba(18,199,199,0.35), transparent 45%), radial-gradient(circle at 85% 100%, rgba(54,216,255,0.28), transparent 45%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: '#12C7C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 700,
            color: '#05111F',
          }}
        >
          R
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#F8FBFC' }}>Reshi.AI</div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#F8FBFC',
            maxWidth: 900,
          }}
        >
          Websites and systems that turn local businesses into growing brands.
        </div>
        <div style={{ fontSize: 26, color: '#94A8C0' }}>
          Custom websites · Automation · AI · Local SEO
        </div>
      </div>
    </div>,
    size,
  );
}

import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const alt = 'ClawTrace - Make your OpenClaw agents better, cheaper, and faster.';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background:
            'radial-gradient(1200px 500px at 50% -120px, rgba(204, 146, 92, 0.35), transparent 72%), linear-gradient(180deg, #f9f1ea 0%, #f3e8dd 100%)',
          color: '#2f2016',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
        }}
      >
        <div
          style={{
            fontSize: 38,
            letterSpacing: '-0.02em',
            fontWeight: 600,
          }}
        >
          ClawTrace
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            Make your OpenClaw agents better, cheaper, and faster.
          </div>
          <div
            style={{
              fontSize: 34,
              color: '#5e4233',
              letterSpacing: '-0.015em',
            }}
          >
            See what failed, where spend leaked, and what to fix first.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

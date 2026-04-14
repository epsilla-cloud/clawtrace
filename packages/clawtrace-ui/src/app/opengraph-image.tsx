import { readFileSync } from 'fs';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const alt = 'ClawTrace - Make your OpenClaw agents better, cheaper, and faster.';

export default function OpenGraphImage() {
  const logoData = readFileSync(join(process.cwd(), 'public', 'clawtrace-logo.png'));
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  const screenshotData = readFileSync(join(process.cwd(), '..', '..', 'screenshots', 'Landing.png'));
  const screenshotSrc = `data:image/png;base64,${screenshotData.toString('base64')}`;

  const BANNER_H = 110;
  const SCREENSHOT_H = size.height - BANNER_H;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#f9f1ea',
          overflow: 'hidden',
        }}
      >
        {/* Top banner — logo */}
        <div
          style={{
            height: BANNER_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #f9f1ea 0%, #f0e4d7 100%)',
            borderBottom: '1px solid #dac9b8',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="ClawTrace" height={56} style={{ objectFit: 'contain' }} />
        </div>

        {/* Screenshot */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshotSrc}
            alt="ClawTrace landing page"
            style={{
              width: size.width,
              height: SCREENSHOT_H,
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}

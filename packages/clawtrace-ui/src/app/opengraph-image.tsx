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

  const BG = 'rgb(245, 240, 232)';
  const BANNER_H = 110;
  // Push the screenshot down by a few extra pixels so the top edge of the
  // landing page content isn't clipped by the logo banner.
  const SCREENSHOT_OFFSET = 12;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: BG,
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
            background: BG,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="ClawTrace" height={56} style={{ objectFit: 'contain' }} />
        </div>

        {/* Screenshot — shifted down slightly so landing page content isn't clipped */}
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
              height: size.height - BANNER_H + SCREENSHOT_OFFSET,
              objectFit: 'cover',
              objectPosition: `top ${SCREENSHOT_OFFSET}px`,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}

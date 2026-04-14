import { readFileSync } from 'fs';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const size = {
  width: 2408,
  height: 1420,
};

export const contentType = 'image/png';

export const alt = 'ClawTrace - Make your OpenClaw agents better, cheaper, and faster.';

export default function OpenGraphImage() {
  const screenshotData = readFileSync(join(process.cwd(), '..', '..', 'screenshots', 'Landing.png'));
  const screenshotSrc = `data:image/png;base64,${screenshotData.toString('base64')}`;

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={screenshotSrc} alt="ClawTrace" style={{ width: '100%', height: '100%' }} />
    ),
    size,
  );
}

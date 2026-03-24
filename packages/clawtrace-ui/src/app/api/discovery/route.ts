import { NextResponse } from 'next/server';
import { loadOpenClawDiscoverySnapshot } from '../../../lib/openclaw-discovery';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await loadOpenClawDiscoverySnapshot();
    return NextResponse.json(snapshot, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to load OpenClaw discovery snapshot.',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }
}

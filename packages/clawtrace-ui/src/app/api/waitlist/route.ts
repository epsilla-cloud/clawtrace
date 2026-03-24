import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistPayload = {
  email?: unknown;
  source?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as WaitlistPayload;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const source = typeof body.source === 'string' ? body.source.trim() : 'unknown';

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store' },
        },
      );
    }

    const webhook = process.env.CLAWTRACE_WAITLIST_WEBHOOK_URL;
    if (webhook) {
      const webhookResponse = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!webhookResponse.ok) {
        return NextResponse.json(
          { error: 'Waitlist webhook failed.' },
          {
            status: 502,
            headers: { 'Cache-Control': 'no-store' },
          },
        );
      }
    }

    return NextResponse.json(
      {
        ok: true,
        email,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Waitlist request failed.',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}

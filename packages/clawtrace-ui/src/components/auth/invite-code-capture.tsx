'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function InviteCodeCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('invitecode');
    if (!code) return;
    // Store in a js-accessible cookie (7-day TTL) so OAuth initiation can read it
    document.cookie = `invite_code=${encodeURIComponent(code)}; path=/; max-age=604800; SameSite=Lax`;
    try {
      localStorage.setItem('invite_code', code);
    } catch {
      // localStorage not available (e.g. incognito with storage disabled)
    }
  }, [searchParams]);

  return null;
}

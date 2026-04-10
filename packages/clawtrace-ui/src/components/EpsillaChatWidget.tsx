'use client';

import { useEffect } from 'react';

export function EpsillaChatWidget() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as Record<string, unknown>;
    if (w.__epsillaChatLoaded) return;
    w.__epsillaChatLoaded = true;

    w.AppUrl =
      'chatbot/df6624c1-1c2a-4263-8c10-14f495fc3e7f-355140907/03a96896-2b7a-4cce-8036-9b23974ba54b?mode=embed';
    w.themeColor = '#a4532b';

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://script.epsilla.com/epsilla.js';
    document.head.appendChild(s);
  }, []);

  return null;
}

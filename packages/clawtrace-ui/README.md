# @clawtrace/ui

Standalone Next.js UI package for ClawTrace.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Notes

- Uses the exact token layer from `docs/design-specs/clawtrace.tokens.css`.
- Uses the exact React prop interfaces from `docs/design-specs/clawtrace.interfaces.ts`.
- Designed for standalone ClawTrace launch with portable integration hooks.

## Vercel Deployment

1. Import this repo into Vercel.
2. Set the root directory to `packages/clawtrace-ui`.
3. Build command: `npm run build`
4. Output directory: `.next` (default for Next.js)
5. Set environment variable:
   - `NEXT_PUBLIC_SITE_URL` = your production domain (for canonical URLs, sitemap, and metadata)

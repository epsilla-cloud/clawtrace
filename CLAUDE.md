# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClawTrace is a workflow reliability control room for OpenClaw AI agents — not a metrics dashboard. It helps teams identify failures, cost leaks, and next actions to improve agent reliability.

**Monorepo structure:**
- `packages/clawtrace-ui/` — Next.js 15 frontend (App Router, React 19, Drizzle ORM)
- `services/clawtrace-ingest/` — FastAPI Python ingest service (multi-tenant, cloud-agnostic)
- `plugins/clawtrace/` — OpenClaw npm plugin (`@epsilla/clawtrace`)
- `sql/databricks/silver_tables/` — Lakeflow SQL pipeline (Iceberg on Databricks)

## Development Commands

### Frontend (`packages/clawtrace-ui/`)
```bash
npm run dev          # Dev server on localhost:3000
npm run build        # Production build
npm run typecheck    # TypeScript type check (no emit)
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run pending migrations
npm run db:push      # Push schema to Neon (dev only)
```

### Ingest Service (`services/clawtrace-ingest/`)
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
pytest -q                   # Run all tests
pytest -q tests/test_foo.py # Run a single test file
docker build -t clawtrace-ingest:latest .
docker run --rm -p 8080:8080 --env-file .env clawtrace-ingest:latest
```

### Plugin (`plugins/clawtrace/`)
```bash
npm test          # Run Vitest once
npm run check     # TypeScript type check
```

### SQL Pipeline (`sql/databricks/silver_tables/`)
Run in order via a Lakeflow pipeline (schedule every 1–2 minutes):
1. `10_materialize_silver_tables.sql`
2. `20_validate_silver_tables.sql`

## Architecture

### Data Flow
```
OpenClaw Agent Runtime
  → @epsilla/clawtrace plugin (8 hook types)
  → POST /v1/traces/events (ingest API, Bearer auth)
  → Cloud object storage (GCS/Azure/S3), partitioned by tenant/agent/date/hour
  → Databricks Lakeflow SQL → 8 Iceberg silver tables (pg_agents, pg_traces, pg_spans, etc.)
  → PuppyGraph (graph analytics over silver layer)
  → ClawTrace UI (Next.js API routes → database/graph queries)
```

### Plugin Hooks
The plugin (`plugins/clawtrace/src/tracker.ts`) intercepts: `session_start`, `session_end`, `llm_input`, `llm_output`, `before_tool_call`, `after_tool_call`, `subagent_spawning`, `subagent_ended`. Events are batched and flushed on agent shutdown.

### Ingest Service
`POST /v1/traces/events` authenticates via Bearer token, resolves tenant from token or `x-clawtrace-tenant-id` header, writes JSON to cloud storage at `RAW_PREFIX/tenant={id}/agent={id}/dt=YYYY-MM-DD/hr=HH/event-*.json`. Config in `app/config.py` via Pydantic Settings (auth modes: `mock_pass`, `static_keys`; storage: `gcs`, `azure_blob`, `aws_s3`).

### Frontend
**Core state type**: `ClawTraceTrustState` (healthy, at_risk, drifting, blocked, awaiting_confirmation, partially_verified, control_plane_issue) — defined in `src/lib/types.ts`.

**4-zone layout** managed by `ClawTraceStandalone.tsx`:
1. Global app rail
2. Workflow portfolio (triage)
3. Selected workflow cockpit (command center)
4. Collapsible right-side investigation drawer

Key components in `src/components/clawtrace/`:
- `ClawTraceWorkflowPortfolio` / `ClawTraceWorkflowCard` — triage list
- `ClawTraceWorkflowCockpit` — deep workflow inspection
- `ClawTraceTrustStateBand`, `ClawTracePrimaryActionCard`, `ClawTraceRunStoryTimeline`
- `ClawTraceInvestigationDrawer` — chat/artifact investigation
- `ClawTraceWarmupAuditChat` — onboarding flow

**Database schema** (`src/lib/db/schema.ts`): `users`, `referrals`, `point_transactions`, `point_redemptions` — managed by Drizzle ORM against Neon PostgreSQL.

### Design System
Design tokens and component contracts live in `docs/design-specs/`:
- `clawtrace.tokens.css` — color, typography, spacing, motion tokens
- `CLAWTRACE_ATELIER_COMPONENT_SPEC.md` — build-ready UI contracts
- `clawtrace.interfaces.ts` — canonical React prop interfaces (mirrored in `src/lib/types.ts`)

Core philosophy from `DESIGN.md`: evidence-centered, calm (not alarmist), operationally legible in 5 seconds. Built on the Atelier Operator design language. Desktop-first; mobile is triage-only.

## Deployment
- **UI**: Vercel (`clawtrace.ai`), root dir `packages/clawtrace-ui`, build command `npm run build`
- **Ingest**: Docker + Kubernetes (`services/clawtrace-ingest/k8s/`)
- **Plugin**: Published to npm as `@epsilla/clawtrace`
- **Pipeline**: Databricks Lakeflow, incremental watermark tracking

**IMPORTANT:** After every code change, always commit, push, and deploy to production:
```bash
git add <changed files>
git commit -m "message"
git push
vercel --prod    # run from repo root
```

## Environment Variables
Frontend uses:
- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` — Neon PostgreSQL (pooled vs. direct)
- `KV_*` / `REDIS_URL` — Upstash Redis
- `NEXT_PUBLIC_SITE_URL` — canonical domain
- `VERCEL_OIDC_TOKEN` — Vercel identity

Ingest service uses Pydantic Settings in `app/config.py` — set via `.env` file.

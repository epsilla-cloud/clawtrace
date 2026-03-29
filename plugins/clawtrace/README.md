# ClawTrace OpenClaw Plugin

`clawtrace` is a native OpenClaw plugin that streams runtime hook telemetry
from OpenClaw into the ClawTrace ingest API.

It emits one event per hook call for:

- `session_start`, `session_end`
- `llm_input` -> `llm_before_call`
- `llm_output` -> `llm_after_call`
- `before_tool_call` -> `tool_before_call`
- `after_tool_call` -> `tool_after_call`
- `subagent_spawning` -> `subagent_spawn`
- `subagent_ended` -> `subagent_join`

It also optionally emits explicit `error` events when tool/subagent hooks carry
errors.

## Install

```bash
openclaw plugins install @clawtrace/openclaw-plugin
```

## Configure (interactive)

Run the setup command once after install:

```bash
openclaw clawtrace setup
```

It will prompt for:

- ingest endpoint (defaults to `https://ingest.clawtrace.ai/v1/traces/events`)
- API key (`ct_live_...`) from your ClawTrace SaaS account
- stable agent UUID for this OpenClaw instance

You can also run non-interactively:

```bash
openclaw clawtrace setup \
  --endpoint https://ingest.clawtrace.ai/v1/traces/events \
  --api-key ct_live_prod_xxx \
  --agent-id 8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19 \
  --yes
```

## Configure (manual config file)

Add plugin config to your OpenClaw config:

```json
{
  "plugins": {
    "entries": {
      "clawtrace": {
        "config": {
          "enabled": true,
          "endpoint": "https://ingest.clawtrace.ai/v1/traces/events",
          "apiKey": "ct_live_prod_xxx",
          "agentId": "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
          "schemaVersion": 1,
          "requestTimeoutMs": 5000,
          "maxRetries": 2,
          "retryBackoffMs": 250,
          "maxQueueSize": 2000,
          "emitErrorEvents": true,
          "includePrompts": true,
          "includeToolResults": true
        }
      }
    }
  }
}
```

You can also set env fallbacks:

- `CLAWTRACE_ENDPOINT`
- `CLAWTRACE_API_KEY`
- `CLAWTRACE_AGENT_ID`
- `CLAWTRACE_ENABLED`
- `CLAWTRACE_SCHEMA_VERSION`
- `CLAWTRACE_REQUEST_TIMEOUT_MS`
- `CLAWTRACE_MAX_RETRIES`
- `CLAWTRACE_RETRY_BACKOFF_MS`
- `CLAWTRACE_MAX_QUEUE_SIZE`
- `CLAWTRACE_EMIT_ERROR_EVENTS`
- `CLAWTRACE_INCLUDE_PROMPTS`
- `CLAWTRACE_INCLUDE_TOOL_RESULTS`

## Event contract

Each request is sent to:

- `POST /v1/traces/events`

With body:

```json
{
  "schemaVersion": 1,
  "agentId": "uuid",
  "event": {
    "eventId": "uuid",
    "eventType": "llm_before_call",
    "traceId": "uuid",
    "spanId": "uuid",
    "parentSpanId": "uuid-or-null",
    "tsMs": 1764064800000,
    "payload": {}
  }
}
```

## Development

```bash
cd plugins/clawtrace
npm install
npm run check
npm test
```

## Publish to npm

```bash
cd plugins/clawtrace
npm login
npm publish --access public
```

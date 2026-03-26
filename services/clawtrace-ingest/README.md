# ClawTrace Ingest Service (FastAPI)

Python ingest API for OpenClaw hook events. This service is designed for VM/Kubernetes deployment and writes raw events directly to object storage for downstream Iceberg processing.

## Contract

`POST /v1/traces/events`

Header:
- `Authorization: Bearer <api_key>`

Body:

```json
{
  "schemaVersion": 1,
  "agentId": "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
  "event": {
    "eventId": "e5f2d4b4-9b2d-4c0f-9f06-73f6ea9d90cf",
    "eventType": "span_start",
    "traceId": "trace-abc",
    "spanId": "span-001",
    "parentSpanId": null,
    "tsMs": 1764064800000,
    "payload": {
      "name": "main-session"
    }
  }
}
```

## Auth modes

- `mock_pass` (default): auth check is mocked and always passes.
- `static_keys`: validates Bearer token against `CLAWTRACE_INGEST_STATIC_KEYS_JSON`.

## Quick start

```bash
cd services/clawtrace-ingest
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

Health check:

```bash
curl http://localhost:8080/healthz
```

Ingest test:

```bash
curl -X POST http://localhost:8080/v1/traces/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ct_live_demo" \
  -d '{
    "schemaVersion": 1,
    "agentId": "8f8c8e1d-6a2f-4a7f-b1bd-0e4e6f8a2f19",
    "event": {
      "eventId": "e5f2d4b4-9b2d-4c0f-9f06-73f6ea9d90cf",
      "eventType": "span_start",
      "traceId": "trace-abc",
      "spanId": "span-001",
      "parentSpanId": null,
      "tsMs": 1764064800000,
      "payload": {"name": "main-session"}
    }
  }'
```

## Storage model

- Data-lake-only raw sink (object storage).
- Cloud-agnostic configuration via `CLAWTRACE_INGEST_STORAGE_PROVIDER`, `CLAWTRACE_INGEST_RAW_BUCKET`, and `CLAWTRACE_INGEST_RAW_PREFIX`.
- Writes JSON objects under:
  - `RAW_PREFIX/tenant=<tenantId>/agent=<agentId>/dt=YYYY-MM-DD/hr=HH/event-<eventId>.json`
  - `tenantId` is derived from authenticated `accountId`.

Supported providers:

1. `gcs`
- Required:
  - `CLAWTRACE_INGEST_STORAGE_PROVIDER=gcs`
  - `CLAWTRACE_INGEST_RAW_BUCKET=<gcs-bucket>`
- Auth:
  - ADC/service account

2. `azure_blob`
- Required:
  - `CLAWTRACE_INGEST_STORAGE_PROVIDER=azure_blob`
  - `CLAWTRACE_INGEST_AZURE_CONTAINER=<container>` (or use `RAW_BUCKET`)
- Auth (choose one):
  - Managed identity: set `CLAWTRACE_INGEST_AZURE_ACCOUNT_URL=https://<account>.blob.core.windows.net`
  - Connection string: set `CLAWTRACE_INGEST_AZURE_CONNECTION_STRING`

3. `aws_s3`
- Required:
  - `CLAWTRACE_INGEST_STORAGE_PROVIDER=aws_s3`
  - `CLAWTRACE_INGEST_RAW_BUCKET=<s3-bucket>`
- Optional:
  - `CLAWTRACE_INGEST_AWS_REGION=<region>`
  - `CLAWTRACE_INGEST_AWS_ENDPOINT_URL=<custom-s3-endpoint>`
- Auth:
  - Default AWS SDK credential chain

## Optional Pub/Sub trigger

Set `CLAWTRACE_INGEST_PUBSUB_TOPIC=projects/<project>/topics/<topic>` to publish accepted events for downstream Spark/Iceberg pipeline triggers (GCP example profile).

## Tests

```bash
cd services/clawtrace-ingest
source .venv/bin/activate
pytest -q
```

## Deploy

### Docker

```bash
docker build -t clawtrace-ingest:latest .
docker run --rm -p 8080:8080 --env-file .env clawtrace-ingest:latest
```

### Kubernetes

Use manifests in `k8s/` and replace image/env placeholders.

"""Local ingest server — receives ClawTrace plugin events during experiments.

Runs on http://127.0.0.1:9789. Appends events to a JSONL file keyed by
trace_id (runId). Point the OpenClaw plugin at this endpoint during runs:

    export CLAWTRACE_ENDPOINT=http://127.0.0.1:9789/v1/traces/events
    export CLAWTRACE_OBSERVE_KEY=dev-local

Launch:

    python -m costcraft.ingest_server --out-dir /path/to/traces
"""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
from typing import Any

import uvicorn
from fastapi import FastAPI, Request


def make_app(out_dir: Path) -> FastAPI:
    out_dir.mkdir(parents=True, exist_ok=True)
    app = FastAPI()

    @app.post("/v1/traces/events")
    async def ingest(req: Request) -> dict[str, Any]:
        body = await req.json()
        event = body.get("event") or {}
        trace_id = event.get("traceId") or "unknown-trace"
        event["_ingestMeta"] = {
            "schemaVersion": body.get("schemaVersion"),
            "agentId": body.get("agentId"),
        }
        fname = out_dir / f"{trace_id}.jsonl"
        with fname.open("a") as f:
            f.write(json.dumps(event) + "\n")
        return {
            "status": "accepted",
            "receivedAt": event.get("tsMs"),
            "rawObjectPath": str(fname),
        }

    @app.get("/health")
    async def health():
        return {"ok": True, "outDir": str(out_dir)}

    return app


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--out-dir", required=True, type=Path)
    p.add_argument("--port", type=int, default=9789)
    args = p.parse_args()
    app = make_app(args.out_dir)
    uvicorn.run(app, host="127.0.0.1", port=args.port, log_level="warning")


if __name__ == "__main__":
    main()

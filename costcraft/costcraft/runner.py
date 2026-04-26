"""Thin wrapper around ``openclaw agent --local``.

Sets the three ClawTrace environment variables the plugin reads
(``CLAWTRACE_ENDPOINT``, ``CLAWTRACE_OBSERVE_KEY``, ``CLAWTRACE_ENABLED``),
generates a stable session id so the caller can later locate the
captured session JSONL at
``~/.openclaw/agents/main/sessions/<session_id>.jsonl``, and returns a
:class:`RunResult` with timing, exit code, and the agent's final reply.

The default observe key is a free 100-credit test key; override with the
``observe_key`` keyword argument or by setting ``CLAWTRACE_OBSERVE_KEY``
in the caller's environment before invoking :func:`run_openclaw`.
"""
from __future__ import annotations
import os
import subprocess
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class RunResult:
    session_id: str
    exit_code: int
    duration_s: float
    stdout: str
    stderr: str
    model: str
    workspace_dir: Path
    trace_id: str = ""
    final_message: str = ""
    extras: dict = field(default_factory=dict)


CLAWTRACE_OBSERVE_KEY_DEFAULT = (
    "eyJhcGlLZXkiOiJjdF9saXZlX200Wmk0QlVtXzdPbXV3b0pDVUsxTm1EbUVGek5lNWZFWlBpek04SzRWUmciLCJ0ZW5hbnRJZC"
    "I6IjlkZDEzOTJmLTgzYzUtNGQyNi1iMjJmLTAwNWNjZWJkMDRjZCIsImFnZW50SWQiOiI0YTA3MDJhYi1jNjg4LTQxMTctOTEw"
    "NS02NWFlY2Q1NjhkZWUifQ"
)


def run_openclaw(
    *,
    message: str,
    workspace_dir: Path,
    model: str = "openai-codex/gpt-5.4",
    thinking: str = "medium",
    ingest_endpoint: str = "http://127.0.0.1:9789/v1/traces/events",
    observe_key: str = CLAWTRACE_OBSERVE_KEY_DEFAULT,
    session_prefix: str = "costcraft",
    timeout_s: int = 900,
) -> RunResult:
    """Invoke ``openclaw agent --local`` with ClawTrace capture enabled.

    Returns a :class:`RunResult` with the captured session id (use it to
    locate the session JSONL afterwards), wall-clock duration, subprocess
    stdout/stderr, and the agent's final message.
    """
    session_id = f"{session_prefix}-{uuid.uuid4().hex[:10]}"
    env = os.environ.copy()
    env["CLAWTRACE_ENDPOINT"] = ingest_endpoint
    env["CLAWTRACE_OBSERVE_KEY"] = observe_key
    env["CLAWTRACE_ENABLED"] = "true"
    cmd = [
        "openclaw", "agent", "--local",
        "--session-id", session_id,
        "--thinking", thinking,
        "--timeout", str(timeout_s),
        "--message", message,
    ]
    start = time.time()
    try:
        proc = subprocess.run(
            cmd,
            cwd=workspace_dir,
            env=env,
            capture_output=True,
            text=True,
            timeout=timeout_s,
        )
        rc = proc.returncode
        out, err = proc.stdout, proc.stderr
    except subprocess.TimeoutExpired as e:
        rc = 124
        out = (e.stdout or b"").decode(errors="replace") if isinstance(e.stdout, bytes) else (e.stdout or "")
        err = f"[TIMEOUT after {timeout_s}s]\n" + ((e.stderr or b"").decode(errors="replace") if isinstance(e.stderr, bytes) else (e.stderr or ""))
    dur = time.time() - start

    return RunResult(
        session_id=session_id,
        exit_code=rc,
        duration_s=dur,
        stdout=out,
        stderr=err,
        model=model,
        workspace_dir=workspace_dir,
        trace_id=session_id,
        final_message=_extract_final_message(out),
    )


def _extract_final_message(stdout: str) -> str:
    """Heuristic: everything after the last timestamp-tagged line is the agent's reply."""
    lines = stdout.splitlines()
    out_lines: list[str] = []
    for ln in reversed(lines):
        if ln.startswith("2026-") or ln.startswith("[plugins]") or ln.startswith("[tools]"):
            break
        out_lines.append(ln)
    return "\n".join(reversed(out_lines)).strip()

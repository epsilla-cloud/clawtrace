#!/usr/bin/env python3
"""
PuppyGraph health monitor.

Runs every MONITOR_INTERVAL_SECONDS (default 1800 = 30 min).
Queries PuppyGraph with a known trace to verify end-to-end data access.

On failure:
  - Retries up to RETRY_COUNT times with RETRY_DELAY_SECONDS between attempts.
  - If all retries fail, SSHes to the PuppyGraph VM and restarts the container.
  - Sends Slack alerts on first failure, after restart, and on recovery.

All credentials are read from environment variables. No secrets in this file.

Environment variables (set via .env or system environment):
  PUPPYGRAPH_URL          e.g. https://puppy.clawtrace.ai
  PUPPYGRAPH_USER         PuppyGraph username
  PUPPYGRAPH_PASSWORD     PuppyGraph password
  PUPPYGRAPH_VM_IP        IP of the VM running the Docker container
  PUPPYGRAPH_VM_USER      SSH user on that VM (e.g. azureuser)
  PUPPYGRAPH_SSH_KEY      Absolute path to the SSH private key
  PUPPYGRAPH_CONTAINER    Docker container name (default: puppy)
  SLACK_WEBHOOK_URL       Slack incoming webhook URL for alerts
  MONITOR_INTERVAL_SECONDS  Poll interval in seconds (default: 1800)
  RETRY_COUNT             Retries before restart (default: 3)
  RETRY_DELAY_SECONDS     Seconds between retries (default: 30)
  QUERY_TIMEOUT_SECONDS   Per-query timeout (default: 30)
  PROBE_TRACE_ID          Trace ID used as the health-check query target
"""

import os
import time
import logging
import subprocess
import datetime

import requests

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [puppygraph-monitor] %(levelname)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Config from env ───────────────────────────────────────────────────────────
PUPPYGRAPH_URL        = os.environ["PUPPYGRAPH_URL"].rstrip("/")
PUPPYGRAPH_USER       = os.environ["PUPPYGRAPH_USER"]
PUPPYGRAPH_PASSWORD   = os.environ["PUPPYGRAPH_PASSWORD"]
PUPPYGRAPH_VM_IP      = os.environ["PUPPYGRAPH_VM_IP"]
PUPPYGRAPH_VM_USER    = os.environ.get("PUPPYGRAPH_VM_USER", "azureuser")
PUPPYGRAPH_SSH_KEY    = os.environ["PUPPYGRAPH_SSH_KEY"]
PUPPYGRAPH_CONTAINER  = os.environ.get("PUPPYGRAPH_CONTAINER", "puppy")
SLACK_WEBHOOK_URL     = os.environ.get("SLACK_WEBHOOK_URL", "")
PROBE_TRACE_ID        = os.environ["PROBE_TRACE_ID"]

MONITOR_INTERVAL_SECONDS = int(os.environ.get("MONITOR_INTERVAL_SECONDS", "1800"))
RETRY_COUNT              = int(os.environ.get("RETRY_COUNT", "3"))
RETRY_DELAY_SECONDS      = int(os.environ.get("RETRY_DELAY_SECONDS", "30"))
QUERY_TIMEOUT_SECONDS    = int(os.environ.get("QUERY_TIMEOUT_SECONDS", "30"))

# ── Cypher probe query ────────────────────────────────────────────────────────
PROBE_QUERY = (
    f"MATCH (t {{trace_id: '{PROBE_TRACE_ID}'}}) RETURN t.trace_id LIMIT 1"
)


# ── Slack ─────────────────────────────────────────────────────────────────────
def slack(text: str, level: str = "info") -> None:
    if not SLACK_WEBHOOK_URL:
        log.warning("SLACK_WEBHOOK_URL not set — skipping alert")
        return
    icon = {"info": "ℹ️", "warn": "⚠️", "error": "🔴", "ok": "✅"}.get(level, "ℹ️")
    try:
        requests.post(
            SLACK_WEBHOOK_URL,
            json={"text": f"{icon} *[puppygraph-monitor]* {text}"},
            timeout=10,
        )
    except Exception as exc:
        log.warning("Slack send failed: %s", exc)


# ── PuppyGraph query ──────────────────────────────────────────────────────────
def run_probe() -> tuple[bool, str]:
    """
    Run the probe Cypher query.
    Returns (success: bool, detail: str).
    """
    try:
        resp = requests.post(
            f"{PUPPYGRAPH_URL}/submitCypher",
            json={"query": PROBE_QUERY},
            auth=(PUPPYGRAPH_USER, PUPPYGRAPH_PASSWORD),
            timeout=QUERY_TIMEOUT_SECONDS,
        )
        if resp.status_code == 200:
            rows = resp.json()
            if isinstance(rows, list):
                return True, f"ok — {len(rows)} row(s)"
            return False, f"unexpected response shape: {str(resp.text)[:200]}"
        return False, f"HTTP {resp.status_code}: {resp.text[:200]}"
    except requests.exceptions.Timeout:
        return False, f"timeout after {QUERY_TIMEOUT_SECONDS}s"
    except Exception as exc:
        return False, str(exc)


# ── Container restart via SSH ─────────────────────────────────────────────────
def restart_container() -> tuple[bool, str]:
    """SSH to the PuppyGraph VM and restart the Docker container."""
    cmd = [
        "ssh",
        "-i", PUPPYGRAPH_SSH_KEY,
        "-o", "StrictHostKeyChecking=no",
        "-o", "ConnectTimeout=15",
        f"{PUPPYGRAPH_VM_USER}@{PUPPYGRAPH_VM_IP}",
        f"docker restart {PUPPYGRAPH_CONTAINER}",
    ]
    log.info("Restarting container via SSH: %s", " ".join(cmd))
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=60
        )
        if result.returncode == 0:
            return True, result.stdout.strip()
        return False, f"ssh exit {result.returncode}: {result.stderr.strip()}"
    except subprocess.TimeoutExpired:
        return False, "SSH command timed out after 60s"
    except Exception as exc:
        return False, str(exc)


# ── Wait for PuppyGraph to come back after restart ───────────────────────────
def wait_for_recovery(max_wait: int = 120) -> bool:
    """Poll until the probe succeeds or max_wait seconds elapse."""
    deadline = time.time() + max_wait
    while time.time() < deadline:
        time.sleep(10)
        ok, _ = run_probe()
        if ok:
            return True
    return False


# ── Main check cycle ─────────────────────────────────────────────────────────
def run_check() -> None:
    log.info("Running probe: trace_id=%s", PROBE_TRACE_ID)

    # Attempt up to RETRY_COUNT times
    last_detail = ""
    for attempt in range(1, RETRY_COUNT + 1):
        ok, detail = run_probe()
        last_detail = detail
        if ok:
            log.info("Probe passed (attempt %d/%d): %s", attempt, RETRY_COUNT, detail)
            return
        log.warning(
            "Probe failed (attempt %d/%d): %s", attempt, RETRY_COUNT, detail
        )
        if attempt < RETRY_COUNT:
            time.sleep(RETRY_DELAY_SECONDS)

    # All retries exhausted
    ts = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    msg = (
        f"PuppyGraph probe failed after {RETRY_COUNT} attempts at {ts}. "
        f"Last error: `{last_detail}`. "
        f"Attempting container restart on `{PUPPYGRAPH_VM_IP}`."
    )
    log.error(msg)
    slack(msg, level="error")

    # Restart
    restarted, restart_detail = restart_container()
    if not restarted:
        err = f"Container restart FAILED: `{restart_detail}`. Manual intervention required."
        log.error(err)
        slack(err, level="error")
        return

    log.info("Container restart succeeded (%s). Waiting for recovery...", restart_detail)
    slack(
        f"Container `{PUPPYGRAPH_CONTAINER}` restarted. Waiting up to 120s for recovery...",
        level="warn",
    )

    recovered = wait_for_recovery(max_wait=120)
    if recovered:
        msg_ok = f"PuppyGraph recovered after restart at {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}."
        log.info(msg_ok)
        slack(msg_ok, level="ok")
    else:
        msg_fail = (
            f"PuppyGraph did NOT recover within 120s after restart. "
            f"Last error: `{last_detail}`. Manual intervention required."
        )
        log.error(msg_fail)
        slack(msg_fail, level="error")


# ── Entry point ───────────────────────────────────────────────────────────────
def main() -> None:
    log.info(
        "puppygraph-monitor starting — interval=%ds retry=%d×%ds timeout=%ds",
        MONITOR_INTERVAL_SECONDS,
        RETRY_COUNT,
        RETRY_DELAY_SECONDS,
        QUERY_TIMEOUT_SECONDS,
    )
    slack(
        f"puppygraph-monitor started. Probing every {MONITOR_INTERVAL_SECONDS // 60}m "
        f"with trace `{PROBE_TRACE_ID}`.",
        level="info",
    )
    while True:
        run_check()
        time.sleep(MONITOR_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()

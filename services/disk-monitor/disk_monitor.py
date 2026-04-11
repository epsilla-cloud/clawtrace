#!/usr/bin/env python3
"""
Disk I/O monitoring daemon for the PuppyGraph VM.
Sends Slack alerts when disk read rate exceeds threshold.

Run as: python3 disk_monitor.py
Or install as a systemd service (see disk-monitor.service).
"""

import os
import time
import datetime
import logging
import requests

# ── Configuration ─────────────────────────────────────────────────────────────
SLACK_WEBHOOK_URL = os.environ.get("SLACK_WEBHOOK_URL", "")
CHECK_INTERVAL_SECONDS = int(os.environ.get("DISK_MONITOR_INTERVAL", "30"))

# Alert thresholds
DISK_READ_MB_PER_SEC_WARN = float(os.environ.get("DISK_READ_WARN_MB", "500"))   # 500 MB/s
DISK_READ_MB_PER_SEC_CRIT = float(os.environ.get("DISK_READ_CRIT_MB", "2000"))  # 2 GB/s
DISK_USAGE_WARN_PCT = float(os.environ.get("DISK_USAGE_WARN_PCT", "80"))         # 80%
DISK_USAGE_CRIT_PCT = float(os.environ.get("DISK_USAGE_CRIT_PCT", "90"))         # 90%

# Cooldown: don't re-alert within this many seconds of same severity
ALERT_COOLDOWN_SECONDS = 600  # 10 minutes

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


def read_disk_stats(device: str = "sda") -> dict:
    """Read /proc/diskstats for the given device."""
    with open("/proc/diskstats") as f:
        for line in f:
            parts = line.split()
            if len(parts) >= 14 and parts[2] == device:
                return {
                    "reads": int(parts[3]),
                    "read_sectors": int(parts[5]),
                    "writes": int(parts[7]),
                    "write_sectors": int(parts[9]),
                    "io_ms": int(parts[12]),
                }
    # Try sda1 or nvme0n1
    with open("/proc/diskstats") as f:
        for line in f:
            parts = line.split()
            if len(parts) >= 14 and parts[2] in ("sdb", "nvme0n1", "vda"):
                return {
                    "reads": int(parts[3]),
                    "read_sectors": int(parts[5]),
                    "writes": int(parts[7]),
                    "write_sectors": int(parts[9]),
                    "io_ms": int(parts[12]),
                }
    return {}


def get_disk_usage_pct(path: str = "/") -> float:
    stat = os.statvfs(path)
    total = stat.f_blocks * stat.f_frsize
    used = (stat.f_blocks - stat.f_bfree) * stat.f_frsize
    return (used / total * 100) if total else 0


def send_slack(message: str) -> None:
    if not SLACK_WEBHOOK_URL:
        logger.warning("SLACK_WEBHOOK_URL not set, skipping alert")
        return
    try:
        requests.post(SLACK_WEBHOOK_URL, json={"text": message}, timeout=10)
    except Exception as e:
        logger.error("Failed to send Slack alert: %s", e)


def main() -> None:
    logger.info("Disk monitor started (interval=%ds, read_warn=%.0fMB/s, read_crit=%.0fMB/s)",
                CHECK_INTERVAL_SECONDS, DISK_READ_MB_PER_SEC_WARN, DISK_READ_MB_PER_SEC_CRIT)

    prev_stats = read_disk_stats()
    prev_time = time.time()
    last_alert_time: dict[str, float] = {}

    time.sleep(CHECK_INTERVAL_SECONDS)

    while True:
        try:
            now = time.time()
            elapsed = now - prev_time
            curr_stats = read_disk_stats()
            disk_pct = get_disk_usage_pct("/")

            if curr_stats and prev_stats and elapsed > 0:
                # Each sector = 512 bytes
                read_bytes = (curr_stats["read_sectors"] - prev_stats["read_sectors"]) * 512
                write_bytes = (curr_stats["write_sectors"] - prev_stats["write_sectors"]) * 512
                read_mb_s = read_bytes / elapsed / 1_048_576
                write_mb_s = write_bytes / elapsed / 1_048_576

                logger.info("Disk I/O: read=%.1fMB/s write=%.1fMB/s usage=%.1f%%",
                            read_mb_s, write_mb_s, disk_pct)

                # Check critical read threshold
                if read_mb_s >= DISK_READ_MB_PER_SEC_CRIT:
                    key = "read_crit"
                    if now - last_alert_time.get(key, 0) > ALERT_COOLDOWN_SECONDS:
                        msg = (f":rotating_light: *CRITICAL: Disk read spike on PuppyGraph VM*\n"
                               f"Read rate: *{read_mb_s:.0f} MB/s* (threshold: {DISK_READ_MB_PER_SEC_CRIT:.0f} MB/s)\n"
                               f"Write rate: {write_mb_s:.0f} MB/s | Disk usage: {disk_pct:.1f}%\n"
                               f"Time: {datetime.datetime.utcnow().isoformat()}Z\n"
                               f"_This is likely a PuppyGraph full table scan. Check the API service logs for the Cypher query._")
                        send_slack(msg)
                        last_alert_time[key] = now
                        logger.critical("CRITICAL disk read spike: %.0f MB/s", read_mb_s)
                    last_alert_time.pop("read_warn", None)  # reset warn if crit fires

                # Check warning read threshold
                elif read_mb_s >= DISK_READ_MB_PER_SEC_WARN:
                    key = "read_warn"
                    if now - last_alert_time.get(key, 0) > ALERT_COOLDOWN_SECONDS:
                        msg = (f":warning: *WARNING: High disk read on PuppyGraph VM*\n"
                               f"Read rate: *{read_mb_s:.0f} MB/s* (threshold: {DISK_READ_MB_PER_SEC_WARN:.0f} MB/s)\n"
                               f"Disk usage: {disk_pct:.1f}%\n"
                               f"Time: {datetime.datetime.utcnow().isoformat()}Z")
                        send_slack(msg)
                        last_alert_time[key] = now
                        logger.warning("High disk read: %.0f MB/s", read_mb_s)
                else:
                    # Reset warn/crit cooldowns if read drops back to normal
                    last_alert_time.pop("read_warn", None)
                    last_alert_time.pop("read_crit", None)

                # Check disk usage
                if disk_pct >= DISK_USAGE_CRIT_PCT:
                    key = "usage_crit"
                    if now - last_alert_time.get(key, 0) > ALERT_COOLDOWN_SECONDS:
                        msg = (f":rotating_light: *CRITICAL: Disk almost full on PuppyGraph VM*\n"
                               f"Disk usage: *{disk_pct:.1f}%* (threshold: {DISK_USAGE_CRIT_PCT:.0f}%)\n"
                               f"Time: {datetime.datetime.utcnow().isoformat()}Z")
                        send_slack(msg)
                        last_alert_time[key] = now
                elif disk_pct >= DISK_USAGE_WARN_PCT:
                    key = "usage_warn"
                    if now - last_alert_time.get(key, 0) > ALERT_COOLDOWN_SECONDS:
                        msg = (f":warning: *WARNING: Disk usage high on PuppyGraph VM*\n"
                               f"Disk usage: *{disk_pct:.1f}%* (threshold: {DISK_USAGE_WARN_PCT:.0f}%)")
                        send_slack(msg)
                        last_alert_time[key] = now
                else:
                    last_alert_time.pop("usage_warn", None)
                    last_alert_time.pop("usage_crit", None)

            prev_stats = curr_stats
            prev_time = now

        except Exception as e:
            logger.error("Monitor error: %s", e)

        time.sleep(CHECK_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()

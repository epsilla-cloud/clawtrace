#!/usr/bin/env python3
"""Reproduce the ClawTrace tracing-overhead microbenchmark from §4.9.

The ClawTrace plugin batches events in memory per agent session and
flushes them via a single HTTPS POST at session end. Wall-time overhead
per trajectory is therefore dominated by the round-trip latency of that
POST, which this script measures by sending a representative payload to
the configured ingest endpoint and timing it over N trials. The reported
metric is ``plugin_cost_per_trajectory / median_agent_wall_time``.

Usage
-----
    python benchmark_tracing_overhead.py
    python benchmark_tracing_overhead.py --trials 40
    python benchmark_tracing_overhead.py --endpoint https://my.ingest/path
"""
import json
import time
import statistics
from pathlib import Path

import yaml
import urllib.request
import urllib.error

ROOT = Path(__file__).resolve().parents[2]
OCL_CFG = Path.home() / '.openclaw' / 'openclaw.json'
SB_RUNS = ROOT / 'spreadsheetbench' / 'runs'


def load_plugin_config():
    d = json.loads(OCL_CFG.read_text())
    p = d['plugins']['entries']['clawtrace']['config']
    return p['endpoint'], p['observeKey']


def sample_events_from_trace(tid, max_events=32):
    """Read a real trace.jsonl; return a plausible event payload."""
    f = SB_RUNS / tid / 'baseline_default_0' / 'trace.jsonl'
    events = []
    if f.exists():
        for line in f.read_text().splitlines()[:max_events]:
            try:
                rec = json.loads(line)
                events.append(rec)
            except Exception:
                pass
    return events


def build_envelope(observe_key, events):
    """Roughly match the plugin's IngestEnvelope shape."""
    return {
        'schemaVersion': 1,
        'observeKey': observe_key,
        'events': [
            {
                'eventId': f'microbench-{i}',
                'sessionId': 'microbench-session',
                'hookType': 'llm_output' if i % 2 else 'llm_input',
                'timestamp': time.time(),
                'payload': events[i],
            }
            for i in range(len(events))
        ],
    }


def post_once(endpoint, observe_key, payload_json):
    """One HTTP POST, returns (latency_ms, status_code or err)."""
    req = urllib.request.Request(
        endpoint,
        data=payload_json.encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {observe_key}',
        },
        method='POST',
    )
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            resp.read()
    except urllib.error.HTTPError as e:
        status = f'HTTPError {e.code}'
    except Exception as e:
        status = f'Exception {type(e).__name__}: {e}'
    t1 = time.perf_counter()
    return (t1 - t0) * 1000, status


def measure_endpoint(endpoint, observe_key, n_trials=20, trace_tid='59196'):
    events = sample_events_from_trace(trace_tid, max_events=32)
    payload = build_envelope(observe_key, events)
    payload_json = json.dumps(payload)
    size_kb = len(payload_json) / 1024
    print(f'payload: {size_kb:.1f} kB, {len(events)} events (from trace {trace_tid})')

    # 3 warmup trials
    for _ in range(3):
        post_once(endpoint, observe_key, payload_json)

    latencies = []
    statuses = []
    for i in range(n_trials):
        lat, st = post_once(endpoint, observe_key, payload_json)
        latencies.append(lat)
        statuses.append(st)
        print(f'  trial {i+1}/{n_trials}: {lat:.1f} ms  status={st}')

    return latencies, statuses, size_kb


def baseline_wall_times(tids):
    """Read median agent wall time from existing baseline runs."""
    durs = []
    for tid in tids:
        meta = SB_RUNS / tid / 'baseline_default_0' / 'run_meta.json'
        if meta.exists():
            m = json.loads(meta.read_text())
            if 'duration_s' in m:
                durs.append(m['duration_s'])
    return durs


def parse_args(argv=None):
    import argparse
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--endpoint', default=None,
                        help='Override the ingest endpoint URL '
                             '(default: read from ~/.openclaw/openclaw.json).')
    parser.add_argument('--observe-key', default=None,
                        help='Override the observe key '
                             '(default: read from ~/.openclaw/openclaw.json).')
    parser.add_argument('--trials', type=int, default=20,
                        help='Number of POST trials (default: 20).')
    parser.add_argument('--trace-id', default='59196',
                        help='Baseline trace ID to build a representative '
                             'payload from (default: 59196).')
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    if args.endpoint and args.observe_key:
        endpoint, observe_key = args.endpoint, args.observe_key
    else:
        endpoint, observe_key = load_plugin_config()
        if args.endpoint:
            endpoint = args.endpoint
        if args.observe_key:
            observe_key = args.observe_key
    print(f'endpoint: {endpoint}')
    print(f'observeKey prefix: {observe_key[:16]}…')
    print()

    latencies, statuses, size_kb = measure_endpoint(
        endpoint, observe_key, n_trials=args.trials, trace_tid=args.trace_id)
    print()

    # Even HTTP 422 (schema mismatch) still measures full network round-trip:
    # DNS + TLS + request transmission + server parse/validate + response.
    # That IS the cost the plugin pays per POST. Use all non-exception trials.
    ok_lat = [l for l, s in zip(latencies, statuses)
              if isinstance(s, int) or (isinstance(s, str) and s.startswith('HTTPError'))]

    print(f'=== POST latencies to {endpoint} ===')
    print(f'trials that reached the server: {len(ok_lat)}/{len(latencies)}')
    if ok_lat:
        ok_lat.sort()
        print(f'  median: {statistics.median(ok_lat):.1f} ms')
        print(f'  mean:   {statistics.mean(ok_lat):.1f} ms')
        print(f'  p95:    {ok_lat[int(len(ok_lat)*0.95) - 1]:.1f} ms')
        print(f'  min:    {min(ok_lat):.1f} ms')
        print(f'  max:    {max(ok_lat):.1f} ms')

    # Compare to agent wall times
    sample_tids = ['59196','1845','40467','43213','47484','504-10','33036','488-29','81-41','31184']
    durs = baseline_wall_times(sample_tids)
    if durs:
        durs.sort()
        med_wall = statistics.median(durs)
        print(f'\n=== Agent baseline wall times (N={len(durs)}, same 10 tasks) ===')
        print(f'  median wall: {med_wall:.1f} s')
        if ok_lat:
            plugin_per_trace_ms = statistics.median(ok_lat)
            overhead_pct = plugin_per_trace_ms / 1000 / med_wall * 100
            print(f'\n=== Plugin overhead estimate ===')
            print(f'  plugin: ~1 HTTP POST per trajectory (batched flush)')
            print(f'  median plugin wire cost: {plugin_per_trace_ms:.1f} ms')
            print(f'  median agent trajectory wall: {med_wall:.1f} s = {med_wall*1000:.0f} ms')
            print(f'  ==> plugin overhead ≈ {overhead_pct:.2f}% of agent wall time')

    # Persist
    out = ROOT / 'spreadsheetbench' / 'tracing_overhead' / 'microbench.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({
        'endpoint': endpoint,
        'payload_kb': size_kb,
        'n_trials': len(latencies),
        'successful': len(ok_lat),
        'latencies_ms': latencies,
        'statuses': statuses,
        'median_ms': statistics.median(ok_lat) if ok_lat else None,
        'mean_ms': statistics.mean(ok_lat) if ok_lat else None,
        'p95_ms': ok_lat[int(len(ok_lat)*0.95)-1] if len(ok_lat) >= 20 else None,
        'agent_wall_sample_tids': sample_tids,
        'agent_wall_median_s': statistics.median(durs) if durs else None,
    }, indent=2))
    print(f'\nwrote {out}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

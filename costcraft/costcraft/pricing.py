"""Provider pricing map. Snapshot: 2026-04-14.

USD per 1M tokens. `cache_read` rate applies to ClawTrace's `cacheRead` field;
`cache_write` applies to `cacheWrite`. All rates are for the snapshot date; if
providers change pricing, bump the snapshot.
"""
from dataclasses import dataclass


@dataclass(frozen=True)
class Rate:
    input: float
    output: float
    cache_read: float
    cache_write: float


PRICING: dict[str, Rate] = {
    # Anthropic
    "claude-sonnet-4-6": Rate(input=3.0, output=15.0, cache_read=0.30, cache_write=3.75),
    "claude-sonnet-4.6": Rate(input=3.0, output=15.0, cache_read=0.30, cache_write=3.75),
    "claude-opus-4-7":   Rate(input=15.0, output=75.0, cache_read=1.50, cache_write=18.75),
    "claude-haiku-4-5":  Rate(input=0.80, output=4.0, cache_read=0.08, cache_write=1.0),
    # Google
    "gemini-3-pro-preview": Rate(input=2.0, output=8.0, cache_read=0.20, cache_write=2.0),
    "gemini-3-pro":         Rate(input=2.0, output=8.0, cache_read=0.20, cache_write=2.0),
    "gemini-2.5-pro":       Rate(input=1.25, output=10.0, cache_read=0.13, cache_write=1.25),
    "gemini-2.5-flash":     Rate(input=0.30, output=2.50, cache_read=0.03, cache_write=0.30),
    # OpenAI
    "gpt-5.4":  Rate(input=1.25, output=10.0, cache_read=0.13, cache_write=1.25),
    "gpt-5":    Rate(input=1.25, output=10.0, cache_read=0.13, cache_write=1.25),
    "gpt-4o":   Rate(input=2.50, output=10.0, cache_read=1.25, cache_write=2.50),
}

SNAPSHOT_DATE = "2026-04-14"


def normalize_model(model: str) -> str:
    """Normalize OpenClaw-style model IDs (e.g. 'google/gemini-3-pro-preview') to our keys."""
    m = model.lower()
    if "/" in m:
        m = m.split("/", 1)[1]
    return m


def usd_for_usage(model: str, usage: dict) -> float:
    """Compute USD cost for a single LLM call.

    `usage` dict matches the ClawTrace plugin schema:
      {input, output, cacheRead, cacheWrite, total}
    """
    key = normalize_model(model)
    rate = PRICING.get(key)
    if rate is None:
        return 0.0
    inp  = (usage.get("input") or 0) / 1_000_000
    out  = (usage.get("output") or 0) / 1_000_000
    cr   = (usage.get("cacheRead") or 0) / 1_000_000
    cw   = (usage.get("cacheWrite") or 0) / 1_000_000
    return inp * rate.input + out * rate.output + cr * rate.cache_read + cw * rate.cache_write

"""CostCraft refiner with verify-repair loop.

Pipeline per LOO fold:
  1. DISTILL: tracecards + default_skill → refined_skill_v1  (single Claude call)
  2. VERIFY: run refined_skill_v1 on a chosen training task, 1× LLM judge
     If pass → winning_skill = v1
     Else   → diagnostic + v1 + tracecards → refined_skill_v2 (minimal-patch call)
              winning_skill = v2  (no second verify, incumbent fallback if v2 fails
              structural gate at eval time)
  3. Return RefineResult with winning_skill + metadata

Ablation modes:
  - "full":        all TraceCard fields (cost + redundancy + failure signals)
  - "cost_blind":  all cost_usd zeroed
  - "len_matched": no TraceCards — just compress default skill (no loop)

The verify-repair loop is only active for "full" and "cost_blind" modes. In
"len_matched" there's no trace signal to repair from; a single pass is the
entire condition.
"""
from __future__ import annotations
import copy
import json
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from .claude import oneshot, ClaudeResponse
from .tracecard import TraceCard


@dataclass
class RefineResult:
    refined_skill: str
    mode: str
    used_repair: bool
    verify_passed: bool
    verify_delta_q: float | None
    verify_delta_cost_ratio: float | None
    winning_version: int                 # 1 or 2
    input_tokens: int
    output_tokens: int
    total_cost_usd: float
    refiner_model: str
    history: list[dict] = field(default_factory=list)  # per-iteration records


def _strip_costs(card: TraceCard) -> TraceCard:
    c = copy.deepcopy(card)
    c.total_cost_usd = 0.0
    for span in c.top_cost_spans:
        span["cost_usd"] = 0.0
    return c


def _distill_user(default_skill: str, cards: list[TraceCard], mode: str) -> str:
    if mode == "len_matched":
        return (
            "Compress the following SKILL.md to roughly 800-1000 tokens.\n"
            "Preserve all capability and deliverable requirements. Remove redundancy.\n"
            "Do NOT add new instructions — just shorten and consolidate.\n"
            "Return ONLY the markdown content, no preface.\n\n"
            "## CURRENT SKILL\n\n" + default_skill
        )
    cards_yaml = yaml.safe_dump(
        [c.to_yaml_friendly() for c in cards],
        sort_keys=False, allow_unicode=True, width=120,
    )
    return (
        "## TRACE CARDS FROM BASELINE RUNS\n\n"
        f"```yaml\n{cards_yaml}\n```\n\n"
        "## CURRENT DEFAULT SKILL\n\n"
        f"{default_skill}\n\n"
        "## TASK\n\n"
        "Produce a REFINED SKILL.md per the SYSTEM instructions.\n"
        "Output ONLY the markdown — no preface, no explanation, no code fences.\n"
    )


def _repair_user(previous_skill: str, diagnostic: str, cards: list[TraceCard]) -> str:
    """Ask for a MINIMAL PATCH against the incumbent, not a rewrite."""
    cards_yaml = yaml.safe_dump(
        [c.to_yaml_friendly() for c in cards],
        sort_keys=False, allow_unicode=True, width=120,
    )
    return (
        "A previous REFINED SKILL was tested and did not sufficiently improve on\n"
        "the baseline. You must produce an IMPROVED SKILL that is a MINIMAL PATCH\n"
        "of the previous one — preserve its overall structure and successful\n"
        "ideas, but fix the specific failure described in the diagnostic.\n\n"
        "## PREVIOUS REFINED SKILL (incumbent)\n\n"
        f"{previous_skill}\n\n"
        "## DIAGNOSTIC (what went wrong in verification)\n\n"
        f"{diagnostic}\n\n"
        "## TRACE CARDS (for reference)\n\n"
        f"```yaml\n{cards_yaml}\n```\n\n"
        "## TASK\n\n"
        "Return the REVISED SKILL.md — markdown only, no preface, no code fences.\n"
        "The revision should be close to the previous skill but fix the\n"
        "diagnostic. Do not remove deliverable requirements.\n"
    )


def _llm_refine(system_prompt: str, user_msg: str) -> ClaudeResponse:
    return oneshot(user=user_msg, system=system_prompt)


def distill_only(
    *,
    default_skill: str,
    trace_cards: list[TraceCard],
    system_prompt_path: Path,
    mode: str = "full",
) -> RefineResult:
    """Single-shot distillation, no verify. Used when caller provides its own loop
    (e.g. orchestrator for A1/A2 ablation).
    """
    if mode == "cost_blind":
        cards = [_strip_costs(c) for c in trace_cards]
    elif mode == "len_matched":
        cards = []
    elif mode == "full":
        cards = trace_cards
    else:
        raise ValueError(f"unknown refine mode: {mode}")

    system = system_prompt_path.read_text()
    user = _distill_user(default_skill, cards, mode)
    resp = _llm_refine(system, user)

    return RefineResult(
        refined_skill=resp.text,
        mode=mode,
        used_repair=False,
        verify_passed=False,
        verify_delta_q=None,
        verify_delta_cost_ratio=None,
        winning_version=1,
        input_tokens=resp.input_tokens,
        output_tokens=resp.output_tokens,
        total_cost_usd=resp.total_cost_usd,
        refiner_model=resp.model,
        history=[{"step": "distill_v1", "tokens_in": resp.input_tokens,
                  "tokens_out": resp.output_tokens}],
    )


def refine_with_verify(
    *,
    default_skill: str,
    trace_cards: list[TraceCard],
    system_prompt_path: Path,
    mode: str,
    verify_fn=None,
    q_tolerance: float = 0.05,
) -> RefineResult:
    """Distill-verify-repair loop. `verify_fn(skill_md)` returns a dict
    with keys: passed (bool), delta_q (float), delta_cost_ratio (float),
    diagnostic (str). If verify_fn is None or mode is "len_matched", we skip
    the loop and return v1 directly.
    """
    result = distill_only(
        default_skill=default_skill,
        trace_cards=trace_cards,
        system_prompt_path=system_prompt_path,
        mode=mode,
    )
    if verify_fn is None or mode == "len_matched":
        return result

    # VERIFY v1
    try:
        v = verify_fn(result.refined_skill)
    except Exception as e:
        v = {"passed": False, "delta_q": None, "delta_cost_ratio": None,
             "diagnostic": f"verify_fn error: {e}"}
    result.verify_passed = bool(v.get("passed"))
    result.verify_delta_q = v.get("delta_q")
    result.verify_delta_cost_ratio = v.get("delta_cost_ratio")
    result.history.append({"step": "verify_v1", **v})

    if result.verify_passed:
        return result

    # REPAIR — one minimal-patch attempt
    diag = str(v.get("diagnostic") or "unspecified failure")
    system = system_prompt_path.read_text()
    user = _repair_user(result.refined_skill, diag, trace_cards if mode != "cost_blind"
                        else [_strip_costs(c) for c in trace_cards])
    resp = _llm_refine(system, user)
    result.refined_skill = resp.text
    result.used_repair = True
    result.winning_version = 2
    result.input_tokens += resp.input_tokens
    result.output_tokens += resp.output_tokens
    result.total_cost_usd += resp.total_cost_usd
    result.history.append({"step": "repair_v2", "tokens_in": resp.input_tokens,
                           "tokens_out": resp.output_tokens})
    return result


# Back-compat alias for scripts that still call refine()
def refine(
    *,
    default_skill: str,
    trace_cards: list[TraceCard],
    system_prompt_path: Path,
    mode: str = "full",
) -> RefineResult:
    """Single-pass refine (no verify). Use refine_with_verify() for the loop."""
    return distill_only(
        default_skill=default_skill,
        trace_cards=trace_cards,
        system_prompt_path=system_prompt_path,
        mode=mode,
    )

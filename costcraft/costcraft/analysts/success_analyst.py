"""Success Analyst (A⁺) — emits preserve AND prune patches from a success trajectory.

Given a trajectory that succeeded + its cost-attributed TraceCard, the analyst
extracts:
  - ONE preserve patch: the behavior that caused success (what to keep)
  - ONE prune patch (optional): an expensive span that was NOT essential to
    the success, with a counterfactual justification
    ("removing this wouldn't have broken the task because ...")

The prune patch is the mechanism by which the evolved skill reduces cost on
success→success cases. Grounded in `top_cost_spans`.
"""
from __future__ import annotations
import json
from pathlib import Path

from ..claude import oneshot
from ..tracecard import TraceCard
from .patch import Patch


_SYS = """You are a Success Analyst for agent-skill distillation.

You see ONE baseline trajectory that SUCCEEDED on its task, plus a TraceCard
that attributes cost to each expensive span. Your job is to extract up to TWO
patches that will help a REFINED SKILL generalize to UNSEEN tasks:

1. **Preserve patch** (always produced): a rule capturing the CORE behavior
   that caused success. This is what every task of this type needs.

2. **Prune patch** (produced when cost attribution shows waste): an expensive
   span observed in this trajectory that was NOT essential to success. A
   rule that forbids or shortcuts that pattern on future tasks.
   - Use `top_cost_spans` to identify the costliest spans.
   - Use `redundant_tool_calls` to identify repeated work.
   - A prune patch MUST include a counterfactual: "Removing span X would
     NOT have broken the success because Y" (grounded in the trajectory).
   - If you cannot construct a credible counterfactual, DO NOT emit a prune
     patch for this trajectory. Preserve-only is fine.

Rules:
- DO NOT reference task-specific facts (column letters, sheet names, customer
  IDs, specific values). Abstract to the behavior.
- DO NOT propose blanket caps ("≤ 5 tool calls") unless the trace evidence
  supports it; prefer specific pattern prunes ("skip thinking-only turns").
- Prune patches should target `top_cost_spans[*].role_hint` when possible.

Output ONE JSON object (no markdown fence) with keys:
  "preserve": {
    "kind": "addition" or "edition",
    "rule_text": string (1-3 sentences),
    "root_cause": string (why this was key to success),
    "skill_section": one of "Trigger" | "Workflow" | "Stop rules" | "Artifact checklist" | "Cost control"
  },
  "prune": {          // null if no credible prune found
    "kind": "addition",
    "rule_text": string (1-3 sentences — a rule that avoids the expensive pattern),
    "root_cause": string (cost-grounded reason the pattern was expensive),
    "target_cost_sink": string (the role_hint addressed, e.g. "thinking_only", "tool_call", "sub_agent"),
    "counterfactual": string (1-2 sentences: why the success would have held without this behavior),
    "skill_section": "Cost control"
  } OR null

Return ONLY the JSON object."""


def _trajectory_summary(trajectory_jsonl: str, max_chars: int = 6000) -> str:
    lines = [l for l in trajectory_jsonl.splitlines() if l.strip()]
    if sum(len(l) for l in lines) <= max_chars:
        return "\n".join(lines)
    keep = lines[:3] + ["..."] + lines[-10:]
    return "\n".join(keep)[:max_chars]


def _build_user_msg(task_id: str, instruction: str, trajectory: str, tc: TraceCard) -> str:
    spans = "\n".join(f"  - kind={s.get('kind')} role_hint={s.get('role_hint')} "
                      f"cost_usd={s.get('cost_usd', 0):.4f}"
                      for s in (tc.top_cost_spans or [])[:5])
    red = "\n".join(f"  - {c}" for c in (tc.redundant_tool_calls or [])[:3])
    return (
        f"## Task (id: {task_id})\n\n"
        f"{instruction}\n\n"
        f"## Trajectory (JSONL excerpt)\n\n"
        f"```jsonl\n{_trajectory_summary(trajectory)}\n```\n\n"
        f"## TraceCard\n\n"
        f"- total_cost_usd: {tc.total_cost_usd:.4f}\n"
        f"- llm_call_count: {tc.llm_call_count}\n"
        f"- tool_call_count: {tc.tool_call_count}\n"
        f"- top_cost_spans:\n{spans or '  (none)'}\n"
        f"- redundant_tool_calls:\n{red or '  (none)'}\n\n"
        "## Your task\n\n"
        "Return ONE JSON object with keys 'preserve' and 'prune' per the system instructions. "
        "The 'prune' value MAY be null if no credible cost-reduction opportunity exists in this trajectory."
    )


def _retry_json(user_msg: str) -> str | None:
    """One-shot retry with a 'valid JSON only' reminder."""
    retry_msg = (
        "Your previous response was not valid JSON. Respond with ONLY a valid JSON object "
        "(no markdown fence, no prose, no code block). The schema is described in the system prompt.\n\n"
        + user_msg
    )
    try:
        resp = oneshot(user=retry_msg, system=_SYS)
        return resp.text.strip()
    except Exception:
        return None


def _strip_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        return text.strip()
    return text


def propose_success_patches(
    *,
    task_id: str,
    instruction: str,
    trajectory_jsonl: str,
    tracecard: TraceCard,
    baseline_quality: float,
    require_counterfactual: bool = True,
) -> list[Patch]:
    """Return up to two Patches (preserve + optional prune). Empty list on parse failure.
    require_counterfactual: when False (ablation), prune patches are accepted even without a
    counterfactual field — simulates removing the admission gate."""
    user_msg = _build_user_msg(task_id, instruction, trajectory_jsonl, tracecard)
    resp = oneshot(user=user_msg, system=_SYS)
    text = _strip_fence(resp.text)
    d = None
    try:
        d = json.loads(text)
    except Exception:
        # One retry with explicit "JSON only" reminder
        text = _retry_json(user_msg)
        if text:
            text = _strip_fence(text)
            try:
                d = json.loads(text)
            except Exception:
                d = None
    if not d or not isinstance(d, dict):
        return []

    patches: list[Patch] = []
    outcome = "success" if baseline_quality == 1.0 else "partial"

    pres = d.get("preserve") or {}
    if pres.get("rule_text"):
        patches.append(Patch(
            kind=pres.get("kind", "addition"),
            rule_text=pres["rule_text"].strip(),
            root_cause=pres.get("root_cause", "").strip(),
            source_task_id=task_id,
            source_outcome=outcome,
            action="preserve",
            target_cost_sink=None,
            counterfactual="",
            skill_section=pres.get("skill_section", "Workflow"),
            analyst_turns=1,
            diagnostic_passed=True,
        ))

    pr = d.get("prune")
    _prune_ok = pr and isinstance(pr, dict) and pr.get("rule_text") and (
        pr.get("counterfactual") or not require_counterfactual
    )
    if _prune_ok:
        patches.append(Patch(
            kind=pr.get("kind", "addition"),
            rule_text=pr["rule_text"].strip(),
            root_cause=pr.get("root_cause", "").strip(),
            source_task_id=task_id,
            source_outcome=outcome,
            action="prune",
            target_cost_sink=pr.get("target_cost_sink"),
            counterfactual=(pr.get("counterfactual") or "").strip(),
            skill_section=pr.get("skill_section", "Cost control"),
            analyst_turns=1,
            diagnostic_passed=True,
        ))

    return patches


# Back-compat shim for older callers expecting a single Patch
def propose_success_patch(**kwargs) -> Patch | None:
    patches = propose_success_patches(**kwargs)
    return patches[0] if patches else None

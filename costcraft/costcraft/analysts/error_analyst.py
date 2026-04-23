"""Error Analyst (A⁻) — multi-turn ReAct with oracle access.

Given a trajectory that FAILED + the gold answer, the analyst iteratively
narrows down the root cause of the failure and proposes a targeted patch.
Uses Claude via claude-agent-sdk with a simulated tool loop driven in Python:
each turn, the analyst can request a lookup (read input xlsx, inspect gold,
re-check mismatch cells), Python fulfills it, and the analyst uses the result
in the next turn.

Terminates when:
- analyst emits a final JSON patch with diagnostic_passed=true, OR
- turn budget exhausted (then emits a best-effort patch with
  diagnostic_passed=false, which the merge step deprioritizes).
"""
from __future__ import annotations
import json
from pathlib import Path

from ..claude import oneshot
from ..tracecard import TraceCard
from .patch import Patch


_SYS = """You are an Error Analyst for agent-skill distillation.

You are given ONE baseline trajectory that FAILED on its task, plus
deterministic evidence from a gold-answer oracle. Your job is to iteratively
narrow down the causal root of the failure and propose ONE generalizable rule
whose inclusion in a refined skill would prevent this class of failure on
UNSEEN tasks.

You may request additional evidence by emitting a JSON tool call. Supported
tools:
  - {"tool": "inspect_mismatches", "n": 5}   — return up to N failing cells with expected/got values
  - {"tool": "read_gold_snippet", "cell": "A1"}    — return the gold value at a cell
  - {"tool": "final_patch", "kind": ..., "rule_text": ..., ...}  — emit final patch

The tool budget is TIGHT (<=3 lookups). After you have enough evidence, emit
final_patch.

When emitting final_patch, include these keys:
  "tool": "final_patch"
  "kind": "addition" or "edition"
  "rule_text": string (1-3 sentences)
  "root_cause": string (one to two sentences, causal — e.g.
                "agent wrote formulas without computing values, so the xlsx
                 reader saw empty cells")
  "target_cost_sink": string or null (role_hint addressed; null if cost-agnostic)
  "skill_section": one of "Trigger" | "Workflow" | "Stop rules" | "Artifact checklist" | "Cost control"
  "diagnostic_passed": true if you have a causal explanation; false if you're guessing

Prefer CAUSAL rules over blanket caps. A good rule: "always compute values
via Python and write literals, because LibreOffice does not evaluate formulas
on headless save" — grounded in the mismatch pattern.

Do NOT propose caps on tool calls / LLM rounds unless evidence shows the agent
wasted specifically on that axis (e.g. redundant_tool_calls > 3 of same arg).

Output: ONE JSON object per turn, no markdown fence, no prose."""


def _trajectory_head(jsonl: str, max_chars: int = 4000) -> str:
    lines = [l for l in jsonl.splitlines() if l.strip()]
    if sum(len(l) for l in lines) <= max_chars:
        return "\n".join(lines)
    return "\n".join(lines[:3] + ["..."] + lines[-8:])[:max_chars]


def _strip_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        return text.strip()
    return text


def _first_user_msg(task_id: str, instruction: str, trajectory: str,
                    tc: TraceCard, mismatch_preview: list[dict]) -> str:
    mm = "\n".join(
        f"  - {m.get('check')}: expected={m.get('expected')!r} got={m.get('got')!r}"
        for m in mismatch_preview[:3]
    ) or "  (no mismatches recorded — agent may have produced no deliverable)"
    return (
        f"## Task (id: {task_id})\n\n"
        f"{instruction}\n\n"
        f"## Trajectory (JSONL excerpt)\n\n"
        f"```jsonl\n{_trajectory_head(trajectory)}\n```\n\n"
        f"## TraceCard\n\n"
        f"- total_cost_usd: {tc.total_cost_usd:.4f}\n"
        f"- llm_call_count: {tc.llm_call_count}  tool_call_count: {tc.tool_call_count}\n"
        f"- top_cost_spans:\n"
        + "\n".join(f"  - kind={s.get('kind')} role_hint={s.get('role_hint')} "
                    f"cost_usd={s.get('cost_usd'):.4f}"
                    for s in (tc.top_cost_spans or [])[:5])
        + f"\n- redundant_tool_calls: {len(tc.redundant_tool_calls or [])}\n"
        + f"- failed_or_repaired_steps: {len(tc.failed_or_repaired_steps or [])}\n\n"
        f"## Initial oracle evidence (mismatches)\n\n{mm}\n\n"
        "Begin analysis. Emit JSON tool calls one at a time."
    )


def _tool_inspect(mismatches: list[dict], n: int = 5) -> str:
    items = mismatches[:n]
    return "INSPECT_RESULT:\n" + "\n".join(
        f"  - {m.get('check')}: expected={m.get('expected')!r} got={m.get('got')!r}"
        for m in items
    ) or "INSPECT_RESULT: (none)"


def _tool_gold(cell: str, grading_items: list[dict]) -> str:
    for it in grading_items:
        if it.get("check", "").endswith(cell) or it.get("check") == cell:
            return f"GOLD[{cell}] = {it.get('expected')!r}"
    return f"GOLD[{cell}] = (not found)"


def propose_error_patch(
    *,
    task_id: str,
    instruction: str,
    trajectory_jsonl: str,
    tracecard: TraceCard,
    grading_items: list[dict],
    turn_budget: int = 3,
) -> Patch | None:
    """Run the ReAct analyst with a Python-driven tool loop."""
    # Partition grading items into mismatches
    mismatches = [i for i in grading_items if not i.get("passed", True)]
    transcript = []
    user_msg = _first_user_msg(task_id, instruction, trajectory_jsonl, tracecard, mismatches)

    for turn in range(turn_budget + 1):
        # Build conversation: first turn = user_msg; subsequent = transcript with new observation
        if turn == 0:
            resp = oneshot(user=user_msg, system=_SYS)
        else:
            # Append observation to transcript, send full conversation as user
            composed = "\n\n".join(transcript) + f"\n\nEmit your next JSON tool call."
            resp = oneshot(user=composed, system=_SYS)

        text = _strip_fence(resp.text)
        try:
            call = json.loads(text)
        except Exception:
            # One retry with "JSON only" reminder
            retry = oneshot(
                user=("Your previous response was not valid JSON. Respond with ONLY a valid "
                      "JSON tool call object. The schema is described in the system prompt."),
                system=_SYS,
            )
            text = _strip_fence(retry.text)
            try:
                call = json.loads(text)
            except Exception:
                return Patch(
                    kind="addition",
                    rule_text="(analyst failed to emit valid JSON after retry)",
                    root_cause="analyst parse error",
                    source_task_id=task_id,
                    source_outcome="failure",
                    action="repair",
                    target_cost_sink=None,
                    skill_section="Cost control",
                    analyst_turns=turn + 1,
                    diagnostic_passed=False,
                )

        tool = call.get("tool")
        transcript.append(f"ASSISTANT_TURN_{turn}: {json.dumps(call)}")

        if tool == "final_patch":
            return Patch(
                kind=call.get("kind", "addition"),
                rule_text=(call.get("rule_text") or "").strip(),
                root_cause=(call.get("root_cause") or "").strip(),
                source_task_id=task_id,
                source_outcome="failure",
                action="repair",
                target_cost_sink=call.get("target_cost_sink"),
                skill_section=call.get("skill_section", "Cost control"),
                analyst_turns=turn + 1,
                diagnostic_passed=bool(call.get("diagnostic_passed", True)),
            )

        if tool == "inspect_mismatches":
            obs = _tool_inspect(mismatches, n=int(call.get("n", 5)))
        elif tool == "read_gold_snippet":
            obs = _tool_gold(str(call.get("cell", "")), grading_items)
        else:
            obs = f"TOOL_ERROR: unknown tool {tool!r}. Emit final_patch now."

        transcript.append(f"OBSERVATION: {obs}")

    # Turn budget exhausted
    return Patch(
        kind="addition",
        rule_text="(turn budget exhausted before causal analysis completed)",
        root_cause="budget_exhausted",
        source_task_id=task_id,
        source_outcome="failure",
        action="repair",
        target_cost_sink=None,
        skill_section="Cost control",
        analyst_turns=turn_budget + 1,
        diagnostic_passed=False,
    )

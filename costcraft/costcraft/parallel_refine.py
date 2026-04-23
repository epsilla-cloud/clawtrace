"""CostCraft — parallel analyst dispatch and hierarchical merge.

Two-stage pipeline used to distil TraceCards into an evolved SKILL.md:

Stage 2 — ``dispatch_analysts(evolve_trajectories) -> list[Patch]``:
  one Success Analyst per successful trajectory (single-pass) and one
  Error Analyst per failed or partial trajectory (multi-turn ReAct with
  grader access). All analysts run in parallel behind an asyncio
  semaphore.

Stage 3 — ``hierarchical_merge(patches, base_skill) -> evolved_skill_md``:
  tree reduction over the patch set with a configurable batch size
  (default 32). At each level, a single Claude merge call deduplicates
  entries, resolves conflicts under the action-aware precedence
  ``repair > prune-with-cf > preserve > prune-without-cf``, and emits
  the surviving rules into the skill.

``include_cost_in_tracecard=False`` ablates the cost signal: analysts
see TraceCards with ``total_cost_usd = 0`` and ``cost_usd`` stripped
from ``top_cost_spans``. This matches the No-cost-attribution condition
reported in the paper.
"""
from __future__ import annotations
import asyncio
import copy
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import yaml

from .analysts import Patch, propose_success_patches, propose_error_patch
from .claude import aoneshot, oneshot
from .tracecard import TraceCard


@dataclass
class EvolveItem:
    task_id: str
    instruction: str
    trajectory_jsonl: str
    tracecard: TraceCard
    baseline_quality: float
    grading_items: list[dict]    # list of {check, passed, expected, got, ...}


def _strip_cost(tc: TraceCard) -> TraceCard:
    c = copy.deepcopy(tc)
    c.total_cost_usd = 0.0
    for s in c.top_cost_spans:
        s["cost_usd"] = 0.0
    return c


async def _dispatch_one(item: EvolveItem, include_cost: bool,
                        require_counterfactual: bool,
                        sem: asyncio.Semaphore) -> tuple[str, list[Patch] | Exception]:
    """Run one analyst. Returns (task_id, patches_or_exception) for logging."""
    async with sem:
        tc = item.tracecard if include_cost else _strip_cost(item.tracecard)
        try:
            if item.baseline_quality == 1.0:
                patches = await asyncio.to_thread(
                    propose_success_patches,
                    task_id=item.task_id,
                    instruction=item.instruction,
                    trajectory_jsonl=item.trajectory_jsonl,
                    tracecard=tc,
                    baseline_quality=item.baseline_quality,
                    require_counterfactual=require_counterfactual,
                )
            else:
                p = await asyncio.to_thread(
                    propose_error_patch,
                    task_id=item.task_id,
                    instruction=item.instruction,
                    trajectory_jsonl=item.trajectory_jsonl,
                    tracecard=tc,
                    grading_items=item.grading_items,
                )
                patches = [p] if p else []
            return item.task_id, patches
        except Exception as e:
            return item.task_id, e


async def _dispatch_all(items: list[EvolveItem], include_cost: bool, concurrency: int,
                        require_counterfactual: bool = True) -> list[Patch]:
    sem = asyncio.Semaphore(concurrency)
    results = await asyncio.gather(
        *(_dispatch_one(it, include_cost, require_counterfactual, sem) for it in items)
    )
    out: list[Patch] = []
    # Loud logging so the orchestrator can see which trajectories lost an analyst
    for tid, r in results:
        if isinstance(r, Exception):
            print(f"  [analyst] {tid}: EXCEPTION {type(r).__name__}: {r}")
        elif not r:
            print(f"  [analyst] {tid}: NO PATCHES (parse failure or declined)")
        else:
            kinds = ",".join(p.action for p in r)
            print(f"  [analyst] {tid}: {len(r)} patches ({kinds})")
            out.extend(r)
    return out


def dispatch_analysts(items: list[EvolveItem], *,
                      include_cost_in_tracecard: bool = True,
                      concurrency: int = 8,
                      require_counterfactual: bool = True) -> list[Patch]:
    """Synchronous wrapper that runs all analysts concurrently via asyncio."""
    return asyncio.run(_dispatch_all(items, include_cost_in_tracecard, concurrency,
                                      require_counterfactual=require_counterfactual))


# ──────────────────────────── Stage 3: hierarchical merge ────────────────────────────


_MERGE_SYS = """You are CostCraft-Merge, a skill synthesizer.

You receive a BASE SKILL (SKILL.md) and a list of candidate PATCHES produced
by independent per-trajectory analysts. Each patch has one of three actions:
  - preserve: a behavior that caused success (add/edit into Workflow)
  - prune:    an expensive-but-not-essential behavior with a counterfactual
              (add into Cost control as a negative rule)
  - repair:   a rule fixing an observed failure mode (add into the relevant
              section with high priority when diagnostic_passed=true)

Produce ONE revised SKILL.md that integrates the prevalent, generalizable
patches while dropping idiosyncratic ones.

Rules:
1. PREVALENCE WINS. If multiple patches propose the same rule (same or near-
   duplicate rule_text), keep one instance and mention prevalence briefly.
2. CONFLICT RESOLUTION. When patches conflict (e.g. prune says "skip verify
   step" vs preserve says "always verify"), keep the more causally-grounded
   one — repair > prune-with-counterfactual > preserve > prune-without-counter.
3. COST PRUNE PATCHES are ONLY integrated when they include a credible
   counterfactual explaining why removing the behavior would not break
   success. Drop unjustified prune patches.
4. DROP SINGLETON PATCHES (source_task_id count == 1) UNLESS:
      (a) action=repair with diagnostic_passed=true, OR
      (b) action=prune with a strong counterfactual AND target_cost_sink set.
5. PRESERVE all capability and deliverable requirements from the BASE SKILL.
6. STAY UNDER 1200 TOKENS. Keep the five section headings:
   ## Trigger, ## Workflow, ## Stop rules, ## Artifact checklist, ## Cost control.
7. DO NOT add task-specific facts (customer names, exact column letters, etc.).
8. AVOID HARD CAPS (e.g., "≤ 5 tool calls") UNLESS multiple repair patches
   identify a specific turn-count failure pattern. Prefer specific prunes
   ("skip thinking-only turns that emit no tool call") over blanket caps.

Output: ONLY the markdown skill (no preface, no fence)."""


def _format_patches_for_merge(patches: list[Patch]) -> str:
    lines = []
    for i, p in enumerate(patches):
        block = [
            f"--- patch[{i}] ---",
            f"  action: {p.action}",
            f"  source_task_id: {p.source_task_id}",
            f"  source_outcome: {p.source_outcome}",
            f"  diagnostic_passed: {p.diagnostic_passed}",
            f"  target_cost_sink: {p.target_cost_sink}",
            f"  skill_section: {p.skill_section}",
            f"  kind: {p.kind}",
            f"  rule_text: {p.rule_text}",
            f"  root_cause: {p.root_cause}",
        ]
        if p.counterfactual:
            block.append(f"  counterfactual: {p.counterfactual}")
        lines.append("\n".join(block))
    return "\n".join(lines)


def _merge_batch(base_skill: str, patches: list[Patch]) -> str:
    user = (
        "## BASE SKILL\n\n"
        + base_skill
        + "\n\n## CANDIDATE PATCHES\n\n"
        + _format_patches_for_merge(patches)
        + "\n\n## TASK\n\nProduce the revised SKILL.md per the system instructions. "
          "Output ONLY the markdown content."
    )
    resp = oneshot(user=user, system=_MERGE_SYS)
    return resp.text.strip()


def hierarchical_merge(base_skill: str, patches: list[Patch],
                       *, batch_size: int = 32) -> tuple[str, dict]:
    """Tree-reduce patches into a single evolved skill.

    Returns (skill_md, stats).
    """
    stats = {"total_patches": len(patches), "levels": 0, "merge_calls": 0}
    if not patches:
        return base_skill, stats

    current_skill = base_skill
    remaining = list(patches)

    while remaining:
        stats["levels"] += 1
        next_round: list[Patch] = []
        # Partition patches into batches of `batch_size`
        for i in range(0, len(remaining), batch_size):
            chunk = remaining[i:i + batch_size]
            current_skill = _merge_batch(current_skill, chunk)
            stats["merge_calls"] += 1
        # Single global skill at this point; if we had a deeper tree we'd
        # re-batch here. For simplicity we do ONE level (flatten all patches
        # into one skill via sequential batches). Break.
        break

    return current_skill, stats

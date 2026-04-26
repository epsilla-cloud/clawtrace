"""Skill-patch data structure shared by success/error analysts."""
from __future__ import annotations
import json
from dataclasses import dataclass, asdict, field
from pathlib import Path
from typing import Literal


@dataclass
class Patch:
    kind: Literal["addition", "edition"]
    rule_text: str                         # Markdown-ready rule to add to the skill
    root_cause: str                        # One-to-two-sentence justification grounded in the trajectory
    source_task_id: str                    # Provenance (which trajectory produced this patch)
    source_outcome: Literal["success", "failure", "partial"]
    # action classifies what this patch does to agent behavior:
    #   preserve  — retain a success-critical behavior (default for success analyst)
    #   prune     — remove an expensive-but-not-essential behavior observed in a success
    #   repair    — fix a failure mode (default for error analyst)
    action: Literal["preserve", "prune", "repair"] = "preserve"
    target_cost_sink: str | None = None    # Which role_hint this rule prunes (e.g. "thinking_only"); None if not cost-driven
    counterfactual: str = ""               # For prune patches: why removing this behavior wouldn't have broken the success
    skill_section: str = "Cost control"    # Which SKILL.md section this rule belongs to
    analyst_turns: int = 1                 # For error analyst: number of ReAct turns used
    diagnostic_passed: bool = True         # For error analyst: True if a valid causal analysis was reached

    def to_dict(self) -> dict:
        return asdict(self)


def dump_patches(patches: list[Patch], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps([p.to_dict() for p in patches], indent=2, ensure_ascii=False))


def load_patches(in_path: Path) -> list[Patch]:
    data = json.loads(in_path.read_text())
    return [Patch(**d) for d in data]

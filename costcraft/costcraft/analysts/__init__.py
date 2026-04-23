"""Per-trajectory analysts (Trace2Skill §2.3 architecture).

- success_analyst: single-pass extraction of generalizable behavior from a
  success trajectory.
- error_analyst: multi-turn ReAct with oracle access to the gold answer,
  narrows down root cause of a failure and proposes a patch.

Both produce a structured Patch with fields:
  - kind: "addition" | "edition"
  - rule_text: the proposed rule (natural language for the skill)
  - root_cause: why this rule is proposed (1-2 sentences)
  - target_cost_sink: optional — which `top_cost_span.role_hint` this rule
    addresses (for cost-tagged merge). None if not cost-driven.
  - source_task_id: for provenance.
"""
from .patch import Patch, dump_patches
from .success_analyst import propose_success_patch, propose_success_patches
from .error_analyst import propose_error_patch

__all__ = ["Patch", "dump_patches", "propose_success_patch",
           "propose_success_patches", "propose_error_patch"]

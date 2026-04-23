"""Static guard: validate refined skill artifacts before evaluation."""
from __future__ import annotations
import re
from dataclasses import dataclass


REQUIRED_SECTIONS = [
    "trigger",
    "workflow",
    "stop rules",
    "artifact checklist",
    "cost control",
]


@dataclass
class GuardResult:
    passed: bool
    violations: list[str]
    token_estimate: int


def _approx_token_count(text: str) -> int:
    """Rough token estimate: 1 token ≈ 4 chars (English). Sufficient for a cap check."""
    return max(1, len(text) // 4)


def static_guard(
    refined_skill: str,
    *,
    token_cap: int = 1200,
    required_sections: list[str] | None = None,
    forbidden_substrings: list[str] | None = None,
) -> GuardResult:
    """Validate refined skill against static constraints.

    `forbidden_substrings` is used to detect train-set leakage — pass known
    task-specific tokens (customer names, SKU codes, etc.) that must NOT
    appear in the generalized refined skill.
    """
    violations: list[str] = []
    token_est = _approx_token_count(refined_skill)

    if token_est > token_cap:
        violations.append(f"token_cap_exceeded: {token_est} > {token_cap}")

    lower = refined_skill.lower()
    for sec in (required_sections or REQUIRED_SECTIONS):
        if sec.lower() not in lower:
            violations.append(f"missing_section: {sec}")

    if forbidden_substrings:
        for s in forbidden_substrings:
            if s.lower() in lower:
                violations.append(f"leaked_train_string: {s}")

    # Markdown sanity: at least one heading
    if not re.search(r"^#\s", refined_skill, flags=re.MULTILINE):
        violations.append("no_markdown_headings")

    return GuardResult(
        passed=not violations,
        violations=violations,
        token_estimate=token_est,
    )

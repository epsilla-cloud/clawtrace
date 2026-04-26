"""Per-run workspace staging and collection for OpenClaw agents.

OpenClaw runs inside ``~/.openclaw/workspace/``. To isolate runs from
each other, :func:`prepare` copies a task's reference files into a
per-run subdirectory, the agent is launched with that subdirectory as
its working directory, and :func:`collect` pulls the resulting
deliverables back to a repository-tracked location once the run
completes. :func:`sanitize_workspace` clears leftover state between
runs while preserving the files OpenClaw itself expects at the
workspace root.
"""
from __future__ import annotations
import shutil
import uuid
from pathlib import Path

OPENCLAW_WORKSPACE = Path.home() / ".openclaw" / "workspace"

# Bootstrap files OpenClaw expects at workspace root — keep these.
# Everything else at the root is an artifact from a prior agent run and must
# be removed to keep evaluation runs independent.
_BOOTSTRAP_KEEP = {
    "AGENTS.md", "IDENTITY.md", "HEARTBEAT.md", "BOOTSTRAP.md",
    "USER.md", "SOUL.md", "TOOLS.md",
    ".venv", ".git", ".claude", ".openclaw", "costcraft",
}

_EXPECTED_WORKSPACE = Path.home() / ".openclaw" / "workspace"


def sanitize_workspace() -> None:
    """Erase cross-run state from the OpenClaw workspace root.

    Safety: refuses to run if OPENCLAW_WORKSPACE is not the exact expected path
    (~/.openclaw/workspace). Only touches files inside that directory.
    """
    if OPENCLAW_WORKSPACE.resolve() != _EXPECTED_WORKSPACE.resolve():
        raise RuntimeError(
            f"sanitize_workspace refused: OPENCLAW_WORKSPACE={OPENCLAW_WORKSPACE} "
            f"is not the expected {_EXPECTED_WORKSPACE}"
        )
    if not OPENCLAW_WORKSPACE.exists():
        return

    # 1. Clear memory/ (cross-session user memory)
    mem = OPENCLAW_WORKSPACE / "memory"
    if mem.exists() and mem.is_dir():
        for child in mem.iterdir():
            if child.is_file():
                child.unlink()
            elif child.is_dir():
                shutil.rmtree(child)

    # 2. Remove stray files at workspace root that aren't bootstrap
    for child in OPENCLAW_WORKSPACE.iterdir():
        if child.name in _BOOTSTRAP_KEEP or child.name == "memory":
            continue
        if child.is_file():
            child.unlink()
        elif child.is_dir():
            shutil.rmtree(child)


def prepare(task_id: str, reference_paths: list[Path], run_tag: str | None = None) -> Path:
    """Copy reference files into an isolated run subdir. Return its path."""
    sanitize_workspace()
    run_tag = run_tag or uuid.uuid4().hex[:8]
    run_dir = OPENCLAW_WORKSPACE / "costcraft" / task_id / run_tag
    if run_dir.exists():
        shutil.rmtree(run_dir)
    run_dir.mkdir(parents=True, exist_ok=True)
    for src in reference_paths:
        if not src.exists():
            raise FileNotFoundError(f"reference file missing: {src}")
        shutil.copy2(src, run_dir / src.name)
    return run_dir


def collect(run_dir: Path, dest: Path, *, ignore_inputs: set[str] | None = None) -> list[Path]:
    """Copy deliverables (new files produced by the agent) to `dest`.

    `ignore_inputs` is the set of input filenames that existed before the run;
    any file NOT in that set is treated as produced by the agent.
    """
    dest.mkdir(parents=True, exist_ok=True)
    ignore_inputs = ignore_inputs or set()
    collected: list[Path] = []
    for item in run_dir.iterdir():
        if item.name in ignore_inputs or item.name.startswith("."):
            continue
        target = dest / item.name
        if item.is_file():
            shutil.copy2(item, target)
            collected.append(target)
        elif item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True)
            collected.append(target)
    return collected


def relative_for_prompt(run_dir: Path) -> str:
    """Return a relative path suitable for embedding in the agent prompt."""
    try:
        return str(run_dir.relative_to(OPENCLAW_WORKSPACE))
    except ValueError:
        return str(run_dir)

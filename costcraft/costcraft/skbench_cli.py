"""SkillsBench CLI — run OpenClaw on a SkillsBench task, grade via Docker verifier.

Subcommands:
  run-one   — stage inputs from tasks/<name>/environment/, run agent, collect deliverable
  grade     — build task's Docker image, copy deliverable to /root/, run tests/test.sh
"""
from __future__ import annotations
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

import click

from . import workspace as ws
from .runner import run_openclaw


REPO_ROOT = Path(__file__).resolve().parents[2]
SKB_REPO = REPO_ROOT / "skillsbench" / "repo" / "tasks"
SKB_RUNS = REPO_ROOT / "skillsbench" / "runs"
SKB_SKILLS_DEFAULT = Path(__file__).resolve().parent / "skills" / "default_skill.md"


_ENV_SKIP = {"Dockerfile", "skills", "docker-compose.yaml", ".dockerignore"}


def _collect_inputs(env_dir: Path) -> list[Path]:
    return [c for c in sorted(env_dir.iterdir()) if c.name not in _ENV_SKIP]


def _stage_inputs(inputs: list[Path], run_dir: Path) -> None:
    for src in inputs:
        dst = run_dir / src.name
        if src.is_dir():
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)


def _compose_prompt(skill_md: str, instruction: str, work_rel: str) -> str:
    # Instructions reference /root/... paths. Rewrite them to workspace-relative
    # so the agent operates on the staged copies; the grader later copies the
    # workspace contents back to /root/ inside the Docker container.
    rewritten = instruction.replace("/root/", f"{work_rel}/").replace("`/root`", f"`{work_rel}`")
    return (
        "## Skill context (follow this carefully)\n\n"
        f"{skill_md}\n\n"
        "## Working directory\n\n"
        f"All files for this task live under `{work_rel}/` (relative to your workspace root).\n"
        "Read inputs from that subdirectory and save every deliverable there.\n"
        "Do NOT save to the workspace root.\n\n"
        "## Critical execution rules\n\n"
        "1. **Do NOT use the `read` tool on data files** (`.xlsx`, `.csv`, `.json`, `.pdf`, `.txt` larger than a few KB). "
        "The `read` tool pulls the whole file into your context and will exhaust your token budget. "
        "Instead, write a small Python script and run it with `exec`; the script reads the file with `pandas`, "
        "`openpyxl`, `json`, or `pypdf` as appropriate.\n"
        "2. **Write the required output file before your turn ends.** The task will be graded by a deterministic "
        "verifier that checks for the exact file path named in the instruction. If you plan to compute and "
        "write, do both in a single `exec` call rather than separate thinking turns.\n"
        "3. **End your turn with a short summary** naming the output file you wrote. Do not run further "
        "exploration after the write.\n\n"
        "## Instruction\n\n"
        f"{rewritten}\n"
    )


@click.group()
def main():
    """CostCraft SkillsBench CLI."""


@main.command("run-one")
@click.option("--task", required=True, help="SkillsBench task name, e.g. financial-modeling-qa")
@click.option("--condition", default="baseline_default")
@click.option("--skill-path", type=click.Path(path_type=Path), default=None)
@click.option("--model", default="openai-codex/gpt-5.4")
@click.option("--thinking", default="low")
@click.option("--seed", type=int, default=0)
@click.option("--timeout", type=int, default=1200)
def run_one(task, condition, skill_path, model, thinking, seed, timeout):
    task_dir = SKB_REPO / task
    if not task_dir.exists():
        click.echo(f"[ERROR] task {task} not found at {task_dir}", err=True)
        sys.exit(1)
    instruction = (task_dir / "instruction.md").read_text()
    inputs = _collect_inputs(task_dir / "environment")
    skill_path = skill_path or SKB_SKILLS_DEFAULT
    skill_md = Path(skill_path).read_text()

    run_tag = f"{condition}_{seed}"
    per_run_out = SKB_RUNS / task / run_tag
    per_run_out.mkdir(parents=True, exist_ok=True)

    ws.sanitize_workspace()
    run_dir = ws.OPENCLAW_WORKSPACE / "costcraft" / f"skb-{task}" / run_tag
    if run_dir.exists():
        shutil.rmtree(run_dir)
    run_dir.mkdir(parents=True, exist_ok=True)
    _stage_inputs(inputs, run_dir)

    work_rel = ws.relative_for_prompt(run_dir)
    prompt = _compose_prompt(skill_md, instruction, work_rel)

    click.echo(f"[skb-run] task={task} cond={condition} model={model} work_rel={work_rel}")
    t0 = time.time()
    result = run_openclaw(
        message=prompt,
        workspace_dir=run_dir,
        model=model,
        thinking=thinking,
        timeout_s=timeout,
    )
    dur = time.time() - t0

    deliverable_dir = per_run_out / "deliverable"
    if deliverable_dir.exists():
        shutil.rmtree(deliverable_dir)
    shutil.copytree(run_dir, deliverable_dir)

    session_src = Path.home() / ".openclaw" / "agents" / "main" / "sessions" / f"{result.session_id}.jsonl"
    if session_src.exists():
        (per_run_out / "trace.jsonl").write_text(session_src.read_text())

    meta = {
        "benchmark": "skillsbench",
        "task_id": task,
        "condition": condition,
        "model": model,
        "thinking": thinking,
        "seed": seed,
        "skill_path": str(skill_path),
        "session_id": result.session_id,
        "trace_id": result.trace_id,
        "exit_code": result.exit_code,
        "duration_s": dur,
        "workspace_dir": str(run_dir),
        "final_message_head": result.final_message[:2000],
    }
    (per_run_out / "run_meta.json").write_text(json.dumps(meta, indent=2))
    (per_run_out / "stdout.log").write_text(result.stdout)
    (per_run_out / "stderr.log").write_text(result.stderr)
    click.echo(f"[done] exit={result.exit_code} dur={dur:.1f}s deliverable={deliverable_dir}")


@main.command("grade")
@click.option("--run-dir", required=True, type=click.Path(path_type=Path, exists=True))
@click.option("--build-timeout", type=int, default=900)
@click.option("--run-timeout", type=int, default=900)
@click.option("--reuse-image/--rebuild", default=True, help="Reuse docker image if present")
def grade(run_dir, build_timeout, run_timeout, reuse_image):
    run_dir = Path(run_dir)
    meta = json.loads((run_dir / "run_meta.json").read_text())
    task_name = meta["task_id"]
    task_dir = SKB_REPO / task_name
    env_dir = task_dir / "environment"
    tests_dir = task_dir / "tests"
    deliverable = run_dir / "deliverable"
    img = f"skbench-eval-{task_name.lower()}"

    click.echo(f"[skb-grade] task={task_name}")

    # 1. Build docker image (unless cached)
    need_build = True
    if reuse_image:
        r = subprocess.run(["docker", "image", "inspect", img],
                           capture_output=True, text=True)
        if r.returncode == 0:
            need_build = False
            click.echo(f"[skb-grade] reusing image {img}")
    if need_build:
        build_log = run_dir / "docker_build.log"
        click.echo(f"[skb-grade] building {img} …")
        with open(build_log, "w") as f:
            p = subprocess.run(
                ["docker", "build", "-t", img, str(env_dir)],
                stdout=f, stderr=subprocess.STDOUT, timeout=build_timeout,
            )
        if p.returncode != 0:
            _write_grading(run_dir, reward="BUILD_FAIL",
                           error=f"docker build rc={p.returncode}; see docker_build.log")
            click.echo(f"[skb-grade] BUILD_FAIL — see {build_log}")
            return

    # 2. Create + start container
    cid = subprocess.check_output([
        "docker", "create", "-w", "/root", img, "sleep", "1800"
    ]).decode().strip()
    subprocess.run(["docker", "start", cid], check=True, capture_output=True)

    reward = "NO_REWARD"
    try:
        # 3. Copy deliverable into /root/
        if deliverable.exists():
            for child in deliverable.iterdir():
                subprocess.run(
                    ["docker", "cp", str(child), f"{cid}:/root/{child.name}"],
                    check=True, capture_output=True,
                )
        else:
            click.echo(f"[skb-grade] WARN: no deliverable at {deliverable}")

        # 4. Prepare /tests and /logs/verifier, copy test files
        subprocess.run(["docker", "exec", cid, "mkdir", "-p", "/tests", "/logs/verifier"],
                       check=True, capture_output=True)
        for tf in tests_dir.iterdir():
            subprocess.run(["docker", "cp", str(tf), f"{cid}:/tests/"],
                           check=True, capture_output=True)

        # 5. Run test.sh
        test_log = run_dir / "test.log"
        with open(test_log, "w") as f:
            subprocess.run(
                ["docker", "exec", cid, "bash", "/tests/test.sh"],
                stdout=f, stderr=subprocess.STDOUT, timeout=run_timeout,
            )

        # 6. Extract reward.txt
        dst_reward = run_dir / "reward.txt"
        rp = subprocess.run(
            ["docker", "cp", f"{cid}:/logs/verifier/reward.txt", str(dst_reward)],
            capture_output=True, timeout=30,
        )
        if dst_reward.exists():
            reward = dst_reward.read_text().strip() or "EMPTY"
        else:
            reward = "NO_REWARD"

        # Grab ctrf.json if present
        subprocess.run(
            ["docker", "cp", f"{cid}:/logs/verifier/ctrf.json", str(run_dir / "ctrf.json")],
            capture_output=True, timeout=30,
        )
    finally:
        subprocess.run(["docker", "rm", "-f", cid], capture_output=True, timeout=30)

    _write_grading(run_dir, reward=reward)
    click.echo(f"[skb-grade] task={task_name} reward={reward}")


def _write_grading(run_dir: Path, *, reward: str, error: str | None = None):
    try:
        val = float(reward)
        passed = (val == 1.0)
        normalized = min(max(val, 0.0), 1.0)
    except (ValueError, TypeError):
        passed = False
        normalized = 0.0
    (run_dir / "grading.json").write_text(json.dumps({
        "reward_raw": reward,
        "passed": passed,
        "normalized": normalized,
        "error": error,
    }, indent=2))


if __name__ == "__main__":
    main()

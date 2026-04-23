"""GDPval dataset adapter — loads tasks from the local parquet + file tree."""
from __future__ import annotations
import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import pandas as pd


GDPVAL_ROOT = Path(__file__).resolve().parents[2] / "gdpval"
PARQUET = GDPVAL_ROOT / "data" / "train-00000-of-00001.parquet"
REFERENCE_ROOT = GDPVAL_ROOT / "reference_files"
DELIVERABLE_ROOT = GDPVAL_ROOT / "deliverable_files"


@dataclass
class GdpvalTask:
    task_id: str
    occupation: str
    sector: str
    prompt: str
    reference_files: list[Path]
    reference_file_names: list[str]
    gold_deliverables: list[Path]
    rubric_pretty: str
    rubric_json: list[dict]


@lru_cache(maxsize=1)
def _load_df() -> pd.DataFrame:
    return pd.read_parquet(PARQUET)


def _safe_list(v) -> list:
    """Convert a pandas cell value to a plain Python list (handles numpy arrays)."""
    if v is None:
        return []
    try:
        # numpy arrays, pandas Series
        return list(v)
    except Exception:
        return [v]


def _resolve_reference_files(row) -> tuple[list[Path], list[str]]:
    """`reference_files` cell holds entries like 'reference_files/<hash>/<name>'."""
    paths: list[Path] = []
    names: list[str] = []
    for rel in _safe_list(row.get("reference_files")):
        rel_s = str(rel)
        p = GDPVAL_ROOT / rel_s
        if p.exists():
            paths.append(p)
            names.append(p.name)
    return paths, names


def _resolve_deliverables(row) -> list[Path]:
    out: list[Path] = []
    for rel in _safe_list(row.get("deliverable_files")):
        p = GDPVAL_ROOT / str(rel)
        if p.exists():
            out.append(p)
    return out


def _parse_rubric_json(raw) -> list[dict]:
    if raw is None:
        return []
    if isinstance(raw, list):
        return list(raw)
    if isinstance(raw, str):
        try:
            return list(json.loads(raw))
        except Exception:
            return []
    return []


def get_task(task_id: str) -> GdpvalTask:
    df = _load_df()
    rows = df[df["task_id"] == task_id]
    if rows.empty:
        raise KeyError(f"task not found: {task_id}")
    row = rows.iloc[0].to_dict()
    ref_paths, ref_names = _resolve_reference_files(row)
    golds = _resolve_deliverables(row)
    return GdpvalTask(
        task_id=task_id,
        occupation=row.get("occupation") or "",
        sector=row.get("sector") or "",
        prompt=row.get("prompt") or "",
        reference_files=ref_paths,
        reference_file_names=ref_names,
        gold_deliverables=golds,
        rubric_pretty=row.get("rubric_pretty") or "",
        rubric_json=_parse_rubric_json(row.get("rubric_json")),
    )

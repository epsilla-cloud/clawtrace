"""SpreadsheetBench dataset adapter — parallel to gdpval.py."""
from __future__ import annotations
import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


SB_ROOT = Path(__file__).resolve().parents[2] / "spreadsheetbench"
DATASET_JSON = SB_ROOT / "data" / "dataset.json"
SPREADSHEET_ROOT = SB_ROOT / "data" / "spreadsheet"


@dataclass
class SBTask:
    task_id: str
    instruction: str
    instruction_type: str            # "Cell-Level Manipulation" or "Sheet-Level Manipulation"
    answer_position: str             # e.g. "H3:H5" or "'Sheet1'!B"
    test_cases: list[dict]           # [{index, input: Path, answer: Path}, ...]
    reference_files: list[Path]      # test case 1's input file
    reference_file_names: list[str]

    # Provide `prompt` attribute for compatibility with gdpval harness code
    @property
    def prompt(self) -> str:
        return self.instruction


@lru_cache(maxsize=1)
def _load_dataset() -> list[dict]:
    return json.loads(DATASET_JSON.read_text())


def _build_task(rec: dict) -> SBTask:
    folder = SPREADSHEET_ROOT / str(rec["id"])
    cases = []
    if folder.exists():
        for f in sorted(folder.iterdir()):
            if f.name.endswith("_input.xlsx"):
                try:
                    i = int(f.name.split("_")[0])
                except ValueError:
                    continue
                ans_name = f.name.replace("_input.xlsx", "_answer.xlsx")
                ans = folder / ans_name
                if ans.exists():
                    cases.append({"index": i, "input": f, "answer": ans})
    cases.sort(key=lambda c: c["index"])
    if not cases:
        return SBTask(
            task_id=str(rec["id"]),
            instruction=rec.get("instruction", ""),
            instruction_type=rec.get("instruction_type", "Cell-Level Manipulation"),
            answer_position=rec.get("answer_position", ""),
            test_cases=[],
            reference_files=[],
            reference_file_names=[],
        )
    primary = cases[0]["input"]
    return SBTask(
        task_id=str(rec["id"]),
        instruction=rec.get("instruction", ""),
        instruction_type=rec.get("instruction_type", "Cell-Level Manipulation"),
        answer_position=rec.get("answer_position", ""),
        test_cases=cases,
        reference_files=[primary],
        reference_file_names=[primary.name],
    )


def get_task(task_id: str) -> SBTask:
    for rec in _load_dataset():
        if str(rec["id"]) == str(task_id):
            return _build_task(rec)
    raise KeyError(f"SB task not found: {task_id}")


def all_tasks() -> list[dict]:
    return _load_dataset()

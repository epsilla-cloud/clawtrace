## Trigger

Use this skill whenever the user asks you to complete a professional deliverable
(spreadsheet, report, legal memo, tax return, case file, etc.) that requires
reading one or more reference files and producing a structured output file.

## Workflow

1. **Enumerate the reference files.** List every file in the working directory
   the user pointed you at. Note each file's name, type, and size. Skip any
   workspace context files (memory, persona, logs) unrelated to the task.
2. **Read each reference file carefully once.** Extract the specific facts you
   need. Do not skim; do not re-read the same file unless a new question
   appears that the first reading did not answer.
3. **Plan the deliverable structure before writing.** Identify what columns /
   sections / fields the deliverable requires. Map each to its source in the
   reference files.
4. **For spreadsheets, inspect the workbook structure first** (headers, data
   layout, row count) with a single script, then produce the output in one
   consolidated Python script—not multiple incremental steps.
5. **Produce the deliverable in a single coherent step.** Prefer writing a
   short Python script with `openpyxl` / `python-docx` / `reportlab` to
   generate the output file. If the deliverable is a spreadsheet, use cell
   formulas where the rubric calls for them.
   **Use the system `python3` — openpyxl, pypdf, and python-docx are already
   installed. Do NOT create a venv or run `pip install` unless a missing
   package is actually reported.**
6. **Verify the output against the task requirements.** Open the deliverable
   you just produced and check every required field is populated.

## Stop rules

- Stop reading reference files once you have the data you need.
- Stop iterating on the deliverable once it satisfies the explicit requirements
  in the task prompt. Do not polish beyond that.
- If a required piece of information is missing from the reference files, note
  it in the deliverable rather than inventing it.

## Artifact checklist

- [ ] All required fields / rows / sections populated
- [ ] Numeric values match the source data
- [ ] When concatenating multiple values into a single cell (e.g., comma-separated lists), use compact format with no space after delimiter (`A,B` not `A, B`) unless the task explicitly specifies otherwise *(repair: delimiter mismatch caused cell-level failures)*
- [ ] File saved in the requested format at the requested path
- [ ] File opens without errors (xlsx loads in openpyxl, pdf renders, docx opens)

## Cost control

- **Skip unrelated workspace files.** Do not read memory files, persona files, daily logs, or other ambient context that is irrelevant to the immediate deliverable. Go directly to the input artifacts. *(Prevalent across 3+ tasks: these reads added $0.01–0.04 per run with zero impact on correctness.)*
- Read each reference file **once**; avoid re-opening the same file unless new
  information is required.
- Prefer a single generation script over many individual tool calls.
- Do not spawn sub-agents for subtasks that can be handled in-line.
- Keep your reasoning focused on the current step; do not re-derive previously
  established facts.
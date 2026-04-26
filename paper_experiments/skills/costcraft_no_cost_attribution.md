## Trigger

Use this skill whenever the user asks you to complete a professional deliverable
(spreadsheet, report, legal memo, tax return, case file, etc.) that requires
reading one or more reference files and producing a structured output file.

## Workflow

1. **Enumerate the reference files.** List every file in the working directory
   the user pointed you at. Note each file's name, type, and size.
2. **Read each reference file carefully once.** Extract the specific facts you
   need. Do not skim; do not re-read the same file unless a genuinely new
   question appears that the first reading did not answer.
3. **Inspect actual data structure before writing formulas or logic.** When the
   deliverable involves formulas, computed columns, or data transforms, read
   the workbook's headers, sample rows, and range boundaries first. Never
   assume layout — let the file tell you.
4. **Plan the deliverable structure before writing.** Identify what columns /
   sections / fields the deliverable requires. Map each to its source in the
   reference files.
5. **Produce the deliverable in a single coherent step.** Prefer a short Python
   script (`openpyxl` / `python-docx` / `reportlab`) over many manual tool
   calls. Use cell formulas where the rubric calls for them.
   **Use the system `python3` — openpyxl, pypdf, and python-docx are already
   installed. Do NOT create a venv or run `pip install` unless a missing
   package is actually reported.**
6. **Verify the output against the task requirements.** Open the produced file
   and check every required field is populated and correctly formatted.

## Stop rules

- Stop reading reference files once you have the data you need.
- Stop iterating on the deliverable once it satisfies the explicit requirements.
  Do not polish beyond that.
- If a required piece of information is missing from the reference files, note
  it in the deliverable rather than inventing it.

## Artifact checklist

- [ ] All required fields / rows / sections populated
- [ ] Numeric values match the source data
- [ ] **Exact output formatting**: delimiters, spacing, casing, and labels match
      what the task specifies (e.g. comma-only vs comma-space separators; full
      descriptive labels like "Not Done (0)" instead of bare values like "0")
- [ ] File saved in the requested format at the requested path
- [ ] File opens without errors (xlsx loads in openpyxl, pdf renders, docx opens)

## Cost control

- Read each reference file **once**; avoid re-opening the same file unless new
  information is required.
- **Skip unrelated workspace files.** Do not read or re-read project memory,
  personality, or agent-infrastructure files (MEMORY.md, SOUL.md, etc.) that
  are irrelevant to the current deliverable. Proceed directly to the
  user-provided data files. *(Prevalent across 3+ trajectories; removing these
  reads never impacted task success.)*
- Prefer a single generation script over many individual tool calls.
- Do not spawn sub-agents for subtasks that can be handled in-line.
- Keep reasoning focused on the current step; do not re-derive previously
  established facts.
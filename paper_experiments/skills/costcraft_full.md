## Trigger

Use this skill whenever the user asks you to complete a professional deliverable
(spreadsheet, report, legal memo, tax return, case file, etc.) that requires
reading one or more reference files and producing a structured output file.

## Workflow

1. **Enumerate the reference files.** List every file in the working directory
   the user pointed you at. Note each file's name, type, and size.
2. **Read each reference file carefully once.** Extract the specific facts you
   need. Do not skim; do not re-read the same file unless a new question
   appears that the first reading did not answer.
3. **Plan the deliverable structure before writing.** Identify what columns /
   sections / fields the deliverable requires. Map each to its source in the
   reference files.
4. **Produce the deliverable in a single coherent step.** Prefer writing a
   short Python script with `openpyxl` / `python-docx` / `reportlab` to
   generate the output file over manually composing text. If the deliverable
   is a spreadsheet, use cell formulas where the rubric calls for them.
   **Use the system `python3` — openpyxl, pypdf, and python-docx are already
   installed. Do NOT create a venv or run `pip install` unless a missing
   package is actually reported.**
5. **Verify the output against the task requirements.** Open the deliverable
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
- [ ] File saved in the requested format at the requested path
- [ ] File opens without errors (xlsx loads in openpyxl, pdf renders, docx opens)
- [ ] When joining values with commas (TEXTJOIN, Python join, etc.), use bare `,` with no trailing space unless the task explicitly requests spaces. *(repair — comma-space delimiter mismatch)*
- [ ] When marking cells as not applicable, write `N/A` (with slash), not `NA`, `na`, or other variants, unless the task specifies otherwise. *(repair — standard Excel/business convention)*

## Cost control

- **Read each file once and cache its content.** Never re-read the same file path unless you believe its contents changed. *(prevalent: 3 independent trajectories wasted tokens on duplicate reads)*
- **Skip irrelevant workspace context files.** Do not read MEMORY.md, SOUL.md, or similar project-context files when the task is a self-contained document/spreadsheet question with no codebase dependency. *(prevalent: 3 trajectories; counterfactual confirmed — removing these reads did not affect success)*
- Prefer a single generation script over many individual tool calls.
- Do not spawn sub-agents for subtasks that can be handled in-line.
- Keep reasoning focused on the current step; do not re-derive previously established facts.
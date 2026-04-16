# Contributing to ClawTrace

Thank you for your interest in contributing to ClawTrace.

## Getting started

1. Fork the repository and create your branch from `main`.
2. Set up your local environment following the instructions in the relevant package README or the root `CLAUDE.md`.
3. Make your changes, add tests where applicable, and ensure existing tests pass.
4. Open a pull request against `main`.

## Repository structure

```
clawtrace/
├── packages/clawtrace-ui/        Next.js 15 frontend
├── services/clawtrace-backend/   FastAPI backend
├── services/clawtrace-ingest/    FastAPI ingest service
├── services/clawtrace-payment/   FastAPI billing service
├── plugins/clawtrace/            @epsilla/clawtrace npm plugin
├── sql/databricks/               Lakeflow SQL pipeline
└── puppygraph/                   PuppyGraph schema
```

## Development setup

### Frontend
```bash
cd packages/clawtrace-ui
npm install
npm run dev
npm run typecheck
```

### Plugin
```bash
cd plugins/clawtrace
npm install
npm run check
npm test
```

### Python services
```bash
cd services/<service-name>
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env   # fill in values
uvicorn app.main:app --reload
pytest -q
```

## Pull request guidelines

- Keep PRs focused on a single concern.
- Include a clear description of what the change does and why.
- Reference any related issues with `Fixes #<issue>` or `Relates to #<issue>`.
- All CI checks must pass before merge.

## Coding conventions

- **TypeScript/React**: follow the design system in `docs/design-specs/`. No bold text (font-weight > 550) in UI components.
- **Python**: follow PEP 8. Use Pydantic Settings for configuration, never hard-code secrets.
- **SQL**: new silver tables belong in `sql/databricks/silver_tables/` and must be added to the Lakeflow pipeline in order.

## Reporting bugs

Please use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## Security vulnerabilities

Do not open a public issue. See [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [Apache 2.0 License](LICENSE).

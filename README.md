<p align="center">
  <img src="packages/clawtrace-ui/public/clawtrace-logo.png" alt="ClawTrace" width="260" />
</p>

<h3 align="center">Cost-aware tracing &amp; skill distillation for LLM agents</h3>

<p align="center">
  <a href="https://clawtrace.ai">Website</a> &nbsp;·&nbsp;
  <a href="https://clawtrace.ai/docs">Docs</a> &nbsp;·&nbsp;
  <a href="https://arxiv.org/abs/2604.23853">Paper</a> &nbsp;·&nbsp;
  <a href="https://clawtrace.ai/docs/ask-tracy">Ask Tracy</a> &nbsp;·&nbsp;
  <a href="#getting-started">Quickstart</a>
</p>

<p align="center">
  <a href="https://arxiv.org/abs/2604.23853"><img src="https://img.shields.io/badge/arXiv-2604.23853-b31b1b?logo=arxiv&logoColor=white" alt="arXiv" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="License" /></a>
  <img src="https://img.shields.io/badge/OpenClaw-compatible-orange" alt="OpenClaw" />
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
</p>

---

## Paper

> **ClawTrace: Cost-Aware Tracing for LLM Agent Skill Distillation** &nbsp;—&nbsp;
> Boqin Yuan, Renchu Song, Yue Su, Sen Yang, Jing Qin · arXiv [2604.23853](https://arxiv.org/abs/2604.23853)

Skill-distillation pipelines learn reusable rules from LLM agent trajectories, but they lack a key signal — **how much each step costs**. ClawTrace records every LLM call, tool use, and sub-agent spawn during a session and compiles it into a **TraceCard**: a ~1.5 kB YAML summary with per-step USD cost, token counts, and redundancy flags. On top of TraceCards, **CostCraft** produces three patch types — *preserve*, *prune* (with counterfactual evidence), and *repair* — that improve agent skills without inflating cost.

<p align="center">
  <img src="packages/clawtrace-ui/public/docs/images/paper-workflow.png" alt="ClawTrace + CostCraft workflow: capture, compile, distill" width="860" />
</p>

<p align="center"><sub><b>Capture → Compile → Distill.</b> ClawTrace instruments the agent (Substrate), compiles each session into a TraceCard (IR), and merges TraceCards into evolved skills via a preserve / prune / repair typology (Methodology).</sub></p>

📄 **Read the paper:** <https://arxiv.org/abs/2604.23853> &nbsp;·&nbsp; [BibTeX](#citation)

---

## Why this exists

My OpenClaw agent burned ~40× its normal token budget in under an hour. Root cause: it was appending ~1,500 messages of history to every LLM call. By the time I noticed, it had already spent a few dollars on what should have been a 3-cent task — and I couldn't see it from logs, because OpenClaw flattens everything into a wall of JSON. The loop was invisible.

ClawTrace was built after that incident, and the paper above is what came out of using it at scale.

---

**ClawTrace records every agent run as a tree of spans and lets you inspect it.**

```bash
openclaw plugins install @epsilla/clawtrace
openclaw clawtrace setup
openclaw gateway restart
```

Then open [clawtrace.ai](https://clawtrace.ai). Your next run appears automatically.

---

## What it shows

- **Token usage per step** — see exactly which LLM call ate your budget
- **Tool calls and retries** — spot loops before they compound
- **Execution timeline** — Gantt chart of every span, parallel and sequential
- **Full input/output** — click any step to see what went in and what came back

<p align="center">
  <img src="packages/clawtrace-ui/public/docs/images/2.2.1-see-detail-trajectory---tracing-view.png" alt="Trace tree view" width="720" />
</p>

---

## Ask Tracy

You can also ask questions in plain English. Tracy is an AI analyst wired directly to your trajectory graph. She runs live Cypher queries against your data, generates charts, and tells you specifically what to fix.

> "Why did my last run cost so much?"
> "Which tool is failing most often?"
> "Is my context window growing across sessions?"

<p align="center">
  <img src="packages/clawtrace-ui/public/docs/images/ask_tracy_4_result.png" alt="Tracy analyzing trajectory costs" width="600" />
</p>

---

## Three views per trace

Every trajectory has three views — click any node/span/bar to open step detail with full payloads, token counts, duration, cost, and errors.

**Execution path** — collapsible tree, parent-child relationships, per-node cost badges

<p align="center">
  <img src="packages/clawtrace-ui/public/docs/images/2.2.1-see-detail-trajectory---tracing-view.png" alt="Execution Path" width="720" />
</p>

**Call graph** — force-directed diagram of every agent, model, and tool in the run

<p align="center">
  <img src="packages/clawtrace-ui/public/docs/images/2.2.1-see-detail-trajectory---graph-view.png" alt="Call Graph" width="720" />
</p>

**Timeline** — Gantt chart showing where time actually went

<p align="center">
  <img src="packages/clawtrace-ui/public/docs/images/2.2.3-see-detail-trajectory---timeline-view.png" alt="Timeline" width="720" />
</p>

---

## Getting started

### 1. Install the plugin on your OpenClaw agent

```bash
openclaw plugins install @epsilla/clawtrace
```

### 2. Authenticate

```bash
openclaw clawtrace setup
```

Paste your observe key from [clawtrace.ai](https://clawtrace.ai) when prompted. 200 free credits, no credit card.

### 3. Restart the gateway

```bash
openclaw gateway restart
```

Done. Every run now streams to ClawTrace automatically.

---

## Self-evolving agents

The plugin also exposes a `/v1/evolve/ask` endpoint so your agent can query Tracy about its own trajectories. Install the ClawTrace Self-Evolve skill and your agent will periodically check its own cost and failure patterns, apply fixes, and log what it changed.

```bash
openclaw skills install clawtrace-self-evolve
```

---

## Architecture

```mermaid
graph TB
    subgraph Agent Runtime
        OC[OpenClaw Agent]
        PLG["@epsilla/clawtrace plugin<br/>8 hook types"]
    end

    subgraph Ingest Layer
        ING[Ingest Service<br/>FastAPI + Cloud Storage]
    end

    subgraph Data Lake
        RAW[Raw JSON Events<br/>Azure Blob / GCS / S3]
        DBX[Databricks Lakeflow<br/>SQL Pipeline]
        ICE[Iceberg Silver Tables<br/>events_all, pg_traces,<br/>pg_spans, pg_agents]
    end

    subgraph Graph Layer
        PG[PuppyGraph<br/>Cypher over Delta Lake]
    end

    subgraph Backend Services
        API[Backend API<br/>FastAPI + asyncpg]
        PAY[Payment Service<br/>Credits + Stripe]
        MCP[Tracy MCP Server<br/>Cypher queries]
    end

    subgraph AI Layer
        TRACY[Tracy Agent<br/>Anthropic Managed Harness<br/>Claude Sonnet 4.6]
    end

    subgraph Frontend
        UI[ClawTrace UI<br/>Next.js 15 + React 19]
        DOCS[Documentation<br/>Server-rendered Markdown]
    end

    subgraph External
        NEON[(Neon PostgreSQL<br/>Users, API Keys,<br/>Credits, Sessions)]
        STRIPE[Stripe<br/>Payments]
    end

    OC --> PLG
    PLG -->|"POST /v1/traces/events"| ING
    ING --> RAW
    RAW --> DBX
    DBX --> ICE
    ICE --> PG

    PG -->|Cypher| API
    PG -->|Cypher| MCP

    API --> NEON
    PAY --> NEON
    PAY --> STRIPE

    MCP -->|tool results| TRACY
    TRACY -->|SSE stream| API

    UI -->|REST API| API
    UI -->|SSE| API
    API -->|deficit check| PAY
```

### Data flow

1. **Capture** — The plugin intercepts 8 OpenClaw hook types: `session_start`, `session_end`, `llm_input`, `llm_output`, `before_tool_call`, `after_tool_call`, `subagent_spawning`, `subagent_ended`
2. **Ingest** — Events are batched and POSTed to the ingest service, which writes partitioned JSON to cloud storage (`tenant={id}/agent={id}/dt=YYYY-MM-DD/hr=HH/`)
3. **Transform** — Databricks Lakeflow SQL pipeline materializes raw events into 8 Iceberg silver tables every 3 minutes
4. **Query** — PuppyGraph virtualizes the Delta Lake tables as a Cypher-queryable graph (Tenant → Agent → Trace → Span with CHILD_OF edges)
5. **Serve** — Backend API runs Cypher queries; Tracy's MCP server gives the AI analyst direct graph access
6. **Display** — Next.js UI renders trace trees, call graphs, timelines, and Tracy's streamed responses with inline ECharts

### Graph schema

<p align="center">
  <img src="packages/clawtrace-ui/public/docs/images/graph_schema.png" alt="PuppyGraph Schema: Tenant → Agent → Trace → Span" width="720" />
</p>

4 vertex types (Tenant, Agent, Trace, Span), 4 edge types (HAS_AGENT, OWNS, HAS_SPAN, CHILD_OF). Agent execution data is naturally a graph; ClawTrace models it that way so Tracy can traverse it with Cypher instead of joining flat tables.

### Monorepo structure

```
clawtrace/
├── packages/clawtrace-ui/        Next.js 15 frontend (App Router, React 19, Drizzle ORM)
├── services/clawtrace-backend/   FastAPI backend (PuppyGraph, JWT auth, Tracy chat)
├── services/clawtrace-ingest/    FastAPI ingest (multi-tenant, cloud-agnostic storage)
├── services/clawtrace-payment/   FastAPI billing (consumption credits, Stripe, notifications)
├── plugins/clawtrace/            @epsilla/clawtrace npm plugin for OpenClaw
├── sql/databricks/               Lakeflow SQL pipeline (silver tables + billing tables)
└── puppygraph/                   PuppyGraph schema configuration
```

### Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, CSS Modules, ECharts, react-markdown |
| Backend | FastAPI, asyncpg, httpx, Pydantic Settings |
| Database | Neon PostgreSQL (users, credits, sessions), Drizzle ORM |
| Data Lake | Azure Blob Storage, Databricks, Delta Lake, Iceberg |
| Graph | PuppyGraph (Cypher over Delta Lake) |
| AI | Anthropic Managed Agents (Claude Sonnet 4.6), MCP protocol |
| Billing | Stripe, consumption-based credits |
| Deployment | Vercel (UI), Docker + Kubernetes (services) |

---

## Model pricing

Cost estimates cover 80+ models with cache-aware pricing (fresh input, cached input, cache write, output calculated separately):

**Western:** OpenAI (GPT-5.x, GPT-4.x, o-series), Anthropic (Claude Opus/Sonnet/Haiku), Google (Gemini 3.x/2.x/1.5), DeepSeek (V3, R1), Mistral

**Chinese:** Alibaba Qwen (3.x Max/Plus/Flash), Zhipu GLM, Moonshot Kimi, Baidu ERNIE, MiniMax

**Open source:** Llama 4/3.x, Mixtral, Stepfun

---

## Roadmap

- **Rubric-based evaluation** — define quality rubrics, auto-score trajectories, catch regressions before deployment
- **A/B testing** — run agent variants side by side, compare cost/quality/speed, promote winners
- **Version control** — track agent config changes, roll back, audit
- **Self-evolving agents** — agents that learn from their own trajectory data to cut costs and fix failure patterns automatically

---

## Development

### Frontend

```bash
cd packages/clawtrace-ui
npm install
npm run dev          # localhost:3000
npm run typecheck
```

### Backend

```bash
cd services/clawtrace-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8082
```

### Ingest

```bash
cd services/clawtrace-ingest
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8080
```

### Plugin

```bash
cd plugins/clawtrace
npm install
npm test
```

---

## Citation

If you use ClawTrace, TraceCards, or CostCraft in academic work, please cite:

```bibtex
@article{yuan2026clawtrace,
  title   = {ClawTrace: Cost-Aware Tracing for LLM Agent Skill Distillation},
  author  = {Yuan, Boqin and Song, Renchu and Su, Yue and Yang, Sen and Qin, Jing},
  journal = {arXiv preprint arXiv:2604.23853},
  year    = {2026},
  url     = {https://arxiv.org/abs/2604.23853}
}
```

## Inspirations

Inspired by and builds on [openclaw-tracing](https://github.com/fengsxy/openclaw-tracing), a reference implementation for tracing OpenClaw executions.

## License

Apache 2.0. See [LICENSE](LICENSE) for details.


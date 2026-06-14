# Resolvr — Autonomous Support Resolution Agent · SPEC

> Spec-driven development. This document is the source of truth. Build to it; verify against the
> Acceptance Criteria at the bottom. Written 2026-06-14.

## 1. Why this agent (market fit)

Market research picked the single most-paid-for AI agent use case that **none of the existing 8
agents on rohitraj.tech/agents touch**: autonomous customer-support resolution.

- AI customer-service market: **$15.12B (2026) → $117.87B (2034), 25.8% CAGR**
  (MarketsAndMarkets / industry trackers).
- Gartner: **80% of routine customer interactions AI-handled in 2026**; conversational AI cuts
  contact-centre labour cost by **~$80B globally**.
- Real-world tier-1 deflection: median **41.2%**, top quartile **58.7%** (2026 enterprise CX).
- Businesses pay **$500–$5,000/mo** for support agents; "autonomous support resolution" reaches
  **300–500% ROI within 6 months**.

It is also the best possible showcase for the dual LLM backend the brief asks for: classifying a
ticket, grounding a reply in a knowledge base, and deciding resolve-vs-escalate is a genuine
language task — unlike the existing deterministic rule engines.

**Differentiator on-site:** every current Agent-Lab demo is deterministic / no-LLM. Resolvr is the
**first real LLM-powered agent on the site** — it runs on **local Ollama by default, falls back to a
cloud API key, and falls back again to a deterministic template** so the public demo never breaks.

## 2. Goals / non-goals

**Goals**
- A working browser demo in the Agent Lab: paste/pick a support ticket → agent resolves or escalates.
- Real LLM drafting via **Ollama (local) → cloud API (OpenAI-compatible) → offline template**, in
  that order, with the chosen tier reported transparently in the response.
- Deterministic, eval-gated safety: classification + escalation decision are deterministic; the LLM
  only phrases the reply. A hard safety gate forces escalation on must-escalate categories.
- Slots into the existing pattern (`src/lib/resolvr/`, `api/agents/resolvr`, `ResolvrDemo.tsx`,
  registered in `AgentLab.tsx`, shown in `data/agents.ts`).

**Non-goals**
- No real ticketing-system integration (Zendesk/Intercom) — out of scope for the demo.
- No multi-turn conversation — single ticket in, single resolution out.
- No persistence / accounts.

## 3. Architecture — three-tier LLM backend

`src/lib/resolvr/llm.ts` exposes `draftReply(input): Promise<{ text, backend }>`.

Resolution order (first that works wins):
1. **Ollama** — `POST {OLLAMA_BASE_URL}/api/chat` (default `http://localhost:11434`), model
   `OLLAMA_MODEL` (default `qwen2.5:14b`). 8s timeout. Used when reachable.
2. **Cloud API** — OpenAI-compatible `POST {LLM_API_BASE_URL}/chat/completions` with
   `Authorization: Bearer {LLM_API_KEY}`, model `LLM_API_MODEL`. Used when `LLM_API_KEY` is set and
   Ollama failed.
3. **Offline template** — deterministic reply assembled from the top retrieved KB article. Always
   available; guarantees the public demo (Vercel, no Ollama, no key) still returns a grounded reply.

`backend` is reported back to the UI as e.g. `ollama · qwen2.5:14b`, `api · gpt-4o-mini`, or
`offline template`.

**Grounding & safety in the LLM call:** system prompt forces the model to answer **only** from the
provided KB context, never invent policy, never promise refunds/credits beyond the quoted policy,
and to defer to a human if the context doesn't cover the question. Temperature 0.2, max ~280 tokens.

Env (added to `.env.example`):
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:14b
LLM_API_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=
LLM_API_MODEL=gpt-4o-mini
```

## 4. The agent pipeline (transparent tool-calling loop)

Deterministic stages run first; only `draft_resolution` uses the LLM.

1. `classify_ticket(ticket)` → `{ category, intent, sentiment, priority }`
   - categories: `billing`, `technical`, `account`, `how_to`, `refund`, `security`, `legal`, `abuse`, `other`
   - deterministic keyword/heuristic scoring over subject+body.
2. `search_kb(ticket, category)` → ranked `KBHit[]` (id, title, score, snippet)
   - deterministic token-overlap retrieval over a fixed KB (`kb.ts`), top 3.
3. `decide_action(category, topScore)` → `{ action: "resolve" | "escalate", reason, confidence }`
   - **Must-escalate (hard gate):** category ∈ {`security`, `legal`, `abuse`} → always escalate.
   - **Refund** → escalate (policy/authority needed) unless KB fully covers a self-serve path.
   - Low retrieval confidence (topScore < threshold) → escalate ("not enough KB coverage").
   - else → resolve.
4. `draft_resolution(...)` → grounded reply
   - resolve → LLM (Ollama→API→template) drafts the answer from retrieved KB.
   - escalate → courteous holding reply + internal routing note (deterministic template; no false
     promises). LLM not required for escalation.

## 5. Knowledge base + sample tickets

- `src/lib/resolvr/kb.ts` — ~10 KB articles for a fictional SaaS ("Northwind", a project-management
  app): password reset, billing cycle, refund policy (14-day, self-serve under ₹/$ threshold),
  export data, 2FA, plan limits, invoice download, cancel subscription, SSO, API rate limits.
- `src/lib/resolvr/presets.ts` — 5 sample tickets covering the decision matrix:
  1. "How do I reset my password?" → resolve (how_to, high KB coverage)
  2. "Where do I download my invoice?" → resolve (billing)
  3. "I want a refund for last month" → escalate (refund → authority)
  4. "I think my account was hacked, someone changed my email" → **escalate (security, hard gate)**
  5. "Your product is garbage, I'll see you in court" → **escalate (legal/abuse, hard gate)**

## 6. API contract — `POST /api/agents/resolvr`

Request:
```jsonc
{ "subject": "string (≤200)", "body": "string (≤4000)", "customerTier": "free|pro|enterprise" }
```
Response 200:
```jsonc
{
  "classification": { "category": "...", "intent": "...", "sentiment": "...", "priority": "low|medium|high|urgent" },
  "sources": [ { "id": "kb-...", "title": "...", "score": 0.0, "snippet": "..." } ],
  "decision": { "action": "resolve|escalate", "reason": "...", "confidence": 0.0 },
  "reply": "string — customer-facing drafted reply",
  "routingNote": "string|null — internal note when escalated",
  "backend": "ollama · qwen2.5:14b | api · <model> | offline template",
  "trace": [ "classify_ticket → ...", "search_kb → ...", "decide_action → ...", "draft_resolution → ..." ],
  "latencyMs": 0
}
```
Errors: 400 invalid JSON / missing body, 200 otherwise. `runtime = "nodejs"`.

## 7. UI / demo behaviour (`ResolvrDemo.tsx`)

- Bar: `Resolvr · support resolution` + note `ollama → api → offline · grounded in KB`.
- Preset chips (5 sample tickets) + editable subject/body fields (textarea).
- "Resolve ticket" button → POST → render:
  - classification pills (category, priority, sentiment),
  - decision banner: green RESOLVE / amber ESCALATE with reason + confidence,
  - the drafted reply in a "reply card",
  - retrieved KB sources list,
  - a backend badge (which tier produced the reply) + the tool trace,
  - escalation routing note when present.
- Reuse `agentlab-*`, `scan-*`, `sev-pill--*` classes; add a small set of `rslv-*` classes.

## 8. Eval suite — `src/lib/resolvr/eval.ts` + test

Gate the **deterministic** behaviour (LLM phrasing is not asserted):
- 12 labelled tickets with expected `category` and expected `action`.
- Metrics: **category accuracy**, **must-escalate recall = 100%** (security/legal/abuse never
  resolved), **over-escalation rate** on clear self-serve tickets.
- A Jest test (`src/lib/resolvr/eval.test.ts`) asserts must-escalate recall is 100% and category
  accuracy ≥ 0.83. Runs offline (no LLM).

## 9. File manifest

Create:
- `src/lib/resolvr/types.ts`, `classify.ts`, `kb.ts`, `retrieve.ts`, `decide.ts`, `llm.ts`,
  `resolve.ts` (orchestrator), `presets.ts`, `eval.ts`, `eval.test.ts`
- `src/app/api/agents/resolvr/route.ts`
- `src/components/ResolvrDemo.tsx`

Edit:
- `src/components/AgentLab.tsx` — import + register Resolvr (and update "Six"→"Seven").
- `src/data/agents.ts` — add Resolvr `AgentShowcase`; extend `demo` union with `"resolvr"`.
- `src/app/[locale]/agents/page.tsx` — copy "Six of them"→"Seven of them".
- `src/app/globals.css` — `rslv-*` classes.
- `.env.example` — LLM env block.

## 10. Acceptance criteria (verify against these)

- [ ] `npm run lint` and `npx tsc --noEmit` pass.
- [ ] `npm run build` succeeds.
- [ ] Jest eval test passes: must-escalate recall 100%, category accuracy ≥ 0.83.
- [ ] Dev server: Agent Lab shows a **Resolvr** tab; running each of the 5 presets returns a result.
- [ ] With Ollama up, a resolve-case reply is produced by Ollama and the badge reads `ollama · …`.
- [ ] Security/legal/abuse presets escalate (never resolve) and show a routing note.
- [ ] `/agents` page renders Resolvr in the showcase grid with market = $15B+ customer service.
- [ ] A screenshot captures a working Ollama-powered resolution in the browser.
- [ ] Build is committed; details added to rohitraj.tech/agents.

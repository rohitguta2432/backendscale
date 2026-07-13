import type { BlogPost } from '@/types/blog';

export const deepseekV4ApiMigrationGuide2026: BlogPost = {
    slug: 'deepseek-v4-api-migration-guide-2026',
    title: 'DeepSeek V4 API Migration Guide: What Breaks on July 24, 2026 (and the 10-Minute Fix)',
    date: '2026-07-13',
    excerpt:
        'On July 24, 2026 at 15:59 UTC, DeepSeek fully retires the deepseek-chat and deepseek-reasoner model names — every API call still using them starts returning errors. The replacement names (deepseek-v4-flash, deepseek-v4-pro) take ten minutes to wire in, but two silent gotchas can wreck your bill or your latency: thinking mode moved from a model name to a request parameter, and the naive migration path can turn your cheapest endpoint into a reasoning-token furnace. Here is the exact before/after code, the Flash vs Pro decision table, the Anthropic-SDK routing trick, and how I would stage the cutover in production.',
    readingTime: '13 min read',
    keywords: [
        'deepseek v4 api migration guide',
        'deepseek-chat deprecated july 24',
        'deepseek v4 flash vs pro',
        'deepseek v4 thinking mode parameter',
        'deepseek anthropic api endpoint',
        'deepseek v4 pricing 2026',
        'deepseek-reasoner replacement',
    ],
    coverImage: {
        src: '/images/notes/deepseek-v4-api-migration-guide-2026-cover.jpg',
        alt: 'Amber particle stream merging through a dark canyon illustrating DeepSeek V4 API migration deadline',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `DeepSeek retires the \`deepseek-chat\` and \`deepseek-reasoner\` model names on **July 24, 2026 at 15:59 UTC** — after that, requests using them fail outright, per the [official announcement](https://api-docs.deepseek.com/news/news260424/). The fix: swap to \`deepseek-v4-flash\` (284B params, 13B active, 1M context) or \`deepseek-v4-pro\` (1.6T params, 49B active), keeping your existing \`base_url\`. Two traps: **thinking mode is now a request parameter, not a model name**, and old \`deepseek-chat\` traffic must explicitly disable thinking or you pay reasoning-token overhead on every call. Skip migrating only if you are already off the legacy names — everyone else has 11 days.`,
        },
        {
            heading: 'DeepSeek V4 API Migration: What Breaks on July 24, 2026',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

There's a special category of API change that doesn't trend on Hacker News but quietly breaks thousands of production systems on a scheduled date. DeepSeek's model-name retirement is the next one on the calendar: on **July 24, 2026 at 15:59 UTC**, the \`deepseek-chat\` and \`deepseek-reasoner\` identifiers stop resolving. Not "deprecated with a warning header." Not "redirected to the nearest equivalent." [DeepSeek's own words](https://api-docs.deepseek.com/news/news260424/): *"fully retired and inaccessible."*

The reason this one deserves your attention now rather than on July 25 is that the migration looks trivial — change two strings — but ships with behavioral changes that string-swapping doesn't surface. DeepSeek V4 launched as a preview on **April 24, 2026**, and since then the legacy names have silently routed to \`deepseek-v4-flash\`: your app has already been running on V4 for weeks whether you noticed or not. What changes on July 24 is that the aliases disappear, and with them the last excuse to avoid understanding what V4 actually did to thinking mode, token budgets, and pricing.

This guide is the working developer's version: the exact mapping, the before/after code, the cost gotcha that turns a cheap endpoint into an expensive one, the Flash-vs-Pro decision, and how I'd stage this cutover on a production system rather than YOLO-ing it the night before. If you also call OpenAI's stack, the same tier-selection thinking applies there — I wrote up [the GPT-5.6 Sol/Terra/Luna split](/en/notes/gpt-5-6-sol-terra-luna-api-guide-2026) last week, and the parallels are striking: every frontier lab is collapsing model zoos into fewer names with per-request behavior switches.`,
        },
        {
            heading: 'Will my API calls break on July 24?',
            content: `Yes — if any request still names \`deepseek-chat\` or \`deepseek-reasoner\`, it starts erroring after **15:59 UTC on July 24, 2026**. This is a hard cutoff, not a grace period. The [official mapping](https://api-docs.deepseek.com/news/news260424/) is:

| Legacy name (dies Jul 24) | New name | Mode |
|---------------------------|----------|------|
| \`deepseek-chat\` | \`deepseek-v4-flash\` | thinking **disabled** |
| \`deepseek-reasoner\` | \`deepseek-v4-flash\` | thinking **enabled** |
| — (new, opt-in) | \`deepseek-v4-pro\` | dual mode, flagship |

Two details in that table surprise most teams:

**\`deepseek-reasoner\` does not map to Pro.** The reasoning workload you were running maps to **V4-Flash with thinking enabled**, not to the 1.6T-parameter flagship. If you assumed "reasoner → the big model," you'd be over-buying by roughly 3x on output price ($0.87/M vs $0.28/M). Pro is a deliberate upgrade decision, not the default landing spot.

**The behavior already changed in April.** Since the V4 preview shipped on April 24, the legacy names have been aliases pointing at V4-Flash. So the model your \`deepseek-chat\` calls hit today is *already* a 284B-total / 13B-active MoE with a 1M-token context window — an 8x context expansion over V3.2's 128K. Any subtle output drift you noticed this spring wasn't your imagination; it was the alias moving underneath you. The July 24 event doesn't change the model again. It only removes the old names.

What replaces \`deepseek-reasoner\` after July 24, then, is a one-line answer: \`deepseek-v4-flash\` plus a thinking parameter in the request body — which is where the actual migration work lives.`,
        },
        {
            heading: 'The migration code: before and after',
            content: `Neither of the top-ranking migration writeups shows actual code, so here it is. The core rule from DeepSeek: **keep your \`base_url\`, change only the model string, and make thinking explicit.**

If you were on \`deepseek-chat\` (cheap, non-thinking traffic):

\`\`\`python
# BEFORE — dies after 2026-07-24 15:59 UTC
client = OpenAI(base_url="https://api.deepseek.com", api_key=key)
resp = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": prompt}],
)

# AFTER — explicit model, thinking explicitly OFF
resp = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[{"role": "user", "content": prompt}],
    extra_body={"thinking": {"type": "disabled"}},
)
\`\`\`

If you were on \`deepseek-reasoner\` (reasoning traffic):

\`\`\`python
# AFTER — same model name, thinking ON
resp = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[{"role": "user", "content": prompt}],
    extra_body={"thinking": {"type": "enabled"}},
)
\`\`\`

And the 30-second smoke test you should run today, not on the 24th:

\`\`\`bash
curl -s https://api.deepseek.com/chat/completions \\
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "deepseek-v4-flash",
       "messages": [{"role": "user", "content": "ping"}],
       "thinking": {"type": "disabled"}}' | jq .model
\`\`\`

The checklist beyond the string swap:

- **Grep everything, not just code.** Model names hide in env files, Helm values, LangChain configs, retry wrappers, eval harnesses, and that one Zapier automation nobody owns. \`rg -l "deepseek-(chat|reasoner)"\` across every repo and config store.
- **Keep stripping reasoning content in multi-turn conversations.** Same rule as the old reasoner: reasoning blocks from previous turns must not be replayed into the next request's context, or you burn input tokens on your own chain-of-thought.
- **Revisit \`max_tokens\`.** V4 supports up to **384K output tokens**; thinking-enabled calls consume part of your budget on reasoning before the visible answer. Budgets tuned for V3.2's shorter outputs will truncate answers mid-thought.
- **Re-test tool calls with thinking enabled.** Function-calling behavior differs between thinking and non-thinking modes; an agent loop tested only against old \`deepseek-chat\` may see new interleaving of reasoning and tool invocations.`,
        },
        {
            heading: 'The thinking-mode cost gotcha',
            content: `Here's the trap that will show up on August invoices. Thinking mode moved from *model name* to *request parameter* — and [TheRouter's migration analysis](https://therouter.ai/news/deepseek-v4-api-migration-deprecation-2026/) flags that naive migrations which drop the thinking field entirely can land on reasoning-enabled defaults through some SDK and gateway paths. If your high-volume, latency-sensitive traffic — classification, extraction, summarization, the stuff you put on \`deepseek-chat\` precisely because it was cheap — silently starts emitting chain-of-thought, you pay for every one of those reasoning tokens at output rates, and your p95 latency inflates for zero product benefit.

The math makes it concrete. [Official V4 pricing](https://api-docs.deepseek.com/quick_start/pricing): V4-Flash costs **$0.14/M input (cache miss), $0.0028/M on cache hits, $0.28/M output**. Suppose a summarization endpoint processes 10M input / 2M output tokens a day — about **$1.96/day**. If thinking mode sneaks on and adds, say, 3x output volume in reasoning tokens (a typical multiplier for reasoning traces on short tasks), your output line goes from $0.56 to $1.68 and total spend jumps ~57% — while every response gets *slower*. Nothing "broke," so no alert fires. You just quietly pay more for worse latency.

The defense is one line: **make thinking explicit on every call**, never default. \`{"thinking": {"type": "disabled"}}\` on cheap paths, \`enabled\` where you actually want reasoning. Then verify with usage data, not vibes — DeepSeek's response objects report token usage, and a one-day before/after comparison on your busiest route will catch a silent thinking flip immediately.

The flip side is real, though: that same parameter is a gift for cost tuning. Workloads that used to need two model integrations (chat for cheap, reasoner for smart) now need one integration with a per-request switch. In [Resolvr](https://rohitraj.tech/en/projects), my support-resolution agent, the RAG answer path runs cheap non-thinking calls for ticket triage but flips thinking on for the small fraction of tickets that fail a confidence check — one client, one model name, two cost profiles. That pattern was clumsy across two model names; as a boolean it's trivial.`,
        },
        {
            heading: 'DeepSeek V4-Flash vs V4-Pro: which should you migrate to?',
            content: `For most migrating traffic the answer is Flash — that's where your aliases already point. Pro is the deliberate upgrade for the hardest reasoning and agentic-coding work. The head-to-head, from the [official specs](https://api-docs.deepseek.com/news/news260424/) and [pricing page](https://api-docs.deepseek.com/quick_start/pricing):

| | deepseek-v4-flash | deepseek-v4-pro | GPT-5.6 Terra (ref) |
|---|---|---|---|
| Architecture | 284B total / 13B active MoE | 1.6T total / 49B active MoE | undisclosed |
| Context window | 1M tokens | 1M tokens | 400K |
| Max output | 384K | 384K | 128K |
| Input $/M (miss) | $0.14 | $0.435 | ~$1.25 |
| Input $/M (cache hit) | $0.0028 | $0.003625 | — |
| Output $/M | $0.28 | $0.87 | ~$10 |
| Thinking modes | dual (per request) | dual (per request) | tiered models |
| Best for | volume traffic, RAG, agents on a budget | frontier reasoning, agentic coding | ecosystem lock-in |

Three takeaways from that table:

**The cache-hit pricing is the sleeper feature.** At **$0.0028/M**, a cache-hit input token costs 50x less than a cache miss. Agent loops and RAG pipelines that resend a stable system prompt + document prefix on every call are mostly cache hits — design your prompts so the static part leads and the variable part trails, and your effective input price collapses.

**Both models use DeepSeek Sparse Attention (DSA) plus token-wise compression** to make the 1M context economically viable — this is why a 1M-window model can price input at $0.14/M when competitors charge 5-10x that for smaller windows. DeepSeek claims reasoning on Flash "closely approaches" Pro; benchmark-chasing aside, the practical question is whether your specific failure cases (long-horizon agent runs, gnarly refactors) actually improve on Pro enough to justify 3.1x the output price. Run your own evals on 50 real tasks; don't buy the flagship on reflex.

**Against Western frontier pricing, V4-Flash is an order of magnitude cheaper on output.** How much does DeepSeek V4 cost compared to other frontier APIs? Flash's $0.28/M output is roughly **35x cheaper** than GPT-5.6 Terra-class output pricing, and Pro at $0.87/M still undercuts everything in the Western frontier tier. I covered the cheapest-multimodal angle in [my DeepSeek V4 Vision writeup](/en/notes/deepseek-v4-vision-cheapest-multimodal-api-2026) — the economics story hasn't changed, it's just now mandatory to engage with it.`,
        },
        {
            heading: 'Can I use DeepSeek V4 with the Anthropic SDK and Claude Code?',
            content: `Yes — and this is the most underrated part of the V4 platform. DeepSeek ships a **native Anthropic-format endpoint**: point the Anthropic SDK's \`base_url\` at DeepSeek, keep your Messages-API-shaped code, and route requests to \`deepseek-v4-flash\` or \`deepseek-v4-pro\`. For teams whose agent stack is built on Anthropic's SDK (or on Claude Code, which several agent frameworks now use as a runtime), that means trying DeepSeek as a drop-in cost tier is a config change, not a rewrite.

\`\`\`python
from anthropic import Anthropic

client = Anthropic(
    base_url="https://api.deepseek.com/anthropic",
    api_key=deepseek_key,
)
resp = client.messages.create(
    model="deepseek-v4-flash",
    max_tokens=1024,
    messages=[{"role": "user", "content": "ping"}],
)
\`\`\`

The caveats matter, though. Per [TheRouter's compatibility notes](https://therouter.ai/news/deepseek-chat-reasoner-deprecation-v4-migration-routing/), the Anthropic-format endpoint currently lacks **image message support, MCP connector features, and redacted thinking**. So: text-first agent loops and coding assistants route cleanly; multimodal pipelines and MCP-heavy setups stay on the OpenAI-format endpoint or on Anthropic proper. Test tool-use schemas specifically — cross-provider Messages-API emulations historically diverge on edge cases like parallel tool calls and long tool results, and a 20-minute compatibility test beats discovering divergence in production.

If you want the local-weights escape hatch instead: quantized **[DeepSeek-V4-Flash GGUFs from Unsloth](https://huggingface.co/unsloth/DeepSeek-V4-Flash-GGUF)** are trending on Hugging Face this week. A 284B-total MoE with 13B active is genuinely runnable on serious workstation hardware, which makes "we could self-host the fallback" a real negotiating position rather than a bluff.`,
        },
        {
            heading: 'When to skip, wait, or leave',
            content: `The honest counter-position, because not every team should ride this migration enthusiastically:

**Skip the urgency if you're already on explicit V4 names.** Teams that adopted \`deepseek-v4-flash\`/\`deepseek-v4-pro\` during the preview have nothing to do on July 24. Verify with a config grep and move on.

**Wait on Pro if Flash is working.** The 3.1x output-price jump buys headroom you may not need. Upgrade when your eval data — not a benchmark table — shows Flash failing your actual tasks.

**Reconsider the dependency entirely if your risk profile changed.** A hard-cutoff deprecation with a 3-month runway is fair practice, but it's also a reminder: you're building on an API whose vendor moves fast and breaks names. Some organizations additionally can't route data to DeepSeek's hosted API for compliance reasons — for them, the Unsloth GGUFs or a gateway with automatic fallback (OpenRouter-style) are the pragmatic middle ground. And if your workload is deeply Anthropic-native — MCP servers, redacted thinking, multimodal — the emulation gaps above mean DeepSeek is your cost-optimization tier, not your primary.

**Don't panic-migrate the night before.** The names die July 24 at 15:59 UTC, which is 21:29 IST — the middle of the evening for Indian teams. If your rollout process needs a business day, your real deadline is July 23.`,
        },
        {
            heading: 'How I would ship this migration in production',
            content: `Here's the rollout I'd run for a client system doing meaningful DeepSeek volume — the same staged pattern I use for any [6-week MVP](/en/services/6-week-mvp) that touches a third-party model API:

**Day 1 — inventory and pin.** \`rg "deepseek-(chat|reasoner)"\` across code, configs, CI, and dashboards. Every hit gets a ticket. Then pin a **regression suite**: capture 100 real request/response pairs from production traffic on the legacy names (they're already V4-Flash under the hood, so these captures *are* your target behavior). This is your ground truth.

**Day 2 — canary with explicit thinking.** Route 5% of traffic to the new names with thinking set explicitly per route. Compare against the pinned suite: response quality (LLM-judge or heuristic), token usage per call, p95 latency. The thing you're hunting is the silent thinking flip — it shows up as an output-token spike within an hour of canary start.

**Day 3-4 — ramp and alarm.** 25% → 100%, with two alerts that outlive the migration: one on output-tokens-per-request deviating >30% from the 7-day baseline (catches thinking misconfiguration forever, not just this week), one on error-rate for any request naming a legacy model (catches the config you missed). That second alert is your safety net for the Zapier automation nobody remembered.

**Day 5 — delete the old names from your codebase entirely.** Not "leave them as fallback." Fallback-to-a-dead-name is a latent outage scheduled for July 24 at 15:59 UTC.

The meta-lesson I'd flag for anyone building agentic products: **model names are now infrastructure**, and vendors are consolidating them fast — DeepSeek collapsed two names into one with a parameter, [OpenAI split GPT-5.6 into three tiers](/en/notes/gpt-5-6-sol-terra-luna-api-guide-2026), and every gateway in between is absorbing the churn. Hardcoding a model string in 14 places was always sloppy; in 2026 it's a recurring production incident. Put the model ID and thinking config in one config object, injected everywhere, versioned in git. Ten minutes of plumbing, and the next deprecation — there will be a next one — is a one-line PR.`,
        },
        {
            heading: 'Migrating an AI product under a deadline? That is literally my job',
            content: `If your product is sitting on \`deepseek-chat\` with 11 days on the clock — or you're mid-build and the model-provider churn keeps eating sprint time — this is the kind of work I ship for clients: API migrations with pinned regression suites, cost-tuned model routing, and agent stacks that don't fall over when a vendor renames things.

I build production AI products in [6-week MVP sprints](/en/services/6-week-mvp) — scoped, fixed-price, shipped live — and for teams that need ongoing ownership of an AI stack, I work as a [founding engineer](/en/services/hire-founding-engineer-india) handling exactly this class of infrastructure decision. If July 24 is making you nervous, the fix is a config object and a canary, not a rewrite — [get in touch](/en/contact) and we'll stage it properly.`,
        },
    ],
    cta: {
        text: 'Ship your AI product in 6 weeks',
        href: '/en/services/6-week-mvp',
    },
};

import type { BlogPost } from '@/types/blog';

export const gpt56SolTerraLunaApiGuide2026: BlogPost = {
  slug: 'gpt-5-6-sol-terra-luna-api-guide-2026',
  title:
    'GPT-5.6 Sol vs Terra vs Luna: A Developer\'s Guide to Picking the Right Tier (2026)',
  date: '2026-07-10',
  excerpt:
    "On July 9, 2026, OpenAI split GPT-5.6 into three tiers — Sol, Terra, and Luna — and the model string you pick now swings your bill by up to 5x. Sol is the flagship, Terra is near-flagship at roughly half the cost of GPT-5.5, and Luna is the cheap, fast one. Most teams reach for Sol and overpay. Here's the tier-selection framework I use, the benchmarks that justify each choice, and the exact migration code to switch.",
  readingTime: '12 min read',
  keywords: [
    'gpt-5.6 sol vs terra vs luna',
    'gpt-5.6 for developers',
    'gpt-5.6 vs gpt-5.5',
    'gpt-5.6 api pricing',
    'should i migrate to gpt-5.6',
    'gpt-5.6 codex',
    'gpt-5.6 sol terra luna',
  ],
  coverImage: {
    src: '/images/notes/gpt-5-6-sol-terra-luna-api-guide-2026-cover.jpg',
    alt: 'Three glowing orbs of different sizes — Sol, Terra, and Luna — representing the GPT-5.6 model tiers connected by energy filaments',
  },
  sections: [
    {
      heading: 'TL;DR',
      content: `**GPT-5.6 went GA on July 9, 2026** with three tiers you now have to choose between: **Sol** ($5 / $30 per 1M input/output tokens, the flagship), **Terra** ($2.50 / $15 — roughly half the cost of GPT-5.5 for near-flagship quality), and **Luna** ($1 / $6, the cheapest and fastest). Sol posts real gains — **52.7% on Agents' Last Exam vs GPT-5.5's 46.9%**, 88.8% on Terminal-Bench 2.1 — but **most production apps should default to Terra, not Sol**, and route high-volume paths to Luna. Skip the upgrade entirely if GPT-5.5 already clears your quality bar and your bill is output-token-dominated. Here is the tier-selection framework and the migration code.`,
    },
    {
      heading: 'GPT-5.6 Sol vs Terra vs Luna: What OpenAI Actually Shipped',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

**GPT-5.6** hit general availability on **July 9, 2026** (after a June 26 preview), and the real story is not a benchmark score — it is a **product-shape change**. The single GPT-5.5 model is gone. In its place are three named tiers you have to choose between on every API call: **Sol** (the flagship), **Terra** (the balanced everyday model), and **Luna** (the cheap, low-latency one), plus a high-effort variant called **Sol Ultra** that runs **four agents in parallel by default** and reconciles their answers. The official launch note is at [openai.com](https://openai.com/index/gpt-5-6/); the cleanest third-party teardown is [DigitalApplied's GA write-up](https://www.digitalapplied.com/blog/gpt-5-6-sol-terra-luna-public-ga).

The model IDs matter more than they look, because one of them is a trap. \`gpt-5.6\` is an **alias that resolves to Sol** — so if you copy an old snippet and just bump the version string, you have silently pinned yourself to the most expensive tier. The explicit IDs are \`gpt-5.6-sol\`, \`gpt-5.6-terra\`, and \`gpt-5.6-luna\`. My first rule below is simply: never ship the bare alias.

Why did OpenAI split one model into three? The same reason Anthropic ships Opus/Sonnet/Haiku and the reason I keep writing tier-comparison guides like [Claude Opus 4.8 vs 4.7 for developers](/en/notes/claude-opus-4-8-vs-4-7-developers-2026): a frontier model priced for agentic coding is wildly overpriced for classification, autocomplete, and chat. Naming the tiers just forces the decision you were already supposed to be making. This post is that decision, made explicit.`,
    },
    {
      heading: 'What Do Sol, Terra, and Luna Cost?',
      content: `Pricing is the whole point of the split, so start here. All figures are per **1M tokens**, from OpenAI's [API pricing page](https://developers.openai.com/api/docs/pricing) and corroborated by [EdenAI's pricing guide](https://www.edenai.co/post/gpt-5-6-sol-benchmarks-pricing-api-access-guide):

| Tier | Model ID | Input | Output | Positioning |
|---|---|---|---|---|
| Sol | \`gpt-5.6-sol\` (or \`gpt-5.6\`) | $5.00 | $30.00 | Flagship — matches GPT-5.5's old rate card |
| Terra | \`gpt-5.6-terra\` | $2.50 | $15.00 | ~Half of Sol; near-flagship quality |
| Luna | \`gpt-5.6-luna\` | $1.00 | $6.00 | Cheapest + fastest; high-volume work |

The spread is **5x on input and 5x on output** between Sol and Luna. That single fact should reframe how you think about the upgrade: GPT-5.6 is not "GPT-5.5 but better," it is "GPT-5.5 plus two cheaper models you were probably supposed to be using already."

Two pricing mechanics change the math further. **Prompt caching** got more aggressive: cached input reads are **90% off**, cache writes cost **1.25x** the uncached input rate, and the **minimum cache lifetime is 30 minutes**. GPT-5.6 also replaces the old \`prompt_cache_retention\` field with explicit breakpoints — \`prompt_cache_options.mode: "explicit"\` plus a \`ttl\` — so you control exactly what gets cached instead of relying on a heuristic. If your workload has a big shared system prompt (RAG context, tool schemas, a long instruction block), caching can dwarf the tier choice; I go deeper on that in [cutting token costs with context compression](/en/notes/llm-context-compression-cut-token-costs-2026). For a full cross-vendor rate comparison, see [OpenAI vs Claude vs Gemini API cost for an India MVP](/en/notes/openai-vs-claude-vs-gemini-api-cost-india-mvp-2026).`,
    },
    {
      heading: 'Is Sol Actually Better? The Benchmarks That Matter',
      content: `Sol is a genuine step up on agentic and coding work — but not a clean sweep, and that nuance is exactly what decides your tier. Here is Sol vs GPT-5.5 on the benchmarks OpenAI and [EdenAI](https://www.edenai.co/post/gpt-5-6-sol-benchmarks-pricing-api-access-guide) published, with the current leader noted where a rival is ahead:

| Benchmark | GPT-5.6 Sol | GPT-5.5 | Notes |
|---|---|---|---|
| Agents' Last Exam | 52.7% | 46.9% | +5.8 pts |
| Terminal-Bench 2.1 | 88.8% | 85.6% | Sol Ultra hits 91.9% |
| OSWorld 2.0 (computer use) | 62.6% | 47.5% | +15.1 pts — biggest jump |
| SWE-Bench Pro | 64.6% | — | Claude Mythos 5 leads at 80.3% |
| GDPval-AA v2 (Elo) | 1747.8 | — | Fable 5 ahead at 1759.6 |
| ExploitBench (cyber) | 73.5% | 47.9% | +25.6 pts |

Read the table honestly and two things fall out. First, **Sol's gains are concentrated in agentic/computer-use/cyber work** (OSWorld +15, ExploitBench +25.6) — the exact workloads where a wrong step is expensive and correctness beats cost. Second, **on raw coding SWE-Bench Pro, Sol (64.6%) still trails Claude Mythos 5 (80.3%)**, and on the GDPval economic-task Elo it trails Fable 5. If your bottleneck is pure code generation, GPT-5.6 is not automatically the answer — I compared the Claude side in the [Claude Fable 5 developer guide](/en/notes/claude-fable-5-developer-guide-2026), and the broader model-cost trade-off in [DeepSeek vs Claude vs GPT for an India MVP](/en/notes/deepseek-vs-claude-vs-gpt-india-mvp-cost-2026).

The practical takeaway: Sol earns its 5x-over-Luna price **only** on multi-step agentic tasks. For everything else, the benchmark delta between tiers is far smaller than the price delta — which is what makes the tier decision, not the upgrade decision, the one that saves money.`,
    },
    {
      heading: 'Which Tier Should You Actually Pick?',
      content: `This is the framework the launch-day spec recaps skip. Do not pick a tier by "which is newest" — pick by **what a wrong answer costs you** relative to what the tokens cost. Here is the decision I apply:

| Pick this tier | When | Typical workloads |
|---|---|---|
| **Sol** | Correctness dominates cost; the task is multi-step and agentic | Coding agents, computer-use automation, tool-heavy planning, security/bio reasoning |
| **Terra** | You want near-flagship quality at production volume | Most app backends, RAG answers, structured extraction, drafting, everyday chat |
| **Luna** | Latency and volume dominate; tasks are bounded | Classification, routing, autocomplete, real-time chat, high-QPS pipelines |

The mistake I see most is **defaulting to Sol "to be safe."** Safe is the wrong frame: on a high-volume endpoint, Sol is not safer than Luna, it is **5x more expensive for a quality gain the task cannot even use**. A support-ticket classifier does not get more correct because you spent flagship money on it.

A concrete way to decide: estimate the **cost of one wrong output**. If a bad answer silently ships to a user and costs you a churned customer, buy Sol's correctness. If a bad answer is caught by a downstream check, a human, or a retry — which is true of most classification and extraction — Luna is the rational choice and Terra is the safe middle. When your traffic is genuinely mixed, route per-request across tiers instead of hardcoding one; a gateway like the ones in [OpenRouter vs LiteLLM vs Portkey](/en/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026) makes that a config change, not a rewrite.`,
    },
    {
      heading: 'How Do You Migrate to GPT-5.6? (Working Code)',
      content: `Migration is mostly a model-string change plus two new knobs. The first and most important rule: **do not ship the bare \`gpt-5.6\` alias** — pin the tier you mean, because the alias silently resolves to Sol.

\`\`\`python
from openai import OpenAI
client = OpenAI()

# BEFORE — pinned to GPT-5.5
resp = client.responses.create(model="gpt-5.5", input=prompt)

# AFTER — pick a tier explicitly. Terra is the right default for most backends.
resp = client.responses.create(
    model="gpt-5.6-terra",             # NOT bare "gpt-5.6" (that = Sol = 2x the cost)
    input=prompt,
    reasoning={"effort": "medium"},    # ladder: none/low/medium/high/xhigh/max
)
\`\`\`

Two GPT-5.6 features are worth wiring in on day one. The **reasoning effort ladder gained a \`max\` rung** above \`xhigh\` — reserve it for genuinely hard agentic steps, because higher effort burns more (billed) reasoning tokens. There is also a new \`reasoning.mode: "pro"\` you can set on any tier (it defaults to \`medium\`), and \`reasoning.context\` to persist reasoning across turns. Second, use **explicit prompt caching** for any big shared prefix:

\`\`\`python
resp = client.responses.create(
    model="gpt-5.6-terra",
    input=shared_system_prefix + user_turn,   # long, stable prefix first
    prompt_cache_options={"mode": "explicit", "ttl": 3600},  # replaces prompt_cache_retention
)
\`\`\`

Customer numbers OpenAI published show why this is worth the ten minutes: Clio reported **38% fewer prompt tokens**, Rogo **24% fewer output tokens and 28% faster** responses, and PlayCo **63.5% fewer total tokens** after moving to GPT-5.6 and tuning effort + caching. Those are efficiency wins on top of the tier price — which is why "just bump the version" leaves real money on the table.

One migration note for agentic stacks: GPT-5.6 added **Programmatic Tool Calling** (a V8 JavaScript runtime the model can call into) and a multi-agent Responses API in beta. **Codex** is available from the preview onward, and ChatGPT Work + Codex now share a single usage pool — relevant if you were budgeting them separately.`,
    },
    {
      heading: 'Why Is GPT-5.6 Partly Government-Gated?',
      content: `This is the part that surprises teams mid-integration, so plan for it. GPT-5.6 shipped on a **phased release at the request of the US government**, because its biggest capability jumps are in **cyber**: ExploitBench climbed to **73.5% (from GPT-5.5's 47.9%)** and SEC-Bench Pro to **71.2% (from 45.8%)** — the same dual-use skills that help you find bugs help an attacker find them.

OpenAI's mitigations are unusually concrete for a model launch. Sol was held below the "Critical" threshold on OpenAI's Preparedness Framework, went GA only **after roughly 700,000 A100e GPU-hours of black-box red-teaming**, and ships with what OpenAI describes as **~10x the cyber safeguards** of the prior generation. The most operationally relevant detail: the strongest cyber capabilities sit behind a **"Trusted Access for Cyber"** program gated to verified defenders. If your product does security tooling, budget time for that verification — you cannot assume day-one access to the full capability surface. ([openai.com](https://openai.com/index/gpt-5-6/), [DigitalApplied](https://www.digitalapplied.com/blog/gpt-5-6-sol-terra-luna-public-ga)).

For most application developers this is a non-event — Terra and Luna are generally available and un-gated. But it is worth knowing that "GPT-5.6" is not one uniformly-available thing, and if your roadmap assumed frontier cyber reasoning on tap, that assumption needs checking.`,
    },
    {
      heading: 'What I\'d Actually Ship: Default to Terra, Watch the reasoning.context Footgun',
      content: `Here is the opinionated part, from wiring model tiers into real products. **My default for a new MVP backend is Terra, not Sol.** At $2.50 / $15 it lands within striking distance of flagship quality for a fraction of the cost, and the money I save goes toward the parts of the product that actually differentiate it. I reach for Sol only on the specific endpoints that are agentic and correctness-critical — the coding agent, the multi-step automation — and I push everything bounded (classification, routing, first-draft generation) down to Luna. On a typical app that split alone changes the monthly bill by a multiple, not a percentage.

The failure mode I would bet money on seeing across teams this quarter: **pinning \`gpt-5.6\` (or \`gpt-5.6-sol\`) everywhere "to be safe" and 5x-ing the bill** on traffic Luna would have handled identically. The tiers exist precisely so you do not do this. If you only change one thing after reading this, grep your codebase for the bare \`gpt-5.6\` string and make every call site name its tier on purpose. I keep a running cost comparison across providers in [DeepSeek vs Claude vs GPT for an India MVP](/en/notes/deepseek-vs-claude-vs-gpt-india-mvp-cost-2026) for exactly this budgeting exercise.

And the thing that will not be in the README: **\`reasoning.context\` is a footgun if you reuse it carelessly.** Persisting reasoning across turns is great for a coherent multi-step agent, but if you carry that context into a *different* task — a new user, an unrelated request — you can leak stale reasoning into a fresh problem and get confidently wrong output that is very hard to debug, because the mistake lives in hidden reasoning state, not the visible prompt. Scope persisted reasoning to a single logical task and clear it at task boundaries. Treat it like a session, not a global.`,
    },
    {
      heading: 'Picking the Right Model Tier Is Part of the Build',
      content: `The GPT-5.6 launch is a good reminder that "which model" stopped being one decision and became a per-endpoint one. Getting it right is not glamorous work — it is reading your own traffic, estimating the cost of a wrong answer, pinning tiers deliberately, and wiring caching — but it is the difference between an AI feature that has healthy margins and one that quietly eats them.

That wiring is exactly the work I do. If you are building an AI feature and want the model layer set up right from day one — the correct tier per endpoint, caching on the shared prefixes, a gateway so you can shift traffic without a rewrite — that is the [6-week MVP](/en/services/6-week-mvp) engagement: ship the feature *and* the cost discipline, hand over a tested codebase. For a longer build with someone embedded in your team, [hire a founding engineer (India)](/en/services/hire-founding-engineer-india).

Further reading from my notes: [OpenAI vs Claude vs Gemini API cost](/en/notes/openai-vs-claude-vs-gemini-api-cost-india-mvp-2026), [cutting token costs with context compression](/en/notes/llm-context-compression-cut-token-costs-2026), and [routing across models with OpenRouter vs LiteLLM vs Portkey](/en/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026).`,
    },
  ],
  cta: {
    text: 'Ship Your AI Feature on the Right Model Tier — 6-Week MVP',
    href: '/en/services/6-week-mvp',
  },
};

import type { BlogPost } from '@/types/blog';

export const openrouterVsLitellmVsPortkeyIndiaMvp2026: BlogPost = {
  slug: 'openrouter-vs-litellm-vs-portkey-india-mvp-2026',
  title: 'OpenRouter vs LiteLLM vs Portkey: Which LLM Gateway for Your AI MVP? (2026)',
  date: '2026-05-31',
  excerpt: "OpenRouter raised a $113M Series B on May 28, 2026 (led by CapitalG) — proof the LLM-gateway layer is now core infrastructure. But which one belongs in your AI MVP: OpenRouter's hosted marketplace, LiteLLM's self-hosted proxy, or Portkey's observability gateway? Here's the real cost math in ₹ and $, the minimal config for each, and the decision rule I use when wiring a gateway into a 6-week build.",
  readingTime: '13 min read',
  keywords: [
    'openrouter vs litellm vs portkey',
    'best llm gateway 2026',
    'llm gateway for ai mvp',
    'openrouter vs litellm cost',
    'litellm self hosted proxy',
    'portkey ai gateway',
    'llm router comparison india',
  ],
  coverImage: {
    src: '/images/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026-cover.jpg',
    alt: 'Glowing hourglass in teal and violet illustrating OpenRouter vs LiteLLM vs Portkey LLM gateway choice',
  },
  relatedProject: 'myFinancial',
  sections: [
    {
      heading: 'TL;DR',
      content: `An LLM gateway sits between your app and the model providers — one API key, automatic failover, cost control, and observability across OpenAI, Claude, Gemini, and open models. **OpenRouter** is the fastest start (one hosted endpoint, 400+ models) but charges a ~5.5% fee; it raised a **$113M Series B on May 28, 2026**. **LiteLLM** is the open-source self-hosted proxy that drops that fee (≈37% cheaper at scale) if you run the infra. **Portkey** is the observability-first gateway (Apache-2.0 since March 2026), with semantic caching and built-in guardrails. For most AI MVPs: prototype on OpenRouter, migrate to LiteLLM past ~$2,000/mo spend, and add Portkey when you need governance.`,
    },
    {
      heading: 'OpenRouter vs LiteLLM vs Portkey: Picking the Right LLM Gateway in 2026',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On May 28, 2026, OpenRouter [announced a $113M Series B](https://openrouter.ai/announcements/series-b) led by CapitalG (Alphabet's growth fund), with NVIDIA's NVentures, ServiceNow, MongoDB, Snowflake, and Databricks Ventures joining a16z and Menlo. That is a strange amount of money for what is, on the surface, an API proxy. The raise is really a bet on a category: the **LLM gateway** — the layer that sits between your application and the dozens of model providers you might call.

If you are building an AI product in 2026, you will hit this decision early. The moment you want a fallback when Claude is rate-limited, or you want to A/B GPT against Gemini, or your finance team asks "what are we spending per feature," direct SDK integrations start to crack. The three names that dominate the space each make a fundamentally different bet: **OpenRouter** bets you want zero infrastructure, **LiteLLM** bets you want full control, and **Portkey** bets you need observability and governance more than another proxy.

I wire gateways into AI MVPs for a living, so this is the comparison I actually run before picking one — not a feature-matrix dump, but the cost math, the minimal config, and the decision rule. If you are still choosing *models* rather than the gateway in front of them, read the [OpenAI vs Claude vs Gemini API cost breakdown](/en/notes/openai-vs-claude-vs-gemini-api-cost-india-mvp-2026) first, then come back here for the routing layer.`,
    },
    {
      heading: 'Do you even need an LLM gateway?',
      content: `Start with the honest baseline: if your app calls exactly one model from one provider and you do not need fallback, **you do not need a gateway at all.** Call the OpenAI or Anthropic SDK directly, ship, and add a gateway later. A gateway you do not use is just one more dependency that can fail and one more bill.

A gateway earns its place the moment any of these is true:

- **You call more than one model.** Using GPT for summaries and Claude for code means two SDKs, two auth setups, two billing dashboards. A gateway collapses that into one OpenAI-compatible endpoint.
- **You need failover.** When a provider 429s or slows past your latency budget, the gateway retries on a second provider automatically. Doing this by hand is error-prone glue code.
- **You need cost attribution.** "How much did the chat feature cost last month, by user?" is impossible from raw provider invoices and trivial through a gateway.
- **You mix hosted and self-hosted models.** Routing some traffic to a cheap open model on your own GPU and the hard queries to Claude is the gateway's whole job.

For a typical AI MVP, at least two of those are true within the first month — which is why the gateway question shows up so early. The real choice is not *whether*, it is *which*, and that turns almost entirely on cost and how much infrastructure you want to own.`,
    },
    {
      heading: 'The three bets: OpenRouter, LiteLLM, and Portkey at a glance',
      content: `**OpenRouter — the hosted marketplace.** Sign up, add prepaid credits, and call 400+ models (Claude, GPT, Gemini, Llama, DeepSeek, Mistral, and the rest) through a single OpenAI-compatible endpoint and one API key. No servers, no deploys. Its [Series B post](https://openrouter.ai/announcements/series-b) reports weekly token volume grew from **5 trillion to 25 trillion tokens over six months** — this is now production infrastructure, not a hobby proxy. Features include provider-level failover, latency/cost optimization, quality-aware routing, and zero-data-retention options. The catch: a marketplace fee (~5.5%) rides on top of provider pricing.

**LiteLLM — the self-hosted proxy.** LiteLLM is the open-source (MIT) Python proxy that gives you one OpenAI-compatible API for 100+ providers, which you host yourself. There is no marketplace markup, so you pay providers directly — independent comparisons like [Markaicode's OpenRouter-vs-LiteLLM analysis](https://markaicode.com/vs/openrouter-vs-litellm/) put the saving at roughly **37% at scale**. The cost moves from a percentage fee to your own infrastructure and ops time: a ~$20-50/month VPS plus the engineering to deploy, scale, and monitor it.

**Portkey — the observability gateway.** Portkey's bet is that after you deploy, what matters is what happened to every request. It logs, traces, and attributes each call — latency distributions, cost by feature/user/model, error rates, cache hit rates, and guardrail violations — in a real-time dashboard. It adds semantic caching (fuzzy-matching similar prompts), PII redaction, jailbreak detection, and audit trails at the gateway layer. As of **March 2026, Portkey open-sourced its entire gateway under Apache-2.0**, so you can self-host the core routing and guardrails for free; the managed platform runs a Free tier, **$49/month** for production, and custom enterprise pricing.`,
    },
    {
      heading: 'The cost math that actually decides it (in ₹ and $)',
      content: `For an India-based founder, the gateway choice is a spreadsheet decision, not a vibe. The variable is your monthly LLM spend, and the crossover is clearer than the marketing suggests.

**Low spend — under ~$1,000/mo (≈₹85,000).** OpenRouter wins on every axis that matters at this stage. A 5.5% fee on $500 of usage is **$27.50 (≈₹2,300)** — far less than the cost of your time standing up and babysitting a self-hosted proxy. You are pre-product-market-fit; spend the hours on the product, not on infra.

**Mid spend — ~$2,000-10,000/mo (≈₹1.7L-8.5L).** This is the crossover zone. OpenRouter's fee on $10,000/mo is **$550/month (≈₹46,000)** — now it is real money. LiteLLM on a $20-50 VPS eliminates that fee, but you take on deployment, scaling, and monitoring. The break-even is less about the dollar amount and more about whether you have the DevOps bandwidth: if one person already owns your infra, LiteLLM's ~37% saving is worth claiming; if not, OpenRouter's $550 is cheaper than a hire.

**High spend — over ~$10,000/mo.** LiteLLM is the clear cost winner. At $100,000/month, OpenRouter's fee alone is **$5,500/month (≈₹4.6L)** — that pays for a serious chunk of an engineer who can run the proxy and squeeze provider rate cards directly. At this scale you are also likely negotiating committed-use discounts with providers, which a self-hosted proxy lets you pocket entirely.

Portkey sits orthogonal to this axis: its **$49/month** production tier is noise next to your model spend, so you choose it for the observability and governance, not to save on tokens. The honest pattern most teams land on — and the one I default to — is **prototype on OpenRouter, migrate to LiteLLM when spend clears ~$2,000/mo, and add Portkey the moment a customer asks for an audit trail.** The same staged thinking applies to picking the underlying models; I broke that down in the [DeepSeek vs Claude vs GPT cost post](/en/notes/deepseek-vs-claude-vs-gpt-india-mvp-cost-2026).`,
    },
    {
      heading: 'OpenRouter vs LiteLLM vs Portkey: the comparison table',
      content: `| Factor | OpenRouter | LiteLLM | Portkey |
|---|---|---|---|
| Model | Hosted marketplace | Self-hosted OSS proxy | Observability gateway (OSS + managed) |
| Setup time | Minutes (add API key) | Hours-to-days (deploy + run) | Minutes (managed) / hours (self-host) |
| Pricing | ~5.5% fee on model cost | Free (MIT) + your infra | Free / $49/mo / enterprise |
| Models | 400+ | 100+ | 250+ via providers |
| Failover / routing | Yes, provider-level | Yes, fallback chains | Yes, conditional routing |
| Caching | Provider-dependent | Redis-based | Semantic + simple cache |
| Observability | Basic dashboard | DIY (Prometheus/Grafana) | Built-in analytics dashboard |
| Guardrails / PII | Zero-data-retention option | DIY | Built-in (PII, jailbreak, audit) |
| Best for | Fast start, prototyping | Cost at scale, full control | Production governance, enterprise |
| Infra you own | None | VPS + ops (~$20-50/mo) | None (managed) or your VPS |

The table is the cheat sheet, but the row that decides it for an MVP is **"infra you own."** OpenRouter and managed Portkey are zero-infra; LiteLLM trades infra ownership for the lowest token cost. Everything else is a feature you can usually live without for the first six months.`,
    },
    {
      heading: 'Hands-on: the minimal setup for each',
      content: `All three speak the OpenAI-compatible API, so your application code barely changes between them — you mostly swap the base URL and key. That is the quiet superpower of this whole category: migrating gateways later is a config change, not a rewrite.

**OpenRouter** — point the OpenAI SDK at their endpoint:

\`\`\`ts
import OpenAI from 'openai';
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});
// Specify models as "vendor/model"; OpenRouter handles routing + failover
const res = await client.chat.completions.create({
  model: 'anthropic/claude-opus-4.8',
  models: ['openai/gpt-5.1', 'google/gemini-3-pro'], // automatic fallback order
  messages: [{ role: 'user', content: 'Summarise this invoice.' }],
});
\`\`\`

**LiteLLM** — declare providers and fallbacks in a YAML config, then run the proxy:

\`\`\`yaml
# litellm-config.yaml
model_list:
  - model_name: primary
    litellm_params:
      model: anthropic/claude-opus-4.8
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: primary            # same alias = fallback pool
    litellm_params:
      model: openai/gpt-5.1
      api_key: os.environ/OPENAI_API_KEY
router_settings:
  fallbacks: [{ "primary": ["primary"] }]
  redis_host: localhost            # enables response caching
\`\`\`

\`\`\`bash
litellm --config litellm-config.yaml --port 4000
# Now point any OpenAI SDK at http://localhost:4000 — direct provider keys, no marketplace fee
\`\`\`

**Portkey** — attach a config that adds caching and a fallback strategy declaratively:

\`\`\`ts
import Portkey from 'portkey-ai';
const portkey = new Portkey({
  apiKey: process.env.PORTKEY_API_KEY,
  config: {
    cache: { mode: 'semantic' },                 // fuzzy-match similar prompts
    strategy: { mode: 'fallback' },
    targets: [
      { provider: 'anthropic', override_params: { model: 'claude-opus-4.8' } },
      { provider: 'openai', override_params: { model: 'gpt-5.1' } },
    ],
  },
});
const res = await portkey.chat.completions.create({
  messages: [{ role: 'user', content: 'Summarise this invoice.' }],
});
\`\`\`

Notice the shape is identical — declare a primary, declare fallbacks, send OpenAI-style messages. That is exactly why the right move is to start simple and migrate when the cost or governance pressure arrives, instead of over-engineering on day one.`,
    },
    {
      heading: 'Which one should you pick for your AI MVP?',
      content: `Map it to your stage, not to a feature checklist:

- **Pre-PMF, prototyping, under ~$1,000/mo spend → OpenRouter.** Zero infra, every model behind one key, fastest path to a working demo. The fee is rounding error at this volume. Ship the product.
- **Growing, $2,000-10,000/mo, one person owns infra → LiteLLM.** Claim the ~37% saving, keep provider keys in-house, run it on a cheap VPS. Skip this only if nobody on the team wants to own a service.
- **B2B / regulated / "we need an audit trail" → Portkey.** When a customer's security questionnaire asks about PII handling and request logging, Portkey's built-in guardrails and dashboard answer the question out of the box. At $49/mo it is cheaper than building logging yourself.
- **Multi-agent system → LiteLLM or Portkey.** Agent loops fan out many calls; you want centralized cost caps and tracing or the bill surprises you. If your agents already use a framework, see the [LangGraph vs CrewAI vs AutoGen comparison](/en/notes/langgraph-vs-crewai-vs-autogen-india-mvp-2026) for how the gateway sits underneath it.

The trap I see most often is founders reaching for the enterprise-grade option (self-hosted LiteLLM with a full observability stack) at the prototype stage, then spending two weeks on infra instead of talking to users. The reverse trap — staying on OpenRouter at $40,000/mo spend — quietly donates **$2,200/month (≈₹1.85L)** in fees that could have funded a part-time engineer. Re-evaluate the gateway every time your spend doubles.`,
    },
    {
      heading: 'When should you skip the gateway — and what is still missing?',
      content: `A gateway is not free in complexity, and a few honest counter-positions are worth stating.

**Skip it (for now) when:** you call a single model with no fallback need; you are on a throwaway prototype where a provider outage is fine; or you are using a provider's first-party features that the OpenAI-compatible surface does not expose (some structured-output, prompt-caching, or batch APIs are provider-specific and a generic gateway flattens them). In those cases the direct SDK is simpler and you lose nothing.

**What every gateway still gets wrong:** the OpenAI-compatible abstraction is leaky. Provider-specific parameters — Anthropic's prompt caching, OpenAI's structured outputs, Gemini's context-caching — are inconsistently supported, so you sometimes pay full price for a feature you thought the gateway preserved. Latency is another tax: a hosted gateway adds a network hop, usually 20-80ms, which matters for streaming UIs. And self-hosting LiteLLM means **you now own an uptime-critical service** — if the proxy goes down, your entire AI surface goes down, so it needs the same monitoring and on-call discipline as your database. None of these is a dealbreaker; all of them are things the glossy comparison posts skip.

If you want the version with code, this is the exact class of "looks simple in the demo, bites you in production" decision I dig into in the [AI-generated code anti-patterns post](/en/notes/ai-generated-code-anti-patterns-fixes-2026) — the gateway you bolt on without reading its failure modes becomes the single point of failure nobody planned for.`,
    },
    {
      heading: 'How I would wire a gateway into a 6-week MVP',
      content: `Here is the concrete setup I default to when a gateway belongs in a build, rather than the theory.

**Weeks 1-4 (build): OpenRouter, full stop.** During the sprint I am iterating on prompts and swapping models daily — Claude for reasoning, a cheap open model for classification, Gemini for long-context. OpenRouter's single endpoint means model selection is a one-line change and I never touch infra. I set a hard prepaid-credit cap so a runaway agent loop cannot empty the budget overnight, and I log the \`model\` and token counts to my own database from day one (so cost attribution does not depend on the gateway later).

**At launch, if spend looks like it will clear ~$2,000/mo:** I stand up LiteLLM on the same VPS that runs the app, behind the internal network, with Redis caching on and a two-provider fallback chain. Because the app already talks OpenAI-compatible JSON, this is a base-URL swap and a config file — usually an afternoon, not a migration. The ~37% saving compounds every month after.

**When the first B2B customer arrives:** I put Portkey in front (or turn on its self-hosted guardrails) so PII redaction and request audit logs exist *before* the security questionnaire does, not after. Retrofitting governance under deadline pressure is how teams ship leaks.

That staged approach — cheapest-to-start, migrate on a cost or compliance trigger — is the same discipline I bring to the whole stack on builds like [myFinancial](/en/projects), where the AI features have to be cheap to run and auditable at the same time. If you want a gateway (and the rest of an AI MVP) wired correctly the first time, [I run fixed-scope 6-week MVP builds](/en/services/6-week-mvp), or you can [hire a founding engineer in India](/en/services/hire-founding-engineer-india) to own the routing, cost controls, and production hardening end to end.`,
    },
  ],
  cta: {
    text: 'Wire This Into Your MVP — Book a Build',
    href: '/en/services/6-week-mvp',
  },
};

import type { BlogPost } from '@/types/blog';

export const sakanaFuguOrchestrationModelGuide2026: BlogPost = {
    slug: 'sakana-fugu-orchestration-model-guide-2026',
    title: 'Sakana Fugu: The Orchestration Model That Commands Other LLMs (2026)',
    date: '2026-06-23',
    excerpt:
        'Sakana AI shipped Sakana Fugu on June 22, 2026 — an orchestration model that routes each request across a swappable pool of frontier LLMs behind one OpenAI-compatible API, in two tiers (fugu and fugu-ultra-20260615), with benchmarks showing Fugu Ultra leading 10 of 11 tests. This is the builder read: what actually shipped, the API call you paste today, the benchmark table against Opus 4.8 / Gemini 3.1 Pro / GPT-5.5, where an orchestration model earns its keep, when its black-box routing disqualifies it, and how I would wrap it in production so a fallback-as-a-service still has a fallback.',
    readingTime: '12 min read',
    keywords: [
        'sakana fugu',
        'sakana fugu api',
        'sakana ai fugu orchestration model',
        'fugu ultra benchmarks',
        'multi-llm orchestration model 2026',
        'sakana fugu vs frontier models',
        'what is sakana fugu',
    ],
    relatedProject: 'myFinancial',
    coverImage: {
        src: '/images/notes/sakana-fugu-orchestration-model-guide-2026-cover.jpg',
        alt: 'A luminous central orb conducting light streams to orbiting nodes illustrating Sakana Fugu multi-LLM orchestration model',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**Sakana AI shipped [Sakana Fugu](https://sakana.ai/fugu/) on June 22, 2026 — an orchestration model that behaves like a single LLM but routes each request across a swappable pool of frontier models behind one OpenAI-compatible API.** It comes in two tiers: \`fugu\` (fast, balanced) and \`fugu-ultra-20260615\` (maximum quality), and on Sakana's published benchmarks Fugu Ultra leads 10 of 11 tests — **73.7 on SWE-Bench Pro** and **95.5 on GPQA-D**, ahead of Opus 4.8, Gemini 3.1 Pro, and GPT-5.5. Reach for it when you want multi-model routing and provider resilience without building them; skip it when you need to know exactly which model answered, have already chosen your model, or handle regulated data — its routing is a proprietary black box.`,
        },
        {
            heading: 'Sakana Fugu: The Orchestration Model That Commands Other LLMs (2026)',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

For about two years, the standard architecture advice for a serious LLM product has been the same: do not call one model directly — put a router in front of it. Cheap model for the easy turns, a frontier model for the hard ones, a fallback for when a provider returns a 502. I have built that layer by hand for half a dozen clients. On June 22, 2026, [Sakana AI](https://sakana.ai/fugu/) shipped a product that collapses that whole pattern into a single API call: **Sakana Fugu**, an orchestration model that selects, delegates to, and combines other models for you.

The twist that makes Fugu more than a router is that Fugu is *itself a language model* — one trained to decide when a request needs help, which expert models to call, how those models should talk to each other, and how to merge their work into one answer ([Sakana's release post](https://sakana.ai/fugu-release/)). You send one OpenAI-compatible request to \`fugu\` or \`fugu-ultra-20260615\`; the multi-agent machinery — model selection, delegation, verification, synthesis — stays on Sakana's side. From your code, it looks exactly like calling a single chat model.

Why this matters *now*, and not six months ago, is half technical and half geopolitical. Technically, Sakana claims the orchestrator beats the individual models it coordinates on most benchmarks — coordination treated as a capability, not just a cost trick. Geopolitically, [MarkTechPost reports](https://www.marktechpost.com/2026/06/22/sakana-ai-launches-sakana-fugu-an-orchestration-model-that-routes-tasks-across-a-swappable-pool-of-frontier-llms/) that Fugu's pitch leans hard on resilience: after recent export controls restricted access to Anthropic's Fable 5 and Mythos models, an endpoint that can quietly reroute around a single provider's disruption becomes a procurement argument, not just an engineering nicety. This is the builder read — what actually shipped, the API call you paste today, where an orchestration model earns its keep, where it does not, and the integration work the README will never mention.`,
        },
        {
            heading: 'What actually shipped in Sakana Fugu — and is it a model or just a router?',
            content: `Fugu is not something you download; it is a hosted endpoint with two model IDs. **\`fugu\`** balances quality and latency for everyday coding, code review, and chatbot traffic. **\`fugu-ultra-20260615\`** is tuned for maximum answer quality on hard, multi-step problems ([get-started docs](https://console.sakana.ai/get-started)). Both speak the OpenAI wire format, and both report token usage and cost per request so you can meter spend in real time.

The number that earns attention: on Sakana's published benchmarks (compiled by [MarkTechPost](https://www.marktechpost.com/2026/06/22/sakana-ai-launches-sakana-fugu-an-orchestration-model-that-routes-tasks-across-a-swappable-pool-of-frontier-llms/)), **Fugu Ultra leads 10 of 11 tests** — scoring **73.7 on SWE-Bench Pro, 82.1 on TerminalBench 2.1, 93.2 on LiveCodeBench, 95.5 on GPQA-D, and 86.6 on CharXiv Reasoning**. On the headline coding test it sits ahead of Opus 4.8 (69.2), Gemini 3.1 Pro (54.2), and GPT-5.5 (58.6). The claim that should make you sit up is not "it scores a little higher" — it is that an orchestrator stitching together those same models scores *above* any of them alone.

How? Two ICLR 2026 papers sit underneath. **Trinity** ([arXiv:2512.04695](https://arxiv.org/abs/2512.04695)) is a lightweight evolved coordinator that assigns Thinker / Worker / Verifier roles adaptively. **Conductor** ([arXiv:2512.04388](https://arxiv.org/abs/2512.04388)) is reinforcement-learning-trained to discover natural-language coordination strategies and focused prompts. Together they are why Fugu can behave like a senior engineer who knows when to pull in a specialist instead of guessing alone.

Two caveats are baked into the design, and they matter more than the marketing admits. The **routing is proprietary** — per-query model selection stays hidden, so from the response you cannot tell which model answered. And while regular \`fugu\` lets teams opt specific agents out of the pool for compliance, **Fugu Ultra does not** ([MarkTechPost](https://www.marktechpost.com/2026/06/22/sakana-ai-launches-sakana-fugu-an-orchestration-model-that-routes-tasks-across-a-swappable-pool-of-frontier-llms/)). Hold onto both of those — they decide whether Fugu is right for you.`,
        },
        {
            heading: 'How do you call the Sakana Fugu API?',
            content: `Because Fugu speaks the OpenAI format, there is no new SDK to learn — it is a base-URL-and-key swap, identical in shape to the gateway swaps I broke down in [OpenRouter vs LiteLLM vs Portkey](/en/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026):

\`\`\`python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sakana.ai/v1",   # your Fugu endpoint — copy the exact value from console.sakana.ai
    api_key="YOUR_SAKANA_API_KEY",
)

resp = client.chat.completions.create(
    model="fugu-ultra-20260615",           # or "fugu" for fast, cheaper turns
    messages=[
        {"role": "user",
         "content": "Refactor this function and add tests: <paste code>"},
    ],
)
print(resp.choices[0].message.content)
# Fugu reports cost + token usage on resp.usage, so you can meter spend per request.
\`\`\`

Two practical notes the launch glosses over. First, **the model id is your entire routing lever from the outside.** \`fugu\` versus \`fugu-ultra-20260615\` is the whole control surface, because everything past that point is the proprietary router's decision. If you want per-call control over *which* underlying model runs, an orchestration model is the wrong abstraction — reach for a transparent gateway like LiteLLM or OpenRouter instead. Second, **pin the dated id (\`-20260615\`), not a floating alias.** Sakana will ship new Ultra snapshots, and a silent upgrade to your orchestrator is a silent change to *every* model behind it — far more blast radius than a normal model version bump.

Because the wire format is identical, you can A/B Fugu against your current provider by swapping two strings behind a feature flag — the same near-zero switching cost that makes any OpenAI-compatible endpoint cheap to evaluate in an afternoon.`,
        },
        {
            heading: 'Where does an orchestration model like Fugu actually shine?',
            content: `An orchestration model is overkill for a single well-scoped task and underrated for messy, mixed workloads. Three places it earns its price:

**1. Heterogeneous request streams you do not control.** If your product takes open-ended user prompts — a coding assistant, a research agent, a support bot — some turns are trivial and some need a frontier model. Hand-tuning a router for that distribution is real work, and it drifts as your traffic changes. Fugu absorbs that decision, and its benchmark lead suggests its routing is at least as good as a hand-built heuristic.

**2. Multi-step problems that genuinely benefit from a second opinion.** The Thinker / Worker / Verifier structure from [Trinity](https://arxiv.org/abs/2512.04695) means a hard request can be drafted by one model and checked by another before you ever see it. For agentic coding — and the SWE-Bench Pro (73.7) and TerminalBench 2.1 (82.1) numbers are exactly that shape — verification by a *different* model catches mistakes a single pass misses.

**3. Provider resilience as a hard requirement.** If a single-vendor outage or an export-control change can take your product down, an endpoint that reroutes around it is a business-continuity story you can put in front of a risk-averse buyer — the explicit pitch Sakana makes after the Fable 5 and Mythos restrictions.

Here is the personal angle. I build exactly this layer for clients — a provider abstraction with a cheap-first, frontier-fallback policy and validation in between (I described the full pattern in my [DeepSeek V4 Vision production writeup](/en/notes/deepseek-v4-vision-cheapest-multimodal-api-2026)). Fugu is that layer sold as a product, and for a team without an engineer who *enjoys* this plumbing, that is a genuine shortcut. The failure mode I would worry about is the one Fugu's own design creates: when the router is a black box, you lose the per-call logs that make the hand-built version *debuggable*. For [MyFinancial](/en/projects), where I have to be able to answer "which model produced this number, and why," that opacity is disqualifying — which is the whole tension of the next two sections.`,
        },
        {
            heading: 'Sakana Fugu vs a single frontier model vs your own router',
            content: `First, the benchmark spread Sakana published (higher is better; **bold** = best in row):

| Benchmark | Fugu | Fugu Ultra | Opus 4.8 | Gemini 3.1 Pro | GPT-5.5 |
|---|---|---|---|---|---|
| SWE-Bench Pro | 59.0 | **73.7** | 69.2 | 54.2 | 58.6 |
| TerminalBench 2.1 | 80.2 | **82.1** | 74.6 | 70.3 | 78.2 |
| LiveCodeBench | 92.9 | **93.2** | 87.8 | 88.5 | 85.3 |
| GPQA-D | 95.5 | **95.5** | 92.0 | 94.3 | 93.6 |
| CharXiv Reasoning | 85.1 | **86.6** | 84.2 | 83.3 | 84.1 |

Figures: Sakana's own published numbers via [MarkTechPost](https://www.marktechpost.com/2026/06/22/sakana-ai-launches-sakana-fugu-an-orchestration-model-that-routes-tasks-across-a-swappable-pool-of-frontier-llms/). Treat any vendor's self-reported benchmarks as a ceiling, not a guarantee — but the consistency across coding and reasoning suites is notable.

Benchmarks are not the buying decision, though. This is:

| Factor | Sakana Fugu | One frontier model | Your own router (LiteLLM / OpenRouter) |
|---|---|---|---|
| Setup effort | one base-URL swap | one base-URL swap | days of routing + fallback code |
| Which model answered | **hidden (proprietary)** | always known | always known |
| Per-call model control | none (id only) | full | full |
| Cross-model verification | built in | none | you build it |
| Provider-outage resilience | built in | none | you build it |
| Vendor lock-in | Sakana | the model vendor | yours to control |
| Data path / residency | through Sakana's pool | direct to vendor | direct to vendor |

Read it this way: Fugu trades **transparency and control** for **zero-effort routing and resilience**. A single frontier model wins when you have already chosen your model and value a direct, auditable path to it. A self-built gateway wins when you need to see and steer every call — the exact trade-off I broke down in [OpenRouter vs LiteLLM vs Portkey](/en/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026). Fugu wins specifically when routing *quality* matters to you more than knowing *how* the routing happened.`,
        },
        {
            heading: 'When should you skip Sakana Fugu (or wait)?',
            content: `Cheap-to-try is not the same as right-to-adopt. Concrete reasons to hold off:

**You need to know which model saw your data.** Proprietary routing means a request might be served by Opus, Gemini, or GPT — and you cannot tell which from the response. For regulated data (finance, healthcare, EU residency), "we sent it to one of several US model providers, we are not sure which" is not an answer a compliance reviewer accepts. Fugu Ultra's inability to opt agents out of the pool makes this harder, not easier.

**You have already picked your model.** If your evals say Opus 4.8 is the right model for your task, paying an orchestration layer to *maybe* route to it — possibly with extra latency from a multi-hop Thinker / Worker / Verifier pass — is paying for indecision you do not have.

**You need auditable per-call observability.** Black-box routing means your traces cannot say "this answer came from model X at cost Y." For debugging a bad output, or explaining a result to a user or auditor, that gap is real and permanent.

**It is one week old.** Fugu shipped June 22, 2026. Rate limits, uptime, latency under load, and routing behaviour on adversarial inputs are all unproven at scale, and Sakana publishes no latency SLA in the launch materials. Treat it like any week-old single endpoint: instrument it heavily, and never make it a hard dependency without your own fallback — which is exactly what the next section is about.`,
        },
        {
            heading: 'How I would ship Sakana Fugu in production',
            content: `The temptation with a resilience product is to treat it *as* your resilience layer and stop there. Do not. Fugu routes around *underlying model* outages, but Fugu itself is a single week-old endpoint with one company behind it — so the first rule is the same as for any new provider: **wrap it in your own abstraction so it is one option, not the only one.** The irony is intentional: you put a fallback around the fallback-as-a-service.

\`\`\`python
async def complete(prompt: str) -> str:
    # 1. Try Fugu for its routing + cross-model verification on hard turns.
    try:
        out = await call("sakana", "fugu-ultra-20260615", prompt, timeout=45)
        if out and out.strip():
            return out
    except (TimeoutError, ApiError):
        pass
    # 2. Fall back to a model YOU pinned, on a DIFFERENT vendor, when Fugu is slow or down.
    return await call("anthropic", "claude-opus-4-8", prompt, timeout=30)
\`\`\`

The wiring that decides whether this is robust:

- **Log the Fugu id and \`usage\` on every call.** You cannot see *which* sub-model answered, but you can and must record cost, latency, and the Fugu model id — so you have your own data when you re-evaluate, not just the vendor's blog.
- **Set a generous timeout, then a hard fallback.** Multi-hop orchestration can be slower than a single call; budget for it (I used 45s above) but cut to a direct model when it blows past.
- **Keep a non-Sakana path warm.** The whole pitch is provider resilience — undercut it and you have simply moved your single point of failure from a model vendor to an orchestration vendor.
- **Answer data residency before wiring anything.** If you cannot send user data into an opaque pool of US model providers, the integration ends here regardless of how good the benchmarks look.

This provider-abstraction-plus-validation plumbing — the part that looks like a two-string swap and quietly has five sharp edges — is exactly what I build into a [6-week MVP](/en/services/6-week-mvp), and the kind of integration where a [founding engineer](/en/services/hire-founding-engineer-india) earns their keep, because the README shows you the happy path and never the residency, observability, and fallback work that makes it safe to ship.`,
        },
        {
            heading: 'The bottom line',
            content: `Sakana Fugu is the most interesting *packaging* idea in AI tooling in months: take the router-plus-fallback pattern every serious LLM team rebuilds, train a model to do the routing, and sell it behind one OpenAI-compatible call — with benchmarks (73.7 SWE-Bench Pro, 95.5 GPQA-D, leading 10 of 11 tests) suggesting the routing is genuinely good. Adopt it when you have heterogeneous traffic, value provider resilience, and do not need to know which model answered. Skip it when you have already chosen a model, need auditable per-call observability, or handle regulated data — its black-box routing is a feature for convenience and a bug for compliance. Either way, wrap it in your own fallback: a resilience product you cannot fall back *from* is not resilient. For the broader picture of what else shipped this week, see my [Week 26 AI dev roundup](/en/notes/ai-dev-week-2026-26).

Trying to decide whether an orchestration layer belongs in your stack — or whether a transparent router serves you better? That provider-architecture call is exactly the kind of decision I help founders get right before it calcifies into the codebase. See the [6-week MVP service](/en/services/6-week-mvp) or [hire a founding engineer](/en/services/hire-founding-engineer-india).`,
        },
    ],
    cta: {
        text: 'Ship your AI-orchestration MVP in 6 weeks',
        href: '/en/services/6-week-mvp',
    },
};

import type { BlogPost } from '@/types/blog';

export const bonsai27bTernaryQuantizationGuide2026: BlogPost = {
    slug: 'bonsai-27b-ternary-quantization-guide-2026',
    title: 'Bonsai 27B: A 27B Model on Your Phone — and the One Benchmark That Collapses (2026)',
    date: '2026-07-15',
    excerpt:
        'PrismML shipped 1-bit and ternary builds of Qwen3.6-27B on July 14, 2026 — 5.9 GB for ternary, 3.9 GB for 1-bit, running at 163 tok/s on an RTX 5090 and 11 tok/s on an iPhone 17 Pro. Every writeup leads with "retains 95% of baseline." Nobody breaks out the row that matters: tool-calling drops 80.0 to 66.0 at 1-bit — degrading 4.6x worse than math. For a model sold on laptop-local agents, that is the whole story. Here is the variant decision table, the runnable commands, the KV-cache trap that makes 5.9 GB of weights need 13.7 GB of RAM, and how I would ship this in production.',
    readingTime: '12 min read',
    keywords: [
        'bonsai 27b ternary quantization guide',
        'bonsai 27b run locally',
        'ternary quantization llm tool calling',
        'run 27b model on phone',
        '1-bit llm local inference',
        'ternary bonsai llama.cpp mlx',
        'qwen3.6-27b quantized',
        'on-device llm agent 2026',
    ],
    coverImage: {
        src: '/images/notes/bonsai-27b-ternary-quantization-guide-2026-cover.jpg',
        alt: 'Glowing miniature bonsai grown from a crystalline chip illustrating Bonsai 27B ternary quantization on-device',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `PrismML released **Bonsai 27B** on **July 14, 2026** — ternary (**1.71 bits/weight**, **5.9 GB**) and 1-bit (**1.125 bits**, **3.9 GB**) builds of Qwen3.6-27B, **Apache 2.0**, 262K context, per the [official announcement](https://prismml.com/news/bonsai-27b). It hits **163 tok/s on an RTX 5090** and **11 tok/s on an iPhone 17 Pro**. Ternary retains ~95% of baseline, 1-bit ~90% — but **tool-calling falls 80.0 → 66.0 at 1-bit**, degrading 4.6x worse than math. Use ternary for anything agentic, 1-bit only for chat and summarization.`,
        },
        {
            heading: 'Bonsai 27B: what a 27B model on a phone actually costs you',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On **July 14, 2026**, PrismML published 1-bit and ternary compressions of Qwen3.6-27B and called the result [Bonsai 27B](https://prismml.com/news/bonsai-27b). The headline wrote itself, and Hacker News obliged: *"a 27B-class model that runs on a phone"* hit **498 points and 184 comments** within a day. The ternary build is **5.9 GB**. The 1-bit build is **3.9 GB**. Both are Apache 2.0. Both ship with a 262K-token context.

The capability that changed is not "small model gets good." It's that a **27B-parameter multimodal model now fits in the memory budget of a phone**, at a quality the vendor measures at 95% of full precision for ternary and 90% for 1-bit — 9x smaller, single-digit quality loss.

Every writeup of this release — the vendor's, [MarkTechPost's](https://www.marktechpost.com/2026/07/14/prismml-releases-bonsai-27b-1-bit-and-ternary-builds-of-qwen3-6-27b-that-run-on-laptops-and-phones/), the ones on X — leads with that "retains 95%" number and moves on. But averages hide distributions. Pull the per-category table apart and one row behaves nothing like the others — the exact row that decides whether the "laptop-local agents" pitch survives production. This guide is that analysis, plus the commands to run it today and the memory trap that hits at 100K context.`,
        },
        {
            heading: 'What exactly did PrismML ship?',
            content: `Two compressions of the same base model, **Qwen3.6-27B**, plus a vision tower in compact 4-bit form:

| Variant | Weight scheme | Effective bits/weight | File size | Baseline retained |
|---------|---------------|----------------------|-----------|-------------------|
| **Ternary Bonsai 27B** | {−1, 0, +1} + FP16 group-wise scaling | **1.71** | **5.9 GB** | **~95%** |
| **1-bit Bonsai 27B** | {−1, +1} + group-wise scaling | **1.125** | **3.9 GB** | **~90%** |

Note the honest detail in that table: ternary is advertised across the ecosystem as "1.58-bit" (the information-theoretic floor of three states, log₂3 ≈ 1.585), but the *actual* on-disk cost is **1.71 bits/weight** once you pay for FP16 group-wise scaling. PrismML publishes the real number rather than the theoretical one — a small but real credibility signal. Same for 1-bit: 1 bit in theory, **1.125** in practice.

Throughput, from the [official numbers](https://prismml.com/news/bonsai-27b):

| Hardware | 1-bit | Ternary |
|----------|-------|---------|
| NVIDIA RTX 5090 | **163 tok/s** | **134 tok/s** |
| Apple M5 Max | **87 tok/s** | **58 tok/s** |
| iPhone 17 Pro | **11 tok/s** | — |

The 262K context isn't a quantization trick — it's inherited. Roughly **75% of Qwen3.6-27B's attention is linear**, which is what keeps a context that long tractable on consumer memory. Quantization shrank the weights; the architecture is what makes the context survivable.

Read that **11 tok/s on iPhone 17 Pro** figure carefully — it's the number the headline rests on and the number most people skip. Eleven tokens per second is roughly a slow reading pace: a genuine technical achievement, and *not* a good interactive experience.`,
        },
        {
            heading: 'How does ternary quantization actually work?',
            content: `A standard model stores each weight as a 16-bit float — 65,536 possible values per weight. Ternary quantization stores each weight as one of **three** values: −1, 0, or +1. That's it. Three states, ~1.58 bits of information.

The obvious objection is that you've thrown away almost everything. The reason it works anyway is **group-wise scaling**. Weights are chunked into small groups, and each group gets a shared FP16 scaling factor. So a weight isn't really "−1" — it's "−1 × (this group's scale)." The ternary value carries direction and rough magnitude class; the group scale restores actual size. You store shape cheaply and amplitude sparsely.

Those scaling factors are exactly why the real cost is **1.71 bits and not 1.58** — the FP16 scales are extra bytes amortized across each group. Smaller groups mean better fidelity but more overhead; larger groups save bits but lose precision. 1.71 is where PrismML landed that tradeoff.

The 1-bit variant drops the middle state: {−1, +1} only, no zero. That single missing value is why it lands at 1.125 bits and ~90% retention. Losing the ability to say *"this weight contributes nothing"* costs about five points of average benchmark performance — and, as the next section shows, far more on one specific capability.

This is post-training compression of an already-trained Qwen3.6-27B, worth naming because the literature is clear that [pre-training natively in low precision](https://arxiv.org/pdf/2406.07177) generally beats post-training quantization at extreme bit-widths. Bonsai does the harder version and gets good numbers anyway — but it means degradation isn't uniform. It lands hardest wherever the base model's precision was doing the most work.`,
        },
        {
            heading: 'Which benchmark actually collapses under quantization?',
            content: `This is the section no one else wrote, and it's the reason I picked this release over the five other things trending yesterday.

Everyone reports the average: 85.0 baseline → 80.5 ternary → 76.1 1-bit. Roughly 95% and 90% retention. Fine. Now break it out by category, from PrismML's own 15-benchmark suite in thinking mode:

| Benchmark | Baseline | Ternary | 1-bit | 1-bit degradation |
|-----------|----------|---------|-------|-------------------|
| Overall | 85.0 | 80.5 | 76.1 | −10.5% |
| **Math** | 95.3 | 93.4 | 91.7 | **−3.8%** |
| **Coding** | 88.7 | 86.0 | 81.9 | −7.7% |
| **Tool-calling** | 80.0 | 74.0 | 66.0 | **−17.5%** |

**Tool-calling degrades 4.6x worse than math.** Math loses 3.8% of its score going all the way to 1-bit. Tool-calling loses 17.5% — and it started from the lowest baseline of the three (80.0 vs math's 95.3), so it's falling further from a lower floor. At 1-bit, a model marketed for "agentic workflows" is scoring **66 out of 100** on the benchmark that measures agentic workflows.

Why would tool-calling be the fragile one? A plausible reading: math and code have strong, redundant, self-reinforcing structure — there are many internal paths to "2 + 2 = 4," so lopping off weight precision degrades gracefully. Tool-calling is a *format-and-selection* task. The model must pick exactly the right function from several similar ones, and emit precisely-shaped JSON with the right argument names. That's a low-margin discrimination problem: near-miss is total failure. \`get_weather(city="Paris")\` and \`get_forecast(location="Paris")\` are semantically adjacent and functionally different. Quantization blurs fine distinctions, and fine distinctions are the entire job.

I want to be careful here: that mechanism is my read, not PrismML's stated finding — they publish the numbers, not a causal explanation. But you don't need the mechanism to act on the data. **The number is the number**, and it inverts the marketing:

> The 1-bit build is the one that best delivers "runs on a phone." It is also the one that worst delivers "agent."

If you're building a local agent, the free 2 GB you save by choosing 1-bit over ternary costs you 8 points of tool-calling accuracy. That is not a good trade, and it's invisible if you only read the headline retention figure.`,
        },
        {
            heading: 'How do I run Bonsai 27B locally?',
            content: `The [demo repo](https://github.com/PrismML-Eng/Bonsai-demo/) wraps llama.cpp and MLX behind scripts. Setup:

\`\`\`bash
git clone https://github.com/PrismML-Eng/Bonsai-demo && cd Bonsai-demo
./setup.sh                       # macOS / Linux
\`\`\`

Pick your variant and family with environment variables, then run:

\`\`\`bash
export BONSAI_MODEL=27B           # 27B | 8B | 4B | 1.7B   (default: 27B)
export BONSAI_FAMILY=ternary      # ternary | bonsai       (bonsai = the 1-bit family)
export BONSAI_TOKEN="hf_..."      # REQUIRED for 27B — the 27B repos are gated

./scripts/run_llama.sh -p "Explain ternary quantization in two sentences."
./scripts/start_llama_server.sh   # OpenAI-compatible server on :8080
\`\`\`

**The gate is the first thing that will stop you, and no writeup mentions it.** The open, no-token downloads in the README are the small ones:

\`\`\`bash
hf download prism-ml/Ternary-Bonsai-8B-gguf Ternary-Bonsai-8B-Q2_0_g64.gguf --local-dir models
\`\`\`

The **27B repos require an HF token** (\`BONSAI_TOKEN\`). So "clone and run the 27B in five minutes" is only true once you've requested access. Budget for that before you promise a demo.

On Apple Silicon, MLX is the faster path:

\`\`\`bash
source .venv/bin/activate
./scripts/run_mlx.sh -p "What is the capital of France?"
\`\`\`

Two knobs worth knowing on day one:

\`\`\`bash
BONSAI_KV4=1 ./scripts/start_llama_server.sh          # 4-bit KV cache — see next section
BONSAI_SPECULATIVE=1 ./scripts/start_llama_server.sh  # speculative decoding (CUDA)
./scripts/start_llama_server.sh --reasoning-budget 2048   # cap thinking tokens
\`\`\`

For tool-calling specifically, the repo routes you through Open WebUI (\`./scripts/start_openwebui.sh\`, port 9090) with tools and vision preconfigured — there's no bare function-calling snippet in the README. Since the server is OpenAI-compatible, you can point any existing OpenAI-SDK tool-calling code at \`http://localhost:8080/v1\` and it should work — which is also exactly how you should measure the tool-calling degradation on *your* function schemas rather than trusting the benchmark.`,
        },
        {
            heading: 'Why memory, not model size, is the real constraint',
            content: `Here's the trap. The ternary weights are **5.9 GB**, so you reasonably conclude an 8 GB machine is fine. Then you actually use the 262K context and it falls over.

Peak memory from the repo's own estimates:

| Context length | Peak memory (FP16 KV cache) |
|----------------|----------------------------|
| 4K | **~7.8 GiB** |
| 100K | **~13.7 GiB** |

The weights never change — they're 5.9 GB in both rows. **The KV cache is what grows**, and at 100K context it's larger than the model itself. You're budgeting for a 5.9 GB model and actually needing ~13.7 GiB of headroom.

This is the single most useful practical fact in the release, and it's the one buried deepest. The 262K context is the headline feature; the KV cache is the invoice. That's what \`BONSAI_KV4=1\` (4-bit KV cache) exists for, and on any memory-constrained device it isn't optional — it's the difference between "the long-context feature works" and "the process dies."

So the honest hierarchy of what you're actually optimizing:

1. **KV cache** — scales with context, dominates at long context, fix with \`BONSAI_KV4=1\`
2. **Weights** — fixed 5.9 GB (ternary) or 3.9 GB (1-bit)
3. **Everything else** — noise by comparison

Which means the ternary-vs-1-bit decision buys you 2 GB, while the KV-cache decision buys you ~6 GiB at 100K context. **Fix your KV cache before you compromise your weights** — and you'll keep the 8 points of tool-calling accuracy you'd have paid for that 2 GB.`,
        },
        {
            heading: 'Which variant should you actually pick?',
            content: `Putting the numbers together into the decision the vendor doesn't make for you:

| Your use case | Pick | Why |
|---------------|------|-----|
| Local **agent** with function calls | **Ternary** | 74.0 tool-calling vs 66.0. The 2 GB you'd save isn't worth 8 points on the capability you're building on. |
| Chat / summarization / drafting | **1-bit** | Tool-calling irrelevant; 3.9 GB and 163 tok/s on a 5090 is the best speed-per-GB here. |
| Coding assistant | **Ternary** | 86.0 vs 81.9. Coding is mid-fragile; the gap is real but not fatal. |
| Math / reasoning | **Either** | 93.4 vs 91.7 — math barely notices. Take 1-bit and the free 2 GB. |
| Phone deployment | **1-bit**, eyes open | It's the only one that fits, at 11 tok/s. Fine for async, painful interactively. |
| Long context (100K+) | **Ternary + \`BONSAI_KV4=1\`** | KV cache dominates; fix that before touching weights. |
| Production agent, reliability critical | **Neither — see below** | |

The pattern: **the more your workload depends on precise discrimination (pick the right tool, emit exact JSON), the more you should pay in bits.** The more it depends on redundant structure (math, prose), the more aggressively you can compress.`,
        },
        {
            heading: 'When should you skip Bonsai 27B?',
            content: `Skip it — or wait — in these cases. I'd rather say this plainly than pretend a 5.9 GB 27B is free.

**Your agent needs reliable multi-step tool calls.** Even ternary is **74.0** on tool-calling, from a baseline that was itself only 80.0. In an agent loop, per-step accuracy compounds: at a generous 90% per-step success, five steps lands near 59% end-to-end. A frontier API model isn't a luxury here; it's the difference between a demo and a product. Same failure mode I wrote about in [AI agent command guardrails](/en/notes/ai-agent-command-guardrails-2026) — local models don't remove the need for a verification layer, they raise it.

**You expect phone inference to feel interactive.** 11 tok/s on an iPhone 17 Pro is real, and slow. It fits background summarization, not a chat UI someone waits on.

**You need the 27B today, on a deadline.** The 27B repos are gated behind an HF token. The ungated path is 8B/4B/1.7B.

**You haven't measured on your own schemas.** A 15-benchmark suite is not your function catalog. With twelve similarly-named tools, expect worse than 74.0 — near-miss discrimination is exactly what quantization damages.

**You'd be adopting it for the headline.** "27B on a phone" is a great tweet. If your real constraint is quality-per-dollar on a server, a well-served 8B at full precision may beat a quantized 27B — and will certainly beat it on tool-calling.

Where it genuinely shines: **privacy-hard workloads** (nothing leaves the device), **offline** environments, **cost-floor** batch processing on hardware you own, and **long-document analysis** at 262K context where an API's per-token bill would be brutal. Apache 2.0 means you can ship it commercially without a conversation with legal.`,
        },
        {
            heading: 'How I would ship this in production',
            content: `The integration that isn't in the README: **you don't pick one model, you route between two.**

Every local-model project I've built for a client hits the same wall — the local model is great until it isn't, and the failure is silent. So the wiring I'd actually ship for a Bonsai-backed agent:

**1. Route by capability, not by preference.** Ternary Bonsai handles summarization, drafting, extraction, classification — the redundant-structure work where 95% retention is genuinely fine. Tool-calling steps route to a frontier API. You're not choosing local *or* cloud; you're spending your cloud budget only on the 17.5%-degraded capability and keeping everything else on-device. That single split captures most of the cost saving and most of the reliability.

**2. Validate every tool call, then retry against the API.** Since the llama.cpp server is OpenAI-compatible, wrap it: schema-validate the function call locally; on a validation failure, retry once against the cloud model. With ternary at 74.0, roughly one in four tool calls needs that path — which is affordable, and only if you *have* the path. Without validation you don't get a clean fallback, you get a wrong answer with a green status code. That's the exact failure I built [Agent Autopsy](https://github.com/rohitguta2432/agent-autopsy) for: the run completes, the trace looks healthy, and the result is quietly wrong.

**3. Pin \`BONSAI_KV4=1\` before you tune anything else.** ~13.7 GiB at 100K context will OOM a machine you sized from the 5.9 GB figure. Set it on day one.

**4. Benchmark on your own tool schemas in week one.** Point your existing OpenAI-SDK eval at \`localhost:8080/v1\` and measure. Twenty minutes of work that tells you whether 74.0 is optimistic or pessimistic *for you*. If your catalog has near-duplicate tools, rename them to be maximally distinct — you're helping a blurry model make a fine distinction, and that's free accuracy.

**5. Expect the vision tower to be the weak link.** It ships in compact 4-bit while the language weights are ternary — different bit-widths, different degradation, and no per-category vision benchmark published. Treat vision as unmeasured until you measure it.

The failure mode I'd worry about most isn't the model being wrong. It's the model being *plausibly* wrong on a tool call — right function, subtly wrong argument — inside a loop with no validation. Quantization doesn't make a model refuse; it makes it confidently imprecise. Build the check.`,
        },
        {
            heading: 'Getting this into your product without the surprises',
            content: `Bonsai 27B is genuinely impressive engineering: 27B parameters, 5.9 GB, Apache 2.0, 262K context, 134 tok/s on a 5090. If your workload is summarization, extraction, or long-document analysis and privacy or cost binds, it's an easy yes — take ternary, set \`BONSAI_KV4=1\`, ship it.

If you're building an **agent**, take ternary, route tool-calling to an API, validate every call, and spend the 2 GB you didn't save on 8 points of accuracy. The headline number was never the one that mattered.

Wiring that hybrid routing — local model, cloud fallback, schema validation, the observability to know which path ran — is what eats a month if you haven't built it before. That's my work: [6-week MVPs](/en/services/6-week-mvp) that ship with the fallback path already in place, or a [founding engineer](/en/services/hire-founding-engineer-india) embedded with your team. If you're weighing local-vs-API for an AI feature, that's a conversation worth having before you've built on the wrong side of it.`,
        },
    ],
    cta: {
        text: 'Building a local-first AI feature? Let us wire the fallback path properly.',
        href: '/en/services/6-week-mvp',
    },
};

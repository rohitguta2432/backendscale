import type { BlogPost } from '@/types/blog';

export const inkling975bRunLocallyVramGuide2026: BlogPost = {
    slug: 'inkling-975b-run-locally-vram-guide-2026',
    title: 'Inkling 975B: The Open-Weights Model Almost Nobody Should Self-Host (2026)',
    date: '2026-07-16',
    excerpt:
        'Thinking Machines released Inkling on July 15, 2026 — 975B params, 41B active, Apache 2.0, 1M context, weights on Hugging Face. Every writeup tells you how to run it. None tells you whether to. The BF16 checkpoint needs 2 TB of VRAM; NVFP4 needs 600 GB. The 8x H200 box they name is an AWS p5en.48xlarge at $63.296/hr — $46,206/month always-on. Against the $4.68/M output API, self-hosting breaks even at 9.87 billion output tokens a month. Here is the VRAM ladder, the real cost math, the July 17 price hike everyone missed, and the quant trap that will eat your agent.',
    readingTime: '12 min read',
    keywords: [
        'inkling 975b run locally',
        'inkling 975b vram requirements',
        'inkling hardware requirements',
        'thinking machines inkling guide',
        'inkling 975b api pricing',
        'self host vs api llm cost',
        'inkling nvfp4 quantization',
        'open weights model cost 2026',
    ],
    coverImage: {
        src: '/images/notes/inkling-975b-run-locally-vram-guide-2026-cover.jpg',
        alt: 'Sparse glowing neural lattice with few active pathways illustrating Inkling 975B mixture-of-experts local hardware requirements',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**Thinking Machines** released [Inkling](https://thinkingmachines.ai/news/introducing-inkling/) on **July 15, 2026** — **975B** total / **41B** active MoE, **Apache 2.0**, **1M** context, text+image+audio in. Weights are free on [Hugging Face](https://huggingface.co/thinkingmachines/inkling). Running them is not: **BF16 needs 2 TB of VRAM**, **NVFP4 needs 600 GB**. The 8x H200 node they specify is an AWS **p5en.48xlarge at $63.296/hr — $46,206/month**. The Inkling API is **$4.68 per 1M output tokens**, so self-hosting only wins past **~9.87 billion output tokens/month**. Use the API. Self-host only to fine-tune or to keep data in-house.`,
        },
        {
            heading: 'Inkling 975B: free weights, $46,206-a-month hardware',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

Forty-six thousand dollars a month. That's what the machine costs.

The weights are free — Apache 2.0, no gate, no waitlist, [sitting on Hugging Face](https://huggingface.co/thinkingmachines/inkling) since **July 15, 2026**. Thinking Machines Lab, the company Mira Murati founded after leaving OpenAI as CTO, shipped **Inkling**: **975 billion** total parameters, **41 billion** active per token, **1M** context, native reasoning over text, images, and audio. It is the largest genuinely open-weights model a US lab has released. Hacker News found it within hours; the Hugging Face repo cleared **429 likes** on day one.

Then you read the deployment section. The BF16 checkpoint wants **2 TB of aggregated VRAM** — 8x NVIDIA B300 or 16x H200. The NVFP4 build drops that to **600 GB**, which still means 4x B300 or 8x H200. "Open weights" and "you can run this" turned out to be very different claims, and the gap between them is where every writeup published this week stops.

That gap is the whole decision. [MarkTechPost](https://www.marktechpost.com/2026/07/15/thinking-machines-lab-releases-inkling-a-975b-parameter-open-weights-multimodal-moe-with-41b-active-parameters-and-controllable-thinking-effort/) explains the architecture. The [Hugging Face blog](https://huggingface.co/blog/thinkingmachines-inkling) gives you fourteen code paths to load it. [Unsloth](https://unsloth.ai/docs/models/inkling) publishes the quant table. All three answer *how*. This guide answers *whether* — with the hardware bill attached, the break-even math nobody ran, a price change landing tomorrow that all of them missed, and the one quantization number that will quietly destroy your agent.`,
        },
        {
            heading: 'What exactly did Thinking Machines ship?',
            content: `A sparse Mixture-of-Experts transformer, trained from scratch on **45 trillion tokens** of text, images, audio, and video. The architecture, per the [model card](https://huggingface.co/thinkingmachines/inkling):

| Property | Value |
|----------|-------|
| Total parameters | **975B** |
| Active per token | **41B** |
| Layers | 66, decoder-only |
| Routing | **6 of 256 experts** + 2 shared experts |
| Attention | Hybrid local + global |
| Context | **1M tokens** |
| Modalities in | Text, image (40–4096px), audio (16kHz, <20 min) |
| Modalities out | Text only |
| License | **Apache 2.0** |
| Checkpoints | BF16, NVFP4 |

There's also **Inkling-Small** at **276B total / 12B active** — the variant most people should actually be looking at, and the one that gets roughly zero coverage.

On benchmarks it is strong but not leading, and the lab says so directly: *"Inkling is not the strongest overall model available today, open or closed."* That sentence is in the official announcement. It is refreshingly honest and it is also correct. **AIME 2026: 97.1%**. **GPQA Diamond: 87.2%**. **SWEBench Verified: 77.6%** — against Claude Fable 5's **95.0%**. **Terminal Bench 2.1: 63.8%** — against GLM 5.2's **82.7%**. **HLE text-only: 29.7%** vs Claude Fable 5's **53.3%**.

Where it genuinely competes is agentic tool use: **MCP Atlas 74.1%**, ahead of DeepSeek V4 Pro (73.2%) and far ahead of Nemotron 3 Ultra (44.7%). [Artificial Analysis](https://artificialanalysis.ai/models/inkling) scores it **41 on their Intelligence Index — #10 of 97 models**, well above the median of 25 for open-weight models of similar size.

So: a competent, honest, genuinely open frontier-adjacent model. The question was never whether it's good. It's what it costs to put it to work.`,
        },
        {
            heading: 'How much VRAM do you actually need to run Inkling 975B?',
            content: `Unsloth quantized Inkling down the whole ladder. Their [published table](https://unsloth.ai/docs/models/inkling) is the most useful artifact of this entire release, because it prices the quality/memory trade in a way the vendor doesn't:

| Variant | Disk | RAM + VRAM needed | Top-1% accuracy retained |
|---------|------|-------------------|--------------------------|
| 1-bit (UD-IQ1_S) | 270–285 GB | **280–295 GB** | 74.2–77.4% |
| 2-bit | 317 GB | 325 GB | 81.0% |
| 3-bit | — | 450 GB | 88.7% |
| 4-bit | — | 600 GB | 94.4% |
| 6/8-bit | — | 870 GB | 99.8% |
| BF16 (full) | 1.9 TB | **1,900 GB** | 100.0% |

Read the bottom row again. Full precision is **1.9 TB of weights**. The 1-bit dynamic quant — an **86% size reduction** — still needs **~290 GB of combined RAM and VRAM**. There is no rung on this ladder that reaches a laptop. The cheapest real entry is a 290 GB machine, and that's the one that gives up a quarter of its top-1 accuracy.

To be clear about what that 74.2% means, Unsloth are careful and correct: it does **not** mean the model outputs gibberish 26% of the time. It means that ~26% of the time it picks its second-most-probable token instead of its first. Hold that thought — it matters more than it sounds, and I'll come back to it.

If you do have the hardware, serving is genuinely easy. vLLM:

\`\`\`bash
vllm serve thinkingmachine/Inkling \\
  --tensor-parallel-size 8 \\
  --served-model-name inkling
\`\`\`

SGLang:

\`\`\`bash
python3 -m sglang.launch_server \\
  --model-path thinkingmachine/Inkling \\
  --tp-size 8 \\
  --served-model-name inkling \\
  --host 0.0.0.0 --port 30000
\`\`\`

Or the 1-bit GGUF through llama.cpp, which is the only line here a mortal might run:

\`\`\`bash
llama serve -hf unsloth/Inkling-GGUF:UD-IQ1_S
\`\`\`

Note the sampling defaults Unsloth recommend: \`--temp 1.0 --top-p 1.0 --min-p 0.0\`. Inkling wants an unclamped distribution; the usual \`temp 0.7\` reflex will make it worse, not safer.`,
        },
        {
            heading: 'Should you self-host Inkling or just use the API?',
            content: `Here's the part every writeup skipped. "8x H200" is not an abstraction — it's a rentable SKU. On AWS, 8x H200 (141 GB HBM3e each, **1,128 GB** aggregate) is a **p5en.48xlarge**. Straight from the AWS Price List API this morning, us-east-1, on-demand Linux:

| | p5en.48xlarge (8x H200) |
|---|---|
| Hourly | **$63.296** |
| Daily | $1,519.10 |
| **Monthly (730h)** | **$46,206.08** |
| Yearly | $554,472.96 |

That is the NVFP4 tier — the *discounted* one. BF16 needs 16x H200 or 8x B300, roughly double.

Now the other side. Inkling's API, per [Artificial Analysis](https://artificialanalysis.ai/models/inkling): **$1.87 per 1M input tokens**, **$4.68 per 1M output tokens**, with an 80% discount on cached prefill (blended ~$1.10/M at a 7:2:1 ratio).

Divide:

| Priced at | Break-even volume |
|---|---|
| $4.68/M output | **9,873M output tokens/month** (~**329M/day**) |
| $1.87/M input | 24,709M/month |
| $1.10/M blended | 42,006M/month |

**You need to generate 9.87 billion output tokens every month before that $46,206 node beats the API.** That's 329 million output tokens per day, sustained, forever. To calibrate: 1M output tokens/month costs **$4.68** on the API. 100M costs **$468**. Even a billion output tokens a month — a genuinely heavy production workload — costs **$4,680**, about a tenth of the node.

And it gets worse tomorrow, in the direction you'd expect and the direction nobody wrote about. Thinking Machines is **raising prefill and sample prices ~50% (and train ~10%) starting July 17, 2026** — the day after this post. At **~$7.02/M output**, break-even falls to **6.58 billion tokens/month**. Still nowhere near you.

One more number that reframes the whole release: Artificial Analysis ranks Inkling **#81 on price**, against a median of **$0.60 input / $2.20 output** for comparable open-weight models. Inkling's API is roughly **2x the going rate for open models**. So the honest summary is: *the API is expensive, and self-hosting is worse.* Inkling is not a cost play. Anyone selling it as one hasn't done this arithmetic.`,
        },
        {
            heading: 'Inkling vs the alternatives: which do you actually reach for?',
            content: `Against the models it's genuinely competing with, using the [official benchmark table](https://thinkingmachines.ai/news/introducing-inkling/):

| | **Inkling 975B** | GLM 5.2 | DeepSeek V4 Pro | Claude Fable 5 |
|---|---|---|---|---|
| Weights | **Open (Apache 2.0)** | Open | Open | Closed |
| Total / active params | 975B / 41B | — | — | — |
| SWEBench Verified | 77.6% | 80.0% | 80.6% | **95.0%** |
| Terminal Bench 2.1 | 63.8% | **82.7%** | 64.0% | 84.6% |
| MCP Atlas | 74.1% | **77.8%** | 73.2% | **83.3%** |
| AIME 2026 | 97.1% | **99.2%** | 96.7% | **99.9%** |
| HLE (text only) | 29.7% | **40.1%** | 35.9% | **53.3%** |
| FORTRESS Adversarial | 78.0% | 71.3% | 36.0% | **96.0%** |
| Self-host floor | **600 GB VRAM** | lower | lower | n/a |
| API $/1M out | $4.68 | — | — | — |

The uncomfortable read: **GLM 5.2 beats Inkling on five of six capability rows** and is also open. If your reason for choosing Inkling is raw benchmark performance among open models, the table doesn't support the choice.

What the table *does* support: Inkling is unusually well-rounded (text + vision + audio in one set of weights, **VoiceBench 91.4%**, **MMMU Pro 73.5%**), unusually safe for an open model (**FORTRESS Adversarial 78.0%** vs DeepSeek V4 Pro's 36.0% — a 42-point gap), and it's **Apache 2.0**, which means you can fine-tune it and ship the result commercially with nobody's permission. That last column is the actual product.`,
        },
        {
            heading: 'When to skip Inkling — and the quant number that will eat your agent',
            content: `Skip it if you want cheap inference. It's 2x the median open-model API price and the self-host floor is a $46k/month node. [GLM 5.2](https://thinkingmachines.ai/news/introducing-inkling/) scores higher on most rows. If you're picking a model to serve a chat feature, this isn't it.

Skip it if you're chasing frontier quality. The lab told you: not the strongest, open or closed. Claude Fable 5 is **17.4 points ahead on SWEBench Verified**.

Skip the 1-bit quant entirely if you're building an agent — and this is the part I'd want someone to tell me before I burned a sprint on it.

Go back to that **74.2% top-1% accuracy retention** at 1-bit. Unsloth's framing is honest: it means the model reaches for its second-choice token about a quarter of the time. For prose, that's invisible — second-choice tokens usually produce a fine sentence. For **tool calls, it is not invisible at all.** A tool call is a rigid structure: exact function name, exact JSON keys, exact types. There is no graceful second-best for \`"user_id"\` — the alternative is a key your schema rejects. Chat degrades smoothly under quantization; structured output degrades off a cliff.

I watched this exact pattern last week. [Bonsai 27B](/en/notes/bonsai-27b-ternary-quantization-guide-2026) published per-category quant results, and where the average said "95% retained," tool-calling had fallen from **80.0 to 66.0** at 1-bit — degrading **4.6x worse than math**. Same mechanism, same trap, different model. Inkling's published quant table reports **only** aggregate top-1% accuracy. There is no per-category breakdown. So the number that would tell you whether 1-bit Inkling can still call tools **has not been published** — and given it's the load-bearing number for the agentic use case Inkling is best at (MCP Atlas 74.1%, its strongest relative row), that omission matters.

My read: assume 1-bit Inkling is a chat model, not an agent. If you need both the 290 GB footprint *and* tool-calling, benchmark tool-call validity yourself before you design around it. Don't infer it from 74.2%.`,
        },
        {
            heading: 'How I would actually ship this in production',
            content: `I wouldn't self-host the 975B. Neither should you, and the arithmetic above is the entire argument — the node only makes sense past **9.87B output tokens/month**, and if you were at that volume you'd have a platform team, not a blog post.

Three paths I'd actually take, in order:

**1. API first, always.** Start on the hosted endpoint. At **$4.68/M output** you can run a real product for months on what a single day of p5en.48xlarge costs. Instrument your token volume from day one. If you ever approach **300M output tokens/day**, revisit — and you won't.

**2. Fine-tune Inkling-Small, not Inkling.** This is the release's real story and it's buried. **276B total / 12B active** is a completely different hardware conversation, and Apache 2.0 means a domain-tuned checkpoint is yours to ship. The reason to touch these weights is **customization**, not inference economics. Thinking Machines built [Tinker](https://tinker-docs.thinkingmachines.ai/tinker/models/) for exactly this, and note that train prices go up only **~10%** on July 17 versus **~50%** for inference — the pricing is telling you what the product is for.

**3. Self-host only for data residency.** If contracts say weights and data stay in your VPC, the $46,206 stops being a cost comparison and becomes the price of compliance. That's a legitimate reason — the only one I'd sign off on. Budget the NVFP4 tier (600 GB, 8x H200), not BF16.

Whichever path: **route tool-calling to a full-precision endpoint.** Keep the quantized model for generation and summarization, send structured output to something that hasn't had its distribution flattened, and validate every call against your schema before executing it. The observability to know which path served a request — and to catch tool-call validity drifting — is the piece teams skip and then spend a month retrofitting after a silent failure in production.

That wiring is most of the real work in an LLM feature: the fallback path, the schema validation, the routing, the traces that tell you which model answered. It's what I do — [6-week MVPs](/en/services/6-week-mvp) that ship with that path already built, or a [founding engineer](/en/services/hire-founding-engineer-india) embedded with your team. If you're weighing self-host versus API for an AI feature right now, that's a conversation worth having **before** you've committed to the wrong side of a $46,206/month decision.`,
        },
    ],
    cta: {
        text: 'Weighing self-host vs API for an AI feature? Let us run the math before you commit.',
        href: '/en/services/6-week-mvp',
    },
};

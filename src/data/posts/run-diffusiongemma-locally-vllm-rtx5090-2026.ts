import type { BlogPost } from '@/types/blog';

export const runDiffusionGemmaLocallyVllm2026: BlogPost = {
    slug: 'run-diffusiongemma-locally-vllm-rtx5090-2026',
    title: 'How to Run DiffusionGemma Locally: A vLLM Serving Guide for RTX 5090 and H100 (2026)',
    date: '2026-06-11',
    excerpt:
        'A build-focused guide to self-hosting Google\'s DiffusionGemma: the exact vLLM serve command, what each diffusion flag does, how to call it like an OpenAI endpoint, and how to tune the speed-vs-quality trade-off on an RTX 5090 or H100.',
    readingTime: '11 min read',
    keywords: [
        'run diffusiongemma locally',
        'diffusiongemma vllm',
        'serve diffusiongemma rtx 5090',
        'diffusiongemma deployment guide',
        'diffusiongemma nvfp4 quantization',
        'self-host text diffusion llm',
        'diffusiongemma h100 throughput',
    ],
    relatedProject: 'rohitrajTech',
    coverImage: {
        src: '/images/notes/run-diffusiongemma-locally-vllm-rtx5090-2026-cover.jpg',
        alt: 'Glowing GPU emitting parallel streams of light into an ordered grid illustrating running DiffusionGemma locally on RTX 5090',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `Self-hosting **DiffusionGemma** ([Google's open text-diffusion model](https://developers.googleblog.com/diffusiongemma-the-developer-guide/), released **June 10, 2026**, Apache 2.0) takes one command. The fastest production path is **vLLM**, which has **native diffusion serving on day zero**: \`vllm serve google/diffusiongemma-26B-A4B-it\`. Quantized, the **26B-A4B** model fits in **~18GB VRAM**, so a single **RTX 5090** clears **700+ tokens/sec** and an **H100** clears **1000+** ([NVIDIA](https://blogs.nvidia.com/blog/rtx-ai-garage-local-gemma-diffusion/)). The two knobs that matter are \`canvas_length\` and the entropy bound (denoising passes per block) — they trade speed for quality. For *what* it is and *when* to reach for it, read [the explainer](/en/notes/diffusiongemma-text-diffusion-llm-guide-2026) first.`,
        },
        {
            heading: 'Running DiffusionGemma locally: the build half of the story',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

[My earlier post](/en/notes/diffusiongemma-text-diffusion-llm-guide-2026) covered what DiffusionGemma is — a 26B Mixture-of-Experts that generates a 256-token block in parallel by denoising instead of writing left to right — and when the speed-for-quality trade is worth it. This post is the part a working dev actually needs once they've decided to try it: **how do you stand up a real local endpoint, and what do the diffusion-specific knobs do?**

The good news is that because Google shipped [day-zero vLLM and Transformers support](https://developers.googleblog.com/diffusiongemma-the-developer-guide/), getting a token out of this model is not the hard part. The hard part is that a diffusion model has serving parameters no autoregressive model has — a canvas length, a sampler, an entropy bound — and the defaults are tuned for a benchmark, not for your latency budget. Get those wrong and you either leave half the speed on the table or ship noticeably worse output than the model is capable of.

This is a hands-on walkthrough: hardware you need, the exact vLLM command, how to call it from Python, how to tune throughput against quality, where the other runtimes fit, and the production wiring the README quietly skips.`,
        },
        {
            heading: 'What you need before you serve it',
            content: `DiffusionGemma is published at two model IDs on Hugging Face: \`google/diffusiongemma-26B-A4B-it\` (the reference instruction-tuned build) and \`nvidia/diffusiongemma-26B-A4B-it-NVFP4\`, an [NVFP4-quantized build for RTX hardware](https://blogs.nvidia.com/blog/rtx-ai-garage-local-gemma-diffusion/). It is a **26B-parameter MoE** that activates only **3.8B params per token** (8 of 128 experts), per the [model card](https://ai.google.dev/gemma/docs/diffusiongemma/model_card), which is why a 26B model serves at the memory cost of a much smaller one.

The numbers that decide whether you can run it:

| Hardware | Tokens/sec | Fits in VRAM? |
|---|---|---|
| RTX 5090 (32GB, NVFP4) | 700+ | Yes — ~18GB quantized |
| H100 (FP8, low batch) | 1000–1100+ | Yes |
| DGX Spark | ~150 | Yes |
| DGX Station | up to 2000 | Yes |

Throughput figures are from [NVIDIA's accelerated benchmarks](https://blogs.nvidia.com/blog/rtx-ai-garage-local-gemma-diffusion/) and the [model card's](https://ai.google.dev/gemma/docs/diffusiongemma/model_card) "1100+ tokens/sec per user in low batch (H100, FP8)" figure. The headline you should anchor on is the **~18GB quantized footprint**: it means the full model lives inside a single 24GB or 32GB consumer card, so "local" here is a real RTX 5090 desktop or a high-memory Mac — not a four-GPU server. That is the whole reason to bother self-hosting a diffusion model: edge-class latency on hardware you already own.`,
        },
        {
            heading: 'The fastest path: serve it with vLLM',
            content: `vLLM is the runtime to start with because it has a **native diffusion serving path** — it understands the block-parallel denoising loop rather than faking it on top of autoregressive decoding. Google's [developer guide](https://developers.googleblog.com/diffusiongemma-the-developer-guide/) ships this serve command verbatim, and it's the one I'd run on a single 24–32GB card:

\`\`\`bash
vllm serve google/diffusiongemma-26B-A4B-it \\
  --max-model-len 262144 \\
  --max-num-seqs 4 \\
  --gpu-memory-utilization 0.85 \\
  --attention-backend TRITON_ATTN \\
  --generation-config vllm \\
  --hf-overrides '{"diffusion_sampler": "entropy_bound", "diffusion_entropy_bound": 0.1}' \\
  --diffusion-config '{"canvas_length": 256}' \\
  --enable-chunked-prefill
\`\`\`

Most of these flags are standard vLLM, but three are diffusion-specific and worth understanding before you change them:

- **\`--diffusion-config '{"canvas_length": 256}'\`** — the block size. The model denoises this many tokens *in parallel* per block. 256 matches how the model was trained; it is the single biggest lever on the speed-vs-VRAM curve.
- **\`--hf-overrides '{"diffusion_sampler": "entropy_bound", "diffusion_entropy_bound": 0.1}'\`** — how aggressively each pass commits tokens. A **lower** bound means the model demands higher confidence before finalizing a token, so it runs **more denoising passes** (better quality, slower); a **higher** bound commits sooner (faster, rougher). 0.1 is Google's default starting point.
- **\`--attention-backend TRITON_ATTN\`** — diffusion uses **bidirectional** attention (every position sees every other, not just the ones to its left), so it needs an attention backend that supports that. This is not optional plumbing — it's the mechanism behind the parallel generation.

The remaining flags are throughput hygiene: \`--max-num-seqs 4\` caps concurrent sequences (raise it for more aggregate throughput at the cost of VRAM), \`--gpu-memory-utilization 0.85\` leaves KV-cache headroom, and \`--enable-chunked-prefill\` keeps the 256K context from stalling prefill. Once it boots, vLLM exposes an OpenAI-compatible server on \`:8000\`.`,
        },
        {
            heading: 'How do you call DiffusionGemma like an OpenAI endpoint?',
            content: `Because vLLM serves an **OpenAI-compatible API**, you don't need a special client — point the standard OpenAI SDK at your local server. The only thing that changes versus calling GPT or Claude is the \`base_url\` and a throwaway key:

\`\`\`python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")

resp = client.chat.completions.create(
    model="google/diffusiongemma-26B-A4B-it",
    messages=[
        {"role": "user", "content": "Rewrite this SQL as a CTE and explain why: SELECT ..."}
    ],
    max_tokens=512,
)
print(resp.choices[0].message.content)
\`\`\`

Or a one-line smoke test with curl:

\`\`\`bash
curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model":"google/diffusiongemma-26B-A4B-it","messages":[{"role":"user","content":"Say hi in one sentence."}]}'
\`\`\`

This is the quietly important part for product work: **DiffusionGemma drops into any codebase that already speaks the OpenAI API.** If you've built an [AI feature for an MVP](/en/services/6-week-mvp) against \`chat.completions\`, swapping the \`base_url\` to your vLLM box is a config change, not a rewrite. The one behavioral difference to watch — covered in the production section below — is how streaming feels, because a diffusion model commits a *block* at a time, not a token at a time.`,
        },
        {
            heading: 'Tuning throughput against quality',
            content: `The whole reason to run DiffusionGemma instead of Gemma 4 is speed, so it's worth knowing which dials actually move it. There are three, in order of impact:

1. **The entropy bound (\`diffusion_entropy_bound\`).** This is your direct speed-vs-quality slider. Raising it from 0.1 toward, say, 0.2 commits tokens in fewer passes — faster, but you'll see more of the "below Gemma 4" quality gap. Lowering it spends more passes per block for cleaner output. Tune this against *your* eval set, not the benchmark.
2. **Batch size (\`--max-num-seqs\`).** The 1100 tok/s figure is *per user at low batch*; aggregate throughput climbs as you batch more concurrent requests, until you run out of VRAM. If you're serving an interactive product, keep this low for latency; if you're running an offline batch job, push it up.
3. **Quantization.** The **NVFP4** build (\`nvidia/diffusiongemma-26B-A4B-it-NVFP4\`) is what gets you the ~18GB footprint and the RTX 5090 numbers; **FP8** is the format behind the H100 figure. NVFP4 is the right default on consumer RTX cards — it's the difference between fitting on one card and not running at all.

A practical starting recipe: keep Google's defaults (canvas 256, entropy 0.1, NVFP4) for your first deploy, measure real latency and output quality on ten representative prompts, then nudge the entropy bound — it's the cheapest, highest-leverage change. Don't touch \`canvas_length\`: it's tied to how the model was trained, and moving it off 256 is the fastest way to get worse output for no clear win.`,
        },
        {
            heading: 'Which runtime should you use?',
            content: `vLLM is the production answer, but it isn't the only day-zero runtime. Here's how the supported options compare, per [Google's launch guide](https://developers.googleblog.com/diffusiongemma-the-developer-guide/) and [NVIDIA](https://blogs.nvidia.com/blog/rtx-ai-garage-local-gemma-diffusion/):

| Runtime | Status | Best for | Notes |
|---|---|---|---|
| **vLLM** | Day-zero, native diffusion | Production GPU serving + batching | OpenAI-compatible API; the serve command above |
| **HF Transformers** | Day-zero | Quick local test, scripting | Runs on an RTX 5090 or DGX Spark out of the box |
| **MLX** | Day-zero | Apple silicon | On-device on a Mac with enough unified memory |
| **Unsloth / NeMo** | Day-zero | Fine-tuning, not serving | Use for the Sudoku-style domain fine-tunes |
| **llama.cpp** | "Coming soon" | GGUF / Ollama-style local | Not GA yet for GeForce RTX |

The decision is simple. **Prototyping or scripting?** Use Transformers — it's the lowest-friction "does this model do what I want" check. **Shipping an endpoint other code calls?** Use vLLM for the OpenAI-compatible API and real batching. **On a Mac?** MLX is your native path. And if you're waiting for the llama.cpp/Ollama route to drop a one-line \`ollama run\` experience — it's flagged "coming soon" for RTX, so don't architect around it yet.`,
        },
        {
            heading: 'When should you NOT self-host this?',
            content: `Honesty is the whole point of a build guide, so: there are real cases where standing up your own DiffusionGemma box is the wrong call.

**When you need top-tier quality.** Google is upfront that DiffusionGemma trades accuracy for speed, and the [model card](https://ai.google.dev/gemma/docs/diffusiongemma/model_card) puts numbers on it versus standard Gemma 4 26B-A4B: **MMLU-Pro 77.6% vs 82.6%**, **GPQA Diamond 73.2% vs 82.3%**, **LiveCodeBench v6 69.1% vs 77.1%**, and a steep **AIME 2026 69.1% vs 88.3%**. If your workload is hard reasoning or precise code, an autoregressive model — Gemma 4 itself, or a hosted frontier model — will beat it. The [explainer](/en/notes/diffusiongemma-text-diffusion-llm-guide-2026) walks through that trade in depth.

**When you don't have the GPU.** ~18GB quantized still means an RTX 5090, a 4090-class card, or a high-memory Mac. If you're on a laptop with 8GB, a hosted API is cheaper than buying hardware to chase a latency win you may not need.

**When latency isn't your bottleneck.** The entire value proposition is throughput. If your product makes one LLM call per user action and 1.5 seconds is fine, you're adding operational surface area — a GPU box to babysit — for a speedup nobody will feel. Self-host DiffusionGemma when fast, interactive, or high-volume generation *is* the product, not as a reflex.`,
        },
        {
            heading: 'How I would wire this into production',
            content: `Here's the integration reality that isn't in the README, from having shipped LLM endpoints into real products.

**Put auth in front of it — the server has none.** Notice the \`api_key="EMPTY"\` in the client above? That's not a placeholder you'll replace; vLLM's OpenAI server ships with **no authentication** and, by default, binds where anything on the network can reach it. Never expose port 8000 directly. Stand a small reverse proxy (or your existing API gateway) in front, terminate auth there, and keep the vLLM box on a private network. This is the single most common way a self-hosted inference server leaks.

**Handle bursty streaming.** A diffusion model commits a **256-token block** at a time, so "streaming" does not arrive as a smooth token-by-token trickle the way an autoregressive model does — it arrives in chunks as blocks finalize. If your UI animates a typewriter effect, it'll feel jumpy. Buffer on the client and reveal at a steady rate, or lean into the speed and just render each block as it lands.

**Keep a quality fallback.** Given the benchmark gap, I'd route low-stakes, latency-sensitive calls (autocomplete, summaries, chat) to DiffusionGemma and **fall back to Gemma 4 or a hosted model** for anything where a wrong answer is expensive — and log the entropy bound and pass count per request so you can see *why* an output came out rough. A two-tier router gets you DiffusionGemma's speed on 80% of traffic without taking the quality hit on the 20% that matters.

That fallback-router-plus-auth-proxy pattern is exactly the kind of plumbing that turns a model download into a production feature — and exactly where most "we added AI" projects stall. If you want this wired correctly the first time, that's the work I do.`,
        },
        {
            heading: 'Ship it without the five bugs the quickstart skips',
            content: `DiffusionGemma is the rare open release that is genuinely easy to *start* and genuinely subtle to *run well*: the serve command is one line, but the entropy bound, the NVFP4 footprint, the no-auth server, and the block-streaming behavior are all decisions that don't surface until you're in production.

If you're adding a fast local model to an MVP and want it integrated — auth proxy, quality-fallback router, observability, the lot — without rediscovering each gotcha the hard way, I [ship AI features in 6 weeks](/en/services/6-week-mvp). And if you need someone in the codebase long-term to own the inference stack, you can [hire me as a founding engineer](/en/services/hire-founding-engineer-india).`,
        },
    ],
    cta: {
        text: 'Ship Your Local-AI Feature in 6 Weeks',
        href: '/en/services/6-week-mvp',
    },
};

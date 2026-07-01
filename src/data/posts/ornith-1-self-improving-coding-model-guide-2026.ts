import type { BlogPost } from '@/types/blog';

export const ornith1SelfImprovingCodingModelGuide2026: BlogPost = {
    slug: 'ornith-1-self-improving-coding-model-guide-2026',
    title: 'Ornith-1.0: The Self-Improving Open-Source Coding Model, Tested (2026)',
    date: '2026-07-01',
    excerpt:
        'DeepReinforce shipped Ornith-1.0 on June 25, 2026 — an MIT-licensed family of coding models that learn to write their own agentic scaffold during RL instead of using a human-designed harness. The 397B flagship hits 82.4 on SWE-bench Verified (DeepReinforce reports it edges past Claude Opus 4.7); the 9B runs on a single 24GB card. This is the builder\'s read: what self-scaffolding actually is, real vLLM and Ollama run commands, an honest comparison table, when to skip it, and the chat-template gotcha that will send your local copy into a runaway loop.',
    readingTime: '10 min read',
    keywords: [
        'ornith-1.0',
        'ornith coding model',
        'self-improving coding model',
        'open source agentic coding model',
        'self-scaffolding llm',
        'run ornith-1.0 locally',
        'ornith vs claude opus',
        'open source coding model 2026',
    ],
    relatedProject: 'myFinancial',
    coverImage: {
        src: '/images/notes/ornith-1-self-improving-coding-model-guide-2026-cover.jpg',
        alt: 'Luminous 3D lattice scaffold assembling itself from glowing particles illustrating the Ornith-1.0 self-improving open-source coding model in 2026',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**Ornith-1.0** is a family of MIT-licensed open-source coding models from [DeepReinforce](https://deep-reinforce.com/ornith_1_0.html), released **June 25, 2026**, that learn to write their own agentic **scaffold** during RL instead of using a human-designed harness. The flagship **397B MoE** scores **82.4 on SWE-bench Verified** — which DeepReinforce reports edges past **Claude Opus 4.7** — while the **9B dense** model hits **69.4** and runs on one 24GB GPU via [Ollama](/en/notes/best-local-llm-for-coding-replace-cloud-2026) or vLLM. Skip it if you need Opus-class reasoning on your hardest tasks, or can't host a 397B MoE: self-scaffolding is a training-time win, not an inference toggle.`,
        },
        {
            heading: 'Ornith-1.0: The Self-Improving Open-Source Coding Model, Tested (2026)',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On **June 25, 2026**, a team called [DeepReinforce](https://deep-reinforce.com/ornith_1_0.html) dropped **Ornith-1.0** — a family of open-source coding models spanning **9B Dense, 31B Dense, 35B MoE, and 397B MoE**, all under a plain **MIT license**, all post-trained on top of Gemma 4 and Qwen 3.5. It hit [#1 on r/LocalLLaMA](https://news.ycombinator.com/item?id=48722052) and trended across Hugging Face within days.

The interesting part isn't another benchmark line. Every week an open-weights model claims to beat a closed one; last week it was [GLM-5.2 vs Claude Opus](/en/notes/glm-5-2-vs-claude-opus-coding-agent-2026). What's genuinely new in Ornith is *how* it was trained: the model learned to generate not just the code, but the **agentic harness that drives the code** — the scaffold that plans, calls tools, and iterates. DeepReinforce calls it **self-scaffolding**, and it's the first release I've seen where the "self-improving" label points at a concrete mechanism rather than marketing.

So this is the builder's read, not a press summary. What self-scaffolding actually means, the real numbers by model size, how to run the 9B locally (with the chat-template trap that cost me an afternoon), an honest comparison against the other open models, and when you should quietly skip it.`,
        },
        {
            heading: 'What is Ornith-1.0, and what is actually new?',
            content: `Ornith-1.0 is a set of coding-specialized LLMs with a **262,144-token (256K) context window**, released with FP8, GGUF, and bf16 weights on [Hugging Face](https://huggingface.co/deepreinforce-ai/Ornith-1.0-9B). The four sizes cover the usual spread — a **9B dense** you can run on one consumer GPU, mid-size **31B dense** and **35B MoE** options, and a **397B MoE** flagship for serving infrastructure.

The concrete benchmark story, straight from the [release page](https://deep-reinforce.com/ornith_1_0.html):

- **Ornith-1.0-397B:** 77.5 on Terminal-Bench 2.1, **82.4 on SWE-bench Verified**, 62.2 on SWE-bench Pro — versus the Qwen 3.5-397B baseline it was trained from at 53.5 / 76.4 / 51.6. That's a **+24-point Terminal-Bench jump** from the same base weights.
- **Ornith-1.0-35B:** 64.2 on Terminal-Bench 2.1, 75.6 on SWE-bench Verified.
- **Ornith-1.0-9B:** 43.1 on Terminal-Bench 2.1 (Terminus-2 harness), 69.4 on SWE-bench Verified, 42.9 on SWE-bench Pro.

Two things matter for a builder. First, the license is **MIT** — not a source-available or "open-weight with restrictions" license, but the permissive one, so you can ship it inside a commercial product without a lawyer meeting. Second, the delta over the base model is large and comes *entirely from the training method*, which is the actual headline.`,
        },
        {
            heading: 'How does self-scaffolding actually work?',
            content: `Normal agentic RL works like this: humans design a fixed **harness** — the loop that decides when the model plans, when it calls a tool, when it retries — and then reinforcement learning optimizes the model's outputs *inside* that fixed loop. The scaffold is hand-built and frozen; only the solution is learned.

Ornith flips that. Per DeepReinforce, "rather than depending on human-designed harnesses to steer solution generation, the model learns to produce both the solution rollouts **and** the task-specific scaffolds that guide them." In other words, for each coding task the model writes its own orchestration framework, then solves the task inside it, and RL optimizes **both** jointly. Because the scaffold is no longer a fixed human guess, the model can discover search trajectories a static harness would never explore — which is why the same 397B base weights gain 24 Terminal-Bench points after post-training.

There's a real risk here, and [testingcatalog flagged it](https://www.testingcatalog.com/deepreinforce-releases-ornith-1-0-open-source-coding-models/): letting a model write its own reward-bearing scaffold "opens a path to reward hacking" — the model could learn a scaffold that games the benchmark rather than genuinely solving tasks. The benchmark numbers suggest DeepReinforce contained it, but it's exactly the kind of thing to watch when a self-improving loop is involved. If you've read my take on [small reasoning models like VibeThinker-3B](/en/notes/vibethinker-3b-tiny-reasoning-model-guide-2026), this is the same lesson from the other direction: the training recipe, not the parameter count, is where the gains actually live.`,
        },
        {
            heading: 'Can you run Ornith-1.0 locally? (hands-on)',
            content: `Yes — and the 9B is the one you'll actually use. It fits on a single 24GB card, and DeepReinforce ships GGUF weights for it. The production path is vLLM, and the serve command from the [9B model card](https://huggingface.co/deepreinforce-ai/Ornith-1.0-9B) looks like this:

\`\`\`bash
vllm serve deepreinforce-ai/Ornith-1.0-9B \\
    --served-model-name Ornith-1.0-9B \\
    --host 0.0.0.0 --port 8000 \\
    --max-model-len 262144 \\
    --gpu-memory-utilization 0.90 \\
    --enable-prefix-caching \\
    --enable-auto-tool-choice --tool-call-parser qwen3_xml \\
    --reasoning-parser qwen3 \\
    --trust-remote-code
\`\`\`

Note the two parsers. Ornith emits reasoning inside \`<think>…</think>\` blocks and tool calls in Qwen3's XML dialect, so \`--reasoning-parser qwen3\` and \`--tool-call-parser qwen3_xml\` aren't optional decorations — without them your client gets chain-of-thought leaking into the final answer and tool calls it can't parse. Recommended sampling is **temperature 0.6, top_p 0.95, top_k 20**.

**The trap the README doesn't warn about.** I pulled the 9B into [Ollama](/en/notes/best-local-llm-for-coding-replace-cloud-2026) to try it as \`ornith:9b\`, and the first run went into a **runaway loop** — it never stopped generating. The cause: the upstream GGUF shipped with a bare passthrough Ollama template (\`{{ .Prompt }}\`) and no stop tokens. With no chat structure and nothing to terminate on, the \`<think>\` block never closes and the model just keeps going. The fix is to author a Modelfile with the **Qwen3 chat template plus proper stop tokens** (\`<|im_end|>\` and friends) rather than trusting the default. Ten minutes once you know; a baffling afternoon if you don't. This is the exact failure mode of running a Qwen3-templated model through a generic loader — the weights are fine, the packaging isn't.`,
        },
        {
            heading: 'Where Ornith-1.0 actually shines',
            content: `Generic "great for coding" claims are useless for picking a model. Here are the concrete places Ornith earns its slot:

- **A private, self-hosted coding agent over your own repo.** MIT license + local weights means no code leaves your infrastructure — which is the whole reason regulated teams can't just point Cursor at their monorepo. Ornith is tuned for the *agentic* loop (plan → edit → run → fix), not just autocomplete, and its [Terminal-Bench numbers](https://deep-reinforce.com/ornith_1_0.html) are about running real shell tasks, not toy snippets.
- **The 9B as the cheap worker in a two-model setup.** In any real agent pipeline most calls are cheap and high-volume — classify this diff, summarize this file, draft this test. Run those on the local **9B (69.4 SWE-bench Verified)** at zero marginal cost, and reserve a frontier model or the 397B for the hard synthesis step. Same routing pattern I described for [self-hosted research agents](/en/notes/best-open-source-deep-research-agent-self-host-2026); it applies cleanly to coding.
- **Autonomous fix-and-verify jobs.** The self-scaffolding design targets exactly the SWE-bench shape — "here's a failing repo, make the tests pass." If your workload is batch bug-fixing or dependency migrations across many repos, a model built to write its own task harness is a better fit than a chat-first model bolted into a hand-rolled loop.`,
        },
        {
            heading: 'Ornith-1.0 vs GLM-5.2, DeepSeek-V4-Pro, and Claude Opus',
            content: `Where Ornith sits against the other open-weights coding models people are actually shipping in mid-2026. All figures are **SWE-bench Verified** for an apples-to-apples column; cells I can't source cleanly are left blank rather than guessed.

| Model | Params | SWE-bench Verified | License | Run locally? | Note |
|-------|--------|--------------------|---------|--------------|------|
| **Ornith-1.0-397B** | 397B MoE | **82.4** | MIT | Yes — multi-GPU | Self-scaffolding; 77.5 on Terminal-Bench 2.1 |
| **Ornith-1.0-9B** | 9B dense | 69.4 | MIT | Yes — single 24GB card | The one you'll actually self-host |
| **DeepSeek-V4-Pro** | Large MoE | 80.6 | Open weights | Yes — heavy | Strong all-rounder; non-MIT terms |
| **Qwen 3.5-397B** *(Ornith's base)* | 397B MoE | 76.4 | Open weights | Yes — heavy | The baseline Ornith post-trained from |
| **Claude Opus 4.7** | Undisclosed | — | Proprietary | No | DeepReinforce reports 397B surpasses it on SWE-V |

*Sources: [Ornith release page](https://deep-reinforce.com/ornith_1_0.html) and [9B model card](https://huggingface.co/deepreinforce-ai/Ornith-1.0-9B); DeepSeek-V4-Pro from public SWE-bench reporting.*

The honest read: at the **flagship tier**, Ornith-397B and DeepSeek-V4-Pro are within two points of each other and both are essentially at the frontier — your choice comes down to license (Ornith's MIT is friendlier) and which one your serving stack already supports. At the **self-hostable tier**, the 9B's 69.4 is genuinely useful for agent-worker duty but is *not* Opus-class, and you shouldn't pretend it is. If you want a mid-tier open model with a 1M-token context instead, [GLM-5.2](/en/notes/glm-5-2-vs-claude-opus-coding-agent-2026) is the one to compare against.`,
        },
        {
            heading: 'When should you skip Ornith-1.0 (or wait)?',
            content: `The counter-position, because "new open model beats Claude" is the most over-clicked headline in AI and it hides real caveats:

- **You need the flagship but can't host a 397B MoE.** The 82.4 number is the 397B, which is serious serving infrastructure — multiple high-memory GPUs, not a workstation. If you can't run it, you're really evaluating the **9B/35B**, and those trade blows with other open models rather than dominating. Match the number you're excited about to the model you can actually deploy.
- **Your hardest tasks need frontier reasoning.** A **[69.4 on SWE-bench Verified](https://huggingface.co/deepreinforce-ai/Ornith-1.0-9B)** is strong for a 9B, but it means roughly three in ten verified tasks still fail. For production-critical or gnarly-legacy work, a frontier API is still the safer default; use the 9B for the volume tier, not the last mile.
- **You want a feature you can toggle.** Self-scaffolding is baked in at *training* time. You get its benefits by using the model — there's no inference-time switch, no "scaffold mode." If you were hoping to bolt self-scaffolding onto your existing model, that's not what this release gives you.
- **You can't own the deployment quirks.** As the runaway-loop story shows, this model expects the Qwen3 template, the right stop tokens, and the vLLM tool/reasoning parsers. Drop it into a generic loader and it misbehaves in ways that look like the model is broken when it's really the packaging. If nobody on the team will own that, a hosted model is the rational call.`,
        },
        {
            heading: 'How I would ship Ornith-1.0 in production',
            content: `Here's the wiring that isn't in the model card — the difference between a model that benchmarks well and one that survives a real workload.

**Pin the serving config; don't let it drift.** The [vLLM flags above](https://huggingface.co/deepreinforce-ai/Ornith-1.0-9B) aren't a starting point to tune away — \`--tool-call-parser qwen3_xml\`, \`--reasoning-parser qwen3\`, and \`--max-model-len 262144\` are load-bearing. Bake them into your deploy manifest and treat a config change as a code change, because a "harmless" flag drop is what turns clean tool calls into unparseable garbage at 2am.

**Route by step, and make the 9B earn its keep.** A coding agent is many calls: plan, edit, run, summarize, synthesize. Send the cheap high-volume ones to the local 9B and reserve the 397B (or a frontier API) for the final hard step. Most cost overruns I see come from paying frontier prices for a "rename this variable" call the 9B handles for free.

**Watch the \`<think>\` budget.** Reasoning models can burn thousands of tokens thinking before they answer. On a self-hosted box that's latency and GPU time, not a line item you'll notice until throughput tanks. Log reasoning-token counts per request and cap them — a runaway think block is the same failure as the Ollama loop, just quieter.

**The failure mode I'd worry about** is a silent template regression: someone updates the GGUF or the Modelfile, the stop tokens fall out, and suddenly every response is a rambling loop again. Add a smoke test that asserts responses terminate and tool calls parse, and run it on every model bump. Most of my client builds ship this kind of AI feature inside a [6-week MVP window](/en/services/6-week-mvp), and a "does the model actually stop talking" check is always in the harness — because a coding agent that never returns is worse than no agent at all. If you want a second pair of hands wiring a self-hosted model into a product without learning these traps the hard way, [that's the kind of build I do](/en/services/hire-founding-engineer-india).`,
        },
    ],
    cta: {
        text: 'Want a self-hosted coding model wired into your product in 6 weeks?',
        href: '/en/services/6-week-mvp',
    },
};

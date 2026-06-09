import type { BlogPost } from '@/types/blog';

export const aiDevWeek2026W24: BlogPost = {
  slug: 'ai-dev-week-2026-24',
  title:
    'This Week in AI Dev: Codex Builds Apps, the Open-Weight Frontier Explodes, and Anthropic Meters the Agent SDK (Week 24 of 2026)',
  date: '2026-06-09',
  excerpt:
    "Week 24 of 2026 in AI dev tools: OpenAI's Codex graduates from coding agent to app builder with Sites and role plugins, three open-weight models drop in 72 hours (MiniMax M3, Gemma 4 12B, NVIDIA Nemotron 3 Ultra), Anthropic moves the Agent SDK to metered billing on June 15, Microsoft Build hardens agent security, and the Gemini CLI consumer sunset hits June 18.",
  readingTime: '6 min read',
  keywords: [
    'ai dev tools this week',
    'openai codex sites',
    'minimax m3 open weight model',
    'gemma 4 12b',
    'anthropic agent sdk billing june 2026',
    'gemini cli sunset 2026',
    'ai coding agents 2026',
  ],
  relatedProject: 'myFinancial',
  coverImage: {
    src: '/images/notes/ai-dev-week-2026-24-cover.jpg',
    alt: 'Constellation of glowing connected nodes illustrating AI dev tools weekly roundup week 24 of 2026',
  },
  sections: [
    {
      heading: 'TL;DR',
      content: `Week 24 of 2026's most useful drops: **OpenAI Codex** added **Sites** (agent-built, hosted web apps) and **6 role plugins** on June 2, crossing **5M weekly active users**; **MiniMax M3** shipped open weights June 1 — the first open model with frontier coding, a **1M-token context**, and native image/video, at **59% on SWE-Bench Pro**; **Gemma 4 12B** (June 3) runs multimodal on a **16 GB laptop**; **Anthropic** moves the **Agent SDK to metered billing on June 15**; and **Gemini CLI** consumer access ends **June 18**. The thread: agents became shippable products the same week the meter and the deadline arrived.`,
    },
    {
      heading: 'Why This Week Matters Together',
      content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

For two years "AI coding tool" meant something that helped you type faster. Week 24 is where that definition broke. OpenAI's Codex stopped being an autocomplete-on-steroids and became a thing that **ships a running app** — Sites hosts it, Annotations edits it in place, and six role plugins point it at non-engineering work. The engine to run that kind of agent cheaply also landed the same 72 hours: **three open-weight models** (MiniMax M3, Gemma 4 12B, NVIDIA Nemotron 3 Ultra) that you can self-host instead of renting.

The other half of the week is the bill, the guardrail, and the deadline arriving to keep all of it honest. **Anthropic** is splitting the Agent SDK onto a separate metered credit on **June 15**, **Microsoft Build** spent its keynote on making agents secure by default, and **Google's Gemini CLI** consumer sunset hits **June 18**. So the read for builders is blunt: capability jumped a level *and* the accountability layer showed up in the same week. Below — each drop, its primary source, and one opinionated take.`,
    },
    {
      heading: 'Week 24 at a Glance',
      content: `| Drop | What changed | When | Verdict |
|------|--------------|------|---------|
| **OpenAI Codex Sites** | Agent now builds + hosts apps, 6 role plugins | Jun 2 | Prototype with it, don't host prod |
| **MiniMax M3** | Open weights: 1M context + multimodal + coding | Jun 1 | Self-host the routine 80% |
| **Gemma 4 12B** | Multimodal open model on a 16 GB laptop | Jun 3 | Best local default this week |
| **Anthropic Agent SDK** | Moves to separate metered credit | Jun 15 | Re-forecast before the 15th |
| **MS Build 2026** | Secure-agents-by-default tooling | Jun 2 | Adopt the identity + audit defaults |
| **Gemini CLI** | Consumer access ends | Jun 18 | Migrate this week or lose it |`,
    },
    {
      heading: 'OpenAI Codex Becomes an App Builder (June 2)',
      content: `**What:** At its **June 2 "Intelligence at Work"** event, OpenAI turned Codex from a coding agent into a product surface. It added **Sites** — rapid, semi-private web hosting so an agent can ship a running app from a prompt — plus **Annotations** (in-place editing of generated output) and **six role plugins** targeting data analytics, creative production, sales, product design, equity investing, and investment banking. OpenAI says Codex now has **more than 5 million weekly active users**, up **6× since the February desktop launch**, with non-developers making up roughly **20%** and adopting **3× faster** than engineers.

**Why it matters:** "Generate the code" and "stand up the app" used to be two jobs. Sites collapses them, which makes Codex a genuine prototyping path for internal tools — and a real competitor to the Lovable/Bolt "prompt-to-app" lane, not just to Copilot.

**Source:** [OpenAI Codex changelog](https://developers.openai.com/codex/changelog) · [TechCrunch coverage](https://techcrunch.com/2026/06/02/openai-launches-new-codex-tools-for-white-collar-work/)

**Quick take:** Brilliant for throwaway internal dashboards and demos. Do not host customer-facing production on Sites yet — semi-private web hosting from an agent has no story for auth hardening, RLS, or the SOC-2 questions your first enterprise buyer will ask.`,
    },
    {
      heading: 'MiniMax M3 Ships the Most Capable Open Weights Yet (June 1)',
      content: `**What:** Shanghai's **MiniMax** released **M3** on **June 1** — the first open-weight model to combine three frontier capabilities in one architecture: **frontier-level coding**, a **1-million-token context window**, and **native image + video input**. It scores **59% on SWE-Bench Pro**, ahead of GPT-5.5 and Gemini 3.1 Pro and just behind Claude Opus 4.7. The trick is a new **MSA attention** mechanism that cuts per-token compute at 1M context to **one-twentieth** of the prior generation, with **>9× faster prefill** and **>15× faster decode**. Weights target Hugging Face + GitHub within **10 days** of launch.

**Why it matters:** A 1M-context multimodal coder you can run on your own cluster changes the routing math. The expensive frontier call you were paying GPT-5.5 or Opus for — multi-file refactors over a huge context — now has a self-hostable alternative that scores in the high 50s on a hard agentic benchmark.

**Source:** [The Decoder — MiniMax M3](https://the-decoder.com/minimax-m3-open-weight-model-with-a-million-token-context-challenges-proprietary-leaders/)

**Quick take:** Don't lift-and-shift everything — put M3 behind a router for the routine 80% and keep a closed model for the calls that earn the premium. That split is exactly what I cover in [OpenRouter vs LiteLLM vs Portkey](/en/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026).`,
    },
    {
      heading: 'Gemma 4 12B Puts a Multimodal Model on Your Laptop (June 3)',
      content: `**What:** Google DeepMind added a **12-billion-parameter Gemma 4** on **June 3** — a multimodal model that takes **text, images, and audio** as input, runs on a **laptop with 16 GB of memory**, and ships under **Apache 2.0**. It clearly beats the older **Gemma 3 27B** (more than twice its size) on GPQA Diamond, MMLU Pro, and DocVQA, and nearly matches the 2× larger Gemma 4 26B. It wasn't alone: **NVIDIA's Nemotron 3 Ultra** (June 1, Computex) hit **48 on the Artificial Analysis Intelligence Index** — the highest score yet for any US lab's open model.

**Why it matters:** 16 GB is the floor of a normal dev laptop. A genuinely capable multimodal model that fits there — under a permissive license you can fine-tune and ship inside a product — is the best local default for prototyping offline, building on-device features, or keeping sensitive data off a vendor's API.

**Source:** [Google — Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) · [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4)

**Quick take:** This is my new "start here" local model. The license matters as much as the benchmark — Apache 2.0 is what you want for anything you'll ship commercially, which is why it beats a higher-scoring model under a restrictive license for product work.`,
    },
    {
      heading: 'Anthropic Moves the Agent SDK to Metered Billing on June 15',
      content: `**What:** Anthropic is splitting agent usage off the flat subscription. From **June 15, 2026**, the **Claude Agent SDK**, **\`claude -p\`** (headless), **Claude Code GitHub Actions**, and **third-party agents** move off your Claude subscription limit onto a **separate monthly credit** — **$20 (Pro)**, **$100 (Max 5×)**, **$200 (Max 20×)** — metered at **full API rates** with **no rollover**. Interactive Claude Code in the terminal stays on your plan. The same release shipped a **security-guidance plugin**: a fast pattern check on each edit, a model review at the end of each turn, and a deeper agentic review on commit or push.

**Why it matters:** If you run unattended agents — CI bots, nightly \`claude -p\` jobs, GitHub Action reviewers — your "Claude is included in my plan" assumption expires June 15. A heavy automation setup can burn the $20 Pro credit in days at API rates.

**Source:** [Claude Code — What's new](https://code.claude.com/docs/en/whats-new)

**Quick take:** Audit your headless usage *this week*. This is the same "metered, not flat" shift that hit Copilot in Week 23 — see [Claude Opus 4.8 vs 4.7](/en/notes/claude-opus-4-8-vs-4-7-developers-2026) for where the premium model actually earns its per-token cost.`,
    },
    {
      heading: 'Microsoft Build 2026: Secure Agents by Default (June 2)',
      content: `**What:** At **Build 2026** (keynote June 2), Microsoft put agent security at the center of the developer story — new capabilities to build **secure, enterprise-ready agents by default** across the lifecycle: agent identity, scoped permissions, and audit logging baked into the platform rather than bolted on, plus guardrails for the code, agents, and models a team ships.

**Why it matters:** This is the institutional answer to the indirect-prompt-injection and tool-exfiltration class of bugs that hit the headlines earlier this year. "Secure by default" means the identity and audit primitives an enterprise reviewer asks for stop being a custom build — which lowers the bar to shipping an agent into a regulated org.

**Source:** [Microsoft Security — Build 2026: securing code, agents, and models](https://www.microsoft.com/en-us/security/blog/2026/06/02/microsoft-build-2026-securing-code-agents-and-models-across-the-development-lifecycle/)

**Quick take:** Even if you're not on Azure, steal the defaults: every agent gets its own identity, least-privilege tool scopes, and an audit trail you can replay. The same hygiene shows up in my [secure MCP server in TypeScript](/en/notes/secure-mcp-server-typescript-2026) walkthrough — the protocol changes, the threat model doesn't.`,
    },
    {
      heading: 'Last Call: Gemini CLI Consumer Access Ends June 18',
      content: `**What:** Consumer access to the **Gemini CLI** and the **Gemini Code Assist IDE extensions** ends **June 18, 2026** for **AI Pro, AI Ultra, and free-tier** users — the final step of Google folding Gemini CLI into **Antigravity** and pushing the standalone tool toward enterprise. After the 18th, the free/individual on-ramp you may have scripted against is gone.

**Why it matters:** If you wired Gemini CLI into a personal workflow, a side project, or CI on a consumer plan, that breaks in nine days. This is a hard deprecation date, not a soft nudge — exactly the kind of cutover that silently fails a pipeline at 2 a.m.

**Source:** [Google Developers Blog — transitioning Gemini CLI to Antigravity](https://developers.googleblog.com/)

**Quick take:** Don't wait for the error. I mapped the migration paths and the open alternatives (Claude Code, Codex CLI, Aider, OpenCode) in [Gemini CLI to Antigravity: migration and alternatives](/en/notes/gemini-cli-to-antigravity-migration-alternatives-2026) — pick a destination before the 18th, not after.`,
    },
    {
      heading: "What I'm Shipping With This Week",
      content: `Concretely: I'm putting **MiniMax M3 behind the router** on a [MyFinancial](/en/projects) workload that summarizes long regulatory PDFs. Those calls used to hit a closed frontier model and the context kept blowing past comfortable limits; M3's **1M-token window** means I can feed a whole filing in one shot, and the **MSA** decode speed makes the cost sane to self-host for a batch job that runs nightly. The routine summaries move to M3; only the calls that need the absolute best reasoning stay on the premium model.

The non-obvious part the launch posts won't tell you: **the open-weight win and the Anthropic billing change are the same decision.** The reason to bother self-hosting M3 isn't ideology — it's that on **June 15** my unattended \`claude -p\` jobs start metering at full API rates. So the migration I'd actually prioritize this week is moving the *highest-volume, lowest-stakes* automation off metered API calls and onto a self-hosted open model, and keeping the metered budget for the work that's worth it. The failure mode I'd worry about: discovering on June 16 that a nightly agent quietly burned the month's credit because nobody re-forecast it. Audit the headless jobs first; migrate second.`,
    },
    {
      heading: 'Skip These',
      content: `**The "LlamaIndex founder says the framework era is ending" think-pieces.** It's a real, interesting shift — agent SDKs and MCP are eating classic RAG frameworks — but it's commentary on a trend you already feel, not a release you can act on this week.

**OutSystems' "AI-native agentic" low-code platform.** Big enterprise launch, lots of press, near-zero relevance if you write code for a living — it's a different audience and a different buying motion.

**The Codex "20% of users are non-developers" framing.** It's a great growth stat for OpenAI's deck, but it tells you nothing about whether Codex Sites belongs in *your* stack. Judge the Sites feature on the prototyping job, not the user-mix headline.`,
    },
    {
      heading: "Need Help Wiring This Week's Drops Into Your Product?",
      content: `If you're standing up an open-weight router to dodge the June 15 metering, self-hosting MiniMax M3 or Gemma 4 for the routine 80%, or migrating off Gemini CLI before the 18th, the hard part is never the tutorial — it's the production wiring: fallback routing, rate-limit retries, agent identity and audit, and the integration tests nobody writes.

That's the [6-week MVP](/en/services/6-week-mvp) playbook — pick the right models and host, wire them into a shipping product, hand over a tested codebase. For a longer run, [Hire a Founding Engineer (India)](/en/services/hire-founding-engineer-india).

Next roundup drops next Tuesday. For the deep-dives: [Claude Opus 4.8 vs 4.7](/en/notes/claude-opus-4-8-vs-4-7-developers-2026) on model choice, [OpenRouter vs LiteLLM vs Portkey](/en/notes/openrouter-vs-litellm-vs-portkey-india-mvp-2026) on routing, and [LLM context compression](/en/notes/llm-context-compression-cut-token-costs-2026) on cutting token spend.`,
    },
  ],
  cta: {
    text: "Wire This Week's Drops Into Your MVP — 6-Week Plan",
    href: '/en/services/6-week-mvp',
  },
};

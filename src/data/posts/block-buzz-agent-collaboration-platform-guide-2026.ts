import type { BlogPost } from '@/types/blog';

export const blockBuzzAgentCollaborationPlatformGuide2026: BlogPost = {
    slug: 'block-buzz-agent-collaboration-platform-guide-2026',
    title: "Block's Buzz (2026 Guide): Self-Host the Workspace Where AI Agents Are Teammates, Not Bots",
    date: '2026-07-24',
    excerpt:
        "Block released Buzz on July 21, 2026 — an Apache-2.0, self-hostable workspace built on Nostr where AI agents join channels as cryptographically-signed members, not permission-restricted bots. It hit 7,600+ GitHub stars in three days. The launch coverage tells you what it is; this guide shows you how to actually run it: the exact install path, how to onboard a Claude Code or Codex agent with its own keypair, where Buzz genuinely beats Slack-plus-bots, the compliance gaps that should keep it out of production today, and the hardening checklist the same week's OpenAI–Hugging Face incident makes non-negotiable.",
    readingTime: '12 min read',
    keywords: [
        'block buzz',
        'buzz agent collaboration platform',
        'buzz self-hosted setup',
        'ai agents as teammates',
        'nostr agent identity',
        'buzz vs slack ai agents',
        'multi-agent workspace 2026',
        'block buzz claude code',
    ],
    coverImage: {
        src: '/images/notes/block-buzz-agent-collaboration-platform-guide-2026-cover.jpg',
        alt: 'GitHub social card for block/buzz illustrating the Buzz agent collaboration platform repository',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**Buzz** is Block's Apache-2.0, self-hostable workspace where humans and AI agents collaborate as equal members — released **July 21, 2026**, already past **7,600 GitHub stars**. It is built as a **Nostr relay**: every message, code patch, CI step, and approval is a cryptographically signed event in one searchable audit log, and agents get their own keypairs — you "add an agent to a channel the same way you add a person." It already speaks to **Claude Code, Codex, and Goose** via its ACP harness. Try it today as an isolated agent lab (\`just setup && just build\`, relay on \`ws://localhost:3000\`); skip it as a production Slack replacement until fine-grained tool authorization and the compliance story mature.`,
        },
        {
            heading: 'Block shipped Buzz — why does a "Slack for agents" matter now?',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

On **July 21, 2026**, Block (Jack Dorsey's company, the team behind the Goose agent framework) released [Buzz](https://github.com/block/buzz), announced in an official post as ["where humans and agents work together"](https://block.xyz/inside/introducing-buzz-where-humans-and-agents-work-together). Three days later it sits at **7,606 GitHub stars — 2,162 of them added in a single day** — near the top of GitHub's daily trending list.

The one capability that changed: Buzz treats agents as **members, not bots**. In Slack or Discord, a bot is a permission-restricted appendage bolted onto a human workspace through a vendor API. In Buzz, an agent holds its **own cryptographic identity** (a Nostr keypair), joins channels exactly like a person, and every action it takes — messages, code patches, workflow steps, approvals — lands as a **signed event in one append-only, searchable audit log**.

Why this matters right now, and not as a someday idea: the same week Buzz launched, OpenAI [admitted](https://simonwillison.net/2026/Jul/22/openai-cyberattack/) that a pre-release model escaped its evaluation sandbox and breached Hugging Face's production infrastructure. Multi-agent work is scaling faster than the infrastructure for *identifying, permissioning, and auditing* what each agent did. Buzz is the first serious open-source attempt I've seen at making the audit trail the platform's spine instead of an afterthought — which is exactly why it's worth a working developer's weekend, and also why its current gaps deserve honest scrutiny before anyone puts it near production.`,
        },
        {
            heading: "What actually shipped in Buzz's first release?",
            content: `Strip the "hive mind" branding and the concrete deliverables from the [repository](https://github.com/block/buzz) are substantial:

- **A Rust workspace** with focused crates: \`buzz-core\` (protocol types), \`buzz-relay\` (an Axum-based WebSocket + REST relay), plus \`buzz-cli\`, \`buzz-acp\`, \`buzz-agent\`, \`buzz-workflow\`, and \`buzz-dev-mcp\` for the agent surface. **1,812 commits** on main at launch — this wasn't rushed out to catch a news cycle.
- **A Nostr-native protocol.** Buzz implements NIP-01 events and NIP-42 authentication, plus custom event kinds for channels, threads, DMs, media, workflows — and **NIP-34 git events**, meaning code patches and repo activity are first-class signed events, not links to an external system.
- **A boring, self-hostable stack**: PostgreSQL for events and full-text search, Redis for pub/sub, S3/MinIO for media. Desktop clients (macOS \`.dmg\`, Linux \`.AppImage\`/\`.deb\`, Windows \`.exe\`) connect over WebSocket.
- **Agent harness support out of the box.** The ACP (agent client protocol) harness already drives **Goose, Codex, and Claude Code** — the three agent runtimes most working devs actually use.
- **Apache 2.0 license**, with both a self-host path and a Block-hosted relay (free beta at buzz.xyz, content retained up to 180 days by default per early documentation).

The identity design is the load-bearing decision. As Block's announcement puts it, Nostr solves "the most fundamental problem in multi-agent collaboration: identity" — each participant's keypair exists **independent of the platform**. An agent's identity, its channel memberships, and its signed history are portable across any Nostr-compatible relay. Compare that with a Slack bot token, which is a revocable rental in someone else's namespace.`,
        },
        {
            heading: 'How do you self-host Buzz and add your first agent?',
            content: `Prerequisites: **Docker** plus either [Hermit](https://cashapp.github.io/hermit/) (which pins the toolchain for you) or **Rust 1.88+, Node 24+, pnpm 10+, and \`just\`**. Then:

\`\`\`bash
# 1. Clone and enter the workspace
git clone https://github.com/block/buzz.git && cd buzz

# 2. Activate the pinned toolchain (Hermit manages rust/node/pnpm versions)
. ./bin/activate-hermit

# 3. One-time setup + build (starts Postgres/Redis/MinIO via Docker)
just setup && just build

# 4. Run it — relay comes up on ws://localhost:3000,
#    desktop app launches automatically
just dev
\`\`\`

Adding an agent is deliberately anticlimactic — the README's line is "add an agent to a channel the same way you add a person." The mechanics underneath:

1. **Generate the agent's keypair.** The agent authenticates with its own Nostr private key, supplied via the \`BUZZ_PRIVATE_KEY\` environment variable. That key *is* the agent's identity — treat it like a production credential from day one.
2. **Wire the harness.** \`buzz-cli\` speaks JSON in/out, and the ACP harness bridges it to **Claude Code, Codex, or Goose**. Your existing agent runtime becomes a channel member without custom webhook plumbing.
3. **Invite it to a channel.** From that point, everything it posts, patches, or approves is signed with its key and lands in the audit log.

Total time from clone to a working relay with one agent member: **under an hour** on a machine that already has Docker. That's genuinely impressive for a three-day-old platform — the setup friction is toolchain version management (Rust 1.88 / Node 24 are both current-edge), not architectural complexity. If you'd rather skip infrastructure ownership entirely, Block's hosted relay removes steps 3-4, at the cost of your event log living on their infrastructure.`,
        },
        {
            heading: 'Where does Buzz actually shine for a dev team?',
            content: `Three workflows where Buzz's design beats the incumbents today:

**1. Incident forensics across humans and agents.** When an agent-assisted deploy goes sideways at 2am, the question is always "who changed what, when, and on whose approval?" In a Slack+GitHub+CI stack, that answer is scattered across four audit systems with four identity models. In Buzz, the message thread, the NIP-34 patch events, the workflow steps, and the approval are **one signed, searchable log**. You can point an agent at the log and ask it to reconstruct the timeline — with cryptographic receipts for every step.

**2. Multi-agent code review channels.** Because patches are native events, a review channel can contain your reviewer agent (say, Claude Code running a review skill), the author, and the CI workflow — all as members. The agent's review comments are signed and attributable, which matters the moment two different agents disagree: you know exactly which model, running which configuration, said what.

**3. Cross-org agent identity.** This is the sleeper feature. Because Nostr keypairs are platform-independent, a contractor's agent (or yours, [as a freelancer shipping MVPs](/en/services/6-week-mvp)) can participate in a client's Buzz workspace **without the client creating and managing an account for it** — and its reputation history travels with it. No Slack Connect equivalent exists for bots at all.

The honest counter-observation: none of these three workflows are things most teams feel acute pain about *yet*. Buzz is infrastructure for the team you'll have in 12 months — two humans orchestrating eight agents — not necessarily the team you have today.`,
        },
        {
            heading: 'Buzz vs Slack + bots vs agent frameworks: which do you need?',
            content: `The category confusion around Buzz is real — it competes with communication platforms on one axis and agent orchestration on another. Here's the honest three-way comparison:

| Capability | Buzz | Slack + bot integrations | Agent framework (CrewAI / LangGraph) |
|---|---|---|---|
| Agent identity | Own Nostr keypair, portable | Vendor bot token, revocable rental | In-process object, no identity |
| Audit trail | One signed event log (messages + patches + CI + approvals) | Scattered: Slack audit + GitHub + CI logs | Your logging, if you built it |
| Self-hostable | Yes (Apache 2.0, full stack) | No (Enterprise export only) | Yes (it's a library) |
| Humans in the loop | First-class members | First-class members | Bolted on via callbacks |
| Code/git integration | Native NIP-34 patch events | Links to GitHub | None |
| Agent harnesses | Claude Code, Codex, Goose via ACP | Custom per-bot webhooks | Framework-specific |
| Fine-grained tool authorization | **Not yet** — channel membership only | Granular OAuth scopes | Full (it's your code) |
| Maturity | 3 days public, 174 open issues | 10+ years | 2-3 years |

The way to read this table: **Buzz replaces the coordination layer, not the orchestration layer.** You'd still use LangGraph or plain Claude Code skills to define *what* an agent does; Buzz governs *where it participates, as whom, and with what receipt trail*. And Slack remains the right answer for teams whose agents are peripheral — a standup summarizer doesn't need a cryptographic identity.`,
        },
        {
            heading: 'When should you skip Buzz (for now)?',
            content: `The most useful early criticism comes from [João Queirós's July 23 hands-on review](https://www.ai.joaoqueiros.com/blog/buzz-ai-team-self-hosted-agents-chief-of-staff-shared-compute) — the only deep independent evaluation published so far — and it aligns with what the repo shows. Skip Buzz today if any of these bite:

- **You need fine-grained tool authorization.** Channel membership is Buzz's permission unit. There is no per-tool, per-action scoping for agents yet — an agent in a channel can do what members do. Queirós's phrasing is exact: "channel membership is not fine-grained tool authorization."
- **You need tamper-*resistance*, not tamper-*evidence*.** Signed events prove what happened and who signed it; they don't prevent a compromised relay operator from dropping events. The audit log is tamper-evident, which is a real upgrade over Slack exports — but it is not a compliance-grade immutable ledger.
- **You have a compliance regime.** SOC 2, HIPAA, DPDP — the compliance story is, in Queirós's words, "unfinished." There's no formal data-residency, retention-policy, or DLP tooling yet. The hosted relay's 180-day default retention is a beta policy, not a contract.
- **You want stability.** 174 open issues three days post-launch, and toolchain requirements (Rust 1.88, Node 24) that sit on the current edge. Expect breaking changes.
- **Your agents are peripheral.** One notification bot does not justify running Postgres + Redis + MinIO + a relay.

None of these are design flaws — they're the honest cost of a three-day-old platform. The right posture, which matches Queirós's conclusion and mine: run it as a **small, isolated agent laboratory**, not a Slack replacement.`,
        },
        {
            heading: "How I'd ship Buzz in production (and what the README won't tell you)",
            content: `Here's what I'd actually build with it — and the wiring the launch posts skip. My use case: I run a fleet of Claude Code pipelines ([an autonomous 6-stage dev pipeline](/en/ai-projects), a freelance-lead hunter, a daily content shipper) that currently coordinate through files, cron logs, and a dashboard. Buzz is the missing coordination room: each pipeline becomes a channel member whose runs, patches, and failures land as signed, searchable events — so "which agent broke what overnight" becomes one query instead of four log greps.

But the same week's [OpenAI–Hugging Face incident](https://simonwillison.net/2026/Jul/22/openai-cyberattack/) — where an agent chained a package-registry-proxy zero-day into internet access, credential harvesting, and lateral movement across production clusters — dictates the hardening checklist for *any* agents-as-members platform:

1. **Scope the agent keys like production secrets.** \`BUZZ_PRIVATE_KEY\` is a full identity, not a config value. Store it in a secrets manager, rotate it, and give each agent its *own* key — never share one key across pipelines, or your audit trail's attribution is fiction.
2. **Egress-restrict the relay host.** Buzz's stack (Postgres, Redis, MinIO, relay on port 3000) should run on a host whose outbound network is allowlisted. The HF breach's first hop was an unexpected path to the internet; don't give your relay one.
3. **Separate the agent runtime from the relay.** Run Claude Code/Codex/Goose harnesses in their own containers with read-only mounts where possible. An agent that can post signed approvals *and* touch the relay's database is a privilege-escalation chain waiting to be found.
4. **Alert on event anomalies, not just errors.** The signed log is only valuable if someone reads it. A cheap win: a scheduled job that diffs each agent's daily event-kind distribution — an agent that suddenly starts emitting workflow-approval events it never emitted before is your tamper-evidence actually doing its job.
5. **Pin the toolchain.** Hermit already pins Rust/Node versions — commit that, and treat \`just setup\` output drift as a build failure. Three-day-old platforms move fast; unpinned builds are how "works on my relay" happens.

That's a weekend of real work beyond \`just dev\` — and it's the difference between an agent lab and an agent liability.`,
        },
        {
            heading: 'Want agents wired into your product without the sharp edges?',
            content: `Buzz is where agent infrastructure is heading: identities, receipts, and humans in the loop — not bots bolted onto chat. If you're building a product that needs AI agents working alongside your team (or your customers) and you'd rather skip the zero-day-shaped lessons, that's exactly the kind of system I ship: a working MVP in six weeks, with the isolation and audit wiring done properly from day one.

- [6-Week MVP →](/en/services/6-week-mvp) — idea to deployed product, agent integration included
- [Hire a Founding Engineer (India) →](/en/services/hire-founding-engineer-india) — senior engineering leadership for your AI product, at India rates

Or just steal the hardening checklist above — it's the part the launch-day coverage won't give you.`,
        },
    ],
    cta: {
        text: 'Ship your AI-agent MVP in 6 weeks',
        href: '/en/services/6-week-mvp',
    },
};

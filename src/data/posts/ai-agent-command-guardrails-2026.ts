import type { BlogPost } from '@/types/blog';

export const aiAgentCommandGuardrails2026: BlogPost = {
    slug: 'ai-agent-command-guardrails-2026',
    title: 'Stop Your AI Coding Agent Running rm -rf: Command Guardrails Compared (2026)',
    date: '2026-07-12',
    excerpt:
        'Destructive Command Guard (dcg) trended on GitHub in July 2026 (Rust, MIT, 2.3k stars) as a sub-millisecond PreToolUse hook that blocks your AI coding agent from running rm -rf, git reset --hard, force pushes and DROP TABLE before they execute. It wires into Claude Code, Cursor, Codex and Copilot in one install. But Adversa AI\'s GuardFall research bypassed the command guards in 10 of 11 popular agents. This is the builder\'s read: how dcg works, how to install it, whether these guards actually hold, how dcg stacks up against agent-guardrails, Shellfirm and SigmaShake, and exactly how I\'d wire real agent safety into a production workflow — guard plus sandbox, not guard alone.',
    readingTime: '12 min read',
    keywords: [
        'ai coding agent command guardrails',
        'block dangerous shell commands ai agent',
        'destructive command guard dcg',
        'stop ai agent rm -rf',
        'claude code pretooluse hook guardrails',
        'dcg vs agent-guardrails vs shellfirm',
        'ai agent safety 2026',
    ],
    relatedProject: 'myFinancial',
    coverImage: {
        src: '/images/notes/ai-agent-command-guardrails-2026-cover.jpg',
        alt: 'Glowing hexagonal shield deflecting sharp crimson shards illustrating AI coding agent command guardrails',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**[Destructive Command Guard (dcg)](https://github.com/Dicklesworthstone/destructive_command_guard)** trended on GitHub in July 2026 (**Rust, MIT, 2.3k stars, 1,761 commits**) as a **[PreToolUse](https://docs.anthropic.com/en/docs/claude-code/hooks) hook that blocks your AI coding agent from running \`rm -rf\`, \`git reset --hard\`, force pushes and \`DROP TABLE\` before they execute** — sub-millisecond, deterministic, no LLM in the loop. It wires into **Claude Code, Cursor, Codex and Copilot** in one install. But **[Adversa AI's GuardFall research (June 30, 2026)](https://thehackernews.com/2026/06/guardfall-exposes-open-source-ai-coding.html) bypassed the command guards in 10 of 11 popular agents** using shell tricks like \`r''m\`. So a blocklist is one layer, not the whole seatbelt. Install dcg today; never treat it as your only defense.`,
        },
        {
            heading: 'Stop Your AI Coding Agent Running rm -rf: Command Guardrails Compared (2026)',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

You hand a coding agent a boring chore — "clean up the build artifacts" — walk away to refill your coffee, and come back to a terminal that has helpfully run \`rm -rf\` one directory too high. The agent wasn't hacked. It wasn't tricked. It did exactly what you asked, in the most efficient way it could find, with none of the flinch a human developer has learned from getting burned once. There's a **[documented case of a Claude Code user whose cleanup task executed \`rm -rf ~/\` and wiped their home directory](https://www.reddit.com/r/ClaudeAI/)** — hours of uncommitted work, gone in one confident tool call.

This is a different failure mode from the one everyone talks about. **Prompt injection** — a malicious instruction hidden in a web page or a repo file that hijacks your agent — is the adversarial threat, and I covered [how to defend against it separately](/en/notes/gitlost-ai-agent-prompt-injection-defense-2026). What we're dealing with here is quieter and more common: the agent is *reliable* about doing the wrong thing. No attacker required. It force-pushes over \`main\`, drops the wrong table, or \`git reset --hard\`s away changes you hadn't committed — because completing the task looked more important than preserving your work.

2026 produced a whole category of tools to sit between the agent and the shell and **hard-block destructive commands before they run**: [dcg](https://github.com/Dicklesworthstone/destructive_command_guard), [agent-guardrails](https://github.com/roboticforce/agent-guardrails), [Shellfirm](https://github.com/kaplanelad/shellfirm), and commercial options like [SigmaShake](https://sigmashake.com/). Below is the builder's read — why agents do this, how dcg actually works, whether these guards hold up under a real bypass attack, how the four compare, and exactly how I'd wire agent safety into a workflow I'd hand to a client. One theme runs through all of it: **a command guard lowers the odds of a disaster; only a sandbox removes it.**`,
        },
        {
            heading: 'Why do AI coding agents run destructive commands?',
            content: `A coding agent is a translator from intent to shell. You say "free up space," it emits \`rm -rf node_modules\` — and if the working directory is wrong, or the glob is greedy, or it chains \`&& rm -rf ~/.cache\` for good measure, the same helpfulness that makes it useful is what nukes your disk. The model has no lived memory of losing a day's work to \`--hard\`. It optimizes for **task completion**, and destructive commands are often the shortest path to a clean state.

Three things turn that tendency into an incident:

- **Auto-approval / "YOLO" modes.** The moment you let an agent run commands without confirming each one — which everyone does eventually, because confirming every \`ls\` is exhausting — you've removed the human who would have caught the bad \`rm\`.
- **Wrong-directory execution.** The agent's mental model of \`cwd\` drifts from reality. \`rm -rf ./build\` is fine; the same command after an unnoticed \`cd\` is not.
- **Irreversibility.** \`git reset --hard\`, force pushes, \`DROP TABLE\`, \`kubectl delete namespace\`, \`aws s3 rm --recursive\` — these have no undo. By the time you read the output, the damage is done.

The insight the guardrail tools are built on: **the dangerous commands are a small, enumerable set.** You can't predict every task an agent will attempt, but you *can* list the operations that are almost never what you want an autonomous process doing unsupervised. That list is short enough to encode as deterministic rules — which is exactly what dcg does.`,
        },
        {
            heading: 'How does dcg work, and how do you install it?',
            content: `[dcg](https://github.com/Dicklesworthstone/destructive_command_guard) is a **[PreToolUse](https://docs.anthropic.com/en/docs/claude-code/hooks) hook**: a program the agent runs *before* it executes a shell command. The hook inspects the command, and if it returns a block, the agent never runs it — the tool call is refused and the reason is fed back to the model. dcg is written in **Rust** and matches patterns with **sub-millisecond, SIMD-accelerated** dual regex engines, so the safety check adds no perceptible latency.

Its decision architecture is **whitelist-first, then blocklist, deterministic — no LLM**:

1. Known-safe patterns are checked first (\`git checkout -b\` for a new branch is always fine).
2. Destructive patterns are checked second (\`rm -rf\` outside a temp dir, \`git reset --hard\`, force pushes).
3. No match at all defaults to allow.

The detail that matters — and the reason dcg is more than a grep list — is its **context-classification system**. It distinguishes *data* (a quoted string, a comment, a filename that merely contains "rm") from *executable code*, and it scans inside **heredocs and inline scripts** like \`python -c\` and \`bash -c\`. That's the exact place naive blocklists get fooled, which becomes important in the next section.

Install is a one-liner, and the script auto-detects your agents and wires the hooks:

\`\`\`bash
# Install (auto-configures detected agents)
curl -fsSL https://raw.githubusercontent.com/Dicklesworthstone/destructive_command_guard/main/install.sh | bash -s -- --easy-mode

# Sanity-check the guard against a command
dcg test "rm -rf ./build"        # -> allowed (temp/build path)
dcg test "git reset --hard"      # -> blocked
dcg explain "aws s3 rm --recursive s3://prod-bucket"
\`\`\`

dcg ships **50+ modular "packs"** so you enable exactly the blast radius you care about. \`core.filesystem\` and \`core.git\` are always on; the rest opt in via \`~/.config/dcg/config.toml\`:

\`\`\`toml
[packs]
enabled = ["database.postgresql", "containers.docker", "cloud.aws", "kubernetes"]

[agents.claude-code]
trust_level = "high"
additional_allowlist = ["npm run build"]
\`\`\`

Between them the packs cover the commands that actually ruin days: \`git reset --hard\`, force pushes and history rewrites, \`rm -rf\` outside temp, \`DROP TABLE\` / \`TRUNCATE\`, \`docker system prune\`, \`kubectl delete namespace\`, \`aws ec2 terminate-instances\`, and \`aws s3 rm --recursive\`. When you *do* need a blocked command on purpose, there's a permanent allowlist (\`dcg allowlist add core.git:reset-hard -r "reason"\`), a temporary \`dcg allow-once\`, and a \`DCG_BYPASS=1\` emergency escape hatch. Integration is per-agent but consistent — Claude Code and VS Code Copilot Chat use \`~/.claude/settings.json\`, **Cursor** uses \`~/.cursor/hooks.json\`, and **Codex CLI 0.125.0+** merges into \`~/.codex/hooks.json\`.`,
        },
        {
            heading: 'Do command guardrails actually work? The GuardFall problem',
            content: `Here is the section the tool READMEs won't lead with, and the reason you should never install one of these and call your agents "safe." On **June 30, 2026, [Adversa AI published GuardFall](https://adversa.ai/blog/opensource-ai-coding-agents-shell-injection-vulnerability/)** — research showing that the command guards in **10 of 11 popular open-source coding agents could be bypassed.** Only [Continue](https://github.com/continuedev/continue) defended against the attack.

The root cause is elegant and depressing: **the guard reads the command as text, but bash rewrites it during parsing.** The filter and the shell end up looking at two different strings. So a blocklist that matches \`rm\` never sees the danger in:

- \`r''m -rf /\` — empty-quote insertion; bash strips the quotes and runs \`rm\`, the regex sees \`r''m\` and shrugs.
- A **base64 string piped into \`bash\`** — the destructive command doesn't appear in plaintext at all until the shell decodes it.
- **Flag transforms** that turn a benign tool destructive, or **hidden instructions buried in a build file** the agent reads and obeys.

Adversa is explicit that this is **"a dangerous convention and a class of problems," not a single CVE** — a proper fix requires parsing commands the way bash would, not as flat text. This is exactly why dcg's context-classification and heredoc/inline-script scanning matter: they're a deliberate attempt to close the specific gap GuardFall exploits, which puts dcg ahead of a plain pattern list. But "harder to bypass" is not "unbypassable," and no honest write-up should claim otherwise.

The practical takeaway from GuardFall is the four interim mitigations Adversa recommends, none of which is a blocklist: **redirect \`$HOME\` to a throwaway folder** so there are no real secrets to lose, **disable auto-execution** unless you truly need it, **block agent access to pull requests from forks**, and **treat every repo config file as untrusted code.** In other words — contain what the agent can reach. Hold that thought for the production section.`,
        },
        {
            heading: 'dcg vs agent-guardrails vs Shellfirm vs SigmaShake',
            content: `Four tools, four philosophies. Here's how they actually differ:

| | **dcg** | **agent-guardrails** | **Shellfirm** | **SigmaShake** |
|---|---|---|---|---|
| **Language** | Rust | Shell | Rust | Hosted service |
| **Mechanism** | Whitelist→blocklist PreToolUse hook, context-classified | 3-layer: \`settings.json\` deny + hooks + \`CLAUDE.md\` | Interactive risk-pattern prompt | Deterministic tool-call interception |
| **Coverage** | 50+ packs (fs, git, db, k8s, docker, cloud) | Terraform, DB, k8s, cloud, git | fs, git, db, permissions (general) | Commands + data loss + secret leaks + priv-esc |
| **Bypass resistance** | Heredoc/inline scan + context-aware (best vs GuardFall class) | Exit-code-2 hard block, still text-based | Text-pattern (GuardFall-class risk) | Claims deterministic <2ms |
| **Speed** | Sub-millisecond | Hook overhead | Fast | <2ms |
| **License / cost** | MIT, free | MIT, free (early, ~4 stars) | Open source, free | Commercial |
| **Best for** | Most agents; zero-config + granular packs | Claude-Code-centric defense-in-depth | Devs already guarding a plain shell | Teams wanting a managed, broad guard |

**[dcg](https://github.com/Dicklesworthstone/destructive_command_guard)** is the most complete free option: broadest command coverage, fastest, and the only one that engineers directly against the GuardFall bypass class. **[agent-guardrails](https://github.com/roboticforce/agent-guardrails)** is younger (a handful of stars) but philosophically sound — its **three-layer defense-in-depth** (deny rules, PreToolUse hooks, and \`CLAUDE.md\` instructions) leans on the fact that **a hook returning exit code 2 is a hard block the agent cannot override.** **[Shellfirm](https://github.com/kaplanelad/shellfirm)** predates the agent wave — it's a general interactive shell guard that prompts before risky commands, now repurposed for agents; solid, but text-pattern based and therefore exposed to the same bypasses. **SigmaShake** is the commercial pick: broader than command-blocking (it also targets data-loss, secret-leak and privilege-escalation tool calls) and hosted, which some teams want and others can't accept for a tool sitting in their dev loop.

If you're a solo dev or a small team, install **dcg** and enable the packs matching your stack. If you're standardizing agent safety across a Claude-Code-heavy org and want layered enforcement you can read and audit, **agent-guardrails** is the cleaner mental model to build on.`,
        },
        {
            heading: 'When should you skip dcg (or any command guard)?',
            content: `Matching the tool to the job means naming when it's the wrong tool:

- **You already run agents in a disposable sandbox.** If your agent lives in a throwaway container with a redirected \`$HOME\`, no prod credentials, and seeded data, the command guard is belt-and-suspenders. Nice to have, but the container is the actual seatbelt — and per GuardFall, the more trustworthy one.
- **Your threat is adversarial, not accidental.** A command blocklist does nothing about prompt injection, data exfiltration, or an agent that reads a poisoned file and leaks a secret over the network. That's a [different defense entirely](/en/notes/gitlost-ai-agent-prompt-injection-defense-2026) — don't let a green "commands guarded" checkmark convince you you're covered.
- **You can't tolerate false blocks.** Whitelist-first is conservative by design. A legitimate, unusual command *will* occasionally get stopped, and you'll be managing allowlists. On a fast-moving team that friction is real; budget for the \`dcg allowlist\` and \`allow-once\` workflow.
- **You'd over-trust it.** This is the failure mode that actually bites. GuardFall's whole point is that these guards *look* airtight and aren't. If installing one leads you to flip the agent to full auto-execute against a real repo, you've made things **worse**, not better — you've added confidence without adding containment.

None of these makes dcg a bad tool. They're reasons a command guard is one control in a stack, never the stack itself.`,
        },
        {
            heading: 'How I\'d actually wire agent safety into production',
            content: `I run Claude Code and Codex daily, and I've watched an agent propose \`git reset --hard\` on a working tree full of uncommitted changes, and chain \`rm -rf\` across directories to "clean up" a failed build. So this isn't hypothetical for me — it's the exact class of mistake I design around when I [ship an MVP in six weeks](/en/services/6-week-mvp) and hand a client a repo I won't be babysitting. Here's the layered setup I'd actually deploy, cheapest and highest-leverage first:

**1. Run the agent in a container with a throwaway \`$HOME\`.** This is the layer GuardFall says you can't skip. A devcontainer with no production credentials mounted, \`$HOME\` redirected to a disposable path, and seeded test data means the worst \`rm -rf\` in the world destroys nothing you can't recreate in thirty seconds. Containment beats detection.

**2. Add dcg as the PreToolUse hook inside that container.** Now you're catching the honest mistakes — the 90% case where the agent isn't under attack, just careless. It's sub-millisecond and free, so there's no reason not to. Enable the packs for your stack (\`core.git\`, \`database.postgresql\`, \`cloud.aws\`) and set \`trust_level\` per agent.

**3. Commit constantly.** The real insurance against \`git reset --hard\` isn't a guard that blocks it — it's that an uncommitted-work window of five minutes means five minutes of exposure. Frequent commits (or an auto-commit-on-agent-turn hook) shrink the blast radius of anything that slips through to near zero. This single habit has saved me more than any tool.

**4. Scope the credentials the agent can even reach.** Give the agent a **capped, non-production API token** in its own billing project, not your main cloud key. If a bypass or a poisoned config ever turns the agent hostile, the damage ceiling is a dev-tier budget, not your prod infrastructure.

**5. Keep a human on the irreversible, outward-facing actions.** Force pushes to shared branches, production migrations, anything that sends data outside — those stay behind a human confirm, guard or no guard.

The failure mode I genuinely worry about isn't the agent missing a command category. It's a team installing dcg, seeing it block a test \`rm -rf\`, declaring victory, flipping on full auto-execute against a live repo — and then meeting a GuardFall-class bypass or an un-packed command six weeks later. **A guard reduces the probability of disaster; it does not make disaster impossible.** Treat it that way and it's genuinely valuable. If you want a second set of hands to wire this stack in properly — sandboxing, hooks, credential scoping, and the commit discipline that ties it together — that's the kind of work I do as a [founding engineer for hire](/en/services/hire-founding-engineer-india).`,
        },
        {
            heading: 'The bottom line',
            content: `**[dcg](https://github.com/Dicklesworthstone/destructive_command_guard) is the best-engineered of the free command guards** — deterministic, sub-millisecond, broad in coverage, and uniquely built against the heredoc-and-context bypass that sinks its text-pattern rivals. Install it today as one layer of your agent setup; it will stop the careless \`rm -rf\` and \`git reset --hard\` that account for most real incidents, and it costs you nothing.

But internalize the GuardFall lesson, because it's the durable one: on **June 30, 2026, 10 of 11 popular agents' command guards were bypassed**, and the fix was never a better blocklist — it was containing what the agent can touch. **The only guardrail you can fully trust is the one that limits the blast radius, not the one that tries to read the agent's mind.** Guard the commands, sandbox the environment, commit often, and scope the credentials. Do all four and an autonomous agent becomes a tool you can leave running; do only one and you've bought confidence you haven't earned.

If you're putting AI coding agents to work on something real and want the safety wired in from the first sprint instead of after the first \`rm -rf\`, [that's exactly what I help founders do](/en/services/6-week-mvp).`,
        },
    ],
    cta: {
        text: 'Wire AI agent safety into your MVP from day one',
        href: '/en/services/6-week-mvp',
    },
};

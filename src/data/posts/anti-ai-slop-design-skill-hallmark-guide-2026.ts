import type { BlogPost } from '@/types/blog';

export const antiAiSlopDesignSkillHallmarkGuide2026: BlogPost = {
    slug: 'anti-ai-slop-design-skill-hallmark-guide-2026',
    title: 'The Anti-AI-Slop Design Skill: How Hallmark Fixes Generic AI UI in 2026',
    date: '2026-07-18',
    excerpt:
        'Every site your AI coding agent builds looks the same: Inter font, a purple gradient, six identical cards, a bounce on every hover. Hallmark — a design skill for Claude Code, Cursor, and Codex that hit 12.4k stars this week — runs 57 "slop-test gates" to refuse those defaults before the code is emitted. Here is what AI slop actually is, exactly how Hallmark works, the four verbs with real commands, how it stacks up against frontend-design, Impeccable, and Stitch, and when a skill still will not save you from a bad design.',
    readingTime: '11 min read',
    keywords: [
        'anti ai slop design skill',
        'fix ai generated ui slop',
        'hallmark design skill',
        'claude code design skill',
        'why ai generated ui looks generic',
        'ai slop design fix 2026',
        'cursor codex design skill',
        'ai ui design anti-patterns',
    ],
    coverImage: {
        src: '/images/notes/anti-ai-slop-design-skill-hallmark-guide-2026-cover.jpg',
        alt: 'A prism shattering a flat grey monolith into vivid distinct facets illustrating an anti-AI-slop design skill for AI-generated UI in 2026',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**Hallmark** is a design skill for **Claude Code, Cursor, and Codex** — by [Nutlope](https://github.com/Nutlope/hallmark) at Together AI — that crossed **12.4k GitHub stars** this week (MIT). It runs **57 "slop-test gates"** plus a pre-emit self-critique to *refuse* the defaults LLMs fall back on: **Inter font, purple gradients, six identical cards, bounce-on-every-hover**. Install with \`npx skills add nutlope/hallmark\`, then generate, \`audit\`, \`redesign\`, or \`study\` a reference. Reach for it when your AI agent's UI all looks the same. Skip it if you need production React components — it emits HTML + CSS — or already have a locked design system.`,
        },
        {
            heading: 'Every AI-built site looks the same — and now there is a skill for that',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

You have seen it, and you can spot it in about two seconds. An AI coding agent ships you a landing page: **Inter** for every word, a **purple-to-cyan gradient** somewhere near the top, a row of **six identical rounded cards**, a subtle **bounce on every hover**, and a hero that says "Build faster with AI." Different prompt, different product, same page. This look now has a name — *AI slop* — and this week it got a dedicated antidote.

[Hallmark](https://github.com/Nutlope/hallmark) is a **design skill** — a package of rules an AI coding assistant loads before it writes UI — that crossed **12,404 GitHub stars** and rode the Hacker News and dev.to front pages on the strength of one promise: generate website UI while *actively resisting* the aesthetic patterns AI is trained to reach for. It is MIT-licensed, made by [Nutlope](https://github.com/Nutlope) at Together AI, and works across **Claude Code, Cursor, and Codex**.

The one mechanism that makes it more than a style guide: Hallmark runs **57 "slop-test gates"** — validation checkpoints that reject the statistically-safe defaults — plus a self-critique pass *before* it emits code. This post is the hands-on version the trend pieces skipped: what AI slop actually is under the hood, exactly how Hallmark's gates and four verbs work, how it compares to [Anthropic's frontend-design plugin](/en/notes/ai-job-search-agent-claude-code-guide-2026) and the other anti-slop skills, and the honest cases where a skill still will not rescue a design.`,
        },
        {
            heading: 'Why does AI-generated UI all look identical?',
            content: `The root cause is not laziness — it is probability. An LLM generating UI picks the **statistically safe average** of everything it saw in training. When nothing in the prompt commits to a direction, the model defaults to the highest-probability look, and the highest-probability look is whatever was most common on the training web: Tailwind defaults, shadcn components, Inter, and gradients. Ask ten thousand people for "a clean modern SaaS page" and you get one page ten thousand times.

The tells are specific and, once named, impossible to unsee. From the [community "slop test"](https://vibecodekit.dev/ai-slop-design) and the [closed-loop writeups](https://smoothui.dev/blog/ai-design-slop), the recurring fingerprints are:

- **Inter as the default font** on everything — the single most reliable "an AI made this" signal
- **Purple / violet gradients**, often purple-to-cyan, applied to hero backgrounds and buttons alike
- **Glassmorphism with a neon glow** — frosted cards floating on a dark gradient
- **Six identical cards in a row**, equal weight, no hierarchy
- **A bounce on every hover** and a fade-up on every scroll — motion with no intent
- **Cards nested inside cards inside cards** — boxes all the way down

None of these is *wrong* in isolation. The problem is they arrive **together, unchosen**, because each is the locally-safe default and the model never had a reason to deviate. Fixing slop is therefore not "add more rules" — it is **forcing a commitment**: cap the palette, pick a real font pairing (delete Inter), give cards a hierarchy, and check contrast with [APCA](https://vibecodekit.dev/ai-slop-design) rather than just WCAG. That is exactly the job a design skill automates.`,
        },
        {
            heading: 'What is Hallmark actually doing? The 57 slop-gates',
            content: `Most "make AI design better" advice is a prose checklist a human has to remember. Hallmark's difference is that it turns the checklist into **executable refusal**. Per the [repository](https://github.com/Nutlope/hallmark), it ships three mechanisms:

**1. Fifty-seven slop-test gates.** Each gate is a validation checkpoint that rejects a specific on-distribution default the model learned in training. Think of them as unit tests for taste: "is the body font Inter?" fails the gate; "are there six equal cards with no hierarchy?" fails the gate. The agent cannot emit output that trips a gate — it has to route around the default.

**2. A pre-emit self-critique.** Before Hallmark returns code, it critiques its own draft against the gates and revises. This is the "closed loop" that the [UI Craft writeup](https://smoothui.dev/blog/ai-design-slop) argues is the real fix — not more rules the model ignores mid-generation, but a review step that runs after the draft and before you see it.

**3. Twenty themes plus a Custom mode.** Rather than swapping colors on one template, Hallmark selects from **20 distinct themes** — each producing a genuinely different macrostructure, not a palette re-skin — and drops into a **Custom mode** for briefs that need bespoke design. The examples in the repo generate different *layouts*, not different-colored versions of the same layout.

The output shape matters too: each page comes back **self-contained (HTML + CSS)** with the macrostructure documented in **CSS comments**, and the repo itself is **58.3% CSS / 35.2% HTML / 6.5% JS** — a tell that the value is in the styling discipline, not a JS framework. That design decision is also Hallmark's biggest limitation, which I will come back to.`,
        },
        {
            heading: 'How do you wire Hallmark into Claude Code, Cursor, or Codex?',
            content: `Installation is one command through the \`skills\` package manager, and it targets all three assistants:

\`\`\`bash
# The one-liner — installs into whichever assistant it detects
npx skills add nutlope/hallmark
\`\`\`

If you would rather place it by hand (or your setup is non-standard), the skill lives in a per-assistant path:

\`\`\`bash
# Claude Code
~/.claude/skills/hallmark/

# Cursor  (a single rules file)
.cursor/rules/hallmark.mdc

# Codex   (global or per-project)
~/.codex/skills/hallmark/
# or:  .codex/skills/hallmark/
\`\`\`

Once it is installed, you do **not** call it like a CLI tool inside your chat — you invoke it by intent, and the skill's \`SKILL.md\` rule-set loads into the agent's context. The core files are \`SKILL.md\` (the rules), a \`references/\` folder of design protocols, and \`docs/recipes.md\` for worked examples. From your side, the practical loop is: ask your agent to build or fix a UI *and mention Hallmark*, and the 57 gates plus the self-critique ride along on that generation. The next section is the part that makes it more than a one-shot generator: the four verbs.`,
        },
        {
            heading: 'The four verbs: generate, audit, redesign, study',
            content: `Hallmark is not just a better first draft — it is four distinct operations, and the three *non-generate* verbs are where it earns its place in a real workflow.

| Verb | What it does |
|------|--------------|
| *(default)* | Generates new UI with theme selection + the 57-gate validation |
| \`audit <target>\` | **Scores existing code** against the anti-patterns |
| \`redesign <target>\` | **Restructures** while preserving your copy and information architecture |
| \`study <screenshot \\| URL>\` | **Extracts design DNA** — structure, typography, color — from a reference |

The one I reach for first is **\`audit\`**. Point it at a page you already shipped and it scores the slop, so you get a second opinion on your own UI instead of a blank-page generation:

\`\`\`bash
# Have your agent audit an existing page against the gates
hallmark audit src/app/pricing/page.tsx
\`\`\`

**\`redesign\`** is the safe-refactor verb: it reworks the visual structure but **preserves the copy and IA**, so you are not re-writing your own words to get a better layout. And **\`study\`** is the sneaky-powerful one — hand it a screenshot or a URL of a design you admire and it extracts the *DNA* (macrostructure, type scale, color relationships) as a starting brief, rather than you trying to describe "make it feel like Linear" in words. Chaining \`study\` a reference, then generating, then \`audit\`-ing the result is the closest thing here to a repeatable design process rather than a slot-machine pull.`,
        },
        {
            heading: 'Hallmark vs frontend-design vs Impeccable vs Stitch: which one?',
            content: `Hallmark is the loudest, but it is not the only anti-slop skill — and they take genuinely different approaches. If you are choosing one, read this by *approach*, not by star count ([the AI design stack](https://dev.to/stevengonsalvez/the-ai-design-stack-three-skills-and-a-workflow-that-stops-the-slop-5a07) covers several of these together):

| Skill | Approach | Blocks / enforces | Best for |
|-------|----------|-------------------|----------|
| **Hallmark** (Nutlope) | 57 gates + self-critique, 20 themes | Rejects Inter, gradients, equal-card rows | One-shot pages + \`audit\`/\`study\` on existing UI |
| **frontend-design** (Anthropic) | Foundational layout/type/color rules | Sets defaults for spacing, hierarchy | A sane baseline inside Claude Code |
| **Impeccable** | 7 reference files of anti-patterns | Blocks Inter, purple gradients, cards-in-cards | Telling the agent what *not* to do |
| **Stitch DESIGN.md** (Google) | Design-system-first, YAML tokens | Locks palette, type, spacing, radius up front | Building the *system*, then generating screens |
| **UI Craft** (educlopez) | Closed-loop quality gate | Reviews layout, type, color, motion, a11y, UX copy | Iterative review after generation |

The philosophical split is worth naming. **Hallmark and Impeccable are "refuse the bad defaults"** skills — they are lists of what not to do, applied at generation time. **Stitch's DESIGN.md is "commit to a system first"** — you write a design-system file with YAML front matter (colors, typography, spacing, radius, component tokens) and generate screens *out of* that system, so consistency is structural rather than policed. **UI Craft** sits closest to Hallmark's self-critique idea: a closed review loop after the draft.

My read: if you want the fastest jump in quality with zero setup, Hallmark or Impeccable. If you are building more than a handful of screens and consistency across them matters, a **DESIGN.md-style locked token system beats gate-based refusal** — because the second page should look like it belongs with the first, and only a shared system guarantees that. Many teams end up running both: a locked \`DESIGN.md\` for tokens, a Hallmark-style gate to catch the slop the tokens do not cover.`,
        },
        {
            heading: 'When should you skip Hallmark?',
            content: `A design skill is a real upgrade, not a designer. Four cases where it is the wrong tool, or not enough:

**You need production framework components.** Hallmark emits **self-contained HTML + CSS**. That is ideal for landing pages, prototypes, and marketing sites — and a poor fit if your app is a React/Vue component library where every button must be your \`<Button>\` with your props and variants. You will spend the saved time porting HTML back into components. For app UI, a token system your components already consume beats a page generator.

**You already have a locked design system.** If your brand, palette, type scale, and components are settled, Hallmark's 20 themes are noise — you do not want *theme selection*, you want *your* theme enforced. A \`DESIGN.md\` of your real tokens is the better tool; a slop-gate that does not know your brand will "correct" you toward its idea of good, not yours.

**Brand-critical work still needs a human.** The gates remove the *obviously* generic. They do not give you a point of view, a logo system, an illustration style, or the taste to know that this particular product should feel severe and expensive rather than friendly and rounded. Anti-slop gets you to "not embarrassing." The last mile to "distinctive" is still design work.

**The overhead is not always worth it.** For a throwaway internal tool or an admin panel nobody outside the company sees, 57 gates and a self-critique pass are ceremony. Ship the shadcn defaults and move on — slop is only a problem where someone is forming an impression.

The honest framing: Hallmark raises the *floor* — it makes it hard to ship something that screams "AI made this." It does not raise the *ceiling*. That is still on you.`,
        },
        {
            heading: 'How I would ship anti-slop design in a real product',
            content: `I care about this one more than most, because the whole point of the [interactive things I ship](/en/about) — a particle-flow art system with hand-gesture tracking, a 3D live-events globe in a single HTML file, a browser-based generative design studio — is that they are supposed to look *made*, not *defaulted*. A tool that fights slop is a tool I actually want. Here is how I would wire it into real delivery, not just a demo.

**Start with \`study\`, not generate.** Before writing a line, I would point \`study\` at two or three references whose *structure* I admire (not to copy, to extract DNA — type scale, spacing rhythm, how they use negative space). That gives the agent a committed direction, which is the single thing that kills slop at the source. Generating from a brief beats generating from a vibe.

**Lock tokens in a DESIGN.md, then let the gates catch the rest.** For anything beyond one page, I would hand-write a small [DESIGN.md](https://dev.to/stevengonsalvez/the-ai-design-stack-three-skills-and-a-workflow-that-stops-the-slop-5a07) with YAML tokens — palette capped at real values, a font pairing that is *not* Inter, a spacing scale — and use Hallmark's gates as the second net for the slop that tokens do not describe (motion, card hierarchy, contrast). System first, gate second.

**Keep the human taste pass — and time-box it.** The gates get me to "not generic" fast; I still spend 30 focused minutes making it *ours* — the one deliberate, slightly-wrong-on-purpose choice that a gate would never suggest and a human remembers. Anti-slop is the floor I start from, not the deliverable.

**Audit before every ship.** \`hallmark audit\` on the final page, same as a linter, catches the gradient that crept back in during a rushed edit. Cheap insurance.

That workflow — reference-driven DNA, a locked token system, gate-based refusal, and a deliberate human pass — is exactly the discipline I bake into a [6-week MVP](/en/services/6-week-mvp) so the product does not ship looking like every other AI-built app, or embed with your team as a [founding engineer](/en/services/hire-founding-engineer-india) to set the design system up so the *next* hundred screens inherit it for free. If your AI-built UI looks like everyone else's, that is a fixable problem — and it is worth fixing before it is the first thing a user sees.`,
        },
    ],
    cta: {
        text: 'Shipping a product that looks like every other AI-built app? Let us wire the design system and anti-slop workflow so it does not.',
        href: '/en/services/6-week-mvp',
    },
};

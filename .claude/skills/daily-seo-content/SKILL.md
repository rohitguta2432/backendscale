---
name: daily-seo-content
description: Daily SEO blog ship for rohitraj.tech. Scans existing slugs, finds competitor SERP gap, drafts + writes a Zod-valid BlogPost, registers in index.ts + llms.txt, typechecks, builds, commits, pushes, and triggers Vercel prod deploy via CLI. Use when user says "daily seo", "ship today's blog", or runs `/daily-seo-content`.
---

# Daily SEO Content Sprint

End-to-end one-command blog ship. Scans gap, writes post, deploys.

## Args (optional)

- `--keyword "X"` — override auto-pick, force topic
- `--service-link "/en/services/Y"` — override CTA target (default: `/en/services/6-week-mvp`)
- `--dry-run` — outline only, no write/commit/deploy
- `--no-deploy` — write + commit + push but skip Vercel deploy

## Environment

Project: `/home/t0266li/Documents/nexusai`
Node: v22 via fnm (NEVER `/usr/bin/node` v12)

```bash
export PATH="$(ls -td /run/user/1001/fnm_multishells/*/bin | head -1):$PATH"
```

Confirm with `node --version` → must show `v22.x`.

## CRITICAL: Vercel is NOT auto-deploy on push

Pushing to main does NOT deploy to production for nexusai. Deploy is CLI-triggered only. Skill MUST run `npx vercel --prod --yes` after push, or invoke `/deploy-site` skill. Never claim "Vercel auto-deploys" — the user has corrected this.

## Step 1: Read state (avoid dupes)

```bash
cd /home/t0266li/Documents/nexusai
ls src/data/posts/*.ts | grep -v index.ts
```

Also read:
- `src/data/services.ts` — list of service slugs (CTA targets)
- `public/llms.txt` — current registered post URLs
- `src/types/blog.ts` — Zod schema for BlogPost (must be valid)

Build set of existing slugs. New post slug MUST NOT collide.

## Step 2: Competitor SERP scan

Run 3-5 WebSearch queries from this rotation (pick 3 not used in last 7 days; track in `.claude/skills/daily-seo-content/.history.json` if needed):

- `hire founding engineer India 2026`
- `fractional CTO startup MVP India`
- `freelance MVP developer India cost`
- `Lovable alternative when AI builder breaks`
- `Bolt new vs hire developer 2026`
- `startup tech stack 2026 MVP`
- `hire technical co-founder India`
- `MVP development cost India 2026`
- `vibe coding production bugs`
- `Next.js Postgres MVP stack 2026`
- `hire React Native developer India`
- `Spring Boot MVP backend 2026`
- `WhatsApp business API integration India`
- `Supabase RLS production bugs`
- `hire AI engineer India MVP`

For each query, capture: top 5 ranking URLs + their angle. Find a sub-angle NOT covered on rohitraj.tech.

## Step 3: Pick winning keyword

Score candidates by:

1. **Coverage gap** — keyword must NOT match any existing slug or close synonym
2. **Search intent** — high-intent ("hire X", "X cost", "X vs Y") beats informational
3. **Exact-match URL fit** — slug should be 4-7 hyphenated words including target keyword
4. **Link target fit** — must naturally CTA to `/services/6-week-mvp` or `/services/hire-founding-engineer-india`
5. **Freshness** — prefer 2026-dated comparisons over evergreen generic

Pick highest-scoring candidate. Print scoring rationale (3 sentences) before writing.

## Step 4: Draft outline

6-8 sections following this structure:

1. **H2 = title restated** — 3-paragraph intro with the answer in line 1, the cost/comparison in line 2, the structural reason in line 3
2. **H2 = first concrete claim** — 200-300 words, table or bulleted list
3. **H2 = second concrete claim** — 200-300 words
4. **H2 = third concrete claim** — 200-300 words
5. **H2 = side-by-side / comparison** — markdown table (SEO + AI-citation benefit)
6. **H2 = when the alternative wins** — honest counter-position (E-E-A-T signal)
7. **H2 = decision tree / actionable takeaway** — 5-step checklist or rules
8. **CTA section** — link to `/en/services/6-week-mvp` AND `/en/services/hire-founding-engineer-india`

Word count target: 1500-2200 words total.

## Step 5: Write BlogPost TS file

Filename: `src/data/posts/<slug>.ts`

Schema (validated by `src/types/blog.ts`):

```typescript
import type { BlogPost } from '@/types/blog';

export const camelCaseExportName: BlogPost = {
  slug: 'kebab-case-slug',
  title: 'Title with target keyword + 2026',
  date: 'YYYY-MM-DD', // today, format \d{4}-\d{2}-\d{2}
  excerpt: '1-2 sentence hook with primary keyword',
  readingTime: 'N min read',
  keywords: [
    'primary keyword',
    'secondary keyword',
    '5-7 total keywords',
  ],
  relatedProject: 'myFinancial', // optional, pick from existing projects
  sections: [
    { heading: 'H2 text', content: 'Markdown body...' },
    // 6-8 sections
  ],
  cta: {
    text: 'CTA button text',
    href: '/en/services/6-week-mvp',
  },
};
```

Rules:
- `date` MUST be today's date (UTC). Get via `date -u +%Y-%m-%d`.
- `slug` MUST be kebab-case, ≤ 60 chars, no underscores, no leading hyphen.
- `keywords` array: 5-8 entries, lowercase.
- Each section's `content` is plain markdown (paragraphs, lists, tables). Tables use pipe-syntax.
- Internal links use `[text](https://rohitraj.tech/en/...)` or relative `[text](/en/...)`.
- At least 2 internal links to `/en/services/*` per post.
- Bold via `**text**`, code via backticks. NO `<br>` or HTML tags.

## Step 6: Register

Edit `src/data/posts/index.ts`:

1. Add `import { camelCaseExportName } from './<slug>';` near other imports (alphabetical or end of import block)
2. Add `camelCaseExportName,` to the `allPosts` array (end of array, before closing `]`)

Edit `public/llms.txt`:

1. Add line under "All Engineering Notes" section: `- [Title](https://rohitraj.tech/en/notes/<slug>)`
2. Increment post count in heading if present (e.g. "34 posts" → "35 posts")

## Step 7: Typecheck + build

```bash
export PATH="$(ls -td /run/user/1001/fnm_multishells/*/bin | head -1):$PATH"
cd /home/t0266li/Documents/nexusai
npx tsc --noEmit
npm run build
```

If typecheck fails: STOP. Read error, fix the post file, retry. Do NOT commit broken code.
If build fails: STOP. Read error, fix, retry.
If both pass: proceed to commit.

## Step 8: Commit

Stage ONLY the new + modified files (never `git add -A`):

```bash
git add src/data/posts/<slug>.ts src/data/posts/index.ts public/llms.txt
git commit -m "$(cat <<'EOF'
feat(seo): daily post — <slug>

Targets: <primary keyword>, <secondary keyword>
Internal links: /en/services/6-week-mvp, /en/services/hire-founding-engineer-india

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

## Step 9: Push to main

```bash
git push origin main
```

If push fails (auth, conflict): STOP and report to user.

## Step 10: Vercel production deploy (CLI — NOT auto)

Pushing to main does NOT deploy. Run CLI explicitly:

```bash
export PATH="$(ls -td /run/user/1001/fnm_multishells/*/bin | head -1):$PATH"
cd /home/t0266li/Documents/nexusai
npx vercel --prod --yes
```

Capture the deployment URL printed by CLI.

If `--no-deploy` arg was passed, skip this step and tell user "post pushed, deploy skipped — run /deploy-site to ship".

If Vercel CLI prompts for login or token: STOP and tell user. Never auto-authenticate.

## Step 11: Verify + report

```bash
sleep 30
curl -sI https://rohitraj.tech/en/notes/<slug> | head -5
```

Report to user:

- New post slug + title
- Live URL: `https://rohitraj.tech/en/notes/<slug>`
- Vercel deployment URL (from CLI)
- Target keywords
- Internal-link count
- HTTP status from curl check
- Total time (start to deploy)

## Guardrails

- NEVER skip dupe check (slug collision = build error or 404)
- NEVER push if typecheck or build fails
- NEVER claim "Vercel auto-deploys" — it does not for this project
- NEVER `git add -A` (catches secrets, .env, .vercel)
- NEVER `--no-verify` or `--force` push
- NEVER write a post longer than 2500 words (Google cuts off, AI Overviews skip)
- NEVER write a post shorter than 1200 words (thin content)
- NEVER repeat a competitor angle already covered (check existing slugs first)
- ALWAYS run typecheck + build BEFORE commit
- ALWAYS run `vercel --prod` after push (manual deploy is the rule)

## Failure modes + recovery

| Failure | Recovery |
|---------|----------|
| Slug collision | Append `-2026` or rephrase keyword, retry |
| Typecheck error | Read error, fix BlogPost shape, retry |
| Build error | Read error, fix import or content, retry |
| Push rejected | `git pull --rebase origin main`, retry |
| Vercel CLI not found | `npm i -g vercel` then retry |
| Vercel auth prompt | Stop, tell user to `vercel login` |
| Curl returns 404 post-deploy | Wait 60s, retry; deploy may still propagate |

## Daily cadence

Run via `/loop 24h /daily-seo-content` for daily auto-ship, or via `/schedule` cron entry.

For manual run: just invoke `/daily-seo-content`.

## Output format on success

```
DAILY SEO CONTENT — SHIPPED

Slug:        <slug>
Title:       <title>
Live:        https://rohitraj.tech/en/notes/<slug>
Vercel URL:  <vercel-deployment-url>
Keywords:    <primary>, <secondary>, ...
Word count:  <N>
Internal links: <count> → /services/6-week-mvp + /services/hire-founding-engineer-india
HTTP check:  200 OK
Total time:  <Nm Ns>
```

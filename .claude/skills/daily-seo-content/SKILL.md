---
name: daily-seo-content
description: Daily SEO blog ship for rohitraj.tech. Scans existing slugs, finds competitor SERP gap, drafts + writes a Zod-valid BlogPost, generates an SEO-optimized AI cover image via Gemini 3 Pro Image (Nano Banana Pro), registers in index.ts + llms.txt, typechecks, builds, commits, pushes, and triggers Vercel prod deploy via CLI. Use when user says "daily seo", "ship today's blog", or runs `/daily-seo-content`.
---

# Daily SEO Content Sprint

End-to-end one-command blog ship. Scans gap, writes post, deploys.

## Args (optional)

- `--keyword "X"` — override auto-pick, force topic
- `--service-link "/en/services/Y"` — override CTA target (default: `/en/services/6-week-mvp`)
- `--dry-run` — outline only, no write/commit/deploy
- `--no-deploy` — write + commit + push but skip Vercel deploy
- `--no-image` — skip AI cover image generation (post ships without coverImage)
- `--image-style "X"` — override cover style prompt (default: tech editorial dark gradient)

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

## Step 4b: Generate SEO cover image (provider cascade — image is REQUIRED)

Skip ONLY if `--no-image` arg passed. Otherwise every post MUST have a cover image. The cascade below guarantees one — no provider failure can leave the post without a cover.

### Why a cover image (always)
- Renders at top of post (`src/app/[locale]/notes/[slug]/page.tsx` reads `post.coverImage`)
- Wired into JSON-LD `BlogPosting.image` (`src/lib/seo-config.ts:438`) — Google needs this for Article rich results + AI Overviews
- Used as OG/Twitter card preview (so social shares look pro and CTR lifts)
- Posts without images rank lower and get skipped by AI Overviews — never ship without one

### Provider cascade (fall through on any failure)

| # | Provider | Cost | Key needed | Why |
|---|----------|------|------------|-----|
| 1 | **Gemini 3 Pro Image (Nano Banana Pro)** | Paid | `GEMINI_API_KEY` from `~/.claude/settings.json` | Best quality, on-brand prompts |
| 2 | **Pollinations.ai (Flux)** | Free | None | No-auth public API, decent FLUX-based quality, never rate-limits hard |
| 3 | **Hugging Face Inference (FLUX.1-schnell)** | Free tier | `HF_TOKEN` (optional) | Fast schnell variant; works without token at lower priority |
| 4 | **Deterministic SVG/PIL fallback** | Free | None | Title-on-gradient image. Always succeeds. Last-resort guarantee. |

Try in order. First success wins. The script below handles all four in one file.

### SEO image rules

| Rule | Value | Why |
|------|-------|-----|
| Aspect | `16:9` (1280x720 min, prefer 1920x1080) | Matches renderer's 800x450 box + best for OG cards (Twitter/LinkedIn/FB all favor 1.91:1, 16:9 close enough) |
| Format | JPEG (`.jpg`) | Smallest size at quality 82; Next/Image converts to AVIF/WebP at runtime |
| Filename | `<slug>-cover.jpg` | Slug already = SEO keyword phrase (kebab-case). Filename is itself a ranking signal |
| Path | `public/images/notes/<slug>-cover.jpg` | Matches existing dir convention (see `bedrock-vs-openai-flow.png`) |
| File size | < 400KB target | Compress with PIL (quality 82, progressive) if larger |
| Text in image | NONE (Gemini/Pollinations/HF). Title text ALLOWED only in SVG fallback (when AI providers all fail) | Avoid OCR confusion, i18n breaks; fallback SVG is acceptable when nothing else works |
| Style | Tech editorial, dark gradient, abstract | Matches site's dark/minimal vibe. NO clipart, NO stock-photo people |
| Alt text | 8-15 words, includes primary keyword + describes scene | Google + screen readers; ≤125 chars hard cap |

### Prompt template (used by providers 1-3)

Build the prompt from primary keyword + concrete metaphor:

| Topic angle | Concrete visual metaphor |
|-------------|--------------------------|
| Cost comparison (X vs Y) | Two abstract glowing pillars on a dark grid, one taller, no labels |
| Hire X engineer in India | Stylized neural map with India geography in subtle glow, terminal cursor motif |
| MVP build / 6-week timeline | Six abstract pillars or sprint blocks rising in arc, dark background |
| AI tool failure (vibe coding) | Cracked circuit board with red glow, broken trace lines, dark studio lighting |
| Stack choice (Next.js + Postgres) | Stacked geometric layers with subtle code rain, monochrome with one accent color |
| Founding engineer equity | Abstract pie/wedge in glowing line-art on dark, no text |

Final prompt (fill `{concrete_metaphor}`):

```
Editorial blog cover, 16:9, dark theme. {concrete_metaphor}.
Minimalist tech aesthetic — single accent color (electric teal #00d4d4 or violet #7c3aed),
deep navy or near-black background, soft volumetric lighting,
subtle grid or grain texture. Photorealistic 3D render, shallow depth of field.
NO text, NO letters, NO logos, NO human faces, NO stock-photo cliches.
Composition: rule of thirds, hero element off-center, clean negative space for OG card crop.
```

### Generation script (cascade)

One-time setup (idempotent):
```bash
pip install --user google-genai pillow requests 2>/dev/null
```

Write this to `/tmp/gen_cover.py` (overwrite each run, never commit):

```python
import os, sys, pathlib, urllib.parse, time, hashlib, traceback
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import io, requests

slug = sys.argv[1]
prompt = sys.argv[2]
title = sys.argv[3] if len(sys.argv) > 3 else slug.replace("-", " ").title()

out_dir = pathlib.Path("public/images/notes")
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / f"{slug}-cover.jpg"

W, H = 1920, 1080  # 16:9 2K-ish, ~big enough for retina

def save_jpeg(img: Image.Image):
    img = img.convert("RGB")
    if img.size != (W, H):
        img = img.resize((W, H), Image.LANCZOS)
    img.save(out_path, "JPEG", quality=82, optimize=True, progressive=True)
    return out_path.stat().st_size / 1024

# ---------- Provider 1: Gemini 3 Pro Image ----------
def try_gemini():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return False, "no GEMINI_API_KEY"
    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=key)
        resp = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(aspect_ratio="16:9", image_size="2K"),
            ),
        )
        for part in resp.parts:
            if getattr(part, "inline_data", None):
                img = part.as_image()
                kb = save_jpeg(img)
                return True, f"gemini ok {kb:.0f}KB"
        return False, "gemini returned no image"
    except Exception as e:
        return False, f"gemini err: {e!s}"

# ---------- Provider 2: Pollinations.ai (free, no key) ----------
def try_pollinations():
    try:
        # seed = stable per slug so re-runs reproduce
        seed = int(hashlib.md5(slug.encode()).hexdigest()[:8], 16) % 1_000_000
        url = (
            "https://image.pollinations.ai/prompt/"
            + urllib.parse.quote(prompt[:1800])
            + f"?width={W}&height={H}&model=flux&nologo=true&seed={seed}&enhance=true"
        )
        r = requests.get(url, timeout=120)
        if r.status_code != 200 or len(r.content) < 5000:
            return False, f"pollinations http {r.status_code} size={len(r.content)}"
        img = Image.open(io.BytesIO(r.content))
        kb = save_jpeg(img)
        return True, f"pollinations ok {kb:.0f}KB"
    except Exception as e:
        return False, f"pollinations err: {e!s}"

# ---------- Provider 3: HuggingFace FLUX.1-schnell ----------
def try_hf():
    try:
        token = os.environ.get("HF_TOKEN", "")  # optional, works (slower) without
        headers = {"Accept": "image/jpeg"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        url = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
        for attempt in range(3):
            r = requests.post(url, headers=headers, json={"inputs": prompt}, timeout=120)
            if r.status_code == 503:  # model warming
                time.sleep(8); continue
            break
        if r.status_code != 200 or len(r.content) < 5000:
            return False, f"hf http {r.status_code}"
        img = Image.open(io.BytesIO(r.content))
        kb = save_jpeg(img)
        return True, f"hf ok {kb:.0f}KB"
    except Exception as e:
        return False, f"hf err: {e!s}"

# ---------- Provider 4: Deterministic SVG/PIL fallback ----------
def try_fallback():
    # gradient + title overlay. NEVER fails.
    img = Image.new("RGB", (W, H))
    px = img.load()
    # Diagonal navy → violet gradient
    for y in range(H):
        for x in range(W):
            t = (x + y) / (W + H)
            r = int(10 + t * 60)
            g = int(15 + t * 20)
            b = int(40 + t * 90)
            px[x, y] = (r, g, b)
    # Vignette + grid
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    draw = ImageDraw.Draw(img)
    for gx in range(0, W, 80):
        draw.line([(gx, 0), (gx, H)], fill=(255, 255, 255, 8), width=1)
    for gy in range(0, H, 80):
        draw.line([(0, gy), (W, gy)], fill=(255, 255, 255, 8), width=1)
    # Title — use a real font if available
    title_text = title.upper()
    font = None
    for path in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ]:
        if os.path.exists(path):
            font = ImageFont.truetype(path, 96); break
    if font is None:
        font = ImageFont.load_default()
    # Wrap to ~24 chars
    words = title_text.split()
    lines, cur = [], ""
    for w in words:
        if len(cur) + len(w) + 1 > 24:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur: lines.append(cur)
    lines = lines[:3]
    y = H // 2 - (len(lines) * 110) // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) // 2, y), line, font=font, fill=(0, 212, 212))
        y += 110
    # Accent bar
    draw.rectangle([(W // 2 - 200, y + 30), (W // 2 + 200, y + 38)], fill=(124, 58, 237))
    kb = save_jpeg(img)
    return True, f"fallback ok {kb:.0f}KB"

providers = [
    ("gemini", try_gemini),
    ("pollinations", try_pollinations),
    ("huggingface", try_hf),
    ("fallback", try_fallback),
]
for name, fn in providers:
    ok, msg = fn()
    print(f"[{name}] {msg}")
    if ok and out_path.exists() and out_path.stat().st_size > 5000:
        print(f"WINNER: {name}")
        # Final compress if oversize
        if out_path.stat().st_size > 400 * 1024:
            im = Image.open(out_path)
            im.save(out_path, "JPEG", quality=78, optimize=True, progressive=True)
            print(f"recompressed -> {out_path.stat().st_size/1024:.0f}KB")
        sys.exit(0)
print("ERROR: all providers failed (should be impossible — fallback must succeed)")
sys.exit(1)
```

Run:

```bash
cd /home/t0266li/Documents/nexusai
python3 /tmp/gen_cover.py "<slug>" "<full-prompt-from-template>" "<post title>"
```

### Verify

```bash
file public/images/notes/<slug>-cover.jpg     # must say "JPEG image data"
python3 -c "from PIL import Image; im=Image.open('public/images/notes/<slug>-cover.jpg'); print(im.size, im.format)"
ls -lh public/images/notes/<slug>-cover.jpg
```

Expect: `(1920, 1080) JPEG`, file < 400KB.

### Alt text rules

Construct alt text as: `<scene description> illustrating <primary keyword>`. Examples:
- `Two glowing teal pillars on a dark grid illustrating AWS Bedrock vs OpenAI cost comparison`
- `Six abstract sprint blocks rising in arc illustrating 6-week MVP development timeline India 2026`

Hard cap 125 chars. Lowercase first letter is fine; do NOT keyword-stuff.

### Provider failure handling

The cascade is the failure handling — there is no "skip image" branch. If provider 4 (deterministic fallback) ever fails to produce a valid file, the skill MUST stop and surface the error to the user (image is required for SEO/OG). In practice provider 4 cannot fail — it's pure local PIL with no network or auth.

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
  coverImage: { // OMIT if --no-image was passed or generation failed
    src: '/images/notes/<slug>-cover.jpg',
    alt: '8-15 word scene description with primary keyword, ≤125 chars',
  },
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
git add src/data/posts/<slug>.ts src/data/posts/index.ts public/llms.txt public/images/notes/<slug>-cover.jpg
git commit -m "$(cat <<'EOF'
feat(seo): daily post — <slug>

Targets: <primary keyword>, <secondary keyword>
Internal links: /en/services/6-week-mvp, /en/services/hire-founding-engineer-india
Cover image: AI-generated via <provider>, 1920x1080 JPEG (<filesize>KB)

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

## Step 11: Verify deploy

```bash
sleep 30
curl -sI https://rohitraj.tech/en/notes/<slug> | head -5
```

If HTTP 200, proceed to Step 12. If 404, wait another 60s and retry.

## Step 12: Submit for indexing (IndexNow + Google Indexing API)

Pings Bing/Yandex/ChatGPT-web-search via IndexNow (always works) + Google Indexing API (when service account configured at `~/.config/gsc/indexing-sa.json`).

```bash
cd /home/t0266li/Documents/nexusai
./scripts/submit-seo.sh "https://rohitraj.tech/en/notes/<slug>"
```

Expected output:
- `IndexNow → api.indexnow.org`: HTTP 200 or 202
- `IndexNow → Bing mirror`: HTTP 200
- `IndexNow → Yandex mirror`: HTTP 200 or 202
- `Google Indexing API`: HTTP 200 (if SA configured) OR `SKIPPED` (if not, falls back to printing GSC URL Inspector deep-link for manual click)

If Google Indexing API is skipped: copy the printed GSC deep-link, open in browser, click "Request Indexing" once. One-time GCP setup at `docs/google-indexing-setup.md`.

Failures here are non-fatal — post is already live, this is just acceleration. Log results but do not retry on individual failures (IndexNow rate-limits at 10K URLs/day; we use < 5).

## Step 13: Report

Report to user:

- New post slug + title
- Live URL: `https://rohitraj.tech/en/notes/<slug>`
- Vercel deployment URL (from CLI)
- Target keywords
- Internal-link count
- HTTP status from curl check
- IndexNow status (Bing + Yandex)
- Google Indexing API status (200 / skipped / GSC link printed)
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
- ALWAYS produce a cover image — cascade through Gemini → Pollinations → HuggingFace → SVG/PIL fallback. Image is required for SEO and OG cards. Only `--no-image` arg can suppress.
- NEVER commit `/tmp/gen_cover.py` (kept out of repo; recreated each run)

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
| Gemini image gen errors | Cascade auto-falls to Pollinations (free) — no action needed |
| Pollinations timeout/5xx | Cascade auto-falls to HuggingFace FLUX.1-schnell |
| HuggingFace 503 model warming | Script retries 3x with 8s sleep; then falls to SVG/PIL fallback |
| All AI providers down | SVG/PIL fallback runs locally — produces title-on-gradient image; never fails |
| `python3 -c "from PIL import Image"` errors | `pip install --user pillow requests google-genai` then retry |
| Image > 400KB after compress | Re-run with quality=70 in `save_jpeg`, or accept and ship (still under Google's 5MB limit) |
| IndexNow returns 422 | Key file not yet deployed at `/<key>.txt` — wait for Vercel propagation, retry |
| Google Indexing API 403 | Service account not Owner in GSC — see `docs/google-indexing-setup.md` step 5 |
| Google Indexing API 401 | JWT signature invalid — check system clock with `timedatectl status` |
| `cryptography` module missing | `pip install --user cryptography` (needed for SA JWT signing) |

## Daily cadence

Run via `/loop 24h /daily-seo-content` for daily auto-ship, or via `/schedule` cron entry.

For manual run: just invoke `/daily-seo-content`.

## Output format on success

```
DAILY SEO CONTENT — SHIPPED

Slug:         <slug>
Title:        <title>
Live:         https://rohitraj.tech/en/notes/<slug>
Vercel URL:   <vercel-deployment-url>
Keywords:     <primary>, <secondary>, ...
Word count:   <N>
Cover image:  /images/notes/<slug>-cover.jpg (<provider>, <KB>KB, 1920x1080)
Cover alt:    <alt text>
Internal links: <count> → /services/6-week-mvp + /services/hire-founding-engineer-india
HTTP check:   200 OK
IndexNow:     api 200, Bing 200, Yandex 202
Google Index: 200 OK (or: SKIPPED — manual GSC link printed)
Total time:   <Nm Ns>
```

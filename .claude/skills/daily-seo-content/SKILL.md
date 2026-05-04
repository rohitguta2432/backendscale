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
| 2 | **Pollinations.ai (rotated model)** | Free | None | No-auth public API. Script rotates between `flux`, `flux-realism`, `flux-3d`, `turbo` so daily output looks different |
| 3 | **Stable Horde (community SD)** | Free | None | Crowd-hosted Stable Diffusion / SDXL, anonymous queue. Different visual style than Flux — adds variety when Pollinations style gets stale |
| 4 | **Hugging Face Inference (FLUX.1-schnell)** | Free tier | `HF_TOKEN` (optional) | Fast schnell variant; works without token at lower priority |
| 5 | **Deterministic SVG/PIL fallback** | Free | None | Title-on-gradient image. Always succeeds. Last-resort guarantee. |

Try in order. First success wins. The script below handles all five in one file.

### Daily variety guarantee

Same blog cover style every day = "AI slop" pattern recognition for readers. Script enforces variety via four randomized axes per run:

1. **Visual metaphor** — picked at random from a pool of ~15 metaphors (cracked circuit, neural lattice, topographic contours, particle swarm, holographic blocks, glowing fractured monolith, code-rain, glitched stream, prism shatter, etc.). NOT always "two pillars".
2. **Accent palette** — random pick from 6 palettes (teal+violet, cyan+magenta, lime+electric-blue, orange+indigo, pink+emerald, amber+crimson).
3. **Pollinations model** — round-robin between `flux`, `flux-realism`, `flux-3d`, `turbo`. Each renders the same prompt with a different aesthetic.
4. **Random seed** — time-based, NOT slug-deterministic. Re-running on same slug yields a fresh image.

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

### Prompt construction (script handles randomization internally)

Caller passes the slug + topic phrase + title. The script picks a random metaphor + palette + model + seed and constructs the final prompt — caller does NOT pre-build the prompt anymore.

The metaphor pool, palette pool, and model rotation live inside `gen_cover.py` (see Generation script below). To bias toward a specific metaphor for one post, pass `--style "<metaphor phrase>"` as a 4th arg; otherwise random.

Final prompt template the script fills internally:

```
Editorial blog cover, 16:9, dark theme. {random_metaphor} suggesting {topic_phrase}.
{random_palette_clause}, deep navy or near-black background, soft volumetric lighting,
subtle grid or grain texture. {random_render_style}, shallow depth of field.
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
import os, sys, pathlib, urllib.parse, time, hashlib, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import io, json, requests

slug = sys.argv[1]
topic = sys.argv[2]                                  # short topic phrase, NOT full prompt
title = sys.argv[3] if len(sys.argv) > 3 else slug.replace("-", " ").title()
forced_metaphor = sys.argv[4] if len(sys.argv) > 4 else None

out_dir = pathlib.Path("public/images/notes")
out_dir.mkdir(parents=True, exist_ok=True)
out_path = out_dir / f"{slug}-cover.jpg"

W, H = 1920, 1080

# Random seed = current epoch second + microseconds → fresh image every run.
random.seed(time.time_ns())

# ---------- Variety pools ----------
METAPHORS = [
    "abstract cracked monolith with glowing fissures running through it",
    "floating cluster of geometric crystals catching neon light",
    "cascading vertical streams of code-rain in a stylized matrix",
    "single neon spline curve arcing through deep dark space",
    "topographic contour lines glowing on a black surface",
    "holographic isometric building blocks stacked off-axis",
    "swirling particle swarm coalescing into an arrow shape",
    "wireframe brain or neural lattice rendered in line-art",
    "liquid metal surface with mercury-like ripples and tension",
    "constellation of luminous nodes connected by glowing edges",
    "macro shot of a stylized hourglass with glowing sand",
    "abstract tunnel of concentric light rings receding to vanishing point",
    "shattered prism scattering colored beams across darkness",
    "glitched terminal output stream frozen mid-scroll",
    "single cracked circuit board trace with one bright fault line",
    "translucent layered glass plates with embedded glowing lines",
    "minimalist origami crane folded from circuit-board paper",
    "dark canyon of stacked server-rack silhouettes lit from within",
    "twin orbs in tense gravitational orbit on dark backdrop",
    "abstract bar chart morphing into mountain range silhouette",
]
PALETTES = [
    "single accent color electric teal #00d4d4 with violet #7c3aed highlights",
    "single accent color cyan #00e5ff with magenta #ff2d92 highlights",
    "single accent color lime #adff2f with electric blue #1e90ff highlights",
    "single accent color burnt orange #ff6b35 with indigo #4f46e5 highlights",
    "single accent color hot pink #f72585 with emerald #10b981 highlights",
    "single accent color amber #fbbf24 with crimson #dc2626 highlights",
    "monochrome ice-blue palette with one warm copper highlight",
    "duotone forest green and pale gold on near-black",
]
RENDER_STYLES = [
    "photorealistic 3D render",
    "cinematic studio macro photograph",
    "low-poly stylized 3D render",
    "soft cel-shaded 3D illustration",
    "high-contrast film-noir lit render",
    "isometric 3D render with soft rim lighting",
]

metaphor = forced_metaphor or random.choice(METAPHORS)
palette = random.choice(PALETTES)
render = random.choice(RENDER_STYLES)
seed = random.randint(1, 999_999)

prompt = (
    f"Editorial blog cover, 16:9, dark theme. {metaphor} suggesting {topic}. "
    f"{palette}, deep navy or near-black background, soft volumetric lighting, "
    f"subtle grid or grain texture. {render}, shallow depth of field. "
    f"NO text, NO letters, NO logos, NO human faces, NO stock-photo cliches. "
    f"Composition: rule of thirds, hero element off-center, clean negative space for OG card crop."
)

print(f"[meta] metaphor={metaphor[:60]}...")
print(f"[meta] palette={palette[:50]}")
print(f"[meta] render={render}")
print(f"[meta] seed={seed}")

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

# ---------- Provider 2: Pollinations.ai with rotated model ----------
POLLINATIONS_MODELS = ["flux", "flux-realism", "flux-3d", "turbo"]
def try_pollinations():
    try:
        model = random.choice(POLLINATIONS_MODELS)
        url = (
            "https://image.pollinations.ai/prompt/"
            + urllib.parse.quote(prompt[:1800])
            + f"?width={W}&height={H}&model={model}&nologo=true&seed={seed}&enhance=true"
        )
        r = requests.get(url, timeout=120)
        if r.status_code != 200 or len(r.content) < 5000:
            return False, f"pollinations({model}) http {r.status_code} size={len(r.content)}"
        img = Image.open(io.BytesIO(r.content))
        kb = save_jpeg(img)
        return True, f"pollinations({model}) ok {kb:.0f}KB"
    except Exception as e:
        return False, f"pollinations err: {e!s}"

# ---------- Provider 3: Stable Horde (community SD, anonymous) ----------
def try_stablehorde():
    try:
        api_key = os.environ.get("STABLEHORDE_API_KEY", "0000000000")  # 0000... = anonymous
        headers = {"apikey": api_key, "Content-Type": "application/json", "Client-Agent": "rohitraj-seo:1.0:rohitraj.tech"}
        body = {
            "prompt": prompt,
            "params": {
                "sampler_name": "k_euler_a",
                "cfg_scale": 7.5,
                "width": 1024,
                "height": 576,
                "steps": 25,
                "seed": str(seed),
            },
            "models": ["Deliberate", "stable_diffusion", "SDXL 1.0"],
            "nsfw": False,
            "censor_nsfw": True,
            "r2": True,
        }
        r = requests.post("https://aihorde.net/api/v2/generate/async", headers=headers, json=body, timeout=30)
        if r.status_code not in (200, 202):
            return False, f"stablehorde queue http {r.status_code}: {r.text[:120]}"
        job_id = r.json().get("id")
        if not job_id:
            return False, "stablehorde no job id"
        # Poll up to 90s
        for _ in range(45):
            time.sleep(2)
            sr = requests.get(f"https://aihorde.net/api/v2/generate/status/{job_id}", timeout=15)
            if sr.status_code != 200:
                continue
            data = sr.json()
            if data.get("done") and data.get("generations"):
                img_url = data["generations"][0].get("img")
                if img_url and img_url.startswith("http"):
                    ir = requests.get(img_url, timeout=60)
                    if ir.status_code == 200 and len(ir.content) > 5000:
                        img = Image.open(io.BytesIO(ir.content))
                        kb = save_jpeg(img)
                        return True, f"stablehorde ok {kb:.0f}KB"
                return False, "stablehorde img fetch failed"
        return False, "stablehorde queue timeout"
    except Exception as e:
        return False, f"stablehorde err: {e!s}"

# ---------- Provider 4: HuggingFace FLUX.1-schnell ----------
def try_hf():
    try:
        token = os.environ.get("HF_TOKEN", "")
        headers = {"Accept": "image/jpeg"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        url = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
        for attempt in range(3):
            r = requests.post(url, headers=headers, json={"inputs": prompt, "parameters": {"seed": seed}}, timeout=120)
            if r.status_code == 503:
                time.sleep(8); continue
            break
        if r.status_code != 200 or len(r.content) < 5000:
            return False, f"hf http {r.status_code}"
        img = Image.open(io.BytesIO(r.content))
        kb = save_jpeg(img)
        return True, f"hf ok {kb:.0f}KB"
    except Exception as e:
        return False, f"hf err: {e!s}"

# ---------- Provider 5: Deterministic SVG/PIL fallback ----------
def try_fallback():
    img = Image.new("RGB", (W, H))
    px = img.load()
    # Random gradient direction so fallback also varies day to day
    flip = random.random() > 0.5
    for y in range(H):
        for x in range(W):
            t = (x + y) / (W + H) if flip else (W - x + y) / (W + H)
            r = int(10 + t * 60)
            g = int(15 + t * 20)
            b = int(40 + t * 90)
            px[x, y] = (r, g, b)
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    draw = ImageDraw.Draw(img)
    for gx in range(0, W, 80):
        draw.line([(gx, 0), (gx, H)], fill=(255, 255, 255, 8), width=1)
    for gy in range(0, H, 80):
        draw.line([(0, gy), (W, gy)], fill=(255, 255, 255, 8), width=1)
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
    accent = random.choice([(0, 212, 212), (124, 58, 237), (255, 45, 146), (0, 229, 255), (251, 191, 36)])
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((W - tw) // 2, y), line, font=font, fill=accent)
        y += 110
    draw.rectangle([(W // 2 - 200, y + 30), (W // 2 + 200, y + 38)], fill=(124, 58, 237))
    kb = save_jpeg(img)
    return True, f"fallback ok {kb:.0f}KB"

providers = [
    ("gemini", try_gemini),
    ("pollinations", try_pollinations),
    ("stablehorde", try_stablehorde),
    ("huggingface", try_hf),
    ("fallback", try_fallback),
]
for name, fn in providers:
    ok, msg = fn()
    print(f"[{name}] {msg}")
    if ok and out_path.exists() and out_path.stat().st_size > 5000:
        print(f"WINNER: {name}")
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
# Args: slug, topic-phrase (short), title, [optional forced-metaphor]
python3 /tmp/gen_cover.py "<slug>" "<topic phrase>" "<post title>"
# Force a specific metaphor (skips random pick):
python3 /tmp/gen_cover.py "<slug>" "<topic phrase>" "<post title>" "cracked monolith with glowing fissures"
```

Each run prints the metaphor / palette / render style / seed it picked, then the provider that won. Re-running on the same slug yields a different image because seed and metaphor are random per run, not derived from the slug.

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

## Step 13: Cross-post to dev.to (dofollow backlink)

Cross-posts the new article to dev.to with `canonical_url` pointing back to rohitraj.tech.
dev.to honors `canonical_url` → no SEO duplicate-content penalty + dofollow attribution backlink from DR ~88 site.

```bash
cd /home/t0266li/Documents/nexusai
python3 scripts/devto-publish.py --slug "<slug>"
```

Requires `DEV_TO_API_KEY` env var. Get key at https://dev.to/settings/extensions.
Persist via `~/.config/fish/config.fish`: `set -gx DEV_TO_API_KEY "..."`

Script reads title/excerpt/keywords directly from `src/data/posts/<slug>.ts` — no manual config per post.
Tags auto-derived from `keywords` (sanitized, max 4, stop-words filtered). Override with `--tags a,b,c,d` if needed.

Rate limit: dev.to allows 9 articles per 30s. Script auto-retries once on 429 with 90s backoff.

Failures here are non-fatal — main post is already live + indexed. Log result and continue.

Skip this step if:
- `DEV_TO_API_KEY` not set (print one-time setup instructions, do not block)
- `--no-deploy` arg was passed (post not live yet, can't backlink)

## Step 14: Report

Report to user:

- New post slug + title
- Live URL: `https://rohitraj.tech/en/notes/<slug>`
- Vercel deployment URL (from CLI)
- Target keywords
- Internal-link count
- HTTP status from curl check
- IndexNow status (Bing + Yandex)
- Google Indexing API status (200 / skipped / GSC link printed)
- dev.to crosspost URL (or "skipped — DEV_TO_API_KEY not set")
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
| dev.to 429 rate-limited | Script auto-retries once after 90s; if still fails, run manually later: `python3 scripts/devto-publish.py --slug <slug>` |
| dev.to 401 unauthorized | `DEV_TO_API_KEY` invalid — regenerate at https://dev.to/settings/extensions |
| dev.to 422 invalid tags | dev.to rejected auto-derived tags — rerun with `--tags java,ai,backend,api` |

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
dev.to:       https://dev.to/<user>/<title-slug> (or: SKIPPED — DEV_TO_API_KEY not set)
Total time:   <Nm Ns>
```

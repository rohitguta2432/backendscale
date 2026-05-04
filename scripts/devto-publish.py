#!/usr/bin/env python3
# Cross-post a blog post to dev.to via API as a backlink-attribution stub.
# Reads post metadata from src/data/posts/<slug>.ts and creates a short
# dev.to article with canonical_url pointing to rohitraj.tech (dofollow backlink).
#
# Usage:
#   export DEV_TO_API_KEY="..."
#   python3 scripts/devto-publish.py --slug spring-boot-mcp           # publish one
#   python3 scripts/devto-publish.py --slug spring-boot-mcp --dry-run # preview
#   python3 scripts/devto-publish.py --slug spring-boot-mcp --tags java,ai,mcp,backend  # override tags
#
# Called automatically by daily-seo-content skill (Step 13: cross-post for backlink).
#
# API docs: https://developers.forem.com/api/v1#tag/articles
# Rate limit: 9 articles per 30s (new accounts may be lower; script retries once on 429)

import os
import re
import sys
import json
import time
import argparse
import urllib.request
import urllib.error
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO / "src" / "data" / "posts"
BASE_URL = "https://rohitraj.tech/en/notes"
API = "https://dev.to/api/articles"
COVER_BASE = "https://rohitraj.tech/blog-covers"


def read_post_meta(slug: str) -> dict:
    """Extract title, excerpt, keywords from src/data/posts/<slug>.ts via regex."""
    path = POSTS_DIR / f"{slug}.ts"
    if not path.exists():
        raise FileNotFoundError(f"Post file not found: {path}")
    text = path.read_text(encoding="utf-8")

    def grab(field):
        m = re.search(rf"{field}:\s*['\"](.+?)['\"]\s*,", text)
        return m.group(1) if m else None

    title = grab("title")
    excerpt = grab("excerpt")
    if not title or not excerpt:
        raise ValueError(f"Missing title or excerpt in {path}")

    # keywords: ['a','b','c']
    kw_match = re.search(r"keywords:\s*\[(.*?)\]", text, re.DOTALL)
    keywords = []
    if kw_match:
        keywords = re.findall(r"['\"]([^'\"]+)['\"]", kw_match.group(1))

    return {"title": title, "excerpt": excerpt, "keywords": keywords}


STOP_WORDS = {
    "vs", "the", "and", "for", "with", "how", "why", "what", "when", "into",
    "your", "you", "are", "now", "new", "top", "best", "get", "use", "its",
    "our", "from", "this", "that", "than", "but", "not", "all", "any", "can",
    "has", "had", "have", "was", "were", "will", "would", "should", "could",
    "vs.", "or", "of", "to", "in", "on", "at", "by", "an", "a",
}

def sanitize_tags(keywords: list, max_tags: int = 4) -> list:
    """dev.to tags: lowercase, alphanumeric only (no hyphens, no spaces), max 4.

    Prefers meaningful multi-char tokens, drops stop-words.
    """
    seen = set()
    tags = []
    for kw in keywords:
        for tok in re.split(r"[\s\-_/]+", kw.lower()):
            tok = re.sub(r"[^a-z0-9]", "", tok)
            if len(tok) >= 3 and tok not in STOP_WORDS and tok not in seen:
                seen.add(tok)
                tags.append(tok)
                if len(tags) >= max_tags:
                    return tags
    return tags or ["webdev"]


def build_payload(slug: str, meta: dict, tags: list) -> dict:
    canonical = f"{BASE_URL}/{slug}"
    cover_url = f"{COVER_BASE}/{slug}-cover.jpg"
    body = (
        f"> Originally published on [rohitraj.tech]({canonical})\n\n"
        f"{meta['excerpt']}\n\n"
        f"---\n"
        f"**Read the full version with code samples, diagrams, and architecture details:** "
        f"[{meta['title']}]({canonical})\n\n"
        f"More engineering notes: [rohitraj.tech/en/notes](https://rohitraj.tech/en/notes)\n"
    )
    return {
        "article": {
            "title": meta["title"],
            "published": True,
            "body_markdown": body,
            "tags": tags,
            "canonical_url": canonical,
            "description": meta["excerpt"][:200],
            "main_image": cover_url,
        }
    }


def publish(payload: dict, api_key: str, retry_on_rate_limit: bool = True) -> tuple:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API,
        data=data,
        method="POST",
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/vnd.forem.api-v1+json",
            "User-Agent": "rohitraj-tech-crosspost/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = json.loads(r.read().decode("utf-8"))
            return True, body
    except urllib.error.HTTPError as e:
        err_text = e.read().decode("utf-8", "ignore")
        if e.code == 429 and retry_on_rate_limit:
            print("  ⏳ rate-limited (429), waiting 90s + retry...")
            time.sleep(90)
            return publish(payload, api_key, retry_on_rate_limit=False)
        return False, {"status": e.code, "error": err_text}
    except Exception as e:
        return False, {"error": str(e)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True, help="Post slug (matches src/data/posts/<slug>.ts)")
    ap.add_argument("--dry-run", action="store_true", help="Print payload, no API call")
    ap.add_argument("--tags", help="Comma-separated tag override (max 4)")
    args = ap.parse_args()

    try:
        meta = read_post_meta(args.slug)
    except (FileNotFoundError, ValueError) as e:
        print(f"ERROR: {e}")
        sys.exit(1)

    if args.tags:
        tags = [t.strip().lower() for t in args.tags.split(",") if t.strip()][:4]
    else:
        tags = sanitize_tags(meta["keywords"])

    payload = build_payload(args.slug, meta, tags)

    if args.dry_run:
        print(json.dumps(payload, indent=2))
        print(f"\nDry-run done. Tags: {tags}")
        return

    api_key = os.environ.get("DEV_TO_API_KEY", "").strip()
    if not api_key:
        print("ERROR: DEV_TO_API_KEY not set.")
        print("Get key at: https://dev.to/settings/extensions")
        print("Then: export DEV_TO_API_KEY='your_key' (add to ~/.config/fish/config.fish for persistence)")
        sys.exit(1)

    print(f"--- Cross-posting to dev.to: {args.slug} ---")
    print(f"    title: {meta['title']}")
    print(f"    tags:  {tags}")
    ok, body = publish(payload, api_key)
    if ok:
        url = body.get("url", "(no url returned)")
        print(f"  ✓ {url}")
        print(f"  ✓ Backlink attribution: canonical_url → https://rohitraj.tech/en/notes/{args.slug}")
    else:
        print(f"  ✗ {body}")
        sys.exit(2)


if __name__ == "__main__":
    main()

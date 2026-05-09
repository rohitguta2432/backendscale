#!/usr/bin/env python3
# Cross-post a blog post to Hashnode via GraphQL API for dofollow backlink.
# Reads post metadata from src/data/posts/<slug>.ts and creates a Hashnode draft
# (or published post) with canonical URL pointing to rohitraj.tech.
#
# Usage:
#   export HASHNODE_API_KEY="..."
#   export HASHNODE_PUBLICATION_ID="..."
#   python3 scripts/hashnode-publish.py --slug spring-boot-mcp
#   python3 scripts/hashnode-publish.py --slug spring-boot-mcp --dry-run
#   python3 scripts/hashnode-publish.py --slug spring-boot-mcp --tags java,backend
#
# API key:        https://hashnode.com/settings/developer
# Publication ID: GraphQL `query { me { publications(first: 1) { edges { node { id } } } } }`
#                 or inspect URL of your blog dashboard.
# API docs:       https://apidocs.hashnode.com/

import os
import re
import sys
import json
import argparse
import urllib.request
import urllib.error
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO / "src" / "data" / "posts"
BASE_URL = "https://rohitraj.tech/en/notes"
COVER_BASE = "https://rohitraj.tech/images/notes"
API = "https://gql.hashnode.com/"


def read_post_meta(slug: str) -> dict:
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

    kw_match = re.search(r"keywords:\s*\[(.*?)\]", text, re.DOTALL)
    keywords = []
    if kw_match:
        keywords = re.findall(r"['\"]([^'\"]+)['\"]", kw_match.group(1))

    return {"title": title, "excerpt": excerpt, "keywords": keywords}


def slugify_tag(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s.lower())
    s = re.sub(r"\s+", "-", s.strip())
    return s[:50]


def derive_tags(keywords: list, max_tags: int = 5) -> list:
    seen = set()
    tags = []
    for kw in keywords:
        slug = slugify_tag(kw)
        if slug and slug not in seen and len(slug) >= 2:
            seen.add(slug)
            tags.append({"slug": slug, "name": kw})
            if len(tags) >= max_tags:
                break
    return tags or [{"slug": "webdev", "name": "WebDev"}]


def build_payload(slug: str, meta: dict, tags: list, publication_id: str) -> dict:
    canonical = f"{BASE_URL}/{slug}"
    cover_file = REPO / "public" / "images" / "notes" / f"{slug}-cover.jpg"
    cover = f"{COVER_BASE}/{slug}-cover.jpg" if cover_file.exists() else None
    body = (
        f"> Originally published on [rohitraj.tech]({canonical})\n\n"
        f"{meta['excerpt']}\n\n"
        f"---\n"
        f"**Read the full version with code samples and architecture details:** "
        f"[{meta['title']}]({canonical})\n\n"
        f"More engineering notes: [rohitraj.tech/en/notes](https://rohitraj.tech/en/notes)\n"
    )
    mutation = """
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post { id slug url }
      }
    }
    """
    input_obj = {
        "title": meta["title"],
        "subtitle": meta["excerpt"][:140],
        "publicationId": publication_id,
        "contentMarkdown": body,
        "tags": tags,
        "originalArticleURL": canonical,
    }
    if cover:
        input_obj["coverImageOptions"] = {"coverImageURL": cover}
    return {"query": mutation, "variables": {"input": input_obj}}


def publish(payload: dict, api_key: str) -> tuple:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API,
        data=data,
        method="POST",
        headers={
            "Authorization": api_key,
            "Content-Type": "application/json",
            "User-Agent": "rohitraj-tech-crosspost/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = json.loads(r.read().decode("utf-8"))
            if body.get("errors"):
                return False, body["errors"]
            return True, body["data"]["publishPost"]["post"]
    except urllib.error.HTTPError as e:
        return False, {"status": e.code, "error": e.read().decode("utf-8", "ignore")}
    except Exception as e:
        return False, {"error": str(e)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--tags", help="Comma-separated tag override")
    args = ap.parse_args()

    try:
        meta = read_post_meta(args.slug)
    except (FileNotFoundError, ValueError) as e:
        print(f"ERROR: {e}")
        sys.exit(1)

    if args.tags:
        tags = [{"slug": slugify_tag(t), "name": t.strip()} for t in args.tags.split(",") if t.strip()][:5]
    else:
        tags = derive_tags(meta["keywords"])

    api_key = os.environ.get("HASHNODE_API_KEY", "").strip()
    pub_id = os.environ.get("HASHNODE_PUBLICATION_ID", "").strip()

    if args.dry_run:
        payload = build_payload(args.slug, meta, tags, pub_id or "<PUB_ID>")
        print(json.dumps(payload, indent=2))
        print(f"\nDry-run done. Tags: {[t['slug'] for t in tags]}")
        return

    if not api_key or not pub_id:
        print("ERROR: HASHNODE_API_KEY and HASHNODE_PUBLICATION_ID required.")
        print("Key: https://hashnode.com/settings/developer")
        print("Pub ID: GraphQL { me { publications(first:1){ edges{ node{ id } } } } }")
        sys.exit(1)

    payload = build_payload(args.slug, meta, tags, pub_id)
    print(f"--- Cross-posting to Hashnode: {args.slug} ---")
    print(f"    title: {meta['title']}")
    print(f"    tags:  {[t['slug'] for t in tags]}")
    ok, body = publish(payload, api_key)
    if ok:
        print(f"  ✓ {body.get('url', '(no url)')}")
        print(f"  ✓ Canonical → https://rohitraj.tech/en/notes/{args.slug}")
    else:
        print(f"  ✗ {body}")
        sys.exit(2)


if __name__ == "__main__":
    main()

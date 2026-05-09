#!/usr/bin/env python3
# Post blog announcement to Bluesky via atproto API.
# Free, open protocol, dofollow on most viewers, indexed by Google.
#
# Usage:
#   export BLUESKY_HANDLE="rohitraj.bsky.social"
#   export BLUESKY_APP_PASSWORD="xxxx-xxxx-xxxx-xxxx"
#   python3 scripts/bluesky-post.py --slug spring-boot-mcp
#   python3 scripts/bluesky-post.py --slug spring-boot-mcp --dry-run
#
# App password: https://bsky.app/settings/app-passwords (NOT your main password)
# API docs: https://docs.bsky.app/docs/api/com-atproto-server-create-session

import os
import re
import sys
import json
import argparse
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO / "src" / "data" / "posts"
BASE_URL = "https://rohitraj.tech/en/notes"
PDS = "https://bsky.social"
MAX_CHARS = 300


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
    if not title:
        raise ValueError(f"Missing title in {path}")
    return {"title": title, "excerpt": excerpt or ""}


def build_text(slug: str, meta: dict) -> tuple:
    url = f"{BASE_URL}/{slug}"
    head = f"📝 {meta['title']}\n\n"
    excerpt = meta["excerpt"]
    suffix = f"\n\n{url}"
    avail = MAX_CHARS - len(head) - len(suffix) - 1
    if len(excerpt) > avail:
        excerpt = excerpt[: avail - 1].rsplit(" ", 1)[0] + "…"
    text = f"{head}{excerpt}{suffix}"
    url_start = text.rfind(url)
    facets = [{
        "index": {"byteStart": url_start, "byteEnd": url_start + len(url)},
        "features": [{"$type": "app.bsky.richtext.facet#link", "uri": url}],
    }]
    return text, facets


def http_post(url: str, payload: dict, headers: dict) -> tuple:
    data = json.dumps(payload).encode("utf-8")
    headers = {**headers, "Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, method="POST", headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return True, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return False, {"status": e.code, "error": e.read().decode("utf-8", "ignore")}
    except Exception as e:
        return False, {"error": str(e)}


def login(handle: str, app_password: str) -> tuple:
    return http_post(
        f"{PDS}/xrpc/com.atproto.server.createSession",
        {"identifier": handle, "password": app_password},
        {},
    )


def post_record(jwt: str, did: str, text: str, facets: list) -> tuple:
    record = {
        "$type": "app.bsky.feed.post",
        "text": text,
        "facets": facets,
        "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    return http_post(
        f"{PDS}/xrpc/com.atproto.repo.createRecord",
        {"repo": did, "collection": "app.bsky.feed.post", "record": record},
        {"Authorization": f"Bearer {jwt}"},
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    try:
        meta = read_post_meta(args.slug)
    except (FileNotFoundError, ValueError) as e:
        print(f"ERROR: {e}")
        sys.exit(1)

    text, facets = build_text(args.slug, meta)
    print(f"--- Bluesky post: {args.slug} ---")
    print(f"    chars: {len(text)}/{MAX_CHARS}")

    if args.dry_run:
        print("---")
        print(text)
        print("---")
        return

    handle = os.environ.get("BLUESKY_HANDLE", "").strip()
    pw = os.environ.get("BLUESKY_APP_PASSWORD", "").strip()
    if not handle or not pw:
        print("ERROR: BLUESKY_HANDLE and BLUESKY_APP_PASSWORD required.")
        print("App password: https://bsky.app/settings/app-passwords")
        sys.exit(1)

    ok, sess = login(handle, pw)
    if not ok:
        print(f"  ✗ login: {sess}")
        sys.exit(2)

    ok, rec = post_record(sess["accessJwt"], sess["did"], text, facets)
    if ok:
        rkey = rec["uri"].split("/")[-1]
        print(f"  ✓ https://bsky.app/profile/{handle}/post/{rkey}")
    else:
        print(f"  ✗ post: {rec}")
        sys.exit(2)


if __name__ == "__main__":
    main()

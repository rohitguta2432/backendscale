#!/usr/bin/env python3
# Submit blog post URL to archive.org Wayback Machine for permanent snapshot.
# No auth required. Adds DR ~93 backlink + preserves canonical version.
#
# Usage:
#   python3 scripts/wayback-save.py --slug spring-boot-mcp
#   python3 scripts/wayback-save.py --url https://rohitraj.tech/en/notes/foo
#
# Endpoint: https://web.archive.org/save/<url>
# Rate limit: ~15 saves/min unsigned. Optional S3 keys for higher rate.

import os
import sys
import argparse
import urllib.request
import urllib.error

BASE_URL = "https://rohitraj.tech/en/notes"
SAVE_URL = "https://web.archive.org/save"


def submit(target_url: str) -> tuple:
    save = f"{SAVE_URL}/{target_url}"
    headers = {"User-Agent": "rohitraj-tech-archiver/1.0"}

    s3_key = os.environ.get("WAYBACK_S3_KEY", "").strip()
    s3_secret = os.environ.get("WAYBACK_S3_SECRET", "").strip()
    if s3_key and s3_secret:
        headers["Authorization"] = f"LOW {s3_key}:{s3_secret}"

    req = urllib.request.Request(save, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            snapshot = r.headers.get("Content-Location") or r.headers.get("X-Cache-Key") or ""
            archived = f"https://web.archive.org{snapshot}" if snapshot.startswith("/web/") else save
            return True, archived
    except urllib.error.HTTPError as e:
        if e.code == 429:
            return False, "rate-limited (429) — retry later"
        return False, f"HTTP {e.code}: {e.reason}"
    except Exception as e:
        return False, str(e)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", help="Post slug (auto-builds rohitraj.tech URL)")
    ap.add_argument("--url", help="Full URL override")
    args = ap.parse_args()

    if not args.slug and not args.url:
        print("ERROR: --slug or --url required")
        sys.exit(1)

    target = args.url or f"{BASE_URL}/{args.slug}"
    print(f"--- Wayback save: {target} ---")
    ok, result = submit(target)
    if ok:
        print(f"  ✓ {result}")
    else:
        print(f"  ✗ {result}")
        sys.exit(2)


if __name__ == "__main__":
    main()

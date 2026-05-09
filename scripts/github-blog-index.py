#!/usr/bin/env python3
# Append blog entry to a public GitHub README index repo for dofollow backlink.
# GitHub READMEs render with dofollow links → DR ~100 backlink per post.
#
# Setup (one-time):
#   1. Create a public repo: github.com/rohitguta2432/blog-index
#   2. Init with a README.md containing marker line: <!-- BLOG_INDEX_START -->
#   3. Default GitHub user: rohitguta2432 (override via GITHUB_BLOG_INDEX_REPO)
#
# Usage:
#   python3 scripts/github-blog-index.py --slug spring-boot-mcp
#   python3 scripts/github-blog-index.py --slug foo --dry-run
#
# Requires: gh CLI authenticated (gh auth status).

import os
import re
import sys
import argparse
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO / "src" / "data" / "posts"
BASE_URL = "https://rohitraj.tech/en/notes"
MARKER = "<!-- BLOG_INDEX_START -->"


def read_post_meta(slug: str) -> dict:
    path = POSTS_DIR / f"{slug}.ts"
    if not path.exists():
        raise FileNotFoundError(f"Post file not found: {path}")
    text = path.read_text(encoding="utf-8")

    def grab(field):
        m = re.search(rf"{field}:\s*['\"](.+?)['\"]\s*,", text)
        return m.group(1) if m else None

    title = grab("title")
    excerpt = grab("excerpt") or ""
    if not title:
        raise ValueError(f"Missing title in {path}")
    return {"title": title, "excerpt": excerpt}


def run(cmd, cwd=None, check=True) -> tuple:
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if check and p.returncode != 0:
        return False, p.stderr.strip() or p.stdout.strip()
    return True, p.stdout.strip()


def append_entry(slug: str, meta: dict, repo: str, dry_run: bool) -> bool:
    url = f"{BASE_URL}/{slug}"
    date = datetime.utcnow().strftime("%Y-%m-%d")
    excerpt = meta["excerpt"][:140].rstrip(".") if meta["excerpt"] else ""
    entry = f"- **{date}** — [{meta['title']}]({url})"
    if excerpt:
        entry += f" — {excerpt}"

    if dry_run:
        print(f"--- Dry-run entry ---\n{entry}\n---")
        return True

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp) / "blog-index"
        ok, out = run(["gh", "repo", "clone", repo, str(tmp_path), "--", "--depth=1"])
        if not ok:
            print(f"  ✗ clone: {out}")
            return False

        readme = tmp_path / "README.md"
        if not readme.exists():
            print(f"  ✗ README.md not found in {repo}")
            return False

        content = readme.read_text(encoding="utf-8")
        if MARKER not in content:
            print(f"  ✗ marker '{MARKER}' not in README.md — add it after your intro")
            return False

        if url in content:
            print(f"  ⊙ already indexed: {url}")
            return True

        new_content = content.replace(MARKER, f"{MARKER}\n{entry}", 1)
        readme.write_text(new_content, encoding="utf-8")

        for cmd in (
            ["git", "add", "README.md"],
            ["git", "commit", "-m", f"add: {meta['title']}"],
            ["git", "push"],
        ):
            ok, out = run(cmd, cwd=tmp_path)
            if not ok:
                print(f"  ✗ {' '.join(cmd)}: {out}")
                return False
        print(f"  ✓ https://github.com/{repo} (entry added)")
        return True


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

    repo = os.environ.get("GITHUB_BLOG_INDEX_REPO", "rohitguta2432/blog-index").strip()
    if not args.dry_run and not repo:
        print("ERROR: repo unset")
        sys.exit(1)

    print(f"--- GitHub blog index: {args.slug} ---")
    if not append_entry(args.slug, meta, repo or "<UNSET>", args.dry_run):
        sys.exit(2)


if __name__ == "__main__":
    main()

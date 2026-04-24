#!/usr/bin/env bash
# Submit URLs to IndexNow (Bing + Yandex + ChatGPT-web-search) + Bing sitemap
# ping + print GSC URL Inspector deep-links for manual Google submission.
#
# Usage:
#   ./scripts/submit-seo.sh                  # submits default recently-updated URLs
#   ./scripts/submit-seo.sh url1 url2 url3   # submits provided URLs

set -euo pipefail

HOST="rohitraj.tech"
KEY="fa4a18743acca1eb87d790a528b762fb"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
SITEMAP_URL="https://${HOST}/sitemap.xml"

DEFAULT_URLS=(
  "https://${HOST}/en/about"
  "https://${HOST}/en/reliability/kafka-testing"
  "https://${HOST}/en/reliability/load-testing"
  "https://${HOST}/en/reliability/api-testing"
  "https://${HOST}/en/reliability/observability"
  "https://${HOST}/en/notes/ai-news-april-2026-what-founders-should-build"
)

if [ $# -gt 0 ]; then
  URLS=("$@")
else
  URLS=("${DEFAULT_URLS[@]}")
fi

echo "==> IndexNow submission"
echo "    host=${HOST}"
echo "    key=${KEY}"
echo "    submitting ${#URLS[@]} URL(s)"

URL_JSON=$(printf '"%s",' "${URLS[@]}" | sed 's/,$//')
PAYLOAD=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [${URL_JSON}]
}
EOF
)

echo "--- IndexNow → api.indexnow.org ---"
curl -s -o /tmp/indexnow.out -w "HTTP %{http_code}\n" \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "${PAYLOAD}"
cat /tmp/indexnow.out; echo

echo "--- IndexNow → Bing mirror ---"
curl -s -o /tmp/indexnow-bing.out -w "HTTP %{http_code}\n" \
  -X POST "https://www.bing.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "${PAYLOAD}"
cat /tmp/indexnow-bing.out; echo

echo "--- IndexNow → Yandex mirror ---"
curl -s -o /tmp/indexnow-yandex.out -w "HTTP %{http_code}\n" \
  -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "${PAYLOAD}" || true
cat /tmp/indexnow-yandex.out 2>/dev/null; echo

echo "==> Bing sitemap ping (Google deprecated this endpoint in 2023)"
curl -s -o /dev/null -w "Bing HTTP %{http_code}\n" \
  "https://www.bing.com/ping?sitemap=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "${SITEMAP_URL}")"

echo
echo "==> Google Search Console manual submission"
echo "    Google has no public API to request indexing for regular pages."
echo "    Click each link below and press \"Request Indexing\" in GSC:"
SC_PROPERTY=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "sc-domain:${HOST}")
for u in "${URLS[@]}"; do
  encoded=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "${u}")
  echo "    → https://search.google.com/search-console/inspect?resource_id=${SC_PROPERTY}&id=${encoded}"
done

echo
echo "==> Done. After pushing the IndexNow key file to prod, re-run this script."

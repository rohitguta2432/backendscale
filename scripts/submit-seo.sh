#!/usr/bin/env bash
# Submit URLs to IndexNow (Bing + Yandex + ChatGPT-web-search) + Google Indexing API
# (when service account configured) + Bing sitemap ping + GSC URL Inspector deep-links.
#
# Usage:
#   ./scripts/submit-seo.sh                  # submits default recently-updated URLs
#   ./scripts/submit-seo.sh url1 url2 url3   # submits provided URLs
#
# Google Indexing API (optional):
#   Set GOOGLE_INDEXING_KEY_FILE=~/.config/gsc/indexing-sa.json
#   Service account must be added as Owner in GSC property.
#   Officially scoped to JobPosting/BroadcastEvent but works for any URL.

set -euo pipefail

HOST="rohitraj.tech"
KEY="fa4a18743acca1eb87d790a528b762fb"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
SITEMAP_URL="https://${HOST}/sitemap.xml"
GOOGLE_INDEXING_KEY_FILE="${GOOGLE_INDEXING_KEY_FILE:-$HOME/.config/gsc/indexing-sa.json}"

DEFAULT_URLS=(
  "https://${HOST}/en"
  "https://${HOST}/en/notes"
  "https://${HOST}/en/services"
  "https://${HOST}/sitemap.xml"
)

# Always append homepage + notes index when explicit URLs are passed —
# refreshes the link graph + freshens listing page on every ship.
ALWAYS_INCLUDE=(
  "https://${HOST}/en"
  "https://${HOST}/en/notes"
)

if [ $# -gt 0 ]; then
  URLS=("$@")
  # De-dupe: only append ALWAYS_INCLUDE entries not already in $@
  for inc in "${ALWAYS_INCLUDE[@]}"; do
    skip=0
    for u in "${URLS[@]}"; do
      [ "$u" = "$inc" ] && skip=1 && break
    done
    [ $skip -eq 0 ] && URLS+=("$inc")
  done
else
  URLS=("${DEFAULT_URLS[@]}")
fi

echo "==> SEO submission pipeline"
echo "    host=${HOST}"
echo "    submitting ${#URLS[@]} URL(s)"

# ---------- IndexNow (Bing + Yandex + ChatGPT-web-search crawl) ----------
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

echo
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

# ---------- Google Indexing API (optional) ----------
echo
if [ -f "${GOOGLE_INDEXING_KEY_FILE}" ]; then
  echo "==> Google Indexing API (service account: ${GOOGLE_INDEXING_KEY_FILE})"
  TOKEN=$(python3 - "${GOOGLE_INDEXING_KEY_FILE}" <<'PY'
import json, sys, time, base64, hmac, hashlib, urllib.request, urllib.parse

key_file = sys.argv[1]
with open(key_file) as f:
    sa = json.load(f)

now = int(time.time())
header = base64.urlsafe_b64encode(json.dumps({"alg":"RS256","typ":"JWT"}).encode()).rstrip(b"=")
claim = base64.urlsafe_b64encode(json.dumps({
    "iss": sa["client_email"],
    "scope": "https://www.googleapis.com/auth/indexing",
    "aud": "https://oauth2.googleapis.com/token",
    "exp": now + 3600,
    "iat": now,
}).encode()).rstrip(b"=")

signing_input = header + b"." + claim

# Sign with private key (RSA-SHA256)
try:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding
    pk = serialization.load_pem_private_key(sa["private_key"].encode(), password=None)
    sig = pk.sign(signing_input, padding.PKCS1v15(), hashes.SHA256())
except ImportError:
    print("ERROR: pip install --user cryptography", file=sys.stderr)
    sys.exit(1)

jwt = signing_input + b"." + base64.urlsafe_b64encode(sig).rstrip(b"=")
data = urllib.parse.urlencode({
    "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
    "assertion": jwt.decode(),
}).encode()
req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
resp = urllib.request.urlopen(req, timeout=20)
print(json.loads(resp.read())["access_token"])
PY
)
  if [ -n "${TOKEN}" ]; then
    for u in "${URLS[@]}"; do
      # Skip sitemap URLs (Indexing API rejects them)
      if [[ "$u" == *"sitemap.xml"* ]]; then
        continue
      fi
      echo "    → ${u}"
      curl -s -o /tmp/gindex.out -w "      HTTP %{http_code}\n" \
        -X POST "https://indexing.googleapis.com/v3/urlNotifications:publish" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"url\":\"${u}\",\"type\":\"URL_UPDATED\"}"
      cat /tmp/gindex.out 2>/dev/null | head -3; echo
    done
  fi
else
  echo "==> Google Indexing API: SKIPPED (no key file at ${GOOGLE_INDEXING_KEY_FILE})"
  echo "    Setup: see docs/google-indexing-setup.md"
fi

# ---------- Bing sitemap ping ----------
echo
echo "==> Bing sitemap ping (Google deprecated this in 2023)"
curl -s -o /dev/null -w "Bing HTTP %{http_code}\n" \
  "https://www.bing.com/ping?sitemap=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "${SITEMAP_URL}")"

# ---------- GSC manual deep-links (when no service account) ----------
echo
if [ ! -f "${GOOGLE_INDEXING_KEY_FILE}" ]; then
  echo "==> Google Search Console manual submission (no service account configured)"
  echo "    Click each link below and press \"Request Indexing\":"
  SC_PROPERTY=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "sc-domain:${HOST}")
  for u in "${URLS[@]}"; do
    if [[ "$u" == *"sitemap.xml"* ]]; then
      continue
    fi
    encoded=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "${u}")
    echo "    → https://search.google.com/search-console/inspect?resource_id=${SC_PROPERTY}&id=${encoded}"
  done
fi

echo
echo "==> Done."

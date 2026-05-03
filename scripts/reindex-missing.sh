#!/usr/bin/env bash
# Audit all sitemap URLs for index status via GSC URL Inspection API,
# then submit non-indexed ones via Google Indexing API + IndexNow.
#
# Usage:
#   ./scripts/reindex-missing.sh              # full audit + submit
#   ./scripts/reindex-missing.sh --dry-run    # audit only, print, no submit
#   ./scripts/reindex-missing.sh --inspect-only  # alias for --dry-run
#
# Requires: ~/.config/gsc/indexing-sa.json (see docs/google-indexing-setup.md)

set -euo pipefail

HOST="rohitraj.tech"
SITE_URL="sc-domain:${HOST}"
SA_KEY="${GOOGLE_INDEXING_KEY_FILE:-$HOME/.config/gsc/indexing-sa.json}"
SITEMAP_URL="https://${HOST}/sitemap.xml"
DRY_RUN=0
QUOTA_LIMIT=180  # Stay under 200/day cap, leave headroom for daily-seo-content

if [[ "${1:-}" =~ ^(--dry-run|--inspect-only)$ ]]; then
  DRY_RUN=1
fi

if [ ! -f "${SA_KEY}" ]; then
  echo "ERROR: SA key not found at ${SA_KEY}"
  echo "Run docs/google-indexing-setup.md setup first."
  exit 1
fi

echo "==> Reindex audit pipeline"
echo "    site=${SITE_URL}"
echo "    dry_run=${DRY_RUN}"

# ---------- Step 1: Fetch all URLs from sitemap ----------
echo
echo "--- Fetching sitemap ---"
URLS=()
while IFS= read -r url; do
  URLS+=("$url")
done < <(curl -s "${SITEMAP_URL}" | grep -oP '<loc>\K[^<]+')
echo "    ${#URLS[@]} URL(s) in sitemap"

# ---------- Step 2: Get OAuth token (combined scopes) ----------
echo
echo "--- Authenticating service account ---"
TOKEN=$(python3 - "${SA_KEY}" <<'PY'
import json, sys, time, base64, urllib.request, urllib.parse
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

sa = json.load(open(sys.argv[1]))
now = int(time.time())
header = base64.urlsafe_b64encode(json.dumps({"alg":"RS256","typ":"JWT"}).encode()).rstrip(b"=")
claim = base64.urlsafe_b64encode(json.dumps({
    "iss": sa["client_email"],
    "scope": "https://www.googleapis.com/auth/indexing https://www.googleapis.com/auth/webmasters.readonly",
    "aud": "https://oauth2.googleapis.com/token",
    "exp": now+3600, "iat": now,
}).encode()).rstrip(b"=")
si = header + b"." + claim
pk = serialization.load_pem_private_key(sa["private_key"].encode(), password=None)
sig = pk.sign(si, padding.PKCS1v15(), hashes.SHA256())
jwt = si + b"." + base64.urlsafe_b64encode(sig).rstrip(b"=")
data = urllib.parse.urlencode({"grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer","assertion":jwt.decode()}).encode()
print(json.loads(urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data), timeout=20).read())["access_token"])
PY
)

if [ -z "${TOKEN}" ]; then
  echo "ERROR: Failed to obtain access token"
  exit 1
fi
echo "    OK"

# ---------- Step 3: URL Inspection for each URL ----------
echo
echo "--- Inspecting ${#URLS[@]} URLs (this can take a few minutes) ---"

INDEXED=()
NOT_INDEXED=()
ERRORS=()

INSPECT_PAYLOAD_TPL='{"inspectionUrl":"%s","siteUrl":"%s"}'

for u in "${URLS[@]}"; do
  payload=$(printf "${INSPECT_PAYLOAD_TPL}" "${u}" "${SITE_URL}")
  resp=$(curl -s -X POST "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "${payload}")
  verdict=$(echo "${resp}" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('inspectionResult',{}).get('indexStatusResult',{}).get('verdict','UNKNOWN'))" 2>/dev/null || echo "ERROR")
  coverage=$(echo "${resp}" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('inspectionResult',{}).get('indexStatusResult',{}).get('coverageState','-'))" 2>/dev/null || echo "-")

  if [ "${verdict}" = "PASS" ]; then
    INDEXED+=("${u}")
    printf "  [✓] %s\n" "${u}"
  elif [ "${verdict}" = "ERROR" ] || [ "${verdict}" = "UNKNOWN" ]; then
    ERRORS+=("${u}")
    printf "  [!] %s — API error\n" "${u}"
    echo "      ${resp}" | head -c 200; echo
  else
    NOT_INDEXED+=("${u}|${verdict}|${coverage}")
    printf "  [✗] %s — %s (%s)\n" "${u}" "${verdict}" "${coverage}"
  fi

  # Light throttle to avoid rate-limit
  sleep 0.3
done

# ---------- Step 4: Summary ----------
echo
echo "==> Audit summary"
echo "    Indexed:     ${#INDEXED[@]}"
echo "    Not indexed: ${#NOT_INDEXED[@]}"
echo "    Errors:      ${#ERRORS[@]}"
echo "    Total:       ${#URLS[@]}"

if [ "${#NOT_INDEXED[@]}" -eq 0 ]; then
  echo
  echo "==> Nothing to submit — all sitemap URLs already indexed."
  exit 0
fi

# ---------- Step 5: Submit non-indexed via Indexing API + IndexNow ----------
echo
echo "==> Non-indexed URLs:"
TO_SUBMIT=()
for entry in "${NOT_INDEXED[@]}"; do
  u="${entry%%|*}"
  rest="${entry#*|}"
  echo "    ${u}  [${rest}]"
  TO_SUBMIT+=("${u}")
done

# Cap to quota headroom
if [ "${#TO_SUBMIT[@]}" -gt "${QUOTA_LIMIT}" ]; then
  echo
  echo "    Capping submission at ${QUOTA_LIMIT} URLs (Indexing API daily quota = 200)"
  TO_SUBMIT=("${TO_SUBMIT[@]:0:${QUOTA_LIMIT}}")
fi

if [ "${DRY_RUN}" -eq 1 ]; then
  echo
  echo "==> Dry-run: skipping submission. ${#TO_SUBMIT[@]} URLs would have been submitted."
  exit 0
fi

# Hand off to submit-seo.sh which already handles IndexNow + Google Indexing API.
# DO NOT pipe through head — SIGPIPE will truncate submission mid-loop.
echo
echo "==> Submitting ${#TO_SUBMIT[@]} non-indexed URLs..."
"$(dirname "$0")/submit-seo.sh" "${TO_SUBMIT[@]}" 2>&1 | tee /tmp/reindex-submit.log | grep -E "HTTP|→ https|error|ok|WINNER" || true
echo
SUBMITTED_COUNT=$(grep -c "^    → https" /tmp/reindex-submit.log 2>/dev/null || echo 0)
echo "    Total URLs submitted to Google Indexing API: ${SUBMITTED_COUNT}"

echo
echo "==> Done."
echo "    Recheck index status in 24-72h via:"
echo "    ./scripts/reindex-missing.sh --dry-run"

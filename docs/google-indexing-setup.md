# Google Indexing API Setup (rohitraj.tech)

One-time setup to enable automatic Google indexing pings from `scripts/submit-seo.sh`. Without this, the script falls back to printing GSC URL Inspector deep-links for manual click-through.

## What this gives you

- POST URL → Google Indexing API → URL queued for crawl within minutes (vs hours/days for sitemap discovery).
- Officially scoped to `JobPosting` + `BroadcastEvent` schemas, but works in practice for any URL on a verified property. Industry-standard SEO trick — Google has not pushed back on this for blog posts as of 2026.
- Quota: 200 URLs/day free per service account. More than enough for a daily blog ship.

## Prerequisites

- Google Search Console property `sc-domain:rohitraj.tech` already verified (it is).
- A Google Cloud project (free tier is fine).

## Steps

### 1. Create a GCP project (or reuse one)

```bash
# Web: https://console.cloud.google.com/projectcreate
# OR via gcloud CLI:
gcloud projects create rohitraj-seo --name="rohitraj.tech SEO"
gcloud config set project rohitraj-seo
```

### 2. Enable Indexing API

```bash
# Web: https://console.cloud.google.com/apis/library/indexing.googleapis.com
# OR:
gcloud services enable indexing.googleapis.com
```

### 3. Create service account

```bash
# Web: https://console.cloud.google.com/iam-admin/serviceaccounts/create
# Name: indexing-bot
# Role: leave empty (Indexing API needs no project IAM, only GSC)
# OR:
gcloud iam service-accounts create indexing-bot \
  --display-name="Indexing API bot"
```

Note the service account email — looks like:
`indexing-bot@rohitraj-seo.iam.gserviceaccount.com`

### 4. Download JSON key

```bash
mkdir -p ~/.config/gsc
gcloud iam service-accounts keys create ~/.config/gsc/indexing-sa.json \
  --iam-account=indexing-bot@rohitraj-seo.iam.gserviceaccount.com
chmod 600 ~/.config/gsc/indexing-sa.json
```

### 5. Add service account as Owner in Search Console

This is the step most people miss. The service account needs to be a verified **Owner** (not just User) of the GSC property.

1. Open https://search.google.com/search-console/users
2. Select property `sc-domain:rohitraj.tech`
3. Click "Add user"
4. Email: paste the service account email from step 3
5. Permission: **Owner**
6. Save

### 6. Install Python dependency (one-time)

```bash
pip install --user cryptography
```

### 7. Test

```bash
cd /home/t0266li/Documents/nexusai
./scripts/submit-seo.sh "https://rohitraj.tech/en/notes/bolt-new-vs-hire-developer-2026"
```

Expected output line:
```
==> Google Indexing API (service account: /home/t0266li/.config/gsc/indexing-sa.json)
    → https://rohitraj.tech/en/notes/bolt-new-vs-hire-developer-2026
      HTTP 200
{
  "urlNotificationMetadata": { ... }
}
```

HTTP 200 = queued. Google typically crawls within 1 hour.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `403 Permission denied` | Service account not Owner in GSC | Re-add as Owner (step 5) |
| `403 Indexing API has not been used` | API not enabled | `gcloud services enable indexing.googleapis.com` |
| `401 Invalid JWT` | System clock drift > 5 min | Run `sudo timedatectl set-ntp true` |
| `429 Quota exceeded` | > 200 URLs/day | Wait 24h or use additional service account |
| `400 Failed precondition` | URL not on a verified property | Verify GSC property covers the URL |

## Alternative key locations

Override default location:
```bash
export GOOGLE_INDEXING_KEY_FILE=/path/to/sa.json
./scripts/submit-seo.sh "https://..."
```

## Security

- Never commit `~/.config/gsc/indexing-sa.json` — already outside the repo.
- The key only grants Indexing API access for properties where the SA is added as Owner. It cannot read GSC data or modify other Google services.
- Rotate every 90 days: `gcloud iam service-accounts keys create` again, delete old key.

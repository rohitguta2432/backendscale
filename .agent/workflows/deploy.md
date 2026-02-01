---
description: How to deploy rohitraj.tech to Vercel
---

# Deploying to Vercel

## Production Deployment

// turbo
```bash
cd /home/t0266li/Documents/nexusai && npx vercel --prod
```

This deploys to: **https://rohitraj.tech**

## Preview Deployment (for testing)

// turbo
```bash
cd /home/t0266li/Documents/nexusai && npx vercel
```

Creates a preview URL without affecting production.

## Pre-Deployment Checklist

1. **Build locally first:**
   ```bash
   npm run build
   ```

2. **Commit changes:**
   ```bash
   git add -A && git commit -m "your message"
   git push origin main
   ```

3. **Deploy:**
   ```bash
   npx vercel --prod
   ```

## Vercel Project Details

- **Project:** nexusai
- **Domain:** rohitraj.tech
- **GitHub Repo:** rohitguta2432/backendscale

## Verification After Deploy

- Visit https://rohitraj.tech/en (English)
- Visit https://rohitraj.tech/hi (Hindi)
- Visit https://rohitraj.tech/fr (French)
- Visit https://rohitraj.tech/de (German)

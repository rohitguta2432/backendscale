import type { BlogPost } from '@/types/blog';

export const buildOnDeviceAiScamDetectorAndroidGemma: BlogPost = {
  slug: 'build-on-device-ai-scam-detector-android-gemma',
  title: 'Building an On-Device AI Scam Detector for Android — Gemma 4 + LiteRT + Regex Fallback',
  date: '2026-04-12',
  excerpt: 'How I built ScamRakshak — a fully offline Android app that detects scams using a 3-tier AI inference engine with Gemma 4 on-device LLM, LiteRT classification, and regex fallback. Zero internet, zero data collection.',
  readingTime: '11 min read',
  keywords: ['on device ai android', 'gemma on device llm', 'scam detection app india', 'litert android ml', 'offline ai android app 2026'],
  relatedProject: 'scamrakshak',
  sections: [
    {
      heading: 'India\'s ₹1,750 Crore Scam Problem',
      content: `India loses over ₹1,750 crore annually to digital scams. WhatsApp forwards promising "KYC update or account blocked." SMS messages with "you've won ₹5,00,000, click here." Fake UPI payment requests from "Amazon refund department."

The victims aren't just elderly or non-technical users. Scammers are sophisticated — they use correct bank names, realistic formatting, and urgency tactics that catch even tech-savvy people off guard.

Existing solutions fail for three reasons:

1. **They need internet** — Cloud-based scam checkers don't work when the user is offline or has limited data
2. **They collect data** — Uploading suspicious messages to a server means sharing personal financial information
3. **They're English-only** — 500M+ Indians communicate primarily in Hindi and Hinglish

ScamRakshak flips all three: fully offline, zero data collection, Hindi-first. The app physically cannot send data anywhere — it has **zero network permissions** in the Android manifest.`
    },
    {
      heading: 'The 3-Tier AI Inference Architecture',
      content: `The biggest design challenge: how do you run scam detection on a ₹8,000 Android phone with no internet?

You can't assume the user has a flagship phone. You can't assume they have a recent Android version. You can't assume Google Play Services are up to date. You need a system that degrades gracefully.

**Tier 1: ML Kit GenAI with Gemma 4 (Best quality)**

Google's ML Kit GenAI API runs Gemma 4 — a small but capable LLM — entirely on-device via Google AICore. It understands context, can analyze message intent, and generates bilingual explanations.

When available, the prompt is: "Analyze this message for scam indicators. Return a risk score (0-100), the scam type if detected, and explain why in both Hindi and English."

**Tier 2: LiteRT Classification (Fast fallback)**

LiteRT (the successor to TensorFlow Lite) runs a lightweight scam classification model. No LLM, no text generation — just a binary classifier with confidence score. Faster than Tier 1, works on older devices, but can't explain WHY something is a scam.

**Tier 3: Rule-Based Regex Engine (Universal fallback)**

Pattern matching against known scam signatures:

- UPI ID format validation
- Known scam phone number patterns
- Urgency keyword detection ("immediate", "account blocked", "last chance")
- URL shortener detection (bit.ly, tinyurl in financial messages)
- Lottery/prize claim patterns

This tier runs on literally any Android device. No ML runtime needed. No model download. Just regex patterns against a local database of scam signatures.

**Fallback chain:** The app checks if Tier 1 is available (requires AICore). If not, falls to Tier 2 (requires LiteRT runtime). If not, uses Tier 3 (always available). The user sees a risk score regardless of which tier processes the message.`
    },
    {
      heading: 'Hindi-First Bilingual Analysis',
      content: `Most scam messages in India arrive in Hindi, Hinglish (Hindi written in English script), or a mix of Hindi and English. A scam detector that only understands English misses the majority of threats.

**Tier 1 (Gemma 4) handles this natively** — the model understands Hindi, Hinglish, and code-switched text. The output is bilingual:

Example analysis of "Aapka SBI account block ho jayega. Turant ye link click karein":

**Risk Score: 92/100 — High Risk**

Hindi: "Yeh message scam hai. Koi bhi bank link click karne ko nahi kahegi. Apne bank branch mein call karein."

English: "This message is a scam. No bank asks you to click a link. Call your bank branch directly."

**Tier 3 regex also supports Hindi patterns** — keyword lists include both Devanagari script and transliterated Hindi. "तुरंत" (immediately) and "turant" both trigger urgency detection.

This bilingual approach is critical for the target audience. A Hindi-speaking user from Tier 2/3 India needs the explanation in their language. An English-speaking user needs it in English. Both get both.`
    },
    {
      heading: 'Input Modes: Messages, Screenshots, URLs, UPI IDs',
      content: `Scams arrive through multiple channels. ScamRakshak handles all of them:

**1. Text Messages (Primary)**
User pastes a suspicious SMS or WhatsApp message. The AI analyzes the text, detects scam patterns, and returns a risk score with explanation.

**2. Screenshots (CameraX + OCR)**
User takes a screenshot of a suspicious WhatsApp forward or social media post. CameraX captures the image, ML Kit Text Recognition extracts the text, and the scam analysis runs on the extracted text.

Why screenshots? Many Indian users receive scams as forwarded images — text embedded in images to bypass spam filters. OCR handles this.

**3. URL Analysis**
User pastes a suspicious URL. The app checks:
- Is it a URL shortener masking the real destination?
- Does the domain mimic a legitimate brand? (e.g., "sbi-secure-update.com")
- Does it match known phishing domain patterns?

All checks run locally against a pattern database. No HTTP request is made to the URL — the app never connects to potentially malicious sites.

**4. UPI ID Verification**
User enters a UPI ID (e.g., "refund.amazon@paytm"). The app checks:
- Format validity
- Known scam UPI ID patterns
- Suspicious naming patterns ("refund", "cashback", "lottery" in UPI handles)

UPI scams are the fastest-growing fraud vector in India. A dedicated input mode for UPI IDs catches scams that text analysis might miss.`
    },
    {
      heading: 'Privacy Architecture: Zero Network Permissions',
      content: `This isn't just a feature — it's an architectural constraint enforced at the Android manifest level.

\`\`\`xml
<!-- AndroidManifest.xml -->
<!-- No INTERNET permission. The app cannot make any network request. -->
<!-- No READ_CONTACTS. No ACCESS_FINE_LOCATION. No READ_SMS (user pastes manually). -->
<uses-permission android:name="android.permission.CAMERA" />  <!-- For screenshot OCR only -->
\`\`\`

The app requests exactly one permission: CAMERA (for screenshot capture). No internet. No contacts. No SMS reading. No location.

**Why this matters:**
- Users can verify by checking App Info → Permissions. Seeing "No permissions" builds immediate trust.
- Even if a malicious update tried to exfiltrate data, it physically can't — there's no network permission.
- This passes any security audit instantly. No data flows to audit because there are none.

**Room database** stores:
- Scam pattern database (bundled in APK, updated via Play Store releases)
- Scan history (for the user's reference only)
- No personal data is stored. Messages are analyzed and discarded unless the user explicitly saves the scan result.`
    },
    {
      heading: 'Tech Stack & What This Proves',
      content: `| Layer | Technology | Why |
|-------|-----------|-----|
| UI | Jetpack Compose + Material 3 | Modern declarative UI, dark mode, accessibility |
| AI Tier 1 | ML Kit GenAI (Gemma 4) | On-device LLM, bilingual understanding |
| AI Tier 2 | LiteRT | Lightweight classification, broad device support |
| AI Tier 3 | Regex engine | Universal fallback, zero dependencies |
| OCR | ML Kit Text Recognition | Extract text from screenshot images |
| Camera | CameraX | Modern camera API for screenshot capture |
| Database | Room | Local scan history, scam pattern storage |
| DI | Hilt | Standard Android dependency injection |

**What ScamRakshak demonstrates:**

1. **On-device AI is production-ready.** Gemma 4 via ML Kit GenAI runs well on mid-range phones. You don't need cloud APIs for NLP tasks.

2. **Graceful degradation is non-negotiable for India.** Your app must work on a ₹8,000 phone running Android 8. The 3-tier fallback guarantees universal coverage.

3. **Privacy-by-architecture beats privacy-by-policy.** "We don't collect data" is a promise. "We have no network permission" is a guarantee.

4. **Hindi-first isn't a translation — it's a design philosophy.** Building for 500M Hindi speakers means the primary UX must be Hindi, not English with a translation toggle.

5. **Single-purpose apps can be technically deep.** ScamRakshak does one thing — detect scams — but the engineering behind 3-tier inference, bilingual output, multi-modal input, and zero-network architecture is substantial.`
    }
  ],
  cta: {
    text: 'Building an on-device AI app for Android? I architect and ship these.',
    href: '/contact'
  }
};

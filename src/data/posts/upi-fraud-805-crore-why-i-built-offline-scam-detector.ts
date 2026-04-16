import type { BlogPost } from '@/types/blog';

export const upiFraud805CroreWhyIBuiltOfflineScamDetector: BlogPost = {
  slug: 'upi-fraud-805-crore-why-i-built-offline-scam-detector',
  title: '₹805 Crore Lost to UPI Fraud This Year. I Built an Offline Scam Detector That Needs Zero Internet.',
  date: '2026-04-16',
  excerpt: '1 in 5 Indian families have been hit by UPI fraud. 51% never report it. Cloud-based scam checkers need internet — exactly what victims in Tier 2/3 India don\'t have. Here\'s why I built ScamRakshak with zero network permissions.',
  readingTime: '9 min read',
  keywords: ['UPI fraud India 2026', 'scam detector app India', 'digital payment fraud protection', 'offline scam checker android', 'WhatsApp scam detection app'],
  relatedProject: 'scamrakshak',
  sections: [
    {
      heading: 'The Numbers Are Staggering',
      content: `I built ScamRakshak, an offline Android scam detector with zero network permissions that uses on-device AI (Gemma 4 LLM, LiteRT classifier, and regex fallback) to analyze suspicious UPI messages, URLs, and screenshots in Hindi and English — because India lost 805 crore to UPI fraud this year and every existing solution requires internet that 40% of vulnerable users lack.

Here are the numbers:

- **₹805 crore** lost to UPI fraud in FY26 so far (April-November 2025). That's ₹3.3 crore every single day.
- **10.64 lakh incidents** reported — and that's just the official count.
- **1 in 5 families** surveyed have experienced UPI fraud in the last 3 years.
- **51% of victims never reported it.** The real numbers are likely 2x what we see.
- Since FY23, cumulative losses have crossed **₹2,145 crore** across 2.7 million reported cases.

The fastest-growing fraud vectors in 2026: QR code scams, screen-sharing attacks, SIM swap fraud, and Google Pay "collect" request manipulation.

And here's the cruel irony: the people most vulnerable to these scams — elderly parents, first-time smartphone users, workers in Tier 2/3 cities — are the ones with the worst internet connectivity. A cloud-based scam checker fails exactly where it's needed most.

That's why I built ScamRakshak. An Android app that detects scams using on-device AI. Zero internet required. Zero data collection. Works on a ₹8,000 phone.`
    },
    {
      heading: 'Why Don\'t Existing Scam Detection Solutions Work?',
      content: `There are scam detection tools out there. Here's why none of them solve the actual problem:

**Truecaller / Spam call blockers**
Great for identifying spam callers. Useless for WhatsApp forwards, SMS scam messages, fake UPI collect requests, and screenshot-based scams. Also requires internet to check their database.

**Bank fraud alerts**
Reactive, not proactive. By the time your bank alerts you, the money is already gone. The window between a UPI scam and the money transfer is often under 30 seconds.

**Government helpline (1930)**
Works after the fact. You call after you've been scammed. There's no tool that helps you BEFORE you click the link or approve the UPI request.

**Online scam checkers**
Websites where you paste a URL or message. Problems: need internet, need a browser, and most Indians won't leave WhatsApp to open a browser to check a message. The friction is too high.

**What's actually needed:**

1. Works BEFORE the scam succeeds (proactive, not reactive)
2. Works WITHOUT internet (offline-first)
3. Works IN Hindi (not English-first with translation)
4. Works ON the user's phone (no browser, no website)
5. Collects ZERO data (trust through architecture, not policy)

ScamRakshak checks all five.`
    },
    {
      heading: 'How Does ScamRakshak Actually Detect Scams?',
      content: `The user experience is deliberately simple. My target user is a 55-year-old parent in Lucknow who just received a suspicious WhatsApp forward. They need to know in 5 seconds if it's a scam.

**Flow 1: Paste a message**

1. Open ScamRakshak
2. Tap "Check Message"
3. Paste the suspicious text
4. See result: Risk score (0-100) + explanation in Hindi and English

**Flow 2: Check a screenshot**

1. Receive a suspicious WhatsApp forward image
2. Open ScamRakshak → tap "Scan Screenshot"
3. Camera captures or gallery selects the image
4. OCR extracts text → AI analyzes → risk score shown

**Flow 3: Check a UPI ID**

1. Someone sends "refund.amazon@paytm" and asks for money
2. Open ScamRakshak → tap "Check UPI"
3. Enter the UPI ID
4. App checks format, naming patterns, and known scam indicators

**Flow 4: Check a URL**

1. SMS says "Update your KYC: http://sbi-update.xyz"
2. Open ScamRakshak → tap "Check Link"
3. Paste URL
4. App checks domain patterns, shortener usage, brand mimicry — all without visiting the URL

No account creation. No onboarding. No tutorial. Open → paste → know.`
    },
    {
      heading: 'The AI Behind "Zero Internet"',
      content: `Running scam detection offline means the AI must live on the device. Here's the 3-tier engine:

**Tier 1: Gemma 4 via ML Kit GenAI**

Google's on-device LLM understands context. It doesn't just pattern-match — it reasons about WHY a message is suspicious.

Input: "Dear customer, your SBI account will be blocked in 24 hours. Click here to verify KYC immediately."

Tier 1 output: "Risk 94/100. This is a phishing scam. Banks never ask for KYC verification via SMS links. The urgency ('24 hours', 'immediately') is a classic pressure tactic. Do NOT click the link. Call SBI directly at 1800-11-2211."

This level of explanation is only possible with an LLM. Available on ~40% of 2026 Android devices.

**Tier 2: LiteRT Binary Classifier**

A lightweight model trained on scam/not-scam message pairs. Returns a confidence score but no explanation. "Risk 87/100 — likely scam" without the detailed breakdown.

Available on ~70% of devices. 15MB model bundled in APK.

**Tier 3: Regex Pattern Matching**

Known scam signatures:
- Urgency words: "immediately", "turant", "तुरंत", "within 24 hours"
- Financial bait: "won ₹5,00,000", "cashback credited", "refund pending"
- Action pressure: "click here", "call now", "share OTP"
- URL red flags: shortened URLs in financial messages, domains mimicking banks

Available on 100% of Android devices. Zero runtime dependencies.

The user doesn't know or care which tier analyzed their message. They see a risk score and an explanation. The engineering complexity is invisible.`
    },
    {
      heading: 'What "Zero Network Permissions" Actually Means',
      content: `I keep emphasizing this because it's the entire trust model. Let me be precise about what it means:

\`\`\`xml
<!-- AndroidManifest.xml -->
<!-- No android.permission.INTERNET -->
<!-- No android.permission.ACCESS_NETWORK_STATE -->
<!-- The ONLY permission: -->
<uses-permission android:name="android.permission.CAMERA" />
\`\`\`

**What this prevents:**
- The app cannot make HTTP requests to any server
- The app cannot connect to any WebSocket
- The app cannot send data via any protocol
- The app cannot check if internet is available
- Firebase Analytics, Crashlytics, Remote Config — none of these work without INTERNET permission

**What this enables:**
- Users can verify by going to Settings → Apps → ScamRakshak → Permissions → seeing "No permissions" (except camera)
- Security audits pass instantly — there are zero data flows to audit
- No privacy policy complexity — you can't violate privacy if you can't transmit data
- No GDPR/DPDP compliance overhead — no data processing agreement needed

**The trade-off:** No analytics means I can't track DAU/MAU. No crash reports mean I test exhaustively before release. No A/B testing means I ship my best judgment.

Worth it. The target audience — scam-vulnerable Indians — need to trust this app with their most sensitive data (bank messages, UPI IDs). "Zero network permissions" is the strongest trust signal possible.`
    },
    {
      heading: 'The ₹805 Crore Opportunity',
      content: `This isn't just a technical project. It's a market insight.

**The problem:** ₹805 crore lost to UPI fraud this year. 1 in 5 families affected. 51% don't report. Government helplines are reactive. Banks alert after the fact. No proactive, offline, Hindi-first tool exists.

**The market:** 500M+ UPI users in India. 800M smartphones. The addressable market is essentially every smartphone user in the country.

**The distribution:** WhatsApp forwards. A scam victim uses ScamRakshak, catches a scam, and forwards the app link to family WhatsApp groups. "Mere papa ko ye app install karwa do" (Install this app for my parents). Organic, trust-based distribution.

**The monetization path:** Free forever for individual users. Enterprise API (with internet permission, separate product) for:
- Banks integrating scam detection into their apps
- UPI providers adding pre-transaction screening
- Telecom companies offering scam protection as a value-add

**What I'm building is the trust layer.** The free app proves the technology works. The enterprise product monetizes it.

| Metric | Value |
|--------|-------|
| India UPI fraud FY26 (Apr-Nov) | ₹805 crore |
| Reported incidents | 10.64 lakh |
| Unreported (estimated 2x) | ~21 lakh |
| UPI users in India | 500M+ |
| Hindi-speaking smartphone users | 500M+ |
| Competing offline Hindi scam detectors | 0 |

The best time to build digital safety infrastructure for India was 5 years ago. The second best time is now.

**Why the timing is right:** India crossed 500 million UPI users in 2025, and digital payment adoption in Tier 2/3 cities is growing at 35% year-over-year — far outpacing digital literacy. The gap between payment adoption and scam awareness is widening. Every month that gap exists, fraudsters extract crores from the most vulnerable users. A proactive, offline, Hindi-first scam detector fills a gap that no bank, no government helpline, and no existing app addresses.`
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: How accurate is ScamRakshak compared to cloud-based scam detection tools?**\n\nFor the specific domain of Indian financial scams, ScamRakshak's 3-tier engine achieves comparable accuracy to cloud tools. Tier 1 (Gemma 4) provides contextual reasoning about why a message is suspicious. Tier 2 (LiteRT) delivers reliable binary classification. Tier 3 (regex) catches known scam patterns with near-100% precision. The accuracy trade-off exists mainly in Tier 3 for novel scam types, which is mitigated by regular pattern database updates through Play Store releases.\n\n**Q: Can ScamRakshak detect scams in languages other than Hindi and English?**\n\nCurrently, the app is optimized for Hindi, Hinglish (Hindi in English script), and English — covering over 800 million Indian smartphone users. Gemma 4 has some capability with other Indian languages like Tamil, Telugu, and Bengali, but the regex patterns and LiteRT training data are focused on Hindi and English scam messages. Regional language support is on the roadmap and would primarily require expanding the Tier 3 keyword database and Tier 2 training data.\n\n**Q: Why not read SMS messages automatically instead of requiring manual paste?**\n\nDeliberate design choice. READ_SMS permission would give the app access to all messages — bank OTPs, personal conversations, everything. That contradicts the zero-data-collection promise. Manual paste means the user controls exactly what the app analyzes. It also avoids the complexity of background SMS monitoring, battery drain, and the trust concern of an app silently reading all messages.\n\n**Q: How does the screenshot OCR feature handle low-quality images?**\n\nML Kit Text Recognition handles moderate image quality well — rotated text, uneven lighting, and partial screenshots. For very low-quality images where OCR extraction is unreliable, the app displays the extracted text and lets the user correct it before analysis. The scam analysis then runs on the corrected text. This human-in-the-loop step ensures accuracy without requiring perfect image capture.\n\n**Q: What prevents scammers from adapting their messages to bypass ScamRakshak's detection?**\n\nThe 3-tier architecture provides defense in depth. If scammers change keywords to bypass Tier 3 regex, Tier 2's ML classifier still detects structural patterns. If they restructure messages to bypass Tier 2, Tier 1's LLM understands semantic intent — it recognizes urgency tactics and financial pressure regardless of specific wording. Pattern database updates ship with each Play Store release, and the LLM tier is inherently adaptive to novel phrasing.`
    }
  ],
  cta: {
    text: 'Building a privacy-first mobile product for the Indian market? I ship these.',
    href: '/contact'
  }
};

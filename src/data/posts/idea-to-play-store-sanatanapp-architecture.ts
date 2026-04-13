import type { BlogPost } from '@/types/blog';

export const ideaToPlayStoreSanatanappArchitecture: BlogPost = {
  slug: 'idea-to-play-store-sanatanapp-architecture',
  title: 'From Idea to Play Store: Shipping SanatanApp in 4 Weeks',
  date: '2026-04-05',
  excerpt: 'The full story of building and shipping a React Native app to Google Play — from problem discovery to architecture decisions to the actual Play Store submission process.',
  readingTime: '8 min read',
  keywords: ['react native play store', 'ship mobile app fast', 'expo eas build', 'app architecture decisions', 'indie app development'],
  relatedProject: 'sanatanapp',
  sections: [
    {
      heading: 'Week 1: Problem Discovery & Design',
      content: `I started with a personal frustration: 5 apps on my phone for Hindu devotion — Chalisa, Gita, Aarti, Ramayan, Mahabharat. Each averaging 50MB, each with interstitial ads during prayers, each solving one slice of the problem.

Before writing any code, I did three things:

1. **Installed every competitor** — Sri Mandir (85MB, feature-heavy), Dharmayana (Panchang-focused), various Chalisa apps (ad-heavy). Mapped their strengths and gaps.

2. **Defined the constraint** — One app, under 20MB, offline text, streamed audio, 5 languages, zero ads during reading/listening. No backend, no accounts.

3. **Designed 5 screens** — Home, Library, Verse Reader, Audio Player, Settings. Used Figma with a dark theme and saffron accent (#E8732A) for Devanagari text — because that's how these verses feel: warm against dark.

The design spec took 3 days. In hindsight, this was the most valuable time spent — every engineering decision flowed from these constraints.`
    },
    {
      heading: 'Week 2: Core Architecture',
      content: `**Day 1-2: Expo scaffold + navigation**

\`\`\`bash
npx create-expo-app@latest SanatanApp --template blank-typescript
npx expo install expo-av expo-sqlite expo-font @react-navigation/native @react-navigation/bottom-tabs
\`\`\`

Bottom tabs with 4 screens. React Navigation over Expo Router — I knew the API better and didn't want to learn new patterns while shipping fast.

**Day 3-4: Content pipeline**

Sourced Hanuman Chalisa text from public domain, structured as JSON with sanskrit/hindi/english fields per verse. Same for Bhagavad Gita Chapter 1 and Om Jai Jagdish Aarti. Total: 3 content files, ~50KB.

The architecture decision that saved the most time: **content as data, not code**. Each scripture is a JSON file with a predictable schema. The Verse Reader component doesn't know or care whether it's rendering Chalisa or Gita — it just iterates over a verses array.

**Day 5: i18n setup**

\`react-i18next\` for UI strings (80 keys), inline translations for verse content. This split was critical — trying to run 3,500 Gita verse translations through i18next would have been a disaster.`
    },
    {
      heading: 'Week 3: Features & Polish',
      content: `**Audio streaming** — expo-av with global AudioContext. Background playback enabled. MiniPlayer component pinned above tab bar. Progress saved to SQLite every 5 seconds.

**Offline storage** — expo-sqlite for favorites, reading progress, and sadhana streaks. Three tables, ~30 lines of SQL. No ORM, no abstraction layer — raw SQL is fine for 3 tables.

**Daily sadhana tracker** — Checklist component with streak counter. Stores completed tasks as JSON in SQLite keyed by date. Streak calculation: count consecutive dates backward from today.

**AdMob integration** — Banner ads on Home and Library screens only. The hard rule: **zero ads during verse reading or audio playback**. This is a devotional app — interrupting prayer with ads is a UX crime. I'd rather make less money.

The polish phase was mostly typography. Getting Devanagari text to render beautifully at the right size, with the right line height, in saffron (#E8732A) against a dark background (#0D0D0D) — this took more iterations than any feature.`
    },
    {
      heading: 'Week 4: Build & Play Store Submission',
      content: `**EAS Build** simplified the entire build pipeline:

\`\`\`bash
# Generate APK for testing
eas build --platform android --profile preview

# Generate AAB for Play Store
eas build --platform android --profile production
\`\`\`

The production build took ~8 minutes on EAS servers. Output: a signed AAB file ready for Play Store upload.

**Play Store submission checklist:**

1. **Developer account** — $25 one-time fee, approved in 48 hours
2. **App listing** — Title, description, screenshots (4 required), feature graphic (1024×500)
3. **Content rating** — IARC questionnaire, rated "Everyone"
4. **Privacy policy** — Required even for apps with no data collection. Hosted on GitHub Pages.
5. **AAB upload** — Upload the signed bundle, select countries, set pricing (free)
6. **Review** — Google review took 3 days for the first submission

**Gotchas I hit:**
- Play Store requires **minimum 4 screenshots** — I initially had 2
- The **feature graphic** (banner image) has strict dimensions — 1024×500, no transparency
- **Privacy policy URL** must be HTTPS and publicly accessible
- First review is slower (~3 days). Updates review in ~24 hours after that.`
    },
    {
      heading: 'Architecture Decisions Summary',
      content: `| Decision | Choice | Why |
|----------|--------|-----|
| Framework | React Native + Expo | Managed workflow, EAS build, no native config |
| Content storage | Bundled JSON | Offline-first, zero latency, trivially simple |
| Audio | expo-av streaming | No native modules needed, background playback |
| Local DB | expo-sqlite | Bookmarks, progress, streaks — 3 tables |
| i18n | react-i18next + inline | UI strings via i18n, content translations inline |
| Navigation | React Navigation | Known API, bottom tabs + stack |
| Ads | AdMob banners | Home/Library only, never during devotion |
| Backend | None | $0/month, privacy-first, no auth needed |
| Audio hosting | Archive.org | Free, public domain, reliable |

**Total monthly cost: $0.** The only expense was the $25 Google Play developer fee.

**What this project demonstrates:**
- Full mobile app from idea to Play Store
- Offline-first architecture with bundled content
- Multi-language support (5 languages) with practical i18n strategy
- Audio streaming with background playback and progress persistence
- SQLite for local state management
- Play Store submission and review process

The app is live: [SanatanApp on Google Play](https://play.google.com/store/apps/details?id=com.sanatandevotional.app).`
    }
  ],
  cta: {
    text: 'Need a mobile app shipped fast? I build end-to-end.',
    href: '/contact'
  }
};

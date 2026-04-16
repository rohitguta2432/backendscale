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
      content: `To ship a React Native app from idea to Google Play Store in 4 weeks, use Expo managed workflow with EAS Build for zero native configuration, bundle text content as JSON files for offline-first delivery, stream audio from public domain sources via expo-av, and store local state in expo-sqlite. This approach produces a production app under 15MB with $0/month running costs and a $25 one-time Play Store developer fee.

I started with a personal frustration: 5 apps on my phone for Hindu devotion — Chalisa, Gita, Aarti, Ramayan, Mahabharat. Each averaging 50MB, each with interstitial ads during prayers, each solving one slice of the problem.

Before writing any code, I did three things:

1. **Installed every competitor** — Sri Mandir (85MB, feature-heavy), Dharmayana (Panchang-focused), various Chalisa apps (ad-heavy). Mapped their strengths and gaps.

2. **Defined the constraint** — One app, under 20MB, offline text, streamed audio, 5 languages, zero ads during reading/listening. No backend, no accounts.

3. **Designed 5 screens** — Home, Library, Verse Reader, Audio Player, Settings. Used Figma with a dark theme and saffron accent (#E8732A) for Devanagari text — because that's how these verses feel: warm against dark.

The design spec took 3 days. In hindsight, this was the most valuable time spent — every engineering decision flowed from these constraints.`
    },
    {
      heading: 'How Did I Architect the Core in Week 2?',
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

\`react-i18next\` for UI strings (80 keys), inline translations for verse content. This split was critical — trying to run 3,500 Gita verse translations through i18next would have been a disaster.

**The biggest time saver in Week 2 was committing to a generic verse renderer.** Instead of building custom screens for each scripture, I built one VerseReader component that accepts any array of verse objects. It handles language switching, bookmarking, and scroll position persistence regardless of whether the content is Hanuman Chalisa or Bhagavad Gita. This meant adding a new scripture later required only a JSON file — zero component code changes. This architectural decision paid off immediately when I added Aartis in Week 3: it took 30 minutes instead of the full day it would have taken with custom screens.`
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
      heading: 'How Does EAS Build and Play Store Submission Work?',
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
- First review is slower (~3 days). Updates review in ~24 hours after that.

**One lesson I wish I had learned earlier: prepare your Play Store listing assets in parallel with development.** Screenshots require a near-final UI, which means you cannot generate them until Week 3 at the earliest. But the feature graphic, app description, short description, and privacy policy can all be drafted in Week 1. I wasted a full day in Week 4 scrambling to create these assets when I should have been focused on final testing and bug fixes. For future projects, I now maintain a checklist of all Play Store requirements and start working on non-screenshot assets from day one.`
    },
    {
      heading: 'What Architecture Decisions Made This Possible?',
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
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: How long does Google Play Store review take for a new app?**

The first submission review typically takes 2-5 business days. Google manually reviews new developer accounts more thoroughly, especially if this is your first app. Subsequent updates review much faster, usually within 24 hours. To avoid delays, ensure your app listing is complete before submitting — missing screenshots, a vague description, or an inaccessible privacy policy URL are common reasons for rejection or extended review times. SanatanApp's first review took exactly 3 days.

**Q: Is Expo managed workflow sufficient for production apps, or do you need to eject?**

For most apps that do not require custom native modules, Expo managed workflow is fully production-ready. SanatanApp uses managed workflow with no ejection and runs in production on the Play Store without issues. You only need to eject (or use a custom dev client) if you require native modules not available in the Expo SDK — things like Bluetooth, NFC, custom push notification handling, or third-party SDKs that require native linking. The Expo SDK covers audio, SQLite, fonts, navigation, camera, location, and most common needs.

**Q: How much does it cost to publish an app on the Google Play Store?**

The Google Play Store charges a one-time developer registration fee of $25 USD. There are no annual fees and no per-app charges. If your app is free with no in-app purchases, the only ongoing cost is whatever your app's infrastructure requires. For SanatanApp, the total ongoing cost is $0 per month because all content is bundled in the APK and audio is streamed from free public domain sources. If you monetize with ads, Google takes no additional cut beyond AdMob's standard revenue share.

**Q: Can you ship a React Native app to both iOS and Android from the same codebase?**

Yes, React Native is cross-platform by design. The same JavaScript codebase runs on both iOS and Android. SanatanApp currently targets only Android because the primary audience (Indian devotional users) is overwhelmingly on Android devices. Adding iOS support would require an Apple Developer account ($99/year), minor platform-specific adjustments for safe areas and navigation, and App Store submission which has its own review process. EAS Build supports both platforms, so generating an iOS build is a single configuration change.

**Q: What is the best way to handle app updates after the initial Play Store launch?**

For content updates (new scriptures, new translations), ship an app update through the Play Store using EAS Build. The process is straightforward: increment the version number in app.json, run \`eas build --platform android --profile production\`, upload the new AAB to the Play Console, and submit for review. For urgent bug fixes, consider using EAS Update (over-the-air updates) which pushes JavaScript bundle changes to users without going through the Play Store review process. SanatanApp uses OTA updates for minor fixes and full builds for new features.`
    }
  ],
  cta: {
    text: 'Need a mobile app shipped fast? I build end-to-end.',
    href: '/contact'
  }
};

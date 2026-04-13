import type { BlogPost } from '@/types/blog';

export const buildingMultilanguageReactNativeAppExpo: BlogPost = {
  slug: 'building-multilanguage-react-native-app-expo',
  title: 'Building a Multi-Language React Native App with Expo SDK 52 — SanatanApp Architecture',
  date: '2026-04-05',
  excerpt: 'How I architected a 5-language devotional app with bundled JSON content, offline-first storage, and expo-av audio streaming — shipping to Play Store at ~15MB.',
  readingTime: '9 min read',
  keywords: ['react native i18n', 'expo sdk 52', 'react native offline app', 'expo-av audio streaming', 'react native multilanguage'],
  relatedProject: 'sanatanapp',
  sections: [
    {
      heading: 'The Problem: 5 Apps Where 1 Should Exist',
      content: `My grandmother recited Hanuman Chalisa every morning. When I wanted that same experience on my phone, I downloaded 5 different apps — one for Chalisa, one for Gita, one for Aarti, one for Ramayan audio. Each was ad-heavy, single-purpose, and 40-80MB.

The engineering challenge: build **one app** that replaces all of them — with 5 languages (Hindi, English, Sanskrit, Tamil, Telugu), offline text, streamed audio, and a ~15MB APK. No backend. No login. Privacy-first.

This post covers the architecture decisions, content strategy, and i18n approach I used to ship SanatanApp to the [Google Play Store](https://play.google.com/store/apps/details?id=com.sanatandevotional.app).`
    },
    {
      heading: 'Content Architecture: JSON Over APIs',
      content: `The first decision was how to store sacred texts. Options:

1. **Remote API** — Flexible but requires internet, adds latency, needs a backend
2. **SQLite** — Overkill for read-only text, adds query overhead
3. **Bundled JSON** — Zero latency, works offline, trivially simple

I went with bundled JSON. The entire Hanuman Chalisa (40 verses × 5 languages) is ~12KB. Bhagavad Gita (700 verses × 5 languages) is ~180KB. All Aartis combined: ~25KB. Total text payload: **under 250KB**.

\`\`\`text
content/
├── texts/
│   ├── hanuman-chalisa.json    # { verses: [{ id, sanskrit, hindi, english }] }
│   ├── bhagavad-gita/
│   │   ├── chapter-01.json
│   │   └── ...chapter-18.json
│   └── aartis/
│       └── om-jai-jagdish.json
├── audio-sources.json          # Stream URLs (Archive.org, public domain)
└── i18n/
  ├── en.json                 # UI strings only
  └── hi.json
\`\`\`

The key insight: **separate content i18n from UI i18n**. Verse translations are embedded in each JSON file (one object per verse with all language fields). UI strings (buttons, labels, navigation) use \`react-i18next\`. This avoids the complexity of loading separate translation files for content.`
    },
    {
      heading: 'i18n Strategy: react-i18next for UI, Inline for Content',
      content: `Most i18n tutorials assume all translated content goes through the i18n system. For SanatanApp, that would mean 700 Gita verses × 5 languages = 3,500 translation keys just for one scripture. Unmanageable.

Instead, each verse object carries its own translations:

\`\`\`json
{
"id": 1,
"sanskrit": "श्रीगुरु चरन सरोज रज...",
"hindi": "श्री गुरु के चरण कमलों की धूल से...",
"english": "Having cleansed the mirror of my mind...",
"transliteration": "Shree Guru Charan Saroj Raj..."
}
\`\`\`

The VerseBlock component just reads the current language from context and renders the right field:

\`\`\`typescript
const { language } = useTranslation();
const text = verse[language] || verse.hindi; // Fallback to Hindi
\`\`\`

\`react-i18next\` handles only UI strings — about 80 keys total. This keeps the i18n system fast and the content pipeline simple. Adding a new language means adding one field to each verse JSON, not touching any code.`
    },
    {
      heading: 'Audio Streaming with expo-av',
      content: `Text is bundled. Audio is streamed. The Ramcharitmanas full katha is hours of audio — bundling it would make the APK 500MB+. Instead, I map content IDs to public domain streaming URLs in a single \`audio-sources.json\`:

\`\`\`json
{
"ramayan-bal-kand": {
  "title": "Bal Kand",
  "sourceUrl": "https://archive.org/download/...",
  "duration": 3600,
  "category": "ramayan"
}
}
\`\`\`

The AudioContext provider manages global playback state:

\`\`\`typescript
// Simplified AudioContext
const AudioContext = createContext<{
currentTrack: Track | null;
isPlaying: boolean;
play: (track: Track) => Promise<void>;
pause: () => void;
position: number;
}>({...});
\`\`\`

Key decisions:
- **No download/offline audio in v1** — keeps APK small, avoids storage management complexity
- **Background playback enabled** — users want to listen during commute or cooking
- **MiniPlayer pinned to bottom** — persistent audio bar across all screens, similar to Spotify
- **Archive.org as primary source** — public domain, no licensing issues, reliable CDN`
    },
    {
      heading: 'Local State: expo-sqlite for Progress & Streaks',
      content: `No backend means all user state lives on-device. I use \`expo-sqlite\` for three things:

1. **Bookmarks/Favorites** — Save any verse or aarti
2. **Reading progress** — Remember where you left off in each scripture
3. **Daily sadhana streaks** — Track consecutive days of practice

\`\`\`sql
CREATE TABLE favorites (
id TEXT PRIMARY KEY,
content_type TEXT,  -- 'verse' | 'aarti' | 'chapter'
content_id TEXT,
created_at INTEGER
);

CREATE TABLE progress (
content_id TEXT PRIMARY KEY,
position INTEGER,     -- verse number or audio seconds
total INTEGER,
updated_at INTEGER
);

CREATE TABLE sadhana (
date TEXT PRIMARY KEY,  -- 'YYYY-MM-DD'
tasks_json TEXT          -- ["morning_meditation", "gita_reading"]
);
\`\`\`

The streak calculation is a simple SQL query that counts consecutive dates backward from today. No cloud sync, no accounts, no privacy concerns.`
    },
    {
      heading: 'APK Size: How I Hit ~15MB',
      content: `Most competing apps are 50-85MB. SanatanApp ships at ~15MB. Here's how:

| Component | Size | Strategy |
|-----------|------|----------|
| Text content (all scriptures) | ~250KB | Bundled JSON, no images |
| App code (JS bundle) | ~2MB | Tree-shaking, no heavy UI libs |
| Fonts (Noto Sans Devanagari) | ~1.5MB | Single weight, subset |
| Expo runtime | ~10MB | Managed workflow, minimal plugins |
| Audio | 0 | Streamed, not bundled |
| Images | ~500KB | Minimal — icons only, no hero images |

Key trade-offs:
- **No images for scriptures** — text-only with beautiful typography is actually more readable
- **Single font weight** — Regular only, no Bold/Italic variants of Devanagari font
- **Minimal dependencies** — React Navigation, expo-av, expo-sqlite, react-i18next. That's it.
- **No analytics SDK** — saves ~2MB and aligns with privacy-first positioning`
    },
    {
      heading: 'What I Would Do Differently',
      content: `**Ship faster.** I spent too long on the design spec before writing code. The verse reader screen alone went through 4 design iterations. In hindsight, the first version was 80% right.

**Start with one scripture.** Bundling everything (Chalisa + Gita + Aartis + Ramayan) for v1 was ambitious. Launching with just Hanuman Chalisa would have been a faster path to user feedback.

**Consider Expo Router over React Navigation.** Expo Router (file-based routing) is more idiomatic in the Expo ecosystem now. I went with React Navigation because I knew it well, but Expo Router would have simplified the navigation setup.

The app is live on [Google Play](https://play.google.com/store/apps/details?id=com.sanatandevotional.app). If you're building a content-heavy React Native app with offline-first requirements, the JSON + streaming architecture works well. The total cost of running SanatanApp is $0/month — no servers, no databases, no CDN bills.`
    }
  ],
  cta: {
    text: 'Need a mobile app built with React Native? Let\'s talk.',
    href: '/contact'
  }
};

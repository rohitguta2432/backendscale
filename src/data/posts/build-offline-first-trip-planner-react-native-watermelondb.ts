import type { BlogPost } from '@/types/blog';

export const buildOfflineFirstTripPlannerReactNativeWatermelondb: BlogPost = {
  slug: 'build-offline-first-trip-planner-react-native-watermelondb',
  title: 'Building an Offline-First Trip Planner with React Native + WatermelonDB + Offline Maps',
  date: '2026-04-13',
  excerpt: 'Architecture decisions behind TripHive — a collaborative trip planner that works without internet using WatermelonDB, PowerSync, and MapLibre with downloadable offline tiles.',
  readingTime: '10 min read',
  keywords: ['offline first react native app', 'watermelondb react native', 'offline maps react native', 'collaborative trip planner app', 'powersync react native sync'],
  relatedProject: 'triphive',
  sections: [
    {
      heading: 'Group Trip Planning Is Broken',
      content: `I built TripHive, an offline-first collaborative trip planner using React Native, WatermelonDB, PowerSync, and MapLibre with downloadable Protomaps tiles that replaces five separate tools — Google Docs for itineraries, Google Maps for navigation, Splitwise for expenses, WhatsApp for polls, and shared sheets for packing lists — with one app that works without internet by default.

Count the tools you used for your last group trip: WhatsApp for discussions. Google Docs for the itinerary. Google Maps for places. Splitwise for expenses. Email for hotel confirmations. Maybe a shared Google Sheet for the budget.

Five tools. None of them talk to each other. And the moment you land in a country with spotty WiFi — or walk into a subway — everything breaks. Google Docs won't load. Maps can't fetch tiles. Splitwise needs a connection to settle up.

Trip planning apps exist — TripIt, Wanderlog, Sygic. But they're all online-first. Their offline mode is an afterthought: cached data that goes stale, sync conflicts that lose your edits, and no offline map support.

TripHive is **offline-first**. Not "works offline sometimes." The entire architecture assumes you have no internet, and treats connectivity as a bonus.`
    },
    {
      heading: 'Why Choose WatermelonDB Over Realm or SQLite?',
      content: `For offline-first mobile apps, you need a local database that handles three things well:

1. **Fast reads** — Trip data (itineraries, expenses, polls) must load instantly from local storage
2. **Background sync** — When internet returns, changes sync transparently without blocking the UI
3. **Conflict resolution** — Two people editing the same itinerary offline must merge, not overwrite

**WatermelonDB** won over Realm and raw SQLite for specific reasons:

**vs. Realm:** Realm's sync layer (MongoDB Atlas Device Sync) locks you into MongoDB. WatermelonDB is database-agnostic — it uses SQLite under the hood but syncs with any backend (we use Supabase/Postgres). Realm also has a heavier memory footprint.

**vs. Raw SQLite:** SQLite gives you a database, not a sync framework. You'd need to build change tracking, conflict resolution, and incremental sync from scratch. WatermelonDB does this out of the box.

**WatermelonDB's killer feature: lazy loading.** It doesn't load entire collections into memory. Records are loaded on demand as the UI needs them. For a trip with 200 itinerary items, 50 expenses, and 30 poll votes, this keeps memory usage flat.

**PowerSync** sits on top as the sync layer — it handles delta-based synchronization between WatermelonDB and Supabase Postgres. Only changed records sync, not the entire database.`
    },
    {
      heading: 'Offline Maps with MapLibre + Protomaps',
      content: `Google Maps costs $7 per 1,000 map loads after the free tier. For a trip planner where users constantly pan and zoom, this adds up fast. And Google Maps has no real offline tile support — you can download an area in the Google Maps app, but there's no SDK for embedding offline maps in your own app.

**MapLibre GL** is an open-source map renderer. **Protomaps** provides vector tiles as static files — PMTiles format. Together, they give you:

1. **Zero per-request API cost** — Tiles are static files, not API calls
2. **Downloadable offline regions** — User selects "Download Tokyo maps" and gets ~50MB of vector tiles for the entire city
3. **Beautiful rendering** — Vector tiles render at any zoom level without pixelation
4. **Custom styling** — Match the map style to TripHive's design language

**The offline map flow:**

1. User creates a trip to Tokyo
2. App prompts: "Download offline maps for Tokyo? (~50MB)"
3. PMTiles file downloads to device storage
4. MapLibre renders from local tiles — zero network needed
5. All trip places show as pins on the offline map

This is a genuine differentiator. No competing trip planner offers downloadable offline maps in their app. Travelers in foreign countries with no data plan can still navigate.`
    },
    {
      heading: 'How Does Link-Based Access Work Without Requiring Login?',
      content: `The #1 adoption killer for group apps is the "everyone needs to download and create an account" problem. You send a trip invite to 8 friends. 3 download the app. 2 create accounts. 1 actually adds something.

TripHive removes every friction point:

1. **Share a link** — The trip creator gets a shareable URL
2. **No download needed** — First visit opens a PWA-lite preview with the trip details
3. **No login to view** — Anyone with the link can see the itinerary, map, and expenses
4. **Optional login to edit** — Quick sign-up via Supabase Auth (Google or email) only when they want to add/edit

**How this works technically:**

- Trip invite links contain an encoded trip ID + access token
- Supabase Row Level Security (RLS) policies check the access token for read access
- Write access requires authentication + trip membership
- The trip creator can revoke any link at any time

**Supabase as the backend** means zero custom backend code. Auth, Postgres, Realtime subscriptions, and file storage are all managed. The app talks directly to Supabase through their SDK.`
    },
    {
      heading: 'Feature Set: Replacing 5 Tools',
      content: `TripHive consolidates five separate tools into one offline-capable experience:

**1. Collaborative Itinerary** (replaces Google Docs)
- Day-by-day schedule with time slots
- Drag-and-drop reordering
- Place details with photos, notes, and map pins
- Real-time collaboration via Supabase Realtime

**2. Interactive Maps** (replaces Google Maps)
- All trip places pinned on the map
- Downloadable offline tiles per city/region
- Route visualization between daily stops

**3. Expense Splitting** (replaces Splitwise)
- Log expenses with who paid and who participated
- Real-time balance calculation
- Settlement suggestions (minimize transactions)
- Multi-currency support with conversion rates

**4. Group Polls** (replaces WhatsApp polls)
- "Where should we eat tonight?" — vote on options
- Anonymous or public voting
- Results update in real-time for online participants

**5. Packing Lists** (replaces shared Google Sheets)
- Category-based checklists (clothing, electronics, documents)
- Template packing lists by trip type (beach, hiking, business)
- Shared lists where multiple people can check off items

**Monetization via RevenueCat:**
- Free tier: 2 trips, 5 collaborators per trip
- Pro ($4.99/month): Unlimited trips, offline maps, PDF export
- RevenueCat handles subscriptions, trials, and platform-specific billing`
    },
    {
      heading: 'Architecture Summary & Key Takeaways',
      content: `| Layer | Technology | Why |
|-------|-----------|-----|
| Mobile | React Native + Expo + TypeScript | Cross-platform, managed workflow |
| Local DB | WatermelonDB | Offline-first, lazy loading, sync-ready |
| Sync | PowerSync | Delta-based sync, conflict resolution |
| Maps | MapLibre GL + Protomaps | Free, offline-capable, vector tiles |
| Backend | Supabase | Zero custom code — Auth, DB, Realtime, Storage |
| Push | Firebase Cloud Messaging | Cross-platform notifications |
| Payments | RevenueCat | Subscription management abstraction |

**Key architectural takeaways:**

1. **Offline-first is an architecture, not a feature.** You can't bolt it on later. WatermelonDB + PowerSync must be chosen from day one.

2. **Link-based access removes the biggest group adoption barrier.** Authentication should be required for writing, not reading.

3. **Offline maps are a genuine moat.** The download-tile-bundle approach with Protomaps is simple to implement and massively valuable for travelers.

4. **Supabase eliminates backend engineering for collaborative apps.** Auth, Realtime, RLS, and Storage — all managed. Focus on the mobile experience.

5. **Revenue model matters from the architecture phase.** The free/pro tier split influenced data model design — trip limits are enforced at the database level, not the UI level.

**Cross-platform performance considerations:** React Native with Expo provides a managed workflow that simplifies iOS and Android builds from a single codebase. WatermelonDB's lazy loading is particularly important on Android where memory management is stricter — loading 200 itinerary items eagerly would cause perceptible jank on mid-range devices. The MapLibre renderer uses GPU acceleration for smooth map interactions, and downloaded PMTiles are stored on device storage rather than app storage to avoid Android's per-app storage limits.

**Handling multi-currency expense splitting:** International trips involve expenses in multiple currencies. TripHive stores each expense in its original currency with the conversion rate at time of entry. Settlement calculations convert everything to a single "trip currency" chosen by the group creator. Exchange rates can be manually adjusted if the group disagrees with the automatic rate. This avoids the common problem in Splitwise where currency conversion discrepancies create small persistent imbalances that never resolve.`
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: How much storage do offline maps require per city?**\n\nProtomaps vector tiles are significantly smaller than raster tiles. A typical city like Tokyo requires approximately 50MB of tiles, covering all zoom levels from neighborhood to city-wide view. A small city like Kyoto might need 20-30MB. Users can delete downloaded tiles after a trip to reclaim storage. Vector tiles render beautifully at any zoom level without pixelation, unlike cached Google Maps screenshots.\n\n**Q: What happens when two people edit the same itinerary item offline?**\n\nPowerSync handles conflict resolution using a last-write-wins strategy for most fields. If Person A changes a restaurant name while offline and Person B changes the time slot while offline, both changes merge cleanly because they affect different fields. If both change the same field, the most recent write wins when sync occurs. Supabase Realtime notifies online users immediately so they can discuss if a conflict feels wrong.\n\n**Q: Can TripHive work without Supabase as the backend?**\n\nWatermelonDB is backend-agnostic — it uses SQLite locally and can sync with any PostgreSQL-compatible backend. PowerSync specifically supports Supabase but also works with self-hosted PostgreSQL. Replacing Supabase would require implementing authentication and realtime subscriptions separately, but the local database and offline functionality would remain identical.\n\n**Q: How does the free tier limitation (2 trips, 5 collaborators) work technically?**\n\nTrip limits are enforced at the database level through Supabase Row Level Security policies, not just the UI. A free user's INSERT policy on the trips table checks their current trip count. This means even direct API calls cannot bypass the limit. RevenueCat manages subscription state and communicates tier status to Supabase through a webhook that updates the user's subscription record.\n\n**Q: Is TripHive available on both iOS and Android?**\n\nYes. React Native with Expo produces native iOS and Android apps from one TypeScript codebase. MapLibre GL has native renderers for both platforms. WatermelonDB uses SQLite on both platforms. The only platform-specific code is push notification handling via Firebase Cloud Messaging for Android and APNs for iOS, which Expo abstracts through its notification module.`
    }
  ],
  cta: {
    text: 'Building an offline-first mobile app? I architect and ship cross-platform.',
    href: '/contact'
  }
};

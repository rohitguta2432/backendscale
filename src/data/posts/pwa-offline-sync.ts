import type { BlogPost } from '@/types/blog';

export const pwaOfflineSync: BlogPost = {
  slug: 'pwa-offline-sync',
  title: 'Offline-First PWA Patterns — Service Workers, IndexedDB, and Background Sync',
  date: '2026-01-15',
  excerpt: 'Service workers, IndexedDB, and background sync patterns used in MicroItinerary for reliable offline-first travel planning.',
  readingTime: '7 min read',
  keywords: ['pwa offline sync indexeddb', 'service worker background sync', 'offline first web app', 'progressive web app patterns'],
  relatedProject: 'microitinerary',
  sections: [
    {
      heading: 'Why Offline-First Matters for Travel Apps',
      content: `To build an offline-first PWA, you need three layers working together: a service worker with cache-first strategy for static assets and network-first for API data, IndexedDB (via Dexie.js) as the local source of truth for structured data, and the Background Sync API to queue write operations while offline and replay them automatically when connectivity returns. This pattern ensures your app works fully offline without degraded functionality.

Travel apps have a unique problem: users need them most when they have the worst connectivity. Airports, trains, remote destinations — these are exactly where mobile data is slow, expensive, or nonexistent.

MicroItinerary is an AI-powered travel planner. Users create itineraries, track expenses, and get destination recommendations. All of this needs to work offline — not as a degraded experience, but as the primary mode.

The key mindset shift: don't treat offline as an error state. Treat it as the default, with online as an enhancement. This means every feature you build starts with the question: "Does this work with zero network connectivity?" If the answer is no, you redesign the feature before writing code. The payoff is significant — users on spotty hotel Wi-Fi, international roaming, or airplane mode get the same experience as users on fiber. And when connectivity returns, everything syncs silently in the background.`
    },
    {
      heading: 'What Are the Three Layers of Offline Support?',
      content: `Offline-first PWAs require three things working together:

**1. Service Worker** — intercepts network requests and serves cached responses. This handles static assets (HTML, CSS, JS) and API responses.

**2. IndexedDB** — a browser-native NoSQL database for structured data. This stores itineraries, expenses, and user preferences locally.

**3. Background Sync** — queues mutations (create/update/delete) while offline and replays them when connectivity returns.

Each layer solves a different problem. Service workers handle read caching, IndexedDB handles local state, and background sync handles write durability.

**A common mistake is trying to use only one layer for everything.** Service workers alone cannot handle structured data queries — they cache HTTP responses, not application state. IndexedDB alone cannot intercept network requests or serve cached pages. Background sync alone does nothing without IndexedDB to store the pending mutations. The three layers are complementary, and skipping any one of them leaves a gap in your offline experience. For MicroItinerary, all three were implemented in the first sprint because retrofitting offline support into an online-first app is significantly harder than building offline-first from day one.`
    },
    {
      heading: 'How Does the Service Worker Cache-First Strategy Work?',
      content: `MicroItinerary uses a cache-first strategy for static assets and a network-first strategy for API data:

\`\`\`javascript
// Cache-first for static assets
self.addEventListener('fetch', (event) => {
if (event.request.destination === 'image' ||
    event.request.destination === 'style' ||
    event.request.destination === 'script') {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
}
});
\`\`\`

For API calls, we try the network first and fall back to IndexedDB:

\`\`\`javascript
// Network-first for API, fallback to IndexedDB
async function fetchItinerary(id) {
try {
  const response = await fetch(\`/api/itineraries/\${id}\`);
  const data = await response.json();
  await db.itineraries.put(data); // Update local cache
  return data;
} catch {
  return await db.itineraries.get(id); // Offline fallback
}
}
\`\`\`

This means the app always shows data — fresh from the server when online, or from the local cache when offline.

**Cache versioning prevents stale asset issues.** When you deploy a new version of your app, the old service worker may still serve cached HTML and JavaScript from the previous version. MicroItinerary handles this with versioned cache names — each deployment creates a new cache (e.g., \`micro-itinerary-v2.3\`) and the service worker's \`activate\` event deletes old caches. This ensures users always get the latest app shell within one reload cycle. For API data, I set a stale-while-revalidate policy: serve the cached response immediately for speed, then fetch the fresh response in the background and update IndexedDB for next time.`
    },
    {
      heading: 'How Does IndexedDB Handle Local-First State Management?',
      content: `IndexedDB is where the real offline magic happens. Every itinerary, expense, and preference is stored locally first, then synced to the server.

We use Dexie.js as a wrapper around IndexedDB for a cleaner API:

\`\`\`javascript
const db = new Dexie('MicroItinerary');
db.version(1).stores({
itineraries: 'id, userId, updatedAt',
expenses: 'id, itineraryId, category',
syncQueue: '++id, action, timestamp'
});
\`\`\`

The \`syncQueue\` table is critical — it stores pending mutations that haven't been sent to the server yet. Each entry records the action (create/update/delete), the payload, and a timestamp for conflict resolution.

**Why Dexie.js over raw IndexedDB?** The native IndexedDB API is notoriously verbose and callback-heavy. Opening a transaction, getting an object store, and performing a simple get operation takes 10+ lines of code. Dexie wraps this in a Promise-based API that reads like any modern database client. It also provides live queries that react to data changes — when an itinerary is updated in IndexedDB, any component observing that itinerary re-renders automatically. This reactive pattern eliminates the need for manual cache invalidation in your UI layer. For MicroItinerary, Dexie reduced the IndexedDB integration code by roughly 70% compared to the raw API.`
    },
    {
      heading: 'Background Sync: Write Durability',
      content: `When a user creates an expense while offline, it goes into IndexedDB immediately and gets added to the sync queue. When the device comes back online, the service worker replays the queue:

\`\`\`javascript
self.addEventListener('sync', (event) => {
if (event.tag === 'sync-mutations') {
  event.waitUntil(replayMutations());
}
});

async function replayMutations() {
const pending = await db.syncQueue.toArray();
for (const mutation of pending) {
  await fetch(mutation.endpoint, {
    method: mutation.method,
    body: JSON.stringify(mutation.payload)
  });
  await db.syncQueue.delete(mutation.id);
}
}
\`\`\`

The service worker's \`sync\` event fires automatically when connectivity is restored — even if the app is closed. This means expenses added on a plane land in the database when the user arrives.

**Conflict resolution is the hardest part of background sync.** When two devices edit the same itinerary offline and both sync when they come back online, you have a conflict. MicroItinerary uses a last-write-wins strategy based on timestamps — the mutation with the later timestamp takes precedence. This is simple and works for 95% of cases. For the remaining edge cases (two people editing the same expense simultaneously), the server returns a 409 Conflict and the client shows both versions to the user for manual resolution. More sophisticated strategies like CRDTs (Conflict-free Replicated Data Types) exist, but they add significant complexity that most travel apps do not need.`
    },
    {
      heading: 'Key Takeaways',
      content: `1. **Treat offline as the default** — design your data flow for no connectivity, then add sync
2. **IndexedDB is your source of truth** — the server is just a backup
3. **Queue all writes** — never fire-and-forget network mutations
4. **Use timestamps for conflict resolution** — last-write-wins is simple and usually sufficient
5. **Test offline regularly** — Chrome DevTools' Network panel has an "Offline" checkbox. Use it.`
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: Does the Background Sync API work on all browsers?**

Background Sync is supported in Chromium-based browsers (Chrome, Edge, Opera, Samsung Internet) but not in Safari or Firefox as of early 2026. For unsupported browsers, you need a fallback strategy. MicroItinerary detects Background Sync support at runtime and falls back to a "sync on focus" approach — when the user returns to the app tab, the app checks for pending mutations in IndexedDB and replays them immediately. This provides a slightly degraded but functional experience on Safari and Firefox.

**Q: How much data can IndexedDB store on a user's device?**

IndexedDB storage limits vary by browser and device. Chrome allows up to 80% of total disk space per origin, Firefox allows up to 50%, and Safari has a more conservative limit of roughly 1GB. In practice, for a travel app like MicroItinerary, storage is never an issue — even hundreds of itineraries with thousands of expense entries consume only a few megabytes. The real concern is not storage limits but data integrity: if a user clears their browser data, everything in IndexedDB is lost. MicroItinerary warns users who have unsynced data and encourages them to connect before clearing browser storage.

**Q: How do you handle service worker updates without disrupting active users?**

MicroItinerary uses the "skip waiting" pattern with a user notification. When a new service worker is installed, the app shows a subtle "Update available — refresh to get the latest version" banner. Clicking it calls \`skipWaiting()\` on the new service worker and reloads the page. This avoids the problem of forced updates interrupting users mid-task. The old service worker continues serving the current session until the user explicitly refreshes, ensuring a smooth transition.

**Q: Can an offline-first PWA replace a native mobile app?**

For many use cases, yes. PWAs can access the camera, geolocation, push notifications (on Android), and local storage. MicroItinerary runs as a PWA that users add to their home screen — it launches full-screen, works offline, and feels like a native app. The main limitations compared to native are: no access to Bluetooth or NFC, limited push notification support on iOS, and no app store discoverability. For a travel planning app where the core value is content and data management, a PWA delivers 90% of the native experience at a fraction of the development cost.

**Q: What is the best way to test offline-first functionality during development?**

Chrome DevTools is the primary tool. The Network panel has an "Offline" checkbox that simulates zero connectivity. The Application panel shows your service worker status, cached resources, and IndexedDB contents. For automated testing, use Playwright or Puppeteer with network interception to simulate offline conditions in your CI pipeline. MicroItinerary has a dedicated test suite that creates itineraries and expenses while offline, then verifies they sync correctly when the network is restored. Testing edge cases like partial connectivity and slow 2G connections is equally important — use Chrome's network throttling presets for this.`
    }
  ],
  cta: {
    text: 'Building a PWA that needs to work offline?',
    href: '/contact'
  }
};

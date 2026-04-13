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
      content: `Travel apps have a unique problem: users need them most when they have the worst connectivity. Airports, trains, remote destinations — these are exactly where mobile data is slow, expensive, or nonexistent.

MicroItinerary is an AI-powered travel planner. Users create itineraries, track expenses, and get destination recommendations. All of this needs to work offline — not as a degraded experience, but as the primary mode.

The key mindset shift: don't treat offline as an error state. Treat it as the default, with online as an enhancement.`
    },
    {
      heading: 'The Three Layers of Offline Support',
      content: `Offline-first PWAs require three things working together:

**1. Service Worker** — intercepts network requests and serves cached responses. This handles static assets (HTML, CSS, JS) and API responses.

**2. IndexedDB** — a browser-native NoSQL database for structured data. This stores itineraries, expenses, and user preferences locally.

**3. Background Sync** — queues mutations (create/update/delete) while offline and replays them when connectivity returns.

Each layer solves a different problem. Service workers handle read caching, IndexedDB handles local state, and background sync handles write durability.`
    },
    {
      heading: 'Service Worker: Cache-First Strategy',
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

This means the app always shows data — fresh from the server when online, or from the local cache when offline.`
    },
    {
      heading: 'IndexedDB: Local-First State Management',
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

The \`syncQueue\` table is critical — it stores pending mutations that haven't been sent to the server yet. Each entry records the action (create/update/delete), the payload, and a timestamp for conflict resolution.`
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

The service worker's \`sync\` event fires automatically when connectivity is restored — even if the app is closed. This means expenses added on a plane land in the database when the user arrives.`
    },
    {
      heading: 'Key Takeaways',
      content: `1. **Treat offline as the default** — design your data flow for no connectivity, then add sync
2. **IndexedDB is your source of truth** — the server is just a backup
3. **Queue all writes** — never fire-and-forget network mutations
4. **Use timestamps for conflict resolution** — last-write-wins is simple and usually sufficient
5. **Test offline regularly** — Chrome DevTools' Network panel has an "Offline" checkbox. Use it.`
    }
  ],
  cta: {
    text: 'Building a PWA that needs to work offline?',
    href: '/contact'
  }
};

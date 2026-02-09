export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    readingTime: string;
    keywords: string[];
    relatedProject?: string;
    sections: { heading: string; content: string }[];
    cta?: { text: string; href: string };
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'rag-for-sql',
        title: 'Using RAG for SQL Generation — Why Embeddings Beat Prompt Stuffing',
        date: '2026-01-28',
        excerpt: 'How pgvector embeddings improve LLM-to-SQL accuracy by providing schema context instead of dumping entire schemas into prompts.',
        readingTime: '8 min read',
        keywords: ['rag sql generation', 'pgvector embeddings sql', 'text to sql pgvector', 'llm sql accuracy', 'chat to sql'],
        relatedProject: 'stellarmind',
        sections: [
            {
                heading: 'The Problem With Prompt Stuffing',
                content: `Most text-to-SQL tutorials start with a simple idea: dump your database schema into the LLM prompt. For a toy database with 3 tables, this works fine. For a production database with 50+ tables, 200+ columns, and foreign key relationships — you're burning tokens and confusing the model.

I hit this wall building StellarMIND. The schema context was so large that GPT-4 would hallucinate column names, confuse similar table prefixes, and miss join conditions. The accuracy on complex queries dropped below 40%.

The root cause isn't the LLM — it's the retrieval. When you stuff everything into the prompt, the model has to figure out which 5% of the schema is relevant. That's a needle-in-a-haystack problem that language models are notoriously bad at.`
            },
            {
                heading: 'RAG-Based Schema Retrieval',
                content: `The fix is RAG (Retrieval-Augmented Generation) applied to schema metadata. Instead of sending the entire schema, you:

1. **Chunk** your schema into semantic units — one chunk per table, including column names, types, constraints, and sample values
2. **Embed** each chunk using an embedding model (we use OpenAI's text-embedding-3-small)
3. **Store** embeddings in pgvector alongside the original text
4. **Retrieve** the top-k most relevant chunks based on the user's natural language question
5. **Generate** SQL using only the retrieved context

This means when a user asks "What were last month's sales by region?", the retriever pulls only the \`sales\`, \`regions\`, and \`date_dim\` table schemas — not the entire 200-table dump.`
            },
            {
                heading: 'Implementation with Spring AI and pgvector',
                content: `StellarMIND uses Spring AI's \`VectorStore\` abstraction with pgvector as the backend. The setup:

- **Embedding model**: OpenAI text-embedding-3-small (1536 dimensions)
- **Vector store**: PostgreSQL with pgvector extension
- **Similarity search**: Cosine similarity, top-5 retrieval
- **Schema chunking**: One document per table with columns, types, constraints, and 3 sample rows

The key insight is including sample data in the embeddings. Column names like \`rgn_cd\` or \`amt_usd\` are cryptic — but when the embedding includes sample values like "US-WEST" or "1,234.56", the semantic search becomes dramatically more accurate.

Spring AI makes this trivially easy:

\`\`\`java
vectorStore.add(List.of(
    new Document("Table: sales | Columns: sale_id (int), amount (decimal), region_code (varchar) | Sample: {sale_id: 1, amount: 1234.56, region_code: 'US-WEST'}")
));

List<Document> relevant = vectorStore.similaritySearch(
    SearchRequest.query("monthly sales by region").withTopK(5)
);
\`\`\`

The retrieved documents go straight into the prompt as context, replacing the full schema dump.`
            },
            {
                heading: 'Results: Prompt Stuffing vs RAG',
                content: `On StellarMIND's test suite of 50 natural language queries against a 47-table database:

| Approach | Accuracy | Avg Tokens Used | Latency |
|----------|----------|-----------------|---------|
| Full schema in prompt | 38% | ~12,000 | 4.2s |
| RAG (top-5 retrieval) | 79% | ~2,800 | 1.8s |
| RAG + sample data | 87% | ~3,200 | 2.1s |

RAG more than doubled accuracy while cutting token usage by 75%. Adding sample data in embeddings pushed it to 87% — the cost of those extra 400 tokens per query is negligible compared to the accuracy gain.`
            },
            {
                heading: 'Safety: Read-Only Enforcement',
                content: `Accuracy isn't enough. An LLM generating SQL against your production database needs guardrails.

StellarMIND enforces read-only access at the query level — not just at the database role level. The generated SQL is parsed before execution, and only \`SELECT\` and \`WITH\` (CTE) statements are allowed. Any \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`DROP\`, or \`ALTER\` gets rejected before it touches the database.

This is defense-in-depth: even if the LLM hallucinates a destructive query, it never executes.`
            },
            {
                heading: 'Key Takeaways',
                content: `1. **Don't stuff schemas into prompts** — it wastes tokens and kills accuracy on real databases
2. **pgvector + Spring AI** is the simplest RAG stack for Java/Spring Boot teams
3. **Include sample data in embeddings** — column names alone aren't semantically rich enough
4. **Enforce read-only at the application layer** — database roles aren't sufficient for LLM-generated queries
5. **Measure accuracy on real queries** — toy benchmarks don't reflect production complexity`
            }
        ],
        cta: {
            text: 'Need a Chat-to-SQL system for your product?',
            href: '/contact'
        }
    },
    {
        slug: 'spring-boot-mcp',
        title: 'Building an MCP Server with Spring Boot — A Practical Guide',
        date: '2026-01-20',
        excerpt: 'Implementing the Model Context Protocol for AI assistant tool integration using Spring Boot and Spring AI.',
        readingTime: '10 min read',
        keywords: ['mcp server spring boot', 'model context protocol tutorial', 'spring ai mcp', 'ai tool integration'],
        relatedProject: 'stellarmind',
        sections: [
            {
                heading: 'What Is MCP and Why Should You Care?',
                content: `The Model Context Protocol (MCP) is a standard for connecting AI assistants to external tools and data sources. Think of it as a USB-C for AI — a single protocol that lets any AI assistant call any tool, regardless of who built either side.

Before MCP, every AI integration was bespoke. Want Claude to query your database? Write a custom integration. Want GPT-4 to call your API? Build another one. MCP standardizes this into a single tool interface.

For backend engineers, this matters because your APIs and databases become tools that any AI assistant can use — not just the one you built for.`
            },
            {
                heading: 'MCP Architecture: Server vs Client',
                content: `MCP uses a client-server model:

- **MCP Server**: Exposes tools (functions) that AI assistants can call. This is what you build.
- **MCP Client**: The AI assistant that discovers and invokes tools. Claude Desktop, for example, is an MCP client.
- **Transport**: How they communicate — stdio (local) or HTTP/SSE (remote).

In StellarMIND, the MCP server exposes a single tool: \`executeDataQuery\`. The AI assistant sends a natural language question, the tool converts it to SQL via RAG, executes it, and returns the results.

The server doesn't know or care which AI assistant is calling it. That's the power of the protocol.`
            },
            {
                heading: 'Spring Boot MCP Server Setup',
                content: `Spring AI has first-class MCP support. Here's the minimal setup:

**Dependencies** (Maven):
\`\`\`xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-mcp-server-spring-boot-starter</artifactId>
</dependency>
\`\`\`

**Tool Definition**:
\`\`\`java
@Service
public class DataQueryTool {

    @Tool(description = "Execute a natural language query against the database")
    public QueryResult executeDataQuery(
        @ToolParam(description = "Natural language question") String question
    ) {
        // 1. Retrieve relevant schema via RAG
        // 2. Generate SQL with LLM
        // 3. Validate (read-only only)
        // 4. Execute and return results
    }
}
\`\`\`

**Configuration** (\`application.yml\`):
\`\`\`yaml
spring:
  ai:
    mcp:
      server:
        name: stellarmind
        version: 1.0.0
        transport: stdio
\`\`\`

That's it. Spring AI auto-discovers \`@Tool\`-annotated methods and exposes them via the MCP protocol. No boilerplate, no custom serialization.`
            },
            {
                heading: 'Connecting to Claude Desktop',
                content: `To use your MCP server with Claude Desktop, add it to your MCP configuration:

\`\`\`json
{
  "mcpServers": {
    "stellarmind": {
      "command": "java",
      "args": ["-jar", "stellarmind-server.jar"],
      "transport": "stdio"
    }
  }
}
\`\`\`

Claude will discover your \`executeDataQuery\` tool automatically. When a user asks a database question, Claude calls your tool, gets the SQL results, and presents them conversationally.

The stdio transport means Claude spawns your Java process locally. For production deployments, you'd switch to HTTP/SSE transport so the server runs remotely.`
            },
            {
                heading: 'Lessons Learned',
                content: `1. **Start with stdio transport** — it's simpler for development. Switch to HTTP for production.
2. **Tool descriptions matter enormously** — the AI uses the description to decide when to call your tool. Be specific.
3. **Return structured data, not strings** — the AI formats it better when it understands the structure.
4. **Spring AI's @Tool annotation is magical** — it handles JSON schema generation, parameter validation, and MCP compliance automatically.
5. **MCP is early but growing fast** — building MCP servers now gives you first-mover advantage in the AI tooling ecosystem.`
            }
        ],
        cta: {
            text: 'Want to make your API accessible to AI assistants?',
            href: '/contact'
        }
    },
    {
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
    }
];

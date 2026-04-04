export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  keywords: string[];
  relatedProject?: string;
  coverImage?: { src: string; alt: string };
  sections: { heading: string; content: string; image?: { src: string; alt: string } }[];
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
    new Document(
        "Table: sales | " +
        "Columns: sale_id (int), amount (decimal), region_code (varchar) | " +
        "Sample: {sale_id: 1, amount: 1234.56, region_code: 'US-WEST'}"
    )
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
  },
  {
    slug: 'aws-bedrock-vs-openai',
    title: 'AWS Bedrock vs OpenAI — Which One to Pick for Your Startup (With Real Costs)',
    date: '2026-04-02',
    excerpt: 'I built a financial advisor AI with AWS Bedrock (Nova Lite) after starting with OpenAI. Here\'s a real cost and latency comparison from production, not a marketing page.',
    readingTime: '9 min read',
    keywords: ['aws bedrock vs openai', 'bedrock nova lite review', 'aws bedrock cost', 'openai vs aws ai', 'bedrock for startups', 'llm api comparison 2026'],
    relatedProject: 'myfinancial',
    coverImage: {
      src: '/images/notes/bedrock-vs-openai-flow.png',
      alt: 'Architecture diagram comparing OpenAI and AWS Bedrock data flow for financial applications'
    },
    sections: [
      {
        heading: 'Why I Switched From OpenAI to AWS Bedrock',
        content: `I was building MyFinancial — a privacy-focused financial advisory app for Indian users. The AI feature is a contextual chat advisor called Kira that answers questions like "Am I saving enough?" or "How can I optimize my taxes under 80C?"

I started with OpenAI's GPT-4. It worked great. The quality was excellent. Then I looked at the bill.

For a personal finance app handling sensitive income, tax, and investment data, I had three concerns:

1. **Cost** — GPT-4 at \\$30/1M input tokens was going to destroy my unit economics at scale
2. **Data residency** — Financial data leaving my AWS infrastructure to hit OpenAI's API felt wrong
3. **Vendor lock-in** — My entire AI feature depended on one company's API and pricing decisions

AWS Bedrock solved all three. The data stays within my AWS account, I get model choice (Nova, Claude, Llama), and the pricing is dramatically lower for my use case.`
      },
      {
        heading: 'The Models: What You Actually Get',
        content: `Here's what's available on each platform as of early 2026:

| Feature | OpenAI | AWS Bedrock |
|---------|--------|-------------|
| Top-tier model | GPT-4o | Claude Opus 4, Nova Pro |
| Mid-tier | GPT-4o-mini | Claude Sonnet, Nova Lite |
| Budget | GPT-3.5 Turbo | Nova Micro, Llama 3 |
| Embeddings | text-embedding-3-small | Titan Embeddings |
| Image generation | DALL-E 3 | Titan Image, Stable Diffusion |
| Model choice | OpenAI models only | 30+ models from multiple providers |

The killer feature of Bedrock is **model choice**. If Anthropic raises prices, I switch to Nova. If Meta releases Llama 4, I test it without changing my infrastructure. With OpenAI, you're locked into their models and their pricing.

For MyFinancial, I chose **Amazon Nova Lite** — it handles financial Q&A with good quality at a fraction of GPT-4's cost.`
      },
      {
        heading: 'Real Cost Comparison From Production',
        content: `Here's what I measured building the Kira financial advisor. Each chat interaction sends a system prompt (~800 tokens of financial context), user message, and up to 10 messages of conversation history. Responses are capped at 1024 tokens.

**Typical request profile:**
- Input: ~1,500 tokens (system prompt + context + history + question)
- Output: ~400 tokens (advisor response)

**Cost per 1,000 chat interactions:**

| Model | Input Cost | Output Cost | Total per 1K Chats | Monthly (10K users, 5 chats/day) |
|-------|-----------|-------------|--------------------|---------------------------------|
| GPT-4o | \\$3.75 | \\$6.00 | \\$9.75 | ~\\$14,625 |
| GPT-4o-mini | \\$0.23 | \\$0.60 | \\$0.83 | ~\\$1,245 |
| Nova Lite (Bedrock) | \\$0.09 | \\$0.14 | \\$0.23 | ~\\$345 |
| Nova Micro (Bedrock) | \\$0.05 | \\$0.07 | \\$0.12 | ~\\$180 |

Nova Lite is **42x cheaper than GPT-4o** and **3.6x cheaper than GPT-4o-mini** for my use case. At 10K users doing 5 chats per day, that's \\$345/month vs \\$14,625/month. That difference is survival vs bankruptcy for a bootstrapped startup.

Note: These are on-demand prices. Bedrock also offers Provisioned Throughput for predictable costs at scale.`
      },
      {
        heading: 'Quality: Is Nova Lite Good Enough?',
        content: `Honest answer: it depends on your use case.

For MyFinancial's financial advisory chat, Nova Lite handles these well:
- Explaining Indian tax concepts (80C, 80D, NPS, HRA)
- Calculating savings rates and emergency fund recommendations
- Comparing investment options (PPF vs ELSS vs FD)
- Giving actionable, personalized advice based on user data

Where it struggles compared to GPT-4o:
- Complex multi-step financial planning (e.g., "Plan my retirement considering inflation, tax regime changes, and two kids' education")
- Nuanced tone — GPT-4o's responses feel more natural and empathetic
- Edge cases with contradictory financial data

My approach: **use Nova Lite for 90% of queries, escalate to Claude Sonnet on Bedrock for complex ones.** The code already supports model switching:

\`\`\`java
// BedrockChatService supports both Nova and Claude formats
private boolean isNovaModel() {
    return modelId.contains("nova");
}
\`\`\`

This way, you get Nova Lite's cost efficiency for simple queries and Claude's reasoning power when it matters — all within Bedrock, no external API calls.`
      },
      {
        heading: 'Latency: The Surprise Winner',
        content: `I expected OpenAI to be faster since they operate dedicated inference infrastructure. In practice, from my EC2 instance in us-east-1:

| Model | Time to First Token | Total Response Time (400 tokens) |
|-------|--------------------|---------------------------------|
| GPT-4o | ~800ms | ~3.2s |
| GPT-4o-mini | ~400ms | ~1.8s |
| Nova Lite (Bedrock) | ~300ms | ~1.5s |
| Nova Micro (Bedrock) | ~200ms | ~0.9s |

Bedrock is faster because the traffic stays within AWS's network. There's no internet hop to OpenAI's servers — my EC2 instance talks to Bedrock's endpoint in the same region. For a chat interface, that 300ms vs 800ms time-to-first-token is the difference between feeling instant and feeling sluggish.`
      },
      {
        heading: 'Integration: Developer Experience',
        content: `OpenAI wins on developer experience. Their SDK is cleaner, documentation is better, and the API is more intuitive.

**OpenAI integration:**
\`\`\`python
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

**Bedrock integration (Java/Spring Boot):**
\`\`\`java
BedrockRuntimeClient client = BedrockRuntimeClient.builder()
    .region(Region.US_EAST_1)
    .credentialsProvider(DefaultCredentialsProvider.create())
    .build();

InvokeModelRequest request = InvokeModelRequest.builder()
    .modelId("amazon.nova-lite-v1:0")
    .contentType("application/json")
    .body(SdkBytes.fromUtf8String(requestBody))
    .build();
\`\`\`

Bedrock's API is lower-level. You build JSON request bodies manually, handle different response formats per model family, and deal with AWS SDK boilerplate. It's not hard — it's just more code.

The trade-off: OpenAI gives you a nicer SDK, Bedrock gives you infrastructure control. For a production app, I'll take infrastructure control every time.`
      },
      {
        heading: 'Privacy and Data Residency',
        content: `This is where Bedrock wins outright for fintech.

With OpenAI, your users' financial data — income, expenses, tax details, investment portfolios — travels over the public internet to OpenAI's servers. Yes, they have a data processing agreement. Yes, they say they don't train on API data. But try explaining that to a compliance team.

With Bedrock:
- Data never leaves your AWS account
- You control the VPC, encryption keys, and access policies
- CloudTrail logs every API call for audit
- No data is used for model training — ever
- You can run in specific AWS regions for data residency compliance

For MyFinancial, this was non-negotiable. Indian users' financial data staying within my AWS infrastructure isn't just good practice — it's a trust requirement.`
      },
      {
        heading: 'When to Choose Which',
        content: `**Choose OpenAI when:**
- You're prototyping and want the fastest path to working AI
- Quality is your top priority and cost is secondary
- You need the latest cutting-edge models immediately
- Your team is primarily Python and wants the best SDK experience

**Choose AWS Bedrock when:**
- You're already on AWS (no new vendor relationship)
- Cost efficiency matters at scale
- Data privacy/residency is a requirement
- You want model optionality (switch between Nova, Claude, Llama without code changes)
- You need enterprise controls (IAM, VPC, CloudTrail)

**My recommendation for Indian startups:** Start with OpenAI for your prototype. Switch to Bedrock before you hit 1,000 users. The cost difference at scale will pay for the migration effort many times over.`
      },
      {
        heading: 'Key Takeaways',
        content: `1. **Bedrock is 40x cheaper than GPT-4o** for production workloads — the math isn't close
2. **Latency is better on Bedrock** when your app runs on AWS — no internet hop
3. **Nova Lite handles 90% of use cases** — save Claude/GPT-4 for the hard 10%
4. **Data residency is a real differentiator** — especially for fintech handling sensitive financial data
5. **OpenAI has better DX** — Bedrock requires more boilerplate but gives you more control
6. **Model optionality is Bedrock's superpower** — you're not locked into one provider's pricing decisions`
      }
    ],
    cta: {
      text: 'Need help choosing the right AI infrastructure for your product?',
      href: '/contact'
    }
  },
  {
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
  },
  {
    slug: 'expo-av-audio-streaming-react-native',
    title: 'Streaming Audio in React Native: expo-av with Public Domain Sources',
    date: '2026-04-05',
    excerpt: 'A practical guide to building a streaming audio player in React Native with expo-av — background playback, progress tracking, and global player state with zero backend cost.',
    readingTime: '7 min read',
    keywords: ['expo-av audio streaming', 'react native audio player', 'expo audio background playback', 'react native music player', 'expo-av tutorial'],
    relatedProject: 'sanatanapp',
    sections: [
      {
        heading: 'Why expo-av Over react-native-track-player',
        content: `When I needed audio streaming for SanatanApp, the two main options were:

1. **react-native-track-player** — Feature-rich, supports notification controls, queue management. But it's a native module — requires custom dev client, adds build complexity, and is overkill for streaming from static URLs.

2. **expo-av** — Built into Expo managed workflow. Simpler API, supports background playback, works with \`expo prebuild\`. Less features, but fewer headaches.

I chose expo-av because SanatanApp uses Expo managed workflow. Adding a native module would have meant ejecting or setting up a custom dev client — complexity I didn't need for what is essentially "play audio from URL."

The trade-off: no lock-screen controls or notification media controls in v1. For a devotional app where most users play audio while on the app, this was acceptable.`
      },
      {
        heading: 'Global Audio Context',
        content: `Audio state needs to be global — the user might start playing Ramayan on the Home screen, then navigate to Library, then to Settings. The player must persist across all screens.

I use a React Context that wraps the entire app:

\`\`\`typescript
interface AudioState {
  sound: Audio.Sound | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>(initialState);

  const play = async (track: Track) => {
    // Unload previous sound
    if (state.sound) await state.sound.unloadAsync();

    // Configure audio mode for background playback
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.sourceUrl },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    setState(prev => ({ ...prev, sound, currentTrack: track, isPlaying: true }));
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setState(prev => ({
      ...prev,
      position: status.positionMillis,
      duration: status.durationMillis ?? 0,
      isPlaying: status.isPlaying,
    }));
  };

  // ... pause, seek, cleanup methods
}
\`\`\`

The key line is \`staysActiveInBackground: true\`. Without this, audio stops when the app goes to background — which is the default behavior on both iOS and Android.`
      },
      {
        heading: 'The MiniPlayer Pattern',
        content: `Every screen in SanatanApp has a persistent MiniPlayer bar at the bottom — showing the current track, a progress bar, and play/pause controls. This is rendered outside the navigation stack, above the bottom tab bar.

\`\`\`typescript
function MiniPlayer() {
  const { currentTrack, isPlaying, position, duration, togglePlay } = useAudio();

  if (!currentTrack) return null;

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.miniPlayer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: progress * 100 + '%' }]} />
      </View>
      <View style={styles.controls}>
        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
        <TouchableOpacity onPress={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
\`\`\`

This pattern is identical to how Spotify, Apple Music, and YouTube Music handle persistent playback — and users already understand it instinctively.`
      },
      {
        heading: 'Progress Persistence with expo-sqlite',
        content: `When a user is 45 minutes into a 2-hour Ramayan katha and closes the app, they expect to resume from that point tomorrow. I save playback position to SQLite on every status update (throttled to once per 5 seconds):

\`\`\`typescript
const saveProgress = throttle(async (contentId: string, position: number, duration: number) => {
  await db.runAsync(
    'INSERT OR REPLACE INTO progress (content_id, position, total, updated_at) VALUES (?, ?, ?, ?)',
    [contentId, Math.floor(position / 1000), Math.floor(duration / 1000), Date.now()]
  );
}, 5000);
\`\`\`

When loading a track, I check for saved progress and seek to it:

\`\`\`typescript
const saved = await db.getFirstAsync('SELECT position FROM progress WHERE content_id = ?', [track.id]);
if (saved) await sound.setPositionAsync(saved.position * 1000);
\`\`\`

This is a much better UX than most competing apps, which restart audio from the beginning every time.`
      },
      {
        heading: 'Public Domain Audio: Zero Cost CDN',
        content: `SanatanApp streams all audio from **Archive.org** and other public domain sources. This means:

- **$0/month hosting cost** — no S3 buckets, no CDN bills, no bandwidth charges
- **Legal clarity** — public domain recordings have no licensing restrictions
- **Reliable infrastructure** — Archive.org has been serving files since 1996

The audio source mapping is a simple JSON file:

\`\`\`json
[
  {
    "id": "ramayan-bal-kand",
    "title": "Bal Kand — Ramcharitmanas",
    "sourceUrl": "https://archive.org/download/...",
    "duration": 3600,
    "category": "ramayan",
    "kand": "bal"
  }
]
\`\`\`

Adding new audio content is a one-line JSON addition — no code changes, no redeployment needed. The app reads this file at startup and builds the Library screen from it.

The total infrastructure cost for SanatanApp is **$0/month**. No servers. No databases. No CDN. The only cost is the $25 one-time Google Play developer fee.`
      }
    ],
    cta: {
      text: 'Building a mobile app with audio or media features? I can help.',
      href: '/contact'
    }
  },
  {
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
  }
];

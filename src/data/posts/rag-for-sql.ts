import type { BlogPost } from '@/types/blog';

export const ragForSql: BlogPost = {
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
      content: `To improve LLM-to-SQL accuracy on production databases, use RAG with pgvector to retrieve only relevant table schemas instead of stuffing the entire schema into the prompt. Embed each table's metadata — column names, types, constraints, and sample data — as vectors, then retrieve the top-5 most relevant chunks based on the user's natural language question. This approach more than doubles SQL generation accuracy while cutting token usage by 75%.

Most text-to-SQL tutorials start with a simple idea: dump your database schema into the LLM prompt. For a toy database with 3 tables, this works fine. For a production database with 50+ tables, 200+ columns, and foreign key relationships — you're burning tokens and confusing the model.

I hit this wall building StellarMIND. The schema context was so large that GPT-4 would hallucinate column names, confuse similar table prefixes, and miss join conditions. The accuracy on complex queries dropped below 40%.

The root cause isn't the LLM — it's the retrieval. When you stuff everything into the prompt, the model has to figure out which 5% of the schema is relevant. That's a needle-in-a-haystack problem that language models are notoriously bad at.`
    },
    {
      heading: 'How Does RAG-Based Schema Retrieval Work?',
      content: `The fix is RAG (Retrieval-Augmented Generation) applied to schema metadata. Instead of sending the entire schema, you:

1. **Chunk** your schema into semantic units — one chunk per table, including column names, types, constraints, and sample values
2. **Embed** each chunk using an embedding model (we use OpenAI's text-embedding-3-small)
3. **Store** embeddings in pgvector alongside the original text
4. **Retrieve** the top-k most relevant chunks based on the user's natural language question
5. **Generate** SQL using only the retrieved context

This means when a user asks "What were last month's sales by region?", the retriever pulls only the \`sales\`, \`regions\`, and \`date_dim\` table schemas — not the entire 200-table dump.

**The chunking strategy matters more than most teams realize.** I experimented with three approaches: one chunk per column, one chunk per table, and one chunk per table group (tables connected by foreign keys). Per-column was too granular — the LLM would retrieve individual columns but miss the relationships between them. Per-table-group was too coarse — it pulled in irrelevant tables that happened to share a foreign key. One chunk per table with full column details, constraints, and sample rows hit the sweet spot: enough context for the LLM to understand the table structure, but narrow enough to avoid noise from unrelated tables.`
    },
    {
      heading: 'How Do You Implement RAG with Spring AI and pgvector?',
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

The retrieved documents go straight into the prompt as context, replacing the full schema dump.

**Embedding refresh strategy is worth planning upfront.** Database schemas evolve — new tables get added, columns get renamed, types change. If your embeddings go stale, the retriever returns outdated schema information and the LLM generates SQL against tables or columns that no longer exist. For StellarMIND, I run a nightly job that compares the current database schema (via \`information_schema\`) against the embedded metadata. If any table has changed, its embedding is regenerated. This adds minimal overhead — re-embedding a single table takes under a second — and ensures the vector store always reflects the live schema.`
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
      heading: 'How Do You Enforce Safety on LLM-Generated SQL?',
      content: `Accuracy isn't enough. An LLM generating SQL against your production database needs guardrails.

StellarMIND enforces read-only access at the query level — not just at the database role level. The generated SQL is parsed before execution, and only \`SELECT\` and \`WITH\` (CTE) statements are allowed. Any \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`DROP\`, or \`ALTER\` gets rejected before it touches the database.

This is defense-in-depth: even if the LLM hallucinates a destructive query, it never executes.

**Beyond statement-level filtering, I also enforce row-level limits and query timeouts.** Every generated query is wrapped in a \`LIMIT 1000\` clause to prevent accidental full-table scans on million-row tables. A 10-second query timeout kills any query that takes too long — this protects against expensive cross-joins the LLM might produce. The database connection used for LLM-generated queries is a separate connection pool with a dedicated read-only PostgreSQL role, so even if the SQL parser misses something, the database itself rejects writes. Three layers of protection: SQL parsing, query constraints, and database role permissions.`
    },
    {
      heading: 'Key Takeaways',
      content: `1. **Don't stuff schemas into prompts** — it wastes tokens and kills accuracy on real databases
2. **pgvector + Spring AI** is the simplest RAG stack for Java/Spring Boot teams
3. **Include sample data in embeddings** — column names alone aren't semantically rich enough
4. **Enforce read-only at the application layer** — database roles aren't sufficient for LLM-generated queries
5. **Measure accuracy on real queries** — toy benchmarks don't reflect production complexity`
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: What embedding model works best for database schema metadata?**

For schema metadata, OpenAI's text-embedding-3-small (1536 dimensions) offers the best balance of accuracy and cost. We tested it against text-embedding-3-large and found negligible accuracy improvement on schema retrieval tasks — the additional dimensions don't help because table metadata is relatively short and semantically dense. The key to good embeddings is not the model but the content: include column names, data types, constraints, foreign key relationships, and 2-3 sample rows per table. Sample data makes cryptic column names like rgn_cd semantically searchable.

**Q: How many schema chunks should you retrieve for each query (what is the optimal top-k)?**

For StellarMIND's 47-table database, top-5 retrieval was optimal. Top-3 missed relevant join tables on complex multi-table queries, leading to incomplete SQL. Top-10 introduced noise — irrelevant tables confused the LLM and reduced accuracy by about 8%. The ideal top-k depends on your schema complexity and average query complexity. Start with top-5, measure accuracy on your test suite, and adjust. If your queries rarely involve more than 2-3 tables, top-3 may suffice. If your schema has many interrelated tables, top-7 or top-8 might be needed.

**Q: Can RAG-based SQL generation handle complex queries with subqueries and CTEs?**

Yes, but accuracy drops on highly complex queries. On StellarMIND's test suite, simple single-table queries achieved 95% accuracy with RAG, two-table joins hit 88%, and complex queries with subqueries or CTEs dropped to around 72%. The main failure mode is the LLM generating syntactically valid but logically incorrect join conditions. To improve complex query accuracy, include foreign key relationships and join examples in your schema embeddings, and consider a validation step that explains the generated SQL back to the LLM for self-correction.

**Q: How does pgvector compare to dedicated vector databases like Pinecone or Weaviate for this use case?**

For schema retrieval in text-to-SQL, pgvector is the clear winner because your schema metadata and your actual data already live in PostgreSQL. Using pgvector means zero additional infrastructure, no data synchronization between systems, and sub-millisecond retrieval on collections under 10,000 vectors. A 200-table database produces roughly 200 vectors — pgvector handles this trivially. Dedicated vector databases like Pinecone shine when you have millions of vectors and need distributed search, but for schema retrieval use cases, they add unnecessary complexity and cost.

**Q: What happens when the LLM generates SQL that is syntactically correct but returns wrong results?**

This is the hardest problem in text-to-SQL and no solution fully eliminates it. StellarMIND mitigates it with a confidence scoring step: after generating SQL, the system asks the LLM to rate its own confidence (1-10) based on how well the retrieved schema matches the user's question. Queries scoring below 6 are flagged with a warning to the user. Additionally, for critical business queries, I recommend showing the generated SQL alongside the results so domain experts can verify the logic before acting on the data.`
    }
  ],
  cta: {
    text: 'Need a Chat-to-SQL system for your product?',
    href: '/contact'
  }
};

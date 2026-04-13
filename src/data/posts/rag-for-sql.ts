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
};

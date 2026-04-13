import type { BlogPost } from '@/types/blog';

export const springBootMcp: BlogPost = {
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
};

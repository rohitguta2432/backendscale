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
      content: `To build an MCP server with Spring Boot, add the spring-ai-mcp-server-spring-boot-starter dependency, annotate your service methods with @Tool, and configure stdio or HTTP/SSE transport in application.yml. Spring AI auto-discovers your tools and exposes them via the Model Context Protocol, letting any compatible AI assistant — Claude, GPT-4, or custom agents — call your backend functions without bespoke integration code.

The Model Context Protocol (MCP) is a standard for connecting AI assistants to external tools and data sources. Think of it as a USB-C for AI — a single protocol that lets any AI assistant call any tool, regardless of who built either side.

Before MCP, every AI integration was bespoke. Want Claude to query your database? Write a custom integration. Want GPT-4 to call your API? Build another one. MCP standardizes this into a single tool interface.

For backend engineers, this matters because your APIs and databases become tools that any AI assistant can use — not just the one you built for. The adoption curve is accelerating rapidly: as of early 2026, Claude Desktop, Cursor, Windsurf, and dozens of other AI tools support MCP natively. If your service exposes an MCP server, it is instantly accessible to every one of these clients without writing a single integration adapter.`
    },
    {
      heading: 'How Does MCP Architecture Work: Server vs Client?',
      content: `MCP uses a client-server model:

- **MCP Server**: Exposes tools (functions) that AI assistants can call. This is what you build.
- **MCP Client**: The AI assistant that discovers and invokes tools. Claude Desktop, for example, is an MCP client.
- **Transport**: How they communicate — stdio (local) or HTTP/SSE (remote).

In StellarMIND, the MCP server exposes a single tool: \`executeDataQuery\`. The AI assistant sends a natural language question, the tool converts it to SQL via RAG, executes it, and returns the results.

The server doesn't know or care which AI assistant is calling it. That's the power of the protocol.

**Understanding transport options is key to production deployments.** The stdio transport is straightforward: the MCP client spawns your server as a child process and communicates over standard input/output. This works well for local development and desktop tools like Claude Desktop. For production scenarios — where your MCP server runs on a remote machine, behind a load balancer, or serves multiple clients simultaneously — HTTP/SSE transport is the right choice. The client sends tool invocations as HTTP POST requests, and the server streams responses back via Server-Sent Events. Spring AI supports both transports with minimal configuration changes.`
    },
    {
      heading: 'How Do You Set Up a Spring Boot MCP Server?',
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

That's it. Spring AI auto-discovers \`@Tool\`-annotated methods and exposes them via the MCP protocol. No boilerplate, no custom serialization.

**A note on tool parameter design:** The \`@ToolParam\` annotation is where you communicate intent to the AI client. The description string is not just documentation — it is the primary signal the AI uses to decide what value to pass. Vague descriptions like "the input" lead to poor tool usage. Specific descriptions like "Natural language question about sales data, inventory, or customer metrics" help the AI match user intent to tool parameters accurately. Treat tool descriptions like API documentation for a non-human consumer — be precise about expected input format, valid ranges, and what the tool returns.`
    },
    {
      heading: 'How Do You Connect Your MCP Server to Claude Desktop?',
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

The stdio transport means Claude spawns your Java process locally. For production deployments, you'd switch to HTTP/SSE transport so the server runs remotely.

**Testing your MCP server before connecting it to an AI client is important.** You can test stdio-based MCP servers by piping JSON-RPC messages directly to stdin. The MCP specification defines a discovery endpoint (\`tools/list\`) that returns all available tools and their schemas. Call this first to verify your tool annotations are being picked up correctly. For HTTP/SSE transport, use curl or Postman to send tool invocation requests and verify the response format. Spring AI includes a built-in MCP test client that simplifies this process — it connects to your server, lists tools, and lets you invoke them programmatically from a JUnit test.`
    },
    {
      heading: 'Lessons Learned',
      content: `1. **Start with stdio transport** — it's simpler for development. Switch to HTTP for production.
2. **Tool descriptions matter enormously** — the AI uses the description to decide when to call your tool. Be specific.
3. **Return structured data, not strings** — the AI formats it better when it understands the structure.
4. **Spring AI's @Tool annotation is magical** — it handles JSON schema generation, parameter validation, and MCP compliance automatically.
5. **MCP is early but growing fast** — building MCP servers now gives you first-mover advantage in the AI tooling ecosystem.`
    },
    {
      heading: 'Frequently Asked Questions',
      content: `**Q: Can an MCP server expose multiple tools, or is it limited to one?**

An MCP server can expose any number of tools. Each method annotated with @Tool in your Spring Boot application becomes a separate tool that AI clients can discover and invoke independently. For example, StellarMIND exposes executeDataQuery for SQL generation, but you could add tools for getTableSchema, listDatabases, or exportResults in the same server. The AI client receives the full tool list during the discovery phase and chooses which tool to call based on the user's request and each tool's description.

**Q: What is the difference between stdio and HTTP/SSE transport for MCP?**

Stdio transport means the MCP client spawns your server as a local child process and communicates via standard input and output streams. This is simple and works well for desktop tools like Claude Desktop, but limits you to local execution. HTTP/SSE transport runs your server as a standalone web service that accepts tool invocations as HTTP POST requests and streams responses via Server-Sent Events. Use HTTP/SSE for production deployments where the server runs on remote infrastructure, needs to serve multiple clients, or sits behind a load balancer.

**Q: How does MCP handle authentication and security?**

The MCP specification itself does not define an authentication mechanism — security is handled at the transport layer. For stdio transport, security comes from the fact that the server runs locally as a child process. For HTTP/SSE transport, you should implement standard HTTP security: API keys in headers, OAuth 2.0 bearer tokens, or mutual TLS. In Spring Boot, this means adding Spring Security to your MCP server and configuring authentication filters that validate incoming requests before they reach your tool methods.

**Q: Is MCP only for database queries, or can it expose any backend functionality?**

MCP can expose any functionality your backend provides. Database queries are just one use case. You can build MCP tools for sending emails, creating calendar events, managing CI/CD pipelines, querying monitoring dashboards, generating reports, or calling third-party APIs. Any operation you can code in a Java method can become an MCP tool. The key consideration is designing clear tool descriptions and parameter schemas so that AI assistants understand when and how to invoke each tool correctly.

**Q: How does Spring AI's MCP support compare to building an MCP server from scratch?**

Building an MCP server from scratch requires implementing the JSON-RPC protocol, handling tool discovery responses, managing transport connections, and serializing tool parameters and results according to the MCP specification. Spring AI abstracts all of this behind the @Tool annotation and auto-configuration. You write a normal Java method, add an annotation, and Spring AI generates the JSON schema, handles protocol negotiation, manages the transport layer, and routes incoming invocations to your method. For Java teams, this reduces MCP server development from days to hours.`
    }
  ],
  cta: {
    text: 'Want to make your API accessible to AI assistants?',
    href: '/contact'
  }
};

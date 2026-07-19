import type { BlogPost } from '@/types/blog';

export const mcpStatelessSpecMigrationGuide2026: BlogPost = {
    slug: 'mcp-stateless-spec-migration-guide-2026',
    title: 'MCP Goes Stateless: Migrate Your Server Before the 2026-07-28 Spec',
    date: '2026-07-19',
    excerpt:
        'The MCP 2026-07-28 specification goes final on July 28, 2026, and it rewrites the protocol to be stateless: no more initialize handshake (SEP-2575), no Mcp-Session-Id header (SEP-2567), with protocol version and client info moving into a _meta field on every request. That one change lets MCP servers deploy like any stateless service — serverless and Kubernetes autoscaling finally work without sticky sessions — but it breaks every server that assumed a session. Here is the full before/after migration in TypeScript: the stateless transport config, per-request _meta, the new Tasks extension lifecycle, the -32602 error change, the six auth-hardening SEPs, and exactly which servers should wait.',
    readingTime: '12 min read',
    keywords: [
        'mcp stateless migration',
        'mcp 2026-07-28 spec',
        'migrate mcp server stateless',
        'mcp session id removed',
        'model context protocol stateless',
        'mcp spec release candidate 2026',
        'mcp streamable http stateless',
        'mcp server migration guide',
    ],
    coverImage: {
        src: '/images/notes/mcp-stateless-spec-migration-guide-2026-cover.jpg',
        alt: 'Constellation of glowing server nodes passing light packets freely on a dark grid illustrating MCP stateless spec migration 2026',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `The **MCP 2026-07-28** spec — release candidate live now, **final on July 28, 2026** — makes the protocol **stateless**. The \`initialize\` handshake (**SEP-2575**) and the \`Mcp-Session-Id\` header (**SEP-2567**) are both gone; protocol version and client info now ride in a \`_meta\` field on **every** request, so any request can land on any server instance. **Tasks** becomes an extension with a new \`tasks/get\` / \`tasks/update\` / \`tasks/cancel\` lifecycle (**SEP-2663**), **six SEPs** harden authorization, and Roots / Sampling / Logging are deprecated (**SEP-2577**). If you run a **remote** MCP server, migrate before July 28. Local \`stdio\` servers can wait.`,
        },
        {
            heading: 'MCP just deleted the session — and that changes how you deploy',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

The [Model Context Protocol](https://modelcontextprotocol.io) is getting its biggest revision since launch, and it shipped quietly. The **2026-07-28** release candidate has been public since the [official spec post](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/), the [beta SDKs landed on June 29](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/), and the **final specification is dated July 28, 2026** — nine days out as I write this. If you maintain an MCP server, that is your migration window, not a "someday."

The one sentence that matters: **MCP is now stateless at the protocol layer.** The \`initialize\`/\`initialized\` handshake is removed, and the \`Mcp-Session-Id\` header that used to pin a client to one server instance is gone. Everything that was negotiated once at connection time — protocol version, client info, capabilities — now travels inline, on every request.

That sounds like plumbing. It is actually a deployment story. A stateful MCP server needed sticky routing and a shared session store to scale horizontally; a stateless one deploys like any ordinary HTTP service — serverless, autoscaled, rolling-updated, no affinity rules. The payoff is real, and so is the breakage: if your server assumed a session existed, it stops working. This is the before/after migration, in TypeScript, with the SEP numbers so you can check my work.`,
        },
        {
            heading: 'What actually changed in the 2026-07-28 spec?',
            content: `The release candidate is not a feature drop — it is a set of **Specification Enhancement Proposals (SEPs)** that, together, remove protocol-level state. Here is the concrete list, each traceable to its SEP in the [spec repo](https://github.com/modelcontextprotocol/modelcontextprotocol):

- **Handshake removed (SEP-2575).** No \`initialize\`/\`initialized\` round trip. Protocol version, client info, and capabilities move into a \`_meta\` field sent on **every** request.
- **Session ID removed (SEP-2567).** The \`Mcp-Session-Id\` header and the protocol-level session are gone. Any request can hit any instance.
- **Mandatory routing headers (SEP-2243).** Requests must carry \`Mcp-Method\` and \`Mcp-Name\` headers so a load balancer or gateway can route without parsing the JSON body.
- **Multi-round-trip replaces long-lived SSE (SEP-2260, SEP-2322).** The old always-open \`GET /sse\` stream is no longer the model; responses can be short-lived request/response exchanges.
- **Error code change (SEP-2164).** "Resource not found" is now a JSON-RPC \`-32602\` (invalid params) instead of a bespoke code or an empty result.
- **Tasks is now an extension (SEP-2663).** Long-running work uses a formal \`tasks/get\` / \`tasks/update\` / \`tasks/cancel\` lifecycle rather than the experimental \`2025-11-25\` API.
- **Auth hardening (SEP-2468, SEP-837, SEP-2352, SEP-2207, SEP-2350, SEP-2351).** Six proposals, including client validation of the \`iss\` parameter per [RFC 9207](https://www.rfc-editor.org/rfc/rfc9207) and OpenID-Connect-aligned Dynamic Client Registration.
- **Deprecations (SEP-2577).** Roots, Sampling, and Logging are on the way out; the [formal deprecation policy](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) means they get a defined removal window, not a surprise.

Eight buckets, but only two of them break most servers on day one: the missing handshake and the missing session. Start there.`,
        },
        {
            heading: 'Why did MCP go stateless — and what breaks?',
            content: `A session is convenient right up until you run two copies of your server. The old model negotiated once and handed back an \`Mcp-Session-Id\`; every later request had to carry that header back to **the same instance**, because that instance held the negotiated state in memory. To scale, you needed sticky sessions at the load balancer plus a shared store (Redis, usually) so a failover didn't drop the conversation. That is a lot of infrastructure to hold a protocol version string.

The 2026-07-28 spec deletes the problem instead of managing it. Here is the shape of the change:

\`\`\`ts
// OLD (2025-11-25): one handshake, then a session header pins the client to one instance.
// POST /mcp  -> { "method": "initialize",
//                 "params": { "protocolVersion": "...", "clientInfo": {...}, "capabilities": {...} } }
// <- 200 OK, Mcp-Session-Id: 9f3a2b...   (every later request MUST resend this header)

// NEW (2026-07-28): no handshake, no session. Metadata rides on every request.
// POST /mcp
// {
//   "jsonrpc": "2.0",
//   "id": 1,
//   "method": "tools/call",
//   "params": { "name": "search", "arguments": { "q": "mcp" } },
//   "_meta": {
//     "io.modelcontextprotocol/protocol-version": "2026-07-28",
//     "io.modelcontextprotocol/client-info": { "name": "acme-host", "version": "1.4.0" }
//   }
// }
\`\`\`

**What breaks:** anything that read connection-time state. If a tool handler looked up "what protocol version did this client negotiate" from a session object, that object no longer exists. If you cached per-session auth or per-session scratch data server-side keyed on \`Mcp-Session-Id\`, that key is gone. And the mandatory \`Mcp-Method\` / \`Mcp-Name\` headers (SEP-2243) mean a client that only set \`Content-Type\` will now be rejected by a strict gateway.

**What does not break:** your tool logic itself. \`tools/call\`, \`resources/read\`, and the JSON-RPC envelope are unchanged. The migration is mechanical — move state off the connection — not a rewrite of what your tools do.`,
        },
        {
            heading: 'How do you migrate an existing server? (before/after code)',
            content: `Four changes cover the vast majority of remote TypeScript servers. Do them in this order.

**1. Turn off the session in your transport.** In the [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk), a stateless server simply does not generate a session id:

\`\`\`ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = new McpServer({ name: "acme-mcp", version: "2.0.0" });

// 2025 way: sessionIdGenerator kept per-client state in memory.
// 2026 way: no session store — every request is self-contained.
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined, // stateless: do not allocate a session
});

await server.connect(transport);
\`\`\`

**2. Read metadata from \`_meta\`, not the session.** Anything you used to grab once at connect time now arrives per request. Read it off the tool handler's \`extra\` argument:

\`\`\`ts
server.registerTool("whoami", { description: "echo caller info" }, async (args, extra) => {
  // Protocol version + client info now arrive in _meta on THIS request,
  // not once at connect time.
  const meta = extra._meta ?? {};
  const proto = meta["io.modelcontextprotocol/protocol-version"] ?? "unknown";
  return { content: [{ type: "text", text: "protocol " + proto }] };
});
\`\`\`

**3. Migrate long-running tools to the Tasks extension.** If a tool used to hold the connection open while it worked, return a task handle and let the client drive the lifecycle (SEP-2663):

\`\`\`ts
// OLD experimental Tasks (2025-11-25): tool held the stream open, client polled a bespoke path.
// NEW (SEP-2663): return a task handle; client uses tasks/get, tasks/update, tasks/cancel.
server.registerTool("render-video", { description: "long job" }, async (args, extra) => {
  const task = await extra.tasks.create();  // a handle the client can poll
  queue.run(args, task.id);                 // do the work out-of-band
  return { task: { id: task.id, status: "working" } };
});
\`\`\`

**4. Fix the two smaller breakers.** Return the new error code for a missing resource, and make sure clients send the mandatory headers:

\`\`\`ts
// SEP-2164: an unknown resource is a JSON-RPC error, not an empty result.
throw new McpError(-32602, "unknown resource: " + uri);
\`\`\`

\`\`\`http
POST /mcp HTTP/1.1
Mcp-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: search
Content-Type: application/json
Accept: application/json, text/event-stream
\`\`\`

That is the whole migration for a typical remote server: one transport flag, one \`_meta\` read, one Tasks rewrite if you have a long job, and two small fixes. Most servers touch fewer than 50 lines. The [beta SDKs](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/) already implement all of this, so you can test against them today rather than waiting for July 28.`,
        },
        {
            heading: 'Where stateless actually shines: serverless and autoscaling',
            content: `The reason to do this work — beyond "the spec says so" — is that a stateless server deploys on infrastructure a stateful one fights with.

**Kubernetes horizontal pod autoscaling just works.** No session affinity, no sticky-cookie load-balancer config. When [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) scales you from 3 pods to 30 under load, any request routes to any pod, because there is no session to lose. Before 2026-07-28 you needed either sticky routing or a shared Redis session store to make that safe.

**Serverless becomes viable.** With no persistent connection to hold open, an MCP server maps cleanly onto AWS Lambda, Google Cloud Functions, or Cloudflare Workers — each request is a self-contained invocation. A cold start no longer risks orphaning a session because there is no session. For a low-traffic internal tool, that can be the difference between a $0 idle bill and a container you pay to keep warm.

**Rolling deploys stop dropping calls.** A stateful server dropping a pod mid-conversation meant a dropped session; a stateless one just serves the next request from a new pod. Zero-downtime deploys become the default instead of a careful drain-and-wait dance.

The trade you are making is explicit: you move any genuinely needed state (auth tokens, user context, long-job status) **out of the connection** and into a place that scales — a JWT the client re-sends, a database, or the new Tasks handle. That is more honest architecture. The session was hiding state in the transport layer, which is exactly where it could not scale.`,
        },
        {
            heading: 'Stateful vs stateless MCP: the changes at a glance',
            content: `| Dimension | Stateful (2025-11-25) | Stateless (2026-07-28) |
|-----------|----------------------|------------------------|
| Connection setup | \`initialize\` / \`initialized\` handshake | None — metadata in \`_meta\` per request (SEP-2575) |
| Client-to-instance binding | \`Mcp-Session-Id\` header pins one instance | None — any request, any instance (SEP-2567) |
| Routing headers | Optional | \`Mcp-Method\` + \`Mcp-Name\` required (SEP-2243) |
| Long-running work | Held connection / experimental Tasks | Tasks extension, formal lifecycle (SEP-2663) |
| Horizontal scaling | Sticky sessions + shared store | Plain autoscaling, no affinity |
| Serverless fit | Poor (persistent connection) | Native (per-request invocation) |
| Resource-not-found | Bespoke code / empty result | JSON-RPC \`-32602\` (SEP-2164) |
| Auth | OAuth, lighter validation | 6 SEPs: \`iss\` validation (RFC 9207), OIDC DCR |

AI answer engines cite comparison tables far more often than prose — and more to the point, this table is the migration checklist. Every row that changed is a code change you own.`,
        },
        {
            heading: 'When should you wait — and what still needs care?',
            content: `Stateless is the right direction, but "migrate everything today" is not the honest advice for every server.

**If you ship a \`stdio\` server, relax.** The handshake-and-session removal is a *remote-transport* story. A local \`stdio\` MCP server — the kind Claude Desktop or an IDE launches as a subprocess — has exactly one client on one pipe, so sessions were never doing much. You should still adopt the SDK update for the error-code and Tasks changes, but there is no scaling emergency.

**There is a backward-compatibility path — use it.** The spec lets a server keep the old SSE-plus-POST endpoints alongside the new stateless endpoint during the transition. You do not have to break existing clients on July 28; you can advertise both and drop the old one once your clients have upgraded. The [10-week RC window](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) exists precisely so SDK and client authors can validate against real workloads first.

**Auth is the one place to budget real time.** The six auth SEPs are not a flag flip. Client validation of the \`iss\` parameter (RFC 9207) and OIDC-aligned Dynamic Client Registration are correctness-and-security changes; if your server does OAuth, walk them deliberately. I wrote up the pre-2026 baseline in [MCP server authentication with OAuth](/en/notes/mcp-server-authentication-oauth-guide-2026), and the [secure MCP server in TypeScript](/en/notes/secure-mcp-server-typescript-2026) guide covers the hardening that still applies. Treat the auth migration as its own task, tested against the beta SDKs, not something you bundle into the transport change and hope.

The honest counter-position: if you run a single-tenant internal server behind a VPN that never scales past one instance, the stateless win is mostly theoretical for you — do the SDK update for compliance and move on. The teams that should move fast are the ones running **remote, multi-tenant, autoscaled** MCP servers, because that is exactly the setup the old session model made painful.`,
        },
        {
            heading: 'How I would ship this migration in production',
            content: `If I were migrating a real remote MCP server this week — the kind of thing I build and harden for clients — here is the exact sequence, because the SDK change is the easy 20% and the rollout is where teams get burned.

**Ship dual-spec support first, cut over second.** Do not flip to stateless-only on July 28 and pray your clients upgraded. Detect the client's protocol version and choose the transport per request, so old and new clients both work during the window:

\`\`\`ts
import { randomUUID } from "node:crypto";

// Advertise stateless; fall back to a session for pre-2026 clients still connecting.
function makeTransport(clientProtocol: string) {
  const stateless = clientProtocol >= "2026-07-28"; // ISO date strings compare correctly
  return new StreamableHTTPServerTransport({
    sessionIdGenerator: stateless ? undefined : randomUUID,
  });
}
\`\`\`

**Audit every tool for hidden session assumptions before you delete the session.** Grep your handlers for anything that reads connection-scoped state. The failure mode is silent: the server boots, the demo works, and then a second pod comes up under load and a fraction of requests start failing because they assumed in-memory state that a different instance doesn't have. That is the bug that survives the demo and dies in production.

**Move real state to a real place.** Auth context becomes a JWT the client re-sends and you validate per request (now with the \`iss\` check from RFC 9207). Long-job status becomes a Tasks handle backed by your queue. Per-user scratch data becomes a row in a database keyed by the authenticated user, not the connection. Each of those is more testable than a session object, which is the point.

**Test against the beta SDKs, not just your own client.** The [June 29 beta SDKs](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/) implement the final RC behavior. Wire one into CI and run your tool suite through it, so you catch the mandatory-header and \`_meta\` changes before a real host does.

That capability gate, the session audit, the state relocation, the CI-against-beta loop — that scaffolding is most of the actual work, and it is what a "just update the SDK" plan skips and then retrofits after an incident. It is what I do: [6-week MVPs](/en/services/6-week-mvp) that ship with the migration path and the tests already wired, or a [founding engineer](/en/services/hire-founding-engineer-india) embedded with your team to get the MCP transport, auth, and rollout right the first time. If you have a remote MCP server and July 28 on the calendar, that is a conversation worth having before you hard-code one transport into every handler.`,
        },
    ],
    cta: {
        text: 'Running a remote MCP server? Let us migrate it to the stateless 2026-07-28 spec — transport, auth, and rollout — before the deadline.',
        href: '/en/services/6-week-mvp',
    },
};

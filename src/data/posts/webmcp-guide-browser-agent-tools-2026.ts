import type { BlogPost } from '@/types/blog';

export const webmcpGuideBrowserAgentTools2026: BlogPost = {
    slug: 'webmcp-guide-browser-agent-tools-2026',
    title: 'WebMCP Guide 2026: Turn Your Website Into Tools for Browser AI Agents',
    date: '2026-06-18',
    excerpt:
        'Google\'s WebMCP hit a public Chrome 149 origin trial this month, and it quietly changes how AI agents use your site: instead of scraping the DOM, your page hands the agent a typed list of things it can do. Here is the builder read — what WebMCP actually is, the exact document.modelContext API with copy-paste code, how it differs from MCP, the prompt-injection failure mode the tutorials skip, and whether you should ship it today (honest answer: register the API, gate the writes, wait on the trial).',
    readingTime: '11 min read',
    keywords: [
        'what is webmcp',
        'webmcp guide 2026',
        'webmcp vs mcp',
        'document.modelContext api',
        'make website ai agent ready',
        'webmcp chrome 149 origin trial',
        'browser ai agent tools',
    ],
    relatedProject: 'myFinancial',
    coverImage: {
        src: '/images/notes/webmcp-guide-browser-agent-tools-2026-cover.jpg',
        alt: 'A constellation of luminous nodes bridging two glowing orbs illustrating WebMCP browser agent tools in 2026',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**WebMCP is a proposed browser standard that lets your website expose its features to AI agents as typed, callable tools — instead of forcing the agent to scrape your DOM.** It went from a behind-a-flag preview in **Chrome 146 (February 2026)** to a **public origin trial in Chrome 149 (June 2026), running through Chrome 156** ([Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp)). You register tools on \`document.modelContext\` with a name, a JSON Schema, and an \`execute\` function. It is **complementary to MCP, not a replacement** — WebMCP is for the live tab, MCP is for your backend. Should you ship it? Register the API now, gate every state-changing tool behind a confirmation, and treat the spec as still-moving until the trial ends.`,
        },
        {
            heading: 'WebMCP Guide 2026: Turn Your Website Into Tools for Browser AI Agents',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

For two years the agentic-browsing story has been the same sad loop: an AI agent opens your site, takes a screenshot, guesses which pixels are a button, clicks, re-screenshots, guesses again. It is slow, it breaks the moment you ship a redesign, and it has no idea whether "Submit" charged a card or saved a draft. **WebMCP** — short for Web Model Context Protocol — is Google's answer, and as of this month it is no longer a demo: it is in a public [origin trial](https://developer.chrome.com/docs/ai/webmcp) you can run on real users.

The idea inverts who is in control. Instead of the agent reverse-engineering your interface, **your page hands the agent a list of exactly what it can do and the precise arguments each action needs.** "Add to cart" stops being a button an agent has to find and becomes a tool named \`add-to-cart\` with a typed schema. The agent calls it the way it would call any other tool — no DOM-guessing, no screenshots, no brittle selectors.

This is the builder's read, not a press-release recap. Below: what actually shipped in Chrome 149 (with the version numbers and the one API rename that will bite you), the real \`document.modelContext\` code for both the imperative and declarative APIs, an honest WebMCP-vs-MCP table so you stop conflating them, the security failure mode every tutorial glosses over, and the call I'd actually make — whether to wire this into a production site today.`,
        },
        {
            heading: 'What actually shipped: the Chrome 149 origin trial',
            content: `WebMCP is a **proposed web standard incubated in the W3C Web Machine Learning Community Group** ([webmachinelearning/webmcp on GitHub](https://github.com/webmachinelearning/webmcp)), co-developed in the open by Google and Microsoft. That governance detail matters: this is not a Chrome-only proprietary hook, it is a standards-track API that other browsers can adopt — though today Chrome is the only one shipping it.

The rollout timeline, with the numbers that pin it down:

- **Chrome 146 (February 2026)** — first early preview, behind a \`chrome://flags\` switch and Canary-only.
- **April 2026** — the Chrome team's broader early-preview push and DevTools tooling.
- **Chrome 149 (June 2026)** — graduated to a **public origin trial that runs through Chrome 156** ([Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp)). An origin trial is the part that changes your calculus: you register your origin, get a token, drop it in a meta tag, and **WebMCP runs for real users in production** — not just for you behind a flag.

There is one rename that will cost you an afternoon if you copied an early demo: **the API moved from \`navigator.modelContext\` to \`document.modelContext\`, and \`navigator.modelContext\` is deprecated as of Chrome 150.** Every snippet older than late spring 2026 uses the old surface. Use \`document.modelContext\` and you are on the current path.

The other shipped-this-cycle piece is debugging support: the **Model Context Tool Inspector** extension lets you see which tools a page has registered, manually invoke them, and verify your JSON Schema renders the inputs you expect — the equivalent of a Network tab for agent tools. If you build anything with WebMCP, install it first.`,
        },
        {
            heading: 'How WebMCP works: the imperative and declarative APIs',
            content: `WebMCP gives you two ways to expose a tool, and the right one depends on whether the action is "a form" or "a function."

**The imperative API** registers a tool in JavaScript through \`document.modelContext.registerTool()\`. You give it a stable \`name\`, a plain-language \`description\` the model reads, an \`inputSchema\` (standard JSON Schema), and an \`execute\` async function that does the work and returns a content object. Here is the canonical shape, lifted from the spec ([webmachinelearning/webmcp](https://github.com/webmachinelearning/webmcp)):

\`\`\`js
const controller = new AbortController();

await document.modelContext.registerTool({
  name: 'add-todo',
  description: "Add a new item to the user's active todo list",
  inputSchema: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'The text content of the todo item' },
    },
    required: ['text'],
  },
  annotations: {
    readOnlyHint: false,         // this tool mutates state
    untrustedContentHint: true,  // treat returned text as untrusted
  },
  async execute({ text }) {
    await addTodoItemToCollection(text);   // your real app logic
    return {
      content: [{ type: 'text', text: \\\`Added todo item: "\\\${text}" successfully.\\\` }],
    };
  },
}, { signal: controller.signal });
\`\`\`

Two things worth noticing. The \`execute\` function calls *your existing application logic* — \`addTodoItemToCollection\` is whatever function your "Add" button already calls. And you pass an \`AbortController\` signal, so when the page state changes you can tear the tool down cleanly. The companion methods on \`document.modelContext\` are \`getTools()\` to list what is registered, \`executeTool()\` to run one, and an \`addEventListener('toolchange', …)\` so the agent is notified when your tool set changes (think: a tool that only exists once the user is logged in).

**The declarative API** is the zero-JavaScript path for anything that is already a form. You annotate the \`<form>\` element with \`toolname\` and \`tooldescription\`, optionally describe each field with \`toolparamdescription\`, and the browser infers the input schema from the form controls:

\`\`\`html
<form toolname="search-flights"
      tooldescription="Search available flights between two cities on a date">
  <input name="from" toolparamdescription="Departure city, e.g. Delhi" />
  <input name="to" toolparamdescription="Arrival city, e.g. Singapore" />
  <input name="date" type="date" toolparamdescription="Travel date" />
  <button type="submit">Search</button>
</form>
\`\`\`

That is the whole thing — the form an agent can now fill and submit reliably is the same form your human users already use, which is exactly the point: **one source of truth for the action, two consumers.** (Angular already ships experimental WebMCP support if you want framework-level wiring rather than hand-rolled \`registerTool\` calls.)`,
        },
        {
            heading: 'Where WebMCP actually shines',
            content: `WebMCP is not a universal upgrade — it earns its keep in three specific shapes of problem.

**1. Multi-step flows that live behind authentication.** The agent is acting *inside the user's already-logged-in tab*, so it inherits the session. A "rebook this flight," "apply this coupon and re-checkout," or "file this expense" flow that would be a nightmare to expose as a public API works naturally as a WebMCP tool, because the auth is already solved by the user being there. This is the case where DOM-scraping agents fall apart and a typed tool wins cleanly.

**2. Apps where the UI changes faster than you can document it.** Because WebMCP tools bind to *application logic, not DOM structure*, an agent's ability to use your site survives a redesign. You can move the button, restyle the form, ship a new framework — as long as \`add-to-cart\` still calls the same function, the agent never notices. For any team shipping UI weekly, that decoupling is the real durability win.

**3. Latency-sensitive, in-tab actions.** WebMCP runs through the browser's internal machinery, so a tool call is **near-instant — there is no round trip to a remote MCP server** ([Chrome for Developers, "When to use WebMCP and MCP"](https://developer.chrome.com/blog/webmcp-mcp-usage)). For a conversational layer where the agent toggles UI state, filters a list, or reads what is currently on screen, that local-first speed is the difference between "snappy" and "why is it spinning."

The mental model I keep: **WebMCP is for the world the user can see in their tab right now.** If the action only makes sense in the context of *this page, this session, this state*, it is a WebMCP tool. If it makes sense headless, on a server, at 3am with no browser open — that is MCP's job, which brings us to the comparison everyone gets wrong.`,
        },
        {
            heading: 'WebMCP vs MCP: they are partners, not rivals',
            content: `The single biggest confusion in the WebMCP discourse is treating it as a competitor to Anthropic's [Model Context Protocol](/en/notes/spring-boot-mcp). It is not. They solve different halves of the same problem, and the official guidance is explicit that you use **both** ([Chrome for Developers](https://developer.chrome.com/blog/webmcp-mcp-usage)).

| | **WebMCP** | **MCP** |
|---|---|---|
| Lives in | The browser tab (frontend) | A server / backend |
| Lifetime | Ephemeral — tied to the open page | Persistent — always available |
| Transport | Browser-internal, no network hop | JSON-RPC over a transport |
| Context it has | The live DOM, session, what the user sees | Data sources, APIs, system tools |
| Auth model | Inherits the user's logged-in session | Server-side credentials |
| Built with | \`document.modelContext\`, HTML annotations | Language SDKs (TypeScript, Python, Rust) |
| Best for | In-tab interaction, UI-state actions | Headless data + actions, multi-platform |
| Breaks when | The tab closes | (Designed to stay up) |

The clean division of labour: **MCP is the foundation** — your server exposes the durable, platform-agnostic business logic so an agent on desktop, mobile, or cloud can reach it anytime. **WebMCP is the contextual layer** — when a user is actually on your site, it gives the in-tab agent a high-fidelity way to act on what is in front of them. A serious agentic product ships both: an MCP server for "do this anywhere" and WebMCP tools for "do this here, now, in my session." If you have already built an MCP server — I walked through one in [Spring Boot MCP server](/en/notes/spring-boot-mcp) — WebMCP is the front-end companion, not a thing you migrate to.`,
        },
        {
            heading: 'When to skip WebMCP (for now)',
            content: `Here is the part the implementation tutorials soft-pedal. WebMCP is genuinely exciting and you should still be cautious about betting a roadmap on it today.

**It is a single-browser origin trial, not a shipped standard.** Today this runs in Chrome (and Chromium derivatives) only. Safari and Firefox have not committed. An origin trial by definition is **time-boxed and the API can change** — this one runs Chrome 149 through 156, and the \`navigator\` → \`document\` rename mid-2026 is proof the surface is still moving. Anything you ship now, you may rewrite before it stabilizes.

**Adoption is effectively zero, and there is a chicken-and-egg gap.** One of the sharper community reads called it ["shipping a 0% adoption standard"](https://www.freecodecamp.org/news/a-developers-guide-to-webmcp/) — tools only matter if a browser agent is there to call them, and broad agent availability is still arriving. You are building for a consumer that mostly does not exist yet.

**The agent inherits the user's session — which is a feature and a loaded gun.** Because a WebMCP tool runs inside the authenticated tab, a tool that transfers money, deletes data, or changes a password is one model decision away from firing with the user's full privileges. That is not a reason to avoid WebMCP; it is a reason to design for it, which is the next section.

So: skip it as a *load-bearing* dependency for a launch this quarter. Do **not** skip it as something to prototype now — the teams who understand the security model early will ship the trustworthy version while everyone else is still scraping DOMs.`,
        },
        {
            heading: 'How I would ship WebMCP in production',
            content: `I have built [MCP servers](/en/notes/spring-boot-mcp) and shipped AI features that act on real user accounts, so the part that worries me about WebMCP is not the API — it is the blast radius. The API is a weekend; the safety model is the actual work. Here is how I would wire it.

**Treat every tool as read-only until proven otherwise.** WebMCP gives you an \`annotations\` object with \`readOnlyHint\` and \`untrustedContentHint\` for exactly this reason. Set \`readOnlyHint: true\` on anything that only reads state, and make state-changing tools the deliberate exception. The \`untrustedContentHint\` flag tells the agent that whatever your tool returns should be treated as untrusted input — critical, because a tool that echoes user-generated content (a comment, a product review) is a **prompt-injection vector**: a malicious string on your page could try to hijack the agent. Flag it.

**Gate every write behind a human confirmation.** The README will not tell you this, but it is the one rule that keeps WebMCP from becoming a confused-deputy hole. A tool that mutates anything — money, account settings, destructive deletes — should not silently execute inside \`execute()\`. It should require a UI confirmation the *user* clicks:

\`\`\`js
async execute({ amount, to }) {
  // Do NOT just transfer. Stage it and demand explicit human confirmation.
  const ok = await showConfirmationModal(
    \\\`Agent wants to send ₹\\\${amount} to \\\${to}. Approve?\\\`
  );
  if (!ok) {
    return { content: [{ type: 'text', text: 'Transfer cancelled by user.' }] };
  }
  await transfer(amount, to);
  return { content: [{ type: 'text', text: \\\`Sent ₹\\\${amount} to \\\${to}.\\\` }] };
}
\`\`\`

The agent proposes; the human disposes. For any tool touching money or identity, that confirmation is non-negotiable.

**Keep the schema tight and the descriptions honest.** The model picks tools off your \`description\` strings and validates arguments against your \`inputSchema\`. A loose schema (\`type: 'string'\` with no constraints) is an injection surface; a vague description gets your tool called in the wrong context. Constrain enums, set \`required\`, and write descriptions that say exactly when *not* to use the tool.

**Layer it, do not bet the farm on it.** Ship WebMCP as progressive enhancement: feature-detect \`document.modelContext\`, register tools when it exists, and make sure your site is fully usable without it. You get the upside for Chrome-agent users today and zero downside for everyone else — the same hedging discipline I bring to any [AI feature build](/en/services/ai-chatbot-development), where the integration that does not fall over matters more than the one that demos well.`,
        },
        {
            heading: 'FAQ: WebMCP',
            content: `**What is WebMCP?** WebMCP (Web Model Context Protocol) is a proposed browser standard that lets a website expose its features to AI agents as structured, typed tools through the \`document.modelContext\` API — so a browser agent calls a named function with a JSON Schema instead of scraping your DOM. It is in a public Chrome 149 origin trial as of June 2026.

**How is WebMCP different from MCP?** MCP connects agents to *backend* systems (servers, data, APIs) over JSON-RPC and is always available. WebMCP works inside the *live browser tab*, inherits the user's session, and is gone when the tab closes. They are complementary: MCP for headless/anywhere actions, WebMCP for in-tab/right-now actions.

**Is WebMCP available in Chrome today?** Yes — it is in a public origin trial from **Chrome 149 through Chrome 156**. You register your origin for a trial token to run it on real users. The earlier behind-a-flag preview started in Chrome 146 (Feb 2026). Note \`navigator.modelContext\` is deprecated since Chrome 150 — use \`document.modelContext\`.

**Do I need JavaScript to use WebMCP?** Not always. The declarative API turns an existing HTML \`<form>\` into a tool with \`toolname\`/\`tooldescription\`/\`toolparamdescription\` attributes. The imperative API (\`document.modelContext.registerTool\`) is for non-form actions and complex logic.

**Should I add WebMCP to my site now?** Prototype yes, depend-on-it no. It is Chrome-only, the spec is still moving, and agent adoption is early. Register the API as progressive enhancement, gate every state-changing tool behind a user confirmation, and keep the site fully functional without it.`,
        },
        {
            heading: 'Building an agent-ready product?',
            content: `WebMCP is the easy 20% — \`registerTool\` is a weekend. The hard 80% is the judgment: which actions are safe to expose, where the confirmation gates go, how WebMCP and an [MCP server](/en/notes/spring-boot-mcp) split the work, and how to ship it as progressive enhancement that does not break for the 95% of users who are not on a browser agent yet.

That is the part I do. If you are making a product agent-ready and want the version that is secure by design — not the demo that leaks the user's session — I ship production AI integrations in six weeks: [the 6-week MVP](/en/services/6-week-mvp). If you need someone embedded to own the whole agent stack end to end, that is [hire a founding engineer](/en/services/hire-founding-engineer-india). And if it is a conversational or assistant layer specifically, see [AI chatbot development](/en/services/ai-chatbot-development).`,
        },
    ],
    cta: {
        text: 'Make your product agent-ready in 6 weeks',
        href: '/en/services/6-week-mvp',
    },
};

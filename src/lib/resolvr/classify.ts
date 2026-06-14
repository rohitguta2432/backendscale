// Deterministic ticket classification. No LLM — same ticket always yields the
// same category/sentiment/priority, which is what the eval suite gates on.

import type { Category, Classification, Priority, Sentiment, Ticket } from "./types";

// Hard category signals run first and win outright — these are the categories the
// decision layer treats as must-escalate, so detection must be high-recall.
const HARD: { category: Category; patterns: RegExp[] }[] = [
    {
        category: "security",
        patterns: [
            /\bhack(ed|ing)?\b/, /\bbreach/, /\bcompromis/, /\bunauthor/, /\bphish/, /\bstole|stolen\b/,
            /\bfraud/, /someone\s+(else\s+)?(changed|accessed|logged|got into)/, /didn'?t\s+recognize/,
            /suspicious\s+(login|activity|sign)/, /account\s+was\s+(hacked|taken)/,
        ],
    },
    {
        category: "legal",
        patterns: [
            /\blawyer/, /\battorney/, /\blawsuit/, /\bsu(e|ing)\b/, /\bcourt\b/, /legal\s+action/,
            /\bgdpr\b/, /\bliable\b/, /litigat/, /\bsubpoena/, /\bdamages\b/,
        ],
    },
    {
        category: "abuse",
        patterns: [/\bf+u+c?k/, /\bsh[i\*]t\b/, /\bidiot/, /\bstupid\b/, /\bscam(mer)?\b/, /\bworst\b.*\bever\b/, /\bthreat(en)?/],
    },
];

// Specific categories compete on keyword count. "how_to" is intentionally NOT
// here — a phrasing like "how do I set up 2FA" is fundamentally an account
// request, so how_to only wins when no specific category matches at all.
const SOFT: { category: Category; keywords: string[] }[] = [
    { category: "refund", keywords: ["refund", "money back", "reimburse", "overcharged", "double charged", "double-charged", "charge back", "chargeback"] },
    { category: "billing", keywords: ["invoice", "receipt", "charged", "payment", "billing", "subscription", "card", "renew", "renewal", "cancel", "downgrade", "upgrade", "plan", "pricing", "seats"] },
    { category: "account", keywords: ["password", "log in", "login", "sign in", "signin", "2fa", "two-factor", "otp", "locked out", "reset", "username", "sso", "saml", "email address", "credentials"] },
    { category: "technical", keywords: ["error", "bug", "crash", "not working", "doesn't work", "broken", "fails", "failing", "500", "429", "api", "rate limit", "export", "import", "sync", "webhook", "loading", "slow"] },
];

const HOWTO = ["how do i", "how to", "how can i", "where do i", "where can i", "steps to", "tutorial", "set up", "configure", "enable", "get started"];

const ANGRY = [/\bgarbage\b/, /\bterrible\b/, /\buseless\b/, /\bunacceptable\b/, /\bridiculous\b/, /\bworst\b/, /\bawful\b/, /\bf+u+c?k/, /!!{1,}/];
const FRUSTRATED = [/\bstill\b/, /\bagain\b/, /\bfrustrat/, /\bannoy/, /\bdisappoint/, /third time/, /\bwhy (is|isn'?t|won'?t)/];
const URGENT = [/\burgent\b/, /\basap\b/, /immediately/, /right now/, /\bdown\b/, /outage/, /can'?t access/, /locked out/];

const INTENT: Record<Category, string> = {
    billing: "Resolve a billing question",
    technical: "Fix a technical problem",
    account: "Regain or change account access",
    how_to: "Learn how to do something",
    refund: "Request a refund",
    security: "Report a possible account compromise",
    legal: "Raise a legal or compliance matter",
    abuse: "Vent strong dissatisfaction",
    other: "Get general help",
};

function countMatches(text: string, keywords: string[]): number {
    let n = 0;
    for (const kw of keywords) if (text.includes(kw)) n += 1;
    return n;
}

export function classify(ticket: Ticket): Classification {
    const text = `${ticket.subject}\n${ticket.body}`.toLowerCase();

    let category: Category = "other";

    // 1) Hard signals (must-escalate categories) take precedence.
    outer: for (const h of HARD) {
        for (const p of h.patterns) {
            if (p.test(text)) {
                category = h.category;
                break outer;
            }
        }
    }

    // 2) Otherwise score the specific soft categories and take the strongest.
    if (category === "other") {
        let best = 0;
        for (const s of SOFT) {
            const score = countMatches(text, s.keywords) + (s.category === "refund" ? 0.5 : 0); // tie-break toward refund
            if (score > best) {
                best = score;
                category = s.category;
            }
        }
        // 3) No specific category matched — fall back to how_to, else other.
        if (category === "other" && HOWTO.some((p) => text.includes(p))) {
            category = "how_to";
        }
    }

    const sentiment: Sentiment = ANGRY.some((r) => r.test(text))
        ? "angry"
        : FRUSTRATED.some((r) => r.test(text))
          ? "frustrated"
          : "neutral";

    const urgent = URGENT.some((r) => r.test(text));
    const mustEscalate = category === "security" || category === "legal" || category === "abuse";
    const priority: Priority = mustEscalate || urgent
        ? "urgent"
        : sentiment === "angry"
          ? "high"
          : ticket.customerTier === "enterprise"
            ? "high"
            : sentiment === "frustrated"
              ? "medium"
              : "low";

    return { category, intent: INTENT[category], sentiment, priority };
}

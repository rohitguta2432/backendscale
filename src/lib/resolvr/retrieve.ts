// Deterministic knowledge-base retrieval — token-overlap scoring, no embeddings,
// no network. Returns the fraction of the ticket's meaningful tokens that each
// article covers, biased slightly toward the ticket's predicted category.

import { KB } from "./kb";
import type { Category, KBArticle, KBHit, Ticket } from "./types";

const STOP = new Set([
    "the", "a", "an", "i", "to", "do", "my", "me", "is", "it", "of", "for", "and", "on", "in", "you",
    "your", "we", "us", "how", "can", "this", "that", "with", "at", "be", "are", "was", "have", "has",
    "get", "want", "need", "please", "hi", "hello", "there", "but", "so", "if", "or", "as", "from",
    "im", "i'm", "ive", "i've", "ll", "would", "could", "should", "just", "now", "out", "up", "about",
]);

function tokens(s: string): string[] {
    return (s.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) || []).filter((t) => t.length > 1 && !STOP.has(t));
}

function articleHaystack(a: KBArticle): Set<string> {
    const t = new Set<string>();
    for (const w of tokens(`${a.title} ${a.body}`)) t.add(w);
    for (const kw of a.keywords) for (const w of tokens(kw)) t.add(w);
    return t;
}

export function retrieve(ticket: Ticket, category: Category, topN = 3): KBHit[] {
    const qTokens = tokens(`${ticket.subject} ${ticket.subject} ${ticket.body}`); // weight subject 2x
    const meaningful = Math.max(1, new Set(qTokens).size);

    const scored = KB.map((a) => {
        const hay = articleHaystack(a);
        const kwSet = new Set(a.keywords.flatMap((k) => tokens(k)));
        let raw = 0;
        const seen = new Set<string>();
        for (const q of qTokens) {
            if (seen.has(q)) continue;
            seen.add(q);
            if (kwSet.has(q)) raw += 1.5; // keyword hits count more
            else if (hay.has(q)) raw += 1;
        }
        if (a.category === category) raw *= 1.15; // category bias
        const score = Math.min(1, raw / meaningful);
        return { a, score };
    });

    return scored
        .filter((s) => s.score > 0)
        .sort((x, y) => y.score - x.score)
        .slice(0, topN)
        .map(({ a, score }) => ({
            id: a.id,
            title: a.title,
            score: Math.round(score * 100) / 100,
            snippet: a.body.length > 150 ? `${a.body.slice(0, 150).trimEnd()}…` : a.body,
        }));
}

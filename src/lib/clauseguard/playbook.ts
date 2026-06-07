// ClauseGuard clause playbook — the deterministic, offline core. Faithful
// TypeScript port of clauseguard/src/playbook.js. Runs with no API key, so it
// doubles as the free pre-screen and the reliability anchor the eval suite scores.

export type Severity = "high" | "medium" | "low";

export const SEVERITY_ORDER: Record<Severity, number> = { high: 3, medium: 2, low: 1 };

interface Rule {
    id: string;
    category: string;
    title: string;
    severity: Severity;
    patterns: RegExp[];
    why: string;
    redline: string;
}

interface AbsenceCheck {
    id: string;
    category: string;
    title: string;
    severity: Severity;
    present: RegExp[];
    why: string;
    redline: string;
}

export interface ClauseFinding {
    id: string;
    category: string;
    title: string;
    severity: Severity;
    quote: string;
    why: string;
    redline: string;
    source: "playbook";
}

export interface ScanStats {
    high: number;
    medium: number;
    low: number;
    total: number;
    riskLevel: "high" | "medium" | "low" | "clear";
}

export interface ScanResult {
    findings: ClauseFinding[];
    stats: ScanStats;
}

// Presence rules: if any pattern matches a clause, the clause is flagged.
// Patterns use the `i` flag only (never `g`) so `.test()` stays stateless.
export const RULES: Rule[] = [
    {
        id: "liability-uncapped",
        category: "Liability",
        title: "Uncapped / unlimited liability",
        severity: "high",
        patterns: [/unlimited liability/i, /\bunlimited\b[^.]*\bliab/i, /liable for all/i, /without limit(?:ation)? (?:as to|of)[^.]*liabilit/i],
        why: "You could be on the hook for losses far larger than the contract is worth, with no ceiling.",
        redline:
            "Cap total liability at the fees paid in the 12 months before the claim, and exclude indirect/consequential damages for both sides.",
    },
    {
        id: "indemnity-broad",
        category: "Liability",
        title: "Broad or one-sided indemnity",
        severity: "high",
        patterns: [/indemnif/i, /hold harmless/i, /defend[^.]*against any[^.]*claim/i],
        why: "A broad indemnity makes you cover the other side's legal costs and third-party claims — potentially open-ended.",
        redline:
            "Make indemnities mutual, limit them to claims arising from your own breach or negligence, and keep them inside the overall liability cap.",
    },
    {
        id: "ip-assignment-overreach",
        category: "Intellectual Property",
        title: "Over-broad IP assignment",
        severity: "high",
        patterns: [/assigns? all (?:right|rights)/i, /work made for hire/i, /all intellectual property/i, /moral rights/i, /assign[^.]*title and interest/i],
        why: "This can hand over IP you created before or outside this engagement, including reusable tools and templates.",
        redline:
            "Assign only the specific deliverables made for this client; carve out your pre-existing IP and general know-how, with a license back to the client.",
    },
    {
        id: "termination-onesided",
        category: "Termination",
        title: "One-sided termination for convenience",
        severity: "high",
        patterns: [/terminate[^.]*for any reason/i, /terminate[^.]*sole discretion/i, /terminate[^.]*at any time without/i, /terminate[^.]*without cause/i],
        why: "If only the other party can walk away at will, you carry all the risk of sudden cancellation.",
        redline:
            "Make termination-for-convenience mutual with equal notice (e.g., 30 days) and require payment for all work performed up to the termination date.",
    },
    {
        id: "payment-terms-long",
        category: "Payment",
        title: "Long payment terms (Net 60/90+)",
        severity: "medium",
        patterns: [/net\s*(?:60|75|90|120)/i, /payable within (?:sixty|ninety|one hundred)/i],
        why: "Long payment windows push the financing risk onto you and strain cash flow.",
        redline: "Shorten to Net 15–30, require a deposit up front, and add interest (e.g., 1.5%/month) on late payments.",
    },
    {
        id: "payment-withhold",
        category: "Payment",
        title: "Discretionary withholding / set-off / non-refundable",
        severity: "medium",
        patterns: [/withhold (?:any )?payment/i, /right to set-?off/i, /may set off/i, /non-?refundable/i],
        why: "Lets the other side hold back or keep money at their discretion, even for work you delivered.",
        redline: "Limit withholding to amounts genuinely in dispute and require the undisputed balance to be paid on time.",
    },
    {
        id: "auto-renewal",
        category: "Term",
        title: "Automatic renewal (evergreen)",
        severity: "medium",
        patterns: [/automatically renew/i, /auto-?renew/i, /evergreen/i, /renew[^.]*unless[^.]*notice/i],
        why: "The contract silently rolls over, often with a narrow cancellation window that is easy to miss.",
        redline: "Require opt-in renewal, or at least a 60-day advance reminder and a clear cancellation window before each renewal.",
    },
    {
        id: "unilateral-changes",
        category: "Term",
        title: "Unilateral changes to terms",
        severity: "medium",
        patterns: [/may (?:modify|change|amend) these terms at any time/i, /reserves the right to (?:modify|change|amend)/i, /in its sole discretion[^.]*(?:modify|change|amend)/i],
        why: "The other side can rewrite the deal after you've signed, without your agreement.",
        redline: "Require that any change be in writing and signed by both parties.",
    },
    {
        id: "non-compete",
        category: "Restrictions",
        title: "Non-compete restriction",
        severity: "high",
        patterns: [/non-?compete/i, /shall not[^.]*compete/i, /covenant not to compete/i],
        why: "A non-compete can limit your ability to work with other clients or in your field after the engagement.",
        redline: "Remove it, or narrow it tightly by scope, geography, and time (e.g., 6 months, named competitors only).",
    },
    {
        id: "non-solicit",
        category: "Restrictions",
        title: "Non-solicitation restriction",
        severity: "medium",
        patterns: [/non-?solicit/i, /shall not solicit/i, /not to solicit/i],
        why: "Can stop you from working with people or clients you meet through this engagement.",
        redline: "Limit it to actively soliciting the other party's employees, for a short period (e.g., 12 months).",
    },
    {
        id: "arbitration-classwaiver",
        category: "Disputes",
        title: "Mandatory arbitration / class-action waiver",
        severity: "medium",
        patterns: [/binding arbitration/i, /waive[^.]*(?:jury|class)/i, /class action waiver/i, /arbitration[^.]*sole[^.]*remedy/i],
        why: "You may be giving up the right to sue or join a class action; arbitration can be costly and private.",
        redline: "Make dispute resolution mutual and venue-neutral; preserve small-claims court and consider mediation first.",
    },
    {
        id: "jurisdiction-exclusive",
        category: "Disputes",
        title: "Exclusive foreign jurisdiction / venue",
        severity: "low",
        patterns: [/exclusive jurisdiction/i, /venue[^.]*shall be[^.]*(?:courts|county|state)/i],
        why: "A faraway mandatory venue makes any dispute expensive and inconvenient for you.",
        redline: "Choose a neutral or local jurisdiction, or agree on remote arbitration to avoid travel.",
    },
    {
        id: "confidentiality-perpetual",
        category: "Confidentiality",
        title: "Perpetual confidentiality obligation",
        severity: "low",
        patterns: [/in perpetuity/i, /survive[^.]*indefinitely/i, /perpetual[^.]*confidential/i],
        why: "Confidentiality with no end date is hard to comply with and unusual for ordinary information.",
        redline: "Limit confidentiality to a fixed term after termination (e.g., 3–5 years), except for genuine trade secrets.",
    },
    {
        id: "warranty-disclaimer",
        category: "Warranty",
        title: '"As is" / broad warranty disclaimer',
        severity: "low",
        patterns: [/\bas[ -]?is\b/i, /disclaims? all warrant/i, /no warrant(?:y|ies)/i, /without warrant/i],
        why: 'A strong "as is" disclaimer shifts all quality risk onto the buyer (or strips the seller\'s promises).',
        redline: "Keep a basic warranty that the work will conform to the agreed spec for a reasonable period.",
    },
    {
        id: "liquidated-damages",
        category: "Liability",
        title: "Liquidated damages / delay penalty",
        severity: "medium",
        patterns: [/liquidated damages/i, /penalt(?:y|ies) of/i, /\$[\d,]+ per day/i, /per day for each day/i],
        why: "Fixed penalties for delay can dwarf the contract value and trigger even for minor slips.",
        redline: "Cap any delay penalty (e.g., a % of fees with a hard maximum) and tie it to material, uncured delays only.",
    },
    {
        id: "assignment-without-consent",
        category: "Term",
        title: "Assignment without consent",
        severity: "low",
        patterns: [/assign[^.]*without[^.]*consent/i, /may assign this agreement/i, /freely assign/i],
        why: "The other party can transfer the contract to someone else (e.g., after an acquisition) without asking you.",
        redline: "Require mutual written consent to assign, with a narrow exception for genuine mergers/acquisitions.",
    },
];

// Absence checks: high-signal protective clauses whose ABSENCE is itself a risk.
export const ABSENCE_CHECKS: AbsenceCheck[] = [
    {
        id: "missing-liability-cap",
        category: "Liability",
        title: "No limitation-of-liability cap found",
        severity: "medium",
        present: [/limitation of liability/i, /liability[^.]*shall not exceed/i, /aggregate liability/i, /total liability[^.]*(?:limited|capped)/i],
        why: "Without an explicit cap, your exposure defaults to whatever a court decides — effectively uncapped.",
        redline: "Add a clause capping each party's total liability (e.g., to fees paid in the prior 12 months).",
    },
];

function clip(text: string, max: number): string {
    const t = text.replace(/\s+/g, " ").trim();
    return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

// Break a contract into clause-sized segments for quoting.
export function segmentize(text: string): string[] {
    return String(text || "")
        .replace(/\r\n?/g, "\n")
        .split(/\n+/)
        .flatMap((line) => line.split(/(?<=[.;:!?])\s+(?=["'(\[]?[A-Z0-9])/))
        .map((s) => s.trim())
        .filter(Boolean);
}

function riskLevel(stats: { high: number; medium: number; low: number }): ScanStats["riskLevel"] {
    if (stats.high > 0) return "high";
    if (stats.medium > 0) return "medium";
    if (stats.low > 0) return "low";
    return "clear";
}

// Run the deterministic scan. Returns { findings, stats } — stable + de-duplicated.
export function scanContract(text: string): ScanResult {
    const segments = segmentize(text);
    const findings: ClauseFinding[] = [];

    for (const rule of RULES) {
        let best = "";
        for (const seg of segments) {
            if (seg.length > best.length && rule.patterns.some((p) => p.test(seg))) {
                best = seg;
            }
        }
        if (best) {
            findings.push({
                id: rule.id,
                category: rule.category,
                title: rule.title,
                severity: rule.severity,
                quote: clip(best, 320),
                why: rule.why,
                redline: rule.redline,
                source: "playbook",
            });
        }
    }

    const whole = String(text || "");
    for (const check of ABSENCE_CHECKS) {
        if (!check.present.some((p) => p.test(whole))) {
            findings.push({
                id: check.id,
                category: check.category,
                title: check.title,
                severity: check.severity,
                quote: "(not present in the contract)",
                why: check.why,
                redline: check.redline,
                source: "playbook",
            });
        }
    }

    findings.sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]);

    const counts = {
        high: findings.filter((f) => f.severity === "high").length,
        medium: findings.filter((f) => f.severity === "medium").length,
        low: findings.filter((f) => f.severity === "low").length,
    };

    return {
        findings,
        stats: { ...counts, total: findings.length, riskLevel: riskLevel(counts) },
    };
}

// FinScope deterministic portfolio X-ray — ported from finscope/tools.py.
//
// COMPLIANCE: these analysers FLAG issues and EXPLAIN them. They never
// recommend buying, selling, or switching a specific instrument. Every flag
// ends with a question to take to a SEBI-registered RIA, never an instruction.
import { FUND_HOLDINGS, CATEGORY_MEDIANS, DISCLAIMER, BANNED_PHRASES } from "./data";

export type HoldingType = "equity_mf" | "debt_mf" | "stock" | "fd" | "gold" | "cash";

export interface Holding {
    instrument: string;
    type: HoldingType;
    amount: number;
    fund_id?: string | null;
    expense_ratio?: number | null;
    buy_date?: string | null; // ISO yyyy-mm-dd
}

export interface AnalyseInput {
    holdings: Holding[];
    age: number;
    risk?: "conservative" | "moderate" | "aggressive";
    monthly_expenses?: number | null;
    today?: string | null;
}

export interface Flag {
    dimension: "Allocation" | "Overlap" | "Tax" | "Expense" | "Concentration" | "Emergency fund";
    text: string;
    question: string;
}

export interface PortfolioReport {
    total: number;
    holdingsCount: number;
    allocationPct: Record<string, number>;
    targetEquityPct: number;
    band: [number, number];
    scores: {
        allocation: number;
        overlap: number;
        tax: number;
        expense: number;
        concentration: number;
        emergency_fund: number;
        overall: number;
    };
    expenseDragInr: number;
    ltcgHeadroomInr: number;
    flags: Flag[];
    narrative: string;
    disclaimer: string;
    compliance: { violations: number; clean: boolean; matched: string[] };
}

const MS_PER_DAY = 86_400_000;
const round = (x: number, n = 0): number => {
    const f = 10 ** n;
    return Math.round(x * f) / f;
};
const inr = (x: number): string => Math.trunc(x).toLocaleString("en-IN");

function parseDate(s: string | null | undefined): Date | null {
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
}

// --- Allocation: actual equity vs the (110 - age) rule-of-thumb band ---
function analyzeAllocation(holdings: Holding[], age: number, risk: string) {
    const total = holdings.reduce((s, h) => s + h.amount, 0);
    const buckets: Record<string, number> = { equity: 0, debt: 0, gold: 0, cash: 0, other: 0 };
    for (const h of holdings) {
        if (h.type === "equity_mf" || h.type === "stock") buckets.equity += h.amount;
        else if (h.type === "debt_mf" || h.type === "fd") buckets.debt += h.amount;
        else if (h.type === "gold") buckets.gold += h.amount;
        else if (h.type === "cash") buckets.cash += h.amount;
        else buckets.other += h.amount;
    }
    const pcts: Record<string, number> = {};
    for (const [k, v] of Object.entries(buckets)) pcts[k] = total ? round((v / total) * 100, 1) : 0;

    const riskAdj = ({ conservative: -10, moderate: 0, aggressive: 10 } as Record<string, number>)[risk] ?? 0;
    const targetEquity = Math.max(0, Math.min(100, 110 - age + riskAdj));
    const bandLow = Math.max(0, targetEquity - 10);
    const bandHigh = Math.min(100, targetEquity + 10);
    const actualEquity = pcts.equity;
    const drift = round(actualEquity - targetEquity, 1);
    const flagDrift = !(bandLow <= actualEquity && actualEquity <= bandHigh);

    const flags: Flag[] = [];
    if (flagDrift && total > 0) {
        const direction = drift > 0 ? "overweight" : "underweight";
        flags.push({
            dimension: "Allocation",
            text: `Equity is ${actualEquity}% of the portfolio vs a rule-of-thumb band of ${bandLow}%–${bandHigh}% for age ${age} (${risk} risk) — ${Math.abs(drift)} pp ${direction} equity.`,
            question: "Does my equity allocation match my actual risk capacity and goals?",
        });
    }
    return { total, pcts, targetEquity, band: [bandLow, bandHigh] as [number, number], drift, flags };
}

// --- Overlap: Jaccard overlap of two funds' top holdings, flagged at ≥40% ---
function detectOverlap(holdings: Holding[]) {
    const mfRows = holdings.filter((h) => (h.type === "equity_mf" || h.type === "debt_mf") && h.fund_id);
    const pairs: { a: string; b: string; overlapPct: number; shared: string[]; flagged: boolean }[] = [];
    for (let i = 0; i < mfRows.length; i++) {
        for (let j = i + 1; j < mfRows.length; j++) {
            const a = mfRows[i];
            const b = mfRows[j];
            const aStocks = new Set(FUND_HOLDINGS[a.fund_id!]?.top_holdings ?? []);
            const bStocks = new Set(FUND_HOLDINGS[b.fund_id!]?.top_holdings ?? []);
            if (aStocks.size === 0 || bStocks.size === 0) continue;
            const shared = [...aStocks].filter((s) => bStocks.has(s)).sort();
            const union = new Set([...aStocks, ...bStocks]);
            const jaccard = union.size ? round((shared.length / union.size) * 100, 1) : 0;
            pairs.push({ a: a.instrument, b: b.instrument, overlapPct: jaccard, shared, flagged: jaccard >= 40 });
        }
    }
    const flags: Flag[] = [];
    for (const p of pairs) {
        if (!p.flagged) continue;
        const list = p.shared.slice(0, 5).join(", ") + (p.shared.length > 5 ? "…" : "");
        flags.push({
            dimension: "Overlap",
            text: `${p.a} and ${p.b} share ${p.overlapPct}% of their top holdings (${list}). Holding both may not add the diversification you expect.`,
            question: "Are these two funds genuinely diversifying my portfolio?",
        });
    }
    return { pairs, flags };
}

// --- Tax: STCG holding-period flags + LTCG harvesting headroom (educational) ---
function findTaxLeakage(holdings: Holding[], today: Date) {
    const flags: Flag[] = [];
    let totalEquityGains = 0;
    for (const h of holdings) {
        const buy = parseDate(h.buy_date);
        if (!buy) continue;
        const heldDays = Math.floor((today.getTime() - buy.getTime()) / MS_PER_DAY);
        const heldYears = heldDays / 365.25;
        if (h.type === "debt_mf" && heldYears < 3) {
            flags.push({
                dimension: "Tax",
                text: `${h.instrument} held ${heldDays} days (< 3 years) — gains are taxed at your income-slab rate (STCG on debt).`,
                question: "Does the post-tax return still meet my goal?",
            });
        } else if ((h.type === "equity_mf" || h.type === "stock") && heldYears > 0 && heldYears < 1) {
            flags.push({
                dimension: "Tax",
                text: `${h.instrument} held ${heldDays} days (< 1 year) — short-term capital gains are taxed at 15%.`,
                question: "Is the short-term churn intentional?",
            });
        } else if ((h.type === "equity_mf" || h.type === "stock") && heldYears >= 1) {
            const estCurrent = h.amount * 1.12 ** heldYears; // 12% CAGR, illustration only
            totalEquityGains += Math.max(0, estCurrent - h.amount);
        }
    }
    const ltcgExemption = 100_000;
    const headroom = Math.max(0, ltcgExemption - totalEquityGains);
    if (totalEquityGains >= 0 && totalEquityGains < ltcgExemption) {
        flags.push({
            dimension: "Tax",
            text: `Estimated unrealised long-term equity gains ≈ ₹${inr(totalEquityGains)} vs the ₹1,00,000 annual LTCG exemption — about ₹${inr(headroom)} of exemption may be unused this year.`,
            question: "Should I harvest gains before year-end to use the LTCG exemption?",
        });
    }
    return { flags, headroom: round(headroom, 2) };
}

// --- Expense: above-median expense ratio and the annual ₹ drag it creates ---
function expenseLeakage(holdings: Holding[]) {
    const flags: Flag[] = [];
    let totalDrag = 0;
    for (const h of holdings) {
        if ((h.type !== "equity_mf" && h.type !== "debt_mf") || h.expense_ratio == null) continue;
        const category = (h.fund_id && FUND_HOLDINGS[h.fund_id]?.category) || "unknown";
        const median = CATEGORY_MEDIANS[category] ?? CATEGORY_MEDIANS.unknown;
        const er = h.expense_ratio;
        const excess = round(er - median, 3);
        const annualDrag = excess > 0 ? round((h.amount * excess) / 100, 2) : 0;
        totalDrag += annualDrag;
        if (er > median) {
            flags.push({
                dimension: "Expense",
                text: `${h.instrument} has an expense ratio of ${er.toFixed(2)}% vs a category median of ${median.toFixed(2)}% — roughly ₹${inr(annualDrag)}/yr of drag on a ₹${inr(h.amount)} corpus.`,
                question: "Is there a lower-cost option in the same category?",
            });
        }
    }
    return { flags, totalDrag: round(totalDrag, 2) };
}

export function analysePortfolio(input: AnalyseInput): PortfolioReport {
    const holdings = input.holdings;
    const age = input.age;
    const risk = input.risk ?? "moderate";
    const monthlyExpenses = input.monthly_expenses ?? null;
    const today = parseDate(input.today) ?? new Date();
    const concentrationThreshold = 20;

    const alloc = analyzeAllocation(holdings, age, risk);
    const overlap = detectOverlap(holdings);
    const tax = findTaxLeakage(holdings, today);
    const expense = expenseLeakage(holdings);
    const total = alloc.total;

    // --- per-dimension scores (0-100) ---
    const allocationScore = Math.max(0, 100 - Math.trunc(Math.abs(alloc.drift) * 3));
    const flaggedPairs = overlap.pairs.filter((p) => p.flagged).length;
    const overlapScore = Math.max(0, 100 - flaggedPairs * 25);
    const taxScore = Math.max(0, 100 - tax.flags.length * 20);
    const dragPct = total ? (expense.totalDrag / total) * 100 : 0;
    const expenseScore = Math.max(0, 100 - Math.trunc(dragPct * 40));

    const concentrationFlags: Flag[] = [];
    let concentrationScore = 100;
    if (total > 0) {
        for (const h of holdings) {
            const pct = (h.amount / total) * 100;
            if (pct >= concentrationThreshold) {
                concentrationFlags.push({
                    dimension: "Concentration",
                    text: `${h.instrument} is ${pct.toFixed(1)}% of the portfolio (threshold ${concentrationThreshold}%).`,
                    question: "Am I taking excess single-instrument risk?",
                });
                concentrationScore = Math.max(0, concentrationScore - Math.trunc(pct));
            }
        }
    }

    const emergencyFlags: Flag[] = [];
    let emergencyScore = 100;
    if (monthlyExpenses && monthlyExpenses > 0) {
        const liquid = holdings.filter((h) => h.type === "cash" || h.type === "fd").reduce((s, h) => s + h.amount, 0);
        const months = liquid / monthlyExpenses;
        if (months < 3) {
            emergencyFlags.push({
                dimension: "Emergency fund",
                text: `Liquid assets (cash + FD) cover ${months.toFixed(1)} months of expenses vs a recommended ≥ 3–6 months.`,
                question: "How much liquidity buffer do I need given my situation?",
            });
            emergencyScore = Math.max(0, Math.trunc((months / 6) * 100));
        }
    }

    const overall = Math.trunc(
        allocationScore * 0.2 +
            overlapScore * 0.15 +
            taxScore * 0.15 +
            expenseScore * 0.15 +
            concentrationScore * 0.2 +
            emergencyScore * 0.15,
    );

    // Report order mirrors generate_report: allocation, overlap, tax, expense, concentration, emergency.
    const flags: Flag[] = [
        ...alloc.flags,
        ...overlap.flags,
        ...tax.flags,
        ...expense.flags,
        ...concentrationFlags,
        ...emergencyFlags,
    ];

    const narrative =
        `Across ${holdings.length} holdings worth ₹${inr(total)}, this X-ray surfaced ${flags.length} ` +
        `educational observation${flags.length === 1 ? "" : "s"} and an overall health score of ${overall}/100. ` +
        `Each observation flags something to understand, not an action to take — use the question beside each flag ` +
        `to start a conversation with a SEBI-registered RIA.`;

    // Hard compliance gate: no output may contain advice language.
    const haystack = (narrative + " " + flags.map((f) => `${f.text} ${f.question}`).join(" ")).toLowerCase();
    const matched = BANNED_PHRASES.filter((p) => haystack.includes(p));

    return {
        total,
        holdingsCount: holdings.length,
        allocationPct: alloc.pcts,
        targetEquityPct: alloc.targetEquity,
        band: alloc.band,
        scores: {
            allocation: allocationScore,
            overlap: overlapScore,
            tax: taxScore,
            expense: expenseScore,
            concentration: concentrationScore,
            emergency_fund: emergencyScore,
            overall,
        },
        expenseDragInr: expense.totalDrag,
        ltcgHeadroomInr: tax.headroom,
        flags,
        narrative,
        disclaimer: DISCLAIMER,
        compliance: { violations: matched.length, clean: matched.length === 0, matched },
    };
}

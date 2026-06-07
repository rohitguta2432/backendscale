import { NextResponse } from "next/server";
import { analysePortfolio, type Holding } from "@/lib/finscope/analyse";

export const runtime = "nodejs";

const MAX_HOLDINGS = 50;
const VALID_TYPES = new Set(["equity_mf", "debt_mf", "stock", "fd", "gold", "cash"]);

// Deterministic offline portfolio X-ray — runs with no API key. Same input
// always yields the same flags and scores.
export async function POST(request: Request) {
    let body: { holdings?: unknown; age?: unknown; risk?: unknown; monthly_expenses?: unknown; today?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    if (!Array.isArray(body.holdings) || body.holdings.length === 0) {
        return NextResponse.json({ error: "holdings must be a non-empty array" }, { status: 400 });
    }
    if (body.holdings.length > MAX_HOLDINGS) {
        return NextResponse.json({ error: `holdings is limited to ${MAX_HOLDINGS} rows` }, { status: 400 });
    }
    if (typeof body.age !== "number" || body.age < 1 || body.age > 120) {
        return NextResponse.json({ error: "age must be a number between 1 and 120" }, { status: 400 });
    }

    const holdings: Holding[] = [];
    for (const raw of body.holdings as Record<string, unknown>[]) {
        if (!raw || typeof raw.instrument !== "string" || typeof raw.type !== "string" || !VALID_TYPES.has(raw.type)) {
            return NextResponse.json({ error: "each holding needs an instrument and a valid type" }, { status: 400 });
        }
        if (typeof raw.amount !== "number" || !Number.isFinite(raw.amount) || raw.amount < 0) {
            return NextResponse.json({ error: "each holding needs a non-negative numeric amount" }, { status: 400 });
        }
        holdings.push({
            instrument: raw.instrument.slice(0, 120),
            type: raw.type as Holding["type"],
            amount: raw.amount,
            fund_id: typeof raw.fund_id === "string" ? raw.fund_id : null,
            expense_ratio: typeof raw.expense_ratio === "number" ? raw.expense_ratio : null,
            buy_date: typeof raw.buy_date === "string" ? raw.buy_date : null,
        });
    }

    const report = analysePortfolio({
        holdings,
        age: body.age,
        risk: body.risk === "conservative" || body.risk === "aggressive" ? body.risk : "moderate",
        monthly_expenses: typeof body.monthly_expenses === "number" ? body.monthly_expenses : null,
        today: typeof body.today === "string" ? body.today : null,
    });

    return NextResponse.json(report);
}

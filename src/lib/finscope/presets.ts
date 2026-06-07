// Ready-to-run portfolios for the on-site demo — the full sample CSV plus the
// fixtures the eval suite scores against. `today` is pinned per preset so each
// one deterministically demonstrates its flag.
import type { Holding } from "./analyse";

export interface PortfolioPreset {
    id: string;
    label: string;
    blurb: string;
    age: number;
    risk: "conservative" | "moderate" | "aggressive";
    monthlyExpenses: number | null;
    today: string;
    holdings: Holding[];
}

export const PRESETS: PortfolioPreset[] = [
    {
        id: "full_sample",
        label: "Full sample portfolio",
        blurb: "9 holdings across equity, debt, gold & cash",
        age: 35,
        risk: "moderate",
        monthlyExpenses: 60000,
        today: "2026-01-01",
        holdings: [
            { instrument: "Mirae Asset Large Cap Fund", type: "equity_mf", amount: 250000, fund_id: "mirae_large_cap", expense_ratio: 0.54, buy_date: "2022-03-15" },
            { instrument: "Axis Bluechip Fund", type: "equity_mf", amount: 200000, fund_id: "axis_bluechip", expense_ratio: 0.42, buy_date: "2023-01-20" },
            { instrument: "HDFC Mid Cap Opportunities", type: "equity_mf", amount: 150000, fund_id: "hdfc_midcap", expense_ratio: 1.62, buy_date: "2023-06-10" },
            { instrument: "SBI Debt Fund", type: "debt_mf", amount: 100000, fund_id: "sbi_debt", expense_ratio: 0.85, buy_date: "2024-08-01" },
            { instrument: "Reliance Industries", type: "stock", amount: 80000, buy_date: "2024-09-15" },
            { instrument: "Tata Steel", type: "stock", amount: 30000, buy_date: "2025-01-10" },
            { instrument: "Gold ETF", type: "gold", amount: 50000, buy_date: "2022-11-01" },
            { instrument: "FD HDFC Bank", type: "fd", amount: 120000, buy_date: null },
            { instrument: "Cash Savings", type: "cash", amount: 40000, buy_date: null },
        ],
    },
    {
        id: "overlap_large_cap_pair",
        label: "Two large-caps (overlap)",
        blurb: "Two large-cap funds with heavy top-holdings overlap",
        age: 35,
        risk: "moderate",
        monthlyExpenses: null,
        today: "2026-01-01",
        holdings: [
            { instrument: "Mirae Asset Large Cap Fund", type: "equity_mf", amount: 200000, fund_id: "mirae_large_cap", expense_ratio: 0.54, buy_date: "2022-03-15" },
            { instrument: "Axis Bluechip Fund", type: "equity_mf", amount: 200000, fund_id: "axis_bluechip", expense_ratio: 0.42, buy_date: "2023-01-20" },
            { instrument: "FD HDFC Bank", type: "fd", amount: 100000, buy_date: null },
        ],
    },
    {
        id: "concentration_single_stock",
        label: "Single-stock heavy",
        blurb: "One stock dominating the portfolio",
        age: 35,
        risk: "moderate",
        monthlyExpenses: null,
        today: "2026-01-01",
        holdings: [
            { instrument: "Reliance Industries", type: "stock", amount: 300000, buy_date: "2023-01-01" },
            { instrument: "Mirae Asset Large Cap Fund", type: "equity_mf", amount: 100000, fund_id: "mirae_large_cap", expense_ratio: 0.54, buy_date: "2022-06-01" },
            { instrument: "FD HDFC Bank", type: "fd", amount: 100000, buy_date: null },
        ],
    },
    {
        id: "allocation_drift_overweight_equity",
        label: "Age 55, equity-heavy",
        blurb: "Heavy equity for age 55 → allocation drift",
        age: 55,
        risk: "moderate",
        monthlyExpenses: null,
        today: "2026-01-01",
        holdings: [
            { instrument: "Mirae Asset Large Cap Fund", type: "equity_mf", amount: 400000, fund_id: "mirae_large_cap", expense_ratio: 0.54, buy_date: "2021-01-10" },
            { instrument: "Axis Bluechip Fund", type: "equity_mf", amount: 350000, fund_id: "axis_bluechip", expense_ratio: 0.42, buy_date: "2021-06-01" },
            { instrument: "FD HDFC Bank", type: "fd", amount: 50000, buy_date: null },
        ],
    },
    {
        id: "high_expense_ratio",
        label: "High-cost mid-cap",
        blurb: "Mid-cap fund well above its category median cost",
        age: 35,
        risk: "moderate",
        monthlyExpenses: null,
        today: "2026-01-01",
        holdings: [
            { instrument: "HDFC Mid Cap Opportunities", type: "equity_mf", amount: 200000, fund_id: "hdfc_midcap", expense_ratio: 1.62, buy_date: "2023-06-10" },
            { instrument: "Cash Savings", type: "cash", amount: 50000, buy_date: null },
        ],
    },
    {
        id: "clean_portfolio_no_flags",
        label: "Balanced (clean)",
        blurb: "Well-diversified, age-appropriate — few flags",
        age: 35,
        risk: "moderate",
        monthlyExpenses: null,
        today: "2026-01-01",
        holdings: [
            { instrument: "Mirae Asset Large Cap Fund", type: "equity_mf", amount: 150000, fund_id: "mirae_large_cap", expense_ratio: 0.54, buy_date: "2022-01-01" },
            { instrument: "HDFC Mid Cap Opportunities", type: "equity_mf", amount: 80000, fund_id: "hdfc_midcap", expense_ratio: 1.1, buy_date: "2022-06-01" },
            { instrument: "SBI Debt Fund", type: "debt_mf", amount: 100000, fund_id: "sbi_debt", expense_ratio: 0.4, buy_date: "2021-01-01" },
            { instrument: "Gold ETF", type: "gold", amount: 40000, buy_date: "2022-01-01" },
            { instrument: "Cash Savings", type: "cash", amount: 80000, buy_date: null },
        ],
    },
];

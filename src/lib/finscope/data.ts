// FinScope reference data — ported from finscope/data/*.json.
export interface FundInfo {
    name: string;
    category: string;
    top_holdings: string[];
}

export const FUND_HOLDINGS: Record<string, FundInfo> = {
    mirae_large_cap: {
        name: "Mirae Asset Large Cap Fund",
        category: "equity_large_cap",
        top_holdings: ["Reliance Industries", "HDFC Bank", "Infosys", "ICICI Bank", "TCS", "L&T", "Kotak Mahindra Bank", "Axis Bank", "SBI", "HUL"],
    },
    axis_bluechip: {
        name: "Axis Bluechip Fund",
        category: "equity_large_cap",
        top_holdings: ["Reliance Industries", "HDFC Bank", "Infosys", "ICICI Bank", "TCS", "Bajaj Finance", "HUL", "Asian Paints", "Maruti Suzuki", "Titan"],
    },
    hdfc_midcap: {
        name: "HDFC Mid Cap Opportunities",
        category: "equity_mid_cap",
        top_holdings: ["Voltas", "Coforge", "Persistent Systems", "Mphasis", "Ashok Leyland", "Federal Bank", "Crompton Greaves", "PI Industries", "Trent", "V-Guard"],
    },
    sbi_debt: { name: "SBI Debt Fund", category: "debt_short_term", top_holdings: [] },
    icici_large_cap: {
        name: "ICICI Prudential Bluechip Fund",
        category: "equity_large_cap",
        top_holdings: ["Reliance Industries", "HDFC Bank", "Infosys", "ICICI Bank", "TCS", "L&T", "Bharti Airtel", "Kotak Mahindra Bank", "SBI", "HUL"],
    },
};

export const CATEGORY_MEDIANS: Record<string, number> = {
    equity_large_cap: 0.85,
    equity_mid_cap: 1.2,
    equity_small_cap: 1.5,
    equity_elss: 1.1,
    debt_short_term: 0.4,
    debt_medium_term: 0.55,
    debt_long_term: 0.65,
    debt_liquid: 0.2,
    hybrid_aggressive: 0.95,
    hybrid_balanced: 0.8,
    gold: 0.55,
    index_large_cap: 0.2,
    unknown: 1.0,
};

export const DISCLAIMER = "Educational diagnostic · Not investment advice · Not a SEBI-registered RIA";

// Phrases banned from any output — hard compliance gate (mirrors tools.py).
export const BANNED_PHRASES = [
    "you should buy", "you should sell", "you should switch", "i recommend", "we recommend",
    "i suggest buying", "i suggest selling", "i suggest switching", "buy this", "sell this",
    "switch to", "invest in", "purchase", "recommend buying", "recommend selling",
];

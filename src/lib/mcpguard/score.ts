// MCPGuard scoring — map findings to an overall risk grade A–F. Faithful port
// of mcpguard/score.py.
import { type Finding, type Severity, SEVERITIES } from "./rules";

const WEIGHTS: Record<Severity, number> = { critical: 10, high: 5, medium: 2, low: 1 };

const GRADE_THRESHOLDS: [number, string][] = [
    [0, "A"],
    [5, "B"],
    [15, "C"],
    [30, "D"],
    [50, "E"],
];

export function grade(findings: Finding[]): string {
    const score = findings.reduce((acc, f) => acc + (WEIGHTS[f.severity] ?? 0), 0);
    for (const [threshold, g] of GRADE_THRESHOLDS) {
        if (score <= threshold) return g;
    }
    return "F";
}

export interface Summary {
    total: number;
    bySeverity: Record<Severity, number>;
    grade: string;
    hasCriticalOrHigh: boolean;
}

export function summary(findings: Finding[]): Summary {
    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 } as Record<Severity, number>;
    for (const f of findings) {
        if (SEVERITIES.includes(f.severity)) bySeverity[f.severity] += 1;
    }
    return {
        total: findings.length,
        bySeverity,
        grade: grade(findings),
        hasCriticalOrHigh: findings.some((f) => f.severity === "critical" || f.severity === "high"),
    };
}

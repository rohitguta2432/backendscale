import type { TestResult } from '@/types/k6';

export const k6Scenarios: TestResult[] = [
    {
        scenario: "Ramping Load",
        vus: 500,
        duration: "5m",
        requests: 150000,
        rps: 2500,
        p95: 24.3,
        p99: 48.1,
        errorRate: 0.08,
    },
    {
        scenario: "Soak Test",
        vus: 200,
        duration: "30m",
        requests: 360000,
        rps: 1200,
        p95: 22.1,
        p99: 42.7,
        errorRate: 0.04,
    },
    {
        scenario: "Spike Test",
        vus: 1000,
        duration: "2m",
        requests: 120000,
        rps: 4000,
        p95: 67.8,
        p99: 123.4,
        errorRate: 1.2,
    },
];

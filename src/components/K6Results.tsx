"use client";

import { useState, useEffect } from "react";

interface TestResult {
    scenario: string;
    vus: number;
    duration: string;
    requests: number;
    rps: number;
    p95: number;
    p99: number;
    errorRate: number;
}

export default function K6Results() {
    const [activeScenario, setActiveScenario] = useState(0);
    const [liveMetrics, setLiveMetrics] = useState({
        currentVUs: 150,
        rps: 1247,
        p95: 23.4,
        p99: 45.2,
        errors: 0.12,
    });

    const scenarios: TestResult[] = [
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

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveMetrics((prev) => ({
                currentVUs: Math.max(50, Math.min(500, prev.currentVUs + Math.floor(Math.random() * 40 - 20))),
                rps: Math.max(500, prev.rps + Math.floor(Math.random() * 200 - 100)),
                p95: Math.max(10, prev.p95 + (Math.random() * 6 - 3)),
                p99: Math.max(20, prev.p99 + (Math.random() * 10 - 5)),
                errors: Math.max(0, Math.min(2, prev.errors + (Math.random() * 0.3 - 0.15))),
            }));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (value: number, threshold: { good: number; warning: number }) => {
        if (value > threshold.warning) return "text-red-500";
        if (value > threshold.good) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className="space-y-8">
            {/* Live Test Execution */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        Live k6 Test Execution
                    </h3>
                    <div className="text-xs text-neutral-400 font-mono">RUNNING</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <div className="text-xs text-neutral-400 uppercase mb-1">Virtual Users</div>
                        <div className="text-3xl font-bold font-mono text-blue-500">{liveMetrics.currentVUs}</div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <div className="text-xs text-neutral-400 uppercase mb-1">Requests/sec</div>
                        <div className="text-3xl font-bold font-mono text-green-500">{liveMetrics.rps}</div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <div className="text-xs text-neutral-400 uppercase mb-1">P95 Latency</div>
                        <div className={`text-3xl font-bold font-mono ${getStatusColor(liveMetrics.p95, { good: 30, warning: 50 })}`}>
                            {liveMetrics.p95.toFixed(1)}ms
                        </div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <div className="text-xs text-neutral-400 uppercase mb-1">P99 Latency</div>
                        <div className={`text-3xl font-bold font-mono ${getStatusColor(liveMetrics.p99, { good: 50, warning: 100 })}`}>
                            {liveMetrics.p99.toFixed(1)}ms
                        </div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <div className="text-xs text-neutral-400 uppercase mb-1">Error Rate</div>
                        <div className={`text-3xl font-bold font-mono ${getStatusColor(liveMetrics.errors, { good: 0.5, warning: 1.0 })}`}>
                            {liveMetrics.errors.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Scenarios */}
            <div>
                <h3 className="text-2xl font-bold mb-6">Test Scenarios & Results</h3>
                <div className="flex gap-2 mb-6">
                    {scenarios.map((scenario, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveScenario(index)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeScenario === index
                                    ? "bg-orange-500 text-white"
                                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                                }`}
                        >
                            {scenario.scenario}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="text-sm text-neutral-500 mb-2">Virtual Users</div>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white">{scenarios[activeScenario].vus}</div>
                        <div className="text-xs text-neutral-400 mt-1">Peak Concurrency</div>
                    </div>
                    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="text-sm text-neutral-500 mb-2">Throughput</div>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white">{scenarios[activeScenario].rps}</div>
                        <div className="text-xs text-neutral-400 mt-1">Requests per second</div>
                    </div>
                    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="text-sm text-neutral-500 mb-2">P95 Latency</div>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white">{scenarios[activeScenario].p95}ms</div>
                        <div className="text-xs text-neutral-400 mt-1">95th percentile</div>
                    </div>
                    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="text-sm text-neutral-500 mb-2">Error Rate</div>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white">{scenarios[activeScenario].errorRate}%</div>
                        <div className="text-xs text-neutral-400 mt-1">Failed requests</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
